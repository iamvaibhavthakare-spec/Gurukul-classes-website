const DEFAULT_YOUTUBE_CHANNEL_VIDEOS_URL =
  "https://www.youtube.com/@gurukulscienceclasses1866/videos";
const YOUTUBE_CHANNEL_VIDEOS_URL =
  process.env.YOUTUBE_CHANNEL_VIDEOS_URL?.trim() ||
  DEFAULT_YOUTUBE_CHANNEL_VIDEOS_URL;
const YOUTUBE_FEED_URL_PREFIX =
  "https://www.youtube.com/feeds/videos.xml?channel_id=";
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_PAGE_FETCHES = 100;
const MAX_LIMIT = 500;

let cachedUploads = null;
let cachedAt = 0;

function decodeHtmlEntities(value) {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function extractInitialData(html) {
  const markers = ["var ytInitialData = ", "ytInitialData = "];

  for (const marker of markers) {
    const start = html.indexOf(marker);
    if (start === -1) {
      continue;
    }

    const end = html.indexOf(";</script>", start);
    if (end === -1) {
      continue;
    }

    const jsonText = html.slice(start + marker.length, end).trim();

    try {
      return JSON.parse(jsonText);
    } catch {
      // Try the next marker if the page shape changed.
    }
  }

  return null;
}

function extractMatch(source, pattern) {
  const match = source.match(pattern);
  return match?.[1] || null;
}

function extractChannelId(initialData, html) {
  const serviceParams =
    initialData?.responseContext?.serviceTrackingParams || [];

  for (const entry of serviceParams) {
    const browseId = entry?.params?.find(
      (param) => param.key === "browse_id",
    )?.value;
    if (browseId) {
      return browseId;
    }
  }

  return (
    extractMatch(html, /"browseId":"(UC[a-zA-Z0-9_-]+)"/) ||
    extractMatch(html, /"externalId":"(UC[a-zA-Z0-9_-]+)"/) ||
    extractMatch(html, /"browse_id","value":"(UC[a-zA-Z0-9_-]+)"/)
  );
}

function extractClientConfig(html, initialData) {
  const apiKey =
    extractMatch(html, /"INNERTUBE_API_KEY":"([^"]+)"/) ||
    extractMatch(html, /INNERTUBE_API_KEY\\":\\"([^\\"]+)\\"/);
  const clientName = Number(
    extractMatch(html, /"INNERTUBE_CONTEXT_CLIENT_NAME":([0-9]+)/) ||
      extractMatch(html, /INNERTUBE_CONTEXT_CLIENT_NAME\\":([0-9]+)/) ||
      1,
  );
  const clientVersion =
    extractMatch(html, /"INNERTUBE_CONTEXT_CLIENT_VERSION":"([^"]+)"/) ||
    extractMatch(html, /INNERTUBE_CONTEXT_CLIENT_VERSION\\":\\"([^\\"]+)\\"/);
  const visitorData = initialData?.responseContext?.visitorData || null;

  return { apiKey, clientName, clientVersion, visitorData };
}

function collectLockupViewModels(node, items = []) {
  if (!node || typeof node !== "object") {
    return items;
  }

  if (Array.isArray(node)) {
    for (const child of node) {
      collectLockupViewModels(child, items);
    }
    return items;
  }

  if (node.richItemRenderer?.content?.lockupViewModel) {
    items.push(node.richItemRenderer.content.lockupViewModel);
  }

  for (const value of Object.values(node)) {
    collectLockupViewModels(value, items);
  }

  return items;
}

function collectContinuationTokens(node, items = []) {
  if (!node || typeof node !== "object") {
    return items;
  }

  if (Array.isArray(node)) {
    for (const child of node) {
      collectContinuationTokens(child, items);
    }
    return items;
  }

  const token =
    node.continuationEndpoint?.continuationCommand?.token ||
    node.continuationItemRenderer?.continuationEndpoint?.continuationCommand
      ?.token;

  if (token) {
    items.push(token);
  }

  for (const value of Object.values(node)) {
    collectContinuationTokens(value, items);
  }

  return items;
}

function selectBestThumbnail(sources) {
  if (!Array.isArray(sources) || sources.length === 0) {
    return "";
  }

  return (
    sources.reduce((best, current) => {
      if (!best) {
        return current;
      }
      return (current?.width || 0) > (best?.width || 0) ? current : best;
    }, null)?.url || ""
  );
}

function findDurationText(node) {
  if (!node || typeof node !== "object") {
    return null;
  }

  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findDurationText(child);
      if (found) {
        return found;
      }
    }
    return null;
  }

  if (
    typeof node.text === "string" &&
    /^\d{1,2}:\d{2}(?::\d{2})?$/.test(node.text.trim())
  ) {
    return node.text.trim();
  }

  for (const value of Object.values(node)) {
    const found = findDurationText(value);
    if (found) {
      return found;
    }
  }

  return null;
}

function buildMetadataText(lockupViewModel) {
  const rows =
    lockupViewModel?.metadata?.lockupMetadataViewModel?.metadata
      ?.contentMetadataViewModel?.metadataRows || [];

  const parts = [];
  for (const row of rows) {
    for (const part of row?.metadataParts || []) {
      const text = part?.text?.content || part?.accessibilityLabel || "";
      if (text) {
        parts.push(text);
      }
    }
  }

  return parts.join(" | ");
}

function mapLockupViewModel(lockupViewModel) {
  const videoId = lockupViewModel?.contentId;
  const contentType = lockupViewModel?.contentType || "";

  if (
    !videoId ||
    (contentType && contentType !== "LOCKUP_CONTENT_TYPE_VIDEO")
  ) {
    return null;
  }

  return {
    videoId,
    title:
      lockupViewModel?.metadata?.lockupMetadataViewModel?.title?.content ||
      "Untitled video",
    thumbnailUrl: selectBestThumbnail(
      lockupViewModel?.contentImage?.thumbnailViewModel?.image?.sources || [],
    ),
    durationText: findDurationText(
      lockupViewModel?.contentImage?.thumbnailViewModel?.overlays,
    ),
    metadataText: buildMetadataText(lockupViewModel),
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

function parseFeedXml(xml) {
  const uploads = [];
  const entryPattern = /<entry>([\s\S]*?)<\/entry>/g;

  for (const match of xml.matchAll(entryPattern)) {
    const entry = match[1];
    const videoId = extractMatch(entry, /<yt:videoId>([\s\S]*?)<\/yt:videoId>/);

    if (!videoId) {
      continue;
    }

    const title = decodeHtmlEntities(
      extractMatch(entry, /<title>([\s\S]*?)<\/title>/) || "Untitled video",
    );
    const published = decodeHtmlEntities(
      extractMatch(entry, /<published>([\s\S]*?)<\/published>/) || "",
    );
    const author = decodeHtmlEntities(
      extractMatch(entry, /<name>([\s\S]*?)<\/name>/) || "",
    );
    const thumbnailUrl =
      extractMatch(entry, /<media:thumbnail[^>]*url="([^"]+)"/) ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    const metadataBits = [];
    if (author) {
      metadataBits.push(author);
    }
    if (published) {
      metadataBits.push(`Published ${published}`);
    }

    uploads.push({
      videoId,
      title,
      thumbnailUrl,
      durationText: null,
      metadataText: metadataBits.join(" | "),
      watchUrl:
        extractMatch(entry, /<link[^>]*href="([^"]+)"/) ||
        `https://www.youtube.com/watch?v=${videoId}`,
    });
  }

  return uploads;
}

async function fetchYoutubeHtml() {
  const response = await fetch(YOUTUBE_CHANNEL_VIDEOS_URL, {
    headers: {
      "user-agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load YouTube channel page (${response.status}).`,
    );
  }

  return response.text();
}

async function fetchYoutubeContinuation({
  apiKey,
  clientName,
  clientVersion,
  visitorData,
  token,
}) {
  const response = await fetch(
    `https://www.youtube.com/youtubei/v1/browse?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0",
        "x-youtube-client-name": String(clientName),
        "x-youtube-client-version": clientVersion,
        ...(visitorData ? { "x-goog-visitor-id": visitorData } : {}),
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName,
            clientVersion,
            hl: "en",
            gl: "IN",
            ...(visitorData ? { visitorData } : {}),
          },
        },
        continuation: token,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load YouTube continuation (${response.status}).`,
    );
  }

  return response.json();
}

async function loadUploadsFromYoutube() {
  const html = await fetchYoutubeHtml();
  const initialData = extractInitialData(html);
  const clientConfig = extractClientConfig(html, initialData);

  if (!clientConfig.apiKey || !clientConfig.clientVersion) {
    throw new Error("Missing YouTube client configuration.");
  }

  const uploads = [];
  const seenVideoIds = new Set();
  const tokenQueue = [];
  const seenTokens = new Set();

  const enqueueUploads = (source) => {
    for (const lockupViewModel of collectLockupViewModels(source)) {
      const upload = mapLockupViewModel(lockupViewModel);
      if (!upload || seenVideoIds.has(upload.videoId)) {
        continue;
      }
      seenVideoIds.add(upload.videoId);
      uploads.push(upload);
    }
  };

  const enqueueTokens = (source) => {
    for (const token of collectContinuationTokens(source)) {
      if (seenTokens.has(token)) {
        continue;
      }
      seenTokens.add(token);
      tokenQueue.push(token);
    }
  };

  enqueueUploads(initialData);
  enqueueTokens(initialData);

  let pagesFetched = 0;
  while (tokenQueue.length > 0 && pagesFetched < MAX_PAGE_FETCHES) {
    const token = tokenQueue.shift();
    pagesFetched += 1;
    const responseJson = await fetchYoutubeContinuation({
      apiKey: clientConfig.apiKey,
      clientName: clientConfig.clientName,
      clientVersion: clientConfig.clientVersion,
      visitorData: clientConfig.visitorData,
      token,
    });

    enqueueUploads(responseJson);
    enqueueTokens(responseJson);
  }

  return uploads;
}

async function fetchFallbackUploads() {
  const html = await fetchYoutubeHtml();
  const initialData = extractInitialData(html);
  const channelId = extractChannelId(initialData, html);

  if (!channelId) {
    return [];
  }

  const response = await fetch(`${YOUTUBE_FEED_URL_PREFIX}${channelId}`, {
    headers: {
      "user-agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load YouTube feed (${response.status}).`);
  }

  return parseFeedXml(await response.text());
}

function normalizeLimit(limit) {
  if (limit == null) {
    return Infinity;
  }

  if (!Number.isFinite(limit)) {
    return Infinity;
  }

  return Math.max(1, Math.min(MAX_LIMIT, Math.floor(limit)));
}

function applyLimit(items, limit) {
  return Number.isFinite(limit) ? items.slice(0, limit) : items;
}

export async function loadYoutubeUploads(limit) {
  const safeLimit = normalizeLimit(limit);
  const now = Date.now();

  if (cachedUploads && now - cachedAt < CACHE_TTL_MS) {
    return applyLimit(cachedUploads, safeLimit);
  }

  try {
    let uploads = await loadUploadsFromYoutube();

    if (uploads.length === 0) {
      uploads = await fetchFallbackUploads();
    }

    cachedUploads = uploads;
    cachedAt = now;
    return applyLimit(uploads, safeLimit);
  } catch (error) {
    if (cachedUploads) {
      return applyLimit(cachedUploads, safeLimit);
    }

    throw error;
  }
}

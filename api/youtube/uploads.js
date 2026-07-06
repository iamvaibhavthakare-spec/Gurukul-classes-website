import { loadYoutubeUploads } from "../../backend/src/services/youtubeUploads.js";

function parseLimit(value) {
  if (value == null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return Math.max(1, Math.min(500, Math.floor(parsed)));
}

export default {
  async fetch(request) {
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          Allow: "GET",
        },
      });
    }

    const url = new URL(request.url);
    const limit = parseLimit(url.searchParams.get("limit"));

    try {
      const uploads = await loadYoutubeUploads(limit);
      return new Response(JSON.stringify(uploads), {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      });
    } catch (error) {
      console.error("Failed to load YouTube uploads:", error);
      return new Response(
        JSON.stringify({
          message: "Failed to load YouTube uploads.",
        }),
        {
          status: 500,
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        },
      );
    }
  },
};

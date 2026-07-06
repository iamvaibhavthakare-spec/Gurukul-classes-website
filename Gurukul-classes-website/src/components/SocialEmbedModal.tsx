import { Play, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { safeFetchJson } from "@/lib/api";
import { SITE } from "@/data/site";

export type SocialPlatform = "instagram" | "facebook" | "youtube";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process?: () => void;
      };
    };
  }
}

type SocialEmbedModalProps = {
  platform: SocialPlatform | null;
  onSelectPlatform: (platform: SocialPlatform) => void;
  onClose: () => void;
};

type YoutubeUpload = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  durationText: string | null;
  metadataText: string;
  watchUrl: string;
};

const INSTAGRAM_EMBEDS = [
  "https://www.instagram.com/reel/DXvn_l3k4MG/",
  "https://www.instagram.com/p/DZJxJq3F28V/",
  "https://www.instagram.com/p/DZWnwmjlzuB/",
  "https://www.instagram.com/reel/DWNy8D_EVi3/",
  "https://www.instagram.com/p/DUfDkDVCLZh/",
  "https://www.instagram.com/reel/DUPm0taAjM3/",
  "https://www.instagram.com/p/DXLk0eQDD_E/",
];

const SOCIAL_TABS: Array<{
  platform: SocialPlatform;
  label: string;
}> = [
  { platform: "instagram", label: "Instagram" },
  { platform: "facebook", label: "Facebook" },
  { platform: "youtube", label: "YouTube" },
];

const SOCIAL_CONFIG: Record<
  SocialPlatform,
  {
    title: string;
    kicker: string;
    description: string;
    embedSrc: string;
  }
> = {
  instagram: {
    title: "Instagram Reels & Posts",
    kicker: "Instagram",
    description: "Latest public reels and posts from Gurukul Science Classes.",
    embedSrc: "",
  },
  facebook: {
    title: "Facebook Timeline",
    kicker: "Facebook",
    description: "Official Gurukul Science Classes page feed.",
    embedSrc:
      `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(SITE.socials.facebook)}` +
      "&tabs=timeline&width=560&height=700&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false",
  },
  youtube: {
    title: "YouTube Channel Uploads",
    kicker: "YouTube",
    description: "Recent uploads from the Gurukul Science Classes YouTube videos tab.",
    embedSrc: "",
  },
};

export function SocialEmbedModal({ platform, onSelectPlatform, onClose }: SocialEmbedModalProps) {
  const [youtubeUploads, setYoutubeUploads] = useState<YoutubeUpload[]>([]);
  const [activeYoutubeVideoId, setActiveYoutubeVideoId] = useState<string | null>(null);
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);

  useEffect(() => {
    if (!platform) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [platform, onClose]);

  useEffect(() => {
    if (platform !== "instagram" || typeof document === "undefined") return;

    const scriptId = "instagram-embed-script";
    const runProcess = () => window.instgrm?.Embeds?.process?.();

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      script.src = "https://www.instagram.com/embed.js";
      script.onload = runProcess;
      document.body.appendChild(script);
    } else {
      runProcess();
    }
  }, [platform]);

  useEffect(() => {
    if (platform !== "youtube") {
      return;
    }

    let cancelled = false;
    setYoutubeLoading(true);
    setYoutubeError(null);

    safeFetchJson<YoutubeUpload[]>("/api/youtube/uploads")
      .then((records) => {
        if (cancelled) {
          return;
        }

        const uploads = records || [];
        setYoutubeUploads(uploads);
        setActiveYoutubeVideoId((current) =>
          uploads.some((item) => item.videoId === current) ? current : uploads[0]?.videoId || null,
        );

        if (!records) {
          setYoutubeError("We could not load the latest uploads right now.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setYoutubeLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [platform]);

  if (!platform || typeof document === "undefined") return null;

  const config = SOCIAL_CONFIG[platform];
  const activeYoutubeVideo =
    youtubeUploads.find((item) => item.videoId === activeYoutubeVideoId) ??
    youtubeUploads[0] ??
    null;
  const youtubeVideosTabUrl = `${SITE.socials.youtube}/videos`;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] bg-black/80 p-0"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex h-full w-full items-stretch justify-stretch">
        <div className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 md:px-8 md:py-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                {config.kicker}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-brand-ink">{config.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
              <div className="mt-4 inline-flex rounded-full bg-[#F6F8FA] p-1">
                {SOCIAL_TABS.map(({ platform: tabPlatform, label }) => (
                  <button
                    key={tabPlatform}
                    type="button"
                    onClick={() => onSelectPlatform(tabPlatform)}
                    className={[
                      "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors",
                      tabPlatform === platform
                        ? "bg-[#2563EB] text-white"
                        : "text-brand-ink/60 hover:text-brand-ink",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F6F8FA] text-brand-ink hover:bg-[#EAF1FF] hover:text-[#2563EB]"
              aria-label="Close social embed"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 bg-[#F6F8FA]">
            {platform === "instagram" ? (
              <div className="h-full overflow-y-auto p-4 md:p-6">
                <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#DCE6FF] bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                      Instagram feed
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Showing the latest public reels and posts we can embed directly on the site.
                    </p>
                  </div>
                  <a
                    href={SITE.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Open Instagram profile
                  </a>
                </div>
                <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
                  {INSTAGRAM_EMBEDS.map((src, index) => (
                    <div
                      key={src}
                      className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft"
                    >
                      <blockquote
                        key={src}
                        className="instagram-media m-0 w-full !max-w-none"
                        data-instgrm-permalink={src}
                        data-instgrm-version="14"
                        style={{
                          background: "#fff",
                          border: 0,
                          borderRadius: 0,
                          boxShadow: "none",
                          margin: 0,
                          minWidth: "320px",
                          padding: 0,
                          width: "100%",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : platform === "youtube" ? (
              <div className="h-full overflow-y-auto p-4 md:p-6">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
                      {activeYoutubeVideo ? (
                        <div className="aspect-video">
                          <iframe
                            title={activeYoutubeVideo.title}
                            src={`https://www.youtube.com/embed/${activeYoutubeVideo.videoId}?autoplay=0&rel=0&modestbranding=1`}
                            className="h-full w-full"
                            loading="lazy"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#F6F8FA] to-white px-8 text-center text-sm text-muted-foreground">
                          {youtubeLoading
                            ? "Loading the latest YouTube uploads..."
                            : "Select the YouTube tab to load the latest uploads."}
                        </div>
                      )}
                    </div>

                    {activeYoutubeVideo ? (
                      <div className="rounded-3xl border border-[#DCE6FF] bg-white p-4 shadow-soft">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                          Featured upload
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-brand-ink">
                          {activeYoutubeVideo.title}
                        </h3>
                        {activeYoutubeVideo.metadataText ? (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {activeYoutubeVideo.metadataText}
                          </p>
                        ) : null}
                        <a
                          href={activeYoutubeVideo.watchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
                        >
                          Open on YouTube
                        </a>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-3xl border border-border bg-white p-4 shadow-soft">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                          Latest uploads
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Recent uploads from the channel videos tab.
                        </p>
                      </div>
                      <a
                        href={youtubeVideosTabUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-brand-ink hover:bg-[#F6F8FA]"
                      >
                        Videos tab
                      </a>
                    </div>
                    {youtubeLoading ? (
                      <div className="max-h-[calc(100vh-18rem)] space-y-3 overflow-y-auto pr-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div
                            key={index}
                            className="flex animate-pulse items-start gap-3 rounded-2xl border border-border bg-[#FAFBFF] p-3"
                          >
                            <div className="h-20 w-32 flex-none rounded-xl bg-[#EAF1FF]" />
                            <div className="min-w-0 flex-1 space-y-2 pt-1">
                              <div className="h-3 w-28 rounded-full bg-[#EAF1FF]" />
                              <div className="h-4 w-full rounded-full bg-[#EAF1FF]" />
                              <div className="h-4 w-3/4 rounded-full bg-[#EAF1FF]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : youtubeError ? (
                      <div className="rounded-2xl border border-dashed border-[#DCE6FF] bg-[#FAFBFF] p-5 text-sm text-muted-foreground">
                        <p>{youtubeError}</p>
                        <a
                          href={youtubeVideosTabUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
                        >
                          Open videos tab
                        </a>
                      </div>
                    ) : youtubeUploads.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[#DCE6FF] bg-[#FAFBFF] p-5 text-sm text-muted-foreground">
                        No uploads were found right now.
                        <div className="mt-4">
                          <a
                            href={youtubeVideosTabUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
                          >
                            Open videos tab
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="max-h-[calc(100vh-18rem)] space-y-3 overflow-y-auto pr-1">
                        {youtubeUploads.map((video) => {
                          const selected = video.videoId === activeYoutubeVideo?.videoId;
                          return (
                            <button
                              key={video.videoId}
                              type="button"
                              onClick={() => setActiveYoutubeVideoId(video.videoId)}
                              className={[
                                "flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors",
                                selected
                                  ? "border-[#2563EB] bg-[#EAF1FF]"
                                  : "border-border bg-[#FAFBFF] hover:bg-[#F3F7FF]",
                              ].join(" ")}
                            >
                              <div className="relative h-20 w-32 flex-none overflow-hidden rounded-xl bg-[#EAF1FF]">
                                <img
                                  src={
                                    video.thumbnailUrl ||
                                    `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
                                  }
                                  alt={video.title}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#2563EB] shadow-sm">
                                    <Play className="h-4 w-4 fill-current" />
                                  </div>
                                </div>
                                {video.durationText ? (
                                  <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                                    {video.durationText}
                                  </span>
                                ) : null}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-[#2563EB]">
                                  YouTube Upload
                                </p>
                                <p className="mt-1 text-sm font-semibold leading-6 text-brand-ink">
                                  {video.title}
                                </p>
                                {video.metadataText ? (
                                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                    {video.metadataText}
                                  </p>
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full p-4 md:p-6">
                <div className="h-[calc(100vh-12rem)] min-h-[620px] overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
                  <iframe
                    title={config.title}
                    src={config.embedSrc}
                    className="h-full w-full"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

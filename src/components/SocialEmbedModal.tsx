import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
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
    title: "YouTube Channel Videos",
    kicker: "YouTube",
    description: "Uploads from the Gurukul Science Classes YouTube channel.",
    embedSrc: "",
  },
};

const YOUTUBE_FEED = [
  {
    videoId: "0H8DY7-Ncso",
    title: "Latest Gurukul Short 1",
    published: "2026-06-05T12:30:00+00:00",
  },
  {
    videoId: "pWsVfXppLXc",
    title: "Latest Gurukul Short 2",
    published: "2026-06-04T12:30:06+00:00",
  },
  {
    videoId: "D4QlUy1TWOk",
    title: "Latest Gurukul Short 3",
    published: "2026-06-03T12:30:00+00:00",
  },
  {
    videoId: "xNq0QPMeEUU",
    title: "Latest Gurukul Short 4",
    published: "2026-06-02T00:30:04+00:00",
  },
  {
    videoId: "8xZIj70aQMU",
    title: "Latest Gurukul Short 5",
    published: "2026-06-01T12:30:04+00:00",
  },
  {
    videoId: "i5QwCFxrmLc",
    title: "Latest Gurukul Short 6",
    published: "2026-05-31T12:30:01+00:00",
  },
  {
    videoId: "WZDXIk-aM04",
    title: "Latest Gurukul Short 7",
    published: "2026-05-30T12:30:04+00:00",
  },
  {
    videoId: "WeHxvnW5FEc",
    title: "Latest Gurukul Short 8",
    published: "2026-05-29T12:30:02+00:00",
  },
] as const;

export function SocialEmbedModal({ platform, onSelectPlatform, onClose }: SocialEmbedModalProps) {
  const [activeYoutubeVideoId, setActiveYoutubeVideoId] = useState(YOUTUBE_FEED[0].videoId);

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
    if (platform === "youtube") {
      setActiveYoutubeVideoId((current) =>
        YOUTUBE_FEED.some((item) => item.videoId === current) ? current : YOUTUBE_FEED[0].videoId,
      );
    }
  }, [platform]);

  if (!platform || typeof document === "undefined") return null;

  const config = SOCIAL_CONFIG[platform];
  const activeYoutubeVideo =
    YOUTUBE_FEED.find((item) => item.videoId === activeYoutubeVideoId) ?? YOUTUBE_FEED[0];

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
                    </div>

                    <div className="rounded-3xl border border-[#DCE6FF] bg-white p-4 shadow-soft">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                        Featured upload
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-brand-ink">
                        {activeYoutubeVideo.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Published{" "}
                        {new Date(activeYoutubeVideo.published).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <a
                        href={`https://www.youtube.com/watch?v=${activeYoutubeVideo.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Open on YouTube
                      </a>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border bg-white p-4 shadow-soft">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                          Latest uploads
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Recent Shorts and videos from the channel.
                        </p>
                      </div>
                      <a
                        href={SITE.socials.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-brand-ink hover:bg-[#F6F8FA]"
                      >
                        Channel
                      </a>
                    </div>
                    <div className="max-h-[calc(100vh-18rem)] space-y-3 overflow-y-auto pr-1">
                      {YOUTUBE_FEED.map((video) => {
                        const selected = video.videoId === activeYoutubeVideo.videoId;
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
                                src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                                alt={video.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/10" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#2563EB] shadow-sm">
                                  <span className="ml-0.5 text-xs font-black">▶</span>
                                </div>
                              </div>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold uppercase tracking-widest text-[#2563EB]">
                                YouTube Short
                              </p>
                              <p className="mt-1 text-sm font-semibold leading-6 text-brand-ink">
                                {video.title}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
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

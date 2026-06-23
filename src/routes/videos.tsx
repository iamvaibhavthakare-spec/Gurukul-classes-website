import { Facebook, Instagram, Youtube } from "lucide-react";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { SocialEmbedModal, type SocialPlatform } from "@/components/SocialEmbedModal";

export function Videos() {
  const [platform, setPlatform] = useState<SocialPlatform | null>(null);

  const socialCards = [
    {
      platform: "instagram" as const,
      title: "Instagram",
      description: "Reels, classroom moments and campus updates.",
      Icon: Instagram,
    },
    {
      platform: "facebook" as const,
      title: "Facebook",
      description: "Page timeline, announcements and photo updates.",
      Icon: Facebook,
    },
    {
      platform: "youtube" as const,
      title: "YouTube",
      description: "Channel uploads, lectures and event videos.",
      Icon: Youtube,
    },
  ];

  return (
    <>
      <SocialEmbedModal
        platform={platform}
        onSelectPlatform={setPlatform}
        onClose={() => setPlatform(null)}
      />
      <PageHero
        title="Social Wall"
        subtitle="Open our latest Instagram, Facebook and YouTube updates in a full-screen embed."
        crumbs={[{ label: "Videos" }]}
      />
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-[#2563EB]/20 bg-[#EAF1FF] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">
              Watch Us On
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Latest updates without placeholder videos
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {socialCards.map(({ platform: socialPlatform, title, description, Icon }) => (
              <button
                key={title}
                type="button"
                onClick={() => setPlatform(socialPlatform)}
                className="group rounded-3xl border border-border bg-[#F8FAFF] p-6 text-left shadow-soft transition-all hover:-translate-y-1 hover:border-[#2563EB]/30 hover:shadow-card"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1FF] text-[#2563EB] transition-colors group-hover:bg-[#2563EB] group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                <span className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                  Open full screen
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

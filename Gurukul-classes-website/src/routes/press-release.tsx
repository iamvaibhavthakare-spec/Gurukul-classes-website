import { Newspaper } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import { usePressReleases } from "@/hooks/use-public-content";

export function PressRelease() {
  const { pressReleases } = usePressReleases();
  return (
    <>
      <PageHero
        title="Press & Announcements"
        subtitle="Recent news, awards and updates from our campuses."
        crumbs={[{ label: "Press Release" }]}
      />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="News" title="Latest from Gurukul" />
          <div className="max-w-3xl mx-auto space-y-6">
            {pressReleases.map((item) => (
              <article
                key={item.title}
                className="group flex flex-col md:flex-row gap-6 rounded-2xl border border-border bg-white p-6 md:p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
              >
                <div className="md:w-32 flex md:flex-col items-center md:items-start gap-3 md:gap-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#2563EB]">
                    <Newspaper className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-bold tracking-widest text-[#2563EB] uppercase">
                    {item.date}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-brand-ink group-hover:text-[#2563EB] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{item.excerpt}</p>
                  {item.sourceName && (
                    <p className="mt-3 text-xs font-semibold tracking-widest uppercase text-brand-ink/45">
                      {item.sourceName}
                    </p>
                  )}
                  {item.mediaUrl && (
                    <a
                      href={item.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center rounded-lg bg-[#EAF1FF] px-4 py-2 text-sm font-semibold text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors"
                    >
                      View media
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

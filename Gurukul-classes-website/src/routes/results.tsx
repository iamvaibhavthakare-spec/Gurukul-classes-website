import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import { ResultCard } from "@/components/ResultCard";
import { StatsCounter } from "@/components/StatsCounter";
import { useResults } from "@/hooks/use-public-content";

export function Results() {
  const { results } = useResults();
  const grouped = ["NEET", "JEE", "MH-CET", "HSC"];
  return (
    <>
      <PageHero
        title="Our Results"
        subtitle="A snapshot of recent toppers across NEET, JEE, MH-CET and HSC Science."
        crumbs={[{ label: "Results" }]}
      />
      <StatsCounter />
      <section className="py-16 md:py-24 mt-12 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Toppers" title="Recent Result Showcase" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => (
              <ResultCard
                key={`${result.exam}-${result.name}`}
                result={{
                  name: result.name,
                  exam: result.exam,
                  score: result.score,
                  college: result.college,
                  description: result.college,
                  photo: result.photo,
                }}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#F6F8FA]">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="By Exam" title="Performance highlights" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {grouped.map((group, index) => (
              <div
                key={group}
                className="rounded-2xl border border-border bg-white p-6 shadow-soft text-center"
              >
                <p className="text-xs font-bold tracking-widest text-[#2563EB] uppercase">
                  {group}
                </p>
                <p className="mt-3 text-4xl font-extrabold text-brand-ink">
                  {[97, 92, 95, 89][index]}%
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  students scoring above target percentile
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import { ClipboardCheck, HeartHandshake, School, Sparkles } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import bhagyashreeThakare from "@/assets/bhagyashree-thakare.jpg";

const focusAreas = [
  "Student support and learning consistency",
  "Classroom discipline and attendance follow-up",
  "Parent communication and progress feedback",
  "Foundation batch confidence building",
];

export function BhagyashreeMadamProfile() {
  return (
    <>
      <PageHero
        title="Mrs. Bhagyashree Thakare Profile"
        subtitle="Bhagyashree Vaibhav Thakare, Director at Gurukul Science Classes since 2006."
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Mrs. Bhagyashree Thakare" }]}
      />

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionTitle
              eyebrow="Student Care"
              title="Keeping every learner supported through the year"
              align="left"
            />
            <p className="text-lg leading-relaxed text-muted-foreground">
              Bhagyashree Vaibhav Thakare carries Gurukul's commitment to quality education and true
              guidance for students. Her work focuses on creating a complete learning environment
              where students develop confidence, discipline and academic potential.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              As Director, she supports Gurukul's interactive style of education: vibrant, creative,
              stimulating and challenging coaching that helps students excel in academics while
              growing as individuals.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { Icon: HeartHandshake, label: "Student Support" },
                { Icon: ClipboardCheck, label: "Progress Reviews" },
                { Icon: School, label: "Batch Management" },
                { Icon: Sparkles, label: "Confidence Building" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-white p-5 shadow-soft"
                >
                  <Icon className="h-6 w-6 text-[#2563EB]" />
                  <p className="mt-3 font-bold text-brand-ink">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-[#F6F8FA] shadow-card">
            <div className="flex h-[420px] items-start justify-center bg-[#F2E4D7] p-4">
              <img
                src={bhagyashreeThakare}
                alt="Bhagyashree Vaibhav Thakare"
                className="h-full w-full object-contain object-top"
              />
            </div>
            <div className="border-t border-border bg-white p-5">
              <p className="text-sm font-semibold text-[#2563EB]">Bhagyashree Vaibhav Thakare</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Director, student support and learning culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F6F8FA] py-16">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Support Focus" title="What the profile covers" />
          <div className="grid gap-4 md:grid-cols-2">
            {focusAreas.map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                <p className="font-semibold text-brand-ink">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import { Award, BookOpenCheck, GraduationCap, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import vaibhavThakare from "@/assets/vaibhav-thakare.jpg";

const strengths = [
  "Concept-first science and mathematics mentoring",
  "Board and Entrance exam preparation strategy",
  "Student progress reviews with parents",
  "Batch discipline, test planning and academic counselling",
];

export function VaibhavSirProfile() {
  return (
    <>
      <PageHero
        title="Vaibhav Sir Profile"
        subtitle="Vaibhav Thakare, founder mentor at Gurukul Science Classes."
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Vaibhav Sir" }]}
      />

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-2xl border border-border bg-[#F6F8FA] shadow-card">
            <div className="flex h-[420px] items-start justify-center bg-[#F2E4D7] p-4">
              <img
                src={vaibhavThakare}
                alt="Vaibhav Thakare"
                className="h-full w-full object-contain object-top"
              />
            </div>
            <div className="border-t border-border bg-white p-5">
              <p className="text-sm font-semibold text-[#2563EB]">Vaibhav Thakare</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Founder vision, academic mentoring and student guidance.
              </p>
            </div>
          </div>

          <div>
            <SectionTitle
              eyebrow="Academic Leadership"
              title="Guiding students with clarity, discipline and care"
              align="left"
            />
            <p className="text-lg leading-relaxed text-muted-foreground">
              Vaibhav Thakare built Gurukul with a vision to provide quality education and a
              dependable guide for the student community. His approach blends academic discipline,
              interactive learning and character building so students can grow beyond marks alone.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Gurukul's methodology under his leadership focuses on creativity, challenge and
              consistent result-oriented coaching for students preparing for boards, JEE, NEET and
              MH-CET.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { Icon: BookOpenCheck, label: "Concept Clarity" },
                { Icon: GraduationCap, label: "Exam Strategy" },
                { Icon: Users, label: "Parent Connect" },
                { Icon: Award, label: "Result Focus" },
              ].map(({ Icon, label }) => (
                <div key={label} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                  <Icon className="h-6 w-6 text-[#2563EB]" />
                  <p className="mt-3 font-bold text-brand-ink">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F6F8FA] py-16">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Mentoring Focus" title="What students can expect" />
          <div className="grid gap-4 md:grid-cols-2">
            {strengths.map((item) => (
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

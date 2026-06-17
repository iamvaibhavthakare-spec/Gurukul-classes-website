import { Award, BookOpenCheck, Compass, Heart, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import { AppLink as Link } from "@/components/AppLink";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import { StatsCounter } from "@/components/StatsCounter";
import aboutTeaching from "@/assets/about-teaching.jpg";
import heroClassroom from "@/assets/hero-classroom.jpg";
import bhagyashreeThakare from "@/assets/bhagyashree-thakare.jpg";
import vaibhavThakare from "@/assets/vaibhav-thakare.jpg";


const VALUES = [
  { Icon: Target, title: "Result Driven", text: "Every plan is reverse-engineered from the outcome students aspire to." },
  { Icon: Heart, title: "Student First", text: "Care for individual progress over batch averages." },
  { Icon: ShieldCheck, title: "Integrity", text: "Honest counselling, transparent fees, no false promises." },
  { Icon: Compass, title: "Guidance", text: "Mentors who stay involved beyond the classroom." },
];

export function About() {
  return (
    <>
      <PageHero
        title="About Gurukul"
        subtitle="Where 25+ years of academic excellence meet a future-ready learning experience."
        crumbs={[{ label: "About Us" }]}
      />

      <section className="relative z-10 bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-[#EAF1FF]" />
            <img src={aboutTeaching} alt="Senior faculty teaching" className="relative rounded-2xl shadow-card object-cover w-full h-[480px]" loading="lazy" />
            <div className="absolute -bottom-6 -right-6 hidden md:block rounded-2xl bg-white p-5 shadow-card border border-border">
              <Award className="h-7 w-7 text-[#2563EB]" />
              <p className="mt-2 text-2xl font-extrabold text-brand-ink">10,000+</p>
              <p className="text-xs text-muted-foreground">Successful Students</p>
            </div>
          </div>
          <div>
            <SectionTitle eyebrow="Our Story" title="Built on trust. Powered by results." align="left" />
            <p className="text-muted-foreground leading-relaxed text-lg">
              Gurukul Science Classes is a trusted name for Engineering, Medical, JEE Main and
              Advanced, NEET and MHT-CET preparation. The institute focuses on a positive learning
              environment where students build curiosity, critical thinking and confidence in
              science and technology.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our classrooms combine expert faculty, comprehensive study material, interactive
              learning, regular assessment and conceptual understanding with accessible guidance
              for families across Kalyan and Bhiwandi.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                <Users className="h-6 w-6 text-[#2563EB]" />
                <h4 className="mt-3 font-bold text-brand-ink">Mission</h4>
                <p className="mt-1 text-sm text-muted-foreground">Mentor every student into the institution and career of their choice.</p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                <BookOpenCheck className="h-6 w-6 text-[#2563EB]" />
                <h4 className="mt-3 font-bold text-brand-ink">Vision</h4>
                <p className="mt-1 text-sm text-muted-foreground">Be India's most trusted neighborhood institute for science excellence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsCounter />

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            eyebrow="Leadership"
            title="Founder and Director"
            description="Meet the people behind Gurukul's academic culture and student-first guidance."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                name: "Vaibhav Thakare",
                role: "Founder Mentor",
                image: vaibhavThakare,
                path: "/vaibhav-sir",
                text: "A vision for quality education, interactive learning and result-focused mentoring.",
              },
              {
                name: "Bhagyashree Vaibhav Thakare",
                role: "Director since 2006",
                image: bhagyashreeThakare,
                path: "/bhagyashree-madam",
                text: "Focused on student support, character building and a vibrant learning culture.",
              },
            ].map((person) => (
              <Link
                key={person.name}
                to={person.path}
                className="group grid overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-card sm:grid-cols-[180px_1fr]"
              >
                <div className="flex h-64 items-start justify-center bg-[#F2E4D7] p-3 sm:h-full">
                  <img src={person.image} alt={person.name} className="h-full w-full object-contain object-top" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">{person.role}</p>
                  <h3 className="mt-2 text-2xl font-bold text-brand-ink">{person.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{person.text}</p>
                  <span className="mt-5 inline-flex text-sm font-bold text-[#2563EB]">View profile</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F6F8FA] mt-12">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Our Values" title="The principles that shape every classroom" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ Icon, title, text }) => (
              <div key={title} className="group rounded-2xl border border-border bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#2563EB] transition-transform group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="mt-4 text-lg font-bold text-brand-ink">{title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Faculty" title="Mentors who've seen it all" description="A team of senior IIT-JEE, NEET and MH-CET faculty with decades of result-oriented teaching experience." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Physics Dept.", "Chemistry Dept.", "Mathematics Dept.", "Biology Dept."].map((d, i) => (
              <div key={d} className="rounded-2xl border border-border bg-white p-6 shadow-soft text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#EAF1FF]">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
                    <Sparkles className="h-10 w-10 text-[#2563EB]" />
                  </div>
                </div>
                <h4 className="mt-4 font-bold text-brand-ink">{d}</h4>
                <p className="mt-1 text-xs text-[#2563EB] font-semibold tracking-wider uppercase">{15 + i * 3}+ Years Experience</p>
                <p className="mt-3 text-sm text-muted-foreground">A senior team trained at India's top universities, focused on conceptual clarity and exam strategy.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-20 bg-[#111827] text-white">
        <div className="container relative z-10 mx-auto px-4 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold">Visit a centre. Meet our team. Decide for yourself.</h2>
            <p className="mt-4 text-white/80">Schedule a campus visit or a free counselling session at your nearest branch.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-bold text-white shadow-card hover:bg-[#1D4ED8]">
              Book Counselling
            </Link>
            <Link to="/courses/xi-science" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-brand-ink hover:bg-[#EAF1FF] transition-colors">
              View Programs
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 z-0">
          <img src={heroClassroom} alt="" className="h-full w-full object-cover opacity-20" loading="lazy" />
        </div>
      </section>
    </>
  );
}

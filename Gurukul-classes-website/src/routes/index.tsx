import {
  ArrowRight,
  Award,
  BookOpenCheck,
  CalendarCheck,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  MonitorPlay,
  PlayCircle,
  Quote,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { HeroCarousel } from "@/components/HeroCarousel";
import { StatsCounter } from "@/components/StatsCounter";
import { SectionTitle } from "@/components/SectionTitle";
import { CourseCard } from "@/components/CourseCard";
import { BranchCard } from "@/components/BranchCard";
import { ResultCard } from "@/components/ResultCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { BRANCHES, COURSES, METHODOLOGY, SITE, TESTIMONIALS, WHY_CHOOSE } from "@/data/site";
import { useGalleryImages, useResults } from "@/hooks/use-public-content";
import aboutTeaching from "@/assets/about-teaching.jpg";
import heroClassroom from "@/assets/hero-classroom.jpg";
import heroStudents from "@/assets/hero-students.jpg";
import heroStudy from "@/assets/hero-study.jpg";

const GOAL_CARDS = [
  {
    Icon: BookOpenCheck,
    title: "School Foundation",
    text: "VIII, IX and X batches (SSC) (CBSC) for strong science fundamentals.",
    path: "/courses/x-ssc-cbse",
  },
  {
    Icon: GraduationCap,
    title: "XI & XII Science",
    text: "Board-focused learning with Entrance preparation built in.",
    path: "/courses/xi-science",
  },
  {
    Icon: Target,
    title: "IIT-JEE",
    text: "Concept depth, problem solving and rank-focused practice.",
    path: "/courses/iit-jee",
  },
  {
    Icon: Trophy,
    title: "NEET & MH-CET",
    text: "Structured medical and CET preparation with test discipline.",
    path: "/courses/neet",
  },
];

const LEARNING_FEATURES = [
  {
    Icon: MonitorPlay,
    title: "Live Interactive Sessions",
    text: "Interactive lectures, instant doubt clearing and focused batch attention.",
  },
  {
    Icon: ClipboardCheck,
    title: "Practice and Revision",
    text: "Daily practice, topic tests, mock papers and detailed analysis.",
  },
  {
    Icon: CalendarCheck,
    title: "Consistent mentoring",
    text: "Progress tracking, counselling and parent updates through the year.",
  },
];

export function Home() {
  const { results } = useResults();
  return (
    <>
      {/* 1. Hero */}
      <HeroCarousel />

      {/* 2. Stats */}
      <StatsCounter />

      {/* Goal selection */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF1FF] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#2563EB]">
              <Sparkles className="h-3.5 w-3.5" /> Select your goal
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink md:text-5xl">
              Start with the right preparation path
            </h2>
            <p className="mt-3 text-muted-foreground">
              Choose the course track that matches your class, exam and college ambition.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GOAL_CARDS.map(({ Icon, title, text, path }) => (
              <Link
                key={title}
                to={path}
                className="group rounded-2xl border border-border bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#2563EB] transition-colors group-hover:bg-[#2563EB] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#2563EB]">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Learning experience */}
      <section className="py-16 md:py-20 bg-[#F6F8FA]">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                Why students stay consistent
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-brand-ink md:text-5xl">
                Everything needed for steady exam preparation
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Inspired by modern learning platforms, Gurukul keeps the experience simple: clear
                goals, regular practice and mentors who stay involved.
              </p>
            </div>
            <div className="grid gap-4">
              {LEARNING_FEATURES.map(({ Icon, title, text }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-border bg-white p-5 shadow-soft"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#2563EB]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-ink">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quick enquiry strip */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl border border-[#2563EB]/20 bg-[#F8FAFF] p-0 shadow-soft">
            <div className="rounded-[1.4rem] bg-white p-6 md:p-8 grid md:grid-cols-[1.4fr_1fr] gap-6 items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF1FF] px-3 py-1 text-xs font-bold tracking-widest text-[#2563EB] uppercase">
                  <Sparkles className="h-3 w-3" /> Admissions Open 2026
                </span>
                <h3 className="mt-3 text-2xl md:text-3xl font-bold text-brand-ink">
                  Reserve your seat — limited capacity per batch.
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Speak with our counsellor to find the right program for your goals.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <a
                  href="#enquire"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8]"
                >
                  Enquire Now <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={`tel:${SITE.primaryPhoneRaw}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-brand-ink/10 px-6 py-3 text-sm font-bold text-brand-ink hover:border-[#2563EB] hover:text-[#2563EB]"
                >
                  {SITE.primaryPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. About */}
      <section className="py-16 md:py-24 bg-[#F6F8FA]">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-[#EAF1FF]" />
            <div className="relative grid grid-cols-2 gap-4">
              <img
                src={aboutTeaching}
                alt="Teacher with students"
                className="rounded-2xl shadow-card object-cover h-80 w-full"
                loading="lazy"
              />
              <div className="space-y-4">
                <img
                  src={heroClassroom}
                  alt="Modern classroom"
                  className="rounded-2xl shadow-card object-cover h-36 w-full"
                  loading="lazy"
                />
                <div className="rounded-2xl bg-[#111827] p-6 text-white shadow-card">
                  <Trophy className="h-7 w-7 text-[#93C5FD]" />
                  <p className="mt-3 text-2xl font-extrabold">25+ Years</p>
                  <p className="text-sm text-white/85">of trust</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <SectionTitle
              eyebrow="About Gurukul"
              title="Where science meets serious mentorship"
              align="left"
            />
            <p className="text-muted-foreground leading-relaxed text-lg">
              Gurukul Science Classes is one of Kalyan and Bhiwandi's most trusted coaching
              institutes for IIT-JEE, NEET, MH-CET, and Foundation programs. Built on the belief
              that great teaching changes lives, our faculty has guided generations of students into
              the country's top medical, engineering, and science colleges.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We blend concept-first lectures, daily practice, and a culture of accountability — the
              same rigour that has produced 10,000+ alumni and 6,000+ admits into top colleges.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { Icon: Users, label: "Expert Faculty" },
                { Icon: BookOpenCheck, label: "Concept-First" },
                { Icon: Award, label: "Proven Results" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-white p-4 text-center shadow-soft"
                >
                  <Icon className="mx-auto h-6 w-6 text-[#2563EB]" />
                  <p className="mt-2 text-xs font-semibold text-brand-ink/80">{label}</p>
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:gap-3 transition-all"
            >
              Learn more about us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Courses */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle
            eyebrow="Programs"
            title="Choose Your Path"
            description="From foundation classes to elite Entrance preparation — we've built a program for every stage."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose - zigzag */}
      <section className="py-16 md:py-24 bg-[#F6F8FA]">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Why Gurukul" title="Six reasons families trust us" />
          <div className="grid md:grid-cols-2 gap-6">
            {WHY_CHOOSE.map((w, i) => (
              <div
                key={w.title}
                className="rounded-2xl border border-border bg-white p-6 shadow-soft transition-transform hover:-translate-y-1 hover:shadow-card"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#2563EB]">
                    <span className="text-lg font-extrabold">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-ink">{w.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{w.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Results */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle
            eyebrow="Result Showcase"
            title="Our toppers tell our story"
            description="A handful of recent results from across NEET, JEE, MH-CET and HSC Science."
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, 8).map((r) => (
              <ResultCard
                key={r.name}
                result={{
                  name: r.name,
                  exam: r.exam,
                  score: r.score,
                  college: r.college,
                  description: r.college,
                  photo: r.photo,
                }}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/results"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-bold text-white shadow-card hover:bg-[#1D4ED8]"
            >
              View All Results <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Methodology timeline */}
      <section className="py-16 md:py-24 bg-[#111827] text-white relative overflow-hidden">
        <div className="container relative mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-widest text-white uppercase">
              Methodology
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold">The Gurukul Learning Journey</h2>
            <p className="mt-4 text-white/75">
              Six structured stages that turn ambitious students into top rankers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {METHODOLOGY.map((m) => (
              <div
                key={m.step}
                className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-6 transition-colors hover:bg-white/10"
              >
                <div className="text-5xl font-extrabold text-[#93C5FD]">{m.step}</div>
                <h4 className="mt-3 text-lg font-bold">{m.title}</h4>
                <p className="mt-2 text-sm text-white/70">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Branches */}
      <section className="py-16 md:py-24 bg-[#F6F8FA]">
        <div className="container mx-auto px-4">
          <SectionTitle
            eyebrow="Our Branches"
            title="Five centres across Kalyan & Bhiwandi"
            description="Visit your nearest centre for a counselling session and a free demo lecture."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BRANCHES.map((b) => (
              <BranchCard key={b.slug} branch={b} />
            ))}
          </div>
        </div>
      </section>

      {/* 10. Gallery */}
      <GalleryPreview />

      {/* 11. Demo video */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionTitle
              eyebrow="See the campus"
              title="Step inside a Gurukul classroom"
              align="left"
            />
            <p className="text-muted-foreground leading-relaxed">
              Take a quick tour of our flagship Kalyan centre, meet our faculty and see how a
              regular study day unfolds at Gurukul.
            </p>
            <Link
              to="/videos"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-bold text-white shadow-card hover:bg-[#1D4ED8]"
            >
              Watch All Videos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-card border-4 border-white">
            <img
              src={heroStudy}
              alt="Gurukul campus tour"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-brand-ink/40 flex items-center justify-center">
              <a
                href={SITE.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Gurukul YouTube channel"
                className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2563EB] shadow-card animate-float"
              >
                <PlayCircle className="h-10 w-10 text-white" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Testimonials */}
      <TestimonialsSlider />

      {/* 13. Enquiry CTA */}
      <section id="enquire" className="py-16 md:py-24 bg-[#F6F8FA]">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <SectionTitle
              eyebrow="Get in Touch"
              title="Start your Gurukul journey today"
              align="left"
            />
            <p className="text-muted-foreground leading-relaxed text-lg">
              Tell us a bit about the student — we'll reach out with batch details, fee structure
              and a free counselling slot at your preferred branch.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {BRANCHES.slice(0, 4).map((b) => (
                <div
                  key={b.slug}
                  className="rounded-2xl border border-border bg-white p-4 shadow-soft"
                >
                  <p className="text-xs font-bold tracking-widest text-[#2563EB] uppercase">
                    {b.area}
                  </p>
                  <p className="mt-1 font-bold text-brand-ink">{b.name}</p>
                  <a
                    href={`tel:${b.phoneRaw}`}
                    className="mt-2 text-sm text-muted-foreground hover:text-[#2563EB]"
                  >
                    {b.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
          <EnquiryForm
            title="Admission Enquiry"
            subtitle="We typically respond within 30 minutes during working hours."
          />
        </div>
      </section>

      {/* 14. Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-[#111827] p-10 md:p-14 text-white shadow-card">
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <GraduationCap className="h-10 w-10 text-[#93C5FD]" />
                <h3 className="mt-4 text-3xl md:text-4xl font-extrabold">
                  Your top-college admission begins here.
                </h3>
                <p className="mt-2 text-white/90 max-w-xl">
                  Join the next batch of Gurukul toppers — limited seats available for VIII to XII.
                </p>
              </div>
              <a
                href="#enquire"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-4 text-sm font-extrabold text-brand-ink shadow-soft hover:bg-[#EAF1FF]"
              >
                Apply Now <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function GalleryPreview() {
  const { galleryImages } = useGalleryImages();
  const images = galleryImages.slice(0, 6).map((img) => img.src);
  const captions = galleryImages.slice(0, 6).map((img) => img.caption);
  const sizes = ["row-span-2", "", "", "row-span-2", "", ""];
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="Campus Life" title="A glimpse into Gurukul" />
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] gap-4">
          {images.map((src, i) => (
            <div key={i} className={`relative overflow-hidden rounded-2xl group ${sizes[i] || ""}`}>
              <img
                src={src}
                alt={captions[i] || `Gallery ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:gap-3 transition-all"
          >
            See full gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="py-16 md:py-24 bg-[#F6F8FA]">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="Testimonials" title="What students & parents say" />
        <div className="relative max-w-3xl mx-auto">
          <div className="rounded-3xl bg-white p-8 md:p-12 shadow-card border border-border text-center">
            <Quote className="mx-auto h-10 w-10 text-[#2563EB]/25" />
            <p className="mt-4 text-lg md:text-xl text-brand-ink/90 leading-relaxed italic">
              "{TESTIMONIALS[i].text}"
            </p>
            <div className="mt-6">
              <p className="font-bold text-brand-ink">{TESTIMONIALS[i].name}</p>
              <p className="text-sm text-[#2563EB]">{TESTIMONIALS[i].role}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Testimonial ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-[#2563EB]" : "w-2 bg-brand-ink/20"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

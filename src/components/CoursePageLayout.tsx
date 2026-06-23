import { Check, Phone, Sparkles } from "lucide-react";
import { PageHero } from "./PageHero";
import { EnquiryForm } from "./EnquiryForm";
import { SectionTitle } from "./SectionTitle";
import { CourseCard } from "./CourseCard";
import { COURSES, SITE, type Course } from "@/data/site";

const LIVE_COURSE_DETAILS: Record<string, { duration: string; schedule: string; included: string[] }> = {
  "viii-ssc-cbse": {
    duration: "Academic year foundation program",
    schedule: "Daily two and a half hours of coaching plus homework checking and take-up support",
    included: ["Weekly tests", "Permanent progress reports", "Extra exam-time classes", "Personal attention for students who need support"],
  },
  "ix-ssc-cbse": {
    duration: "Academic year foundation program",
    schedule: "Daily concept lectures with homework checking, practice and test follow-up",
    included: ["Weekly tests", "Progress tracking", "Exam revision classes", "CBSE and SSC board-aligned preparation"],
  },
  "x-ssc-cbse": {
    duration: "Board-year preparation program",
    schedule: "Daily coaching with test practice, answer-paper review and parent progress updates",
    included: ["Weekly tests", "Progress reports", "Extra classes during exams", "Board exam strategy"],
  },
  "xi-science": {
    duration: "Full FYJC Science academic year",
    schedule: "Topic-wise teaching followed by class tests and parent-signature answer review",
    included: ["Weekly tests", "Printed notes", "Specialized teachers for each subject", "Teaching-aided visual tools"],
  },
  "xii-science": {
    duration: "Full board and Entrance-focused academic year",
    schedule: "Board syllabus coverage with regular tests, revision and Entrance-linked practice",
    included: ["Weekly tests", "Printed notes", "Specialized subject faculty", "Permanent progress reports"],
  },
  "mh-cet": {
    duration: "One-year MHT-CET program along with boards",
    schedule: "Entrance topics covered with XI and XII syllabus, plus chapter and weekly cumulative tests",
    included: ["70% Entrance syllabus before XII boards", "20+ final-pattern mock tests", "All-India test series", "DPP and Entrance study material"],
  },
  neet: {
    duration: "Integrated NEET preparation with XI and XII topics",
    schedule: "PCB tests, doubt-solving and weekly cumulative practice through the year",
    included: ["70% Entrance syllabus before XII boards", "20+ final-pattern mock tests", "All-India test series", "DPP and Entrance study material"],
  },
  "iit-jee": {
    duration: "Two-year JEE Main and Advanced program for X passed students",
    schedule: "Basics-to-advanced JEE preparation alongside board examination readiness",
    included: ["XI and XII integrated Entrance coverage", "Chapter-wise test series", "Weekly cumulative tests", "DPP and Entrance study material"],
  },
};

export function CoursePageLayout({ course }: { course: Course }) {
  const Icon = course.icon;
  const others = COURSES.filter((c) => c.slug !== course.slug).slice(0, 4);
  const liveDetails = LIVE_COURSE_DETAILS[course.slug];
  const courseDetails = [
    { title: "Duration", value: course.duration ?? liveDetails?.duration ?? "Full academic year with revision support" },
    { title: "Schedule", value: course.schedule ?? liveDetails?.schedule ?? "Weekly classroom lectures, tests and doubt-solving sessions" },
    { title: "What's Included", value: (course.included ?? liveDetails?.included ?? course.highlights.slice(0, 3)).join(", ") },
  ];
  return (
    <>
      <PageHero
        title={course.title}
        subtitle={course.short}
        crumbs={[{ label: course.category }, { label: course.title }]}
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 grid lg:grid-cols-[1.4fr_1fr] gap-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF1FF] px-4 py-1 text-xs font-semibold tracking-widest text-[#2563EB] uppercase">
              <Sparkles className="h-3.5 w-3.5" /> {course.category} Program
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold"><span className="section-title">Program Overview</span></h2>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">{course.description}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {courseDetails.map((item) => (
                <div key={item.title} className="rounded-2xl border border-[#2563EB]/15 bg-[#F8FAFF] p-5 shadow-soft">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">{item.title}</p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-brand-ink/85">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {course.highlights.map((h) => (
                <div key={h} className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4 shadow-soft">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-[#2563EB]">
                    <Check className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-medium text-brand-ink/85">{h}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-[#2563EB]/20 bg-[#F8FAFF] p-6 md:p-8">
              <h3 className="text-xl font-bold text-brand-ink">Subjects Covered</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.subjects.map((s) => (
                  <span key={s} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-ink shadow-soft">
                    <Icon className="h-4 w-4 text-[#2563EB]" /> {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href={`tel:${SITE.primaryPhoneRaw}`} className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-bold text-white shadow-card hover:bg-[#1D4ED8]">
                <Phone className="h-4 w-4" /> Talk to a Counsellor
              </a>
              <a href="#enquire" className="inline-flex items-center gap-2 rounded-lg border border-[#2563EB] px-6 py-3 text-sm font-bold text-[#2563EB] hover:bg-[#EAF1FF] transition-colors">
                Download Brochure
              </a>
            </div>
          </div>

          <div id="enquire" className="lg:sticky lg:top-28 self-start">
            <EnquiryForm title="Enquire About This Course" subtitle={`Get details on fees, batches & syllabus for ${course.title}.`} />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F6F8FA]">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Explore More" title="Other Programs" description="Find the right course for your next academic milestone." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {others.map((c) => <CourseCard key={c.slug} course={c} />)}
          </div>
        </div>
      </section>
    </>
  );
}

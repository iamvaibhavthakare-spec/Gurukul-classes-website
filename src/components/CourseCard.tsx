import { AppLink } from "@/components/AppLink";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Course } from "@/data/site";

const toneIcon: Record<Course["tone"], string> = {
  red: "bg-[#EAF1FF] text-[#2563EB]",
  yellow: "bg-[#FFF7D6] text-[#A16207]",
  orange: "bg-[#FFF1E6] text-[#EA580C]",
  deep: "bg-[#EEF2FF] text-[#4338CA]",
};

export function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;
  return (
    <AppLink
      to={course.path}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-border bg-white p-6 shadow-soft transition-all duration-300",
        "hover:-translate-y-1 hover:border-[#2563EB]/35 hover:shadow-card",
      )}
    >
      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-between">
          <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-105", toneIcon[course.tone])}>
            <Icon className="h-7 w-7" />
          </div>
          <span className="rounded-full bg-[#F6F8FA] px-3 py-1 text-[11px] font-semibold tracking-wide text-brand-ink/65 uppercase">
            {course.category}
          </span>
        </div>
        <h3 className="mt-5 text-xl font-bold text-brand-ink">{course.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{course.short}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {course.subjects.map((s) => (
            <span key={s} className="rounded-full bg-[#F6F8FA] px-2.5 py-1 text-[11px] font-medium text-brand-ink/70">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <span className="text-sm font-semibold text-[#2563EB]">View Details</span>
          <ArrowRight className="h-4 w-4 text-[#2563EB] transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </AppLink>
  );
}

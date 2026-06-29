import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Result {
  name: string;
  exam: string;
  score: string;
  college: string;
  description?: string;
  photo?: string;
}

export function ResultCard({ result, className }: { result: Result; className?: string }) {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-white p-8 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-card md:p-10",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[#2563EB]" />
      <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#EAF1FF] text-[#2563EB] ring-8 ring-[#F8FAFF] transition-transform group-hover:scale-105 md:h-28 md:w-28">
        {result.photo ? (
          <img
            src={result.photo}
            alt={result.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <Award className="h-10 w-10 md:h-12 md:w-12" />
        )}
      </div>
      <h4 className="mt-6 text-xl font-bold text-brand-ink md:text-2xl">{result.name}</h4>
      <p className="text-sm font-semibold tracking-wide text-[#2563EB] uppercase">{result.exam}</p>
      <p className="mt-4 text-3xl font-extrabold leading-tight text-brand-ink md:text-[2.15rem]">
        {result.score}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{result.description || result.college}</p>
    </div>
  );
}

import { Award } from "lucide-react";

interface Result {
  name: string;
  exam: string;
  score: string;
  college: string;
}

export function ResultCard({ result }: { result: Result }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#2563EB]" />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF1FF] text-[#2563EB] transition-transform group-hover:scale-105">
        <Award className="h-7 w-7" />
      </div>
      <h4 className="mt-4 text-lg font-bold text-brand-ink">{result.name}</h4>
      <p className="text-xs font-semibold tracking-wide text-[#2563EB] uppercase">{result.exam}</p>
      <p className="mt-3 text-2xl font-extrabold text-brand-ink">{result.score}</p>
      <p className="mt-1 text-xs text-muted-foreground">{result.college}</p>
    </div>
  );
}

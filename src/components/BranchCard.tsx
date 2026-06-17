import { MapPin, Phone } from "lucide-react";
import type { Branch } from "@/data/site";

export function BranchCard({ branch }: { branch: Branch }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
      <div className="relative">
        {branch.badge && (
          <span className="inline-flex rounded-full bg-[#EAF1FF] px-3 py-0.5 text-[10px] font-bold tracking-widest text-[#2563EB] uppercase">
            {branch.badge}
          </span>
        )}
        <h3 className="mt-3 text-lg font-bold text-brand-ink">{branch.name}</h3>
        <p className="text-xs font-semibold tracking-wide text-[#2563EB] uppercase">{branch.area}</p>
        <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-[#2563EB]" />
          {branch.address}
        </p>
        <a
          href={`tel:${branch.phoneRaw}`}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#EAF1FF] px-4 py-2 text-sm font-semibold text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors"
        >
          <Phone className="h-4 w-4" /> {branch.phone}
        </a>
      </div>
    </div>
  );
}

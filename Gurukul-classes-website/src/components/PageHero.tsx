import { ChevronRight } from "lucide-react";
import { AppLink } from "@/components/AppLink";

interface Crumb {
  label: string;
  to?: string;
}

export function PageHero({
  title,
  subtitle,
  crumbs = [],
}: {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] py-16 text-white md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.32),transparent_34%),linear-gradient(180deg,#111827_0%,#0F172A_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
      <div className="container relative mx-auto px-4 text-center">
        {crumbs.length > 0 && (
          <nav className="mb-4 flex justify-center items-center gap-1 text-xs font-semibold text-white/65">
            <AppLink to="/" className="hover:text-white">
              Home
            </AppLink>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                {c.to ? (
                  <AppLink to={c.to} className="hover:text-white">
                    {c.label}
                  </AppLink>
                ) : (
                  <span className="text-[#93C5FD]">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 mx-auto max-w-2xl text-lg text-white/75">{subtitle}</p>}
      </div>
    </section>
  );
}

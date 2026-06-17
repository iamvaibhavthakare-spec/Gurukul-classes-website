import { useEffect, useRef, useState } from "react";
import { CalendarCheck, GraduationCap, MapPin, Trophy, type LucideIcon } from "lucide-react";
import { STATS } from "@/data/site";

function useCountUp(target: number, start: boolean, duration = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return n;
}

const STAT_ICONS: LucideIcon[] = [Trophy, GraduationCap, CalendarCheck, MapPin];

function StatItem({
  value,
  suffix,
  label,
  start,
  Icon,
}: {
  value: number;
  suffix: string;
  label: string;
  start: boolean;
  Icon: LucideIcon;
}) {
  const n = useCountUp(value, start);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-4 text-left shadow-soft">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-[#2563EB]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-3xl font-extrabold leading-none text-[#2563EB] md:text-4xl">
          <span>{n.toLocaleString()}</span>
          <span>{suffix}</span>
        </div>
        <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-brand-ink/65 md:text-xs">{label}</div>
      </div>
    </div>
  );
}

export function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStart(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} className="relative -mt-10 z-20">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border border-border bg-white p-3 shadow-card md:p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, index) => (
              <StatItem key={s.label} {...s} start={start} Icon={STAT_ICONS[index]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

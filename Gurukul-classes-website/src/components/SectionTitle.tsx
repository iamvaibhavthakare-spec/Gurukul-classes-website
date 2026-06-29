import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-12 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/20 bg-[#EAF1FF] px-4 py-1 text-xs font-semibold tracking-widest text-[#2563EB] uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
        <span className="section-title">{title}</span>
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

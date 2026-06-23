import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { BRANCH_OPTIONS, COURSE_OPTIONS, SITE, WHATSAPP_FORMAL_MESSAGE } from "@/data/site";
import { cn } from "@/lib/utils";

type Variant = "enquiry" | "contact" | "career";

interface Props {
  variant?: Variant;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function EnquiryForm({ variant = "enquiry", className, title, subtitle }: Props) {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const obj: Record<string, string> = {};
    data.forEach((v, k) => {
      if (typeof v === "string" && v) obj[k] = v;
    });

    if (!obj.phone || obj.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    const lines = Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join("\n");
    const body = encodeURIComponent(
      `${WHATSAPP_FORMAL_MESSAGE}\n\nNew ${variant} request from website:\n\n${lines}`,
    );
    const subject = encodeURIComponent(`${variant.toUpperCase()} — ${obj.name || obj.studentName || "Website"}`);

    // Open WhatsApp in a new tab as the primary channel
    window.open(
      `https://wa.me/${SITE.whatsapp}?text=${body}`,
      "_blank",
      "noopener,noreferrer",
    );
    // Mailto fallback
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      toast.success("Thank you! Your details have been sent — we'll reach out shortly.");
      (e.target as HTMLFormElement).reset();
      setLoading(false);
    }, 600);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "rounded-2xl border border-border bg-white p-6 md:p-8 shadow-card",
        className,
      )}
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="text-2xl font-bold text-brand-ink">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {variant === "enquiry" ? (
          <>
            <Field name="studentName" label="Student Name" required />
            <Field name="parentName" label="Parent Name" required />
          </>
        ) : (
          <Field name="name" label="Full Name" required />
        )}
        <Field name="phone" type="tel" label="Phone Number" required />
        {variant !== "enquiry" && <Field name="email" type="email" label="Email" required />}

        {variant === "career" ? (
          <>
            <Field name="expertise" label="Subject Expertise" required />
            <Field name="experience" label="Years of Experience" required />
            <div className="sm:col-span-2">
              <FileField name="resume" label="Upload Resume (PDF/DOC)" />
            </div>
          </>
        ) : (
          <>
            <SelectField name="course" label="Course Interested" options={COURSE_OPTIONS} />
            <SelectField name="branch" label="Preferred Branch" options={BRANCH_OPTIONS} />
          </>
        )}

        <div className="sm:col-span-2">
          <TextareaField name="message" label="Message" rows={3} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-bold text-white shadow-card transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
      >
        {loading ? "Sending…" : "Submit Enquiry"}
        <Send className="h-4 w-4" />
      </button>
      <p className="mt-3 text-xs text-center text-muted-foreground">
        By submitting, you agree to be contacted via phone, WhatsApp or email.
      </p>
    </form>
  );
}

function Field({
  name, label, type = "text", required,
}: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-brand-ink/70 uppercase tracking-wide">
        {label} {required && <span className="text-[#2563EB]">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={120}
        className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
      />
    </label>
  );
}

function FileField({ name, label }: { name: string; label: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-brand-ink/70 uppercase tracking-wide">{label}</span>
      <input
        name={name}
        type="file"
        accept=".pdf,.doc,.docx"
        className="mt-1 w-full rounded-xl border border-dashed border-border bg-[#F6F8FA] px-4 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#2563EB] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
      />
    </label>
  );
}

function SelectField({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-brand-ink/70 uppercase tracking-wide">{label}</span>
      <select
        name={name}
        className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({ name, label, rows = 3 }: { name: string; label: string; rows?: number }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-brand-ink/70 uppercase tracking-wide">{label}</span>
      <textarea
        name={name}
        rows={rows}
        maxLength={800}
        className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
      />
    </label>
  );
}

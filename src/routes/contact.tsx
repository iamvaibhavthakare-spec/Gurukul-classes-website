import { ClipboardCheck, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import { BranchCard } from "@/components/BranchCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { BRANCHES, SITE } from "@/data/site";

const CONTENT_CHECKLIST = [
  { item: "Logo and favicon", status: "Available", note: "High-res logo and favicon assets are added." },
  { item: "Brand colours", status: "Available", note: "Current palette uses ink, white, light blue and primary blue." },
  { item: "Main enquiry email and WhatsApp", status: "Available", note: `${SITE.email} / +${SITE.whatsapp}` },
  { item: "Requested pages", status: "Available", note: "Home, About, profiles, School, College, Entrance, Updates, Blog, Career and Contact are built." },
  { item: "Course details", status: "Available", note: "Each course page shows overview, duration, schedule and inclusions." },
  { item: "Founder and director photos", status: "Pending", note: "Profile pages are ready; replace placeholders with high-res photos." },
  { item: "Classroom, lab, faculty, event photos", status: "Partial", note: "Base visuals are added; original branch albums are still needed." },
  { item: "Faculty list with photos and bios", status: "Pending", note: "Names, photos and short bios are required." },
  { item: "2024 and 2025 results", status: "Partial", note: "2024 showcase and 2025 placeholders exist; final 2025 data is required." },
  { item: "Testimonials with photos", status: "Partial", note: "9 testimonials are added; student/parent photos are still required." },
  { item: "Press, awards, gallery and PDFs", status: "Partial", note: "Pages exist; clippings, certificate photos and syllabus PDFs are required." },
  { item: "WordPress admin login", status: "Pending", note: "Admin login must be shared privately and is not published on the site." },
  { item: "Social media links", status: "Available", note: "Facebook, Instagram and YouTube links are connected from the live site." },
];

export function Contact() {
  return (
    <>
      <PageHero
        title="Get in Touch"
        subtitle="Reach out to your nearest branch or send us a message - we typically respond within 30 minutes."
        crumbs={[{ label: "Contact Us" }]}
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
          {[
            { Icon: Phone, title: "Call Us", lines: [SITE.primaryPhone, "Mon-Sat, 9 AM - 8 PM"], href: `tel:${SITE.primaryPhoneRaw}` },
            { Icon: Mail, title: "Email Us", lines: [SITE.email, "We reply within a few hours"], href: `mailto:${SITE.email}` },
            { Icon: MapPin, title: "Head Office", lines: ["Sahajanand Chowk, Kalyan (W)", "Visit us - counsellor available"] },
          ].map(({ Icon, title, lines, href }) => (
            <a key={title} href={href} className="group rounded-2xl border border-border bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#2563EB] transition-transform group-hover:scale-105">
                <Icon className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-brand-ink">{title}</h4>
              {lines.map((line) => <p key={line} className="text-sm text-muted-foreground">{line}</p>)}
            </a>
          ))}
        </div>
      </section>

      <section className="py-12 bg-[#F6F8FA]">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Branches" title="Find your nearest centre" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BRANCHES.map((branch) => <BranchCard key={branch.slug} branch={branch} />)}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <SectionTitle eyebrow="Send a Message" title="We'd love to hear from you" align="left" />
            <p className="text-muted-foreground leading-relaxed">
              Whether you're exploring courses, want to book a free demo, or simply have a question
              about admissions - drop us a message and our team will get back to you the same day.
            </p>
            <div className="mt-6 rounded-2xl bg-[#EAF1FF] p-4 text-sm text-brand-ink/80">
              <strong className="text-[#2563EB]">Tip:</strong> Mention the student's current class and the
              programme of interest - we can prepare a tailored response.
            </div>
          </div>
          <EnquiryForm variant="contact" title="Contact Form" />
        </div>
      </section>

      <section className="bg-[#F6F8FA] py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            eyebrow="Website Content"
            title="Information checklist"
            description="A live status of the items required to fully complete the Gurukul website content."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CONTENT_CHECKLIST.map((row) => (
              <div key={row.item} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <ClipboardCheck className="mt-0.5 h-5 w-5 text-[#2563EB]" />
                  <span className="rounded-full bg-[#EAF1FF] px-3 py-1 text-xs font-bold text-[#2563EB]">
                    {row.status}
                  </span>
                </div>
                <h3 className="mt-4 font-bold text-brand-ink">{row.item}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{row.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

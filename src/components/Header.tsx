import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { AppLink } from "@/components/AppLink";
import { Logo } from "./Logo";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";

type NavItem =
  | { label: string; to: string }
  | { label: string; children: { label: string; to: string }[] };

const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "About Us",
    children: [
      { label: "About Gurukul", to: "/about" },
      { label: "Vaibhav Sir Profile", to: "/vaibhav-sir" },
      { label: "Bhagyashree Madam Profile", to: "/bhagyashree-madam" },
    ],
  },
  {
    label: "School",
    children: [
      { label: "VIII SSC / CBSE", to: "/courses/viii-ssc-cbse" },
      { label: "IX SSC / CBSE", to: "/courses/ix-ssc-cbse" },
      { label: "X SSC / CBSE", to: "/courses/x-ssc-cbse" },
    ],
  },
  {
    label: "College",
    children: [
      { label: "XI Science", to: "/courses/xi-science" },
      { label: "XII Science", to: "/courses/xii-science" },
    ],
  },
  {
    label: "Entrance Exams",
    children: [
      { label: "MH-CET", to: "/courses/mh-cet" },
      { label: "NEET", to: "/courses/neet" },
      { label: "IIT-JEE", to: "/courses/iit-jee" },
    ],
  },
  {
    label: "Updates",
    children: [
      { label: "Results", to: "/results" },
      { label: "Gallery", to: "/gallery" },
      { label: "Press Release", to: "/press-release" },
      { label: "Videos", to: "/videos" },
    ],
  },
  { label: "Career", to: "/career" },
  { label: "Contact Us", to: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top contact strip */}
      <div className="hidden md:block bg-gradient-dark text-white text-xs">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6 opacity-90">
            <a href={`tel:${SITE.primaryPhoneRaw}`} className="flex items-center gap-2 hover:text-brand-yellow transition-colors">
              <Phone className="h-3.5 w-3.5" /> {SITE.primaryPhone}
            </a>
            <a href={`mailto:${SITE.email}`} className="hover:text-brand-yellow transition-colors">
              {SITE.email}
            </a>
            <span>5 Branches across Kalyan & Bhiwandi</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-brand px-3 py-0.5 text-[11px] font-bold tracking-wide animate-shine bg-[length:200%_100%]">
              ★ Admissions Open 2026
            </span>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled ? "bg-white/90 backdrop-blur-xl shadow-soft" : "bg-white",
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {NAV.map((item) =>
              "to" in item ? (
                <AppLink
                  key={item.label}
                  to={item.to}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-brand-ink/80 hover:text-brand-red hover:bg-brand-light transition-colors"
                  activeProps={{ className: "text-brand-red bg-brand-light" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </AppLink>
              ) : (
                <div key={item.label} className="group relative">
                  <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-brand-ink/80 hover:text-brand-red hover:bg-brand-light transition-colors">
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute left-0 top-full pt-2 hidden group-hover:block min-w-[220px]">
                    <div className="rounded-xl border border-border bg-white p-2 shadow-card">
                      {item.children.map((c) => (
                        <AppLink
                          key={c.to}
                          to={c.to}
                          className="block rounded-md px-3 py-2 text-sm text-brand-ink/80 hover:bg-brand-light hover:text-brand-red"
                          activeProps={{ className: "bg-brand-light text-brand-red" }}
                        >
                          {c.label}
                        </AppLink>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${SITE.primaryPhoneRaw}`}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow btn-shine"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#25D366] px-4 py-2 text-sm font-semibold text-[#1f9c52] hover:bg-[#25D366] hover:text-white transition-colors"
            >
              WhatsApp
            </a>
            <button
              onClick={() => setOpenMobile((v) => !v)}
              className="xl:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-brand-ink"
              aria-label="Toggle menu"
            >
              {openMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {openMobile && (
          <div className="xl:hidden border-t border-border bg-white">
            <div className="container mx-auto px-4 py-3 space-y-1 max-h-[75vh] overflow-y-auto">
              {NAV.map((item) =>
                "to" in item ? (
                  <AppLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpenMobile(false)}
                    className="block rounded-md px-3 py-2 font-semibold text-brand-ink/90 hover:bg-brand-light hover:text-brand-red"
                  >
                    {item.label}
                  </AppLink>
                ) : (
                  <div key={item.label}>
                    <button
                      onClick={() =>
                        setOpenMobileDropdown((p) => (p === item.label ? null : item.label))
                      }
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 font-semibold text-brand-ink/90 hover:bg-brand-light"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openMobileDropdown === item.label && "rotate-180",
                        )}
                      />
                    </button>
                    {openMobileDropdown === item.label && (
                      <div className="ml-3 mt-1 space-y-1 border-l-2 border-brand-red/30 pl-3">
                        {item.children.map((c) => (
                          <AppLink
                            key={c.to}
                            to={c.to}
                            onClick={() => setOpenMobile(false)}
                            className="block rounded-md px-3 py-2 text-sm text-brand-ink/80 hover:bg-brand-light hover:text-brand-red"
                          >
                            {c.label}
                          </AppLink>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

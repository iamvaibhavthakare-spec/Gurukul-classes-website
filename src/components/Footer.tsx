import { AppLink } from "@/components/AppLink";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { BRANCHES, SITE } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-gradient-dark text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="bg-white inline-flex rounded-xl p-2">
              <Logo />
            </div>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              India's trusted coaching institute for IIT-JEE, NEET, MH-CET and Foundation
              programs. 10,000+ successful students and counting.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { Icon: Facebook, href: SITE.socials.facebook, label: "Facebook" },
                { Icon: Instagram, href: SITE.socials.instagram, label: "Instagram" },
                { Icon: Youtube, href: SITE.socials.youtube, label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 hover:bg-gradient-brand hover:border-transparent transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                ["About Us", "/about"],
                ["Vaibhav Sir Profile", "/vaibhav-sir"],
                ["Bhagyashree Madam Profile", "/bhagyashree-madam"],
                ["Courses", "/courses/xi-science"],
                ["Results", "/results"],
                ["Gallery", "/gallery"],
                ["Career", "/career"],
                ["Contact", "/contact"],
              ].map(([l, to]) => (
                <li key={to}>
                  <AppLink to={to} className="hover:text-brand-yellow transition-colors">
                    {l}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-bold mb-4">Courses</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                ["IIT-JEE", "/courses/iit-jee"],
                ["NEET", "/courses/neet"],
                ["MH-CET", "/courses/mh-cet"],
                ["XI Science", "/courses/xi-science"],
                ["XII Science", "/courses/xii-science"],
                ["Foundation (VIII–X)", "/courses/x-ssc-cbse"],
              ].map(([l, to]) => (
                <li key={to}>
                  <AppLink to={to} className="hover:text-brand-yellow transition-colors">
                    {l}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-bold mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-brand-yellow" />
                <span>{BRANCHES[0].address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-yellow" />
                <a href={`tel:${SITE.primaryPhoneRaw}`} className="hover:text-brand-yellow">
                  {SITE.primaryPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-yellow" />
                <a href={`mailto:${SITE.email}`} className="hover:text-brand-yellow break-all">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Gurukul Science Classes. All rights reserved.</p>
          <p>Crafted with care for students of Kalyan & Bhiwandi.</p>
        </div>
      </div>
    </footer>
  );
}

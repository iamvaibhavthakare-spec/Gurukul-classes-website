import { MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/data/site";

export function MobileCallBar() {
  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 border-t border-border bg-white shadow-card">
      <a
        href={`tel:${SITE.primaryPhoneRaw}`}
        className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-gradient-brand"
      >
        <Phone className="h-4 w-4" /> Call Now
      </a>
      <a
        href={`https://wa.me/${SITE.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-[#25D366]"
      >
        <MessageCircle className="h-4 w-4" /> WhatsApp
      </a>
    </div>
  );
}
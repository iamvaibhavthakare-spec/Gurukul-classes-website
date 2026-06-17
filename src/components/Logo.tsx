import logo from "@/assets/logo.png";
import { AppLink } from "@/components/AppLink";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <AppLink to="/" className="flex items-center gap-3 group">
      <img
        src={logo}
        alt="Gurukul Science Classes logo"
        width={250}
        height={89}
        className={compact ? "h-11 w-auto" : "h-12 w-auto md:h-14"}
      />
    </AppLink>
  );
}

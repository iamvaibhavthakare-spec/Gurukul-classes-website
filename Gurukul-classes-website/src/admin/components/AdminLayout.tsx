import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Image as ImageIcon,
  ScrollText,
  BookOpenText,
  Award,
} from "lucide-react";
import { AppLink } from "@/components/AppLink";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAdminSession } from "../AdminSession";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Hero Banners", to: "/admin/hero", icon: ImageIcon },
  { label: "Results", to: "/admin/results", icon: Award },
  { label: "Gallery", to: "/admin/gallery", icon: ImageIcon },
  { label: "Press Releases", to: "/admin/press-releases", icon: ScrollText },
  { label: "Blogs", to: "/admin/blogs", icon: BookOpenText },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="space-y-1">
      {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
        <AppLink
          key={to}
          to={to}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/8 hover:text-white"
          activeProps={{ className: "bg-white/10 text-white" }}
        >
          <Icon className="h-4 w-4" />
          {label}
        </AppLink>
      ))}
    </div>
  );
}

export function AdminLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  const { admin, logout } = useAdminSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-slate-950/95 px-5 py-6 lg:flex">
          <div className="mb-8">
            <div className="inline-flex rounded-2xl bg-white px-4 py-2 text-slate-950 shadow-lg">
              <div className="font-bold tracking-tight">Gurukul Admin</div>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.3em] text-slate-400">
              Content control panel
            </p>
          </div>

          <NavList />

          <div className="mt-auto space-y-4">
            <Separator className="bg-white/10" />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Signed in as</p>
              <p className="mt-2 font-semibold">{admin?.name || "Admin"}</p>
              <p className="text-sm text-slate-400">{admin?.email}</p>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white hover:text-slate-950"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
              <div className="flex items-center gap-3">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-white/10 bg-white/5 text-white lg:hidden"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[300px] border-white/10 bg-slate-950 text-white"
                  >
                    <div className="mb-8">
                      <div className="inline-flex rounded-2xl bg-white px-4 py-2 text-slate-950 shadow-lg">
                        <div className="font-bold tracking-tight">Gurukul Admin</div>
                      </div>
                    </div>
                    <NavList onNavigate={() => setMobileOpen(false)} />
                    <Button
                      variant="outline"
                      className="mt-8 w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white hover:text-slate-950"
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </SheetContent>
                </Sheet>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Admin panel</p>
                  <h1 className="text-xl font-bold tracking-tight">{title}</h1>
                </div>
              </div>
              <div className="hidden items-center gap-3 lg:flex">
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  {subtitle || "Manage live site content"}
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                  {admin?.name || "Admin"}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

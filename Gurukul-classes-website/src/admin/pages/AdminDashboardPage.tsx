import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  BookOpenText,
  Image as ImageIcon,
  ScrollText,
  TrendingUp,
} from "lucide-react";
import { AdminLayout } from "../components/AdminLayout";
import { loadDashboard } from "../api";
import type { DashboardResponse, DashboardTotals } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const STAT_CARDS = [
  { key: "results", label: "Total Results", icon: TrendingUp },
  { key: "galleryImages", label: "Gallery Images", icon: ImageIcon },
  { key: "pressReleases", label: "Press Releases", icon: ScrollText },
  { key: "blogs", label: "Blogs", icon: BookOpenText },
  { key: "heroBanners", label: "Hero Banners", icon: BarChart3 },
] as const;

export function AdminDashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadDashboard()
      .then((response) => {
        if (mounted) {
          setData(response);
        }
      })
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Failed to load dashboard"),
      )
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminLayout title="Dashboard" subtitle="Live content summary">
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {STAT_CARDS.map(({ key, label, icon: Icon }) => (
            <Card
              key={key}
              className="border-white/10 bg-white/5 text-white shadow-lg shadow-slate-950/20"
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
                  {loading ? (
                    <Skeleton className="mt-2 h-8 w-20 bg-white/10" />
                  ) : (
                    <p className="mt-2 text-3xl font-extrabold">
                      {data?.totals[key as keyof DashboardTotals] ?? 0}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="border-white/10 bg-white/5 text-white shadow-lg shadow-slate-950/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Updates</CardTitle>
              <p className="mt-1 text-sm text-slate-400">
                Most recent content changes across the website.
              </p>
            </div>
            <Badge variant="secondary" className="bg-sky-500/15 text-sky-200">
              <Bell className="mr-1 h-3.5 w-3.5" />
              Live
            </Badge>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-2xl bg-white/10" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {data?.recentUpdates.map((item) => (
                  <div
                    key={`${item.module}-${item.title}-${item.updatedAt}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                          {item.module}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-white/10 text-white">
                          {item.status}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {new Date(item.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

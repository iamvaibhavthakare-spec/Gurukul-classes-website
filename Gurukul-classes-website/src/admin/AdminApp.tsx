import { useEffect } from "react";
import { navigate } from "@/components/AppLink";
import { AdminSessionProvider, useAdminSession } from "./AdminSession";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminHeroPage } from "./pages/AdminHeroPage";
import { AdminResultsPage } from "./pages/AdminResultsPage";
import { AdminGalleryPage } from "./pages/AdminGalleryPage";
import { AdminPressReleasePage } from "./pages/AdminPressReleasePage";
import { AdminBlogPage } from "./pages/AdminBlogPage";
import { adminPath, normalizeAdminPath, replaceAdminPath } from "./routes";

function AdminRoute() {
  const { admin, ready } = useAdminSession();
  const pathname = window.location.pathname;
  const normalizedPath = normalizeAdminPath(pathname);

  useEffect(() => {
    if (pathname !== normalizedPath) {
      replaceAdminPath(normalizedPath);
      return;
    }

    if (ready && admin && normalizedPath === adminPath("login")) {
      navigate(adminPath());
    }
  }, [ready, admin, pathname, normalizedPath]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300">
          Checking admin session...
        </div>
      </div>
    );
  }

  if (!admin || normalizedPath === adminPath("login")) {
    return <AdminLoginPage />;
  }

  if (normalizedPath === adminPath() || normalizedPath === adminPath("dashboardAlias")) {
    return <AdminDashboardPage />;
  }
  if (normalizedPath === adminPath("hero")) {
    return <AdminHeroPage />;
  }
  if (normalizedPath === adminPath("results")) {
    return <AdminResultsPage />;
  }
  if (normalizedPath === adminPath("gallery")) {
    return <AdminGalleryPage />;
  }
  if (normalizedPath === adminPath("pressReleases")) {
    return <AdminPressReleasePage />;
  }
  if (normalizedPath === adminPath("blogs")) {
    return <AdminBlogPage />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Admin</p>
        <h1 className="mt-3 text-2xl font-extrabold">Page not found</h1>
        <p className="mt-3 text-sm text-slate-400">The requested admin page does not exist.</p>
        <button
          className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950"
          onClick={() => navigate(adminPath())}
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
}

export function AdminApp() {
  return (
    <AdminSessionProvider>
      <AdminRoute />
    </AdminSessionProvider>
  );
}

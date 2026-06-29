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

function AdminRoute() {
  const { admin, ready } = useAdminSession();
  const pathname = window.location.pathname;

  useEffect(() => {
    if (ready && admin && pathname === "/admin/login") {
      navigate("/admin");
    }
  }, [ready, admin, pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300">
          Checking admin session...
        </div>
      </div>
    );
  }

  if (!admin || pathname === "/admin/login") {
    return <AdminLoginPage />;
  }

  if (pathname === "/admin" || pathname === "/admin/dashboard") {
    return <AdminDashboardPage />;
  }
  if (pathname === "/admin/hero") {
    return <AdminHeroPage />;
  }
  if (pathname === "/admin/results") {
    return <AdminResultsPage />;
  }
  if (pathname === "/admin/gallery") {
    return <AdminGalleryPage />;
  }
  if (pathname === "/admin/press-releases") {
    return <AdminPressReleasePage />;
  }
  if (pathname === "/admin/blogs") {
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
          onClick={() => navigate("/admin")}
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

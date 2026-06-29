import { useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BackToTop } from "@/components/BackToTop";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Home } from "@/routes";
import { About } from "@/routes/about";
import { BhagyashreeMadamProfile } from "@/routes/bhagyashree-madam";
import { Career } from "@/routes/career";
import { Contact } from "@/routes/contact";
import { Gallery } from "@/routes/gallery";
import { Blog } from "@/routes/blog";
import { BlogDetailRoute } from "@/routes/blog.detail";
import { PressRelease } from "@/routes/press-release";
import { Results } from "@/routes/results";
import { VaibhavSirProfile } from "@/routes/vaibhav-sir";
import { Videos } from "@/routes/videos";
import { CourseIitJee } from "@/routes/courses.iit-jee";
import { CourseIxSscCbse } from "@/routes/courses.ix-ssc-cbse";
import { CourseMhCet } from "@/routes/courses.mh-cet";
import { CourseNeet } from "@/routes/courses.neet";
import { CourseViiiSscCbse } from "@/routes/courses.viii-ssc-cbse";
import { CourseXSscCbse } from "@/routes/courses.x-ssc-cbse";
import { CourseXiScience } from "@/routes/courses.xi-science";
import { CourseXiiScience } from "@/routes/courses.xii-science";
import { AdminApp } from "@/admin/AdminApp";

const PUBLIC_ROUTES: Record<string, { title: string; Component: () => JSX.Element }> = {
  "/": { title: "Gurukul Science Classes - IIT-JEE, NEET, MH-CET Coaching", Component: Home },
  "/about": { title: "About Us - Gurukul Science Classes", Component: About },
  "/vaibhav-sir": {
    title: "Mr. Vaibhav Thakare Profile - Gurukul Science Classes",
    Component: VaibhavSirProfile,
  },
  "/bhagyashree-madam": {
    title: "Mrs. Bhagyashree Thakare Profile - Gurukul Science Classes",
    Component: BhagyashreeMadamProfile,
  },
  "/career": { title: "Career - Gurukul Science Classes", Component: Career },
  "/contact": { title: "Contact - Gurukul Science Classes", Component: Contact },
  "/gallery": { title: "Gallery - Gurukul Science Classes", Component: Gallery },
  "/blog": { title: "Blog & Insights - Gurukul Science Classes", Component: Blog },
  "/press-release": {
    title: "Press & Announcements - Gurukul Science Classes",
    Component: PressRelease,
  },
  "/results": { title: "Results - Gurukul Science Classes", Component: Results },
  "/videos": { title: "Videos - Gurukul Science Classes", Component: Videos },
  "/courses/iit-jee": { title: "IIT-JEE - Gurukul Science Classes", Component: CourseIitJee },
  "/courses/ix-ssc-cbse": {
    title: "IX SSC / CBSE - Gurukul Science Classes",
    Component: CourseIxSscCbse,
  },
  "/courses/mh-cet": { title: "MH-CET - Gurukul Science Classes", Component: CourseMhCet },
  "/courses/neet": { title: "NEET - Gurukul Science Classes", Component: CourseNeet },
  "/courses/viii-ssc-cbse": {
    title: "VIII SSC / CBSE - Gurukul Science Classes",
    Component: CourseViiiSscCbse,
  },
  "/courses/x-ssc-cbse": {
    title: "X SSC / CBSE - Gurukul Science Classes",
    Component: CourseXSscCbse,
  },
  "/courses/xi-science": {
    title: "XI Science - Gurukul Science Classes",
    Component: CourseXiScience,
  },
  "/courses/xii-science": {
    title: "XII Science - Gurukul Science Classes",
    Component: CourseXiiScience,
  },
};

function resolveRoute(pathname: string) {
  if (pathname.startsWith("/admin")) {
    return {
      title: "Admin Panel - Gurukul Science Classes",
      Component: AdminApp,
      admin: true,
    };
  }

  if (pathname.startsWith("/blog/")) {
    return {
      title: "Blog - Gurukul Science Classes",
      Component: BlogDetailRoute,
      admin: false,
    };
  }

  const route = PUBLIC_ROUTES[pathname];
  return {
    title: route?.title ?? "Page not found - Gurukul Science Classes",
    Component: route?.Component ?? NotFound,
    admin: false,
  };
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    window.addEventListener("app:navigate", update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("app:navigate", update);
    };
  }, []);

  const route = useMemo(() => resolveRoute(path), [path]);
  const Component = route?.Component ?? NotFound;

  useEffect(() => {
    document.title = route?.title ?? "Page not found - Gurukul Science Classes";
  }, [route?.title]);

  if (route.admin) {
    return (
      <>
        <Component />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Component />
        </main>
        <Footer />
      </div>
      <WhatsAppButton />
      <BackToTop />
      <MobileCallBar />
      <Toaster position="top-center" richColors />
    </>
  );
}

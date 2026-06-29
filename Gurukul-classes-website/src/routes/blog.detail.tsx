import { useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { BlogDetailPage } from "@/components/BlogDetailPage";
import { AppLink } from "@/components/AppLink";
import { useBlogPost, useBlogPosts } from "@/hooks/use-public-content";

function getSlugFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[0] === "blog" ? parts[1] || "" : "";
}

export function BlogDetailRoute() {
  const slug = getSlugFromPath();
  const { post, loading } = useBlogPost(slug);
  const { posts } = useBlogPosts();

  useEffect(() => {
    if (loading) {
      return;
    }
    document.title = post?.title
      ? `${post.title} - Gurukul Science Classes`
      : "Blog Not Found - Gurukul Science Classes";
  }, [post?.title, loading]);

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-white p-8 text-center shadow-soft">
            <p className="text-sm font-semibold tracking-widest text-[#2563EB] uppercase">
              Loading article
            </p>
            <p className="mt-3 text-brand-ink/70">
              We are fetching the latest version from the backend.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <>
        <PageHero
          title="Blog Not Found"
          subtitle="The article may have been removed or the slug is incorrect."
          crumbs={[{ label: "Blog", to: "/blog" }, { label: "Not Found" }]}
        />
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              Try returning to the blog listing to open another article.
            </p>
            <AppLink
              to="/blog"
              className="mt-6 inline-flex rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-bold text-white"
            >
              Back to Blog
            </AppLink>
          </div>
        </section>
      </>
    );
  }

  return (
    <BlogDetailPage post={post} relatedPosts={posts.filter((item) => item.slug !== post.slug)} />
  );
}

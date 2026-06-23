import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/AppLink";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import { BLOG_POSTS } from "@/data/blogs";

export function Blog() {
  return (
    <>
      <PageHero
        title="Blog & Insights"
        subtitle="Practical study advice, exam strategy and parent guidance from the Gurukul team."
        crumbs={[{ label: "Blog" }]}
      />

      <section id="blog-top" className="py-16 bg-white">
        <div className="container mx-auto px-4">
      <SectionTitle
        eyebrow="Latest Reads"
        title="Three blog posts built for students and parents"
        description="Pick an article to open the full version with study tips, detailed advice and practical takeaways."
      />

      <div className="grid gap-6 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <AppLink
                key={post.slug}
                to={post.detailPath}
                className="group overflow-hidden rounded-3xl border border-border bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-brand-ink/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-widest text-[#2563EB] uppercase">
                    {post.tag}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-widest text-[#2563EB] uppercase">
                    <span>{post.date}</span>
                    <span className="h-1 w-1 rounded-full bg-[#2563EB]/40" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold leading-tight text-brand-ink transition-colors group-hover:text-[#2563EB]">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#2563EB]">
                    Read article <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </AppLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

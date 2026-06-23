import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { AppLink } from "@/components/AppLink";
import { PageHero } from "@/components/PageHero";
import type { BlogPost } from "@/data/blogs";

type BlogDetailPageProps = {
  post: BlogPost;
  relatedPosts: BlogPost[];
};

export function BlogDetailPage({ post, relatedPosts }: BlogDetailPageProps) {
  return (
    <>
      <PageHero
        title={post.title}
        subtitle={post.summary}
        crumbs={[{ label: "Blog", to: "/blog" }, { label: post.title }]}
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-white shadow-card">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={post.image} alt={post.alt} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/50 via-brand-ink/10 to-transparent" />
              <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-widest text-[#2563EB] uppercase">
                {post.tag}
              </span>
            </div>

            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-widest text-[#2563EB] uppercase">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {post.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {post.readTime}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-brand-ink md:text-5xl">
                {post.title}
              </h1>

              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {post.summary}
              </p>

              <div className="mt-8 space-y-5">
                {post.body.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-[#EAF1FF] p-5 md:p-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#2563EB]">
                  Key takeaways
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {post.highlights.map((item) => (
                    <li
                      key={item}
                      className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-brand-ink shadow-soft"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <AppLink
                  to="/blog"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#2563EB] px-5 py-3 text-sm font-bold text-[#2563EB] hover:bg-[#EAF1FF] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </AppLink>
                <AppLink
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-bold text-white shadow-card hover:bg-[#1D4ED8]"
                >
                  Talk to a Counsellor
                </AppLink>
              </div>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-14">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                    More from Blog
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-brand-ink">
                    Related articles
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {relatedPosts.map((related) => (
                  <AppLink
                    key={related.slug}
                    to={related.detailPath}
                    className="group overflow-hidden rounded-3xl border border-border bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={related.image}
                        alt={related.alt}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-bold tracking-widest text-[#2563EB] uppercase">
                        {related.tag}
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-brand-ink group-hover:text-[#2563EB] transition-colors">
                        {related.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {related.excerpt}
                      </p>
                    </div>
                  </AppLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

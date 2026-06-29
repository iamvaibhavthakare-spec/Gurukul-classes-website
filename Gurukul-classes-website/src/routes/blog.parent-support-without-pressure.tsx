import { BlogDetailPage } from "@/components/BlogDetailPage";
import { BLOG_POSTS } from "@/data/blogs";

export function BlogParentSupportWithoutPressure() {
  const post = BLOG_POSTS[2];
  return (
    <BlogDetailPage
      post={post}
      relatedPosts={BLOG_POSTS.filter((item) => item.slug !== post.slug)}
    />
  );
}

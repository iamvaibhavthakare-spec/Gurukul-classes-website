import { useEffect, useState } from "react";
import { fetchJson, safeFetchJson } from "@/lib/api";
import {
  DEFAULT_BLOG_POSTS,
  DEFAULT_GALLERY_IMAGES,
  DEFAULT_HERO_SLIDES,
  DEFAULT_PRESS_RELEASES,
  DEFAULT_RESULTS,
  mapBlogRecord,
  mapGalleryRecord,
  mapHeroRecord,
  mapPressRecord,
  mapResultRecord,
  type BlogPost,
  type GalleryImage,
  type HeroSlide,
  type PressReleaseItem,
  type PublicResult,
} from "@/lib/content";

async function loadOrFallback<T>(loader: () => Promise<T[] | null>, fallback: T[]) {
  try {
    const records = await loader();
    return records && records.length > 0 ? records : fallback;
  } catch {
    return fallback;
  }
}

export function useHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadOrFallback(
      () =>
        safeFetchJson<
          Array<{
            title: string;
            subtitle?: string | null;
            description: string;
            buttonText: string;
            buttonLink: string;
            backgroundImage: string;
            badge?: string | null;
            status?: string;
            displayOrder?: number;
          }>
        >("/api/hero").then((records) => records?.map(mapHeroRecord) ?? null),
      DEFAULT_HERO_SLIDES,
    )
      .then((items) => {
        if (!cancelled) {
          setSlides(items);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { slides, loading };
}

export function useResults() {
  const [results, setResults] = useState<PublicResult[]>(DEFAULT_RESULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadOrFallback(
      () =>
        safeFetchJson<
          Array<{
            studentName: string;
            examType: string;
            examLabel?: string;
            resultValue: string;
            description?: string | null;
            studentPhoto?: string | null;
            year?: number;
            status?: string;
          }>
        >("/api/results").then((records) => records?.map(mapResultRecord) ?? null),
      DEFAULT_RESULTS,
    )
      .then((items) => {
        if (!cancelled) {
          setResults(items);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { results, loading };
}

export function useGalleryImages() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(DEFAULT_GALLERY_IMAGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadOrFallback(
      () =>
        safeFetchJson<
          Array<{
            title: string;
            image: string;
            category: string;
            description?: string | null;
            status?: string;
          }>
        >("/api/gallery").then((records) => records?.map(mapGalleryRecord) ?? null),
      DEFAULT_GALLERY_IMAGES,
    )
      .then((items) => {
        if (!cancelled) {
          setGalleryImages(items);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { galleryImages, loading };
}

export function usePressReleases() {
  const [pressReleases, setPressReleases] = useState<PressReleaseItem[]>(DEFAULT_PRESS_RELEASES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadOrFallback(
      () =>
        safeFetchJson<
          Array<{
            id: number;
            title: string;
            shortDescription: string;
            fullDescription?: string;
            mediaPath?: string | null;
            mediaType?: string | null;
            releaseDate: string;
            sourceName?: string;
            status?: string;
          }>
        >("/api/press-releases").then((records) => records?.map(mapPressRecord) ?? null),
      DEFAULT_PRESS_RELEASES,
    )
      .then((items) => {
        if (!cancelled) {
          setPressReleases(items);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { pressReleases, loading };
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>(DEFAULT_BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadOrFallback(
      () =>
        safeFetchJson<
          Array<{
            id?: number;
            title: string;
            slug: string;
            shortDescription: string;
            fullContent: string;
            featuredImage: string;
            author: string;
            category: string;
            publishDate: string;
            status?: string;
            metaTitle: string;
            metaDescription: string;
            readTime: string;
            imageAlt: string;
            body?: unknown;
            highlights?: unknown;
          }>
        >("/api/blogs").then((records) => records?.map(mapBlogRecord) ?? null),
      DEFAULT_BLOG_POSTS,
    )
      .then((items) => {
        if (!cancelled) {
          setPosts(items);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading };
}

export function useBlogPost(slug: string | null) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchJson<{
      title: string;
      slug: string;
      shortDescription: string;
      fullContent: string;
      featuredImage: string;
      author: string;
      category: string;
      publishDate: string;
      status?: string;
      metaTitle: string;
      metaDescription: string;
      readTime: string;
      imageAlt: string;
      body?: unknown;
      highlights?: unknown;
    }>(`/api/blogs/${slug}`)
      .then((record) => {
        if (!cancelled) {
          setPost(mapBlogRecord(record));
        }
      })
      .catch(() => {
        const fallback = DEFAULT_BLOG_POSTS.find((item) => item.slug === slug) || null;
        if (!cancelled) {
          setPost(fallback);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { post, loading };
}

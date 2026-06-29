import { format, parseISO } from "date-fns";
import heroClassroom from "@/assets/hero-classroom.jpg";
import heroStudents from "@/assets/hero-students.jpg";
import heroStudy from "@/assets/hero-study.jpg";
import aboutTeaching from "@/assets/about-teaching.jpg";
import { BLOG_POSTS, type BlogPost as StaticBlogPost } from "@/data/blogs";
import { PRESS, RESULTS } from "@/data/site";
import { resolveMediaUrl } from "./api";

export type BlogPost = StaticBlogPost;

export interface HeroSlide {
  title: string;
  subtitle?: string | null;
  description: string;
  image: string;
  badge?: string | null;
  buttonText: string;
  buttonLink: string;
  status?: string;
  displayOrder?: number;
}

export interface PublicResult {
  name: string;
  exam: string;
  score: string;
  college: string;
  photo?: string;
  year?: number;
  status?: string;
}

export interface GalleryImage {
  src: string;
  caption: string;
  category?: string;
  description?: string;
  status?: string;
}

export interface PressReleaseItem {
  id?: number;
  date: string;
  title: string;
  excerpt: string;
  fullDescription?: string;
  mediaUrl?: string;
  mediaType?: string | null;
  sourceName?: string;
  releaseDate?: string;
  status?: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    subtitle: "Since 2000",
    title: "IIT-JEE | Medical | Foundation Coaching",
    description: "Concept-first teaching, daily practice and real results - the Gurukul way.",
    image: heroClassroom,
    badge: "Admissions Open",
    buttonText: "Enquire Now",
    buttonLink: "#enquire",
  },
  {
    subtitle: "Top results year after year",
    title: "NEET, MH-CET & IIT-JEE Preparation in Kalyan and Bhiwandi",
    description: "Integrated programs that balance HSC scores with Entrance excellence.",
    image: heroStudy,
    badge: "5 Branches",
    buttonText: "Enquire Now",
    buttonLink: "#enquire",
  },
  {
    subtitle: "Proven track record",
    title: "10,000+ Successful Students & 6,000+ in Top Colleges",
    description: "A legacy of trust built by thousands of doctors, engineers and scientists.",
    image: heroStudents,
    badge: "10k+ Alumni",
    buttonText: "Enquire Now",
    buttonLink: "#enquire",
  },
  {
    subtitle: "2026 Batches",
    title: "Admissions Open for VIII, IX, X, XI & XII Science",
    description: "Reserve your seat in our new academic session - limited capacity per batch.",
    image: aboutTeaching,
    badge: "Limited Seats",
    buttonText: "Enquire Now",
    buttonLink: "#enquire",
  },
];

export const DEFAULT_RESULTS: PublicResult[] = RESULTS.map((result) => ({
  name: result.name,
  exam: result.exam,
  score: result.score,
  college: result.college,
  photo: result.photo,
}));

export const DEFAULT_GALLERY_IMAGES: GalleryImage[] = [
  { src: heroClassroom, caption: "Science Lab Session", category: "Academics" },
  { src: heroStudents, caption: "Felicitation Ceremony 2024", category: "Events" },
  { src: aboutTeaching, caption: "Concept Lecture in Action", category: "Teaching" },
  { src: heroStudy, caption: "Self-Study Hours", category: "Study" },
  { src: heroClassroom, caption: "Practical Class", category: "Academics" },
  { src: heroStudents, caption: "Topper Awards 2024", category: "Events" },
  { src: aboutTeaching, caption: "Doubt-Solving Hours", category: "Teaching" },
  { src: heroStudy, caption: "Library Session", category: "Study" },
  { src: heroClassroom, caption: "Foundation Batch", category: "Foundation" },
];

export const DEFAULT_PRESS_RELEASES: PressReleaseItem[] = PRESS.map((item, index) => ({
  id: index + 1,
  date: item.date,
  title: item.title,
  excerpt: item.excerpt,
  fullDescription: item.excerpt,
  sourceName: "Gurukul Science Classes",
  status: "active",
}));

export const DEFAULT_BLOG_POSTS: BlogPost[] = BLOG_POSTS;

function safeFormat(dateValue: string, dateFormat: string, fallback: string) {
  try {
    return format(parseISO(dateValue), dateFormat);
  } catch {
    return fallback;
  }
}

function toBodyArray(value: unknown, fallbackContent?: string) {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (!fallbackContent) {
    return [];
  }
  return fallbackContent
    .split(/\n\s*\n/g)
    .map((part) => part.trim())
    .filter(Boolean);
}

function toHighlightsArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  return [];
}

export function mapHeroRecord(record: {
  title: string;
  subtitle?: string | null;
  description: string;
  backgroundImage: string;
  badge?: string | null;
  buttonText: string;
  buttonLink: string;
  status?: string;
  displayOrder?: number;
}): HeroSlide {
  return {
    title: record.title,
    subtitle: record.subtitle,
    description: record.description,
    image: resolveMediaUrl(record.backgroundImage),
    badge: record.badge,
    buttonText: record.buttonText,
    buttonLink: record.buttonLink,
    status: record.status,
    displayOrder: record.displayOrder,
  };
}

export function mapResultRecord(record: {
  studentName: string;
  examType: string;
  examLabel?: string;
  resultValue: string;
  description?: string | null;
  studentPhoto?: string | null;
  year?: number;
  status?: string;
}): PublicResult {
  return {
    name: record.studentName,
    exam: record.examLabel || record.examType,
    score: record.resultValue,
    college: record.description || "",
    photo: resolveMediaUrl(record.studentPhoto),
    year: record.year,
    status: record.status,
  };
}

export function mapGalleryRecord(record: {
  title: string;
  image: string;
  category: string;
  description?: string | null;
  status?: string;
}): GalleryImage {
  return {
    src: resolveMediaUrl(record.image),
    caption: record.title,
    category: record.category,
    description: record.description || record.title,
    status: record.status,
  };
}

export function mapPressRecord(record: {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  mediaPath?: string | null;
  mediaType?: string | null;
  releaseDate: string;
  sourceName?: string;
  status?: string;
}): PressReleaseItem {
  return {
    id: record.id,
    date: safeFormat(record.releaseDate, "MMM yyyy", record.releaseDate),
    title: record.title,
    excerpt: record.shortDescription,
    fullDescription: record.fullDescription || record.shortDescription,
    mediaUrl: resolveMediaUrl(record.mediaPath || ""),
    mediaType: record.mediaType || null,
    sourceName: record.sourceName,
    releaseDate: record.releaseDate,
    status: record.status,
  };
}

export function mapBlogRecord(record: {
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
  displayOrder?: number;
}): BlogPost {
  const body = toBodyArray(record.body, record.fullContent);
  const highlights = toHighlightsArray(record.highlights);

  return {
    slug: record.slug,
    detailPath: `/blog/${record.slug}`,
    title: record.title,
    date: safeFormat(record.publishDate, "MMMM yyyy", record.publishDate),
    readTime: record.readTime,
    tag: record.category,
    excerpt: record.shortDescription,
    summary: record.metaDescription || record.shortDescription,
    image: resolveMediaUrl(record.featuredImage),
    alt: record.imageAlt || record.title,
    body,
    highlights,
  };
}

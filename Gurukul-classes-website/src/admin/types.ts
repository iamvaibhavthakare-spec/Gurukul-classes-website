export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface DashboardTotals {
  results: number;
  galleryImages: number;
  pressReleases: number;
  blogs: number;
  heroBanners: number;
}

export interface DashboardUpdate {
  module: string;
  title: string;
  status: string;
  updatedAt: string;
}

export interface DashboardResponse {
  totals: DashboardTotals;
  recentUpdates: DashboardUpdate[];
}

export interface HeroSectionRecord {
  id: number;
  title: string;
  subtitle?: string | null;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  badge?: string | null;
  displayOrder: number;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface ResultRecord {
  id: number;
  studentName: string;
  examType: string;
  examLabel: string;
  resultValue: string;
  year: number;
  studentPhoto?: string | null;
  description?: string | null;
  displayOrder: number;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryRecord {
  id: number;
  title: string;
  image: string;
  category: string;
  description?: string | null;
  displayOrder: number;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface PressReleaseRecord {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  mediaPath?: string | null;
  mediaType?: string | null;
  releaseDate: string;
  sourceName: string;
  displayOrder: number;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogRecord {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  fullContent: string;
  featuredImage: string;
  author: string;
  category: string;
  publishDate: string;
  status: "active" | "inactive";
  metaTitle: string;
  metaDescription: string;
  readTime: string;
  imageAlt: string;
  body: string[];
  highlights: string[];
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

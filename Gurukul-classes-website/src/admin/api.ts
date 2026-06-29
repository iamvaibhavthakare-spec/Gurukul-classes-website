import { buildApiUrl, fetchJson, resolveMediaUrl } from "@/lib/api";
import { getAdminToken } from "./auth";
import type {
  AdminProfile,
  BlogRecord,
  DashboardResponse,
  GalleryRecord,
  HeroSectionRecord,
  PressReleaseRecord,
  ResultRecord,
} from "./types";

export function resolveAdminMediaUrl(value?: string | null) {
  return resolveMediaUrl(value || "");
}

export async function adminFetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  return fetchJson<T>(path, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function adminFetchFormData<T>(
  path: string,
  formData: FormData,
  method: "POST" | "PUT" = "POST",
) {
  return adminFetchJson<T>(path, {
    method,
    body: formData,
  });
}

export async function loginAdmin(email: string, password: string) {
  return fetchJson<{ token: string; admin: AdminProfile }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function loadDashboard() {
  return adminFetchJson<DashboardResponse>("/api/admin/dashboard");
}

export async function loadHeroSections() {
  return adminFetchJson<HeroSectionRecord[]>("/api/admin/hero");
}

export async function loadResults() {
  return adminFetchJson<ResultRecord[]>("/api/admin/results");
}

export async function loadGallery() {
  return adminFetchJson<GalleryRecord[]>("/api/admin/gallery");
}

export async function loadPressReleases() {
  return adminFetchJson<PressReleaseRecord[]>("/api/admin/press-releases");
}

export async function loadBlogs() {
  return adminFetchJson<BlogRecord[]>("/api/admin/blogs");
}

export async function deleteRecord(path: string) {
  return adminFetchJson<{ message: string }>(path, { method: "DELETE" });
}

export function filePreviewUrl(file?: File | null) {
  return file ? URL.createObjectURL(file) : "";
}

export function buildAdminUrl(path: string) {
  return buildApiUrl(path);
}

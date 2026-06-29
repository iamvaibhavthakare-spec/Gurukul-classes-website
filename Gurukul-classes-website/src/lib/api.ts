const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();
export const API_BASE_URL =
  RAW_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function resolveMediaUrl(value?: string | null) {
  if (!value) {
    return "";
  }
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }
  if (!API_BASE_URL) {
    return value;
  }
  return `${API_BASE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : payload?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (!isJson) {
    throw new Error("Expected a JSON response.");
  }

  return payload as T;
}

export async function safeFetchJson<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    return await fetchJson<T>(path, init);
  } catch {
    return null;
  }
}

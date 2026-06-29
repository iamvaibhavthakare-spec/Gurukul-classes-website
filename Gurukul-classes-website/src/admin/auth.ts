const TOKEN_KEY = "gurukul_admin_token";
const ADMIN_KEY = "gurukul_admin_profile";

export function getAdminToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_KEY);
}

export function getStoredAdminProfile() {
  const raw = window.localStorage.getItem(ADMIN_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAdminProfile(profile: unknown) {
  window.localStorage.setItem(ADMIN_KEY, JSON.stringify(profile));
}

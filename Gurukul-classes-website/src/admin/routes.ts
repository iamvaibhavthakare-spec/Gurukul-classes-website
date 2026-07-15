export const ADMIN_BASE_PATH = "/gurukul-classes/myadmin";
const LEGACY_ADMIN_BASE_PATH = "/admin";

const ADMIN_ROUTES = {
  login: `${ADMIN_BASE_PATH}/login`,
  dashboard: ADMIN_BASE_PATH,
  dashboardAlias: `${ADMIN_BASE_PATH}/dashboard`,
  hero: `${ADMIN_BASE_PATH}/hero`,
  results: `${ADMIN_BASE_PATH}/results`,
  gallery: `${ADMIN_BASE_PATH}/gallery`,
  pressReleases: `${ADMIN_BASE_PATH}/press-releases`,
  blogs: `${ADMIN_BASE_PATH}/blogs`,
} as const;

const LEGACY_ADMIN_ROUTES = {
  login: `${LEGACY_ADMIN_BASE_PATH}/login`,
  dashboard: LEGACY_ADMIN_BASE_PATH,
  dashboardAlias: `${LEGACY_ADMIN_BASE_PATH}/dashboard`,
  hero: `${LEGACY_ADMIN_BASE_PATH}/hero`,
  results: `${LEGACY_ADMIN_BASE_PATH}/results`,
  gallery: `${LEGACY_ADMIN_BASE_PATH}/gallery`,
  pressReleases: `${LEGACY_ADMIN_BASE_PATH}/press-releases`,
  blogs: `${LEGACY_ADMIN_BASE_PATH}/blogs`,
} as const;

type AdminRouteKey = keyof typeof ADMIN_ROUTES;

function matchesBasePath(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

export function adminPath(route: AdminRouteKey = "dashboard") {
  return ADMIN_ROUTES[route];
}

export function isAdminPath(pathname: string) {
  return (
    matchesBasePath(pathname, ADMIN_BASE_PATH) || matchesBasePath(pathname, LEGACY_ADMIN_BASE_PATH)
  );
}

export function normalizeAdminPath(pathname: string) {
  switch (pathname) {
    case LEGACY_ADMIN_ROUTES.login:
      return ADMIN_ROUTES.login;
    case LEGACY_ADMIN_ROUTES.dashboard:
    case LEGACY_ADMIN_ROUTES.dashboardAlias:
      return ADMIN_ROUTES.dashboard;
    case LEGACY_ADMIN_ROUTES.hero:
      return ADMIN_ROUTES.hero;
    case LEGACY_ADMIN_ROUTES.results:
      return ADMIN_ROUTES.results;
    case LEGACY_ADMIN_ROUTES.gallery:
      return ADMIN_ROUTES.gallery;
    case LEGACY_ADMIN_ROUTES.pressReleases:
      return ADMIN_ROUTES.pressReleases;
    case LEGACY_ADMIN_ROUTES.blogs:
      return ADMIN_ROUTES.blogs;
    default:
      return pathname;
  }
}

export function replaceAdminPath(pathname: string) {
  if (window.location.pathname === pathname) {
    return;
  }

  window.history.replaceState({}, "", pathname);
  window.dispatchEvent(new Event("app:navigate"));
}

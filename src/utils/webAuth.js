// Pure helpers for WebView-based auth on vkserfing.com.
// Kept free of React Native imports so they can be unit-tested in plain Node.

export const VKSERFING_BASE_URL =
  process.env.EXPO_PUBLIC_VKSERFING_BASE_URL || 'https://vkserfing.com';

// The site has no dedicated /login or /register pages (both return 404).
// The login/registration form is a modal embedded in the main page.
export const WEB_AUTH_MODES = {
  login: '/',
  register: '/',
};

// Paths the site navigates to after a successful authorization.
const LOGGED_IN_PATHS = [
  'dashboard',
  'profile',
  'cabinet',
  'tasks',
  'account',
];

export const getWebAuthUrl = (mode, baseUrl = VKSERFING_BASE_URL) => {
  const path = WEB_AUTH_MODES[mode] || WEB_AUTH_MODES.login;
  return `${baseUrl.replace(/\/+$/, '')}${path}`;
};

export const extractUrlToken = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get('token');
  } catch {
    return null;
  }
};

// Decides whether a WebView navigation means the user has authenticated.
// Returns { success, token | null }.
export const resolveWebAuthResult = (startUrl, nextUrl) => {
  const token = extractUrlToken(nextUrl);
  if (token) {
    return { success: true, token };
  }

  let parsed;
  try {
    parsed = new URL(nextUrl);
  } catch {
    return { success: false, token: null };
  }

  const pathname = parsed.pathname.replace(/\/+$/, '') || '/';
  const startPathname = (() => {
    try {
      const start = new URL(startUrl);
      return start.pathname.replace(/\/+$/, '') || '/';
    } catch {
      return null;
    }
  })();

  // Never treat the authorization page itself as a successful login.
  if (startPathname && pathname === startPathname) {
    return { success: false, token: null };
  }

  const isSameHost = parsed.host === 'vkserfing.com' || parsed.host.endsWith('.vkserfing.com');
  const hasLoggedInPath = LOGGED_IN_PATHS.some((p) => pathname === `/${p}` || pathname.startsWith(`/${p}/`));

  if (isSameHost && hasLoggedInPath) {
    return { success: true, token: null };
  }

  return { success: false, token: null };
};

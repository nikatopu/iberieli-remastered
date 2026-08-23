/**
 * Analytics configuration and consent plumbing.
 *
 * Nothing in here loads a tracker. Google Analytics and Microsoft Clarity are
 * only ever injected by the `Analytics` component, and only after the visitor
 * has explicitly granted consent. The helpers below exist so that a visitor who
 * changes their mind can be opted back out without a page reload.
 */

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-TTEH8VJG7V";

export const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "";

export const CONSENT_STORAGE_KEY = "iberieli.cookie-consent";
export const CONSENT_VERSION = 1;

export type ConsentStatus = "granted" | "denied";

interface StoredConsent {
  version: number;
  status: ConsentStatus;
  decidedAt: string;
}

/** First-party cookies set by Google Analytics and Microsoft Clarity. */
const TRACKING_COOKIE_PREFIXES = [
  "_ga",
  "_gid",
  "_gat",
  "_gac",
  "_clck",
  "_clsk",
  "CLID",
  "MUID",
  "ANONCHK",
  "SM",
  "MR",
];

export function readStoredConsent(): ConsentStatus | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (parsed.status !== "granted" && parsed.status !== "denied") return null;

    return parsed.status;
  } catch {
    // Private browsing or blocked storage — treat as "no decision yet".
    return null;
  }
}

export function writeStoredConsent(status: ConsentStatus) {
  if (typeof window === "undefined") return;

  const payload: StoredConsent = {
    version: CONSENT_VERSION,
    status,
    decidedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage unavailable: the choice still applies to this page view, the
    // banner will simply ask again next time.
  }
}

/**
 * Every domain a tracker could have scoped its cookie to, so a withdrawal
 * actually removes them (`www.iberieli.com`, `.iberieli.com`, ...).
 */
function cookieDomains(): (string | null)[] {
  const parts = window.location.hostname.split(".");
  const domains: (string | null)[] = [null];

  for (let i = 0; i < parts.length - 1; i++) {
    domains.push(`.${parts.slice(i).join(".")}`);
  }

  return domains;
}

/** Best-effort removal of the first-party cookies GA and Clarity leave behind. */
export function clearTrackingCookies() {
  if (typeof document === "undefined") return;

  const names = new Set(
    document.cookie
      .split(";")
      .map((entry) => entry.split("=")[0].trim())
      .filter(
        (name) =>
          name &&
          TRACKING_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix)),
      ),
  );

  names.forEach((name) => {
    cookieDomains().forEach((domain) => {
      const suffix = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${suffix}`;
    });
  });
}

/**
 * Google's official kill switch. Once set, gtag drops every hit instead of
 * sending it, which lets a visitor withdraw consent mid-session.
 */
function setGoogleAnalyticsOptOut(optOut: boolean) {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  (window as unknown as Record<string, boolean>)[
    `ga-disable-${GA_MEASUREMENT_ID}`
  ] = optOut;
}

export function enableAnalytics() {
  setGoogleAnalyticsOptOut(false);
}

/** Stop both trackers and remove what they stored. */
export function disableAnalytics() {
  if (typeof window === "undefined") return;

  setGoogleAnalyticsOptOut(true);
  window.clarity?.("consent", false);
  clearTrackingCookies();
}

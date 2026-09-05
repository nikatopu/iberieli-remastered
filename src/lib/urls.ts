/** URL helpers shared by the admin API and the client-side distribution UI. */

/** Normalises whatever the admin typed into a URL we can safely link out to. */
export function normaliseUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    return new URL(withScheme).toString();
  } catch {
    return null;
  }
}

/** "https://www.lescaves.co.uk/x" -> "lescaves.co.uk", for display fallbacks. */
export function displayHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

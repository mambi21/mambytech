/**
 * Public base URL of the site, used for canonical URLs, the sitemap and social
 * metadata. Configure NEXT_PUBLIC_SITE_URL once the domain is confirmed.
 */
const FALLBACK = "http://localhost:3000";

function normalise(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return FALLBACK;
  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return FALLBACK;
  }
}

export const siteUrl = normalise(process.env.NEXT_PUBLIC_SITE_URL);

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteUrl).toString();
}

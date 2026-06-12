const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string | undefined) {
  if (!value?.trim()) return null;

  const trimmedValue = value.trim();
  const withProtocol = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

const siteUrl =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  normalizeSiteUrl(process.env.VERCEL_URL) ??
  LOCAL_SITE_URL;

export const siteConfig = {
  name: "JobCheck",
  description:
    "Check job posts, recruiter emails, and offer messages for evidence-based risk signals before you apply.",
  url: siteUrl,
} as const;

export function absoluteUrl(path: `/${string}` | "/") {
  return new URL(path, siteConfig.url).toString();
}

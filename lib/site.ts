const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string | undefined) {
  if (!value) return LOCAL_SITE_URL;

  const withProtocol = /^https?:\/\//i.test(value)
    ? value
    : `https://${value}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return LOCAL_SITE_URL;
  }
}

export const siteConfig = {
  name: "JobCheck",
  description:
    "Check job posts, recruiter emails, and offer messages for evidence-based risk signals before you apply.",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
} as const;

export function absoluteUrl(path: `/${string}` | "/") {
  return new URL(path, siteConfig.url).toString();
}

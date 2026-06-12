const LOCAL_SITE_URL = "http://localhost:3000";
const PRODUCTION_SITE_URL = "https://jobtrustcheck.com";

function normalizeSiteUrl(value: string | undefined) {
  if (!value?.trim()) return null;

  const trimmedValue = value.trim();
  const withProtocol = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(withProtocol);

    if (
      url.hostname === "jobtrustcheck.com" ||
      url.hostname === "www.jobtrustcheck.com"
    ) {
      url.protocol = "https:";
      url.hostname = "jobtrustcheck.com";
      url.port = "";
    }

    return url.origin;
  } catch {
    return null;
  }
}

const siteUrl =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  (process.env.NODE_ENV === "development"
    ? LOCAL_SITE_URL
    : PRODUCTION_SITE_URL);

export const siteConfig = {
  name: "JobCheck",
  description:
    "Check job posts, recruiter emails, and offer messages for evidence-based risk signals before you apply.",
  url: siteUrl,
} as const;

export function absoluteUrl(path: `/${string}` | "/") {
  return new URL(path, siteConfig.url).toString();
}

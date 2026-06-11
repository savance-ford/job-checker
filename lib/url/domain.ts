export const KNOWN_ATS_DOMAINS = [
  "greenhouse.io",
  "lever.co",
  "ashbyhq.com",
  "workable.com",
  "smartrecruiters.com",
];

export const URL_SHORTENER_DOMAINS = [
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "shorturl.at",
  "ow.ly",
  "buff.ly",
  "rebrand.ly",
  "is.gd",
];

export const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "aol.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
];

const UNUSUAL_TLDS = [
  ".click",
  ".country",
  ".download",
  ".gq",
  ".kim",
  ".loan",
  ".men",
  ".mom",
  ".party",
  ".review",
  ".science",
  ".stream",
  ".top",
  ".work",
  ".zip",
];

export function normalizeHostname(hostname: string) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

export function hostnameMatches(hostname: string, domain: string) {
  const normalized = normalizeHostname(hostname);
  return normalized === domain || normalized.endsWith(`.${domain}`);
}

export function findMatchingDomain(hostname: string, domains: string[]) {
  return domains.find((domain) => hostnameMatches(hostname, domain)) ?? null;
}

export function isKnownAtsDomain(hostname: string) {
  return findMatchingDomain(hostname, KNOWN_ATS_DOMAINS);
}

export function isUrlShortener(hostname: string) {
  return Boolean(findMatchingDomain(hostname, URL_SHORTENER_DOMAINS));
}

export function isFreeEmailDomain(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? FREE_EMAIL_DOMAINS.includes(domain) : false;
}

export function hasUnusualDomainPattern(hostname: string) {
  const normalized = normalizeHostname(hostname);
  const labels = normalized.split(".");
  const mainLabel = labels.at(-2) ?? labels[0] ?? "";

  return (
    normalized.startsWith("xn--") ||
    UNUSUAL_TLDS.some((tld) => normalized.endsWith(tld)) ||
    (mainLabel.match(/-/g)?.length ?? 0) >= 3 ||
    /\d{5,}/.test(mainLabel) ||
    normalized.length > 60
  );
}

export function getRegistrableDomain(hostname: string) {
  const labels = normalizeHostname(hostname).split(".");
  return labels.length >= 2 ? labels.slice(-2).join(".") : labels[0];
}

import type { InputType, SafeInputSummary } from "@/lib/types";

type SafeInputSource = {
  input_type: InputType;
  company_name?: string | null;
  job_title?: string | null;
  detected_email?: string | null;
  original_url?: string | null;
  final_url?: string | null;
  company_website_domain?: string | null;
  careers_page_url?: string | null;
};

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const URL_PATTERN = /\bhttps?:\/\/[^\s;]+/gi;

export function extractEmailDomain(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf("@");

  if (atIndex <= 0 || atIndex === trimmed.length - 1) return null;

  const domain = trimmed.slice(atIndex + 1);
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain) ? domain : null;
}

export function redactEmail(email: string): string {
  const trimmed = email.trim();
  const domain = extractEmailDomain(trimmed);
  if (!domain) return "Hidden email";

  const localPart = trimmed.slice(0, trimmed.lastIndexOf("@"));
  const firstCharacter = localPart.charAt(0) || "*";
  return `${firstCharacter}***@${domain}`;
}

export function safeDomainFromUrl(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function safePublicUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    parsed.username = "";
    parsed.password = "";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return null;
  }
}

export function createSafeInputSummary(
  scan: SafeInputSource,
): SafeInputSummary {
  return {
    inputType: scan.input_type,
    companyName: scan.company_name?.trim() || null,
    jobTitle: scan.job_title?.trim() || null,
    originalUrlDomain: scan.original_url
      ? safeDomainFromUrl(scan.original_url)
      : null,
    finalUrlDomain: scan.final_url ? safeDomainFromUrl(scan.final_url) : null,
    emailDomain: scan.detected_email
      ? extractEmailDomain(scan.detected_email)
      : null,
    companyWebsiteDomain:
      scan.company_website_domain?.trim().toLowerCase() || null,
    careersPageUrl: scan.careers_page_url
      ? safePublicUrl(scan.careers_page_url)
      : null,
  };
}

export function sanitizePublicEvidence(
  evidence: string | null | undefined,
): string | null {
  if (!evidence) return null;

  const sanitized = evidence
    .replace(EMAIL_PATTERN, (email) => extractEmailDomain(email) ?? "hidden")
    .replace(URL_PATTERN, (url) => safeDomainFromUrl(url) ?? "hidden URL")
    .trim();

  return sanitized || null;
}

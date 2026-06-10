import type { KnownAtsDetectionResult } from "@/lib/ats/types";

const GREENHOUSE_HOSTS = [
  "greenhouse.io",
  "boards.greenhouse.io",
  "job-boards.greenhouse.io",
] as const;

function isGreenhouseHost(hostname: string) {
  const normalized = hostname.toLowerCase();
  return GREENHOUSE_HOSTS.some(
    (host) => normalized === host || normalized.endsWith(`.${host}`),
  );
}

function cleanSegment(segment: string | undefined) {
  if (!segment) return undefined;

  try {
    return decodeURIComponent(segment).trim() || undefined;
  } catch {
    return segment.trim() || undefined;
  }
}

export function detectGreenhouse(
  url: URL,
): KnownAtsDetectionResult | null {
  if (!isGreenhouseHost(url.hostname)) {
    return null;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  const jobsIndex = segments.findIndex(
    (segment) => segment.toLowerCase() === "jobs",
  );
  const pathCompanySlug =
    jobsIndex > 0
      ? segments[jobsIndex - 1]
      : !["embed", "job_app"].includes(segments[0]?.toLowerCase() ?? "")
        ? segments[0]
        : undefined;
  const companySlug = cleanSegment(
    url.searchParams.get("for") ?? pathCompanySlug,
  );
  const jobId =
    cleanSegment(jobsIndex >= 0 ? segments[jobsIndex + 1] : undefined) ??
    cleanSegment(url.searchParams.get("gh_jid") ?? undefined) ??
    cleanSegment(url.searchParams.get("token") ?? undefined);

  const evidence = [`ATS hostname: ${url.hostname}`];
  if (companySlug) evidence.push(`Company slug: ${companySlug}`);
  if (jobId) evidence.push(`Job ID: ${jobId}`);

  return {
    provider: "greenhouse",
    companySlug,
    jobId,
    confidence:
      companySlug && jobId ? "high" : companySlug || jobId ? "medium" : "low",
    evidence,
  };
}

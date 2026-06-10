import type {
  AtsPublicJob,
  KnownAtsDetectionResult,
} from "@/lib/ats/types";

function cleanSegment(segment: string | undefined) {
  if (!segment) return undefined;

  try {
    return decodeURIComponent(segment).trim() || undefined;
  } catch {
    return segment.trim() || undefined;
  }
}

export function detectAshby(url: URL): KnownAtsDetectionResult | null {
  const hostname = url.hostname.toLowerCase();
  if (
    hostname !== "jobs.ashbyhq.com" &&
    !hostname.endsWith(".jobs.ashbyhq.com")
  ) {
    return null;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  const companySlug = cleanSegment(segments[0]);
  const jobId = cleanSegment(segments[1]);
  const evidence = [`ATS hostname: ${url.hostname}`];

  if (companySlug) evidence.push(`Company slug: ${companySlug}`);
  if (jobId) evidence.push(`Job ID: ${jobId}`);

  return {
    provider: "ashby",
    companySlug,
    jobId,
    confidence: companySlug && jobId ? "high" : companySlug ? "medium" : "low",
    evidence,
  };
}

export function getAshbyFeedUrl(companySlug: string) {
  return `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(companySlug)}`;
}

function extractJobIdFromAshbyUrl(value: string) {
  try {
    const segments = new URL(value).pathname.split("/").filter(Boolean);
    const lastSegment = segments.at(-1)?.toLowerCase();
    const idIndex =
      lastSegment === "apply" || lastSegment === "application" ? -2 : -1;
    return cleanSegment(segments.at(idIndex));
  } catch {
    return undefined;
  }
}

export function parseAshbyJobs(payload: unknown): AtsPublicJob[] | null {
  if (!payload || typeof payload !== "object") return null;

  const jobs = (payload as { jobs?: unknown }).jobs;
  if (!Array.isArray(jobs)) return null;

  return jobs.flatMap((job) => {
    if (!job || typeof job !== "object") return [];

    const record = job as Record<string, unknown>;
    const title = typeof record.title === "string" ? record.title : undefined;
    const sourceUrl =
      typeof record.jobUrl === "string"
        ? record.jobUrl
        : typeof record.applyUrl === "string"
          ? record.applyUrl
          : undefined;
    const id =
      typeof record.id === "string"
        ? record.id
        : sourceUrl
          ? extractJobIdFromAshbyUrl(sourceUrl)
          : undefined;

    return id || title ? [{ id, title, sourceUrl }] : [];
  });
}

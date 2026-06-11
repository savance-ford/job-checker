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

export function detectLever(url: URL): KnownAtsDetectionResult | null {
  const hostname = url.hostname.toLowerCase();
  if (hostname !== "jobs.lever.co" && !hostname.endsWith(".jobs.lever.co")) {
    return null;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  const companySlug = cleanSegment(segments[0]);
  const jobId = cleanSegment(segments[1]);
  const evidence = [`ATS hostname: ${url.hostname}`];

  if (companySlug) evidence.push(`Company slug: ${companySlug}`);
  if (jobId) evidence.push(`Job ID: ${jobId}`);

  return {
    provider: "lever",
    companySlug,
    jobId,
    confidence: companySlug && jobId ? "high" : companySlug ? "medium" : "low",
    evidence,
  };
}

export function getLeverFeedUrl(companySlug: string) {
  return `https://api.lever.co/v0/postings/${encodeURIComponent(companySlug)}?mode=json`;
}

export function parseLeverJobs(payload: unknown): AtsPublicJob[] | null {
  if (!Array.isArray(payload)) return null;

  return payload.flatMap((job) => {
    if (!job || typeof job !== "object") return [];

    const record = job as Record<string, unknown>;
    const id = typeof record.id === "string" ? record.id : undefined;
    const title = typeof record.text === "string" ? record.text : undefined;
    const sourceUrl =
      typeof record.hostedUrl === "string" ? record.hostedUrl : undefined;

    return id || title ? [{ id, title, sourceUrl }] : [];
  });
}

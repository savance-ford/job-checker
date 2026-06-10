import {
  getAshbyFeedUrl,
  parseAshbyJobs,
} from "@/lib/ats/ashby";
import {
  getGreenhouseFeedUrl,
  parseGreenhouseJobs,
} from "@/lib/ats/greenhouse";
import { getLeverFeedUrl, parseLeverJobs } from "@/lib/ats/lever";
import type {
  AtsDetectionResult,
  AtsPublicJob,
  AtsVerificationResult,
} from "@/lib/ats/types";

const REQUEST_TIMEOUT_MS = 6_000;

type FetchJson = (url: string) => Promise<unknown>;

function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function findMatchingJob(
  jobs: AtsPublicJob[],
  detection: AtsDetectionResult,
  jobTitle: string | null,
) {
  if (detection.jobId) {
    return jobs.find((job) => job.id === detection.jobId);
  }

  if (!jobTitle) return undefined;

  const normalizedInputTitle = normalizeTitle(jobTitle);
  if (!normalizedInputTitle) return undefined;

  return jobs.find(
    (job) =>
      job.title && normalizeTitle(job.title) === normalizedInputTitle,
  );
}

function getProviderConfig(detection: AtsDetectionResult) {
  if (!detection.companySlug) return null;

  switch (detection.provider) {
    case "greenhouse":
      return {
        sourceUrl: getGreenhouseFeedUrl(detection.companySlug),
        parseJobs: parseGreenhouseJobs,
      };
    case "lever":
      return {
        sourceUrl: getLeverFeedUrl(detection.companySlug),
        parseJobs: parseLeverJobs,
      };
    case "ashby":
      return {
        sourceUrl: getAshbyFeedUrl(detection.companySlug),
        parseJobs: parseAshbyJobs,
      };
    default:
      return null;
  }
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "JobCheck/1.0",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Public ATS feed returned HTTP ${response.status}.`);
  }

  return response.json() as Promise<unknown>;
}

function baseEvidence(detection: AtsDetectionResult) {
  const evidence = [`Provider: ${detection.provider}`];
  if (detection.companySlug) {
    evidence.push(`Company slug: ${detection.companySlug}`);
  }
  if (detection.jobId) evidence.push(`Job ID: ${detection.jobId}`);
  return evidence;
}

function unsupportedResult(
  detection: AtsDetectionResult,
  message: string,
): AtsVerificationResult {
  return {
    provider: detection.provider,
    attempted: false,
    verified: false,
    status: "unsupported",
    companySlug: detection.companySlug,
    jobId: detection.jobId,
    message,
    evidence: [...baseEvidence(detection), message],
  };
}

function safeErrorReason(error: unknown) {
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return "The public ATS feed request timed out.";
  }

  if (error instanceof Error && /HTTP \d{3}/.test(error.message)) {
    return error.message;
  }

  return "The public ATS feed request could not be completed.";
}

export async function verifyAtsJob(
  detection: AtsDetectionResult,
  jobTitle: string | null,
  requestJson: FetchJson = fetchJson,
): Promise<AtsVerificationResult> {
  if (detection.provider === "unknown") {
    return unsupportedResult(
      detection,
      "No supported ATS provider was detected.",
    );
  }

  const config = getProviderConfig(detection);
  if (!config) {
    return unsupportedResult(
      detection,
      "A company slug is required for public ATS verification.",
    );
  }

  if (!detection.jobId && !jobTitle) {
    return {
      ...unsupportedResult(
        detection,
        "A job ID or job title is required to match a public posting.",
      ),
      sourceUrl: config.sourceUrl,
    };
  }

  try {
    const payload = await requestJson(config.sourceUrl);
    const jobs = config.parseJobs(payload);
    if (!jobs) {
      console.error("ATS verification response was not recognized", {
        provider: detection.provider,
      });

      return {
        provider: detection.provider,
        attempted: true,
        verified: false,
        status: "error",
        companySlug: detection.companySlug,
        jobId: detection.jobId,
        sourceUrl: config.sourceUrl,
        message: "The public ATS verification response was incomplete.",
        evidence: [
          ...baseEvidence(detection),
          "The public ATS feed returned an unexpected response.",
        ],
      };
    }

    const matchedJob = findMatchingJob(jobs, detection, jobTitle);
    const evidence = [
      ...baseEvidence(detection),
      `Public feed: ${config.sourceUrl}`,
    ];

    if (!matchedJob) {
      return {
        provider: detection.provider,
        attempted: true,
        verified: false,
        status: "not_found",
        companySlug: detection.companySlug,
        jobId: detection.jobId,
        sourceUrl: config.sourceUrl,
        message:
          "Could not verify the exact job in the public ATS feed.",
        evidence,
      };
    }

    if (matchedJob.title) {
      evidence.push(`Matched title: ${matchedJob.title}`);
    }
    if (matchedJob.sourceUrl) {
      evidence.push(`Matched posting: ${matchedJob.sourceUrl}`);
    }

    return {
      provider: detection.provider,
      attempted: true,
      verified: true,
      status: "verified",
      companySlug: detection.companySlug,
      jobId: matchedJob.id ?? detection.jobId,
      matchedTitle: matchedJob.title,
      sourceUrl: config.sourceUrl,
      message: "Job found in public ATS feed.",
      evidence,
    };
  } catch (error) {
    const reason = safeErrorReason(error);
    console.error("ATS verification request failed", {
      provider: detection.provider,
      reason,
    });

    return {
      provider: detection.provider,
      attempted: true,
      verified: false,
      status: "error",
      companySlug: detection.companySlug,
      jobId: detection.jobId,
      sourceUrl: config.sourceUrl,
      message: "The public ATS verification request was incomplete.",
      evidence: [...baseEvidence(detection), reason],
    };
  }
}

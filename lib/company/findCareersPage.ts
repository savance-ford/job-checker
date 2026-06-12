import "server-only";

import type {
  AtsDetectionResult,
  AtsProvider,
} from "@/lib/ats/types";
import { detectAts } from "@/lib/ats/detectAts";
import { extractCareersLinks } from "@/lib/company/extractCareersLinks";
import { selectBestCareersResult } from "@/lib/company/selectCareersResult";
import type { CareersPageVerificationResult } from "@/lib/company/types";
import { requestPublicUrl } from "@/lib/company/verifyCompanyWebsite";

const COMMON_CAREERS_PATHS = [
  "/careers",
  "/jobs",
  "/company/careers",
  "/about/careers",
  "/join-us",
  "/work-with-us",
] as const;

const MAX_HOMEPAGE_HTML_LENGTH = 1_000_000;
const MAX_CAREERS_CANDIDATES = 12;
const ATS_PROVIDER_DOMAINS: Record<
  Exclude<AtsProvider, "unknown">,
  string
> = {
  greenhouse: "greenhouse.io",
  lever: "jobs.lever.co",
  ashby: "jobs.ashbyhq.com",
};

function atsConnection(
  html: string,
  careersUrl: URL,
  atsDetection: AtsDetectionResult,
) {
  if (atsDetection.provider === "unknown") return null;

  const pageDetection = detectAts(careersUrl);
  const targetDomain = ATS_PROVIDER_DOMAINS[atsDetection.provider];
  const providerFound =
    pageDetection.provider === atsDetection.provider ||
    html.toLowerCase().includes(targetDomain);

  if (!providerFound) return null;

  const slugFound =
    !atsDetection.companySlug ||
    html.toLowerCase().includes(atsDetection.companySlug.toLowerCase()) ||
    pageDetection.companySlug === atsDetection.companySlug;

  if (!slugFound) return null;

  return {
    provider: atsDetection.provider,
    slug: slugFound ? atsDetection.companySlug : undefined,
  };
}

export async function findCareersPage(
  companyWebsiteUrl: string | null | undefined,
  atsDetection: AtsDetectionResult,
): Promise<CareersPageVerificationResult> {
  if (!companyWebsiteUrl) {
    return {
      attempted: false,
      found: false,
      status: "not_attempted",
      message: "Careers page discovery was not attempted.",
      evidence: [],
    };
  }

  const websiteUrl = new URL(companyWebsiteUrl);

  try {
    const homepage = await requestPublicUrl(websiteUrl, "GET");
    const homepageHtml = (homepage.html ?? "").slice(
      0,
      MAX_HOMEPAGE_HTML_LENGTH,
    );
    const discoveredLinks = extractCareersLinks(
      homepageHtml,
      homepage.finalUrl,
    );
    const commonLinks = COMMON_CAREERS_PATHS.map(
      (path) => new URL(path, homepage.finalUrl.origin),
    );
    const seenCandidates = new Set<string>();
    const candidates = [...discoveredLinks, ...commonLinks]
      .filter((candidate) => {
        const value = candidate.toString();
        if (seenCandidates.has(value)) return false;
        seenCandidates.add(value);
        return true;
      })
      .slice(0, MAX_CAREERS_CANDIDATES);
    const candidateResults = await Promise.all(
      candidates.map(async (candidate) => {
        try {
          const result = await requestPublicUrl(candidate, "GET");
          if (
            result.response.status < 200 ||
            result.response.status >= 400
          ) {
            return null;
          }

          const careersUrl = new URL(result.finalUrl);
          careersUrl.search = "";
          careersUrl.hash = "";
          const html = (result.html ?? "").slice(
            0,
            MAX_HOMEPAGE_HTML_LENGTH,
          );
          const connection =
            atsConnection(html, careersUrl, atsDetection) ??
            atsConnection(homepageHtml, homepage.finalUrl, atsDetection);
          const evidence = [`Careers page: ${careersUrl.toString()}`];

          if (connection) {
            evidence.push(`ATS provider: ${connection.provider}`);
            if (connection.slug) {
              evidence.push(`ATS company slug: ${connection.slug}`);
            }
          }

          return {
            attempted: true,
            found: true,
            careersUrl: careersUrl.toString(),
            status: "found" as const,
            message:
              "A careers or jobs page candidate was found on the provided company website.",
            evidence,
            linkedAtsProvider: connection?.provider,
            linkedAtsSlug: connection?.slug,
            hasConnection: Boolean(connection),
          };
        } catch {
          return null;
        }
      }),
    );
    const bestResult = selectBestCareersResult(candidateResults);

    if (bestResult) {
      return {
        attempted: bestResult.attempted,
        found: bestResult.found,
        careersUrl: bestResult.careersUrl,
        status: bestResult.status,
        message: bestResult.message,
        evidence: bestResult.evidence,
        linkedAtsProvider: bestResult.linkedAtsProvider,
        linkedAtsSlug: bestResult.linkedAtsSlug,
      };
    }

    return {
      attempted: true,
      found: false,
      status: "not_found",
      message:
        "The app could not find a public careers page from the provided company website.",
      evidence: ["Checked homepage links and common careers paths."],
    };
  } catch (error) {
    return {
      attempted: true,
      found: false,
      status: "error",
      message: "Careers page verification was incomplete.",
      evidence: [
        error instanceof Error
          ? error.message
          : "The careers page check could not be completed.",
      ],
    };
  }
}

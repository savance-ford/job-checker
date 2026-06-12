import "server-only";

import type { AtsDetectionResult } from "@/lib/ats/types";
import { detectAts } from "@/lib/ats/detectAts";
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

const CAREERS_TEXT_PATTERN = /\b(careers?|jobs?|join\s+us|work\s+with\s+us|openings?)\b/i;
const MAX_HOMEPAGE_HTML_LENGTH = 1_000_000;
const MAX_CAREERS_CANDIDATES = 12;

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function extractCareersLinks(html: string, baseUrl: URL) {
  const links: URL[] = [];
  const anchorPattern =
    /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;

  for (const match of html.matchAll(anchorPattern)) {
    const href = match[2]?.trim();
    const text = stripTags(match[3] ?? "");
    if (!href || !CAREERS_TEXT_PATTERN.test(`${href} ${text}`)) continue;

    try {
      const candidate = new URL(href, baseUrl);
      if (!["http:", "https:"].includes(candidate.protocol)) continue;
      candidate.hash = "";
      candidate.search = "";
      links.push(candidate);
    } catch {
      // Ignore malformed links found in third-party HTML.
    }
  }

  return links;
}

function atsConnection(
  html: string,
  careersUrl: URL,
  atsDetection: AtsDetectionResult,
) {
  if (atsDetection.provider === "unknown") return null;

  const pageDetection = detectAts(careersUrl);
  const providerFound =
    pageDetection.provider === atsDetection.provider ||
    html.toLowerCase().includes(
      atsDetection.provider === "greenhouse"
        ? "greenhouse.io"
        : atsDetection.provider === "lever"
          ? "jobs.lever.co"
          : "jobs.ashbyhq.com",
    );

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
    const candidates = [...discoveredLinks, ...commonLinks]
      .filter(
        (candidate, index, all) =>
          all.findIndex((item) => item.toString() === candidate.toString()) ===
          index,
      )
      .slice(0, MAX_CAREERS_CANDIDATES);
    const candidateResults = await Promise.all(
      candidates.map(async (
        candidate,
      ): Promise<CareersPageVerificationResult | null> => {
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
            status: "found",
            message:
              "A careers or jobs page candidate was found on the provided company website.",
            evidence,
            linkedAtsProvider: connection?.provider,
            linkedAtsSlug: connection?.slug,
          };
        } catch {
          return null;
        }
      }),
    );
    const foundResult = candidateResults.find((result) => result !== null);

    if (foundResult) {
      return foundResult;
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

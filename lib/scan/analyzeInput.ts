import {
  extractCompanyName,
  extractEmail,
  extractJobTitle,
  extractUrl,
} from "@/lib/scan/extractors";
import { detectAts } from "@/lib/ats/detectAts";
import { verifyAtsJob } from "@/lib/ats/verifyAtsJob";
import { findCareersPage } from "@/lib/company/findCareersPage";
import { verifyCompanyWebsite } from "@/lib/company/verifyCompanyWebsite";
import {
  buildSummary,
  calculateScore,
  getRecommendation,
} from "@/lib/scan/scoring";
import { detectSignals } from "@/lib/scan/signals";
import { followRedirects } from "@/lib/url/followRedirects";
import type { InputType, ScanAnalysis } from "@/lib/types";

export async function analyzeInput(
  input: string,
  inputType: InputType,
  companyWebsite?: string,
): Promise<ScanAnalysis> {
  const originalUrl = extractUrl(input);
  const detectedEmail = extractEmail(input);
  const companyName = extractCompanyName(input, detectedEmail);
  const jobTitle = extractJobTitle(input);

  const redirectResult = originalUrl
    ? await followRedirects(originalUrl)
    : { finalUrl: null, redirectCount: 0, error: null };

  let originalParsedUrl: URL | null = null;
  let finalParsedUrl: URL | null = null;
  if (originalUrl) {
    try {
      originalParsedUrl = new URL(originalUrl);
    } catch {
      originalParsedUrl = null;
    }
  }
  if (redirectResult.finalUrl) {
    try {
      finalParsedUrl = new URL(redirectResult.finalUrl);
    } catch {
      finalParsedUrl = null;
    }
  }
  const finalAtsDetection = detectAts(finalParsedUrl);
  const atsDetection =
    finalAtsDetection.provider !== "unknown"
      ? finalAtsDetection
      : detectAts(originalParsedUrl);
  const atsVerification =
    atsDetection.provider !== "unknown"
      ? await verifyAtsJob(atsDetection, jobTitle)
      : null;
  const companyWebsiteVerification = await verifyCompanyWebsite(
    companyWebsite,
  );
  const careersPageVerification = companyWebsiteVerification.websiteFound
    ? await findCareersPage(
        companyWebsiteVerification.normalizedUrl,
        atsDetection,
      )
    : {
        attempted: false as const,
        found: false as const,
        status: "not_attempted" as const,
        message: "Careers page discovery was not attempted.",
        evidence: [],
      };

  const signals = detectSignals({
    input,
    inputType,
    originalUrl: originalParsedUrl,
    finalUrl: finalParsedUrl,
    atsDetection,
    atsVerification,
    email: detectedEmail,
    companyName,
    jobTitle,
    redirectCount: redirectResult.redirectCount,
    redirectError: redirectResult.error,
    companyWebsiteVerification,
    careersPageVerification,
  });
  const score = calculateScore(signals);
  const recommendation = getRecommendation(score);

  return {
    inputType,
    inputValue: input,
    companyWebsiteUrl:
      companyWebsiteVerification.normalizedUrl ?? companyWebsite ?? null,
    companyWebsiteDomain: companyWebsiteVerification.domain ?? null,
    careersPageUrl: careersPageVerification.careersUrl ?? null,
    careersPageFound: careersPageVerification.found,
    companyName,
    jobTitle,
    detectedEmail,
    originalUrl,
    finalUrl: redirectResult.finalUrl,
    score,
    recommendation,
    summary: buildSummary(recommendation, signals),
    signals,
  };
}

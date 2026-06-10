import {
  extractCompanyName,
  extractEmail,
  extractJobTitle,
  extractUrl,
} from "@/lib/scan/extractors";
import { detectAts } from "@/lib/ats/detectAts";
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

  const signals = detectSignals({
    input,
    inputType,
    originalUrl: originalParsedUrl,
    finalUrl: finalParsedUrl,
    atsDetection,
    email: detectedEmail,
    companyName,
    jobTitle,
    redirectCount: redirectResult.redirectCount,
    redirectError: redirectResult.error,
  });
  const score = calculateScore(signals);
  const recommendation = getRecommendation(score);

  return {
    inputType,
    inputValue: input,
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

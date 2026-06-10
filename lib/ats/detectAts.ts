import { detectAshby } from "@/lib/ats/ashby";
import { detectGreenhouse } from "@/lib/ats/greenhouse";
import { detectLever } from "@/lib/ats/lever";
import type { AtsDetectionResult } from "@/lib/ats/types";

const UNKNOWN_RESULT: AtsDetectionResult = {
  provider: "unknown",
  confidence: "low",
  evidence: [],
};

function toUrl(input: string | URL | null | undefined) {
  if (!input) return null;
  if (input instanceof URL) return input;

  try {
    return new URL(input);
  } catch {
    return null;
  }
}

export function detectAts(
  input: string | URL | null | undefined,
): AtsDetectionResult {
  const url = toUrl(input);
  if (!url) {
    return { ...UNKNOWN_RESULT, evidence: [] };
  }

  return (
    detectGreenhouse(url) ??
    detectLever(url) ??
    detectAshby(url) ?? {
      ...UNKNOWN_RESULT,
      evidence: [`No supported ATS hostname matched ${url.hostname}.`],
    }
  );
}

import type {
  Recommendation,
  ScanSignal,
  SignalSeverity,
} from "@/lib/types";

const BASE_SCORE = 55;
const MIN_SCORE = 0;
const MAX_SCORE = 100;

// Info signals are basic context, such as HTTPS or listing completeness.
// Low and medium signals add modest evidence; high positives are reserved for
// strong external verification, such as finding the exact job in a public ATS.
const POSITIVE_POINTS: Record<SignalSeverity, number> = {
  info: 1,
  low: 4,
  medium: 8,
  high: 20,
};

// A failed lookup is mild caution, while direct financial or identity-data
// requests remain high-impact warnings.
const WARNING_POINTS: Record<SignalSeverity, number> = {
  info: 2,
  low: 5,
  medium: 13,
  high: 25,
};

export function calculateScore(signals: ScanSignal[]) {
  const score = signals.reduce((total, signal) => {
    if (signal.status === "positive") {
      return total + POSITIVE_POINTS[signal.severity];
    }
    if (signal.status === "warning") {
      return total - WARNING_POINTS[signal.severity];
    }
    return total;
  }, BASE_SCORE);

  return Math.max(MIN_SCORE, Math.min(MAX_SCORE, score));
}

export function getRecommendation(score: number): Recommendation {
  if (score >= 75) return "Lower Risk";
  if (score >= 45) return "Verify First";
  return "High Caution";
}

export function buildSummary(
  recommendation: Recommendation,
  signals: ScanSignal[],
) {
  const warnings = signals.filter((signal) => signal.status === "warning");
  const positives = signals.filter((signal) => signal.status === "positive");

  if (recommendation === "Lower Risk") {
    return `This scan found fewer risk signals${
      warnings.length ? ", with a few details still worth checking" : ""
    }. This scan is not a guarantee; confirm the role on the employer's official careers site before sharing sensitive information.`;
  }

  if (recommendation === "Verify First") {
    return `${warnings.length} risk signal${
      warnings.length === 1 ? " was" : "s were"
    } found alongside ${positives.length} positive signal${
      positives.length === 1 ? "" : "s"
    }. Verify before applying through an independent company channel.`;
  }

  return "Multiple high-risk or unresolved signals were found. High caution is recommended until the employer is independently verified.";
}

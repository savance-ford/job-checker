import type {
  Recommendation,
  ScanSignal,
  SignalSeverity,
} from "@/lib/types";

const POSITIVE_POINTS: Record<SignalSeverity, number> = {
  info: 3,
  low: 5,
  medium: 9,
  high: 14,
};

const WARNING_POINTS: Record<SignalSeverity, number> = {
  info: 2,
  low: 7,
  medium: 14,
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
  }, 55);

  return Math.max(0, Math.min(100, score));
}

export function getRecommendation(score: number): Recommendation {
  if (score >= 75) return "Apply";
  if (score >= 45) return "Verify First";
  return "High Caution";
}

export function buildSummary(
  recommendation: Recommendation,
  signals: ScanSignal[],
) {
  const warnings = signals.filter((signal) => signal.status === "warning");
  const positives = signals.filter((signal) => signal.status === "positive");

  if (recommendation === "Apply") {
    return `Several reassuring signals were found${
      warnings.length ? ", with a few details still worth checking" : ""
    }. Confirm the role on the employer's official careers site before sharing sensitive information.`;
  }

  if (recommendation === "Verify First") {
    return `${warnings.length} risk signal${
      warnings.length === 1 ? " was" : "s were"
    } found alongside ${positives.length} positive signal${
      positives.length === 1 ? "" : "s"
    }. Verify the recruiter and opening through an independent company channel.`;
  }

  return `Multiple high-risk or unresolved signals were found. Pause before sending money, banking details, identity documents, or other sensitive information.`;
}

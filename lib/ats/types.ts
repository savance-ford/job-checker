export type AtsProvider = "greenhouse" | "lever" | "ashby" | "unknown";
export type AtsConfidence = "low" | "medium" | "high";

export type AtsDetectionResult = {
  provider: AtsProvider;
  companySlug?: string;
  jobId?: string;
  confidence: AtsConfidence;
  evidence: string[];
};

export type KnownAtsDetectionResult = AtsDetectionResult & {
  provider: Exclude<AtsProvider, "unknown">;
};

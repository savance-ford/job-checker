export type AtsProvider = "greenhouse" | "lever" | "ashby" | "unknown";
export type AtsConfidence = "low" | "medium" | "high";

export type AtsDetectionResult = {
  provider: AtsProvider;
  companySlug?: string;
  jobId?: string;
  confidence: AtsConfidence;
  evidence: string[];
};

export type AtsVerificationResult = {
  provider: AtsProvider;
  attempted: boolean;
  verified: boolean;
  status: "verified" | "not_found" | "unsupported" | "error";
  companySlug?: string;
  jobId?: string;
  matchedTitle?: string;
  sourceUrl?: string;
  message: string;
  evidence: string[];
};

export type KnownAtsDetectionResult = AtsDetectionResult & {
  provider: Exclude<AtsProvider, "unknown">;
};

export type AtsPublicJob = {
  id?: string;
  title?: string;
  sourceUrl?: string;
};

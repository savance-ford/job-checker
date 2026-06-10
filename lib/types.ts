export const inputTypes = [
  "job_url",
  "job_description",
  "recruiter_email",
  "job_offer",
] as const;

export type InputType = (typeof inputTypes)[number];

export type Recommendation = "Apply" | "Verify First" | "High Caution";
export type SignalStatus = "positive" | "warning" | "unknown";
export type SignalSeverity = "info" | "low" | "medium" | "high";

export type ScanSignal = {
  id?: string;
  label: string;
  status: SignalStatus;
  severity: SignalSeverity;
  message: string;
  evidence?: string | null;
};

export type ScanAnalysis = {
  inputType: InputType;
  inputValue: string;
  companyName: string | null;
  jobTitle: string | null;
  detectedEmail: string | null;
  originalUrl: string | null;
  finalUrl: string | null;
  score: number;
  recommendation: Recommendation;
  summary: string;
  signals: ScanSignal[];
};

export type StoredScan = {
  id: string;
  input_type: InputType;
  input_value: string;
  company_name: string | null;
  job_title: string | null;
  detected_email: string | null;
  original_url: string | null;
  final_url: string | null;
  score: number;
  recommendation: Recommendation;
  summary: string | null;
  created_at: string;
};

export type StoredSignal = ScanSignal & {
  id: string;
  scan_id: string;
  created_at: string;
};

export type ScanReport = {
  scan: StoredScan;
  signals: StoredSignal[];
};

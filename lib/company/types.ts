export type CompanyWebsiteVerificationResult = {
  attempted: boolean;
  websiteFound: boolean;
  domain?: string;
  normalizedUrl?: string;
  status: "found" | "not_found" | "invalid" | "error" | "not_attempted";
  message: string;
  evidence: string[];
};

export type CareersPageVerificationResult = {
  attempted: boolean;
  found: boolean;
  careersUrl?: string;
  status: "found" | "not_found" | "error" | "not_attempted";
  message: string;
  evidence: string[];
  linkedAtsProvider?: string;
  linkedAtsSlug?: string;
};

export type PublicHtmlResult = {
  response: Response;
  finalUrl: URL;
  html: string | null;
};

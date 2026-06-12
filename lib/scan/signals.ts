import {
  hasEmploymentType,
  hasLocation,
  hasPay,
} from "@/lib/scan/extractors";
import type {
  AtsDetectionResult,
  AtsVerificationResult,
} from "@/lib/ats/types";
import {
  hasUnusualDomainPattern,
  hostnameMatches,
  isFreeEmailDomain,
  isUrlShortener,
} from "@/lib/url/domain";
import type { InputType, ScanSignal } from "@/lib/types";

type SignalContext = {
  input: string;
  inputType: InputType;
  originalUrl: URL | null;
  finalUrl: URL | null;
  atsDetection: AtsDetectionResult;
  atsVerification: AtsVerificationResult | null;
  email: string | null;
  companyName: string | null;
  jobTitle: string | null;
  redirectCount: number;
  redirectError: string | null;
};

function signal(
  value: ScanSignal,
  condition: boolean,
): ScanSignal | null {
  return condition ? value : null;
}

function getAtsVerificationSignal(
  result: AtsVerificationResult | null,
): ScanSignal | null {
  if (!result) return null;

  const evidence = result.evidence.join("; ");

  if (result.status === "verified") {
    return {
      label: "Job found in public ATS feed",
      status: "positive",
      severity: "high",
      message:
        "The exact job was found in the detected ATS public feed. Public ATS verification is stronger evidence than HTTPS.",
      evidence,
    };
  }

  if (result.status === "not_found") {
    return {
      label: "Could not verify exact job",
      status: "warning",
      severity: "low",
      message:
        "A known ATS was detected, but this exact job was not found in its public feed. Verify the opening on the employer's official careers page.",
      evidence,
    };
  }

  return {
    label: "ATS verification incomplete",
    status: "unknown",
    severity: "info",
    message:
      "The ATS was detected, but a network or feed-format issue prevented exact job verification. No score penalty was applied.",
    evidence,
  };
}

export function detectSignals(context: SignalContext) {
  const {
    input,
    inputType,
    originalUrl,
    finalUrl,
    atsDetection,
    atsVerification,
    email,
    companyName,
    jobTitle,
    redirectCount,
    redirectError,
  } = context;
  const destinationUrl = finalUrl ?? originalUrl;
  const emailDomain = email?.split("@")[1] ?? null;
  const knownAtsDetected = atsDetection.provider !== "unknown";
  const atsEvidence = knownAtsDetected
    ? [
        `Provider: ${atsDetection.provider}`,
        `Confidence: ${atsDetection.confidence}`,
        ...atsDetection.evidence,
      ].join("; ")
    : null;

  const signals = [
    signal(
      {
        label: "Secure connection detected",
        status: "positive",
        severity: "info",
        message:
          "The link uses HTTPS, but HTTPS alone does not verify that a job is legitimate.",
        evidence: destinationUrl?.origin,
      },
      destinationUrl?.protocol === "https:",
    ),
    signal(
      {
        label: "Unencrypted job link",
        status: "warning",
        severity: "medium",
        message: "The job link does not use HTTPS.",
        evidence: destinationUrl?.origin,
      },
      destinationUrl?.protocol === "http:",
    ),
    signal(
      {
        label: "Known ATS detected",
        status: "positive",
        severity: "low",
        message:
          "The apply link appears to use a known applicant tracking system.",
        evidence: atsEvidence,
      },
      knownAtsDetected,
    ),
    getAtsVerificationSignal(atsVerification),
    signal(
      {
        label: "Shortened URL",
        status: "warning",
        severity: "medium",
        message:
          "The link uses a URL shortener, which hides the destination until opened.",
        evidence: originalUrl?.hostname,
      },
      Boolean(originalUrl && isUrlShortener(originalUrl.hostname)),
    ),
    signal(
      {
        label: "Unusual domain pattern",
        status: "warning",
        severity: "medium",
        message:
          "The link has a domain pattern that deserves independent verification.",
        evidence: originalUrl?.hostname,
      },
      Boolean(originalUrl && hasUnusualDomainPattern(originalUrl.hostname)),
    ),
    signal(
      {
        label: "Several redirects",
        status: "warning",
        severity: "low",
        message: "The link passed through several redirects before its destination.",
        evidence: `${redirectCount} redirects`,
      },
      redirectCount >= 3,
    ),
    signal(
      {
        label: "Destination could not be verified",
        status: "unknown",
        severity: "info",
        message:
          "The checker could not safely reach the link destination. Review the URL manually.",
        evidence: redirectError,
      },
      Boolean(originalUrl && redirectError),
    ),
    signal(
      {
        label: "Free recruiter email",
        status: "warning",
        severity: "medium",
        message:
          "The recruiter contact uses a free consumer email provider instead of a company domain.",
        evidence: email,
      },
      Boolean(
        email &&
          isFreeEmailDomain(email) &&
          (inputType === "recruiter_email" || /\b(recruiter|hiring|interview)\b/i.test(input)),
      ),
    ),
    signal(
      {
        label: "Company-domain email",
        status: "positive",
        severity: "low",
        message: "The contact email uses a custom domain.",
        evidence: email,
      },
      Boolean(email && !isFreeEmailDomain(email)),
    ),
    signal(
      {
        label: "Contact and job domains match",
        status: "positive",
        severity: "medium",
        message:
          "The recruiter email domain matches the submitted job-link domain.",
        evidence: emailDomain,
      },
      Boolean(
        emailDomain &&
          destinationUrl &&
          !knownAtsDetected &&
          (hostnameMatches(destinationUrl.hostname, emailDomain) ||
            hostnameMatches(emailDomain, destinationUrl.hostname)),
      ),
    ),
    signal(
      {
        label: "Upfront payment requested",
        status: "warning",
        severity: "high",
        message: "The message appears to ask the applicant to pay money.",
        evidence: "Payment or fee language detected",
      },
      /\b(pay|payment|fee|wire|transfer|send)\b.{0,35}\b(money|funds|fee|\$\d+)\b/i.test(
        input,
      ),
    ),
    signal(
      {
        label: "Check deposit mentioned",
        status: "warning",
        severity: "high",
        message:
          "The message mentions depositing a check, a common reason to verify an offer before acting.",
        evidence: "Check deposit language detected",
      },
      /\b(deposit|cash|mobile deposit)\b.{0,30}\b(check|cheque)\b|\bcheck\b.{0,30}\b(deposit|cash)\b/i.test(
        input,
      ),
    ),
    signal(
      {
        label: "Equipment purchase requested",
        status: "warning",
        severity: "high",
        message:
          "The applicant appears to be asked to purchase equipment or software.",
        evidence: "Purchase or reimbursement language detected",
      },
      /\b(buy|purchase|pay for|reimburse)\b.{0,45}\b(equipment|laptop|computer|software|supplies)\b/i.test(
        input,
      ),
    ),
    signal(
      {
        label: "Crypto or gift card request",
        status: "warning",
        severity: "high",
        message: "The message mentions payment through crypto or gift cards.",
        evidence: "Crypto or gift card language detected",
      },
      /\b(bitcoin|cryptocurrency|crypto wallet|gift cards?|steam card|apple card)\b/i.test(
        input,
      ),
    ),
    signal(
      {
        label: "Sensitive information requested early",
        status: "warning",
        severity: "high",
        message:
          "The message requests identity or banking details in an early recruiting context.",
        evidence: "SSN, bank, routing, or identity-document language detected",
      },
      /\b(ssn|social security|bank account|routing number|driver'?s license|passport)\b/i.test(
        input,
      ),
    ),
    signal(
      {
        label: "No-interview or immediate-start language",
        status: "warning",
        severity: "medium",
        message:
          "The message suggests starting without a normal interview or verification process.",
        evidence: "Immediate hiring language detected",
      },
      /\b(no interview|without an interview|start immediately|immediate start|hired immediately|instant hire)\b/i.test(
        input,
      ),
    ),
    signal(
      {
        label: "Unusually high pay claim",
        status: "warning",
        severity: "medium",
        message:
          "The message combines high earnings with low-effort or no-experience language.",
        evidence: "High-pay and low-effort language detected together",
      },
      /\b(\$\s?(?:[5-9]\d|[1-9]\d{2,})\s*(?:\/|per)\s*(?:hour|hr)|earn\s+\$\s?\d{3,})\b/i.test(
        input,
      ) &&
        /\b(no experience|easy work|simple tasks?|little effort|work from your phone)\b/i.test(
          input,
        ),
    ),
    signal(
      {
        label: "Clear job title",
        status: "positive",
        severity: "low",
        message: "A specific job title was detected.",
        evidence: jobTitle,
      },
      Boolean(jobTitle),
    ),
    signal(
      {
        label: "Company identified",
        status: "positive",
        severity: "low",
        message: "A company name or company-domain identity was detected.",
        evidence: companyName,
      },
      Boolean(companyName),
    ),
    signal(
      {
        label: "Location details present",
        status: "positive",
        severity: "info",
        message: "The posting includes work-location information.",
      },
      hasLocation(input),
    ),
    signal(
      {
        label: "Pay details present",
        status: "positive",
        severity: "info",
        message: "The posting includes pay or compensation information.",
      },
      hasPay(input),
    ),
    signal(
      {
        label: "Employment type present",
        status: "positive",
        severity: "info",
        message: "The posting identifies an employment type.",
      },
      hasEmploymentType(input),
    ),
  ];

  const detected = signals.filter(
    (item): item is ScanSignal => item !== null,
  );

  if (!detected.length) {
    detected.push({
      label: "Limited verifiable detail",
      status: "unknown",
      severity: "info",
      message:
        "The input did not include enough structured detail to confirm common positive or risk signals.",
    });
  }

  return detected;
}

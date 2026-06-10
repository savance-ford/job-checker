import type { InputType } from "@/lib/types";

export type CategoryPageConfig = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  detail: string;
  defaultInputType: InputType;
  checks: string[];
};

export const categoryPages = {
  "job-scam-checker": {
    slug: "job-scam-checker",
    title: "Job scam checker",
    description:
      "Check a job post, recruiter message, or offer for evidence-based risk signals before you apply.",
    intro:
      "Paste the details you received to review the link, contact information, hiring language, and requests for money or sensitive data.",
    detail:
      "The report highlights concrete details such as shortened links, free recruiter email accounts, payment requests, vague hiring language, and missing job information. It also records positive signals like secure links and known applicant tracking systems.",
    defaultInputType: "job_description",
    checks: [
      "Review payment, check-deposit, and equipment-purchase language",
      "Check recruiter email and job-link patterns",
      "Summarize positive, risky, and unresolved evidence",
    ],
  },
  "ghost-job-checker": {
    slug: "ghost-job-checker",
    title: "Ghost job checker",
    description:
      "Review a job listing for details that may indicate an inactive, vague, or difficult-to-verify opening.",
    intro:
      "Check whether a posting includes the basic details you would expect from a current role and whether its company and application path can be verified.",
    detail:
      "No automated check can confirm whether an employer is actively filling a role. This report focuses on observable clues: a clear title, location, employment type, pay details, company identity, and a credible application destination.",
    defaultInputType: "job_description",
    checks: [
      "Look for a clear title, location, pay, and employment type",
      "Review whether the employer can be identified",
      "Flag details that need direct confirmation from the company",
    ],
  },
  "remote-job-scam-checker": {
    slug: "remote-job-scam-checker",
    title: "Remote job scam checker",
    description:
      "Check a remote job post or recruiter message for common evidence-based risk signals.",
    intro:
      "Remote hiring can be legitimate and still require extra verification. Review the contact, application link, hiring process, and payment language before applying.",
    detail:
      "The checker pays particular attention to immediate-hire claims, free email accounts, equipment purchase requests, check deposits, and requests for banking or identity information.",
    defaultInputType: "job_description",
    checks: [
      "Review remote hiring and no-interview language",
      "Detect equipment, check, crypto, and gift-card requests",
      "Check whether the application link uses a known ATS",
    ],
  },
  "work-from-home-job-scam-checker": {
    slug: "work-from-home-job-scam-checker",
    title: "Work-from-home job scam checker",
    description:
      "Review a work-from-home opportunity for payment requests, unusual hiring claims, and other risk signals.",
    intro:
      "Paste the complete posting or message. The checker will separate reassuring details from claims that deserve independent verification.",
    detail:
      "Work-from-home offers vary widely. The report looks for factual signals rather than making accusations, with special attention to high-pay, low-effort claims and requests to move money or buy supplies.",
    defaultInputType: "job_description",
    checks: [
      "Flag unusually high-pay and low-effort combinations",
      "Review upfront fees and equipment purchase requests",
      "Identify missing employer and role details",
    ],
  },
  "data-entry-job-scam-checker": {
    slug: "data-entry-job-scam-checker",
    title: "Data entry job scam checker",
    description:
      "Check a data entry job post or offer for common risk signals before sharing information.",
    intro:
      "Data entry listings are often brief, so small details matter. Review the pay claims, recruiter contact, interview process, and any financial requests.",
    detail:
      "The report looks for unusually high hourly pay paired with no-experience claims, immediate starts, check deposits, equipment purchases, and sensitive-information requests.",
    defaultInputType: "job_description",
    checks: [
      "Compare pay claims with low-effort or no-experience language",
      "Review the recruiter email and application URL",
      "Flag requests for money or sensitive information",
    ],
  },
  "customer-service-job-scam-checker": {
    slug: "customer-service-job-scam-checker",
    title: "Customer service job scam checker",
    description:
      "Review a customer service job post, recruiter email, or offer for evidence-based risk signals.",
    intro:
      "Check whether the employer, role, schedule, application path, and hiring process provide enough detail to verify independently.",
    detail:
      "A legitimate customer service role should still be verified. The report reviews the link and contact details while flagging immediate-hire language, payment requests, and early requests for identity or bank information.",
    defaultInputType: "job_description",
    checks: [
      "Look for clear company, role, location, and employment details",
      "Review no-interview and immediate-start language",
      "Flag early requests for banking or identity information",
    ],
  },
  "recruiter-email-checker": {
    slug: "recruiter-email-checker",
    title: "Recruiter email checker",
    description:
      "Check a recruiter email address or message for contact, link, and hiring-process risk signals.",
    intro:
      "Paste the full message when possible. A complete email gives the checker more evidence than an address alone.",
    detail:
      "The report checks whether the sender uses a free consumer email account, whether included links hide or redirect their destination, and whether the message asks for money, gift cards, equipment purchases, or sensitive information.",
    defaultInputType: "recruiter_email",
    checks: [
      "Identify free consumer email providers",
      "Review links and redirect behavior",
      "Flag financial and sensitive-information requests",
    ],
  },
  "job-offer-checker": {
    slug: "job-offer-checker",
    title: "Job offer checker",
    description:
      "Review a job offer message for unusual payment, equipment, identity, and hiring-process signals.",
    intro:
      "Paste the offer text before accepting or sending personal information. The report will show what looks reassuring and what needs verification.",
    detail:
      "The checker cannot validate a contract or give legal advice. It can identify observable concerns such as an offer without an interview, requests to deposit a check, equipment purchases, crypto or gift-card payments, and early banking requests.",
    defaultInputType: "job_offer",
    checks: [
      "Review whether a normal interview process is described",
      "Detect check, equipment, crypto, and gift-card language",
      "Flag early requests for banking or identity details",
    ],
  },
} satisfies Record<string, CategoryPageConfig>;

export type CategorySlug = keyof typeof categoryPages;

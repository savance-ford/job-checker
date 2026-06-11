import type { InputType } from "@/lib/types";

export type CategoryFaq = {
  question: string;
  answer: string;
};

export type CategoryPageConfig = {
  slug: string;
  title: string;
  metadataTitle: string;
  description: string;
  intro: string;
  detail: string;
  defaultInputType: InputType;
  checks: string[];
  warningSigns: string[];
  faqs: CategoryFaq[];
};

export const categoryPages = {
  "job-scam-checker": {
    slug: "job-scam-checker",
    title: "Job scam checker",
    metadataTitle: "Check a Job Post for Risk Signals",
    description:
      "Review a job post, recruiter message, or offer for payment requests, suspicious links, and details worth verifying.",
    intro:
      "Paste the details you received to review the link, contact information, hiring language, and requests for money or sensitive data.",
    detail:
      "The report separates reassuring details from risk signals and facts the checker could not verify. It reviews secure links, recruiter email patterns, public ATS feeds, payment requests, and the basic details expected in a job posting.",
    defaultInputType: "job_description",
    checks: [
      "Review payment, check-deposit, and equipment-purchase language",
      "Check recruiter email and job-link patterns",
      "Look for public ATS job verification when available",
    ],
    warningSigns: [
      "Requests to pay a fee or move money before starting",
      "A recruiter using a personal email with no company verification",
      "An offer made without a normal interview or role discussion",
      "Early requests for banking details, SSN, or identity documents",
    ],
    faqs: [
      {
        question: "Can this checker prove that a job is legitimate?",
        answer:
          "No. It identifies evidence-based signals and verification gaps. Confirm the opening through the employer's official careers page before sharing sensitive information.",
      },
      {
        question: "What should I paste for the best report?",
        answer:
          "Paste the full posting or message, including the application link, company name, job title, recruiter contact, pay, and hiring instructions.",
      },
      {
        question: "What does Verify First mean?",
        answer:
          "It means the report found details that deserve an independent check before you apply or send personal information.",
      },
    ],
  },
  "ghost-job-checker": {
    slug: "ghost-job-checker",
    title: "Ghost job checker",
    metadataTitle: "Review a Listing for Ghost Job Warning Signs",
    description:
      "Review a listing for stale, vague, or difficult-to-confirm details that may warrant checking the employer's current careers page.",
    intro:
      "Check whether a posting includes the basic details expected from a current role and whether its company and application path can be verified.",
    detail:
      "No automated tool can confirm whether an employer is actively interviewing. This report focuses on observable clues such as a clear title, location, employment type, pay details, company identity, and a current public application destination.",
    defaultInputType: "job_description",
    checks: [
      "Look for a clear title, location, pay, and employment type",
      "Review whether the employer and application path can be identified",
      "Check public ATS feeds when a supported job link is provided",
    ],
    warningSigns: [
      "The same listing remains open for a long period without updates",
      "The role has little detail about responsibilities or team needs",
      "The job appears on an aggregator but not the company careers page",
      "The application link no longer resolves to a current posting",
    ],
    faqs: [
      {
        question: "What is a ghost job?",
        answer:
          "The term usually describes a published role that may not be actively filled. A listing alone cannot reveal the employer's intent.",
      },
      {
        question: "Can an old listing still be a real opening?",
        answer:
          "Yes. Some employers hire continuously or reuse listings. Check the posting date and ask the employer whether the role is currently active.",
      },
      {
        question: "Does a missing ATS match prove the role is inactive?",
        answer:
          "No. Feeds can change, links can be customized, and some jobs are not publicly listed. Treat a missing match as a reason to verify.",
      },
    ],
  },
  "remote-job-scam-checker": {
    slug: "remote-job-scam-checker",
    title: "Remote job scam checker",
    metadataTitle: "Verify a Remote Job Post Before Applying",
    description:
      "Check a remote job post or recruiter message for unusual hiring claims, payment requests, and application-link evidence.",
    intro:
      "Remote hiring can be legitimate and still require extra verification. Review the contact, application link, hiring process, and payment language before applying.",
    detail:
      "The checker gives extra attention to immediate-hire claims, personal email accounts, equipment purchase requests, check deposits, and early requests for banking or identity information.",
    defaultInputType: "job_description",
    checks: [
      "Review remote hiring and no-interview language",
      "Detect equipment, check, crypto, and gift-card requests",
      "Check whether the application link uses a supported ATS",
    ],
    warningSigns: [
      "The interview happens only through text or an unfamiliar chat app",
      "The employer sends a check to purchase home-office equipment",
      "High pay is promised for simple work with no relevant experience",
      "The recruiter cannot be confirmed through the company website",
    ],
    faqs: [
      {
        question: "Are remote jobs more difficult to verify?",
        answer:
          "They can be because the process may happen entirely online. Use the employer's official site and independently found contact details.",
      },
      {
        question: "Is buying equipment always a warning sign?",
        answer:
          "Not always, but requests to deposit a check, pay a vendor, or send money before starting deserve careful verification.",
      },
      {
        question: "What is a normal remote interview process?",
        answer:
          "Processes vary, but they commonly include identifiable company representatives, scheduled conversations, and written details that match the official careers page.",
      },
    ],
  },
  "work-from-home-job-scam-checker": {
    slug: "work-from-home-job-scam-checker",
    title: "Work-from-home job scam checker",
    metadataTitle: "Check a Work-From-Home Job Offer",
    description:
      "Review a work-from-home opportunity for high-pay claims, upfront costs, equipment requests, and missing employer details.",
    intro:
      "Paste the complete posting or message. The checker will separate reassuring details from claims that deserve independent verification.",
    detail:
      "Work-from-home offers vary widely. The report focuses on factual signals, with particular attention to high-pay and low-effort claims, requests to move money, and unclear employer identities.",
    defaultInputType: "job_description",
    checks: [
      "Flag unusually high-pay and low-effort combinations",
      "Review upfront fees and equipment purchase requests",
      "Identify missing employer and role details",
    ],
    warningSigns: [
      "Guaranteed earnings with little explanation of the actual work",
      "A required starter kit, training fee, or membership payment",
      "Instructions to receive and resend packages or transfer funds",
      "No verifiable company address, careers page, or business contact",
    ],
    faqs: [
      {
        question: "How can I verify a work-from-home company?",
        answer:
          "Find the company's official website independently, review its careers page, and contact the company through a published phone number or email.",
      },
      {
        question: "Should I pay for training before I am hired?",
        answer:
          "Be cautious with required payments. Verify the employer and written terms independently before paying any fee.",
      },
      {
        question: "Does a professional-looking website prove an offer is legitimate?",
        answer:
          "No. A polished site is only one signal. Check the domain, company identity, recruiter contact, and official job listing together.",
      },
    ],
  },
  "data-entry-job-scam-checker": {
    slug: "data-entry-job-scam-checker",
    title: "Data entry job scam checker",
    metadataTitle: "Review a Data Entry Job Post",
    description:
      "Check a data entry job post or offer for unusual pay, immediate hiring, financial requests, and contact details worth verifying.",
    intro:
      "Data entry listings are often brief, so small details matter. Review the pay claims, recruiter contact, interview process, and any financial requests.",
    detail:
      "The report looks for unusually high hourly pay paired with no-experience claims, immediate starts, check deposits, equipment purchases, and requests for sensitive information.",
    defaultInputType: "job_description",
    checks: [
      "Compare pay claims with low-effort or no-experience language",
      "Review the recruiter email and application URL",
      "Flag requests for money or sensitive information",
    ],
    warningSigns: [
      "Very high hourly pay for basic tasks with no experience required",
      "An immediate offer before skills, schedule, or duties are discussed",
      "A request to deposit checks or process payments as part of the role",
      "A vague company identity paired with urgent onboarding requests",
    ],
    faqs: [
      {
        question: "Why do data entry listings need extra review?",
        answer:
          "The job title is broad and postings may provide little detail. Clear duties, realistic pay, and a verifiable employer make evaluation easier.",
      },
      {
        question: "Is no experience required always suspicious?",
        answer:
          "No. Entry-level roles exist, but unusually high pay combined with urgency or financial requests deserves verification.",
      },
      {
        question: "What details should a data entry post include?",
        answer:
          "Look for the employer, specific duties, expected hours, employment type, pay structure, location rules, and a credible application process.",
      },
    ],
  },
  "customer-service-job-scam-checker": {
    slug: "customer-service-job-scam-checker",
    title: "Customer service job scam checker",
    metadataTitle: "Check a Customer Service Job Post",
    description:
      "Review a customer service role for employer details, hiring-process evidence, unusual payment requests, and application-link safety.",
    intro:
      "Check whether the employer, role, schedule, application path, and hiring process provide enough detail to verify independently.",
    detail:
      "The report reviews the link and contact details while flagging immediate-hire language, payment requests, and early requests for identity or bank information.",
    defaultInputType: "job_description",
    checks: [
      "Look for clear company, role, schedule, and employment details",
      "Review no-interview and immediate-start language",
      "Flag early requests for banking or identity information",
    ],
    warningSigns: [
      "No details about the product, customers, schedule, or support channel",
      "A job offer based only on a text conversation",
      "Requests to buy a headset, laptop, or software from a named vendor",
      "Banking or identity-document requests before formal onboarding",
    ],
    faqs: [
      {
        question: "What should a customer service listing explain?",
        answer:
          "It should usually identify the employer, customer or product area, support channels, schedule, location expectations, and employment type.",
      },
      {
        question: "Can a customer service interview be fully remote?",
        answer:
          "Yes. Verify that interviewers use credible company contact details and that the role appears on the official careers page.",
      },
      {
        question: "When is an equipment request concerning?",
        answer:
          "Be cautious when you must pay first, deposit a check, or buy from a specific vendor before the employer is independently verified.",
      },
    ],
  },
  "recruiter-email-checker": {
    slug: "recruiter-email-checker",
    title: "Recruiter email checker",
    metadataTitle: "Review a Recruiter Email or Message",
    description:
      "Check a recruiter email or message for contact-domain evidence, suspicious links, urgent requests, and hiring details to verify.",
    intro:
      "Paste the full message when possible. A complete email gives the checker more evidence than an address alone.",
    detail:
      "The report checks whether the sender uses a personal email provider, whether included links hide or redirect their destination, and whether the message asks for money, equipment purchases, or sensitive information.",
    defaultInputType: "recruiter_email",
    checks: [
      "Identify personal email providers and custom company domains",
      "Review included links and redirect behavior",
      "Flag financial and sensitive-information requests",
    ],
    warningSigns: [
      "The sender domain does not match the company they claim to represent",
      "The message creates urgency before explaining the role",
      "Links use shorteners or lead to an unrelated application domain",
      "The recruiter requests money or sensitive records early",
    ],
    faqs: [
      {
        question: "Does a personal recruiter email prove a problem?",
        answer:
          "No. Independent recruiters may use different domains, but you should confirm their identity and relationship with the employer.",
      },
      {
        question: "How do I check a recruiter domain?",
        answer:
          "Compare it with the company's official website and contact the employer through a channel you found independently.",
      },
      {
        question: "Should I click links in an unexpected recruiter email?",
        answer:
          "Review the visible destination first. When possible, navigate to the employer's careers page yourself instead of relying on the message link.",
      },
    ],
  },
  "job-offer-checker": {
    slug: "job-offer-checker",
    title: "Job offer checker",
    metadataTitle: "Check a Job Offer Before You Respond",
    description:
      "Review a job offer for interview evidence, employer details, payment requests, and sensitive-information requests before responding.",
    intro:
      "Paste the offer text before accepting or sending personal information. The report will show what looks reassuring and what needs verification.",
    detail:
      "The checker cannot validate a contract or provide legal advice. It identifies observable concerns such as an offer without an interview, check deposits, equipment purchases, unusual payment methods, and early banking requests.",
    defaultInputType: "job_offer",
    checks: [
      "Review whether a normal interview process is described",
      "Detect check, equipment, crypto, and gift-card language",
      "Flag early requests for banking or identity details",
    ],
    warningSigns: [
      "An offer arrives before any meaningful interview",
      "The employer sends a check and directs you to buy equipment",
      "The letter uses a company name but unrelated email or web domains",
      "You are pressured to send banking or identity documents immediately",
    ],
    faqs: [
      {
        question: "Can a legitimate employer make a fast offer?",
        answer:
          "Yes, but the employer, role, interviewers, and written terms should still be independently verifiable.",
      },
      {
        question: "What should I verify in an offer letter?",
        answer:
          "Check the legal employer name, title, pay, employment type, start date, manager or contact, and whether those details match prior conversations.",
      },
      {
        question: "When should I share payroll information?",
        answer:
          "Only after verifying the employer and completing a credible hiring process through secure onboarding channels.",
      },
    ],
  },
} satisfies Record<string, CategoryPageConfig>;

export type CategorySlug = keyof typeof categoryPages;

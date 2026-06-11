import type { Metadata } from "next";

import { InformationPage } from "@/components/InformationPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About the JobCheck Job Trust Checker",
  description:
    "Learn how JobCheck reviews job posts, recruiter emails, offers, and apply links for evidence-based risk and verification signals.",
  path: "/about",
});

const sections = [
  {
    title: "What JobCheck does",
    paragraphs: [
      "JobCheck is a job trust checker that reviews details people can independently verify. It can help you examine a suspicious job post, recruiter email, job offer, or apply link before continuing.",
      "A report organizes evidence-based risk signals and verification signals into a trust score, recommendation, and checklist. The recommendation scale is Lower Risk, Verify First, or High Caution.",
    ],
  },
  {
    title: "What the checks cover",
    items: [
      "Company and recruiter details that may need independent confirmation.",
      "Application links, redirects, domains, and supported applicant tracking systems.",
      "Language involving payments, sensitive information, unusual hiring steps, or pressure.",
      "Missing role details and other patterns associated with hard-to-verify or ghost job listings.",
    ],
  },
  {
    title: "What a report cannot prove",
    paragraphs: [
      "JobCheck does not prove that a job or company is fraudulent or legitimate. Automated checks can miss context, and public information can be incomplete or outdated.",
      "Use the report as a starting point. Verify the employer through its official website, careers page, and independently obtained contact information.",
    ],
  },
] as const;

export default function AboutPage() {
  return (
    <InformationPage
      eyebrow="About JobCheck"
      title="Evidence to help you verify a job opportunity"
      intro="JobCheck turns observable details into a practical report so job seekers can decide what to verify next."
      sections={sections}
      note="JobCheck provides informational risk signals, not a guarantee or a legal determination."
    />
  );
}

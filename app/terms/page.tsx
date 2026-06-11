import type { Metadata } from "next";

import { InformationPage } from "@/components/InformationPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Use",
  description:
    "Review the terms for using JobCheck's informational job risk signals, recommendations, and shareable public reports.",
  path: "/terms",
});

const sections = [
  {
    title: "Informational use only",
    paragraphs: [
      "JobCheck provides informational risk signals and verification signals only. Scan results are automated screening aids and are not employment, legal, financial, or fraud-detection advice or guarantees.",
      "There is no guarantee that a score, recommendation, signal, or report is accurate, complete, current, or suitable for a particular decision.",
    ],
  },
  {
    title: "Your responsibility",
    paragraphs: [
      "You are responsible for independently verifying employers, recruiters, job openings, application links, and requests for information or payment.",
      "The site owner is not responsible for employment, financial, legal, privacy, or other decisions made based on scan results or report content.",
    ],
  },
  {
    title: "Acceptable use",
    items: [
      "Do not use the service to harass, impersonate, defame, or make unsupported accusations about a person or organization.",
      "Do not submit unlawful content, malicious links, or information you do not have permission to process.",
      "Do not attempt to disrupt, overload, reverse engineer, or misuse the service.",
      "Do not treat a report as a guarantee that an opportunity should or should not be pursued.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <InformationPage
      eyebrow="Terms"
      title="Terms for using JobCheck"
      intro="Use JobCheck as one source of information, then verify important details through independent official channels."
      sections={sections}
    />
  );
}

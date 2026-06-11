import type { Metadata } from "next";

import { InformationPage } from "@/components/InformationPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Read how the JobCheck MVP handles submitted scan inputs, generated signals, public report links, and sensitive personal information.",
  path: "/privacy",
});

const sections = [
  {
    title: "Public reports",
    paragraphs: [
      "Reports are public to anyone with the link. Full submitted text is not shown on public report pages, but a report may display derived details such as an input type, detected company or job title, URL domains, email domains, and generated evidence signals.",
      "Do not paste Social Security numbers, banking details, passwords, home addresses, identity documents, or other sensitive personal information.",
    ],
  },
  {
    title: "Information the app may store",
    paragraphs: [
      "The app may store scan inputs, detected details, generated signals, scores, recommendations, and report identifiers to process scans and provide saved reports.",
      "Public report responses are designed not to return the full original submitted input. This does not remove the need to avoid submitting sensitive information.",
    ],
  },
  {
    title: "Analytics and service changes",
    paragraphs: [
      "The app may use privacy-conscious analytics in the future to understand general site usage and improve reliability. This policy may be updated if the service or its data practices change.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <InformationPage
      eyebrow="Privacy"
      title="Privacy behavior for scans and public reports"
      intro="This page explains the general privacy behavior of the current JobCheck MVP."
      sections={sections}
      note="This is a general MVP privacy policy and is not legal advice."
    />
  );
}

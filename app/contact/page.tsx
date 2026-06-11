import type { Metadata } from "next";

import { InformationPage } from "@/components/InformationPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact JobCheck",
  description:
    "Find current contact guidance for questions, corrections, or feedback about JobCheck and its public job trust reports.",
  path: "/contact",
});

const sections = [
  {
    title: "Contact",
    paragraphs: [
      "For now, use the contact method listed by the site owner.",
      "When reporting a problem, describe the page or feature involved without including Social Security numbers, banking details, passwords, identity documents, home addresses, or other sensitive personal information.",
    ],
  },
  {
    title: "Questions about a report",
    paragraphs: [
      "JobCheck cannot contact an employer or recruiter on your behalf. For verification, find the employer's official website independently and use the contact information published there.",
      "Reports are public to anyone with the link. Do not send a report link to someone who should not have access to its derived summary and evidence signals.",
    ],
  },
] as const;

export default function ContactPage() {
  return (
    <InformationPage
      eyebrow="Contact"
      title="Questions or feedback about JobCheck"
      intro="Use the site owner's listed contact method for general questions, corrections, or technical feedback."
      sections={sections}
    />
  );
}

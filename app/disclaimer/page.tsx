import type { Metadata } from "next";

import { InformationPage } from "@/components/InformationPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Job Trust Report Disclaimer",
  description:
    "Understand the limits of JobTrustCheck's automated risk and verification signals and how to independently verify an employer.",
  path: "/disclaimer",
});

const sections = [
  {
    title: "What the tool reports",
    paragraphs: [
      "JobTrustCheck highlights risk signals and verification signals found in submitted job posts, URLs, recruiter emails, and offer text. A Lower Risk, Verify First, or High Caution recommendation summarizes those signals; it is not a guarantee.",
    ],
  },
  {
    title: "What the tool does not confirm",
    paragraphs: [
      "The tool does not confirm whether a job is real, fake, fraudulent, or safe. It may miss relevant facts, and a signal can have more than one explanation.",
      "Verify the opening directly through the employer's official website or careers page. Find that site independently instead of relying only on contact details or links in a message.",
    ],
  },
  {
    title: "Protect sensitive information",
    paragraphs: [
      "Avoid sending money, banking details, Social Security numbers, identity documents, or other sensitive information unless the employer is independently verified and you understand why the information is required.",
    ],
  },
] as const;

export default function DisclaimerPage() {
  return (
    <InformationPage
      eyebrow="Disclaimer"
      title="A scan is a starting point, not a final determination"
      intro="JobTrustCheck helps organize details worth checking, but it cannot replace independent verification or professional advice."
      sections={sections}
    />
  );
}

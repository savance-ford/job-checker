import type { Metadata } from "next";

import { CategoryLandingPage } from "@/components/CategoryLandingPage";
import { categoryPages } from "@/lib/categoryPages";
import { createPageMetadata } from "@/lib/seo";

const config = categoryPages["job-offer-checker"];

export const metadata: Metadata = createPageMetadata({
  title: config.metadataTitle,
  description: config.description,
  path: `/${config.slug}`,
});

export default function Page() {
  return <CategoryLandingPage config={config} />;
}

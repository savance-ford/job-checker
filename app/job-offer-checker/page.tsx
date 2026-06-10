import type { Metadata } from "next";

import { CategoryLandingPage } from "@/components/CategoryLandingPage";
import { categoryPages } from "@/lib/categoryPages";

const config = categoryPages["job-offer-checker"];

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
};

export default function Page() {
  return <CategoryLandingPage config={config} />;
}

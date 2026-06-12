import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

const publicPaths = [
  "/",
  "/job-scam-checker",
  "/ghost-job-checker",
  "/remote-job-scam-checker",
  "/work-from-home-job-scam-checker",
  "/data-entry-job-scam-checker",
  "/customer-service-job-scam-checker",
  "/recruiter-email-checker",
  "/job-offer-checker",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.includes("checker") ? 0.8 : 0.5,
  }));
}

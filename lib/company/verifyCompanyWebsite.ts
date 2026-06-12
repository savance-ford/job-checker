import "server-only";

import { assertSafeUrl } from "@/lib/url/followRedirects";
import { getRegistrableDomain } from "@/lib/url/domain";
import type {
  CompanyWebsiteVerificationResult,
  PublicHtmlResult,
} from "@/lib/company/types";
import { normalizeCompanyWebsiteUrl } from "@/lib/company/url";

const REQUEST_TIMEOUT_MS = 6_000;
const MAX_REDIRECTS = 5;

type RequestPublicUrl = (
  url: URL,
  method: "HEAD" | "GET",
) => Promise<PublicHtmlResult>;

function safeReason(error: unknown) {
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return "The website request timed out.";
  }

  if (error instanceof Error) return error.message;
  return "The website request could not be completed.";
}

async function defaultRequestPublicUrl(
  initialUrl: URL,
  method: "HEAD" | "GET",
): Promise<PublicHtmlResult> {
  let current = new URL(initialUrl);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    await assertSafeUrl(current);

    const response = await fetch(current, {
      method,
      redirect: "manual",
      headers: {
        "User-Agent": "JobCheck/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status < 300 || response.status >= 400) {
      const contentType = response.headers.get("content-type") ?? "";
      const html =
        method === "GET" &&
        response.status >= 200 &&
        response.status < 400 &&
        contentType.toLowerCase().includes("text/html")
          ? await response.text()
          : null;

      return { response, finalUrl: current, html };
    }

    const location = response.headers.get("location");
    if (!location) {
      return { response, finalUrl: current, html: null };
    }

    if (redirectCount === MAX_REDIRECTS) {
      throw new Error(`The website exceeded ${MAX_REDIRECTS} redirects.`);
    }

    current = new URL(location, current);
  }

  throw new Error("The website could not be reached.");
}

export const requestPublicUrl: RequestPublicUrl = defaultRequestPublicUrl;

export async function verifyCompanyWebsite(
  companyWebsite: string | null | undefined,
  request: RequestPublicUrl = requestPublicUrl,
): Promise<CompanyWebsiteVerificationResult> {
  if (!companyWebsite?.trim()) {
    return {
      attempted: false,
      websiteFound: false,
      status: "not_attempted",
      message: "No company website was provided.",
      evidence: [],
    };
  }

  const normalized = normalizeCompanyWebsiteUrl(companyWebsite);
  if (!normalized) {
    return {
      attempted: false,
      websiteFound: false,
      status: "invalid",
      message: "The provided company website URL is invalid.",
      evidence: ["Only valid HTTP or HTTPS website URLs can be checked."],
    };
  }

  const normalizedUrl = normalized.toString();
  const domain = getRegistrableDomain(normalized.hostname);

  try {
    let result: PublicHtmlResult;

    try {
      result = await request(normalized, "HEAD");
      if (
        result.response.status < 200 ||
        result.response.status >= 400
      ) {
        result = await request(normalized, "GET");
      }
    } catch {
      result = await request(normalized, "GET");
    }

    if (result.response.status >= 200 && result.response.status < 400) {
      const finalUrl = normalizeCompanyWebsiteUrl(result.finalUrl.toString());
      return {
        attempted: true,
        websiteFound: true,
        domain: getRegistrableDomain(result.finalUrl.hostname),
        normalizedUrl: finalUrl?.toString() ?? normalizedUrl,
        status: "found",
        message: "The provided company website appears reachable.",
        evidence: [
          `Domain: ${getRegistrableDomain(result.finalUrl.hostname)}`,
          `Website: ${finalUrl?.toString() ?? normalizedUrl}`,
        ],
      };
    }

    return {
      attempted: true,
      websiteFound: false,
      domain,
      normalizedUrl,
      status: "not_found",
      message: "The app could not confirm the provided company website.",
      evidence: [`Website returned HTTP ${result.response.status}.`],
    };
  } catch (error) {
    return {
      attempted: true,
      websiteFound: false,
      domain,
      normalizedUrl,
      status:
        error instanceof Error &&
        /(not allowed|private network|standard web ports|resolved)/i.test(
          error.message,
        )
          ? "invalid"
          : "error",
      message: "The app could not confirm the provided company website.",
      evidence: [safeReason(error)],
    };
  }
}

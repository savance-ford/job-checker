import "server-only";

import { isIP } from "node:net";
import { resolve4, resolve6 } from "node:dns/promises";

const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 6_000;

export type RedirectResult = {
  finalUrl: string;
  redirectCount: number;
  error: string | null;
};

function isPrivateIp(address: string) {
  if (address === "::1" || address === "0.0.0.0") return true;

  if (address.includes(":")) {
    const normalized = address.toLowerCase();
    return normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:");
  }

  const parts = address.split(".").map(Number);
  return (
    parts[0] === 10 ||
    parts[0] === 127 ||
    (parts[0] === 169 && parts[1] === 254) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

export async function assertSafeUrl(url: URL) {
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS links can be checked.");
  }

  if (
    url.username ||
    url.password ||
    url.hostname === "localhost" ||
    url.hostname.endsWith(".local")
  ) {
    throw new Error("Local or credentialed URLs are not allowed.");
  }

  if (url.port && !["80", "443"].includes(url.port)) {
    throw new Error("Only standard web ports can be checked.");
  }

  if (isIP(url.hostname)) {
    if (isPrivateIp(url.hostname)) {
      throw new Error("Private network URLs are not allowed.");
    }
    return;
  }

  const [ipv4, ipv6] = await Promise.all([
    resolve4(url.hostname).catch(() => []),
    resolve6(url.hostname).catch(() => []),
  ]);
  const addresses = [...ipv4, ...ipv6];

  if (!addresses.length) {
    throw new Error("The link hostname could not be resolved.");
  }

  if (addresses.some(isPrivateIp)) {
    throw new Error("The link resolves to a private network address.");
  }
}

async function requestUrl(url: URL, method: "HEAD" | "GET") {
  return fetch(url, {
    method,
    redirect: "manual",
    headers: {
      "User-Agent": "JobTrustCheck/1.0",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

export async function followRedirects(originalUrl: string): Promise<RedirectResult> {
  let current = new URL(originalUrl);
  let redirectCount = 0;

  try {
    while (redirectCount <= MAX_REDIRECTS) {
      await assertSafeUrl(current);

      let response = await requestUrl(current, "HEAD");
      if ([403, 405, 501].includes(response.status)) {
        response = await requestUrl(current, "GET");
      }

      if (response.status < 300 || response.status >= 400) {
        return {
          finalUrl: current.toString(),
          redirectCount,
          error: response.ok ? null : `Destination returned HTTP ${response.status}.`,
        };
      }

      const location = response.headers.get("location");
      if (!location) {
        return {
          finalUrl: current.toString(),
          redirectCount,
          error: "A redirect response did not include a destination.",
        };
      }

      redirectCount += 1;
      if (redirectCount > MAX_REDIRECTS) {
        return {
          finalUrl: current.toString(),
          redirectCount,
          error: `The link exceeded ${MAX_REDIRECTS} redirects.`,
        };
      }

      current = new URL(location, current);
    }
  } catch (error) {
    return {
      finalUrl: current.toString(),
      redirectCount,
      error: error instanceof Error ? error.message : "The link could not be reached safely.",
    };
  }

  return {
    finalUrl: current.toString(),
    redirectCount,
    error: "The link could not be resolved.",
  };
}

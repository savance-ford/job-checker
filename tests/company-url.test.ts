import assert from "node:assert/strict";
import test from "node:test";

import { normalizeCompanyWebsiteUrl } from "../lib/company/url.ts";

test("company website URLs normalize to the origin", () => {
  assert.equal(
    normalizeCompanyWebsiteUrl(
      "https://www.example.com/about?source=job#team",
    )?.toString(),
    "https://www.example.com/",
  );
});

test("invalid and non-web company URLs return null", () => {
  assert.equal(normalizeCompanyWebsiteUrl("not a URL"), null);
  assert.equal(normalizeCompanyWebsiteUrl("ftp://example.com"), null);
  assert.equal(
    normalizeCompanyWebsiteUrl("https://user:pass@example.com"),
    null,
  );
});

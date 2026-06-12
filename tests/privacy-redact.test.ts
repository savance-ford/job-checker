import assert from "node:assert/strict";
import test from "node:test";

import {
  createSafeInputSummary,
  extractEmailDomain,
  redactEmail,
  safeDomainFromUrl,
  safePublicUrl,
  sanitizePublicEvidence,
} from "../lib/privacy/redact.ts";

test("redactEmail masks the local part and preserves the domain", () => {
  assert.equal(
    redactEmail("john.smith@example.com"),
    "j***@example.com",
  );
});

test("extractEmailDomain returns a normalized domain", () => {
  assert.equal(
    extractEmailDomain("john.smith@example.com"),
    "example.com",
  );
  assert.equal(
    extractEmailDomain("John.Smith@Example.COM"),
    "example.com",
  );
});

test("invalid emails return null without throwing", () => {
  assert.doesNotThrow(() => extractEmailDomain("not-an-email"));
  assert.equal(extractEmailDomain("not-an-email"), null);
  assert.equal(extractEmailDomain("@example.com"), null);
  assert.equal(extractEmailDomain("john@localhost"), null);
});

test("safeDomainFromUrl removes paths and query parameters", () => {
  assert.equal(
    safeDomainFromUrl(
      "https://company.com/jobs?id=123&utm_source=test",
    ),
    "company.com",
  );
  assert.equal(
    safeDomainFromUrl("https://www.company.com/jobs/123"),
    "company.com",
  );
});

test("invalid URLs return null without throwing", () => {
  assert.doesNotThrow(() => safeDomainFromUrl("not a URL"));
  assert.equal(safeDomainFromUrl("not a URL"), null);
  assert.equal(safeDomainFromUrl(""), null);
});

test("safePublicUrl removes credentials, query parameters, and fragments", () => {
  assert.equal(
    safePublicUrl(
      "https://user:pass@company.com/careers?source=email#openings",
    ),
    "https://company.com/careers",
  );
});

test("createSafeInputSummary never returns input_value", () => {
  const source = {
    input_type: "recruiter_email" as const,
    input_value: "PRIVATE SUBMITTED CONTENT",
    company_name: "Example Co",
    job_title: "Support Specialist",
    detected_email: "john.smith@example.com",
    original_url:
      "https://company.com/jobs?id=123&utm_source=test",
    final_url: "https://jobs.lever.co/example/job-id?source=email",
    company_website_domain: "company.com",
    careers_page_url:
      "https://company.com/careers?utm_source=report#openings",
  };

  const summary = createSafeInputSummary(source);
  const serialized = JSON.stringify(summary);

  assert.deepEqual(summary, {
    inputType: "recruiter_email",
    companyName: "Example Co",
    jobTitle: "Support Specialist",
    originalUrlDomain: "company.com",
    finalUrlDomain: "jobs.lever.co",
    emailDomain: "example.com",
    companyWebsiteDomain: "company.com",
    careersPageUrl: "https://company.com/careers",
  });
  assert.equal("input_value" in summary, false);
  assert.equal(serialized.includes(source.input_value), false);
  assert.equal(serialized.includes(source.detected_email), false);
  assert.equal(serialized.includes(source.original_url), false);
  assert.equal(serialized.includes("?utm_source=report"), false);
});

test("sanitizePublicEvidence removes full emails and URL details", () => {
  assert.equal(
    sanitizePublicEvidence(
      "Contact john.smith@example.com; Link https://company.com/jobs?id=123&utm_source=test;",
    ),
    "Contact example.com; Link company.com;",
  );
});

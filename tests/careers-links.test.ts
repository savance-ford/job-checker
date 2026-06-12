import assert from "node:assert/strict";
import test from "node:test";

import { extractCareersLinks } from "../lib/company/extractCareersLinks.ts";

const baseUrl = new URL("https://example.com/");

test("extractCareersLinks supports quoted and unquoted href values", () => {
  const links = extractCareersLinks(
    [
      '<a href="/careers?source=nav#openings">Careers</a>',
      "<a href=https://jobs.example.com/openings>Open positions</a>",
      "<a href='/about'>About us</a>",
    ].join(""),
    baseUrl,
  );

  assert.deepEqual(
    links.map((link) => link.toString()),
    [
      "https://example.com/careers",
      "https://jobs.example.com/openings",
    ],
  );
});

test("extractCareersLinks does not treat data-href as href", () => {
  const links = extractCareersLinks(
    '<a data-href="/careers">Careers</a>',
    baseUrl,
  );

  assert.deepEqual(links, []);
});

test("extractCareersLinks finds careers wording in nested anchor text", () => {
  const links = extractCareersLinks(
    '<a class="nav" href=/company><span>Join us</span></a>',
    baseUrl,
  );

  assert.equal(links[0]?.toString(), "https://example.com/company");
});

test("extractCareersLinks ignores anchors with oversized text", () => {
  const links = extractCareersLinks(
    `<a href="/company">${"x".repeat(1_001)} Careers</a>`,
    baseUrl,
  );

  assert.deepEqual(links, []);
});

test("extractCareersLinks does not span an unclosed anchor", () => {
  const links = extractCareersLinks(
    [
      '<a href="/company">',
      "x".repeat(1_001),
      '<a href="/careers">Careers</a>',
    ].join(""),
    baseUrl,
  );

  assert.deepEqual(
    links.map((link) => link.toString()),
    ["https://example.com/careers"],
  );
});

test("extractCareersLinks ignores oversized href values", () => {
  const links = extractCareersLinks(
    `<a href="/${"x".repeat(2_049)}">Careers</a>`,
    baseUrl,
  );

  assert.deepEqual(links, []);
});

test("extractCareersLinks handles many malformed anchors without spanning", () => {
  const malformed = '<a href="/careers" '.repeat(5_000);
  const links = extractCareersLinks(
    `${malformed}<a href="/jobs">Jobs</a>`,
    baseUrl,
  );

  assert.deepEqual(
    links.map((link) => link.toString()),
    ["https://example.com/jobs"],
  );
});

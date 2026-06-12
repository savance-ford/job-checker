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

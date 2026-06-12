const CAREERS_TEXT_PATTERN =
  /\b(careers?|jobs?|join\s+us|work\s+with\s+us|openings?)\b/i;
const MAX_ANCHOR_ATTRIBUTES_LENGTH = 2_000;
const MAX_HREF_LENGTH = 2_048;
const MAX_ANCHOR_TEXT_LENGTH = 1_000;

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function extractCareersLinks(html: string, baseUrl: URL) {
  const links: URL[] = [];
  const anchorPattern = new RegExp(
    String.raw`<a\b[^>]{0,${MAX_ANCHOR_ATTRIBUTES_LENGTH}}?(?:\s|[^a-zA-Z0-9-])href\s*=\s*(?:(["'])([^"'<>]{1,${MAX_HREF_LENGTH}})\1|([^\s>"']{1,${MAX_HREF_LENGTH}}))[^>]{0,${MAX_ANCHOR_ATTRIBUTES_LENGTH}}>([\s\S]{0,${MAX_ANCHOR_TEXT_LENGTH}}?)<\/a>`,
    "gi",
  );

  for (const match of html.matchAll(anchorPattern)) {
    const href = (match[2] ?? match[3])?.trim();
    const text = stripTags(match[4] ?? "");
    if (!href || !CAREERS_TEXT_PATTERN.test(`${href} ${text}`)) continue;

    try {
      const candidate = new URL(href, baseUrl);
      if (!["http:", "https:"].includes(candidate.protocol)) continue;
      candidate.hash = "";
      candidate.search = "";
      links.push(candidate);
    } catch {
      // Ignore malformed links found in third-party HTML.
    }
  }

  return links;
}

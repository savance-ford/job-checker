const CAREERS_TEXT_PATTERN =
  /\b(careers?|jobs?|join\s+us|work\s+with\s+us|openings?)\b/i;
const MAX_ANCHOR_ATTRIBUTES_LENGTH = 2_000;
const MAX_HREF_LENGTH = 2_048;
const MAX_ANCHOR_TEXT_LENGTH = 1_000;

function isWhitespace(value: string) {
  return /\s/.test(value);
}

function isAnchorStart(html: string, index: number) {
  const next = html[index + 2];
  return next === ">" || next === "/" || isWhitespace(next ?? "");
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractHref(openingTag: string) {
  let cursor = 2;

  while (cursor < openingTag.length) {
    while (isWhitespace(openingTag[cursor] ?? "")) cursor += 1;
    if (cursor >= openingTag.length || openingTag[cursor] === ">") break;

    const nameStart = cursor;
    while (
      cursor < openingTag.length &&
      !isWhitespace(openingTag[cursor] ?? "") &&
      !["=", ">"].includes(openingTag[cursor] ?? "")
    ) {
      cursor += 1;
    }
    const name = openingTag.slice(nameStart, cursor).toLowerCase();

    while (isWhitespace(openingTag[cursor] ?? "")) cursor += 1;
    if (openingTag[cursor] !== "=") continue;

    cursor += 1;
    while (isWhitespace(openingTag[cursor] ?? "")) cursor += 1;

    const quote = openingTag[cursor];
    let value = "";

    if (quote === '"' || quote === "'") {
      cursor += 1;
      const valueStart = cursor;
      const closingQuote = openingTag.indexOf(quote, cursor);
      if (closingQuote === -1) return null;
      if (closingQuote - valueStart > MAX_HREF_LENGTH) return null;
      value = openingTag.slice(valueStart, closingQuote);
      cursor = closingQuote + 1;
    } else {
      const valueStart = cursor;
      while (
        cursor < openingTag.length &&
        !isWhitespace(openingTag[cursor] ?? "") &&
        openingTag[cursor] !== ">"
      ) {
        cursor += 1;
        if (cursor - valueStart > MAX_HREF_LENGTH) return null;
      }
      value = openingTag.slice(valueStart, cursor);
    }

    if (name === "href") return value.trim() || null;
  }

  return null;
}

export function extractCareersLinks(html: string, baseUrl: URL) {
  const links: URL[] = [];
  const lowerHtml = html.toLowerCase();
  let cursor = 0;

  while (cursor < html.length) {
    const anchorStart = lowerHtml.indexOf("<a", cursor);
    if (anchorStart === -1) break;

    if (!isAnchorStart(html, anchorStart)) {
      cursor = anchorStart + 2;
      continue;
    }

    const openingWindow = html.slice(
      anchorStart,
      anchorStart + MAX_ANCHOR_ATTRIBUTES_LENGTH + 1,
    );
    const relativeOpeningEnd = openingWindow.indexOf(">");
    if (relativeOpeningEnd === -1) {
      cursor = anchorStart + 2;
      continue;
    }
    const nestedOpeningStart = openingWindow
      .slice(0, relativeOpeningEnd)
      .toLowerCase()
      .indexOf("<a", 2);
    if (nestedOpeningStart !== -1) {
      cursor = anchorStart + nestedOpeningStart;
      continue;
    }
    const openingEnd = anchorStart + relativeOpeningEnd;

    const bodyStart = openingEnd + 1;
    const bodyWindow = lowerHtml.slice(
      bodyStart,
      bodyStart + MAX_ANCHOR_TEXT_LENGTH + 5,
    );
    const relativeClosingStart = bodyWindow.indexOf("</a>");
    const relativeNestedAnchorStart = bodyWindow.indexOf("<a");
    const closingStart =
      relativeClosingStart === -1
        ? -1
        : bodyStart + relativeClosingStart;
    const nestedAnchorStart =
      relativeNestedAnchorStart === -1
        ? -1
        : bodyStart + relativeNestedAnchorStart;

    if (
      closingStart === -1 ||
      (nestedAnchorStart !== -1 && nestedAnchorStart < closingStart)
    ) {
      cursor =
        nestedAnchorStart !== -1 &&
        (closingStart === -1 || nestedAnchorStart < closingStart)
          ? nestedAnchorStart
          : bodyStart;
      continue;
    }

    const href = extractHref(html.slice(anchorStart, openingEnd + 1));
    const text = stripTags(html.slice(bodyStart, closingStart));
    cursor = closingStart + 4;

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

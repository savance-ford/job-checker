const URL_PATTERN = /\bhttps?:\/\/[^\s<>"')\]]+/i;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

function cleanExtractedValue(value: string) {
  return value.trim().replace(/[.,;:!?]+$/, "");
}

export function extractUrl(input: string) {
  const match = input.match(URL_PATTERN);
  if (match) {
    return cleanExtractedValue(match[0]);
  }

  const trimmed = cleanExtractedValue(input);
  if (
    !/\s/.test(trimmed) &&
    /^(?:www\.)?[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(trimmed)
  ) {
    return `https://${trimmed}`;
  }

  return null;
}

export function extractEmail(input: string) {
  return input.match(EMAIL_PATTERN)?.[0]?.toLowerCase() ?? null;
}

export function extractJobTitle(input: string) {
  const labeledMatch = input.match(
    /(?:job\s+title|position|role)\s*[:\-]\s*([^\n\r|]{3,80})/i,
  );

  if (labeledMatch?.[1]) {
    return cleanExtractedValue(labeledMatch[1]);
  }

  const heading = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(
      (line) =>
        line.length >= 4 &&
        line.length <= 70 &&
        /\b(engineer|developer|manager|assistant|specialist|representative|analyst|designer|coordinator|associate|clerk|recruiter|technician|consultant|director|administrator)\b/i.test(
          line,
        ),
    );

  return heading ? cleanExtractedValue(heading) : null;
}

export function extractCompanyName(input: string, email: string | null) {
  const labeledMatch = input.match(
    /(?:company|employer|organization)\s*[:\-]\s*([^\n\r|]{2,80})/i,
  );

  if (labeledMatch?.[1]) {
    return cleanExtractedValue(labeledMatch[1]);
  }

  const atCompanyMatch = input.match(
    /\b(?:at|with|from)\s+([A-Z][A-Za-z0-9&.' -]{1,60})(?=[,.\n]| is hiring| team|$)/,
  );
  if (atCompanyMatch?.[1]) {
    return cleanExtractedValue(atCompanyMatch[1]);
  }

  if (email) {
    const domain = email.split("@")[1];
    const domainName = domain?.split(".")[0];
    if (
      domainName &&
      !["gmail", "yahoo", "outlook", "hotmail", "aol", "icloud", "proton"].includes(
        domainName,
      )
    ) {
      return domainName
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }
  }

  return null;
}

export function hasLocation(input: string) {
  return /\b(location|remote|hybrid|on[- ]site|onsite|based in|city|state)\b/i.test(
    input,
  );
}

export function hasPay(input: string) {
  return (
    /\$\s?\d[\d,]*(?:\.\d{2})?(?:\s*(?:-|to)\s*\$?\s?\d[\d,]*)?/i.test(input) ||
    /\b(pay|salary|compensation|hourly rate|per hour|per year)\b/i.test(input)
  );
}

export function hasEmploymentType(input: string) {
  return /\b(full[- ]time|part[- ]time|contract|temporary|internship|seasonal|1099|w-?2)\b/i.test(
    input,
  );
}

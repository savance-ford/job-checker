import { z } from "zod";

import { normalizeCompanyWebsiteUrl } from "@/lib/company/url";
import { analyzeInput } from "@/lib/scan/analyzeInput";
import { saveScanReport } from "@/lib/supabase/reports";
import { SupabaseConfigurationError } from "@/lib/supabase/server";
import { inputTypes } from "@/lib/types";

const scanRequestSchema = z.object({
  input: z
    .string()
    .trim()
    .min(10, "Enter at least 10 characters to run a useful check.")
    .max(50_000, "Input must be 50,000 characters or fewer."),
  inputType: z.enum(inputTypes),
  companyWebsite: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z
      .string()
      .trim()
      .max(2_048, "Company website URL must be 2,048 characters or fewer.")
      .url("Enter a valid company website URL.")
      .refine(
        (value) => normalizeCompanyWebsiteUrl(value) !== null,
        "Company website must use HTTP or HTTPS.",
      )
      .optional(),
  ),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = scanRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Please check the submitted job information.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const normalizedCompanyWebsite = parsed.data.companyWebsite
      ? normalizeCompanyWebsiteUrl(parsed.data.companyWebsite)?.toString()
      : undefined;
    const analysis = await analyzeInput(
      parsed.data.input,
      parsed.data.inputType,
      normalizedCompanyWebsite,
    );
    const scan = await saveScanReport(analysis);

    return Response.json(
      {
        id: scan.id,
        score: analysis.score,
        recommendation: analysis.recommendation,
        reportUrl: `/job-report/${scan.id}`,
        signals: analysis.signals,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return Response.json({ error: error.message }, { status: 503 });
    }

    console.error("Scan failed", error);
    return Response.json(
      { error: "The scan could not be completed. Please try again." },
      { status: 500 },
    );
  }
}

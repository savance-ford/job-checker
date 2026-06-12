import "server-only";

import {
  createSafeInputSummary,
  sanitizePublicEvidence,
} from "@/lib/privacy/redact";
import { normalizeRecommendation } from "@/lib/types";
import type {
  InputType,
  SavedScan,
  ScanAnalysis,
  ScanReport,
  StoredSignal,
} from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type PublicScanRow = {
  id: string;
  input_type: InputType;
  company_name: string | null;
  job_title: string | null;
  detected_email: string | null;
  original_url: string | null;
  final_url: string | null;
  company_website_domain?: string | null;
  careers_page_url?: string | null;
  score: number;
  recommendation: string;
  summary: string | null;
  created_at: string;
};

function hasMissingCompanyColumns(error: { code?: string; message?: string } | null) {
  return Boolean(
    error &&
      (error.code === "PGRST204" ||
        /company_website|careers_page/i.test(error.message ?? "")),
  );
}

function evidenceValue(
  signals: { label: string; evidence?: string | null }[],
  labels: string[],
  prefix: string,
) {
  const signal = signals.find(
    (item) => labels.includes(item.label) && item.evidence,
  );
  const part = signal?.evidence
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix));

  return part?.slice(prefix.length).trim() || null;
}

export async function saveScanReport(
  analysis: ScanAnalysis,
): Promise<SavedScan> {
  const supabase = getSupabaseAdmin();
  const legacyScanRow = {
    input_type: analysis.inputType,
    input_value: analysis.inputValue,
    company_name: analysis.companyName,
    job_title: analysis.jobTitle,
    detected_email: analysis.detectedEmail,
    original_url: analysis.originalUrl,
    final_url: analysis.finalUrl,
    score: analysis.score,
    recommendation: analysis.recommendation,
    summary: analysis.summary,
  };
  const scanRow = {
    ...legacyScanRow,
    company_website_url: analysis.companyWebsiteUrl,
    company_website_domain: analysis.companyWebsiteDomain,
    careers_page_url: analysis.careersPageUrl,
    careers_page_found: analysis.careersPageFound,
  };
  let usingLegacyColumns = false;
  let scanResult = await supabase
    .from("scans")
    .insert(scanRow)
    .select("id")
    .single();

  if (hasMissingCompanyColumns(scanResult.error)) {
    usingLegacyColumns = true;
    scanResult = await supabase
      .from("scans")
      .insert(legacyScanRow)
      .select("id")
      .single();
  }

  if (
    analysis.recommendation === "Lower Risk" &&
    scanResult.error?.code === "23514" &&
    scanResult.error.message.includes("scans_recommendation_check")
  ) {
    scanResult = await supabase
      .from("scans")
      .insert({
        ...(usingLegacyColumns ? legacyScanRow : scanRow),
        recommendation: "Apply",
      })
      .select("id")
      .single();
  }

  const { data: scan, error: scanError } = scanResult;

  if (scanError || !scan) {
    throw new Error(scanError?.message ?? "The scan could not be saved.");
  }

  const signalRows = analysis.signals.map((signal) => ({
    scan_id: scan.id,
    label: signal.label,
    status: signal.status,
    severity: signal.severity,
    message: signal.message,
    evidence: signal.evidence ?? null,
  }));

  const { error: signalsError } = await supabase
    .from("scan_signals")
    .insert(signalRows);

  if (signalsError) {
    await supabase.from("scans").delete().eq("id", scan.id);
    throw new Error(signalsError.message);
  }

  return scan as SavedScan;
}

export async function getScanReport(id: string): Promise<ScanReport | null> {
  const supabase = getSupabaseAdmin();
  let scanResult = await supabase
    .from("scans")
    .select(
      "id,input_type,company_name,job_title,detected_email,original_url,final_url,company_website_domain,careers_page_url,score,recommendation,summary,created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (hasMissingCompanyColumns(scanResult.error)) {
    scanResult = await supabase
      .from("scans")
      .select(
        "id,input_type,company_name,job_title,detected_email,original_url,final_url,score,recommendation,summary,created_at",
      )
      .eq("id", id)
      .maybeSingle();
  }

  const { data: scan, error: scanError } = scanResult;

  if (scanError) {
    throw new Error(scanError.message);
  }

  if (!scan) {
    return null;
  }

  const { data: signals, error: signalsError } = await supabase
    .from("scan_signals")
    .select("id,scan_id,label,status,severity,message,evidence,created_at")
    .eq("scan_id", id)
    .order("created_at", { ascending: true });

  if (signalsError) {
    throw new Error(signalsError.message);
  }

  const publicScan = scan as PublicScanRow;
  const rawSignals = (signals ?? []) as StoredSignal[];
  const companyWebsiteDomain =
    publicScan.company_website_domain ??
    evidenceValue(
      rawSignals,
      ["Company website candidate found", "Company website not confirmed"],
      "Domain:",
    );
  const careersPageUrl =
    publicScan.careers_page_url ??
    evidenceValue(
      rawSignals,
      [
        "Careers page candidate found",
        "Careers page links to detected ATS",
      ],
      "Careers page:",
    );
  const publicSignals = rawSignals.map((signal) => ({
    ...signal,
    evidence: sanitizePublicEvidence(signal.evidence),
  })) as StoredSignal[];

  return {
    scan: {
      id: publicScan.id,
      score: publicScan.score,
      recommendation: normalizeRecommendation(publicScan.recommendation),
      summary: publicScan.summary,
      created_at: publicScan.created_at,
      input_summary: createSafeInputSummary({
        ...publicScan,
        company_website_domain: companyWebsiteDomain,
        careers_page_url: careersPageUrl,
      }),
    },
    signals: publicSignals,
  };
}

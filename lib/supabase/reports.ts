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
  score: number;
  recommendation: string;
  summary: string | null;
  created_at: string;
};

export async function saveScanReport(
  analysis: ScanAnalysis,
): Promise<SavedScan> {
  const supabase = getSupabaseAdmin();
  const scanRow = {
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
  let scanResult = await supabase
    .from("scans")
    .insert(scanRow)
    .select("id")
    .single();

  if (
    analysis.recommendation === "Lower Risk" &&
    scanResult.error?.code === "23514" &&
    scanResult.error.message.includes("scans_recommendation_check")
  ) {
    scanResult = await supabase
      .from("scans")
      .insert({ ...scanRow, recommendation: "Apply" })
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
  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .select(
      "id,input_type,company_name,job_title,detected_email,original_url,final_url,score,recommendation,summary,created_at",
    )
    .eq("id", id)
    .maybeSingle();

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
  const publicSignals = (signals ?? []).map((signal) => ({
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
      input_summary: createSafeInputSummary(publicScan),
    },
    signals: publicSignals,
  };
}

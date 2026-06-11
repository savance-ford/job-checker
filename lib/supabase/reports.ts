import "server-only";

import type {
  ScanAnalysis,
  ScanReport,
  StoredScan,
  StoredSignal,
} from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function saveScanReport(analysis: ScanAnalysis) {
  const supabase = getSupabaseAdmin();
  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .insert({
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
    })
    .select("*")
    .single();

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

  return scan as StoredScan;
}

export async function getScanReport(id: string): Promise<ScanReport | null> {
  const supabase = getSupabaseAdmin();
  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .select("*")
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
    .select("*")
    .eq("scan_id", id)
    .order("created_at", { ascending: true });

  if (signalsError) {
    throw new Error(signalsError.message);
  }

  return {
    scan: scan as StoredScan,
    signals: (signals ?? []) as StoredSignal[],
  };
}

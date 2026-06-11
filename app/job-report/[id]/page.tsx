import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { z } from "zod";

import { EvidenceChecklist } from "@/components/EvidenceChecklist";
import { ReportGuidance } from "@/components/ReportGuidance";
import { ReportShareCard } from "@/components/ReportShareCard";
import { TrustScoreCard } from "@/components/TrustScoreCard";
import { createPageMetadata } from "@/lib/seo";
import { getScanReport } from "@/lib/supabase/reports";
import { SupabaseConfigurationError } from "@/lib/supabase/server";

const getCachedScanReport = cache(getScanReport);
const reportIdSchema = z.uuid();

function formatInputType(inputType: string) {
  return inputType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  if (!reportIdSchema.safeParse(id).success) {
    notFound();
  }

  try {
    const report = await getCachedScanReport(id);
    if (!report) {
      notFound();
    }

    const title = report?.scan.job_title
      ? `${report.scan.job_title} Trust Report`
      : "Job Trust Report";
    const description =
      report?.scan.summary ??
      "Review an evidence-based job trust report and its verification signals.";

    return {
      ...createPageMetadata({
        title,
        description,
        path: `/job-report/${id}`,
      }),
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch {
    return {
      title: "Job Trust Report",
      description:
        "Review an evidence-based job trust report and its verification signals.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

function ConfigurationNotice() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-800">
          Setup required
        </p>
        <h1 className="mt-3 text-2xl font-bold text-amber-950">
          Report storage is not configured
        </h1>
        <p className="mt-3 leading-7 text-amber-900">
          Add the Supabase environment variables described in the README, then
          restart the development server. No report data was changed.
        </p>
      </div>
    </main>
  );
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let report;

  if (!reportIdSchema.safeParse(id).success) {
    notFound();
  }

  try {
    report = await getCachedScanReport(id);
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return <ConfigurationNotice />;
    }
    throw error;
  }

  if (!report) {
    notFound();
  }

  const { scan, signals } = report;
  const createdAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(scan.created_at));
  const reportSummary =
    scan.summary ??
    "Review the evidence checklist and verify the opportunity directly with the employer before sharing sensitive information.";
  const topSummary =
    reportSummary.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() ?? reportSummary;

  return (
    <main className="bg-slate-50/70">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
            Saved trust report
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {scan.job_title ?? "Job opportunity review"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {scan.company_name
              ? `Submitted opportunity for ${scan.company_name}`
              : "Submitted job opportunity"}
          </p>
        </div>

        <TrustScoreCard
          score={scan.score}
          recommendation={scan.recommendation}
          summary={topSummary}
          lastChecked={createdAt}
        />

        <div className="mt-6">
          <ReportGuidance recommendation={scan.recommendation} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <EvidenceChecklist signals={signals} />
          <aside className="space-y-6">
            <ReportShareCard
              recommendation={scan.recommendation}
              score={scan.score}
              summary={reportSummary}
            />

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold text-slate-950">
                Submitted details
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">Input type</dt>
                  <dd className="mt-1 font-medium text-slate-900">
                    {formatInputType(scan.input_type)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Company</dt>
                  <dd className="mt-1 break-words font-medium text-slate-900">
                    {scan.company_name ?? "Could not verify"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Job title</dt>
                  <dd className="mt-1 break-words font-medium text-slate-900">
                    {scan.job_title ?? "Could not verify"}
                  </dd>
                </div>
                {scan.detected_email ? (
                  <div>
                    <dt className="text-slate-500">Detected email</dt>
                    <dd className="mt-1 break-all font-medium text-slate-900">
                      {scan.detected_email}
                    </dd>
                  </div>
                ) : null}
                {scan.final_url ? (
                  <div>
                    <dt className="text-slate-500">Final URL</dt>
                    <dd className="mt-1 break-all">
                      <a
                        href={scan.final_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-2"
                      >
                        {scan.final_url}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
              <details className="mt-5 border-t border-slate-200 pt-5">
                <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                  View submitted text
                </summary>
                <p className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-100 p-3 text-xs leading-5 text-slate-700">
                  {scan.input_value}
                </p>
              </details>
            </section>
          </aside>
        </div>

        <p className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-600">
          This tool provides risk signals, not a legal determination. Always
          verify job offers directly with the employer before sharing sensitive
          information.
        </p>
      </div>
    </main>
  );
}

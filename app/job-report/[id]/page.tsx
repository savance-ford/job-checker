import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EvidenceChecklist } from "@/components/EvidenceChecklist";
import { ReportShareCard } from "@/components/ReportShareCard";
import { TrustScoreCard } from "@/components/TrustScoreCard";
import { getScanReport } from "@/lib/supabase/reports";
import { SupabaseConfigurationError } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Job trust report",
  description: "An evidence-based trust report for a submitted job opportunity.",
};

function formatInputType(inputType: string) {
  return inputType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ConfigurationNotice() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
        <h1 className="text-2xl font-bold text-amber-950">Report storage is not configured</h1>
        <p className="mt-3 leading-7 text-amber-900">
          Add the Supabase environment variables described in the README, then
          restart the development server.
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

  try {
    report = await getScanReport(id);
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

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
            Saved trust report
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {scan.job_title ?? "Job opportunity review"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Checked {createdAt}
            {scan.company_name ? ` for ${scan.company_name}` : ""}
          </p>
        </div>
        <Link
          href="/#scan"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          Check another job
        </Link>
      </div>

      <TrustScoreCard
        score={scan.score}
        recommendation={scan.recommendation}
        summary={scan.summary}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <EvidenceChecklist signals={signals} />
        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-950">Input summary</h2>
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
          <ReportShareCard />
        </aside>
      </div>

      <p className="mt-8 rounded-xl bg-slate-200/70 px-5 py-4 text-sm leading-6 text-slate-600">
        This automated report identifies patterns in the submitted content. It
        cannot guarantee that a job is legitimate or replace direct verification
        with the employer.
      </p>
    </main>
  );
}

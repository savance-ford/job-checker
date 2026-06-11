"use client";

import Link from "next/link";
import { useState } from "react";

import type {
  Recommendation,
  SafeInputSummary,
} from "@/lib/types";

type CopyTarget = "link" | "summary";

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) throw new Error("Copy failed.");
}

export function ReportShareCard({
  recommendation,
  score,
  summary,
  inputSummary,
  topEvidence,
}: {
  recommendation: Recommendation;
  score: number;
  summary: string | null;
  inputSummary: SafeInputSummary;
  topEvidence: { label: string; message: string }[];
}) {
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const [copyError, setCopyError] = useState(false);

  async function handleCopy(target: CopyTarget) {
    const url = window.location.href;
    const safeDetails = [
      `Input type: ${inputSummary.inputType.replaceAll("_", " ")}`,
      inputSummary.companyName
        ? `Company: ${inputSummary.companyName}`
        : null,
      inputSummary.jobTitle ? `Job title: ${inputSummary.jobTitle}` : null,
      inputSummary.originalUrlDomain
        ? `Original domain: ${inputSummary.originalUrlDomain}`
        : null,
      inputSummary.finalUrlDomain
        ? `Final domain: ${inputSummary.finalUrlDomain}`
        : null,
      inputSummary.emailDomain
        ? `Email domain: ${inputSummary.emailDomain}`
        : null,
    ].filter((value): value is string => Boolean(value));
    const evidenceText = topEvidence.length
      ? `Top evidence: ${topEvidence
          .map((signal) => `${signal.label}: ${signal.message}`)
          .join(" | ")}`
      : "Top evidence: No saved evidence signals are available.";
    const value =
      target === "link"
        ? url
        : [
            `JobCheck report: ${recommendation} (${score}/100).`,
            summary ?? "Review the evidence checklist for details.",
            safeDetails.join(" | "),
            evidenceText,
            `Report: ${url}`,
          ].join("\n");

    setCopyError(false);

    try {
      await copyText(value);
      setCopied(target);
      window.setTimeout(() => setCopied(null), 2_000);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <section className="rounded-2xl border border-teal-200 bg-teal-50 p-6">
      <h2 className="font-semibold text-teal-950">Share this report</h2>
      <p className="mt-1 text-sm leading-6 text-teal-900/70">
        Reports are public to anyone with the link. Share only with people you
        trust.
      </p>
      <div className="mt-4 grid gap-3">
        <button
          type="button"
          onClick={() => handleCopy("link")}
          className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          {copied === "link" ? "Report link copied" : "Copy report link"}
        </button>
        <button
          type="button"
          onClick={() => handleCopy("summary")}
          className="rounded-lg border border-teal-300 bg-white px-4 py-2.5 text-sm font-semibold text-teal-900 transition hover:bg-teal-100"
        >
          {copied === "summary" ? "Summary copied" : "Copy summary"}
        </button>
        <Link
          href="/#scan"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          Check another job
        </Link>
      </div>
      <p aria-live="polite" className="mt-3 text-xs text-teal-900/70">
        {copyError
          ? "Could not copy automatically. Select the address from your browser."
          : copied
            ? "Copied to your clipboard."
            : "The shared link opens this saved public report."}
      </p>
    </section>
  );
}

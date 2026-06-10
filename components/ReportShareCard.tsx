"use client";

import { useState } from "react";

export function ReportShareCard() {
  const [copied, setCopied] = useState(false);

  async function shareReport() {
    const shareData = {
      title: "Job trust report",
      text: "Review this evidence-based job trust report.",
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
      return;
    }

    await copyLink();
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2_000);
  }

  return (
    <section className="rounded-2xl border border-teal-200 bg-teal-50 p-6">
      <h2 className="font-semibold text-teal-950">Share this report</h2>
      <p className="mt-1 text-sm leading-6 text-teal-900/70">
        Send the evidence checklist to someone you trust for a second opinion.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={shareReport}
          className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          Share report
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="rounded-lg border border-teal-300 bg-white px-4 py-2.5 text-sm font-semibold text-teal-900 transition hover:bg-teal-100"
        >
          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>
    </section>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { InputType } from "@/lib/types";

const inputOptions: { value: InputType; label: string }[] = [
  { value: "job_url", label: "Job URL" },
  { value: "job_description", label: "Job description" },
  { value: "recruiter_email", label: "Recruiter email" },
  { value: "job_offer", label: "Job offer" },
];

const placeholders: Record<InputType, string> = {
  job_url: "https://company.com/careers/job...",
  job_description:
    "Paste the full job description, including company, title, pay, and contact details...",
  recruiter_email:
    "Paste the recruiter's email address or the full recruiting message...",
  job_offer: "Paste the job offer or hiring message you received...",
};

type ScanResponse = {
  reportUrl?: string;
  error?: string;
  issues?: { input?: string[]; inputType?: string[] };
};

export function ScanForm({
  defaultInputType = "job_description",
  compact = false,
}: {
  defaultInputType?: InputType;
  compact?: boolean;
}) {
  const router = useRouter();
  const [inputType, setInputType] = useState<InputType>(defaultInputType);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, inputType }),
      });
      const data = (await response.json()) as ScanResponse;

      if (!response.ok || !data.reportUrl) {
        const validationMessage = data.issues?.input?.[0];
        throw new Error(validationMessage ?? data.error ?? "The scan could not be completed.");
      }

      router.push(data.reportUrl);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The scan could not be completed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 ${
        compact ? "p-5 sm:p-6" : "p-5 sm:p-8"
      }`}
    >
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-slate-800">
          What would you like to check?
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {inputOptions.map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition ${
                inputType === option.value
                  ? "border-teal-700 bg-teal-50 text-teal-900"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="inputType"
                value={option.value}
                checked={inputType === option.value}
                onChange={() => setInputType(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label htmlFor="job-input" className="mt-5 block text-sm font-semibold text-slate-800">
        Paste the job information
      </label>
      <textarea
        id="job-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={placeholders[inputType]}
        rows={compact ? 6 : 8}
        maxLength={50_000}
        required
        className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500">
          Do not include passwords, full SSNs, bank numbers, or identity documents.
        </p>
        <button
          type="submit"
          disabled={isSubmitting || input.trim().length < 10}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Checking signals
            </>
          ) : (
            "Run job check"
          )}
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      ) : null}
    </form>
  );
}

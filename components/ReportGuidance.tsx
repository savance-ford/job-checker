import type { Recommendation } from "@/lib/types";

const guidance: Record<
  Recommendation,
  { meaning: string; nextStep: string; label: string }
> = {
  "Lower Risk": {
    label: "Fewer risk signals found",
    meaning:
      "The submitted details produced fewer risk signals and no major pattern that pushed the score into a caution range. This scan is not a guarantee, so independent verification still matters.",
    nextStep:
      "This scan found fewer risk signals, but you should still apply through the official company or ATS link when possible.",
  },
  "Verify First": {
    label: "Verify before applying",
    meaning:
      "The report found a mix of positive details and items that remain unresolved or deserve a closer look. An independent company check should come before sensitive information is shared.",
    nextStep:
      "Check the company's official careers page before sharing personal information or continuing the process.",
  },
  "High Caution": {
    label: "High caution recommended",
    meaning:
      "Evidence suggests caution because the submitted details include multiple risk signals or important verification gaps. Pause and confirm the employer through an independent channel.",
    nextStep:
      "Avoid sending money, banking details, SSN, identity documents, or personal information until the employer is independently verified.",
  },
};

export function ReportGuidance({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const content = guidance[recommendation];

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-700">
          What this means
        </p>
        <h2 className="mt-3 text-xl font-bold text-slate-950">
          {content.label}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {content.meaning}
        </p>
      </section>
      <section className="rounded-2xl border border-teal-200 bg-teal-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-700">
          Recommended next step
        </p>
        <p className="mt-3 text-lg font-semibold leading-7 text-teal-950">
          {content.nextStep}
        </p>
      </section>
    </div>
  );
}

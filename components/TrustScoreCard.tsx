import type { Recommendation } from "@/lib/types";

const recommendationStyles: Record<Recommendation, string> = {
  "Lower Risk": "bg-emerald-100 text-emerald-900",
  "Verify First": "bg-amber-100 text-amber-950",
  "High Caution": "bg-rose-100 text-rose-900",
};

export function TrustScoreCard({
  score,
  recommendation,
  summary,
  lastChecked,
}: {
  score: number;
  recommendation: Recommendation;
  summary: string | null;
  lastChecked: string;
}) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  return (
    <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/10 sm:p-8">
      <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
        <div className="relative mx-auto size-36 shrink-0 sm:mx-0">
          <svg viewBox="0 0 100 100" className="-rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#334155" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 grid place-content-center text-center">
            <span className="text-4xl font-bold">{score}</span>
            <span className="text-xs text-slate-400">out of 100</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-300">
            Overall recommendation
          </p>
          <div
            className={`mt-3 inline-flex rounded-full px-4 py-2 text-lg font-bold ${recommendationStyles[recommendation]}`}
          >
            {recommendation}
          </div>
          <p className="mt-4 max-w-xl leading-7 text-slate-300">{summary}</p>
          <p className="mt-4 text-sm text-slate-400">
            Last checked {lastChecked}
          </p>
        </div>
      </div>
    </section>
  );
}

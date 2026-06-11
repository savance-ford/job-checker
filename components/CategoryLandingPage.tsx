import Link from "next/link";

import { ScanForm } from "@/components/ScanForm";
import type { CategoryPageConfig } from "@/lib/categoryPages";

export function CategoryLandingPage({ config }: { config: CategoryPageConfig }) {
  return (
    <main>
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_#ccfbf1,_transparent_38%),linear-gradient(#f8fafc,#fff)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Free evidence-based check
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl">
              {config.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{config.intro}</p>
            <ul className="mt-7 space-y-3 text-sm text-slate-700">
              {config.checks.map((check) => (
                <li key={check} className="flex gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-teal-100 text-teal-800">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="size-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="m4 10 4 4 8-9" />
                    </svg>
                  </span>
                  {check}
                </li>
              ))}
            </ul>
          </div>
          <div id="scan" className="scroll-mt-24">
            <ScanForm defaultInputType={config.defaultInputType} compact />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              What this checker can tell you
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              {config.detail}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-800">
              Warning signs to review
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-amber-950">
              {config.warningSigns.map((warning) => (
                <li key={warning} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-600"
                  />
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-teal-200 bg-teal-50 p-6 text-teal-950">
          <h3 className="font-semibold">A report is a starting point</h3>
          <p className="mt-2 text-sm leading-6">
            Risk signals do not determine whether an employer or listing is
            legitimate. Verify the opening through the employer&apos;s official
            website or a contact method you found independently.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
            Frequently asked questions
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Questions about this check
          </h2>
          <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-6">
            {config.faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="text-xl font-normal text-teal-700 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 text-center sm:px-8">
        <Link
          href="/"
          className="inline-flex font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4"
        >
          See how JobCheck works
        </Link>
      </section>
    </main>
  );
}

import Link from "next/link";

import { AnswerBlock } from "@/components/AnswerBlock";
import { FAQSection } from "@/components/FAQSection";
import { JsonLdFAQ } from "@/components/JsonLdFAQ";
import { RelatedCheckers } from "@/components/RelatedCheckers";
import { ScanForm } from "@/components/ScanForm";
import { WarningSigns } from "@/components/WarningSigns";
import type { CategoryPageConfig } from "@/lib/categoryPages";

export function CategoryLandingPage({ config }: { config: CategoryPageConfig }) {
  return (
    <main>
      <JsonLdFAQ faqs={config.faqs} />
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

      <div className="mx-auto max-w-5xl px-5 pt-12 sm:px-8 sm:pt-16">
        <AnswerBlock title={config.answerTitle} steps={config.answerSteps} />
      </div>

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
          <WarningSigns signs={config.warningSigns} />
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

      <FAQSection faqs={config.faqs} />
      <RelatedCheckers links={config.relatedCheckers} />

      <section className="mx-auto max-w-4xl px-5 pb-12 text-center sm:px-8">
        <Link
          href="/"
          className="inline-flex font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4"
        >
          See how JobTrustCheck works
        </Link>
      </section>
    </main>
  );
}

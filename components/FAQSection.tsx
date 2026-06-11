import type { CategoryFaq } from "@/lib/categoryPages";

export function FAQSection({ faqs }: { faqs: readonly CategoryFaq[] }) {
  return (
    <section
      aria-labelledby="faq-heading"
      className="border-t border-slate-200 bg-slate-50"
    >
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          Frequently asked questions
        </p>
        <h2
          id="faq-heading"
          className="mt-3 text-3xl font-bold tracking-tight text-slate-950"
        >
          Questions about this check
        </h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-6">
          {faqs.map((faq) => (
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
  );
}

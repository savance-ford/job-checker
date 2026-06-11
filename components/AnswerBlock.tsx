export function AnswerBlock({
  title,
  steps,
}: {
  title: string;
  steps: readonly string[];
}) {
  return (
    <section
      aria-labelledby="direct-answer-heading"
      className="rounded-3xl border border-teal-200 bg-teal-50 p-6 sm:p-8"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
        Quick answer
      </p>
      <h2
        id="direct-answer-heading"
        className="mt-3 text-3xl font-bold tracking-tight text-teal-950"
      >
        {title}
      </h2>
      <ol className="mt-6 grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <li
            key={step}
            className="flex gap-4 rounded-2xl border border-teal-200 bg-white p-4 text-sm leading-6 text-slate-700"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-700 font-bold text-white">
              {index + 1}
            </span>
            <span className="pt-1">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

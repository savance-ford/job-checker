import Link from "next/link";

type InformationSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

export function InformationPage({
  eyebrow,
  title,
  intro,
  sections,
  note,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly InformationSection[];
  note?: string;
}) {
  return (
    <main className="bg-slate-50/70">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_#ccfbf1,_transparent_38%),linear-gradient(#f8fafc,#fff)]">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {intro}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 leading-7 text-slate-600"
                >
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className="mt-4 space-y-3 text-slate-600">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 leading-7">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-600"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {note ? (
          <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            {note}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/#scan"
            className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Check a job
          </Link>
          <Link
            href="/job-scam-checker"
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            Learn about job risk signals
          </Link>
        </div>
      </div>
    </main>
  );
}

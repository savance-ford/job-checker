import Link from "next/link";

import { ScanForm } from "@/components/ScanForm";

const steps = [
  {
    number: "01",
    title: "Paste the job",
    description:
      "Add a job post, recruiter email, offer message, or application link.",
  },
  {
    number: "02",
    title: "We check signals",
    description:
      "Deterministic checks review links, contact details, hiring language, and requests.",
  },
  {
    number: "03",
    title: "Get a trust report",
    description:
      "See a score, recommendation, and evidence checklist you can verify yourself.",
  },
] as const;

const checkerLinks = [
  ["Remote jobs", "/remote-job-scam-checker"],
  ["Work-from-home jobs", "/work-from-home-job-scam-checker"],
  ["Data entry jobs", "/data-entry-job-scam-checker"],
  ["Customer service jobs", "/customer-service-job-scam-checker"],
  ["Recruiter emails", "/recruiter-email-checker"],
  ["Job offers", "/job-offer-checker"],
] as const;

export default function Home() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_#ccfbf1,_transparent_34%),linear-gradient(#f8fafc,#fff)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Evidence before action
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
              Check if a job is real before you apply.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Paste a job post, recruiter email, or offer message and get a
              trust report with evidence-based risk signals.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-700">
              <span>Clear evidence checklist</span>
              <span aria-hidden="true" className="text-teal-500">
                /
              </span>
              <span>No account required</span>
              <span aria-hidden="true" className="text-teal-500">
                /
              </span>
              <span>No AI guesswork</span>
            </div>
          </div>
          <div id="scan" className="scroll-mt-24">
            <ScanForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Paste job, check signals, get a trust report
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            The checker surfaces observable details. It does not accuse an
            employer or guarantee that an opportunity is legitimate.
          </p>
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="text-sm font-bold text-teal-700">{step.number}</span>
              <h3 className="mt-4 text-xl font-bold text-slate-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Check the kind of job message you received
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Each checker uses the same evidence engine with guidance
                tailored to the situation.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {checkerLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-800 transition hover:border-teal-300 hover:text-teal-800"
                >
                  {label}
                  <span aria-hidden="true">-&gt;</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-20">
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">
          Verify before you share money or sensitive information
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Use the report as a starting point, then confirm the role through the
          employer&apos;s official website or a contact channel you found
          independently.
        </p>
        <Link
          href="/#scan"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-6 font-semibold text-white transition hover:bg-teal-800"
        >
          Run a job check
        </Link>
      </section>
    </main>
  );
}

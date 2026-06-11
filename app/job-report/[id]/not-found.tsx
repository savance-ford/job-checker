import Link from "next/link";

export default function ReportNotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-700">
          Report not found
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          This saved report is not available
        </h1>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
          The link may be incomplete, or the report may no longer be available.
          You can run a new check without creating an account.
        </p>
        <Link
          href="/#scan"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-6 font-semibold text-white transition hover:bg-teal-800"
        >
          Check a job
        </Link>
      </section>
    </main>
  );
}

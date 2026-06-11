"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ReportError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Report page failed to load", error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-amber-100 text-amber-800">
          <span aria-hidden="true" className="text-xl font-bold">
            !
          </span>
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">
          Report temporarily unavailable
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          We could not load this report
        </h1>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
          The saved report may still be available. Try loading it again, or
          return to the checker and review another opportunity.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Try again
          </button>
          <Link
            href="/#scan"
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            Check another job
          </Link>
        </div>
      </section>
    </main>
  );
}

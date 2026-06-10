import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-slate-950">
          <span className="grid size-9 place-items-center rounded-xl bg-teal-700 text-white">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </span>
          JobCheck
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm">
          <Link
            href="/job-scam-checker"
            className="hidden text-slate-600 transition hover:text-slate-950 sm:block"
          >
            Job checker
          </Link>
          <Link
            href="/recruiter-email-checker"
            className="hidden text-slate-600 transition hover:text-slate-950 md:block"
          >
            Email checker
          </Link>
          <Link
            href="/#scan"
            className="rounded-lg bg-slate-950 px-4 py-2.5 font-medium text-white transition hover:bg-slate-800"
          >
            Check a job
          </Link>
        </nav>
      </div>
    </header>
  );
}

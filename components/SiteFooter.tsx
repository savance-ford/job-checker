import Link from "next/link";

const checkerLinks = [
  ["Job scam checker", "/job-scam-checker"],
  ["Ghost job checker", "/ghost-job-checker"],
  ["Remote job checker", "/remote-job-scam-checker"],
  ["Recruiter email checker", "/recruiter-email-checker"],
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="mb-3 font-semibold text-white">JobCheck</div>
          <p className="max-w-lg text-sm leading-6 text-slate-400">
            Evidence-based checks that help job seekers spot details worth
            verifying. A report is a screening aid, not a guarantee about an
            employer or opportunity.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {checkerLinks.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-white">
              {label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-800 px-5 py-5 text-center text-xs text-slate-500">
        Never send money or sensitive identity information until you have
        independently verified the employer.
      </div>
    </footer>
  );
}

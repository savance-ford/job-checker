import Link from "next/link";

const checkerLinks = [
  ["Job Scam Checker", "/job-scam-checker"],
  ["Ghost Job Checker", "/ghost-job-checker"],
  ["Remote Job Scam Checker", "/remote-job-scam-checker"],
  [
    "Work From Home Job Scam Checker",
    "/work-from-home-job-scam-checker",
  ],
  ["Data Entry Job Scam Checker", "/data-entry-job-scam-checker"],
  [
    "Customer Service Job Scam Checker",
    "/customer-service-job-scam-checker",
  ],
  ["Recruiter Email Checker", "/recruiter-email-checker"],
  ["Job Offer Checker", "/job-offer-checker"],
] as const;

const informationLinks = [
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Disclaimer", "/disclaimer"],
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.1fr_1.4fr_0.7fr]">
        <div>
          <div className="mb-3 font-semibold text-white">JobCheck</div>
          <p className="max-w-lg text-sm leading-6 text-slate-400">
            Evidence-based checks that help job seekers spot details worth
            verifying. A report is a screening aid, not a guarantee about an
            employer or opportunity.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-white">Job checkers</h2>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            {checkerLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="transition hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-white">Information</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {informationLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="transition hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-5 py-5 text-center text-xs text-slate-500">
        Never send money or sensitive identity information until you have
        independently verified the employer.
      </div>
    </footer>
  );
}

import Link from "next/link";

import type { RelatedChecker } from "@/lib/categoryPages";

export function RelatedCheckers({
  links,
}: {
  links: readonly RelatedChecker[];
}) {
  return (
    <section
      aria-labelledby="related-checkers-heading"
      className="mx-auto max-w-5xl px-5 py-14 sm:px-8"
    >
      <h2
        id="related-checkers-heading"
        className="text-2xl font-bold tracking-tight text-slate-950"
      >
        Related job checks
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-teal-300 hover:shadow-sm"
          >
            <span className="font-semibold text-teal-800">{link.title}</span>
            <span className="mt-2 block text-sm leading-6 text-slate-600">
              {link.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

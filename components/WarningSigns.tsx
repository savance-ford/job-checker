export function WarningSigns({ signs }: { signs: readonly string[] }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-800">
        Warning signs to review
      </p>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-amber-950">
        {signs.map((sign) => (
          <li key={sign} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-600"
            />
            {sign}
          </li>
        ))}
      </ul>
    </section>
  );
}

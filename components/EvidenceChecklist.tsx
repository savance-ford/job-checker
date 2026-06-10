import { SignalBadge } from "@/components/SignalBadge";
import type { ScanSignal, SignalStatus } from "@/lib/types";

const groups: {
  status: SignalStatus;
  title: string;
  description: string;
  accent: string;
}[] = [
  {
    status: "positive",
    title: "Positive signals",
    description: "Details that support the opportunity's credibility.",
    accent: "bg-emerald-500",
  },
  {
    status: "warning",
    title: "Caution signals",
    description: "Details worth checking before you apply or share information.",
    accent: "bg-amber-500",
  },
  {
    status: "unknown",
    title: "Neutral or incomplete",
    description: "Details the checker could not confirm from the submitted input.",
    accent: "bg-slate-400",
  },
];

function SignalList({ signals }: { signals: ScanSignal[] }) {
  return (
    <ul className="divide-y divide-slate-200">
      {signals.map((item, index) => (
        <li
          key={item.id ?? `${item.label}-${index}`}
          className="py-5 first:pt-0 last:pb-0"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="pr-4">
              <h3 className="font-semibold text-slate-950">{item.label}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {item.message}
              </p>
              {item.evidence ? (
                <p className="mt-2 break-words text-xs leading-5 text-slate-500">
                  Evidence: {item.evidence}
                </p>
              ) : null}
            </div>
            <SignalBadge
              status={item.status}
              severity={item.severity}
              label={item.label}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function EvidenceChecklist({ signals }: { signals: ScanSignal[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          Evidence checklist
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          What the report found
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Review the evidence together. No single signal determines whether a
          job is legitimate.
        </p>
      </div>

      <div className="space-y-8">
        {groups.map((group) => {
          const groupedSignals = signals.filter(
            (signal) => signal.status === group.status,
          );

          if (!groupedSignals.length) return null;

          return (
            <section key={group.status}>
              <div className="mb-4 flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={`mt-2 size-2.5 shrink-0 rounded-full ${group.accent}`}
                />
                <div>
                  <h3 className="font-bold text-slate-950">{group.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {group.description}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                <SignalList signals={groupedSignals} />
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

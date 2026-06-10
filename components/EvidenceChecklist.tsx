import { SignalBadge } from "@/components/SignalBadge";
import type { ScanSignal } from "@/lib/types";

export function EvidenceChecklist({ signals }: { signals: ScanSignal[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          Evidence checklist
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Signals found in this job
        </h2>
      </div>
      <ul className="divide-y divide-slate-200">
        {signals.map((item, index) => (
          <li key={item.id ?? `${item.label}-${index}`} className="py-5 first:pt-0 last:pb-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="pr-4">
                <h3 className="font-semibold text-slate-950">{item.label}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.message}</p>
                {item.evidence ? (
                  <p className="mt-2 break-words text-xs text-slate-500">
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
    </section>
  );
}

import type { SignalSeverity, SignalStatus } from "@/lib/types";

const statusStyles: Record<SignalStatus, string> = {
  positive: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-900",
  unknown: "bg-slate-100 text-slate-700",
};

const statusLabels: Record<SignalStatus, string> = {
  positive: "Positive",
  warning: "Review",
  unknown: "Could not verify",
};

export function SignalBadge({
  status,
  severity,
  label,
}: {
  status: SignalStatus;
  severity: SignalSeverity;
  label?: string;
}) {
  const displayLabel =
    label === "Job found in public ATS feed"
      ? "Found"
      : label === "Could not verify exact job"
        ? "Could not verify"
        : label === "ATS verification incomplete"
          ? "Incomplete"
          : label === "Known ATS detected"
            ? "Known ATS"
            : statusLabels[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {displayLabel}
      {status === "warning" && severity === "high" ? " - high priority" : ""}
    </span>
  );
}

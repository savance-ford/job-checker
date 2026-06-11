export default function LoadingReport() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading job trust report"
      className="bg-slate-50/70"
    >
      <div className="mx-auto w-full max-w-6xl animate-pulse px-5 py-10 sm:px-8 sm:py-14">
        <div className="h-4 w-36 rounded bg-slate-200" />
        <div className="mt-4 h-10 w-2/3 max-w-xl rounded bg-slate-200" />
        <div className="mt-3 h-4 w-52 rounded bg-slate-200" />
        <div className="mt-8 h-64 rounded-3xl bg-slate-900" />
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="h-44 rounded-2xl bg-slate-200" />
          <div className="h-44 rounded-2xl bg-teal-100" />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="h-[32rem] rounded-2xl bg-slate-200" />
          <div className="space-y-6">
            <div className="h-64 rounded-2xl bg-teal-100" />
            <div className="h-72 rounded-2xl bg-slate-200" />
          </div>
        </div>
        <p className="sr-only">Loading the saved report and evidence checklist.</p>
      </div>
    </main>
  );
}

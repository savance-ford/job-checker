export default function LoadingReport() {
  return (
    <main className="mx-auto w-full max-w-6xl animate-pulse px-5 py-14 sm:px-8">
      <div className="h-5 w-36 rounded bg-slate-200" />
      <div className="mt-4 h-10 w-2/3 rounded bg-slate-200" />
      <div className="mt-8 h-64 rounded-2xl bg-slate-900" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="h-96 rounded-2xl bg-slate-200" />
        <div className="h-80 rounded-2xl bg-slate-200" />
      </div>
    </main>
  );
}

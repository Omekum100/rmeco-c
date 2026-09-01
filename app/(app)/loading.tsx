export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded border bg-white" />
        ))}
      </div>
      <div className="space-y-3 md:hidden">
        {[1, 2].map((item) => (
          <div key={item} className="h-40 animate-pulse rounded border border-slate-200 bg-white" />
        ))}
      </div>
      <div className="hidden h-80 animate-pulse rounded border bg-white md:block" />
    </div>
  );
}

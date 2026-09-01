export default function PartiesLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="h-24 animate-pulse rounded bg-slate-200" />
      <div className="space-y-3 md:hidden">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-36 animate-pulse rounded border border-slate-200 bg-white" />
        ))}
      </div>
      <div className="hidden h-72 animate-pulse rounded bg-slate-200 md:block" />
    </div>
  );
}

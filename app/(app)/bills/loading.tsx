export default function BillsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
      <div className="h-24 animate-pulse rounded border bg-white" />
      <div className="space-y-3 md:hidden">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-40 animate-pulse rounded border border-slate-200 bg-white" />
        ))}
      </div>
      <div className="hidden h-96 animate-pulse rounded border bg-white md:block" />
    </div>
  );
}

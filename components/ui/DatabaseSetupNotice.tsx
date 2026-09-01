export function DatabaseSetupNotice() {
  return (
    <div className="rounded border border-amber-200 bg-amber-50 p-5 text-amber-950">
      <h1 className="text-lg font-semibold">Database setup required</h1>
      <p className="mt-2 text-sm">
        The app is running, but Prisma cannot connect to PostgreSQL yet. Create a
        <span className="font-mono"> .env </span>
        file with
        <span className="font-mono"> DATABASE_URL </span>
        and run the Prisma migration before using bill records.
      </p>
      <div className="mt-4 rounded bg-white/70 p-3 font-mono text-xs text-amber-900">
        <div>copy .env.example .env</div>
        <div>npm run prisma:migrate</div>
        <div>npm run prisma:seed</div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { BillSummaryCards } from "@/components/bills/BillSummaryCards";
import { BillTable } from "@/components/bills/BillTable";
import { DatabaseSetupNotice } from "@/components/ui/DatabaseSetupNotice";
import { getBillSummary, getRecentBills } from "@/lib/data/bills";
import { isDatabaseSetupError } from "@/lib/data/errors";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let summary;
  let recentBills;

  try {
    [summary, recentBills] = await Promise.all([getBillSummary(), getRecentBills()]);
  } catch (error) {
    if (isDatabaseSetupError(error)) {
      return <DatabaseSetupNotice />;
    }

    throw error;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track daily supplier purchase bills and payment status.
          </p>
        </div>
        <Link
          href="/bills/new"
          className="rounded bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-700"
        >
          Add bill
        </Link>
      </div>

      <BillSummaryCards summary={summary} />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Recent bills</h2>
          <Link href="/bills" className="text-sm font-medium text-brand-700 hover:text-brand-600">
            View all
          </Link>
        </div>
        <BillTable
          bills={recentBills}
          emptyTitle="No bill records yet"
          emptyDescription="Start by adding today's supplier or purchase bill."
        />
      </section>
    </div>
  );
}

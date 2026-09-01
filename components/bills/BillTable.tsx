import type { Bill, Party } from "@prisma/client";
import Link from "next/link";
import { formatCurrency, formatDisplayDate } from "@/lib/formatters";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteBillButton } from "@/components/bills/DeleteBillButton";
import { PaymentStatusBadge } from "@/components/bills/PaymentStatusBadge";

type BillTableProps = {
  bills: Array<Bill & { party?: Party | null }>;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function BillTable({
  bills,
  emptyTitle = "No bills found",
  emptyDescription = "Create a bill record or adjust your filters to see results."
}: BillTableProps) {
  if (bills.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionHref="/bills/new"
        actionLabel="Add bill"
      />
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {bills.map((bill) => (
          <article key={bill.id} className="rounded border border-slate-200 bg-white p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {formatDisplayDate(bill.billDate)}
                </p>
                <h2 className="mt-1 break-words text-base font-semibold text-slate-950">
                  {bill.partyName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">Bill No. {bill.billNumber}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-base font-semibold text-slate-950">
                  {formatCurrency(bill.billAmount.toString())}
                </p>
                <div className="mt-2">
                  <PaymentStatusBadge status={bill.paymentStatus} />
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
              {bill.party ? (
                <>
                  <Link
                    href={`/parties/${bill.party.id}`}
                    className="rounded bg-slate-100 px-2 py-1 font-mono font-semibold text-slate-700"
                  >
                    {bill.party.partyCode}
                  </Link>
                  <span className="rounded bg-slate-100 px-2 py-1">{bill.party.location}</span>
                </>
              ) : (
                <span className="rounded bg-slate-100 px-2 py-1">Manual party</span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Link
                href={`/bills/${bill.id}`}
                className="rounded border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                View
              </Link>
              <Link
                href={`/bills/${bill.id}/edit`}
                className="rounded border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </Link>
              <DeleteBillButton id={bill.id} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded border border-slate-200 bg-white md:block">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Party</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Bill No.</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600">Amount</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bills.map((bill) => (
              <tr key={bill.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {formatDisplayDate(bill.billDate)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-950">{bill.partyName}</div>
                  {bill.party ? (
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                      <Link
                        href={`/parties/${bill.party.id}`}
                        className="rounded bg-slate-100 px-2 py-0.5 font-mono font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        {bill.party.partyCode}
                      </Link>
                      <span>{bill.party.location}</span>
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-slate-400">Manual party</div>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{bill.billNumber}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-950">
                  {formatCurrency(bill.billAmount.toString())}
                </td>
                <td className="px-4 py-3">
                  <PaymentStatusBadge status={bill.paymentStatus} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/bills/${bill.id}`}
                      className="rounded border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </Link>
                    <Link
                      href={`/bills/${bill.id}/edit`}
                      className="rounded border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </Link>
                    <DeleteBillButton id={bill.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteBillButton } from "@/components/bills/DeleteBillButton";
import { PaymentStatusBadge } from "@/components/bills/PaymentStatusBadge";
import { DatabaseSetupNotice } from "@/components/ui/DatabaseSetupNotice";
import { formatCurrency, formatDisplayDate, humanizeEnum } from "@/lib/formatters";
import { getBillById } from "@/lib/data/bills";
import { isDatabaseSetupError } from "@/lib/data/errors";

export const dynamic = "force-dynamic";

type BillDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BillDetailPage({ params }: BillDetailPageProps) {
  const { id } = await params;
  let bill;

  try {
    bill = await getBillById(id);
  } catch (error) {
    if (isDatabaseSetupError(error)) {
      return <DatabaseSetupNotice />;
    }

    throw error;
  }

  if (!bill) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/bills" className="text-sm font-medium text-brand-700 hover:text-brand-600">
            Back to bills
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">{bill.partyName}</h1>
          <p className="mt-1 text-sm text-slate-500">Bill number {bill.billNumber}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/bills/${bill.id}/edit`}
            className="rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
          >
            Edit
          </Link>
          <DeleteBillButton id={bill.id} />
        </div>
      </div>

      <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-soft">
          <div className="grid gap-5 sm:grid-cols-2">
            <DetailItem
              label="Party code"
              value={
                bill.party ? (
                  <Link href={`/parties/${bill.party.id}`} className="text-brand-700 hover:text-brand-600">
                    {bill.party.partyCode}
                  </Link>
                ) : (
                  "Manual party"
                )
              }
            />
            <DetailItem label="Location" value={bill.party?.location || "-"} />
            <DetailItem label="Bill date" value={formatDisplayDate(bill.billDate)} />
            <DetailItem label="Amount" value={formatCurrency(bill.billAmount.toString())} />
            <DetailItem label="Payment status" value={<PaymentStatusBadge status={bill.paymentStatus} />} />
            <DetailItem label="Payment mode" value={humanizeEnum(bill.paymentMode)} />
            <DetailItem label="Created" value={formatDisplayDate(bill.createdAt)} />
            <DetailItem label="Updated" value={formatDisplayDate(bill.updatedAt)} />
          </div>
          <div className="mt-6 border-t border-slate-200 pt-5">
            <h2 className="text-sm font-semibold text-slate-700">Notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
              {bill.notes || "No notes added."}
            </p>
          </div>
        </div>

        <aside className="rounded border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-sm font-semibold text-slate-700">Bill image</h2>
          {bill.billImageUrl ? (
            <div className="relative mt-3 aspect-[4/5] overflow-hidden rounded border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bill.billImageUrl}
                alt={`Bill ${bill.billNumber}`}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="mt-3 rounded border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
              No image uploaded for this bill.
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}

function DetailItem({
  label,
  value
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-1 text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}

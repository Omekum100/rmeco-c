import Link from "next/link";
import { notFound } from "next/navigation";
import { BillTable } from "@/components/bills/BillTable";
import { DeletePartyButton } from "@/components/parties/DeletePartyButton";
import { DatabaseSetupNotice } from "@/components/ui/DatabaseSetupNotice";
import { getPartyById } from "@/lib/data/parties";
import { isDatabaseSetupError } from "@/lib/data/errors";
import { formatCurrency, formatDisplayDate } from "@/lib/formatters";

export const dynamic = "force-dynamic";

type PartyDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PartyDetailPage({ params }: PartyDetailPageProps) {
  const { id } = await params;
  let party;

  try {
    party = await getPartyById(id);
  } catch (error) {
    if (isDatabaseSetupError(error)) {
      return <DatabaseSetupNotice />;
    }

    throw error;
  }

  if (!party) {
    notFound();
  }

  const totalAmount = party.bills.reduce((sum, bill) => sum + Number(bill.billAmount), 0);
  const pendingAmount = party.bills
    .filter((bill) => bill.paymentStatus !== "PAID")
    .reduce((sum, bill) => sum + Number(bill.billAmount), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/parties" className="text-sm font-medium text-brand-700 hover:text-brand-600">
            Back to parties
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-950">{party.partyName}</h1>
            <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
              {party.partyCode}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{party.location}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/parties/${party.id}/edit`}
            className="rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
          >
            Edit
          </Link>
          <DeletePartyButton id={party.id} />
        </div>
      </div>

      <section className="rounded border border-slate-200 bg-white p-5 shadow-soft">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem label="Phone" value={party.phone || "-"} />
          <DetailItem label="GST number" value={party.gstNumber || "-"} />
          <DetailItem label="Bills" value={party.bills.length} />
          <DetailItem label="Total purchase" value={formatCurrency(totalAmount)} />
          <DetailItem label="Pending amount" value={formatCurrency(pendingAmount)} />
          <DetailItem label="Created" value={formatDisplayDate(party.createdAt)} />
          <DetailItem label="Updated" value={formatDisplayDate(party.updatedAt)} />
        </div>
        <div className="mt-6 grid gap-5 border-t border-slate-200 pt-5 sm:grid-cols-2">
          <DetailItem label="Address" value={party.address || "No address added."} />
          <DetailItem label="Notes" value={party.notes || "No notes added."} />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Party bills</h2>
          <Link href="/bills/new" className="text-sm font-medium text-brand-700 hover:text-brand-600">
            Add bill
          </Link>
        </div>
        <BillTable
          bills={party.bills}
          emptyTitle="No bills for this party"
          emptyDescription="Create a bill and select this party to link purchase records here."
        />
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
      <div className="mt-1 whitespace-pre-wrap text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}

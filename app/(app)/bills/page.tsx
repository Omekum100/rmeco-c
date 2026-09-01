import Link from "next/link";
import { BillTable } from "@/components/bills/BillTable";
import { SearchAndFilters } from "@/components/bills/SearchAndFilters";
import { DatabaseSetupNotice } from "@/components/ui/DatabaseSetupNotice";
import { getBills } from "@/lib/data/bills";
import { getPartyOptions } from "@/lib/data/parties";
import { isDatabaseSetupError } from "@/lib/data/errors";
import { billFilterSchema } from "@/lib/validations/bill";

export const dynamic = "force-dynamic";

type BillsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BillsPage({ searchParams }: BillsPageProps) {
  const params = await searchParams;
  const filters = billFilterSchema.parse({
    q: firstValue(params.q) ?? "",
    partyId: firstValue(params.partyId) ?? "",
    location: firstValue(params.location) ?? "",
    paymentStatus: firstValue(params.paymentStatus) ?? "",
    from: firstValue(params.from) ?? "",
    to: firstValue(params.to) ?? ""
  });
  let bills;
  let parties;

  try {
    [bills, parties] = await Promise.all([getBills(filters), getPartyOptions()]);
  } catch (error) {
    if (isDatabaseSetupError(error)) {
      return <DatabaseSetupNotice />;
    }

    throw error;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Bills</h1>
          <p className="mt-1 text-sm text-slate-500">
            Search by party name or bill number, and filter records by bill date.
          </p>
        </div>
        <Link
          href="/bills/new"
          className="rounded bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-700"
        >
          Add bill
        </Link>
      </div>

      <SearchAndFilters filters={filters} parties={parties} />
      <BillTable bills={bills} />
    </div>
  );
}

import Link from "next/link";
import { PartySearch } from "@/components/parties/PartySearch";
import { PartyTable } from "@/components/parties/PartyTable";
import { DatabaseSetupNotice } from "@/components/ui/DatabaseSetupNotice";
import { getParties } from "@/lib/data/parties";
import { isDatabaseSetupError } from "@/lib/data/errors";
import { partyFilterSchema } from "@/lib/validations/party";

export const dynamic = "force-dynamic";

type PartiesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PartiesPage({ searchParams }: PartiesPageProps) {
  const params = await searchParams;
  const filters = partyFilterSchema.parse({
    q: firstValue(params.q) ?? ""
  });
  let parties;

  try {
    parties = await getParties(filters);
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
          <h1 className="text-2xl font-semibold text-slate-950">Parties</h1>
          <p className="mt-1 text-sm text-slate-500">
            Maintain party names, locations, and short codes for bill entry.
          </p>
        </div>
        <Link
          href="/parties/new"
          className="rounded bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-700"
        >
          Add party
        </Link>
      </div>

      <PartySearch filters={filters} />
      <PartyTable parties={parties} />
    </div>
  );
}

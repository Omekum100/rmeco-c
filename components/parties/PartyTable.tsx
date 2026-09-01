import type { Party } from "@prisma/client";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeletePartyButton } from "@/components/parties/DeletePartyButton";

type PartyTableProps = {
  parties: Party[];
};

export function PartyTable({ parties }: PartyTableProps) {
  if (parties.length === 0) {
    return (
      <EmptyState
        title="No parties found"
        description="Add party master records so bills can use consistent party codes."
        actionHref="/parties/new"
        actionLabel="Add party"
      />
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {parties.map((party) => (
          <article key={party.id} className="rounded border border-slate-200 bg-white p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                  {party.partyCode}
                </span>
                <h2 className="mt-3 break-words text-base font-semibold text-slate-950">
                  {party.partyName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{party.location}</p>
              </div>
              <p className="shrink-0 text-right text-sm text-slate-600">{party.phone || "-"}</p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Link
                href={`/parties/${party.id}`}
                className="rounded border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                View
              </Link>
              <Link
                href={`/parties/${party.id}/edit`}
                className="rounded border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </Link>
              <DeletePartyButton id={party.id} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded border border-slate-200 bg-white md:block">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Code</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Party</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Location</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Phone</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {parties.map((party) => (
              <tr key={party.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                    {party.partyCode}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-slate-950">{party.partyName}</td>
                <td className="px-4 py-3 text-slate-600">{party.location}</td>
                <td className="px-4 py-3 text-slate-600">{party.phone || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/parties/${party.id}`}
                      className="rounded border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </Link>
                    <Link
                      href={`/parties/${party.id}/edit`}
                      className="rounded border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </Link>
                    <DeletePartyButton id={party.id} />
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

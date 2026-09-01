"use client";

import { useRouter } from "next/navigation";
import type { PartyFilterValues } from "@/lib/validations/party";

type PartySearchProps = {
  filters: PartyFilterValues;
};

export function PartySearch({ filters }: PartySearchProps) {
  const router = useRouter();

  function onSubmit(formData: FormData) {
    const params = new URLSearchParams();
    const q = String(formData.get("q") ?? "").trim();

    if (q) {
      params.set("q", q);
    }

    router.push(`/parties${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form action={onSubmit} className="rounded border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          defaultValue={filters.q ?? ""}
          className="focus-ring h-10 flex-1 rounded border border-slate-300 px-3 text-sm"
          placeholder="Search party, code, or location"
        />
        <button
          type="submit"
          className="h-10 rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}

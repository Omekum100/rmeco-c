import { formatCurrency } from "@/lib/formatters";

type BillSummaryCardsProps = {
  summary: {
    totalBills: number;
    totalAmount: number;
    todayBills: number;
    todayAmount: number;
    totalParties: number;
    linkedBills: number;
  };
};

const cardConfig: Array<{
  label: string;
  key: keyof BillSummaryCardsProps["summary"];
  currency?: boolean;
}> = [
  { label: "Total bills", key: "totalBills" },
  { label: "Total bill amount", key: "totalAmount", currency: true },
  { label: "Saved parties", key: "totalParties" },
  { label: "Bills linked to parties", key: "linkedBills" },
  { label: "Today's bill count", key: "todayBills" },
  { label: "Today's bill amount", key: "todayAmount", currency: true }
] as const;

export function BillSummaryCards({ summary }: BillSummaryCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cardConfig.map((card) => {
        const value = summary[card.key];

        return (
          <div key={card.key} className="rounded border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">
              {card.currency ? formatCurrency(value) : value}
            </p>
          </div>
        );
      })}
    </section>
  );
}

import { PaymentStatus } from "@prisma/client";
import { clsx } from "clsx";
import { humanizeEnum } from "@/lib/formatters";

const statusClassName: Record<PaymentStatus, string> = {
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  UNPAID: "bg-rose-50 text-rose-700 ring-rose-200",
  PARTIAL: "bg-amber-50 text-amber-800 ring-amber-200"
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded px-2 py-1 text-xs font-semibold ring-1 ring-inset",
        statusClassName[status]
      )}
    >
      {humanizeEnum(status)}
    </span>
  );
}

"use client";

import { useTransition } from "react";
import { deleteBillAction } from "@/lib/actions/bills";
import { RotatingLogo } from "@/components/ui/RotatingLogo";
import { showToast } from "@/components/ui/Toast";

export function DeleteBillButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        const confirmed = window.confirm(
          "Delete this bill record? This action cannot be undone."
        );

        if (confirmed) {
          startTransition(() => {
            void deleteBillAction(id).catch((error) => {
              showToast({
                tone: "error",
                message: error instanceof Error ? error.message : "Unable to delete bill."
              });
            });
          });
        }
      }}
      className="w-full rounded border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="inline-flex items-center gap-2">
        {isPending ? <RotatingLogo label="Deleting bill" size="sm" /> : null}
        {isPending ? "Deleting..." : "Delete"}
      </span>
    </button>
  );
}

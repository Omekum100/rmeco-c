"use client";

import { useTransition } from "react";
import { deletePartyAction } from "@/lib/actions/parties";
import { RotatingLogo } from "@/components/ui/RotatingLogo";
import { showToast } from "@/components/ui/Toast";

type DeletePartyButtonProps = {
  id: string;
};

export function DeletePartyButton({ id }: DeletePartyButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        const confirmed = window.confirm(
          "Delete this party? Existing bills will keep their party name."
        );

        if (confirmed) {
          startTransition(() => {
            void deletePartyAction(id).catch((error) => {
              showToast({
                tone: "error",
                message: error instanceof Error ? error.message : "Unable to delete party."
              });
            });
          });
        }
      }}
      className="w-full rounded border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="inline-flex items-center gap-2">
        {isPending ? <RotatingLogo label="Deleting party" size="sm" /> : null}
        {isPending ? "Deleting..." : "Delete"}
      </span>
    </button>
  );
}

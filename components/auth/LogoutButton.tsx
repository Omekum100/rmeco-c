"use client";

import { useTransition } from "react";
import { logoutAction } from "@/lib/actions/auth";
import { RotatingLogo } from "@/components/ui/RotatingLogo";
import { showToast } from "@/components/ui/Toast";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          void logoutAction().catch((error) => {
            showToast({
              tone: "error",
              message: error instanceof Error ? error.message : "Unable to logout."
            });
          });
        });
      }}
      className="inline-flex w-full items-center justify-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {isPending ? <RotatingLogo label="Logging out" size="sm" /> : null}
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}

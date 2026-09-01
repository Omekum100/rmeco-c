"use client";

import { useFormStatus } from "react-dom";
import { RotatingLogo } from "@/components/ui/RotatingLogo";

type SubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  className?: string;
};

export function SubmitButton({ label, pendingLabel = "Saving...", className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "focus-ring inline-flex items-center justify-center gap-2 rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      {pending ? <RotatingLogo label={pendingLabel} size="sm" /> : null}
      {pending ? pendingLabel : label}
    </button>
  );
}

export function FormPendingOverlay({ label = "Saving..." }: { label?: string }) {
  const { pending } = useFormStatus();

  if (!pending) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-10 grid place-items-center rounded bg-white/75 backdrop-blur-[1px]">
      <div className="flex items-center gap-3 rounded border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-soft">
        <RotatingLogo label={label} />
        <span>{label}</span>
      </div>
    </div>
  );
}

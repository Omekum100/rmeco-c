"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import type { PartyActionState } from "@/lib/actions/parties";
import { FormPendingOverlay, SubmitButton } from "@/components/ui/FormStatus";
import { useActionToast } from "@/components/ui/Toast";
import { locationOptions } from "@/lib/locations";
import { buildPartyCode } from "@/lib/partyCode";
import { partySchema, type PartyFormValues } from "@/lib/validations/party";

type PartyFormProps = {
  title: string;
  submitLabel: string;
  action: (state: PartyActionState, formData: FormData) => Promise<PartyActionState>;
  initialValues?: Partial<PartyFormValues>;
};

const defaultValues: PartyFormValues = {
  partyName: "",
  location: "",
  partyCode: "",
  phone: "",
  gstNumber: "",
  address: "",
  notes: ""
};

export function PartyForm({ title, submitLabel, action, initialValues }: PartyFormProps) {
  const [state, formAction] = useActionState(action, { ok: false });
  useActionToast(state.message);
  const {
    register,
    watch,
    formState: { errors }
  } = useForm<PartyFormValues>({
    resolver: zodResolver(partySchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues
    }
  });

  const partyName = watch("partyName");
  const location = watch("location");
  const manualCode = watch("partyCode");
  const generatedCode = location && partyName ? buildPartyCode(location, partyName) : "";

  const fieldError = (name: keyof PartyFormValues) =>
    errors[name]?.message || state.errors?.[name]?.[0];

  return (
    <form action={formAction} className="relative max-w-3xl rounded border border-slate-200 bg-white p-5 shadow-soft">
      <FormPendingOverlay />
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-950">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          Codes are generated from location and party name. Example: Hazaribagh + Rama Pharma = HARP.
        </p>
        {state.message ? (
          <p className="mt-2 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Location" error={fieldError("location")}>
          <select
            {...register("location")}
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
          >
            <option value="">Select location</option>
            {locationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Party name" error={fieldError("partyName")}>
          <input
            {...register("partyName")}
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
            placeholder="Rama Pharma"
          />
        </Field>

        <Field label="Party code" error={fieldError("partyCode")} className="sm:col-span-2">
          <input
            {...register("partyCode")}
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 font-mono text-sm uppercase"
            placeholder={generatedCode || "Auto-generated"}
          />
          <p className="mt-1 text-xs text-slate-500">
            {manualCode
              ? "Manual code will be saved in uppercase."
              : generatedCode
                ? `Auto code preview: ${generatedCode}`
                : "Leave blank to auto-generate after entering location and party name."}
          </p>
        </Field>

        <Field label="Phone" error={fieldError("phone")}>
          <input
            {...register("phone")}
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
            placeholder="Optional"
          />
        </Field>

        <Field label="GST number" error={fieldError("gstNumber")}>
          <input
            {...register("gstNumber")}
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm uppercase"
            placeholder="Optional"
          />
        </Field>

        <Field label="Address" error={fieldError("address")} className="sm:col-span-2">
          <textarea
            {...register("address")}
            rows={3}
            className="focus-ring w-full rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Optional address"
          />
        </Field>

        <Field label="Notes" error={fieldError("notes")} className="sm:col-span-2">
          <textarea
            {...register("notes")}
            rows={3}
            className="focus-ring w-full rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Optional party notes"
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/parties"
          className="rounded border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  className,
  children
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

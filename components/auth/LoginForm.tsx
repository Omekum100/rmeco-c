"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { FormPendingOverlay, SubmitButton } from "@/components/ui/FormStatus";
import { useActionToast } from "@/components/ui/Toast";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, { ok: false });
  useActionToast(state.message);

  return (
    <form action={formAction} className="relative w-full max-w-sm rounded border border-slate-200 bg-white p-6 shadow-soft">
      <FormPendingOverlay label="Checking login..." />
      <div>
        <h1 className="text-xl font-semibold text-slate-950">Login</h1>
        <p className="mt-1 text-sm text-slate-500">Enter your admin username and password.</p>
      </div>

      {state.message ? (
        <p className="mt-4 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.message}
        </p>
      ) : null}

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Username</span>
          <input
            name="username"
            type="text"
            autoComplete="username"
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
            placeholder="admin@RM"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            className="focus-ring h-10 w-full rounded border border-slate-300 px-3 text-sm"
            placeholder="Password"
            required
          />
        </label>
      </div>

      <SubmitButton
        label="Login"
        pendingLabel="Logging in..."
        className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </form>
  );
}

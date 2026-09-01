"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ToastTone = "success" | "error";

type ToastMessage = {
  id: number;
  tone: ToastTone;
  message: string;
};

const listeners = new Set<(toast: Omit<ToastMessage, "id">) => void>();

export function showToast(toast: Omit<ToastMessage, "id">) {
  listeners.forEach((listener) => listener(toast));
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    function addToast(toast: Omit<ToastMessage, "id">) {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { ...toast, id }].slice(-3));
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
      }, 4200);
    }

    listeners.add(addToast);
    return () => {
      listeners.delete(addToast);
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <ToastSearchParams />
      </Suspense>
      <div className="fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded border bg-white px-4 py-3 text-sm shadow-soft ${
              toast.tone === "success"
                ? "border-emerald-200 text-emerald-800"
                : "border-rose-200 text-rose-800"
            }`}
          >
            <p className="font-semibold">{toast.tone === "success" ? "Success" : "Failed"}</p>
            <p className="mt-1 text-slate-600">{toast.message}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function ToastSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toastKey = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    const tone = searchParams.get("toast");
    const message = searchParams.get("message");

    if ((tone === "success" || tone === "error") && message) {
      showToast({ tone, message });

      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("toast");
      nextParams.delete("message");
      const nextUrl = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname;
      router.replace(nextUrl, { scroll: false });
    }
  }, [pathname, router, searchParams, toastKey]);

  return null;
}

export function useActionToast(message?: string) {
  useEffect(() => {
    if (message) {
      showToast({ tone: "error", message });
    }
  }, [message]);
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { RotatingLogo } from "@/components/ui/RotatingLogo";

function isLocalNavigation(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  const link = target.closest("a");

  if (!link) {
    return false;
  }

  const href = link.getAttribute("href");

  return Boolean(href && href.startsWith("/") && !href.startsWith("//"));
}

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (isLocalNavigation(event.target)) {
        setIsNavigating(true);
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    setIsNavigating(false);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsNavigating(false);
    }, 8000);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname, searchParams]);

  if (!isNavigating) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[60]">
      <div className="h-1 overflow-hidden bg-brand-100">
        <div className="h-full w-1/2 animate-[nav-progress_1.1s_ease-in-out_infinite] bg-brand-600" />
      </div>
      <div className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-soft">
        <RotatingLogo label="Loading page" size="sm" />
        <span>Loading...</span>
      </div>
    </div>
  );
}

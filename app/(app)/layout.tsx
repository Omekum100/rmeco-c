import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded bg-brand-600 text-sm font-bold text-white">
              RM
            </span>
            <span>
              <span className="block text-base font-semibold text-slate-950">
                Medical Bill Records
              </span>
              <span className="block text-sm text-slate-500">Supplier purchase tracking</span>
            </span>
          </Link>
          <nav className="grid w-full grid-cols-3 gap-2 text-sm font-medium sm:w-auto sm:flex sm:flex-wrap sm:items-center">
            <Link
              href="/"
              className="rounded px-3 py-2 text-center text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            >
              Dashboard
            </Link>
            <Link
              href="/bills"
              className="rounded px-3 py-2 text-center text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            >
              Bills
            </Link>
            <Link
              href="/parties"
              className="rounded px-3 py-2 text-center text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            >
              Parties
            </Link>
            <Link
              href="/bills/new"
              className="rounded bg-brand-600 px-3 py-2 text-center text-white hover:bg-brand-700"
            >
              Add Bill
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </>
  );
}

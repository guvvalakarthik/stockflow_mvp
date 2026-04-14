import Link from "next/link";
import { logout } from "@/app/actions/session";

export function AppShell({
  orgName,
  children,
}: {
  orgName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-lg font-semibold tracking-tight text-slate-900"
            >
              StockFlow
            </Link>
            <nav className="flex gap-4 text-sm font-medium text-slate-600">
              <Link className="hover:text-slate-900" href="/dashboard">
                Dashboard
              </Link>
              <Link className="hover:text-slate-900" href="/products">
                Products
              </Link>
              <Link className="hover:text-slate-900" href="/settings">
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="max-w-[200px] truncate text-slate-500" title={orgName}>
              {orgName}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}

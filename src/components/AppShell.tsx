"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import CommandPalette from "@/components/CommandPalette";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalSearch from "@/components/GlobalSearch";

function isDatabaseConnectedPage(pathname: string): boolean {
  return pathname === "/" || ["/people", "/companies", "/pipeline", "/tasks", "/deals", "/settings", "/reports", "/audit", "/export", "/consent"].some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"));
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login") return <main className="min-h-screen">{children}</main>;
  const demonstration = !isDatabaseConnectedPage(pathname);
  return (
    <>
      <Sidebar />
      <CommandPalette />
      <div className="flex min-h-screen flex-col md:ml-60">
        <header className="sticky top-0 z-30 flex min-h-14 items-center gap-3 border-b border-slate-200 bg-white px-3 py-2 sm:px-4 md:px-6">
          <GlobalSearch />
          <MobileNavigation />
          <span className="hidden shrink-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 sm:inline-block">Private preview</span>
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-6">
          {demonstration && <div role="status" className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Preview-only screen — functionality here may be incomplete or explicitly unavailable. Do not rely on simulated data or integrations.
          </div>}
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </>
  );
}

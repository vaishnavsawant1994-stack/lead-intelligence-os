"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import CommandPalette from "@/components/CommandPalette";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalSearch from "@/components/GlobalSearch";
import ThemeToggle from "@/components/ThemeToggle";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login") return <main className="min-h-screen">{children}</main>;
  return (
    <>
      <Sidebar />
      <CommandPalette />
      <div className="min-h-screen md:ml-60 flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b bg-white px-4 md:px-6">
          <GlobalSearch />
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Breadcrumbs />
          {children}
        </main>
        <nav aria-label="Mobile navigation" className="border-t bg-white px-4 py-3 text-sm md:hidden">
          <a href="/" className="mr-4 text-indigo-700">Dashboard</a>
          <a href="/people" className="mr-4 text-indigo-700">People</a>
          <a href="/pipeline" className="text-indigo-700">Pipeline</a>
        </nav>
      </div>
    </>
  );
}

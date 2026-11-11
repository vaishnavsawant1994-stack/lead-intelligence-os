import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import CommandPalette from "@/components/CommandPalette";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalSearch from "@/components/GlobalSearch";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Lead Intelligence OS",
  description: "Professional multi-tenant lead intelligence and client management platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Sidebar />
        <CommandPalette />
        <div className="ml-60 min-h-screen flex flex-col">
          <header className="h-14 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-10">
            <GlobalSearch />
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500">🔔</button>
              <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-medium">VS</div>
            </div>
          </header>
          <main className="flex-1 p-6">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

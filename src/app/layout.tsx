import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import CommandPalette from "@/components/CommandPalette";
import Breadcrumbs from "@/components/Breadcrumbs";
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
        <div className="ml-64 min-h-screen flex flex-col">
          <header className="bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between sticky top-0 z-10">
            <div className="text-sm text-slate-500">The Perspective · Lead Intelligence OS</div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button className="text-slate-400 hover:text-slate-600 text-lg">🔔</button>
              <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-medium">VS</div>
            </div>
          </header>
          <main className="flex-1 p-8">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const items = [
  { href: "/", label: "Dashboard" },
  { href: "/people", label: "People" },
  { href: "/companies", label: "Companies" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/tasks", label: "Tasks" },
  { href: "/deals", label: "Deals" },
  { href: "/email-finder", label: "Email Finder" },
  { href: "/analytics", label: "Analytics" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside aria-label="Main navigation" className="hidden md:flex fixed inset-y-0 left-0 z-30 w-60 flex-col bg-slate-950 p-4 text-white">
      <Link href="/" className="mb-8 px-3 pt-3 text-lg font-semibold tracking-tight">Leadveyra <span className="block text-xs font-normal text-slate-400">Lead Intelligence OS</span></Link>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");
          return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`sidebar-item ${active ? "active" : ""}`}>{item.label}</Link>;
        })}
      </nav>
      <button type="button" onClick={signOut} disabled={busy} className="mt-4 rounded-lg border border-slate-700 px-3 py-2 text-left text-sm hover:bg-slate-800 disabled:opacity-50">{busy ? "Signing out…" : "Sign out"}</button>
    </aside>
  );
}

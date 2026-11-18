"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { isActiveNav, navigationItems } from "@/lib/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signOut() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Unable to sign out");
      router.replace("/login");
      router.refresh();
    } catch {
      setError("Sign-out failed. Try again.");
      setBusy(false);
    }
  }

  return (
    <aside aria-label="Main navigation" className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-slate-950 p-4 text-white md:flex">
      <Link href="/" className="mb-6 px-3 pt-3 text-lg font-semibold tracking-tight">Leadveyra <span className="block text-xs font-normal text-slate-400">Lead Intelligence OS</span></Link>
      <nav className="flex-1 space-y-4 overflow-y-auto">
        {["Workspace", "Utilities"].map((group) => <div key={group}>
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{group}</p>
          <div className="space-y-1">{navigationItems.filter((item) => item.group === group).map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActiveNav(pathname, item.href) ? "page" : undefined}
              className={`sidebar-item ${isActiveNav(pathname, item.href) ? "active" : ""}`}>{item.label}</Link>
          ))}</div>
        </div>)}
      </nav>
      {error && <p role="alert" className="p-2 text-xs text-red-200">{error}</p>}
      <button type="button" onClick={signOut} disabled={busy} className="mt-4 rounded-lg border border-slate-700 px-3 py-2 text-left text-sm hover:bg-slate-800 disabled:opacity-50">{busy ? "Signing out…" : "Sign out"}</button>
    </aside>
  );
}

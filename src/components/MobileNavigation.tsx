"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isActiveNav, navigationItems } from "@/lib/navigation";

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", escape); };
  }, [open]);
  async function signOut() {
    setBusy(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Unable to sign out");
      router.replace("/login"); router.refresh();
    } catch {
      setBusy(false);
    }
  }
  return <div className="relative md:hidden" ref={ref}>
    <button type="button" aria-haspopup="true" aria-expanded={open} aria-controls="mobile-workspace-navigation"
      onClick={() => setOpen((value) => !value)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900" >
      <span aria-hidden="true">☰</span> Menu
    </button>
    {open && <nav id="mobile-workspace-navigation" aria-label="Mobile workspace navigation"
      className="absolute right-0 top-full z-50 mt-2 w-[min(85vw,19rem)] max-h-[70vh] overflow-auto rounded-xl border border-slate-200 bg-white p-2 shadow-2xl">
      {["Workspace", "Utilities"].map((group) => <div key={group} className="mb-2">
        <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{group}</p>
        {navigationItems.filter((item) => item.group === group).map((item) => (
          <Link key={item.href} href={item.href} aria-current={isActiveNav(pathname,item.href) ? "page" : undefined}
            onClick={() => setOpen(false)}
            className={`block rounded-lg px-3 py-2 text-sm ${isActiveNav(pathname,item.href) ? "bg-indigo-50 font-semibold text-indigo-800" : "text-slate-700 hover:bg-slate-50"}`}>
            {item.label}
          </Link>
        ))}
      </div>)}
      <button disabled={busy} type="button" onClick={signOut} className="w-full border-t border-slate-200 px-3 py-3 text-left text-sm text-red-700 disabled:opacity-50">{busy ? "Signing out…" : "Sign out"}</button>
    </nav>}
  </div>;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { navigationItems } from "@/lib/navigation";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setOpen((current) => !current);
      } else if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQuery("");
  }, [open]);

  if (!open) return null;
  const matches = navigationItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  function go(href: string) { setOpen(false); router.push(href); }
  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/50 px-4 pt-[15vh]" onClick={() => setOpen(false)}>
      <div role="dialog" aria-modal="true" aria-label="Quick navigation" className="h-fit w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <input ref={inputRef} aria-label="Search pages" value={query} onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter" && matches[0]) go(matches[0].href); }}
          className="w-full border-b p-4 outline-none" placeholder="Jump to a page… (Esc to close)" />
        <div className="max-h-72 overflow-y-auto p-2">
          {matches.length ? matches.map((item) => <button type="button" key={item.href} onClick={() => go(item.href)}
            className="block w-full rounded-lg p-3 text-left text-sm text-slate-800 hover:bg-slate-100">{item.label}</button>) : <p className="p-4 text-sm text-slate-500">No matching page</p>}
        </div>
        <button type="button" className="w-full border-t p-2 text-xs text-slate-600 hover:bg-slate-50" onClick={() => setOpen(false)}>Close</button>
      </div>
    </div>
  );
}

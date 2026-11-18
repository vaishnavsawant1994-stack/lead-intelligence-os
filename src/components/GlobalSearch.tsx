"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { navigationItems } from "@/lib/navigation";

type LookupResult = { kind: "person" | "company"; id: string; title: string; description: string; href: string };
type Match = { title: string; description: string; href: string; key: string };

export default function GlobalSearch() {
  const router = useRouter();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LookupResult[]>([]);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState(0);
  const term = query.trim();

  useEffect(() => {
    if (term.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setPending(true);
      setError("");
      try {
        const response = await fetch(`/api/lookup?q=${encodeURIComponent(term)}`, {
          cache: "no-store", credentials: "same-origin", signal: controller.signal,
        });
        const data: { results?: LookupResult[]; error?: string } = await response.json();
        if (!response.ok) throw new Error(data.error || "Search unavailable");
        if (!controller.signal.aborted) setResults(Array.isArray(data.results) ? data.results : []);
      } catch (cause) {
        if (!controller.signal.aborted) {
          setResults([]);
          setError(cause instanceof Error ? cause.message : "Search unavailable");
        }
      } finally {
        if (!controller.signal.aborted) setPending(false);
      }
    }, 180);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [term]);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);

  const pageMatches: Match[] = term.length > 0 ? navigationItems
    .filter((item) => item.label.toLowerCase().includes(term.toLowerCase()))
    .map((item) => ({ title: item.label, description: item.group + " page", href: item.href, key: "page:" + item.href })) : [];
  const crmMatches: Match[] = term.length >= 2 ? results.map((item) => ({
    title: item.title, description: item.kind === "person" ? `Person · ${item.description}` : `Company · ${item.description}`,
    href: item.href, key: item.kind + ":" + item.id,
  })) : [];
  const matches = [...pageMatches, ...crmMatches];
  const visible = open && term.length > 0;
  const chosen = matches[active];

  const go = (href: string) => {
    setQuery(""); setResults([]); setActive(0); setOpen(false);
    router.push(href);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <label htmlFor={listId + "-input"} className="sr-only">Search workspace pages and records</label>
      <input id={listId + "-input"} type="search" role="combobox" aria-autocomplete="list"
        aria-expanded={visible} aria-controls={listId} aria-activedescendant={visible && chosen ? listId + "-option-" + active : undefined}
        autoComplete="off" value={query} placeholder="Search pages, people, companies…"
        onFocus={() => setOpen(true)}
        onChange={(event) => { setQuery(event.target.value); setResults([]); setActive(0); setError(""); setOpen(true); }}
        onKeyDown={(event) => {
          if (event.key === "Escape") { setOpen(false); return; }
          if (event.key === "ArrowDown" && matches.length) { event.preventDefault(); setActive((i) => (i + 1) % matches.length); }
          if (event.key === "ArrowUp" && matches.length) { event.preventDefault(); setActive((i) => (i + matches.length - 1) % matches.length); }
          if (event.key === "Enter" && visible && chosen) { event.preventDefault(); go(chosen.href); }
        }}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
      {visible && (
        <div id={listId} role="listbox" aria-label="Search results" className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-xl">
          {matches.map((item, index) => (
            <button key={item.key} id={listId + "-option-" + index} role="option" aria-selected={index === active} type="button"
              onMouseEnter={() => setActive(index)} onClick={() => go(item.href)}
              className={`flex w-full flex-col rounded-md px-3 py-2 text-left text-sm focus:outline-none ${index === active ? "bg-indigo-50 text-indigo-900" : "text-slate-800 hover:bg-slate-50"}`}>
              <span className="font-medium">{item.title}</span><span className="text-xs text-slate-500">{item.description}</span>
            </button>
          ))}
          {pending && term.length >= 2 && <p role="status" className="px-3 py-2 text-xs text-slate-500">Searching workspace…</p>}
          {error && <p role="alert" className="px-3 py-2 text-xs text-red-700">{error}</p>}
          {!matches.length && !pending && !error && <p className="px-3 py-2 text-sm text-slate-500">{term.length < 2 ? "Type at least two letters to search records." : "No matching pages or records."}</p>}
        </div>
      )}
    </div>
  );
}

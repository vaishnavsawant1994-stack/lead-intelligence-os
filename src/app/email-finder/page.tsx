"use client";

import { useState } from "react";

type Candidate = { email: string; verified: false };
export default function EmailFinderApp() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<Candidate[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setResults([]); setError("");
    try {
      const response = await fetch("/api/email-finder", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: first, lastName: last, domain }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Suggestions unavailable");
      setResults(result.results || []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Suggestions unavailable");
    } finally { setLoading(false); }
  };
  return <section className="mx-auto max-w-2xl space-y-5">
    <header><h1 className="page-title">Unverified email patterns</h1><p className="page-subtitle mt-1">Generate possible address formats for a domain you already know. This does not search for or verify any real mailbox.</p></header>
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">The former confidence scores were not supported by verification evidence. All suggestions below are unverified and must not be treated as valid contact addresses.</div>
    <form onSubmit={submit} className="card space-y-4 p-5">
      <label className="block text-sm font-medium">First name *<input required maxLength={60} value={first} onChange={(e) => setFirst(e.target.value)} className="input mt-1" /></label>
      <label className="block text-sm font-medium">Last name<input maxLength={60} value={last} onChange={(e) => setLast(e.target.value)} className="input mt-1" /></label>
      <label className="block text-sm font-medium">Known email domain *<input required maxLength={253} placeholder="example.com" value={domain} onChange={(e) => setDomain(e.target.value)} className="input mt-1" /></label>
      <button disabled={loading} className="btn-primary disabled:opacity-50" type="submit">{loading ? "Generating…" : "Generate unverified patterns"}</button>
    </form>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {results.length > 0 && <div className="card p-5"><h2 className="font-semibold">Possible formats — not verified</h2><ul className="mt-3 divide-y text-sm">{results.map((r) => <li key={r.email} className="py-3"><code className="break-all">{r.email}</code><span className="ml-2 text-amber-700">Unverified</span></li>)}</ul></div>}
  </section>;
}

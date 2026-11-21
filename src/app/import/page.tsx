"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import PreviewNotice from "@/components/PreviewNotice";

type Issue = { row: number; code: string; message: string };
type Result = {
  mode: "validation-only"; persisted: false;
  summary: { total: number; valid: number; invalid: number; issues: number };
  issues: Issue[]; warning: string;
};
const sample = "name,email,title,company\nExample Contact,example.contact@example.test,Analyst,Example Corp\nSecond Example,second.example@example.test,Manager,Example Corp\n";
const limitBytes = 50 * 1024;

export default function ImportPage() {
  const [csv, setCsv] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setResult(null); setError("");
    if (file.size > limitBytes) {
      setError("File must be no larger than 50 KB");
      event.target.value = "";
      return;
    }
    try { setCsv(await file.text()); }
    catch { setError("Unable to read the selected CSV file"); }
    event.target.value = "";
  }

  async function validate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/import/validate", {
        method: "POST", credentials: "same-origin", cache: "no-store",
        headers: { "Content-Type": "text/csv" }, body: csv,
      });
      const data: Result & { error?: string } = await response.json();
      if (!response.ok) throw new Error(data.error || "CSV validation failed");
      setResult(data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "CSV validation unavailable"); }
    finally { setBusy(false); }
  }

  return <section className="max-w-4xl space-y-5">
    <header><h1 className="page-title">CSV import validation</h1>
      <p className="page-subtitle mt-1">Check a small synthetic contact CSV without storing or importing it</p></header>
    <PreviewNotice />
    <div role="note" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      This is <strong>validation only</strong>. No contacts are imported, saved, emailed or sent to third-party providers.
      Do not upload real customer data before production identity, consent and privacy controls are certified.
      Maximum file size 50 KB; maximum 100 data rows.
    </div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <form onSubmit={validate} className="card space-y-4 p-5">
      <label className="block text-sm font-medium">Choose CSV file (optional)
        <input type="file" accept=".csv,text/csv" onChange={chooseFile} className="mt-2 block w-full text-sm" /></label>
      <label className="block text-sm font-medium">CSV content *
        <textarea required rows={9} className="input mt-2 font-mono text-xs" value={csv}
          placeholder="name,email,title,company" onChange={(e) => { setCsv(e.target.value); setResult(null); }}
          aria-describedby="csv-columns"/></label>
      <p id="csv-columns" className="text-xs text-slate-500">Required header: name. Optional headers: email, title, company. Names and emails are checked for validity, repeated addresses and workspace duplicates.</p>
      <div className="flex flex-wrap gap-3">
        <button disabled={busy || !csv.trim()} type="submit" className="btn-primary disabled:opacity-50">
          {busy ? "Validating…" : "Validate CSV"}</button>
        <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
          onClick={() => { setCsv(sample); setResult(null); setError(""); }}>Load synthetic sample</button>
      </div>
    </form>
    {result && <section className="card space-y-4 p-5" aria-label="CSV validation results">
      <h2 className="text-lg font-semibold">Validation results — no records imported</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <p className="rounded-lg bg-slate-50 p-3 text-sm">Rows checked: <strong>{result.summary.total}</strong></p>
        <p className="rounded-lg bg-emerald-50 p-3 text-sm">Valid rows: <strong>{result.summary.valid}</strong></p>
        <p className="rounded-lg bg-amber-50 p-3 text-sm">Invalid rows: <strong>{result.summary.invalid}</strong></p>
      </div>
      {result.issues.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm">
        <thead><tr><th className="p-2">CSV row</th><th className="p-2">Issue</th><th className="p-2">Explanation</th></tr></thead>
        <tbody>{result.issues.map((issue, i) => <tr className="border-t" key={issue.row + ":" + issue.code + ":" + i}>
          <td className="p-2">{issue.row}</td><td className="p-2">{issue.code}</td><td className="p-2">{issue.message}</td>
        </tr>)}</tbody>
      </table></div> : <p className="text-sm text-slate-600">No validation issues found in this file.</p>}
      <p className="text-sm text-amber-800">{result.warning}</p>
    </section>}
    <p className="text-sm text-slate-600">Individual synthetic CRM records can be managed in <Link className="text-indigo-700 underline" href="/people">People</Link>. Export is available under <Link className="text-indigo-700 underline" href="/export">CSV export</Link>. Bulk CSV import remains disabled.</p>
  </section>;
}

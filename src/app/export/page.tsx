import Link from "next/link";
import PreviewNotice from "@/components/PreviewNotice";

const exports = [
  { entity: "people", label: "People", description: "Names, contact details, companies and statuses" },
  { entity: "companies", label: "Companies", description: "Company names, industries and websites" },
  { entity: "tasks", label: "Tasks", description: "Task titles, completion and due dates" },
  { entity: "deals", label: "Deals", description: "Deal names, values and stages" },
];

export default function ExportPage() {
  return <section className="space-y-5">
    <header><h1 className="page-title">Export workspace data</h1><p className="page-subtitle mt-1">Download real records from the private-preview PostgreSQL workspace.</p></header>
    <PreviewNotice />
    <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
      CSV exports are limited to 5,000 records per file. Larger exports fail without silently truncating data.
      Downloads may contain personal information. Store them securely and follow applicable privacy requirements.
    </p>
    <div className="grid gap-4 md:grid-cols-2">
      {exports.map((item) => <div className="card flex flex-col gap-4 p-5" key={item.entity}>
        <div><h2 className="font-semibold">{item.label}</h2><p className="mt-1 text-sm text-slate-500">{item.description}</p></div>
        <a href={`/api/export?entity=${item.entity}`} className="btn-primary self-start" download>Download CSV</a>
      </div>)}
    </div>
    <p className="text-sm text-slate-500">Imports are not enabled in the private preview until deduplication, consent, and safe bulk validation are implemented. <Link className="text-indigo-700 underline" href="/import">Import status</Link></p>
  </section>;
}

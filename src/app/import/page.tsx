import PreviewNotice from "@/components/PreviewNotice";
import Link from "next/link";

export default function ImportPage() {
  return <section className="max-w-2xl space-y-5">
    <header><h1 className="page-title">Data import</h1><p className="page-subtitle mt-1">Current availability and safer alternatives</p></header>
    <PreviewNotice />
    <div className="card space-y-4 p-6">
      <h2 className="text-lg font-semibold">Bulk import is not enabled</h2>
      <p className="text-sm text-slate-600">
        Earlier upload and Google Sheets buttons were placeholders. They have been removed because no verified import, deduplication,
        consent or error-recovery workflow was attached to them.
      </p>
      <p className="text-sm text-slate-600">For synthetic private-preview records, use the individual People and Companies forms. Do not upload real customer contact lists yet.</p>
      <div className="flex flex-wrap gap-3"><Link href="/people" className="btn-primary">Manage people</Link><Link href="/export" className="rounded-lg border border-slate-200 px-4 py-2 text-sm">Export workspace CSV</Link></div>
    </div>
  </section>;
}

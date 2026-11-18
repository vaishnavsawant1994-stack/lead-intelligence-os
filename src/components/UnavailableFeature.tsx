type Props = { title: string; description: string; requires?: string };
export default function UnavailableFeature({ title, description, requires }: Props) {
  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <header><h1 className="page-title">{title}</h1><p className="page-subtitle mt-1">Leadveyra private administrator preview</p></header>
      <div role="status" className="card space-y-4 p-6">
        <span className="badge badge-warning">Not configured — no live operation</span>
        <h2 className="text-lg font-semibold">This feature is not available yet</h2>
        <p className="text-sm leading-6 text-slate-700">{description}</p>
        {requires && <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600"><strong>Before activation:</strong> {requires}</p>}
        <p className="text-xs text-slate-500">No external service was connected, no message was sent, no setting was enabled and no records were modified by this screen.</p>
      </div>
    </section>
  );
}

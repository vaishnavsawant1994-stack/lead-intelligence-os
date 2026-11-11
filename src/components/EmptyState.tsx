export function EmptyState({ icon = "📭", title = "No data yet", description = "Get started by adding your first item.", action }: { icon?: string; title?: string; description?: string; action?: { label: string; href?: string } }) {
  return (
    <div className="card p-12 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6">{description}</p>
      {action?.href && <a href={action.href} className="btn btn-primary">{action.label}</a>}
    </div>
  );
}
export function EmptyPeople() {
  return <EmptyState icon="👥" title="No people yet" description="Import your contacts to get started." action={{ label: "Import Data", href: "/import" }} />;
}

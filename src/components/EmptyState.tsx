export function EmptyState({ icon = "📭", title = "No data yet", description = "Get started by adding your first item.", action }: { icon?: string; title?: string; description?: string; action?: { label: string; href?: string; onClick?: () => void } }) {
  return (
    <div className="card p-12 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">{description}</p>
      {action && (action.href ? <a href={action.href} className="btn btn-primary">{action.label}</a> : <button onClick={action.onClick} className="btn btn-primary">{action.label}</button>)}
    </div>
  );
}

export function EmptyPeople() {
  return <EmptyState icon="👥" title="No people yet" description="Import your contacts or add them manually to get started." action={{ label: "Import Data", href: "/import" }} />;
}

export function EmptyPipeline() {
  return <EmptyState icon="📋" title="Pipeline is empty" description="Add people to your pipeline to track their progress." action={{ label: "Add to Pipeline", href: "/people" }} />;
}

export function EmptyTasks() {
  return <EmptyState icon="✅" title="No tasks" description="Create tasks to stay on top of follow-ups." action={{ label: "Add Task", href: "/tasks" }} />;
}

export function EmptySearch() {
  return <EmptyState icon="🔍" title="No results found" description="Try adjusting your search or filters." />;
}

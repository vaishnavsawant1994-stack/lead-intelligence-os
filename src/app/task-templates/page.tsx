"use client";
export default function TaskTemplatesPage() {
  const templates = [{ name: "Follow-up sequence", tasks: ["Day 1: Send intro", "Day 3: Follow up", "Day 7: Final touch"] }];
  return <div><h1 className="page-title mb-4">Task Templates</h1><div className="space-y-4">{templates.map(t => <div key={t.name} className="card p-5"><h3 className="font-medium mb-3">{t.name}</h3><ul className="text-sm">{t.tasks.map(task => <li key={task}>• {task}</li>)}</ul></div>)}</div></div>;
}

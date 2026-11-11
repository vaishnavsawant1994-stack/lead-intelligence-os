"use client";
export default function TodayPage() {
  const tasks = [{ task: "Follow up with Arjun", priority: "High" }];
  return (<div><h1 className="page-title mb-4">Today's Tasks</h1><div className="space-y-3">{tasks.map(t => <div key={t.task} className="card p-4 flex gap-4"><input type="checkbox" /><span>{t.task}</span><span className="badge badge-danger ml-auto">{t.priority}</span></div>)}</div></div>);
}

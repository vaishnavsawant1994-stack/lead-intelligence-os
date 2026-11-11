"use client";
export default function RemindersPage() {
  const reminders = [{ task: "Follow up with Arjun", due: "Today", done: false }, { task: "Send proposal", due: "Tomorrow", done: false }];
  return <div><h1 className="page-title mb-4">Reminders</h1><div className="card divide-y">{reminders.map((r, i) => <div key={i} className="px-5 py-4 flex items-center gap-4"><input type="checkbox" /><span>{r.task}</span><span className="badge badge-neutral ml-auto">{r.due}</span></div>)}</div></div>;
}

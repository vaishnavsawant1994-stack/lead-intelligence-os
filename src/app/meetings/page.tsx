"use client";
export default function MeetingsPage() {
  const meetings = [{ title: "Demo with Arjun", time: "Today, 2:00 PM", type: "Demo" }, { title: "Follow-up with Sophia", time: "Tomorrow, 10:00 AM", type: "Call" }];
  return <div><h1 className="page-title mb-4">Meetings</h1><div className="space-y-3">{meetings.map(m => <div key={m.title} className="card p-4 flex justify-between"><div><div className="font-medium text-sm">{m.title}</div><div className="text-xs text-slate-500">{m.time}</div></div><span className="badge badge-neutral">{m.type}</span></div>)}</div></div>;
}

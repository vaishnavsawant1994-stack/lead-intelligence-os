"use client";
export default function CalendarPage() {
  const events = [{ title: "Call with Arjun", time: "Today, 2:00 PM" }];
  return (<div><h1 className="page-title mb-4">Calendar</h1><div className="card divide-y">{events.map(e => <div key={e.title} className="px-5 py-4"><div className="font-medium text-sm">{e.title}</div><div className="text-xs text-slate-500">{e.time}</div></div>)}</div></div>);
}

"use client";
export default function SchedulerPage() {
  const slots = [{ day: "Mon", times: ["9:00", "10:00", "14:00"] }, { day: "Tue", times: ["11:00", "15:00"] }];
  return <div><h1 className="page-title mb-4">Meeting Scheduler</h1><div className="grid md:grid-cols-3 gap-4">{slots.map(s => <div key={s.day} className="card p-4"><div className="font-medium mb-3">{s.day}</div>{s.times.map(t => <button key={t} className="w-full py-2 text-sm border rounded-lg mb-2 hover:bg-indigo-50">{t}</button>)}</div>)}</div></div>;
}

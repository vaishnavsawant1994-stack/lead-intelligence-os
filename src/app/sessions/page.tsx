"use client";
export default function SessionsPage() {
  const sessions = [{ device: "Chrome on Mac", location: "Mumbai", current: true }, { device: "Safari on iPhone", location: "Mumbai", current: false }];
  return <div><h1 className="page-title mb-4">Sessions</h1><div className="card divide-y">{sessions.map(s => <div key={s.device} className="px-5 py-4 flex justify-between"><div><div className="font-medium text-sm">{s.device}</div><div className="text-xs text-slate-500">{s.location}</div></div>{s.current ? <span className="badge badge-success">Current</span> : <button className="text-sm text-red-600">End</button>}</div>)}</div></div>;
}

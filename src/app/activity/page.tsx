"use client";
export default function ActivityPage() {
  const activity = [{ user: "You", action: "sent email to", target: "Arjun Mehta", time: "2h ago" }];
  return <div><h1 className="page-title mb-4">Activity</h1><div className="card divide-y">{activity.map((a, i) => <div key={i} className="px-5 py-4 text-sm"><span className="font-medium">{a.user}</span> {a.action} <span className="text-indigo-600">{a.target}</span></div>)}</div></div>;
}

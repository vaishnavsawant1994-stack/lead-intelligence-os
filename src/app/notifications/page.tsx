"use client";
export default function NotificationsPage() {
  const notifications = [{ title: "New lead assigned", time: "5 min ago", read: false }, { title: "Email opened", time: "1 hour ago", read: true }];
  return <div><h1 className="page-title mb-4">Notifications</h1><div className="card divide-y">{notifications.map((n, i) => <div key={i} className={`px-5 py-4 ${!n.read ? "bg-indigo-50" : ""}`}><div className="font-medium text-sm">{n.title}</div><div className="text-xs text-slate-500">{n.time}</div></div>)}</div></div>;
}

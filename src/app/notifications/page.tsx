"use client";
import { useState } from "react";
export default function NotificationsPage() {
  const [items] = useState([{ id: "1", message: "Follow up with Arjun is due", time: "2h ago", read: false }]);
  return (<div><h1 className="page-title mb-4">Notifications</h1><div className="card divide-y">{items.map(n => <div key={n.id} className="px-5 py-4"><div className="text-sm">{n.message}</div><div className="text-xs text-slate-400">{n.time}</div></div>)}</div></div>);
}

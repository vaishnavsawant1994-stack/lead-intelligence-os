"use client";
export default function SmartRemindersPage() {
  const reminders = [{ person: "Arjun Mehta", suggestion: "Follow up - opened email 2 days ago", priority: "High" }];
  return (<div><h1 className="page-title mb-4">Smart Reminders</h1><div className="space-y-4">{reminders.map(r => <div key={r.person} className="card p-5"><div className="font-medium">{r.person}</div><div className="text-sm text-slate-500">{r.suggestion}</div></div>)}</div></div>);
}

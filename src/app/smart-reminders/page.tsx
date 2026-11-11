"use client";
export default function SmartRemindersPage() {
  const reminders = [{ person: "Arjun Mehta", suggestion: "Follow up on proposal", reason: "No response in 5 days" }];
  return <div><h1 className="page-title mb-4">Smart Reminders</h1><div className="space-y-4">{reminders.map(r => <div key={r.person} className="card p-5"><div className="font-medium text-indigo-600">{r.person}</div><div className="font-medium">{r.suggestion}</div><div className="text-sm text-slate-500">{r.reason}</div></div>)}</div></div>;
}

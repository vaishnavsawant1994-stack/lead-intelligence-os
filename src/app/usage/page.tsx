"use client";
export default function UsagePage() {
  const usage = [{ name: "Contacts", used: 9746, limit: 10000 }, { name: "Emails sent", used: 1250, limit: 5000 }];
  return <div><h1 className="page-title mb-4">Usage & Limits</h1><div className="space-y-4">{usage.map(u => <div key={u.name} className="card p-5"><div className="flex justify-between mb-2"><span className="font-medium">{u.name}</span><span>{u.used.toLocaleString()} / {u.limit.toLocaleString()}</span></div><div className="h-2 bg-slate-100 rounded-full"><div className="h-full bg-indigo-600 rounded-full" style={{width: `${u.used/u.limit*100}%`}} /></div></div>)}</div></div>;
}

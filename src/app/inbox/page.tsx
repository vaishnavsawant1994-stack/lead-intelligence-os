"use client";
export default function InboxPage() {
  const emails = [{ from: "Arjun Mehta", subject: "Re: Partnership", time: "2h ago" }];
  return (<div><h1 className="page-title mb-4">Shared Inbox</h1><div className="card divide-y">{emails.map(e => <div key={e.from} className="px-5 py-4"><div className="font-medium text-sm">{e.from}</div><div className="text-sm">{e.subject}</div></div>)}</div></div>);
}

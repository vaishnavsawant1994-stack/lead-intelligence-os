"use client";
export default function MeetingNotesPage() {
  const notes = [{ person: "Arjun Mehta", date: "Nov 10", summary: "Discussed partnership terms." }];
  return <div><h1 className="page-title mb-4">Meeting Notes</h1><div className="space-y-4">{notes.map(n => <div key={n.person} className="card p-5"><div className="flex justify-between mb-2"><span className="font-medium">{n.person}</span><span className="text-sm text-slate-500">{n.date}</span></div><p className="text-sm text-slate-600">{n.summary}</p></div>)}</div></div>;
}

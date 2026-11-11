"use client";
export default function SentimentPage() {
  const replies = [{ person: "Arjun Mehta", text: "Sounds great!", sentiment: "Positive" }, { person: "Sophia Reynolds", text: "Not interested.", sentiment: "Negative" }];
  return <div><h1 className="page-title mb-4">Sentiment Analysis</h1><div className="space-y-4">{replies.map(r => <div key={r.person} className="card p-5"><div className="flex justify-between mb-2"><span className="font-medium">{r.person}</span><span className={`badge ${r.sentiment === "Positive" ? "badge-success" : "badge-danger"}`}>{r.sentiment}</span></div><div className="text-sm text-slate-600">"{r.text}"</div></div>)}</div></div>;
}

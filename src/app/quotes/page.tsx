"use client";
export default function QuotesPage() {
  const quotes = [{ id: "Q-001", client: "TechNova", amount: 25000, status: "Sent" }, { id: "Q-002", client: "Horizon", amount: 15000, status: "Draft" }];
  return <div><h1 className="page-title mb-4">Quotes</h1><div className="card"><table className="table"><thead><tr><th>ID</th><th>Client</th><th>Amount</th><th>Status</th></tr></thead><tbody>{quotes.map(q => <tr key={q.id}><td>{q.id}</td><td>{q.client}</td><td>${q.amount.toLocaleString()}</td><td><span className={`badge ${q.status === "Sent" ? "badge-success" : "badge-neutral"}`}>{q.status}</span></td></tr>)}</tbody></table></div></div>;
}

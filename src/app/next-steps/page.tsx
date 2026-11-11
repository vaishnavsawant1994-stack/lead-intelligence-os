"use client";
export default function NextStepsPage() {
  const steps = [{ deal: "TechNova", next: "Send proposal", due: "Tomorrow", owner: "You" }];
  return <div><h1 className="page-title mb-4">Next Steps</h1><div className="card"><table className="table"><thead><tr><th>Deal</th><th>Next Step</th><th>Due</th><th>Owner</th></tr></thead><tbody>{steps.map(s => <tr key={s.deal}><td>{s.deal}</td><td>{s.next}</td><td>{s.due}</td><td className="text-indigo-600">{s.owner}</td></tr>)}</tbody></table></div></div>;
}

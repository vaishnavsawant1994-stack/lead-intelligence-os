"use client";
import { useState, useEffect } from "react";
export default function BouncePage() {
  const [bounces, setBounces] = useState<any[]>([]);
  useEffect(() => { fetch("/api/webhooks/bounce").then(r => r.json()).then(d => setBounces(d.log || [])); }, []);
  return (<div><h1 className="page-title mb-4">Bounce Checker</h1><div className="card"><table className="table"><thead><tr><th>Email</th><th>Reason</th></tr></thead><tbody>{bounces.map((b, i) => <tr key={i}><td>{b.email}</td><td>{b.reason}</td></tr>)}</tbody></table>{bounces.length === 0 && <div className="p-6 text-center text-slate-400">No bounces</div>}</div></div>);
}

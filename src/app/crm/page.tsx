"use client";
import { useState } from "react";
const CRMS = [{ id: "hubspot", name: "HubSpot" }, { id: "salesforce", name: "Salesforce" }, { id: "internal", name: "Lead Intelligence OS", connected: true }];
export default function CRMPage() {
  const [crms, setCrms] = useState(CRMS.map(c => ({ ...c, connected: c.id === "internal" })));
  const connect = (id: string) => setCrms(crms.map(c => c.id === id ? { ...c, connected: true } : c));
  return (<div className="max-w-2xl"><h1 className="text-2xl font-bold mb-6">CRM Integration</h1><div className="space-y-4">{crms.map(c => <div key={c.id} className="bg-white border rounded-xl p-5 flex justify-between items-center"><div className="font-medium">{c.name}</div>{c.connected ? <span className="text-emerald-600 text-sm">Connected</span> : <button onClick={() => connect(c.id)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Connect</button>}</div>)}</div></div>);
}

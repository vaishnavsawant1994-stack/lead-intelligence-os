"use client";
import { useState } from "react";
export default function AgentSettingsPage() {
  const [name, setName] = useState("Lead Intelligence Assistant");
  const [record, setRecord] = useState(true);
  return (<div className="max-w-2xl"><h1 className="text-2xl font-bold mb-6">AI Agent Settings</h1><div className="bg-white border rounded-xl p-6 space-y-4"><div><label className="text-sm font-medium">Agent Name</label><input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div><label className="flex items-center gap-2"><input type="checkbox" checked={record} onChange={e => setRecord(e.target.checked)} /><span className="text-sm">Record all calls</span></label><button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Save</button></div></div>);
}

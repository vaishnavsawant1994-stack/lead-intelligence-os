"use client";
import { useState } from "react";
export default function QuickAddPage() {
  const [name, setName] = useState("");
  return (<div className="max-w-md"><h1 className="page-title mb-4">Quick Add</h1><div className="card p-6 space-y-4"><input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="input" /><input placeholder="Email" className="input" /><input placeholder="Company" className="input" /><button className="btn btn-primary w-full">Add Person</button></div></div>);
}

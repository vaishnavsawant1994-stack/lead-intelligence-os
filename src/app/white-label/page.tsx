"use client";
import { useState } from "react";
export default function WhiteLabelPage() {
  const [name, setName] = useState("Lead Intelligence OS");
  const [color, setColor] = useState("#4f46e5");
  return (<div className="max-w-2xl"><h1 className="page-title mb-4">White Label</h1><div className="card p-6 space-y-4"><input value={name} onChange={e => setName(e.target.value)} className="input" /><input type="color" value={color} onChange={e => setColor(e.target.value)} /><button className="btn btn-primary">Save</button></div></div>);
}

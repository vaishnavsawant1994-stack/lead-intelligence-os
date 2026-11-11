"use client";
import { useState } from "react";
export default function SMSPage() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  return <div className="max-w-2xl"><h1 className="page-title mb-4">SMS</h1><div className="card p-6 space-y-4"><input value={to} onChange={e => setTo(e.target.value)} placeholder="+91 98765 43210" className="input" /><textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" rows={4} className="input" /><div className="text-xs text-slate-400">{message.length}/160</div><button className="btn btn-primary w-full">Send SMS</button></div></div>;
}

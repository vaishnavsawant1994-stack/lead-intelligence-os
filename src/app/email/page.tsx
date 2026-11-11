"use client";
import { useState } from "react";
export default function EmailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  return <div className="max-w-2xl"><h1 className="page-title mb-4">Email</h1><div className="card p-6 space-y-4"><input value={to} onChange={e => setTo(e.target.value)} placeholder="To" className="input" /><input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="input" /><textarea placeholder="Message" rows={6} className="input" /><button className="btn btn-primary">Send</button></div></div>;
}

"use client";
import { useState } from "react";
export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const verify = () => setResult({ valid: email.includes("@"), deliverable: true });
  return (<div className="max-w-2xl"><h1 className="page-title mb-4">Email Verification</h1><div className="card p-6"><input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.com" className="input w-full mb-4" /><button onClick={verify} className="btn btn-primary">Verify</button></div>{result && <div className="card p-4 mt-4">Valid: {result.valid ? "Yes" : "No"}</div>}</div>);
}

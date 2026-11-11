"use client";
import { useState } from "react";
export default function TwoFactorPage() {
  const [enabled, setEnabled] = useState(false);
  return (<div className="max-w-2xl"><h1 className="page-title mb-4">Two-Factor Authentication</h1><div className="card p-6"><div className="flex justify-between"><div><div className="font-medium">2FA Status</div><div className="text-sm text-slate-500">{enabled ? "Enabled" : "Disabled"}</div></div><button onClick={() => setEnabled(!enabled)} className="btn btn-primary">{enabled ? "Disable" : "Enable"}</button></div></div></div>);
}

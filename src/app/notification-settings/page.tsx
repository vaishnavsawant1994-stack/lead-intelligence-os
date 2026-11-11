"use client";
import { useState } from "react";
export default function NotificationSettingsPage() {
  const [emailOpens, setEmailOpens] = useState(true);
  return (<div className="max-w-2xl"><h1 className="page-title mb-4">Notification Settings</h1><div className="card p-6"><label className="flex justify-between"><span>Email opens</span><input type="checkbox" checked={emailOpens} onChange={() => setEmailOpens(!emailOpens)} /></label></div></div>);
}

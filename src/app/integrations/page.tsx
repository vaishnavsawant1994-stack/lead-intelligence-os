"use client";
import { useState } from "react";
export default function IntegrationsPage() {
  const [gmail, setGmail] = useState(false);
  const [outlook, setOutlook] = useState(false);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Email Integrations</h1>
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold mb-2">Gmail</h3>
          {gmail ? <span className="text-emerald-600">Connected</span> : <button onClick={() => setGmail(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">Connect Gmail</button>}
        </div>
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold mb-2">Outlook</h3>
          {outlook ? <span className="text-emerald-600">Connected</span> : <button onClick={() => setOutlook(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Connect Outlook</button>}
        </div>
      </div>
    </div>
  );
}

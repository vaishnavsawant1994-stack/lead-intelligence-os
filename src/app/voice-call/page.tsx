"use client";
import { useState } from "react";
export default function AIVoiceCallPage() {
  const [status, setStatus] = useState("idle");
  const [person, setPerson] = useState("");
  const people = [{ id: "1", name: "Arjun Mehta" }, { id: "2", name: "Sophia Reynolds" }];
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">AI Voice Call</h1>
      {status === "idle" && (
        <div className="bg-white border rounded-xl p-6">
          <select value={person} onChange={e => setPerson(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-4">
            <option value="">Select person</option>
            {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={() => setStatus("active")} disabled={!person} className="w-full bg-emerald-600 text-white py-3 rounded-lg disabled:opacity-50">Start Call</button>
        </div>
      )}
      {status === "active" && (
        <div className="bg-white border rounded-xl p-6 text-center">
          <div className="text-4xl mb-4">📞</div>
          <div className="font-medium">Call in progress</div>
          <button onClick={() => setStatus("ended")} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg">End Call</button>
        </div>
      )}
      {status === "ended" && (
        <div className="bg-white border rounded-xl p-6 text-center">
          <div className="font-medium mb-4">Call Ended</div>
          <button onClick={() => setStatus("idle")} className="border px-4 py-2 rounded-lg">New Call</button>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
const VOICES = [{ id: "ara", name: "Ara", desc: "Warm female" }, { id: "leo", name: "Leo", desc: "Natural male" }, { id: "luna", name: "Luna", desc: "Calm female" }];
export default function AIVoiceCallPage() {
  const [status, setStatus] = useState("idle");
  const [person, setPerson] = useState("");
  const [voice, setVoice] = useState("ara");
  const people = [{ id: "1", name: "Arjun Mehta" }, { id: "2", name: "Sophia Reynolds" }];
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">AI Voice Call</h1>
      {status === "idle" && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <select value={person} onChange={e => setPerson(e.target.value)} className="w-full border rounded-lg px-3 py-2">
            <option value="">Select person</option>
            {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="grid grid-cols-3 gap-2">
            {VOICES.map(v => <button key={v.id} onClick={() => setVoice(v.id)} className={`p-3 border rounded-lg text-sm ${voice === v.id ? "border-indigo-500 bg-indigo-50" : ""}`}>{v.name}<div className="text-xs text-slate-500">{v.desc}</div></button>)}
          </div>
          <button onClick={() => setStatus("active")} disabled={!person} className="w-full bg-emerald-600 text-white py-3 rounded-lg disabled:opacity-50">Start Call</button>
        </div>
      )}
      {status === "active" && (
        <div className="bg-white border rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">🎙️</div>
          <div className="font-medium">On call with {VOICES.find(v => v.id === voice)?.name}</div>
          <button onClick={() => setStatus("ended")} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg">End Call</button>
        </div>
      )}
      {status === "ended" && <div className="bg-white border rounded-xl p-6 text-center"><div className="mb-4">Call Ended</div><button onClick={() => setStatus("idle")} className="border px-4 py-2 rounded-lg">New Call</button></div>}
    </div>
  );
}

"use client";
import { useState } from "react";
const VOICES = [{ id: "ara", name: "Ara", style: "Warm" }, { id: "leo", name: "Leo", style: "Confident" }, { id: "luna", name: "Luna", style: "Calm" }];
const PEOPLE = [{ id: "1", name: "Arjun Mehta", company: "TechNova", phone: "+91 98765 43210" }, { id: "2", name: "Sophia Reynolds", company: "Horizon Capital", phone: "+1 212 555 0142" }];
export default function AIVoiceCallPage() {
  const [status, setStatus] = useState("idle");
  const [personId, setPersonId] = useState("");
  const [voiceId, setVoiceId] = useState("ara");
  const [notes, setNotes] = useState("");
  const person = PEOPLE.find(p => p.id === personId);
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">AI Voice Call</h1>
      {status === "idle" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Select Contact</h3>
            {PEOPLE.map(p => <button key={p.id} onClick={() => setPersonId(p.id)} className={`w-full text-left p-3 rounded-lg border mb-2 ${personId === p.id ? "border-indigo-500 bg-indigo-50" : ""}`}><div className="font-medium text-sm">{p.name}</div><div className="text-xs text-slate-500">{p.company}</div></button>)}
          </div>
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Choose Voice</h3>
            {VOICES.map(v => <button key={v.id} onClick={() => setVoiceId(v.id)} className={`w-full text-left p-3 rounded-lg border mb-2 ${voiceId === v.id ? "border-indigo-500 bg-indigo-50" : ""}`}><div className="font-medium text-sm">{v.name}</div><div className="text-xs text-slate-500">{v.style}</div></button>)}
            <button onClick={() => setStatus("active")} disabled={!personId} className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-lg disabled:opacity-50">Start Call</button>
          </div>
        </div>
      )}
      {status === "active" && (
        <div className="bg-white border rounded-xl p-6 text-center">
          <div className="text-lg font-medium">{person?.name}</div>
          <div className="text-slate-500 text-sm mb-4">On call</div>
          <button onClick={() => setStatus("ended")} className="bg-red-600 text-white px-6 py-2 rounded-lg">End Call</button>
        </div>
      )}
      {status === "ended" && (
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Call Summary - {person?.name}</h3>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes..." rows={4} className="w-full border rounded-lg p-3 text-sm mb-4" />
          <select className="w-full border rounded-lg px-3 py-2 text-sm mb-4"><option>Select outcome</option><option>Interested</option><option>Meeting scheduled</option><option>Not interested</option></select>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
          <button onClick={() => setStatus("idle")} className="ml-3 text-sm text-slate-500">New Call</button>
        </div>
      )}
    </div>
  );
}

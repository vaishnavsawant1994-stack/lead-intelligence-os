"use client";
import { useState } from "react";
export default function AICallNotes({ person, onSave }: { person: string; onSave: (n: any) => void }) {
  const [notes, setNotes] = useState<any>(null);
  const generate = async () => { await new Promise(r => setTimeout(r, 1000)); setNotes({ summary: `Spoke with ${person}. Positive conversation about collaboration.`, keyPoints: ["Interested in partnership", "Asked about pricing"] }); };
  return (<div className="bg-white border rounded-xl p-6"><h3 className="font-semibold mb-4">AI Call Notes</h3>{!notes ? <button onClick={generate} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">Generate Notes</button> : <div><p className="text-sm mb-3">{notes.summary}</p><ul className="text-sm">{notes.keyPoints.map((p: string, i: number) => <li key={i}>• {p}</li>)}</ul><button onClick={() => onSave(notes)} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Save to CRM</button></div>}</div>);
}

"use client";
import { useState } from "react";
export default function AIChatPage() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi! How can I help with your leads?" }]);
  const [input, setInput] = useState("");
  const send = () => { if (!input) return; setMessages([...messages, { role: "user", content: input }, { role: "assistant", content: "I can help with that. You have 464 Tier A prospects." }]); setInput(""); };
  return (<div className="max-w-2xl"><h1 className="text-2xl font-bold mb-4">AI Chat</h1><div className="bg-white border rounded-xl p-4 mb-4 h-96 overflow-y-auto space-y-3">{messages.map((m, i) => <div key={i} className={m.role === "user" ? "text-right" : ""}><span className={`inline-block px-3 py-2 rounded-lg text-sm ${m.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-100"}`}>{m.content}</span></div>)}</div><div className="flex gap-2"><input value={input} onChange={e => setInput(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Ask anything..." /><button onClick={send} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Send</button></div></div>);
}

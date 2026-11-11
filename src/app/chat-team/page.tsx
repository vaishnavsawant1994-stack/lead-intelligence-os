"use client";
import { useState } from "react";
export default function TeamChatPage() {
  const [messages, setMessages] = useState([{ user: "Sarah", text: "Arjun is interested" }]);
  const [msg, setMsg] = useState("");
  const send = () => { if (msg) { setMessages([...messages, { user: "You", text: msg }]); setMsg(""); } };
  return <div className="max-w-2xl"><h1 className="page-title mb-4">Team Chat</h1><div className="card"><div className="h-64 overflow-y-auto p-4 space-y-3">{messages.map((m, i) => <div key={i} className={`flex ${m.user === "You" ? "justify-end" : ""}`}><div className={`px-4 py-2 rounded-lg ${m.user === "You" ? "bg-indigo-600 text-white" : "bg-slate-100"}`}><div className="text-xs opacity-70">{m.user}</div><div className="text-sm">{m.text}</div></div></div>)}</div><div className="border-t p-4 flex gap-3"><input value={msg} onChange={e => setMsg(e.target.value)} className="input flex-1" /><button onClick={send} className="btn btn-primary">Send</button></div></div></div>;
}

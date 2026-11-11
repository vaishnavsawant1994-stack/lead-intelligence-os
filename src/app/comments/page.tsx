"use client";
import { useState } from "react";
export default function CommentsPage() {
  const [comments, setComments] = useState([{ user: "Sarah", text: "Very interested", person: "Arjun Mehta" }]);
  const [text, setText] = useState("");
  const add = () => { if (text) { setComments([...comments, { user: "You", text, person: "Arjun Mehta" }]); setText(""); } };
  return <div><h1 className="page-title mb-4">Comments</h1><div className="card divide-y mb-4">{comments.map((c, i) => <div key={i} className="px-5 py-4"><div className="text-sm font-medium">{c.user} on {c.person}</div><div className="text-sm">{c.text}</div></div>)}</div><div className="flex gap-3"><input value={text} onChange={e => setText(e.target.value)} className="input flex-1" placeholder="Add comment..." /><button onClick={add} className="btn btn-primary">Post</button></div></div>;
}

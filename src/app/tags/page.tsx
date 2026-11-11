"use client";
import { useState } from "react";
export default function TagsPage() {
  const [tags, setTags] = useState([{ name: "Hot Lead", count: 45 }]);
  return (<div><h1 className="page-title mb-4">Tags</h1><div className="flex flex-wrap gap-3">{tags.map(t => <div key={t.name} className="card px-4 py-3"><span className="font-medium text-sm">{t.name}</span> <span className="text-xs text-slate-400">{t.count}</span></div>)}</div></div>);
}

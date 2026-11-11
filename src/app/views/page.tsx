"use client";
import { useState } from "react";
export default function ViewsPage() {
  const views = [{ name: "Tier A", count: 464 }, { name: "India", count: 1247 }];
  return (<div><h1 className="page-title mb-4">Saved Views</h1><div className="grid md:grid-cols-3 gap-4">{views.map(v => <div key={v.name} className="card p-5"><div className="font-medium">{v.name}</div><div className="text-2xl font-bold">{v.count}</div></div>)}</div></div>);
}

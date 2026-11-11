"use client";
export default function APIDocsPage() {
  const endpoints = [{ method: "GET", path: "/api/people", description: "List all people" }, { method: "POST", path: "/api/people", description: "Create a person" }];
  return <div><h1 className="page-title mb-4">API Documentation</h1><div className="card"><table className="table"><thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead><tbody>{endpoints.map(e => <tr key={e.path+e.method}><td><span className={`badge ${e.method === "GET" ? "badge-success" : "badge-primary"}`}>{e.method}</span></td><td className="font-mono text-sm">{e.path}</td><td>{e.description}</td></tr>)}</tbody></table></div></div>;
}

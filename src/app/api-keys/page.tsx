"use client";
import { useState } from "react";
export default function APIKeysPage() {
  const [keys, setKeys] = useState([{ id: "1", name: "Production", key: "li_live_xxxx" }]);
  return (<div><h1 className="page-title mb-4">API Keys</h1><div className="card"><table className="table"><thead><tr><th>Name</th><th>Key</th></tr></thead><tbody>{keys.map(k => <tr key={k.id}><td>{k.name}</td><td className="font-mono text-xs">{k.key}</td></tr>)}</tbody></table></div></div>);
}

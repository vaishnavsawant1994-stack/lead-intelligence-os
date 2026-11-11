"use client";
import { useState } from "react";
export default function CustomFieldsPage() {
  const [fields] = useState([{ name: "Industry", type: "dropdown" }, { name: "Revenue", type: "number" }]);
  return (<div><h1 className="page-title mb-4">Custom Fields</h1><div className="card"><table className="table"><thead><tr><th>Field</th><th>Type</th></tr></thead><tbody>{fields.map(f => <tr key={f.name}><td>{f.name}</td><td>{f.type}</td></tr>)}</tbody></table></div></div>);
}

"use client";
export default function FieldsPage() {
  const fields = [{ name: "Industry", type: "Select", required: false }, { name: "Lead Source", type: "Text", required: true }];
  return <div><h1 className="page-title mb-4">Custom Fields</h1><div className="card"><table className="table"><thead><tr><th>Field</th><th>Type</th><th>Required</th></tr></thead><tbody>{fields.map(f => <tr key={f.name}><td>{f.name}</td><td>{f.type}</td><td>{f.required ? "Yes" : "No"}</td></tr>)}</tbody></table></div></div>;
}

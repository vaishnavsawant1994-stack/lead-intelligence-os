"use client";
export default function DynamicFieldsPage() {
  const fields = [{ token: "{{first_name}}", description: "First name" }, { token: "{{company}}", description: "Company" }];
  return (<div><h1 className="page-title mb-4">Dynamic Fields</h1><div className="card"><table className="table"><thead><tr><th>Token</th><th>Description</th></tr></thead><tbody>{fields.map(f => <tr key={f.token}><td className="font-mono text-indigo-600">{f.token}</td><td>{f.description}</td></tr>)}</tbody></table></div></div>);
}

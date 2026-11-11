"use client";
export default function ExportPage() {
  const exports = [{ name: "All People", format: "CSV", size: "2.4 MB" }, { name: "Pipeline Data", format: "Excel", size: "156 KB" }];
  return <div><h1 className="page-title mb-4">Data Export</h1><div className="card"><table className="table"><thead><tr><th>Export</th><th>Format</th><th>Size</th></tr></thead><tbody>{exports.map(e => <tr key={e.name}><td>{e.name}</td><td>{e.format}</td><td>{e.size}</td></tr>)}</tbody></table></div></div>;
}

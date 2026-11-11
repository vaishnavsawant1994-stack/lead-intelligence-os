"use client";
export default function ImportHistoryPage() {
  const imports = [{ source: "Google Sheet", records: 9746, date: "Nov 10", status: "Success" }, { source: "CSV Upload", records: 150, date: "Nov 8", status: "Success" }];
  return <div><h1 className="page-title mb-4">Import History</h1><div className="card"><table className="table"><thead><tr><th>Source</th><th>Records</th><th>Date</th><th>Status</th></tr></thead><tbody>{imports.map(i => <tr key={i.date}><td>{i.source}</td><td>{i.records.toLocaleString()}</td><td>{i.date}</td><td><span className="badge badge-success">{i.status}</span></td></tr>)}</tbody></table></div></div>;
}

"use client";
export default function ScheduledReportsPage() {
  const reports = [{ name: "Weekly Pipeline", schedule: "Every Monday", active: true }, { name: "Monthly Summary", schedule: "1st of month", active: true }];
  return <div><h1 className="page-title mb-4">Scheduled Reports</h1><div className="card"><table className="table"><thead><tr><th>Report</th><th>Schedule</th><th>Status</th></tr></thead><tbody>{reports.map(r => <tr key={r.name}><td>{r.name}</td><td>{r.schedule}</td><td><span className="badge badge-success">Active</span></td></tr>)}</tbody></table></div></div>;
}

"use client";
export default function AssignmentsPage() {
  const assignments = [{ person: "Arjun Mehta", assignee: "You", company: "TechNova" }, { person: "Sophia Reynolds", assignee: "Sarah", company: "Horizon" }];
  return <div><h1 className="page-title mb-4">Assignments</h1><div className="card"><table className="table"><thead><tr><th>Person</th><th>Company</th><th>Assigned to</th></tr></thead><tbody>{assignments.map(a => <tr key={a.person}><td>{a.person}</td><td>{a.company}</td><td><select className="input text-sm py-1" defaultValue={a.assignee}><option>You</option><option>Sarah</option><option>Mike</option></select></td></tr>)}</tbody></table></div></div>;
}

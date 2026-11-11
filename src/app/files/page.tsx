"use client";
export default function FilesPage() {
  const files = [{ name: "Proposal.pdf", person: "Arjun Mehta", size: "2.4 MB" }];
  return (<div><h1 className="page-title mb-4">Files</h1><div className="card"><table className="table"><thead><tr><th>File</th><th>Person</th><th>Size</th></tr></thead><tbody>{files.map(f => <tr key={f.name}><td>{f.name}</td><td>{f.person}</td><td>{f.size}</td></tr>)}</tbody></table></div></div>);
}

"use client";
export default function GroupsPage() {
  const groups = [{ name: "Tier A Prospects", count: 464 }, { name: "India Contacts", count: 1247 }];
  return (<div><h1 className="page-title mb-4">Contact Groups</h1><div className="grid md:grid-cols-2 gap-4">{groups.map(g => <div key={g.name} className="card p-5 flex justify-between"><span className="font-medium">{g.name}</span><span className="text-2xl font-bold">{g.count}</span></div>)}</div></div>);
}

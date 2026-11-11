"use client";
export default function GroupsPage() {
  const groups = [{ name: "VIP Clients", members: 45 }, { name: "Active Prospects", members: 234 }];
  return <div><h1 className="page-title mb-4">Contact Groups</h1><div className="space-y-4">{groups.map(g => <div key={g.name} className="card p-5 flex justify-between"><div className="font-medium">{g.name}</div><div className="text-2xl font-bold">{g.members}</div></div>)}</div></div>;
}

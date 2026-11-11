"use client";
export default function RolesPage() {
  const roles = [{ name: "Admin", permissions: ["All access"], users: 1 }, { name: "Member", permissions: ["View assigned"], users: 5 }];
  return (<div><h1 className="page-title mb-4">Roles & Permissions</h1><div className="space-y-4">{roles.map(r => <div key={r.name} className="card p-5"><div className="font-medium">{r.name}</div><div className="text-sm text-slate-500">{r.users} users</div></div>)}</div></div>);
}

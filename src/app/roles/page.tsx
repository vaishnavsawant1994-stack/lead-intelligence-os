"use client";
export default function RolesPage() {
  const roles = [{ name: "Admin", permissions: ["All"] }, { name: "Manager", permissions: ["View", "Edit", "Assign"] }, { name: "Member", permissions: ["View", "Edit own"] }];
  return <div><h1 className="page-title mb-4">Roles & Permissions</h1><div className="space-y-4">{roles.map(r => <div key={r.name} className="card p-5"><div className="font-medium mb-2">{r.name}</div><div className="flex gap-2">{r.permissions.map(p => <span key={p} className="badge badge-neutral">{p}</span>)}</div></div>)}</div></div>;
}

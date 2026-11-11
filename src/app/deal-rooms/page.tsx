"use client";
export default function DealRoomsPage() {
  const rooms = [{ deal: "TechNova Partnership", files: 5, members: 3 }, { deal: "Horizon Investment", files: 3, members: 2 }];
  return <div><h1 className="page-title mb-4">Deal Rooms</h1><div className="space-y-4">{rooms.map(r => <div key={r.deal} className="card p-5 flex justify-between"><div><div className="font-medium">{r.deal}</div><div className="text-sm text-slate-500">{r.files} files · {r.members} members</div></div></div>)}</div></div>;
}

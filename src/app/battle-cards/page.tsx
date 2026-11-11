"use client";
export default function BattleCardsPage() {
  const cards = [{ competitor: "Apollo", strengths: ["Large database"], weaknesses: ["Expensive"], win: "Better pricing" }];
  return (<div><h1 className="page-title mb-4">Battle Cards</h1><div className="space-y-4">{cards.map(c => <div key={c.competitor} className="card p-5"><h3 className="font-medium">vs {c.competitor}</h3><div className="text-sm text-emerald-600 mt-2">Win: {c.win}</div></div>)}</div></div>);
}

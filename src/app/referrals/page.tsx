"use client";
export default function ReferralsPage() {
  const referrals = [{ referrer: "Arjun Mehta", referred: "Priya Sharma", status: "Converted" }];
  return <div><h1 className="page-title mb-4">Referrals</h1><div className="card"><table className="table"><thead><tr><th>Referrer</th><th>Referred</th><th>Status</th></tr></thead><tbody>{referrals.map(r => <tr key={r.referred}><td>{r.referrer}</td><td className="text-indigo-600">{r.referred}</td><td><span className="badge badge-success">{r.status}</span></td></tr>)}</tbody></table></div></div>;
}

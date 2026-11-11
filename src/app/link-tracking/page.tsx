"use client";
export default function LinkTrackingPage() {
  const links = [{ url: "calendly.com/meeting", clicks: 23, unique: 18 }];
  return <div><h1 className="page-title mb-4">Link Tracking</h1><div className="card"><table className="table"><thead><tr><th>Link</th><th>Clicks</th><th>Unique</th></tr></thead><tbody>{links.map(l => <tr key={l.url}><td className="font-mono text-sm text-indigo-600">{l.url}</td><td>{l.clicks}</td><td>{l.unique}</td></tr>)}</tbody></table></div></div>;
}

"use client";
export default function BookmarksPage() {
  const bookmarks = [{ name: "Pipeline", href: "/pipeline" }, { name: "Reports", href: "/reports" }];
  return (<div><h1 className="page-title mb-4">Bookmarks</h1><div className="grid md:grid-cols-3 gap-4">{bookmarks.map(b => <a key={b.name} href={b.href} className="card p-5 font-medium">{b.name}</a>)}</div></div>);
}

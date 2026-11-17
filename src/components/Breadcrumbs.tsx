"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  const segments = pathname.split("/").filter(Boolean);
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="hover:text-indigo-600">Dashboard</Link></li>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const label = decodeURIComponent(segment).replace(/-/g, " ");
          const last = index === segments.length - 1;
          return <li key={href} className="flex items-center gap-2"><span aria-hidden="true">/</span>{last ? <span aria-current="page" className="capitalize text-slate-800">{label}</span> : <Link href={href} className="capitalize hover:text-indigo-600">{label}</Link>}</li>;
        })}
      </ol>
    </nav>
  );
}

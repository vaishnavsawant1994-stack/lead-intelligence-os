export const navigationItems = [
  { href: "/", label: "Dashboard", group: "Workspace" },
  { href: "/people", label: "People", group: "Workspace" },
  { href: "/companies", label: "Companies", group: "Workspace" },
  { href: "/pipeline", label: "Pipeline", group: "Workspace" },
  { href: "/tasks", label: "Tasks", group: "Workspace" },
  { href: "/deals", label: "Deals", group: "Workspace" },
  { href: "/reports", label: "Reports", group: "Workspace" },
  { href: "/sources", label: "Research sources", group: "Workspace" },
  { href: "/audit", label: "CRM activity", group: "Workspace" },
  { href: "/settings", label: "Settings", group: "Workspace" },
  { href: "/export", label: "CSV export", group: "Utilities" },
  { href: "/consent", label: "Do-not-contact", group: "Utilities" },
  { href: "/import", label: "Import status", group: "Utilities" },
  { href: "/email-finder", label: "Email patterns", group: "Utilities" },
] as const;

export function isActiveNav(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

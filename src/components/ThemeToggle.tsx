"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    }
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  return (
    <button onClick={toggle} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-sm transition" title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
      {theme === "light" ? (<><span>🌙</span><span className="hidden sm:inline">Dark</span></>) : (<><span>☀️</span><span className="hidden sm:inline">Light</span></>)}
    </button>
  );
}

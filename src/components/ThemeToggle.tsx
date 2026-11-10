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
    <button onClick={toggle} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${
      theme === "light" ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-amber-100 text-amber-900 hover:bg-amber-200"
    }`}>
      {theme === "light" ? (<><span className="text-lg">🌙</span><span>Dark Mode</span></>) : (<><span className="text-lg">☀️</span><span>Light Mode</span></>)}
    </button>
  );
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (!response.ok) {
        setError(response.status === 503 ? "Administrator access has not been configured yet." : "Incorrect credentials.");
        return;
      }
      const requested = searchParams.get("next") || "/";
      router.replace(requested.startsWith("/") && !requested.startsWith("//") ? requested : "/");
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">LV</div>
          <h1 className="text-2xl font-bold">Leadveyra</h1>
          <p className="mt-1 text-sm text-slate-500">Private administrator preview · Lead Intelligence OS</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium">Email<input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="input mt-1" /></label>
          <label className="block text-sm font-medium">Password<input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input mt-1" /></label>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? "Signing in…" : "Sign in"}</button>
        </form>
        <p className="mt-5 text-center text-xs text-slate-500">Customer accounts are not enabled. Contact the administrator for access.</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="p-8 text-sm">Loading sign in…</div>}><LoginForm /></Suspense>;
}

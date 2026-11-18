export type Company = { id: string; name: string; industry: string | null; website: string | null; _count?: { people: number }; people?: Array<{ id: string; name: string; title: string | null; status: string }> };
export type Person = { id: string; name: string; title: string | null; email: string | null; phone: string | null; notes: string | null; tier: string | null; status: string; companyId: string | null; company: { id: string; name: string } | null; createdAt: string };
export type Task = { id: string; title: string; completed: boolean; dueAt: string | null };
export type Deal = { id: string; name: string; value: string; stage: string };

export const personStatuses = ["New", "Contacted", "Qualified", "Opportunity", "Won", "Lost"];
export const dealStages = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

export async function crmRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { cache: "no-store", credentials: "same-origin", ...options });
  if (response.status === 204) return undefined as T;
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof result === "object" && result !== null && "error" in result && typeof result.error === "string" ? result.error : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return result as T;
}

export function jsonOptions(method: "POST" | "PATCH" | "DELETE", body?: Record<string, unknown>): RequestInit {
  return { method, headers: { "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) };
}

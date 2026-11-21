import { InputError, optionalString, dateString } from "@/lib/crm";

export function appearanceDate(value: unknown): string | null {
  const parsed = dateString(value);
  return parsed?.toISOString().slice(0, 10) || null;
}

export function appearanceUrl(value: unknown): string | null {
  const raw = optionalString(value, "Reference URL", 500);
  if (!raw) return null;
  let url: URL;
  try { url = new URL(raw); } catch { throw new InputError("Reference URL must be a valid http(s) link"); }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || !url.hostname) {
    throw new InputError("Reference URL must be http(s) without embedded credentials");
  }
  return url.toString();
}

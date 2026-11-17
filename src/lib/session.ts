// Single-administrator preview access gate. This is NOT multi-tenant production authentication.
const encoder = new TextEncoder();
const decoder = new TextDecoder();
export const SESSION_COOKIE = "leadveyra_session";
export const SESSION_MAX_AGE = 60 * 60 * 8;

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(input: string): Uint8Array {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  return Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
}

async function mac(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function equalConstantTime(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function previewConfigured(): boolean {
  return Boolean(process.env.APP_ADMIN_EMAIL && (process.env.APP_ADMIN_PASSWORD || "").length >= 16 && (process.env.AUTH_SESSION_SECRET || "").length >= 32);
}

export async function safePasswordMatch(candidate: string): Promise<boolean> {
  const expected = process.env.APP_ADMIN_PASSWORD || "";
  if (!previewConfigured()) return false;
  const hash = async (value: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
  const a = await hash(candidate);
  const b = await hash(expected);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function createSessionToken(email: string): Promise<string> {
  if (!previewConfigured()) throw new Error("Preview authentication is not configured");
  const payload = toBase64Url(encoder.encode(JSON.stringify({ email, exp: Date.now() + SESSION_MAX_AGE * 1000 })));
  return payload + "." + await mac(payload, process.env.AUTH_SESSION_SECRET!);
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !previewConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 2 || !/^[a-f0-9]{64}$/.test(parts[1])) return false;
  try {
    const expected = await mac(parts[0], process.env.AUTH_SESSION_SECRET!);
    if (!equalConstantTime(parts[1], expected)) return false;
    const payload = JSON.parse(decoder.decode(fromBase64Url(parts[0]))) as { email?: string; exp?: number };
    return payload.email === process.env.APP_ADMIN_EMAIL!.toLowerCase() && typeof payload.exp === "number" && payload.exp > Date.now() && payload.exp <= Date.now() + SESSION_MAX_AGE * 1000;
  } catch {
    return false;
  }
}

import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

function loginKey(normalizedEmail: string): string {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("Preview authentication is not configured");
  return createHmac("sha256", secret).update("preview-login:").update(normalizedEmail).digest("hex");
}

// Persistent per-identifier throttle, shared across app workers/restarts.
// A temporary account lockout can still be induced by attackers; this is a
// preview defense, not a production adaptive anti-abuse platform.
export async function checkPreviewLoginLimit(email: string): Promise<number> {
  const key = loginKey(email);
  const row = await prisma.previewLoginAttempt.findUnique({ where: { key } });
  if (!row) return 0;
  const now = Date.now();
  if (row.blockedUntil && row.blockedUntil.getTime() > now) {
    return Math.max(1, Math.ceil((row.blockedUntil.getTime() - now) / 1000));
  }
  if (row.windowStartedAt.getTime() + WINDOW_MS <= now || row.blockedUntil) {
    await prisma.previewLoginAttempt.updateMany({
      where: { key, updatedAt: row.updatedAt },
      data: { failures: 0, windowStartedAt: new Date(now), blockedUntil: null },
    });
  }
  return 0;
}

export async function notePreviewLoginFailure(email: string): Promise<number> {
  const key = loginKey(email);
  const now = Date.now();
  const row = await prisma.previewLoginAttempt.upsert({
    where: { key },
    create: { key, failures: 1, windowStartedAt: new Date(now) },
    update: { failures: { increment: 1 } },
  });
  if (row.failures < MAX_FAILURES) return 0;
  const until = new Date(now + WINDOW_MS);
  await prisma.previewLoginAttempt.update({
    where: { key },
    data: { blockedUntil: until },
  });
  return Math.ceil(WINDOW_MS / 1000);
}

export async function clearPreviewLoginFailures(email: string): Promise<void> {
  await prisma.previewLoginAttempt.deleteMany({ where: { key: loginKey(email) } });
}

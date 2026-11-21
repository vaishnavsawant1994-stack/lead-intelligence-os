import { Prisma } from "@prisma/client";

export type AuditEntity = "person" | "company" | "task" | "deal" | "organization" | "suppression" | "source" | "appearance" | "automation_rule" | "automation_run";
export type AuditAction = "created" | "updated" | "deleted";

export async function recordAudit(
  tx: Prisma.TransactionClient,
  organizationId: string,
  entityType: AuditEntity,
  entityId: string,
  action: AuditAction,
): Promise<void> {
  await tx.auditEvent.create({
    data: {
      organizationId,
      actorEmail: process.env.APP_ADMIN_EMAIL?.trim().toLowerCase() || "preview-administrator",
      entityType,
      entityId,
      action,
    },
  });
}

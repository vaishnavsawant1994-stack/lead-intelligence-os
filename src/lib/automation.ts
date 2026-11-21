import type { Prisma } from "@prisma/client";
import { recordAudit } from "@/lib/audit";

// Deliberately internal-only: this handler never calls a provider or scheduler.
// All tasks and audit entries are created in the *same transaction* as Person.
export async function applyPersonCreatedRules(
  tx: Prisma.TransactionClient,
  organizationId: string,
  personId: string,
  personName: string,
): Promise<void> {
  const rules = await tx.automationRule.findMany({
    where: { organizationId, enabled: true, trigger: "person_created" },
    orderBy: { createdAt: "asc" },
    take: 10,
  });
  for (const rule of rules) {
    // A rule can run at most once per person (enforced by DB unique index).
    const existing = await tx.automationRun.findUnique({
      where: { ruleId_personId: { ruleId: rule.id, personId } },
      select: { id: true },
    });
    if (existing) continue;
    const title = rule.taskTitleTemplate.replaceAll("{name}", personName).slice(0, 240);
    const task = await tx.task.create({ data: { organizationId, title } });
    const run = await tx.automationRun.create({
      data: { organizationId, ruleId: rule.id, personId, taskId: task.id },
    });
    await recordAudit(tx, organizationId, "task", task.id, "created");
    await recordAudit(tx, organizationId, "automation_run", run.id, "created");
  }
}

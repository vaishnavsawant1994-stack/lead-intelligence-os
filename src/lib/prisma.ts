import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { leadveyraPrisma?: PrismaClient };
export const prisma = globalForPrisma.leadveyraPrisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.leadveyraPrisma = prisma;

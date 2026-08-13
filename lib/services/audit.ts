import { prisma } from "@/lib/prisma";

export type AuditActor = {
  id?: string | null;
  email?: string | null;
  role?: string | null;
};

export async function recordAuditLog(params: {
  actor?: AuditActor | null;
  action: string;
  entityType: string;
  entityId: string;
  previousState?: unknown;
  newState?: unknown;
  metadata?: Record<string, unknown>;
}) {
  const previousState = normalizeJson(params.previousState);
  const newState = normalizeJson(params.newState);
  const metadata = normalizeJson(params.metadata);

  return prisma.auditLog.create({
    data: {
      actorId: params.actor?.id ?? null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      previousState,
      newState,
      metadata,
    },
  });
}

function normalizeJson(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  return JSON.parse(JSON.stringify(value));
}

import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/services/audit";
import {
  originCreateSchema,
  originUpdateSchema,
} from "@/lib/validation/service-schemas";

export type OriginRecord = {
  id: string;
  name: string;
  regionId: string;
  villageId: string | null;
  altitude: string | null;
  landscape: string | null;
  climate: string | null;
  biodiversity: string | null;
  seasonality: string | null;
  traditionalPractices: string | null;
  historicalContext: string | null;
  originStory: string | null;
  verificationStatus: string;
  isActive: boolean;
};

export async function listOrigins(): Promise<OriginRecord[]> {
  const origins = await prisma.origin.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      regionId: true,
      villageId: true,
      altitude: true,
      landscape: true,
      climate: true,
      biodiversity: true,
      seasonality: true,
      traditionalPractices: true,
      historicalContext: true,
      originStory: true,
      verificationStatus: true,
      isActive: true,
    },
  });

  return origins.map((origin) => ({
    ...origin,
    verificationStatus: origin.verificationStatus,
  }));
}

export async function getOrigin(id: string): Promise<OriginRecord | null> {
  const origin = await prisma.origin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      regionId: true,
      villageId: true,
      altitude: true,
      landscape: true,
      climate: true,
      biodiversity: true,
      seasonality: true,
      traditionalPractices: true,
      historicalContext: true,
      originStory: true,
      verificationStatus: true,
      isActive: true,
    },
  });

  if (!origin) {
    return null;
  }

  return { ...origin, verificationStatus: origin.verificationStatus };
}

export async function createOrigin(
  input: unknown,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
): Promise<OriginRecord> {
  const parsed = originCreateSchema.parse(input);
  const origin = await prisma.origin.create({
    data: {
      name: parsed.name,
      regionId: parsed.regionId,
      villageId: parsed.villageId ?? undefined,
      altitude: parsed.altitude ?? undefined,
      landscape: parsed.landscape ?? undefined,
      climate: parsed.climate ?? undefined,
      biodiversity: parsed.biodiversity ?? undefined,
      seasonality: parsed.seasonality ?? undefined,
      traditionalPractices: parsed.traditionalPractices ?? undefined,
      historicalContext: parsed.historicalContext ?? undefined,
      originStory: parsed.originStory ?? undefined,
      verificationStatus: parsed.verificationStatus ?? "UNVERIFIED",
      isActive: parsed.isActive ?? true,
    },
  });

  await recordAuditLog({
    actor: options?.actor,
    action: "create",
    entityType: "Origin",
    entityId: origin.id,
    newState: origin,
  });

  return { ...origin, verificationStatus: origin.verificationStatus };
}

export async function updateOrigin(
  id: string,
  input: unknown,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
): Promise<OriginRecord> {
  const parsed = originUpdateSchema.parse(input);
  const existing = await prisma.origin.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Origin not found");
  }

  const origin = await prisma.origin.update({
    where: { id },
    data: {
      name: parsed.name ?? undefined,
      regionId: parsed.regionId ?? undefined,
      villageId: parsed.villageId ?? undefined,
      altitude: parsed.altitude ?? undefined,
      landscape: parsed.landscape ?? undefined,
      climate: parsed.climate ?? undefined,
      biodiversity: parsed.biodiversity ?? undefined,
      seasonality: parsed.seasonality ?? undefined,
      traditionalPractices: parsed.traditionalPractices ?? undefined,
      historicalContext: parsed.historicalContext ?? undefined,
      originStory: parsed.originStory ?? undefined,
      verificationStatus: parsed.verificationStatus ?? undefined,
      isActive: parsed.isActive ?? undefined,
    },
  });

  await recordAuditLog({
    actor: options?.actor,
    action: "update",
    entityType: "Origin",
    entityId: origin.id,
    previousState: existing,
    newState: origin,
  });

  return { ...origin, verificationStatus: origin.verificationStatus };
}

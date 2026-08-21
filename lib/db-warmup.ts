import { prisma } from "@/lib/prisma";

export async function warmupDb() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    // ignore
  }
}

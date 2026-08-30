import { prisma } from "@/lib/prisma";

let warmed = false;

export async function warmupDb() {
  if (warmed) return;
  try {
    await prisma.$queryRaw`SELECT 1`;
    warmed = true;
  } catch {
    // ignore
  }
}

import { prisma } from "@/lib/prisma";

let warmed = false;
let lastWarmup = 0;
const WARMUP_INTERVAL = 5 * 60 * 1000;

export async function warmupDb() {
  const now = Date.now();
  if (warmed && now - lastWarmup < WARMUP_INTERVAL) return;

  try {
    await prisma.$queryRaw`SELECT 1`;
    warmed = true;
    lastWarmup = now;
  } catch (err) {
    console.error("Database warmup failed:", err);
  }
}

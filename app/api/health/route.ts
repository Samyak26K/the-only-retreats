import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const start = Date.now();

  await prisma.$queryRaw`SELECT 1`;

  const dbTime = Date.now() - start;

  const dbUrl = process.env.DATABASE_URL ?? "not set";
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ":***@");

  return NextResponse.json({
    db: dbTime + "ms",
    url: maskedUrl,
    status: "ok",
  });
}

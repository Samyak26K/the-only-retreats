import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";

  if (q.trim().length < 3) {
    return NextResponse.json({ results: [] });
  }

  const products = await prisma.product.findMany({
    where: {
      status: { in: ["ACTIVE", "SEASONAL"] },
      NOT: [{ brand: "Dhatu" }, { brand: "Divya" }],
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { shortDescription: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      primaryOrigin: {
        select: { name: true },
      },
    },
    take: 6,
  });

  return NextResponse.json({
    results: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      origin: p.primaryOrigin?.name ?? null,
    })),
  });
}

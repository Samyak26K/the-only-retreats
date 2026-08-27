import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: {
      brand: "Dhatu",
      status: "ACTIVE",
    },
    take: 6,
    select: {
      id: true,
      name: true,
      slug: true,
      media: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: { url: true },
      },
      variants: {
        where: { status: "ACTIVE" },
        take: 1,
        select: { sellingPrice: true },
      },
    },
  });

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.variants[0]?.sellingPrice ?? 0),
      image: p.media[0]?.url ?? "",
      category: p.name.toLowerCase().includes("copper")
        ? "Copper"
        : p.name.toLowerCase().includes("brass")
          ? "Brass"
          : p.name.toLowerCase().includes("kansa")
            ? "Kansa"
            : "Dhatu",
    })),
  });
}

import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/services/audit";
import {
  productCreateSchema,
  productUpdateSchema,
} from "@/lib/validation/service-schemas";

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  status: string;
  featured: boolean;
  currency: string;
  mrp: number | null;
  sellingPrice: number | null;
  category: { id: string; name: string; slug: string } | null;
  primaryOrigin: { id: string; name: string } | null;
};

export type ProductDetail = ProductListItem & {
  shortDescription: string | null;
  longDescription: string | null;
  brand: string | null;
  costPrice: number | null;
};

export async function listProducts(): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      featured: true,
      currency: true,
      mrp: true,
      sellingPrice: true,
      shortDescription: true,
      longDescription: true,
      brand: true,
      costPrice: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      primaryOrigin: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return products.map((product) => ({
    ...product,
    status: product.status,
    mrp: product.mrp ? Number(product.mrp) : null,
    sellingPrice: product.sellingPrice ? Number(product.sellingPrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
  }));
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      featured: true,
      currency: true,
      mrp: true,
      sellingPrice: true,
      shortDescription: true,
      longDescription: true,
      brand: true,
      costPrice: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      primaryOrigin: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return {
    ...product,
    mrp: product.mrp ? Number(product.mrp) : null,
    sellingPrice: product.sellingPrice ? Number(product.sellingPrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
  };
}

export async function getProductById(
  id: string,
): Promise<ProductDetail | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      featured: true,
      currency: true,
      mrp: true,
      sellingPrice: true,
      shortDescription: true,
      longDescription: true,
      brand: true,
      costPrice: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      primaryOrigin: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return {
    ...product,
    mrp: product.mrp ? Number(product.mrp) : null,
    sellingPrice: product.sellingPrice ? Number(product.sellingPrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
  };
}

export async function createProduct(
  input: unknown,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
): Promise<ProductDetail> {
  const parsed = productCreateSchema.parse(input);
  const slug = parsed.slug ?? slugify(parsed.name);

  const product = await prisma.product.create({
    data: {
      name: parsed.name,
      slug,
      categoryId: parsed.categoryId ?? undefined,
      primaryOriginId: parsed.primaryOriginId ?? undefined,
      shortDescription: parsed.shortDescription ?? undefined,
      longDescription: parsed.longDescription ?? undefined,
      brand: parsed.brand ?? undefined,
      status: parsed.status ?? "DRAFT",
      featured: parsed.featured ?? false,
      currency: parsed.currency ?? "INR",
      mrp: parsed.mrp ?? undefined,
      sellingPrice: parsed.sellingPrice ?? undefined,
      costPrice: parsed.costPrice ?? undefined,
      seoTitle: parsed.seoTitle ?? undefined,
      seoDescription: parsed.seoDescription ?? undefined,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      featured: true,
      currency: true,
      mrp: true,
      sellingPrice: true,
      shortDescription: true,
      longDescription: true,
      brand: true,
      costPrice: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      primaryOrigin: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  await recordAuditLog({
    actor: options?.actor,
    action: "create",
    entityType: "Product",
    entityId: product.id,
    newState: product,
  });

  return {
    ...product,
    mrp: product.mrp ? Number(product.mrp) : null,
    sellingPrice: product.sellingPrice ? Number(product.sellingPrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
  };
}

export async function updateProduct(
  id: string,
  input: unknown,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
): Promise<ProductDetail> {
  const parsed = productUpdateSchema.parse(input);
  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Product not found");
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: parsed.name ?? undefined,
      slug: parsed.slug ?? undefined,
      categoryId: parsed.categoryId ?? undefined,
      primaryOriginId: parsed.primaryOriginId ?? undefined,
      shortDescription: parsed.shortDescription ?? undefined,
      longDescription: parsed.longDescription ?? undefined,
      brand: parsed.brand ?? undefined,
      status: parsed.status ?? undefined,
      featured: parsed.featured ?? undefined,
      currency: parsed.currency ?? undefined,
      mrp: parsed.mrp ?? undefined,
      sellingPrice: parsed.sellingPrice ?? undefined,
      costPrice: parsed.costPrice ?? undefined,
      seoTitle: parsed.seoTitle ?? undefined,
      seoDescription: parsed.seoDescription ?? undefined,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      featured: true,
      currency: true,
      mrp: true,
      sellingPrice: true,
      shortDescription: true,
      longDescription: true,
      brand: true,
      costPrice: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      primaryOrigin: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  await recordAuditLog({
    actor: options?.actor,
    action: "update",
    entityType: "Product",
    entityId: updated.id,
    previousState: existing,
    newState: updated,
  });

  return {
    ...updated,
    mrp: updated.mrp ? Number(updated.mrp) : null,
    sellingPrice: updated.sellingPrice ? Number(updated.sellingPrice) : null,
    costPrice: updated.costPrice ? Number(updated.costPrice) : null,
  };
}

export async function archiveProduct(
  id: string,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
): Promise<ProductDetail> {
  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Product not found");
  }

  const updated = await prisma.product.update({
    where: { id },
    data: { status: "ARCHIVED" },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      featured: true,
      currency: true,
      mrp: true,
      sellingPrice: true,
      shortDescription: true,
      longDescription: true,
      brand: true,
      costPrice: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      primaryOrigin: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  await recordAuditLog({
    actor: options?.actor,
    action: "archive",
    entityType: "Product",
    entityId: updated.id,
    previousState: existing,
    newState: updated,
  });

  return {
    ...updated,
    mrp: updated.mrp ? Number(updated.mrp) : null,
    sellingPrice: updated.sellingPrice ? Number(updated.sellingPrice) : null,
    costPrice: updated.costPrice ? Number(updated.costPrice) : null,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

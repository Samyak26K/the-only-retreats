import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/services/products";

export { slugify };

/** Reads a form field as a trimmed string, or undefined when absent/empty. */
export function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Storefront images render through next/image, which only allows
 * res.cloudinary.com (next.config.ts). Any other host crashes the product page.
 */
export function validateImageUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export async function upsertCategoryByName(name: string | undefined) {
  if (!name) {
    return undefined;
  }
  const slug = slugify(name);
  if (!slug) {
    return undefined;
  }
  const category = await prisma.category.upsert({
    where: { slug },
    update: {},
    create: { name, slug },
    select: { id: true },
  });
  return category.id;
}

export async function getDefaultInventoryLocationId() {
  const existing = await prisma.inventoryLocation.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (existing) {
    return existing.id;
  }
  const created = await prisma.inventoryLocation.create({
    data: { name: "Main Warehouse", type: "warehouse", isActive: true },
    select: { id: true },
  });
  return created.id;
}

/** Refresh every storefront page that lists or shows products. */
export function revalidateProductPages() {
  revalidatePath("/");
  for (const base of ["", "/dhatu", "/divya"]) {
    if (base) {
      revalidatePath(base);
    }
    revalidatePath(`${base}/products`);
    revalidatePath(`${base}/products/[slug]`, "page");
  }
}

/** Turns known DB/validation failures into a message an admin can act on. */
export function toAdminErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues
      .map((issue) => `${issue.path.join(".") || "form"}: ${issue.message}`)
      .join("; ");
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    const { code, meta } = error as {
      code?: string;
      meta?: { target?: string[] | string };
    };
    if (code === "P2002") {
      const target = String(meta?.target ?? "");
      if (target.includes("slug")) {
        return "A product with this slug already exists. Choose a different slug.";
      }
      if (target.includes("sku")) {
        return "A variant with this SKU already exists. SKUs must be unique.";
      }
      return "This record conflicts with an existing one.";
    }
    if (code === "P2025") {
      return "The record no longer exists. Refresh the page.";
    }
  }

  console.error("[admin] Unexpected error:", error);
  return "Something went wrong while saving. Please try again.";
}

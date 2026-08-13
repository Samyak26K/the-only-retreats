import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/server/auth";
import { createProduct } from "@/lib/services/products";
import { productCreateSchema } from "@/lib/validation/service-schemas";

export default async function NewProductPage() {
  const adminContext = await requirePermission("products.write").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  async function createProductAction(formData: FormData) {
    "use server";

    if (!adminContext) {
      throw new Error("Unauthorized");
    }

    const raw = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      brand: formData.get("brand"),
      categoryId: formData.get("categoryId"),
      primaryOriginId: formData.get("primaryOriginId"),
      shortDescription: formData.get("shortDescription"),
      longDescription: formData.get("longDescription"),
      status: formData.get("status"),
      featured: formData.get("featured") === "on",
      currency: formData.get("currency"),
      mrp: formData.get("mrp"),
      sellingPrice: formData.get("sellingPrice"),
      seoTitle: formData.get("seoTitle"),
      seoDescription: formData.get("seoDescription"),
    };

    const parsed = productCreateSchema.safeParse(raw);

    if (!parsed.success) {
      throw new Error("Validation failed");
    }

    await createProduct(parsed.data, {
      actor: {
        id: adminContext.adminUserId,
        email: adminContext.email,
        role: adminContext.roleName,
      },
    });
    redirect("/admin/products");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  const origins = await prisma.origin.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <Heading
        title="Create product"
        subtitle="Add a new product record for the catalog. Prices are validated server-side before persistence."
        alignment="left"
      />

      <form
        action={createProductAction}
        className="space-y-6 rounded-2xl border border-border bg-background p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Name</span>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Slug</span>
            <input
              name="slug"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Brand</span>
            <input
              name="brand"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Category</span>
            <select
              name="categoryId"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            >
              <option value="">None</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Status</span>
            <select
              name="status"
              defaultValue="ACTIVE"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="COMING_SOON">Coming soon</option>
              <option value="SEASONAL">Seasonal</option>
              <option value="SOLD_OUT">Sold out</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Featured</span>
            <input
              type="checkbox"
              name="featured"
              className="mt-2 h-4 w-4 rounded border-border"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Primary Origin</span>
            <select
              name="primaryOriginId"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            >
              <option value="">None</option>
              {origins.map((origin) => (
                <option key={origin.id} value={origin.id}>
                  {origin.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Currency</span>
            <input
              name="currency"
              defaultValue="INR"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">MRP</span>
            <input
              type="number"
              name="mrp"
              step="0.01"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Selling Price</span>
            <input
              type="number"
              name="sellingPrice"
              step="0.01"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Short Description</span>
          <textarea
            name="shortDescription"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Long Description</span>
          <textarea
            name="longDescription"
            rows={5}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">SEO Title</span>
            <input
              name="seoTitle"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">SEO Description</span>
            <input
              name="seoDescription"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit">Save product</Button>
          <Button type="button" variant="outline" onClick={() => {}}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

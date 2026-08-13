import { notFound } from "next/navigation";

import { Heading } from "@/components/ui/Heading";
import { requirePermission } from "@/lib/server/auth";
import { getProductById, updateProduct } from "@/lib/services/products";
import { productUpdateSchema } from "@/lib/validation/service-schemas";

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const adminContext = await requirePermission("products.read").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  async function updateProductAction(formData: FormData) {
    "use server";

    if (!adminContext) {
      throw new Error("Unauthorized");
    }

    const raw = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      brand: formData.get("brand"),
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

    const parsed = productUpdateSchema.safeParse(raw);

    if (!parsed.success) {
      throw new Error("Validation failed");
    }

    await updateProduct(id, parsed.data, {
      actor: {
        id: adminContext.adminUserId,
        email: adminContext.email,
        role: adminContext.roleName,
      },
    });
  }

  return (
    <div className="space-y-6">
      <Heading
        title={`Edit ${product.name}`}
        subtitle="Update the product record and keep the public site unchanged until you publish new content."
        alignment="left"
      />
      <form
        action={updateProductAction}
        className="space-y-6 rounded-2xl border border-border bg-background p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Name</span>
            <input
              defaultValue={product.name}
              name="name"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Slug</span>
            <input
              defaultValue={product.slug}
              name="slug"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Brand</span>
            <input
              defaultValue={product.brand ?? ""}
              name="brand"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Status</span>
            <select
              defaultValue={product.status}
              name="status"
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
              defaultChecked={product.featured}
              type="checkbox"
              name="featured"
              className="mt-2 h-4 w-4 rounded border-border"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Currency</span>
            <input
              defaultValue={product.currency}
              name="currency"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">MRP</span>
            <input
              defaultValue={product.mrp ?? ""}
              type="number"
              name="mrp"
              step="0.01"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Selling Price</span>
            <input
              defaultValue={product.sellingPrice ?? ""}
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
            defaultValue={product.shortDescription ?? ""}
            name="shortDescription"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Long Description</span>
          <textarea
            defaultValue={product.longDescription ?? ""}
            name="longDescription"
            rows={5}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">SEO Title</span>
            <input
              defaultValue={""}
              name="seoTitle"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">SEO Description</span>
            <input
              defaultValue={""}
              name="seoDescription"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
        </div>
        <button
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          type="submit"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}

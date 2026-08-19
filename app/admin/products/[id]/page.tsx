import { redirect, notFound } from "next/navigation";
import { z } from "zod";

import { Heading } from "@/components/ui/Heading";
import { requirePermission } from "@/lib/server/auth";
import { getProductById, updateProduct } from "@/lib/services/products";
import {
  createVariant,
  deactivateVariant,
  listVariants,
  updateVariant,
} from "@/lib/services/variants";
import { productUpdateSchema } from "@/lib/validation/service-schemas";
import {
  productVariantCreateSchema,
  productVariantUpdateSchema,
} from "@/lib/validation/service-schemas";

const cuidSchema = z.string().cuid();

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function toFeedbackMessage(value: string | undefined) {
  if (!value) {
    return null;
  }

  const messages: Record<string, string> = {
    variant_created: "Variant created successfully.",
    variant_updated: "Variant updated successfully.",
    variant_deactivated: "Variant deactivated successfully.",
    variant_validation_failed:
      "Variant validation failed. Please review the submitted values.",
    variant_invalid_id: "Invalid product or variant identifier.",
    variant_not_found: "Variant or product not found.",
    variant_wrong_product: "Variant does not belong to this product.",
    variant_sku_conflict: "SKU already exists. Please use a unique SKU.",
    variant_update_failed: "Unable to update variant right now.",
    variant_create_failed: "Unable to create variant right now.",
    variant_deactivate_failed: "Unable to deactivate variant right now.",
  };

  return messages[value] ?? "Operation could not be completed.";
}

export default async function AdminProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
}) {
  const { id } = await params;
  const adminContext = await requirePermission("products.read").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  const product = await getProductById(id);
  const variants = await listVariants(id);

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const successKey =
    typeof resolvedSearchParams.success === "string"
      ? resolvedSearchParams.success
      : undefined;
  const errorKey =
    typeof resolvedSearchParams.error === "string"
      ? resolvedSearchParams.error
      : undefined;
  const successMessage = toFeedbackMessage(successKey);
  const errorMessage = toFeedbackMessage(errorKey);

  if (!product) {
    notFound();
  }

  function toRedirect(status: "success" | "error", code: string) {
    return `/admin/products/${id}?${status}=${encodeURIComponent(code)}`;
  }

  async function updateProductAction(formData: FormData) {
    "use server";

    const writeAdminContext = await requirePermission("products.write");

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
        id: writeAdminContext.adminUserId,
        email: writeAdminContext.email,
        role: writeAdminContext.roleName,
      },
    });
  }

  async function createVariantAction(formData: FormData) {
    "use server";

    const writeAdminContext = await requirePermission("products.write");

    if (!cuidSchema.safeParse(id).success) {
      redirect(toRedirect("error", "variant_invalid_id"));
    }

    const netQuantity = formData.get("netQuantity");
    const raw = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      netQuantity: netQuantity === "" ? null : netQuantity,
      unit: formData.get("unit"),
      mrp: formData.get("mrp"),
      sellingPrice: formData.get("sellingPrice"),
      status: formData.get("status"),
      isDefault: formData.get("isDefault") === "on",
    };

    const parsed = productVariantCreateSchema
      .omit({ productId: true })
      .safeParse(raw);

    if (!parsed.success) {
      redirect(toRedirect("error", "variant_validation_failed"));
    }

    try {
      await createVariant(id, parsed.data, {
        actor: {
          id: writeAdminContext.adminUserId,
          email: writeAdminContext.email,
          role: writeAdminContext.roleName,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Product not found") {
          redirect(toRedirect("error", "variant_not_found"));
        }

        if (error.message === "SKU already exists") {
          redirect(toRedirect("error", "variant_sku_conflict"));
        }
      }

      redirect(toRedirect("error", "variant_create_failed"));
    }

    redirect(toRedirect("success", "variant_created"));
  }

  async function updateVariantAction(formData: FormData) {
    "use server";

    const writeAdminContext = await requirePermission("products.write");

    if (!cuidSchema.safeParse(id).success) {
      redirect(toRedirect("error", "variant_invalid_id"));
    }

    const variantIdRaw = formData.get("variantId");
    const variantIdParsed = cuidSchema.safeParse(variantIdRaw);

    if (!variantIdParsed.success) {
      redirect(toRedirect("error", "variant_invalid_id"));
    }

    const netQuantity = formData.get("netQuantity");
    const raw = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      netQuantity: netQuantity === "" ? null : netQuantity,
      unit: formData.get("unit"),
      mrp: formData.get("mrp"),
      sellingPrice: formData.get("sellingPrice"),
      status: formData.get("status"),
      isDefault: formData.get("isDefault") === "on",
    };

    const parsed = productVariantUpdateSchema
      .omit({ productId: true })
      .safeParse(raw);

    if (!parsed.success) {
      redirect(toRedirect("error", "variant_validation_failed"));
    }

    try {
      await updateVariant(id, variantIdParsed.data, parsed.data, {
        actor: {
          id: writeAdminContext.adminUserId,
          email: writeAdminContext.email,
          role: writeAdminContext.roleName,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Variant not found") {
          redirect(toRedirect("error", "variant_not_found"));
        }

        if (error.message === "Variant does not belong to product") {
          redirect(toRedirect("error", "variant_wrong_product"));
        }

        if (error.message === "SKU already exists") {
          redirect(toRedirect("error", "variant_sku_conflict"));
        }
      }

      redirect(toRedirect("error", "variant_update_failed"));
    }

    redirect(toRedirect("success", "variant_updated"));
  }

  async function deactivateVariantAction(formData: FormData) {
    "use server";

    const writeAdminContext = await requirePermission("products.write");

    if (!cuidSchema.safeParse(id).success) {
      redirect(toRedirect("error", "variant_invalid_id"));
    }

    const variantIdRaw = formData.get("variantId");
    const variantIdParsed = cuidSchema.safeParse(variantIdRaw);

    if (!variantIdParsed.success) {
      redirect(toRedirect("error", "variant_invalid_id"));
    }

    try {
      await deactivateVariant(id, variantIdParsed.data, {
        actor: {
          id: writeAdminContext.adminUserId,
          email: writeAdminContext.email,
          role: writeAdminContext.roleName,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Variant not found") {
          redirect(toRedirect("error", "variant_not_found"));
        }

        if (error.message === "Variant does not belong to product") {
          redirect(toRedirect("error", "variant_wrong_product"));
        }
      }

      redirect(toRedirect("error", "variant_deactivate_failed"));
    }

    redirect(toRedirect("success", "variant_deactivated"));
  }

  return (
    <div className="space-y-6">
      <Heading
        title={`Edit ${product.name}`}
        subtitle="Update the product record and keep the public site unchanged until you publish new content."
        alignment="left"
      />
      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}
      {errorMessage ? (
        <div className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted">
          {errorMessage}
        </div>
      ) : null}
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

      <section className="space-y-4 rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Variants</h2>
          <p className="text-sm text-muted">
            Manage variant records used by inventory, orders, and upcoming
            storefront catalog surfaces.
          </p>
        </div>

        {variants.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4 text-sm text-muted">
            No variants exist for this product yet.
          </div>
        ) : (
          <div className="space-y-3">
            {variants.map((variant) => (
              <details
                key={variant.id}
                className="rounded-xl border border-border bg-background p-4"
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {variant.name}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        SKU: {variant.sku}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full border border-border px-2.5 py-1 text-muted">
                        {variant.status}
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-1 text-muted">
                        {formatCurrency(variant.sellingPrice, product.currency)}
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-1 text-muted">
                        On hand {variant.quantityOnHand.toLocaleString("en-IN")}
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-1 text-muted">
                        Available{" "}
                        {variant.availableQuantity.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </summary>

                <form action={updateVariantAction} className="mt-4 space-y-4">
                  <input type="hidden" name="variantId" value={variant.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-muted">
                      <span className="text-foreground">Variant name</span>
                      <input
                        name="name"
                        required
                        defaultValue={variant.name}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-muted">
                      <span className="text-foreground">SKU</span>
                      <input
                        name="sku"
                        required
                        defaultValue={variant.sku}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-muted">
                      <span className="text-foreground">Price</span>
                      <input
                        type="number"
                        name="sellingPrice"
                        required
                        step="0.01"
                        min="0"
                        defaultValue={variant.sellingPrice}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-muted">
                      <span className="text-foreground">Compare-at price</span>
                      <input
                        type="number"
                        name="mrp"
                        required
                        step="0.01"
                        min="0"
                        defaultValue={variant.mrp}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-muted">
                      <span className="text-foreground">Net quantity</span>
                      <input
                        type="number"
                        name="netQuantity"
                        step="0.01"
                        min="0"
                        defaultValue={variant.netQuantity ?? ""}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-muted">
                      <span className="text-foreground">Unit</span>
                      <input
                        name="unit"
                        defaultValue={variant.unit ?? ""}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-muted">
                      <span className="text-foreground">Status</span>
                      <select
                        name="status"
                        defaultValue={variant.status}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="DISCONTINUED">DISCONTINUED</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-muted">
                      <span className="text-foreground">Default variant</span>
                      <input
                        type="checkbox"
                        name="isDefault"
                        defaultChecked={variant.isDefault}
                        className="mt-2 h-4 w-4 rounded border-border"
                      />
                    </label>
                  </div>

                  <div className="text-xs text-muted">
                    Reserved {variant.quantityReserved.toLocaleString("en-IN")}
                    {" · "}
                    Inventory locations{" "}
                    {variant.inventoryItemCount.toLocaleString("en-IN")}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                      type="submit"
                    >
                      Save variant
                    </button>
                  </div>
                </form>

                <form action={deactivateVariantAction} className="mt-3">
                  <input type="hidden" name="variantId" value={variant.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
                  >
                    Deactivate variant
                  </button>
                </form>
              </details>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-border bg-muted/10 p-4">
          <h3 className="text-sm font-medium text-foreground">Add variant</h3>
          <form action={createVariantAction} className="mt-3 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-muted">
                <span className="text-foreground">Variant name</span>
                <input
                  name="name"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>
              <label className="space-y-2 text-sm text-muted">
                <span className="text-foreground">SKU</span>
                <input
                  name="sku"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>
              <label className="space-y-2 text-sm text-muted">
                <span className="text-foreground">Price</span>
                <input
                  type="number"
                  name="sellingPrice"
                  required
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>
              <label className="space-y-2 text-sm text-muted">
                <span className="text-foreground">Compare-at price</span>
                <input
                  type="number"
                  name="mrp"
                  required
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>
              <label className="space-y-2 text-sm text-muted">
                <span className="text-foreground">Net quantity</span>
                <input
                  type="number"
                  name="netQuantity"
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>
              <label className="space-y-2 text-sm text-muted">
                <span className="text-foreground">Unit</span>
                <input
                  name="unit"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>
              <label className="space-y-2 text-sm text-muted">
                <span className="text-foreground">Status</span>
                <select
                  name="status"
                  defaultValue="ACTIVE"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="DISCONTINUED">DISCONTINUED</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-muted">
                <span className="text-foreground">Default variant</span>
                <input
                  type="checkbox"
                  name="isDefault"
                  className="mt-2 h-4 w-4 rounded border-border"
                />
              </label>
            </div>

            <button
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              type="submit"
            >
              Add variant
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

import { redirect, notFound } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
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

const inputClassName =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none";

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

type ProductEditValues = {
  name: string;
  slug: string;
  brand: string;
  shortDescription: string;
  longDescription: string;
  status: string;
  featured: boolean;
  currency: string;
  mrp: string;
  sellingPrice: string;
  seoTitle: string;
  seoDescription: string;
};

function HiddenProductFields({
  values,
  exclude,
}: {
  values: ProductEditValues;
  exclude: Array<keyof ProductEditValues>;
}) {
  const skip = new Set(exclude);

  return (
    <>
      {(Object.keys(values) as Array<keyof ProductEditValues>)
        .filter((key) => key !== "featured" && !skip.has(key))
        .map((key) => (
          <input key={key} type="hidden" name={key} value={values[key]} />
        ))}
      {!skip.has("featured") && values.featured ? (
        <input type="hidden" name="featured" value="on" />
      ) : null}
    </>
  );
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

  const [media, productExtras] = await Promise.all([
    prisma.productMedia.findMany({
      where: { productId: id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findUnique({
      where: { id },
      select: {
        seoTitle: true,
        seoDescription: true,
        passport: {
          select: {
            altitude: true,
            region: true,
          },
        },
      },
    }),
  ]);

  const editValues: ProductEditValues = {
    name: product.name,
    slug: product.slug,
    brand: product.brand ?? "",
    shortDescription: product.shortDescription ?? "",
    longDescription: product.longDescription ?? "",
    status: product.status,
    featured: product.featured,
    currency: product.currency,
    mrp: product.mrp?.toString() ?? "",
    sellingPrice: product.sellingPrice?.toString() ?? "",
    seoTitle: productExtras?.seoTitle ?? "",
    seoDescription: productExtras?.seoDescription ?? "",
  };

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

  async function addImageAction(formData: FormData) {
    "use server";

    await requirePermission("products.write");

    const url = formData.get("url") as string;
    const alt = formData.get("alt") as string;

    if (!url?.trim()) return;

    const existingCount = await prisma.productMedia.count({
      where: { productId: id },
    });

    await prisma.productMedia.create({
      data: {
        productId: id,
        type: "image",
        url: url.trim(),
        alt: alt?.trim() || null,
        sortOrder: existingCount,
      },
    });

    redirect(`/admin/products/${id}`);
  }

  async function createVariantAction(formData: FormData) {
    "use server";

    const writeAdminContext = await requirePermission("products.write");

    if (!cuidSchema.safeParse(id).success) {
      redirect(`/admin/products/${id}?error=variant_invalid_id`);
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
      redirect(`/admin/products/${id}?error=variant_validation_failed`);
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
          redirect(`/admin/products/${id}?error=variant_not_found`);
        }

        if (error.message === "SKU already exists") {
          redirect(`/admin/products/${id}?error=variant_sku_conflict`);
        }
      }

      redirect(`/admin/products/${id}?error=variant_create_failed`);
    }

    redirect(`/admin/products/${id}?success=variant_created`);
  }

  async function updateVariantAction(formData: FormData) {
    "use server";

    const writeAdminContext = await requirePermission("products.write");

    if (!cuidSchema.safeParse(id).success) {
      redirect(`/admin/products/${id}?error=variant_invalid_id`);
    }

    const variantIdRaw = formData.get("variantId");
    const variantIdParsed = cuidSchema.safeParse(variantIdRaw);

    if (!variantIdParsed.success) {
      redirect(`/admin/products/${id}?error=variant_invalid_id`);
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
      redirect(`/admin/products/${id}?error=variant_validation_failed`);
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
          redirect(`/admin/products/${id}?error=variant_not_found`);
        }

        if (error.message === "Variant does not belong to product") {
          redirect(`/admin/products/${id}?error=variant_wrong_product`);
        }

        if (error.message === "SKU already exists") {
          redirect(`/admin/products/${id}?error=variant_sku_conflict`);
        }
      }

      redirect(`/admin/products/${id}?error=variant_update_failed`);
    }

    redirect(`/admin/products/${id}?success=variant_updated`);
  }

  async function deactivateVariantAction(formData: FormData) {
    "use server";

    const writeAdminContext = await requirePermission("products.write");

    if (!cuidSchema.safeParse(id).success) {
      redirect(`/admin/products/${id}?error=variant_invalid_id`);
    }

    const variantIdRaw = formData.get("variantId");
    const variantIdParsed = cuidSchema.safeParse(variantIdRaw);

    if (!variantIdParsed.success) {
      redirect(`/admin/products/${id}?error=variant_invalid_id`);
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
          redirect(`/admin/products/${id}?error=variant_not_found`);
        }

        if (error.message === "Variant does not belong to product") {
          redirect(`/admin/products/${id}?error=variant_wrong_product`);
        }
      }

      redirect(`/admin/products/${id}?error=variant_deactivate_failed`);
    }

    redirect(`/admin/products/${id}?success=variant_deactivated`);
  }

  async function deleteImageAction(formData: FormData) {
    "use server";

    await requirePermission("products.write");

    const mediaId = formData.get("mediaId") as string;

    if (!mediaId) {
      return;
    }

    await prisma.productMedia.deleteMany({
      where: { id: mediaId, productId: id },
    });

    redirect(`/admin/products/${id}`);
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Heading
        title={`Edit ${product.name}`}
        subtitle="Update product details, images, and variants."
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

      <section className="space-y-4 rounded-2xl border border-border bg-background p-6">
        <h2 className="font-heading text-base font-semibold text-foreground">
          Basic Information
        </h2>

        <form action={updateProductAction} className="space-y-4">
          <HiddenProductFields
            values={editValues}
            exclude={["name", "slug", "brand", "status", "featured"]}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">Name</span>
              <input
                name="name"
                type="text"
                defaultValue={product.name}
                className={inputClassName}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">Slug</span>
              <input
                name="slug"
                type="text"
                defaultValue={product.slug}
                className={inputClassName}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">Brand</span>
              <input
                name="brand"
                type="text"
                defaultValue={product.brand ?? ""}
                className={inputClassName}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                Category
              </span>
              <input
                name="category"
                type="text"
                defaultValue={product.category?.name ?? ""}
                placeholder="e.g. honey, ghee, shilajit"
                className={inputClassName}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                Status
              </span>
              <select
                name="status"
                defaultValue={product.status}
                className={inputClassName}
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="COMING_SOON">Coming soon</option>
                <option value="SEASONAL">Seasonal</option>
                <option value="SOLD_OUT">Sold out</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                Valley / Origin
              </span>
              <select
                name="primaryOriginText"
                defaultValue={
                  productExtras?.passport?.region ??
                  product.primaryOrigin?.name ??
                  ""
                }
                className={inputClassName}
              >
                <option value="">Select Valley</option>
                <option value="Lahaul Valley, Himachal Pradesh">
                  Lahaul Valley, Himachal Pradesh
                </option>
                <option value="Kullu Valley, Himachal Pradesh">
                  Kullu Valley, Himachal Pradesh
                </option>
                <option value="Nubra Valley, Ladakh">
                  Nubra Valley, Ladakh
                </option>
                <option value="Zanskar Valley, Ladakh">
                  Zanskar Valley, Ladakh
                </option>
                <option value="Changthang Plateau, Ladakh">
                  Changthang Plateau, Ladakh
                </option>
                <option value="Spiti Valley, Himachal Pradesh">
                  Spiti Valley, Himachal Pradesh
                </option>
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                Altitude
              </span>
              <input
                name="altitude"
                type="text"
                defaultValue={productExtras?.passport?.altitude ?? ""}
                placeholder="e.g. 3,050m above sea level"
                className={inputClassName}
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              name="featured"
              type="checkbox"
              id="featured"
              defaultChecked={product.featured}
              className="rounded border-border"
            />
            <label htmlFor="featured" className="text-sm text-foreground">
              Featured product (shown on homepage)
            </label>
          </div>

          <Button type="submit">Save Changes</Button>
        </form>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-background p-6">
        <h2 className="font-heading text-base font-semibold text-foreground">
          Description
        </h2>

        <form action={updateProductAction} className="space-y-4">
          <HiddenProductFields
            values={editValues}
            exclude={["shortDescription", "longDescription"]}
          />

          <label className="block space-y-1">
            <span className="text-sm font-medium text-foreground">
              Short Description
            </span>
            <textarea
              name="shortDescription"
              rows={2}
              defaultValue={product.shortDescription ?? ""}
              className={`${inputClassName} resize-none`}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-foreground">
              Long Description
            </span>
            <textarea
              name="longDescription"
              rows={5}
              defaultValue={product.longDescription ?? ""}
              className={`${inputClassName} resize-none`}
            />
          </label>

          <Button type="submit">Save Changes</Button>
        </form>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-background p-6">
        <h2 className="font-heading text-base font-semibold text-foreground">
          Images
        </h2>

        {media.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {media.map((item) => (
              <div key={item.id} className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.alt ?? ""}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <form
                  action={deleteImageAction}
                  className="absolute -top-1.5 -right-1.5"
                >
                  <input type="hidden" name="mediaId" value={item.id} />
                  <button
                    type="submit"
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-xs text-muted hover:border-red-400 hover:text-red-500"
                    aria-label="Delete image"
                  >
                    ×
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted">No images yet.</p>
        )}

        <form
          action={addImageAction}
          className="space-y-3 border-t border-border pt-4"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                Image URL
              </span>
              <input
                name="url"
                type="text"
                required
                placeholder="https://res.cloudinary.com/..."
                className={inputClassName}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                Alt text
              </span>
              <input
                name="alt"
                type="text"
                placeholder="Product image description"
                className={inputClassName}
              />
            </label>
          </div>
          <Button type="submit">Add Image</Button>
        </form>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-background p-6">
        <h2 className="font-heading text-base font-semibold text-foreground">
          Variants
        </h2>

        {variants.length === 0 ? (
          <p className="text-xs text-muted">
            No variants exist for this product yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="py-2 pr-3 font-medium">Label</th>
                  <th className="py-2 pr-3 font-medium">Price</th>
                  <th className="py-2 pr-3 font-medium">MRP</th>
                  <th className="py-2 pr-3 font-medium">Qty</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Default</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant) => (
                  <tr
                    key={variant.id}
                    className="border-b border-border align-top"
                  >
                    <td className="py-3 pr-3 text-foreground">
                      {variant.name}
                    </td>
                    <td className="py-3 pr-3 text-foreground">
                      {formatCurrency(variant.sellingPrice, product.currency)}
                    </td>
                    <td className="py-3 pr-3 text-foreground">
                      {formatCurrency(variant.mrp, product.currency)}
                    </td>
                    <td className="py-3 pr-3 text-foreground">
                      {variant.netQuantity != null
                        ? `${variant.netQuantity}${variant.unit ? ` ${variant.unit}` : ""}`
                        : "—"}
                    </td>
                    <td className="py-3 pr-3 text-muted">{variant.status}</td>
                    <td className="py-3 pr-3 text-muted">
                      {variant.isDefault ? "Yes" : "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-col gap-2">
                        <details>
                          <summary className="cursor-pointer text-xs text-gold hover:underline">
                            Edit
                          </summary>
                          <form
                            action={updateVariantAction}
                            className="mt-3 space-y-3 rounded-xl border border-border bg-surface p-3"
                          >
                            <input
                              type="hidden"
                              name="variantId"
                              value={variant.id}
                            />
                            <div className="grid gap-3 md:grid-cols-3">
                              <label className="block space-y-1">
                                <span className="text-xs font-medium text-foreground">
                                  Label
                                </span>
                                <input
                                  name="name"
                                  required
                                  defaultValue={variant.name}
                                  className={inputClassName}
                                />
                              </label>
                              <label className="block space-y-1">
                                <span className="text-xs font-medium text-foreground">
                                  SKU
                                </span>
                                <input
                                  name="sku"
                                  required
                                  defaultValue={variant.sku}
                                  className={inputClassName}
                                />
                              </label>
                              <label className="block space-y-1">
                                <span className="text-xs font-medium text-foreground">
                                  Price
                                </span>
                                <input
                                  type="number"
                                  name="sellingPrice"
                                  required
                                  step="0.01"
                                  min="0"
                                  defaultValue={variant.sellingPrice}
                                  className={inputClassName}
                                />
                              </label>
                              <label className="block space-y-1">
                                <span className="text-xs font-medium text-foreground">
                                  MRP
                                </span>
                                <input
                                  type="number"
                                  name="mrp"
                                  required
                                  step="0.01"
                                  min="0"
                                  defaultValue={variant.mrp}
                                  className={inputClassName}
                                />
                              </label>
                              <label className="block space-y-1">
                                <span className="text-xs font-medium text-foreground">
                                  Qty
                                </span>
                                <input
                                  type="number"
                                  name="netQuantity"
                                  step="0.01"
                                  min="0"
                                  defaultValue={variant.netQuantity ?? ""}
                                  className={inputClassName}
                                />
                              </label>
                              <label className="block space-y-1">
                                <span className="text-xs font-medium text-foreground">
                                  Unit
                                </span>
                                <input
                                  name="unit"
                                  defaultValue={variant.unit ?? ""}
                                  className={inputClassName}
                                />
                              </label>
                              <label className="block space-y-1">
                                <span className="text-xs font-medium text-foreground">
                                  Status
                                </span>
                                <select
                                  name="status"
                                  defaultValue={variant.status}
                                  className={inputClassName}
                                >
                                  <option value="ACTIVE">ACTIVE</option>
                                  <option value="INACTIVE">INACTIVE</option>
                                  <option value="DISCONTINUED">
                                    DISCONTINUED
                                  </option>
                                </select>
                              </label>
                              <label className="flex items-center gap-2 pt-5 text-sm text-foreground">
                                <input
                                  type="checkbox"
                                  name="isDefault"
                                  defaultChecked={variant.isDefault}
                                  className="rounded border-border"
                                />
                                Default
                              </label>
                            </div>
                            <Button type="submit">Save variant</Button>
                          </form>
                        </details>
                        <form action={deactivateVariantAction}>
                          <input
                            type="hidden"
                            name="variantId"
                            value={variant.id}
                          />
                          <button
                            type="submit"
                            className="text-xs text-muted hover:text-red-500"
                          >
                            Deactivate
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form
          action={createVariantAction}
          className="space-y-4 border-t border-border pt-4"
        >
          <p className="text-xs text-muted">Add a new variant</p>
          <input type="hidden" name="status" value="ACTIVE" />
          <div className="grid gap-3 md:grid-cols-6">
            <label className="block space-y-1 md:col-span-2">
              <span className="text-xs font-medium text-foreground">
                Label *
              </span>
              <input
                name="name"
                type="text"
                required
                placeholder="e.g. 250g, 500ml, 1kg"
                className={inputClassName}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-foreground">SKU</span>
              <input
                name="sku"
                type="text"
                required
                placeholder="TOR-HNY-250"
                className={inputClassName}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-foreground">
                Price *
              </span>
              <input
                name="sellingPrice"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                className={inputClassName}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-foreground">MRP</span>
              <input
                name="mrp"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                className={inputClassName}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-foreground">
                Qty & Unit
              </span>
              <div className="flex gap-1">
                <input
                  name="netQuantity"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="250"
                  className="w-16 rounded-lg border border-border bg-background px-2 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                />
                <input
                  name="unit"
                  type="text"
                  placeholder="g"
                  className="flex-1 rounded-lg border border-border bg-background px-2 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                />
              </div>
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="isDefault"
              className="rounded border-border"
            />
            Default variant
          </label>
          <Button type="submit">Add Variant</Button>
        </form>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-background p-6">
        <h2 className="font-heading text-base font-semibold text-foreground">
          SEO
        </h2>

        <form action={updateProductAction} className="space-y-4">
          <HiddenProductFields
            values={editValues}
            exclude={["seoTitle", "seoDescription"]}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                SEO Title
              </span>
              <input
                name="seoTitle"
                type="text"
                defaultValue={editValues.seoTitle}
                className={inputClassName}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                SEO Description
              </span>
              <input
                name="seoDescription"
                type="text"
                defaultValue={editValues.seoDescription}
                className={inputClassName}
              />
            </label>
          </div>

          <Button type="submit">Save Changes</Button>
        </form>
      </section>
    </div>
  );
}

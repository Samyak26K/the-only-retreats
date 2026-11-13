import { redirect } from "next/navigation";
import Link from "next/link";

import { AdminAccessRequired } from "@/components/admin/AdminAccessRequired";
import {
  AdminForm,
  SubmitButton,
  type AdminFormState,
} from "@/components/admin/AdminForm";
import { VariantFields } from "@/components/admin/VariantFields";
import { Heading } from "@/components/ui/Heading";
import { requirePermission } from "@/lib/server/auth";
import {
  formText,
  getDefaultInventoryLocationId,
  revalidateProductPages,
  slugify,
  toAdminErrorMessage,
  upsertCategoryByName,
  validateImageUrl,
} from "@/lib/server/product-admin";
import {
  createProductWithDetails,
  type NewProductDetails,
} from "@/lib/services/products";
import { productCreateSchema } from "@/lib/validation/service-schemas";

const INITIAL_VARIANT_STOCK = 50;

function readVariants(
  formData: FormData,
  productSlug: string,
): NewProductDetails["variants"] | string {
  const indices = Array.from(
    new Set(
      Array.from(formData.keys())
        .map((key) => /^variant_(\d+)_label$/.exec(key)?.[1])
        .filter((index): index is string => index !== undefined),
    ),
  );

  const variants: NewProductDetails["variants"] = [];
  for (const i of indices) {
    const name = formText(formData, `variant_${i}_label`);
    const priceText = formText(formData, `variant_${i}_price`);
    if (!name || !priceText) {
      continue;
    }

    const sellingPrice = Number(priceText);
    const mrpText = formText(formData, `variant_${i}_mrp`);
    const mrp = mrpText ? Number(mrpText) : sellingPrice;
    const qtyText = formText(formData, `variant_${i}_qty`);
    const netQuantity = qtyText ? Number(qtyText) : null;

    if (
      !Number.isFinite(sellingPrice) ||
      sellingPrice < 0 ||
      !Number.isFinite(mrp) ||
      mrp < 0 ||
      (netQuantity !== null && !Number.isFinite(netQuantity))
    ) {
      return `Variant "${name}" has an invalid price, MRP or quantity.`;
    }

    variants.push({
      name,
      sku:
        formText(formData, `variant_${i}_sku`) ??
        `${productSlug}-${slugify(name) || "variant"}-${i}`,
      sellingPrice,
      mrp,
      netQuantity,
      unit: formText(formData, `variant_${i}_unit`) ?? null,
      isDefault: formData.get(`variant_${i}_default`) === "on",
    });
  }

  const skus = variants.map((variant) => variant.sku.toLowerCase());
  if (new Set(skus).size !== skus.length) {
    return "Two variants share the same SKU. Each SKU must be unique.";
  }

  return variants;
}

export default async function NewProductPage() {
  const adminContext = await requirePermission("products.write").catch(
    () => null,
  );

  if (!adminContext) {
    return <AdminAccessRequired />;
  }

  async function createProductAction(
    _state: AdminFormState,
    formData: FormData,
  ): Promise<AdminFormState> {
    "use server";

    const writeAdminContext = await requirePermission("products.write").catch(
      () => null,
    );
    if (!writeAdminContext) {
      return { error: "You do not have permission to create products." };
    }

    const name = formText(formData, "name");
    if (!name) {
      return { error: "Product name is required." };
    }
    // Normalise whatever the admin typed ("Wild Honey 500g" -> "wild-honey-500g").
    const slug = slugify(formText(formData, "slug") ?? name);
    if (!slug) {
      return { error: "Could not build a URL slug from the name. Add a slug." };
    }

    const imageUrls: string[] = [];
    for (const key of ["heroImageUrl", "image2Url", "image3Url"]) {
      const raw = formText(formData, key);
      if (!raw) continue;
      const url = validateImageUrl(raw);
      if (!url) {
        return {
          error: `Image URL "${raw}" must be an https://res.cloudinary.com/... link.`,
        };
      }
      imageUrls.push(url);
    }

    const variants = readVariants(formData, slug);
    if (typeof variants === "string") {
      return { error: variants };
    }

    let createdId: string;
    try {
      // Independent lookups run together; the product itself is one nested write.
      const [categoryId, inventoryLocationId] = await Promise.all([
        upsertCategoryByName(formText(formData, "category")),
        variants.length > 0 ? getDefaultInventoryLocationId() : "",
      ]);

      const parsed = productCreateSchema.parse({
        name,
        slug,
        brand: formText(formData, "brand"),
        categoryId,
        shortDescription: formText(formData, "shortDescription"),
        longDescription: formText(formData, "longDescription"),
        status: formText(formData, "status"),
        featured: formData.get("featured") === "on",
        currency: formText(formData, "currency") ?? "INR",
        mrp: formText(formData, "mrp"),
        sellingPrice: formText(formData, "sellingPrice"),
        seoTitle: formText(formData, "seoTitle"),
        seoDescription: formText(formData, "seoDescription"),
      });

      const altitude = formText(formData, "altitude");
      const region = formText(formData, "primaryOriginText");

      const created = await createProductWithDetails(
        parsed,
        {
          passport: altitude || region ? { altitude, region } : undefined,
          imageUrls,
          variants,
          inventoryLocationId,
          initialStock: INITIAL_VARIANT_STOCK,
        },
        {
          actor: {
            id: writeAdminContext.adminUserId,
            email: writeAdminContext.email,
            role: writeAdminContext.roleName,
          },
        },
      );
      createdId = created.id;
    } catch (error) {
      return { error: toAdminErrorMessage(error) };
    }

    revalidateProductPages();
    redirect(`/admin/products/${createdId}?success=product_created`);
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Heading
        title="Create product"
        subtitle="Fill in the details below. Variants and images can be added here."
        alignment="left"
      />

      <AdminForm action={createProductAction} className="space-y-8">
        <section className="space-y-4 rounded-2xl border border-border bg-background p-6">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Basic Information
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                Product Name *
              </span>
              <input
                name="name"
                type="text"
                required
                placeholder="e.g. Himalayan Wild Forest Honey"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                Slug (auto-generated if empty)
              </span>
              <input
                name="slug"
                type="text"
                placeholder="e.g. himalayan-wild-forest-honey"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">Brand</span>
              <select
                name="brand"
                defaultValue=""
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
              >
                <option value="">Select brand</option>
                <option value="Himalayan">Himalayan (TOR Food)</option>
                <option value="Dhatu">Dhatu (Roots and Ore)</option>
                <option value="Divya">Divya (Spirituality)</option>
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                Category
              </span>
              <input
                name="category"
                type="text"
                placeholder="e.g. honey, ghee, shilajit"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                Status
              </span>
              <select
                name="status"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="SEASONAL">Seasonal</option>
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
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
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
                placeholder="e.g. 3,050m above sea level"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              name="featured"
              type="checkbox"
              id="featured"
              className="rounded border-border"
            />
            <label htmlFor="featured" className="text-sm text-foreground">
              Featured product (shown on homepage)
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-background p-6">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Base Pricing
          </h2>
          <p className="text-xs text-muted">
            Set a base price here. You can override per variant below.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">MRP</span>
              <input
                name="mrp"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                Selling Price
              </span>
              <input
                name="sellingPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                Currency
              </span>
              <input
                name="currency"
                type="text"
                defaultValue="INR"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-background p-6">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Description
          </h2>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-foreground">
              Short Description
            </span>
            <textarea
              name="shortDescription"
              rows={2}
              placeholder="1-2 sentences about the product"
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-foreground">
              Long Description
            </span>
            <textarea
              name="longDescription"
              rows={5}
              placeholder="Full product description, story, usage..."
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
            />
          </label>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-background p-6">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Variants
          </h2>
          <p className="text-xs text-muted">
            Add size/weight variants. Each variant gets its own price and 50
            units of inventory automatically.
          </p>

          <VariantFields />
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-background p-6">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Product Images
          </h2>
          <p className="text-xs text-muted">
            Upload images to Cloudinary and paste the URLs here.
          </p>
          <div className="space-y-3">
            {[
              "Hero Image URL",
              "Image 2 URL (optional)",
              "Image 3 URL (optional)",
            ].map((label, i) => (
              <label key={i} className="block space-y-1">
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
                <input
                  name={i === 0 ? "heroImageUrl" : `image${i + 1}Url`}
                  type="text"
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-background p-6">
          <h2 className="font-heading text-base font-semibold text-foreground">
            SEO (optional)
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                SEO Title
              </span>
              <input
                name="seoTitle"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                SEO Description
              </span>
              <input
                name="seoDescription"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
              />
            </label>
          </div>
        </section>

        <div className="flex gap-3 pb-8">
          <SubmitButton className="px-8" pendingLabel="Creating product…">
            Save Product
          </SubmitButton>
          <Link
            href="/admin/products"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Cancel
          </Link>
        </div>
      </AdminForm>
    </div>
  );
}

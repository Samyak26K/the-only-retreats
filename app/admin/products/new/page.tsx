import { redirect } from "next/navigation";
import Link from "next/link";

import { AdminAccessRequired } from "@/components/admin/AdminAccessRequired";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/server/auth";
import { createProduct } from "@/lib/services/products";
import { productCreateSchema } from "@/lib/validation/service-schemas";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function NewProductPage() {
  const adminContext = await requirePermission("products.write").catch(
    () => null,
  );

  if (!adminContext) {
    return <AdminAccessRequired />;
  }

  async function createProductAction(formData: FormData) {
    "use server";

    if (!adminContext) {
      throw new Error("Unauthorized");
    }

    const categoryInput = ((formData.get("category") as string) ?? "").trim();
    let categoryId: string | undefined;

    if (categoryInput) {
      const categorySlug = slugify(categoryInput);

      if (categorySlug) {
        const categoryRecord = await prisma.category.upsert({
          where: { slug: categorySlug },
          update: { name: categoryInput },
          create: { name: categoryInput, slug: categorySlug },
        });
        categoryId = categoryRecord.id;
      }
    }

    const raw = {
      name: formData.get("name"),
      slug: formData.get("slug") || undefined,
      brand: formData.get("brand") || undefined,
      categoryId,
      shortDescription: formData.get("shortDescription") || undefined,
      longDescription: formData.get("longDescription") || undefined,
      status: formData.get("status"),
      featured: formData.get("featured") === "on",
      currency: formData.get("currency") || "INR",
      mrp: formData.get("mrp") || undefined,
      sellingPrice: formData.get("sellingPrice") || undefined,
      seoTitle: formData.get("seoTitle") || undefined,
      seoDescription: formData.get("seoDescription") || undefined,
    };

    const parsed = productCreateSchema.safeParse(raw);

    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.flatten());
      throw new Error(
        "Validation failed: " + JSON.stringify(parsed.error.flatten()),
      );
    }

    const primaryOriginText = formData.get("primaryOriginText") as string;
    const altitude = formData.get("altitude") as string;

    const createdProduct = await createProduct(parsed.data, {
      actor: {
        id: adminContext.adminUserId,
        email: adminContext.email,
        role: adminContext.roleName,
      },
    });

    if (altitude || primaryOriginText) {
      await prisma.productPassport.upsert({
        where: { productId: createdProduct.id },
        update: {
          altitude: altitude || undefined,
          region: primaryOriginText || undefined,
        },
        create: {
          productId: createdProduct.id,
          altitude: altitude || "",
          region: primaryOriginText || "",
        },
      });
    }

    const imageUrls = [
      formData.get("heroImageUrl"),
      formData.get("image2Url"),
      formData.get("image3Url"),
    ].filter(
      (url): url is string => typeof url === "string" && url.trim().length > 0,
    );

    if (imageUrls.length > 0) {
      await prisma.productMedia.createMany({
        data: imageUrls.map((url, index) => ({
          productId: createdProduct.id,
          type: "image",
          url: url.trim(),
          alt: parsed.data.name,
          sortOrder: index,
        })),
      });
    }

    const variantIndices = Array.from(
      new Set(
        Array.from(formData.keys())
          .map((key) => {
            const match = /^variant_(\d+)_label$/.exec(key);
            return match ? Number(match[1]) : null;
          })
          .filter((index): index is number => index !== null),
      ),
    );

    for (const i of variantIndices) {
      const variantLabel = (
        (formData.get(`variant_${i}_label`) as string) ?? ""
      ).trim();
      const variantSku = (
        (formData.get(`variant_${i}_sku`) as string) ?? ""
      ).trim();
      const variantPrice = formData.get(`variant_${i}_price`) as string;
      const variantMrp = formData.get(`variant_${i}_mrp`) as string;
      const variantQty = formData.get(`variant_${i}_qty`) as string;
      const variantUnit = (
        (formData.get(`variant_${i}_unit`) as string) ?? ""
      ).trim();
      const isDefault = formData.get(`variant_${i}_default`) === "on";

      if (!variantLabel || !variantPrice) {
        continue;
      }

      const sellingPrice = parseFloat(variantPrice);
      const mrp = variantMrp ? parseFloat(variantMrp) : sellingPrice;

      const createdVariant = await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          name: variantLabel,
          sku:
            variantSku ||
            `${createdProduct.slug}-${slugify(variantLabel) || "variant"}-${i}`,
          sellingPrice,
          mrp,
          netQuantity: variantQty ? parseFloat(variantQty) : null,
          unit: variantUnit || null,
          isDefault,
          status: "ACTIVE",
        },
      });

      const location =
        (await prisma.inventoryLocation.findFirst({
          where: { isActive: true },
        })) ??
        (await prisma.inventoryLocation.create({
          data: {
            name: "Main Warehouse",
            type: "warehouse",
            isActive: true,
          },
        }));

      await prisma.inventoryItem.upsert({
        where: {
          productVariantId_inventoryLocationId: {
            productVariantId: createdVariant.id,
            inventoryLocationId: location.id,
          },
        },
        update: {},
        create: {
          productVariantId: createdVariant.id,
          inventoryLocationId: location.id,
          quantityOnHand: 50,
          quantityReserved: 0,
          status: "ACTIVE",
        },
      });
    }

    redirect("/admin/products");
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Heading
        title="Create product"
        subtitle="Fill in the details below. Variants and images can be added here."
        alignment="left"
      />

      <form action={createProductAction} className="space-y-8">
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
              <input
                name="brand"
                type="text"
                defaultValue="The Only Retreats"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
              />
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

          <div id="variants-container" className="space-y-4" />

          <input
            type="hidden"
            name="variantCount"
            id="variantCount"
            value="0"
          />

          <button
            type="button"
            id="addVariant"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-gold hover:text-foreground"
          >
            + Add Variant
          </button>

          <script
            dangerouslySetInnerHTML={{
              __html: `
            let count = 0;
            document.getElementById('addVariant').addEventListener('click', function() {
              const container = document.getElementById('variants-container');
              const row = document.createElement('div');
              row.className = 'grid gap-3 md:grid-cols-6 p-4 rounded-xl border border-border bg-surface relative';
              row.innerHTML = \`
                <label class="space-y-1 md:col-span-2">
                  <span class="text-xs font-medium text-foreground">Label *</span>
                  <input name="variant_\${count}_label" type="text"
                    placeholder="e.g. 250g, 500ml, 1kg" required
                    class="w-full rounded-lg border border-border bg-background
                    px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                </label>
                <label class="space-y-1">
                  <span class="text-xs font-medium text-foreground">SKU</span>
                  <input name="variant_\${count}_sku" type="text"
                    placeholder="TOR-HNY-250"
                    class="w-full rounded-lg border border-border bg-background
                    px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                </label>
                <label class="space-y-1">
                  <span class="text-xs font-medium text-foreground">Price *</span>
                  <input name="variant_\${count}_price" type="number" step="0.01"
                    placeholder="0.00" required
                    class="w-full rounded-lg border border-border bg-background
                    px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                </label>
                <label class="space-y-1">
                  <span class="text-xs font-medium text-foreground">MRP</span>
                  <input name="variant_\${count}_mrp" type="number" step="0.01"
                    placeholder="0.00"
                    class="w-full rounded-lg border border-border bg-background
                    px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                </label>
                <label class="space-y-1">
                  <span class="text-xs font-medium text-foreground">Qty & Unit</span>
                  <div class="flex gap-1">
                    <input name="variant_\${count}_qty" type="number"
                      placeholder="250"
                      class="w-16 rounded-lg border border-border bg-background
                      px-2 py-2 text-sm focus:outline-none focus:border-gold" />
                    <input name="variant_\${count}_unit" type="text"
                      placeholder="g"
                      class="flex-1 rounded-lg border border-border bg-background
                      px-2 py-2 text-sm focus:outline-none focus:border-gold" />
                  </div>
                </label>
                <div class="md:col-span-6 flex items-center justify-between">
                  <label class="flex items-center gap-2 text-sm text-foreground">
                    <input name="variant_\${count}_default" type="checkbox" />
                    Default variant
                  </label>
                  <button type="button" onclick="this.closest('div.grid').remove();
                    document.getElementById('variantCount').value =
                    document.getElementById('variants-container').children.length;"
                    class="text-xs text-muted hover:text-red-500 transition-colors">
                    Remove
                  </button>
                </div>
              \`;
              container.appendChild(row);
              count++;
              document.getElementById('variantCount').value = count;
            });
          `,
            }}
          />
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
          <Button type="submit" className="px-8">
            Save Product
          </Button>
          <Link
            href="/admin/products"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

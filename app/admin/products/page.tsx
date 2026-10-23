import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminAccessRequired } from "@/components/admin/AdminAccessRequired";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/server/auth";
import { listProducts } from "@/lib/services/products";

export const revalidate = 30;

export default async function AdminProductsPage() {
  async function deleteProductAction(formData: FormData) {
    "use server";

    const adminContext = await requirePermission("products.write");
    if (!adminContext) throw new Error("Unauthorized");

    const productId = formData.get("productId");
    if (typeof productId !== "string" || !productId) return;

    await prisma.productMedia.deleteMany({ where: { productId } });
    await prisma.productPassport.deleteMany({ where: { productId } });

    const variants = await prisma.productVariant.findMany({
      where: { productId },
      select: { id: true },
    });

    for (const variant of variants) {
      await prisma.inventoryItem.deleteMany({
        where: { productVariantId: variant.id },
      });
      await prisma.orderItem.deleteMany({
        where: { productVariantId: variant.id },
      });
    }

    await prisma.productVariant.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });

    redirect("/admin/products");
  }

  const adminContext = await requirePermission("products.read").catch(
    () => null,
  );

  if (!adminContext) {
    return <AdminAccessRequired />;
  }

  let products: Awaited<ReturnType<typeof listProducts>> = [];
  let error: string | null = null;

  try {
    products = await listProducts();
  } catch {
    error = "Unable to load products right now.";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Heading
          title="Products"
          subtitle="Manage catalog products and their availability without changing the public storefront experience."
          alignment="left"
        />
        <Button render={<Link href="/admin/products/new" />}>
          Create product
        </Button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="border-b border-border p-4">
          <p className="text-sm text-muted">Product catalog</p>
        </div>
        {products.length === 0 ? (
          <div className="p-8 text-sm text-muted">No products yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/20 text-left text-xs uppercase tracking-[0.24em] text-muted">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Variants</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Origin</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {products.map((product) => (
                  <tr key={product.id} className="align-top">
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-muted">{product.slug}</p>
                    </td>
                    <td className="px-4 py-4 text-muted">
                      <p className="text-foreground">
                        {product.variants.length.toLocaleString("en-IN")}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {product.variants.length === 0
                          ? "No variants"
                          : product.variants
                              .slice(0, 2)
                              .map(
                                (variant) =>
                                  `${variant.name} (${variant.status})`,
                              )
                              .join(", ")}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {product.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {product.primaryOrigin?.name ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-muted">{product.status}</td>
                    <td className="px-4 py-4 text-muted">
                      {product.featured ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {new Date(product.updatedAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-xs text-foreground hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={deleteProductAction}>
                          <input
                            type="hidden"
                            name="productId"
                            value={product.id}
                          />
                          <button
                            type="submit"
                            className="text-xs text-red-500 hover:underline"
                          >
                            Delete
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
      </div>
    </div>
  );
}

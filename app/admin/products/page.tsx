import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { requirePermission } from "@/lib/server/auth";
import { listProducts } from "@/lib/services/products";

export default async function AdminProductsPage() {
  const adminContext = await requirePermission("products.read").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
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
        <Link href="/admin/products/new">
          <Button>Create product</Button>
        </Link>
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
          <div className="p-8 text-sm text-muted">
            No products are available yet. Connect the database and seed the
            catalog to start managing records.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/20 text-left text-xs uppercase tracking-[0.24em] text-muted">
                <tr>
                  <th className="px-4 py-3">Product</th>
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
                      {product.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {product.primaryOrigin?.name ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-muted">{product.status}</td>
                    <td className="px-4 py-4 text-muted">
                      {product.featured ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-4 text-muted">—</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
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

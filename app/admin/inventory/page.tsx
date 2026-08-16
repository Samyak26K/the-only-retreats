import Link from "next/link";
import { redirect } from "next/navigation";
import { Fragment } from "react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/server/auth";
import {
  adjustInventory,
  getInventory,
  getInventoryMovements,
} from "@/lib/services/inventory";
import { inventoryAdjustmentSchema } from "@/lib/validation/service-schemas";

type InventoryPageProps = {
  searchParams?: Promise<{
    q?: string;
    stock?: string;
    location?: string;
  }>;
};

export default async function AdminInventoryPage({
  searchParams,
}: InventoryPageProps) {
  const adminContext = await requirePermission("inventory.read").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  const currentAdminContext = adminContext;

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query =
    typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const stockFilter =
    typeof resolvedSearchParams.stock === "string"
      ? resolvedSearchParams.stock
      : "";
  const locationFilter =
    typeof resolvedSearchParams.location === "string"
      ? resolvedSearchParams.location
      : "";

  const canWriteInventory =
    currentAdminContext.permissions.includes("inventory.write");

  async function adjustInventoryAction(formData: FormData) {
    "use server";

    await requirePermission("inventory.write");

    const raw = {
      inventoryItemId: formData.get("inventoryItemId"),
      quantityDelta: Number(formData.get("quantityDelta")),
      movementType: formData.get("movementType") || "ADJUSTMENT",
      referenceType: formData.get("referenceType") || "MANUAL_ADJUSTMENT",
      referenceId: formData.get("referenceId") || undefined,
      reason: formData.get("reason") || "Manual stock adjustment",
      notes: formData.get("notes") || undefined,
    };

    const parsed = inventoryAdjustmentSchema.safeParse(raw);

    if (!parsed.success) {
      throw new Error("Invalid inventory adjustment.");
    }

    await adjustInventory(parsed.data, {
      actor: {
        id: currentAdminContext.adminUserId,
        email: currentAdminContext.email,
        role: currentAdminContext.roleName,
      },
    });

    redirect("/admin/inventory");
  }

  let inventory: Awaited<ReturnType<typeof getInventory>> = [];
  let locations: Awaited<ReturnType<typeof prisma.inventoryLocation.findMany>> =
    [];
  let error: string | null = null;

  try {
    const [inventoryItems, locationOptions] = await Promise.all([
      getInventory({
        q: query,
        stockStatus:
          stockFilter === "healthy" ||
          stockFilter === "low-stock" ||
          stockFilter === "out-of-stock"
            ? stockFilter
            : "",
        locationId: locationFilter || undefined,
      }),
      prisma.inventoryLocation.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
    ]);

    inventory = inventoryItems;
    locations = locationOptions;
  } catch {
    error = "Unable to load inventory right now.";
  }

  const movementMap = new Map<
    string,
    Awaited<ReturnType<typeof getInventoryMovements>>
  >();

  if (inventory.length > 0) {
    const movementResults = await Promise.all(
      inventory.map(
        async (item) =>
          [item.id, await getInventoryMovements(item.id)] as const,
      ),
    );

    for (const [inventoryItemId, movements] of movementResults) {
      movementMap.set(inventoryItemId, movements);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Heading
          title="Inventory"
          subtitle="Monitor stock across locations, track availability, and record operational adjustments safely."
          alignment="left"
        />
      </div>

      <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <form
            id="inventory-filter-form"
            className="grid w-full gap-3 md:grid-cols-[1.5fr_0.8fr_0.8fr] lg:max-w-3xl"
            method="GET"
            action="/admin/inventory"
          >
            <label className="space-y-2 text-sm text-muted">
              <span className="text-foreground">Search</span>
              <input
                name="q"
                defaultValue={query}
                placeholder="Product, variant, SKU, location"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>

            <label className="space-y-2 text-sm text-muted">
              <span className="text-foreground">Status</span>
              <select
                name="stock"
                defaultValue={stockFilter}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="">All stock</option>
                <option value="healthy">Healthy</option>
                <option value="low-stock">Low stock</option>
                <option value="out-of-stock">Out of stock</option>
              </select>
            </label>

            <label className="space-y-2 text-sm text-muted">
              <span className="text-foreground">Location</span>
              <select
                name="location"
                defaultValue={locationFilter}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="">All locations</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>
          </form>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" form="inventory-filter-form">
              Apply
            </Button>
            <Button
              variant="outline"
              type="button"
              render={<Link href="/admin/inventory" />}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        {inventory.length === 0 ? (
          <div className="p-8 text-sm text-muted">
            No inventory records match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/20 text-left text-xs uppercase tracking-[0.24em] text-muted">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Variant</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">On hand</th>
                  <th className="px-4 py-3">Reserved</th>
                  <th className="px-4 py-3">Available</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {inventory.map((item) => {
                  const stockStatusLabel =
                    item.stockStatus === "healthy"
                      ? "Healthy"
                      : item.stockStatus === "low-stock"
                        ? "Low stock"
                        : "Out of stock";

                  const stockClasses =
                    item.stockStatus === "healthy"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : item.stockStatus === "low-stock"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-rose-200 bg-rose-50 text-rose-700";

                  return (
                    <Fragment key={item.id}>
                      <tr className="align-top">
                        <td className="px-4 py-4">
                          <p className="font-medium text-foreground">
                            {item.productName ?? "Unknown product"}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-muted">
                          <p className="font-medium text-foreground">
                            {item.variantName ?? "Unnamed variant"}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {item.variantSku ?? "No SKU"}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {item.locationName ?? "Unknown location"}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {item.quantityOnHand}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {item.quantityReserved}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {item.availableQuantity}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${stockClasses}`}
                          >
                            {stockStatusLabel}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {new Date(item.lastUpdated).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-4">
                          <details className="group">
                            <summary className="cursor-pointer list-none text-sm font-medium text-primary">
                              {canWriteInventory ? "Adjust" : "View details"}
                            </summary>
                            <div className="mt-3 space-y-3 rounded-xl border border-border bg-muted/20 p-3">
                              <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                                  Movement history
                                </p>
                                {movementMap.get(item.id)?.length ? (
                                  <div className="mt-2 space-y-2">
                                    {movementMap
                                      .get(item.id)
                                      ?.slice(0, 4)
                                      .map((movement) => (
                                        <div
                                          key={movement.id}
                                          className="rounded-lg border border-border bg-background p-2 text-xs text-muted"
                                        >
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="font-medium text-foreground">
                                              {movement.movementType}
                                            </span>
                                            <span
                                              className={
                                                movement.quantity >= 0
                                                  ? "text-emerald-600"
                                                  : "text-rose-600"
                                              }
                                            >
                                              {movement.quantity >= 0
                                                ? "+"
                                                : ""}
                                              {movement.quantity}
                                            </span>
                                          </div>
                                          <p className="mt-1">
                                            {movement.reason ??
                                              movement.notes ??
                                              "No reason provided"}
                                          </p>
                                          <p className="mt-1 text-[11px] text-muted">
                                            {new Date(
                                              movement.createdAt,
                                            ).toLocaleString("en-IN")}
                                          </p>
                                        </div>
                                      ))}
                                  </div>
                                ) : (
                                  <p className="mt-2 text-xs text-muted">
                                    No movement history yet.
                                  </p>
                                )}
                              </div>

                              {canWriteInventory ? (
                                <form
                                  action={adjustInventoryAction}
                                  className="space-y-3"
                                >
                                  <input
                                    type="hidden"
                                    name="inventoryItemId"
                                    value={item.id}
                                  />
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    <label className="space-y-1 text-xs text-muted">
                                      <span className="text-foreground">
                                        Adjustment
                                      </span>
                                      <input
                                        type="number"
                                        name="quantityDelta"
                                        min="-9999"
                                        max="9999"
                                        required
                                        defaultValue={1}
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                                      />
                                    </label>
                                    <label className="space-y-1 text-xs text-muted">
                                      <span className="text-foreground">
                                        Movement
                                      </span>
                                      <select
                                        name="movementType"
                                        defaultValue="ADJUSTMENT"
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                                      >
                                        <option value="ADJUSTMENT">
                                          Adjustment
                                        </option>
                                        <option value="PURCHASE">
                                          Purchase
                                        </option>
                                        <option value="PRODUCTION">
                                          Production
                                        </option>
                                        <option value="PACKING">Packing</option>
                                        <option value="SALE">Sale</option>
                                        <option value="RETURN">Return</option>
                                        <option value="DAMAGE">Damage</option>
                                        <option value="CANCELLATION">
                                          Cancellation
                                        </option>
                                      </select>
                                    </label>
                                  </div>

                                  <label className="block space-y-1 text-xs text-muted">
                                    <span className="text-foreground">
                                      Reason
                                    </span>
                                    <input
                                      name="reason"
                                      maxLength={200}
                                      placeholder="Cycle count, restock, damage..."
                                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                                    />
                                  </label>

                                  <label className="block space-y-1 text-xs text-muted">
                                    <span className="text-foreground">
                                      Note
                                    </span>
                                    <textarea
                                      name="notes"
                                      rows={2}
                                      maxLength={1000}
                                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                                    />
                                  </label>

                                  <div className="flex gap-2">
                                    <Button type="submit">
                                      Save adjustment
                                    </Button>
                                  </div>
                                </form>
                              ) : null}
                            </div>
                          </details>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

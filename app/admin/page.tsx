import { Heading } from "@/components/ui/Heading";
import { requireAdmin } from "@/lib/server/auth";
import { getInventory } from "@/lib/services/inventory";
import { listProducts } from "@/lib/services/products";
import { prisma } from "@/lib/prisma";

type DashboardSummary = {
  products: number;
  activeProducts: number;
  inventoryUnits: number;
  pendingOrders: number;
  revenue: number;
  customers: number;
};

const metricCards = [
  { label: "Total Products", key: "products" },
  { label: "Active Products", key: "activeProducts" },
  { label: "Inventory Units", key: "inventoryUnits" },
  { label: "Pending Orders", key: "pendingOrders" },
  { label: "Revenue", key: "revenue" },
  { label: "Customers", key: "customers" },
] as const;

export default async function AdminDashboardPage() {
  const adminContext = await requireAdmin().catch(() => null);

  if (!adminContext) {
    return null;
  }

  let summary: DashboardSummary | null = null;
  let error: string | null = null;

  try {
    const [products, inventoryItems, orderCount, customerCount, revenue] =
      await Promise.all([
        listProducts(),
        getInventory(),
        prisma.order.count().catch(() => 0),
        prisma.customer.count().catch(() => 0),
        prisma.order
          .aggregate({ _sum: { total: true } })
          .catch(() => ({ _sum: { total: null } })),
      ]);

    summary = {
      products: products.length,
      activeProducts: products.filter((product) => product.status === "ACTIVE")
        .length,
      inventoryUnits: inventoryItems.reduce(
        (sum, item) => sum + Number(item.quantityOnHand),
        0,
      ),
      pendingOrders: orderCount,
      revenue: revenue._sum.total ? Number(revenue._sum.total) : 0,
      customers: customerCount,
    };
  } catch {
    error = "Unable to load dashboard data from the database right now.";
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Heading
          title="Operations overview"
          subtitle="A restrained internal dashboard for catalog, inventory, and order visibility."
          alignment="left"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-sm text-muted">
          {error}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metricCards.map((card) => {
            const value = summary ? summary[card.key] : "—";
            return (
              <div
                key={card.label}
                className="rounded-2xl border border-border bg-background p-5 shadow-sm"
              >
                <p className="text-sm text-muted">{card.label}</p>
                <p className="mt-3 font-display text-3xl text-foreground">
                  {typeof value === "number"
                    ? card.key === "revenue"
                      ? `₹${value.toLocaleString("en-IN")}`
                      : value.toLocaleString("en-IN")
                    : value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground">
              Recent orders
            </h2>
            <p className="text-sm text-muted">Awaiting data</p>
          </div>
          <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-sm text-muted">
            Orders will appear here once the database is connected and orders
            exist.
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground">Low stock</h2>
            <p className="text-sm text-muted">Awaiting data</p>
          </div>
          <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-sm text-muted">
            Inventory thresholds will be surfaced here once the database is
            connected.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <h2 className="font-display text-xl text-foreground">
          Recent admin activity
        </h2>
        <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-sm text-muted">
          Admin audit events will appear here once mutations are recorded.
        </div>
      </div>
    </div>
  );
}

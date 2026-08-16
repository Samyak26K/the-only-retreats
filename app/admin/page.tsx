import { Suspense } from "react";

import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
import { getInventory } from "@/lib/services/inventory";
import { requireAdmin } from "@/lib/server/auth";

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

type RecentOrderListItem = {
  id: string;
  orderNumber: string;
  total: number;
  customer: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  } | null;
};

function formatCustomerLabel(
  customer: RecentOrderListItem["customer"],
): string {
  if (!customer) {
    return "Customer";
  }

  const fullName = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || customer.email || "Customer";
}

function RecentOrdersCardFallback() {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-foreground">Recent orders</h2>
        <p className="text-sm text-muted">Loading...</p>
      </div>
      <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-sm text-muted">
        Loading...
      </div>
    </div>
  );
}

function LowStockCardFallback() {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-foreground">Low stock</h2>
        <p className="text-sm text-muted">Loading...</p>
      </div>
      <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-sm text-muted">
        Loading...
      </div>
    </div>
  );
}

async function RecentOrdersCard() {
  let orders: RecentOrderListItem[] = [];

  try {
    const rows = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        total: true,
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    orders = rows.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      total: Number(order.total),
      customer: order.customer,
    }));
  } catch {
    return (
      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-foreground">
            Recent orders
          </h2>
          <p className="text-sm text-muted">Unavailable</p>
        </div>
        <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-sm text-muted">
          Unable to load orders right now.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-foreground">Recent orders</h2>
        <p className="text-sm text-muted">
          {orders.length === 0 ? "No orders" : `${orders.length} recent`}
        </p>
      </div>
      <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-sm text-muted">
        {orders.length === 0 ? (
          <p>
            No orders yet. Orders will appear here when customers place them.
          </p>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {order.orderNumber}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {formatCustomerLabel(order.customer)}
                  </p>
                </div>
                <p className="shrink-0 text-foreground">
                  ₹{order.total.toLocaleString("en-IN")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

async function LowStockCard() {
  try {
    const lowStockItems = await getInventory({ stockStatus: "low-stock" });

    return (
      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-foreground">Low stock</h2>
          <p className="text-sm text-muted">
            {lowStockItems.length === 0
              ? "Healthy"
              : `${lowStockItems.length} flagged`}
          </p>
        </div>
        <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-sm text-muted">
          {lowStockItems.length === 0 ? (
            <p>No products are currently low in stock.</p>
          ) : (
            <ul className="space-y-3">
              {lowStockItems.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {item.productName ?? "Product"}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {(item.variantName ?? item.variantSku ?? "Variant") +
                        (item.locationName ? ` • ${item.locationName}` : "")}
                    </p>
                  </div>
                  <p className="shrink-0 text-foreground">
                    {item.quantityOnHand.toLocaleString("en-IN")}
                    {item.reorderThreshold !== null
                      ? ` / ${item.reorderThreshold.toLocaleString("en-IN")}`
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  } catch {
    return (
      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-foreground">Low stock</h2>
          <p className="text-sm text-muted">Unavailable</p>
        </div>
        <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-sm text-muted">
          Unable to load low-stock data right now.
        </div>
      </div>
    );
  }
}

export default async function AdminDashboardPage() {
  const adminContext = await requireAdmin().catch(() => null);

  if (!adminContext) {
    return null;
  }

  let summary: DashboardSummary | null = null;
  let error: string | null = null;

  try {
    const [
      products,
      activeProducts,
      inventoryAggregate,
      pendingOrders,
      customerCount,
      revenue,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.inventoryItem
        .aggregate({ _sum: { quantityOnHand: true } })
        .catch(() => ({ _sum: { quantityOnHand: null } })),
      prisma.order.count({ where: { status: "PENDING" } }).catch(() => 0),
      prisma.customer.count().catch(() => 0),
      prisma.order
        .aggregate({ _sum: { total: true } })
        .catch(() => ({ _sum: { total: null } })),
    ]);

    summary = {
      products,
      activeProducts,
      inventoryUnits: Number(inventoryAggregate._sum.quantityOnHand ?? 0),
      pendingOrders,
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
        <Suspense fallback={<RecentOrdersCardFallback />}>
          <RecentOrdersCard />
        </Suspense>

        <Suspense fallback={<LowStockCardFallback />}>
          <LowStockCard />
        </Suspense>
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

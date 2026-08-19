import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/server/auth";

const ORDER_STATUS_FILTERS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

const DATE_FILTERS = ["", "7d", "30d", "90d"] as const;

type OrderStatusFilter = (typeof ORDER_STATUS_FILTERS)[number] | "";
type DateFilter = (typeof DATE_FILTERS)[number];

type OrderListItem = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  total: number;
  createdAt: Date;
  itemCount: number;
  customer: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  } | null;
};

type OrdersPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    date?: string;
  }>;
};

function toCustomerLabel(order: OrderListItem): string {
  const fullName = [order.customer?.firstName, order.customer?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || order.customer?.email || "Customer";
}

function isOrderStatusFilter(value: string): value is OrderStatusFilter {
  return (
    value === "" || (ORDER_STATUS_FILTERS as readonly string[]).includes(value)
  );
}

function isDateFilter(value: string): value is DateFilter {
  return DATE_FILTERS.includes(value as DateFilter);
}

export default async function AdminOrdersPage({
  searchParams,
}: OrdersPageProps) {
  const adminContext = await requirePermission("support.read").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query =
    typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const statusRaw =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : "";
  const dateRaw =
    typeof resolvedSearchParams.date === "string"
      ? resolvedSearchParams.date
      : "";

  const statusFilter: OrderStatusFilter = isOrderStatusFilter(statusRaw)
    ? statusRaw
    : "";
  const dateFilter: DateFilter = isDateFilter(dateRaw) ? dateRaw : "";

  const trimmedQuery = query.trim();

  let orders: OrderListItem[] = [];
  let error: string | null = null;

  try {
    const createdAtFilter =
      dateFilter === "7d"
        ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        : dateFilter === "30d"
          ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          : dateFilter === "90d"
            ? new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
            : null;

    const rows = await prisma.order.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(createdAtFilter ? { createdAt: { gte: createdAtFilter } } : {}),
        ...(trimmedQuery
          ? {
              OR: [
                {
                  orderNumber: { contains: trimmedQuery, mode: "insensitive" },
                },
                {
                  customer: {
                    firstName: { contains: trimmedQuery, mode: "insensitive" },
                  },
                },
                {
                  customer: {
                    lastName: { contains: trimmedQuery, mode: "insensitive" },
                  },
                },
                {
                  customer: {
                    email: { contains: trimmedQuery, mode: "insensitive" },
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        fulfillmentStatus: true,
        total: true,
        createdAt: true,
        _count: {
          select: { items: true },
        },
        customer: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    orders = rows.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      total: Number(order.total),
      createdAt: order.createdAt,
      itemCount: order._count.items,
      customer: order.customer,
    }));
  } catch {
    error = "Unable to load orders right now.";
  }

  return (
    <div className="space-y-6">
      <Heading
        title="Orders"
        subtitle="Order visibility for internal operations with status tracking and drill-down detail."
        alignment="left"
      />

      <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <form
            id="orders-filter-form"
            className="grid w-full gap-3 md:grid-cols-[1.5fr_0.8fr_0.8fr] lg:max-w-3xl"
            method="GET"
            action="/admin/orders"
          >
            <label className="space-y-2 text-sm text-muted">
              <span className="text-foreground">Search</span>
              <input
                name="q"
                defaultValue={query}
                placeholder="Order number, customer name, email"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>

            <label className="space-y-2 text-sm text-muted">
              <span className="text-foreground">Status</span>
              <select
                name="status"
                defaultValue={statusFilter}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="">All statuses</option>
                {ORDER_STATUS_FILTERS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-muted">
              <span className="text-foreground">Date</span>
              <select
                name="date"
                defaultValue={dateFilter}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="">All time</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </label>
          </form>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" form="orders-filter-form">
              Apply
            </Button>
            <Button
              variant="outline"
              type="button"
              render={<Link href="/admin/orders" />}
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
        {orders.length === 0 ? (
          <div className="p-8 text-sm text-muted">
            No orders yet. Orders will appear here when customers place them.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/20 text-left text-xs uppercase tracking-[0.24em] text-muted">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Fulfillment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-4 text-foreground">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {toCustomerLabel(order)}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-4 text-muted">{order.itemCount}</td>
                    <td className="px-4 py-4 text-muted">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {order.paymentStatus}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {order.fulfillmentStatus}
                    </td>
                    <td className="px-4 py-4 text-muted">{order.status}</td>
                    <td className="px-4 py-4 text-muted">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
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

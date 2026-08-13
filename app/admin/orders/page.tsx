import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/server/auth";

type OrderListItem = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  total: number | string | { toString(): string };
  createdAt: Date;
  customer: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  } | null;
};

export default async function AdminOrdersPage() {
  const adminContext = await requirePermission("products.read").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  let orders: OrderListItem[] = [];
  let error: string | null = null;

  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        fulfillmentStatus: true,
        total: true,
        createdAt: true,
        customer: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });
  } catch {
    error = "Unable to load orders right now.";
  }

  return (
    <div className="space-y-6">
      <Heading
        title="Orders"
        subtitle="Read-only order visibility for internal operations until safe order mutations are implemented."
        alignment="left"
      />
      {error ? (
        <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted">
          {error}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        {orders.length === 0 ? (
          <div className="p-8 text-sm text-muted">
            No orders are available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/20 text-left text-xs uppercase tracking-[0.24em] text-muted">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Fulfillment</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-4 text-foreground">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {order.customer?.firstName ?? "Customer"}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      ₹{Number(order.total).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {order.paymentStatus}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {order.fulfillmentStatus}
                    </td>
                    <td className="px-4 py-4 text-muted">{order.status}</td>
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

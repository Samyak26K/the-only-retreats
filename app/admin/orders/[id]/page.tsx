import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { requirePermission } from "@/lib/server/auth";
import {
  FULFILLMENT_STATUS_VALUES,
  ORDER_STATUS_VALUES,
  PAYMENT_STATUS_VALUES,
  getOrderDetailById,
  updateOrderFulfillmentStatus,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from "@/lib/services/orders";

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function toCustomerName(customer: {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}) {
  const fullName = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || customer.email || "Customer";
}

function formatAddress(
  address: {
    fullName: string | null;
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
  } | null,
) {
  if (!address) {
    return "Not available";
  }

  const parts = [
    address.fullName,
    address.line1,
    address.line2,
    [address.city, address.state].filter(Boolean).join(", "),
    address.postalCode,
    address.country,
  ]
    .map((part) => part?.trim())
    .filter((part) => !!part);

  if (parts.length === 0) {
    return "Not available";
  }

  return parts.join("\n");
}

type AdminOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const adminContext = await requirePermission("support.read").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  const currentAdminContext = adminContext;
  const canWriteOrders =
    currentAdminContext.permissions.includes("orders.write");
  const { id } = await params;

  let order: Awaited<ReturnType<typeof getOrderDetailById>> = null;
  let error: string | null = null;

  try {
    order = await getOrderDetailById(id);
  } catch {
    error = "Unable to load order details right now.";
  }

  if (!error && !order) {
    notFound();
  }

  async function updateOrderStatusAction(formData: FormData) {
    "use server";

    const writeAdminContext = await requirePermission("orders.write");

    const orderId = formData.get("orderId");
    const status = formData.get("status");

    await updateOrderStatus(
      {
        orderId,
        status,
      },
      {
        actor: {
          id: writeAdminContext.adminUserId,
          email: writeAdminContext.email,
          role: writeAdminContext.roleName,
        },
      },
    );

    redirect(`/admin/orders/${String(orderId)}`);
  }

  async function updatePaymentStatusAction(formData: FormData) {
    "use server";

    const writeAdminContext = await requirePermission("orders.write");

    const orderId = formData.get("orderId");
    const paymentStatus = formData.get("paymentStatus");

    await updateOrderPaymentStatus(
      {
        orderId,
        paymentStatus,
      },
      {
        actor: {
          id: writeAdminContext.adminUserId,
          email: writeAdminContext.email,
          role: writeAdminContext.roleName,
        },
      },
    );

    redirect(`/admin/orders/${String(orderId)}`);
  }

  async function updateFulfillmentStatusAction(formData: FormData) {
    "use server";

    const writeAdminContext = await requirePermission("orders.write");

    const orderId = formData.get("orderId");
    const fulfillmentStatus = formData.get("fulfillmentStatus");

    await updateOrderFulfillmentStatus(
      {
        orderId,
        fulfillmentStatus,
      },
      {
        actor: {
          id: writeAdminContext.adminUserId,
          email: writeAdminContext.email,
          role: writeAdminContext.roleName,
        },
      },
    );

    redirect(`/admin/orders/${String(orderId)}`);
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Heading
          title="Order detail"
          subtitle="Investigate order records and operational statuses."
          alignment="left"
        />
        <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted">
          {error}
        </div>
        <Button variant="outline" render={<Link href="/admin/orders" />}>
          Back to orders
        </Button>
      </div>
    );
  }

  const billingAddress = formatAddress(order!.billingAddress);
  const shippingAddress = formatAddress(order!.shippingAddress);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Heading
          title={`Order ${order!.orderNumber}`}
          subtitle="Review customer details, line items, and financial totals for this order."
          alignment="left"
        />
        <Button variant="outline" render={<Link href="/admin/orders" />}>
          Back to orders
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              Order summary
            </h2>
            <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              <div>
                <dt className="text-muted">Order number</dt>
                <dd className="mt-1 text-foreground">{order!.orderNumber}</dd>
              </div>
              <div>
                <dt className="text-muted">Created</dt>
                <dd className="mt-1 text-foreground">
                  {new Date(order!.createdAt).toLocaleString("en-IN")}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Customer</dt>
                <dd className="mt-1 text-foreground">
                  {toCustomerName(order!.customer)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-1 text-foreground">
                  {order!.customer.email ?? "Not available"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Phone</dt>
                <dd className="mt-1 text-foreground">
                  {order!.customer.phone ?? "Not available"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Order status</dt>
                <dd className="mt-1 text-foreground">{order!.status}</dd>
              </div>
              <div>
                <dt className="text-muted">Payment status</dt>
                <dd className="mt-1 text-foreground">{order!.paymentStatus}</dd>
              </div>
              <div>
                <dt className="text-muted">Fulfillment status</dt>
                <dd className="mt-1 text-foreground">
                  {order!.fulfillmentStatus}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              Ordered items
            </h2>
            {order!.items.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/10 p-4 text-sm text-muted">
                No line items were recorded for this order.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead className="bg-muted/20 text-left text-xs uppercase tracking-[0.24em] text-muted">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Variant</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Qty</th>
                      <th className="px-4 py-3">Unit price</th>
                      <th className="px-4 py-3">Line total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-background">
                    {order!.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 text-foreground">
                          {item.productName ?? "Unknown product"}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {item.variantName}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {item.variantSku}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {formatCurrency(item.unitPrice, order!.currency)}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {formatCurrency(item.totalAmount, order!.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              Addresses
            </h2>
            <div className="mt-4 grid gap-4 text-sm">
              <div>
                <h3 className="text-xs uppercase tracking-[0.18em] text-muted">
                  Billing
                </h3>
                <p className="mt-2 whitespace-pre-line text-foreground">
                  {billingAddress}
                </p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.18em] text-muted">
                  Shipping
                </h3>
                <p className="mt-2 whitespace-pre-line text-foreground">
                  {shippingAddress}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              Totals
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted">Subtotal</dt>
                <dd className="text-foreground">
                  {formatCurrency(order!.subtotal, order!.currency)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted">Discount</dt>
                <dd className="text-foreground">
                  {formatCurrency(order!.discountAmount, order!.currency)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted">Shipping</dt>
                <dd className="text-foreground">
                  {formatCurrency(order!.shippingAmount, order!.currency)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted">Tax</dt>
                <dd className="text-foreground">
                  {formatCurrency(order!.taxAmount, order!.currency)}
                </dd>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between gap-2 text-base font-semibold">
                <dt className="text-foreground">Final total</dt>
                <dd className="text-foreground">
                  {formatCurrency(order!.total, order!.currency)}
                </dd>
              </div>
            </dl>
          </section>

          {canWriteOrders ? (
            <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Status management
              </h2>

              <div className="mt-4 space-y-4">
                <form action={updateOrderStatusAction} className="space-y-2">
                  <input type="hidden" name="orderId" value={order!.id} />
                  <label className="space-y-2 text-sm text-muted">
                    <span className="text-foreground">Order status</span>
                    <div className="flex gap-2">
                      <select
                        name="status"
                        defaultValue={order!.status}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      >
                        {ORDER_STATUS_VALUES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <Button type="submit">Update</Button>
                    </div>
                  </label>
                </form>

                <form action={updatePaymentStatusAction} className="space-y-2">
                  <input type="hidden" name="orderId" value={order!.id} />
                  <label className="space-y-2 text-sm text-muted">
                    <span className="text-foreground">Payment status</span>
                    <div className="flex gap-2">
                      <select
                        name="paymentStatus"
                        defaultValue={order!.paymentStatus}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      >
                        {PAYMENT_STATUS_VALUES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <Button type="submit">Update</Button>
                    </div>
                  </label>
                </form>

                <form
                  action={updateFulfillmentStatusAction}
                  className="space-y-2"
                >
                  <input type="hidden" name="orderId" value={order!.id} />
                  <label className="space-y-2 text-sm text-muted">
                    <span className="text-foreground">Fulfillment status</span>
                    <div className="flex gap-2">
                      <select
                        name="fulfillmentStatus"
                        defaultValue={order!.fulfillmentStatus}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      >
                        {FULFILLMENT_STATUS_VALUES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <Button type="submit">Update</Button>
                    </div>
                  </label>
                </form>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

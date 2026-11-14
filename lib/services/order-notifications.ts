import { prisma } from "@/lib/prisma";

const NOTIFY_TIMEOUT_MS = 8_000;

export type OrderNotificationPayload = {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  items: Array<{
    name: string;
    variant: string;
    sku: string;
    quantity: number;
    lineTotal: number;
  }>;
  subtotal: number;
  discount: number;
  couponCode: string;
  total: number;
  currency: string;
  paymentId: string;
  address: string;
};

async function loadPayload(
  orderId: string,
): Promise<OrderNotificationPayload | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      orderNumber: true,
      createdAt: true,
      currency: true,
      subtotal: true,
      discountAmount: true,
      couponCode: true,
      total: true,
      customer: {
        select: { firstName: true, lastName: true, email: true, phone: true },
      },
      shippingAddress: {
        select: {
          fullName: true,
          line1: true,
          line2: true,
          city: true,
          state: true,
          postalCode: true,
        },
      },
      payments: {
        select: { providerTransactionId: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      items: {
        select: {
          quantity: true,
          totalAmount: true,
          productVariant: {
            select: {
              name: true,
              sku: true,
              product: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  const address = order.shippingAddress;
  return {
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    customerName:
      address?.fullName ||
      [order.customer.firstName, order.customer.lastName]
        .filter(Boolean)
        .join(" "),
    email: order.customer.email ?? "",
    phone: order.customer.phone ?? "",
    items: order.items.map((item) => ({
      name: item.productVariant.product.name,
      variant: item.productVariant.name,
      sku: item.productVariant.sku,
      quantity: item.quantity,
      lineTotal: Number(item.totalAmount),
    })),
    subtotal: Number(order.subtotal),
    discount: Number(order.discountAmount),
    couponCode: order.couponCode ?? "",
    total: Number(order.total),
    currency: order.currency,
    paymentId: order.payments[0]?.providerTransactionId ?? "",
    address: address
      ? [
          address.line1,
          address.line2,
          address.city,
          address.state,
          address.postalCode,
        ]
          .filter(Boolean)
          .join(", ")
      : "",
  };
}

async function fetchWithTimeout(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${(await response.text()).slice(0, 200)}`,
    );
  }
  return response;
}

/** Appends one row to the Google Sheet via the Apps Script web app. */
async function appendToSheet(payload: OrderNotificationPayload) {
  const url = process.env.ORDERS_SHEET_WEBHOOK_URL;
  if (!url) {
    return;
  }
  // Apps Script answers POSTs with a 302 to the result; fetch follows it.
  await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      ...payload,
      itemsText: payload.items
        .map((item) => `${item.name} (${item.variant}) x${item.quantity}`)
        .join("; "),
    }),
  });
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatWhatsAppMessage(payload: OrderNotificationPayload) {
  const lines = [
    `New order ${payload.orderNumber}`,
    `Customer: ${payload.customerName}`,
    `Phone: ${payload.phone || "-"}`,
    "Items:",
    ...payload.items.map(
      (item) =>
        `- ${item.name} (${item.variant}) x${item.quantity} = ${formatAmount(item.lineTotal, payload.currency)}`,
    ),
    payload.discount > 0
      ? `Discount: -${formatAmount(payload.discount, payload.currency)}${payload.couponCode ? ` (${payload.couponCode})` : ""}`
      : null,
    `Total: ${formatAmount(payload.total, payload.currency)}`,
    `Address: ${payload.address || "-"}`,
  ];
  return lines.filter((line): line is string => line !== null).join("\n");
}

/** Sends a WhatsApp message to the admin through CallMeBot. */
async function sendWhatsApp(payload: OrderNotificationPayload) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apiKey) {
    return;
  }
  const params = new URLSearchParams({
    phone,
    apikey: apiKey,
    text: formatWhatsAppMessage(payload),
  });
  const response = await fetchWithTimeout(
    `https://api.callmebot.com/whatsapp.php?${params.toString()}`,
  );
  // CallMeBot returns 200 with an HTML error body for bad keys/phones.
  const body = await response.text();
  if (/error|invalid|not\s+allowed/i.test(body) && !/queued|sent/i.test(body)) {
    throw new Error(
      body
        .replace(/<[^>]+>/g, " ")
        .trim()
        .slice(0, 200),
    );
  }
}

/**
 * Fire-and-forget order notifications. Runs after the order is committed and
 * the customer has their response; failures are logged, never thrown.
 */
export async function notifyNewOrder(orderId: string) {
  let payload: OrderNotificationPayload | null;
  try {
    payload = await loadPayload(orderId);
  } catch (error) {
    console.error("[order-notify] Could not load order", orderId, error);
    return;
  }
  if (!payload) {
    console.error("[order-notify] Order not found", orderId);
    return;
  }

  const results = await Promise.allSettled([
    appendToSheet(payload),
    sendWhatsApp(payload),
  ]);
  const [sheet, whatsapp] = results;
  if (sheet.status === "rejected") {
    console.error(
      `[order-notify] Google Sheet append failed for ${payload.orderNumber}:`,
      sheet.reason,
    );
  }
  if (whatsapp.status === "rejected") {
    console.error(
      `[order-notify] WhatsApp (CallMeBot) failed for ${payload.orderNumber}:`,
      whatsapp.reason,
    );
  }
}

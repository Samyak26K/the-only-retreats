import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/services/audit";

export const ORDER_STATUS_VALUES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export const PAYMENT_STATUS_VALUES = [
  "PENDING",
  "AUTHORIZED",
  "CAPTURED",
  "FAILED",
  "REFUNDED",
] as const;

export const FULFILLMENT_STATUS_VALUES = [
  "UNFULFILLED",
  "PARTIALLY_FULFILLED",
  "FULFILLED",
] as const;

const orderIdSchema = z.string().cuid();

const orderStatusUpdateSchema = z.object({
  orderId: orderIdSchema,
  status: z.enum(ORDER_STATUS_VALUES),
});

const paymentStatusUpdateSchema = z.object({
  orderId: orderIdSchema,
  paymentStatus: z.enum(PAYMENT_STATUS_VALUES),
});

const fulfillmentStatusUpdateSchema = z.object({
  orderId: orderIdSchema,
  fulfillmentStatus: z.enum(FULFILLMENT_STATUS_VALUES),
});

export type OrderDetail = {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  currency: string;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  total: number;
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  };
  billingAddress: {
    fullName: string | null;
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
  } | null;
  shippingAddress: {
    fullName: string | null;
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
  } | null;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    productName: string | null;
    variantName: string;
    variantSku: string;
  }>;
};

export async function getOrderDetailById(
  id: string,
): Promise<OrderDetail | null> {
  const parsedOrderId = orderIdSchema.safeParse(id);

  if (!parsedOrderId.success) {
    return null;
  }

  const order = await prisma.order.findUnique({
    where: { id: parsedOrderId.data },
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      billingAddress: {
        select: {
          fullName: true,
          line1: true,
          line2: true,
          city: true,
          state: true,
          postalCode: true,
          country: true,
        },
      },
      shippingAddress: {
        select: {
          fullName: true,
          line1: true,
          line2: true,
          city: true,
          state: true,
          postalCode: true,
          country: true,
        },
      },
      items: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          quantity: true,
          unitPrice: true,
          discountAmount: true,
          taxAmount: true,
          totalAmount: true,
          productVariant: {
            select: {
              name: true,
              sku: true,
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    status: order.status,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    currency: order.currency,
    subtotal: Number(order.subtotal),
    discountAmount: Number(order.discountAmount),
    shippingAmount: Number(order.shippingAmount),
    taxAmount: Number(order.taxAmount),
    total: Number(order.total),
    customer: {
      id: order.customer.id,
      firstName: order.customer.firstName,
      lastName: order.customer.lastName,
      email: order.customer.email,
      phone: order.customer.phone,
    },
    billingAddress: order.billingAddress,
    shippingAddress: order.shippingAddress,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      discountAmount: Number(item.discountAmount),
      taxAmount: Number(item.taxAmount),
      totalAmount: Number(item.totalAmount),
      productName: item.productVariant.product?.name ?? null,
      variantName: item.productVariant.name,
      variantSku: item.productVariant.sku,
    })),
  };
}

export async function updateOrderStatus(
  input: unknown,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
) {
  const parsed = orderStatusUpdateSchema.parse(input);
  const existing = await prisma.order.findUnique({
    where: { id: parsed.orderId },
  });

  if (!existing) {
    throw new Error("Order not found");
  }

  const updated = await prisma.order.update({
    where: { id: parsed.orderId },
    data: { status: parsed.status },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      fulfillmentStatus: true,
    },
  });

  await recordAuditLog({
    actor: options?.actor,
    action: "update_status",
    entityType: "Order",
    entityId: updated.id,
    previousState: {
      status: existing.status,
      paymentStatus: existing.paymentStatus,
      fulfillmentStatus: existing.fulfillmentStatus,
    },
    newState: updated,
  });

  return updated;
}

export async function updateOrderPaymentStatus(
  input: unknown,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
) {
  const parsed = paymentStatusUpdateSchema.parse(input);
  const existing = await prisma.order.findUnique({
    where: { id: parsed.orderId },
  });

  if (!existing) {
    throw new Error("Order not found");
  }

  const updated = await prisma.order.update({
    where: { id: parsed.orderId },
    data: { paymentStatus: parsed.paymentStatus },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      fulfillmentStatus: true,
    },
  });

  await recordAuditLog({
    actor: options?.actor,
    action: "update_payment_status",
    entityType: "Order",
    entityId: updated.id,
    previousState: {
      status: existing.status,
      paymentStatus: existing.paymentStatus,
      fulfillmentStatus: existing.fulfillmentStatus,
    },
    newState: updated,
  });

  return updated;
}

export async function updateOrderFulfillmentStatus(
  input: unknown,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
) {
  const parsed = fulfillmentStatusUpdateSchema.parse(input);
  const existing = await prisma.order.findUnique({
    where: { id: parsed.orderId },
  });

  if (!existing) {
    throw new Error("Order not found");
  }

  const updated = await prisma.order.update({
    where: { id: parsed.orderId },
    data: { fulfillmentStatus: parsed.fulfillmentStatus },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      fulfillmentStatus: true,
    },
  });

  await recordAuditLog({
    actor: options?.actor,
    action: "update_fulfillment_status",
    entityType: "Order",
    entityId: updated.id,
    previousState: {
      status: existing.status,
      paymentStatus: existing.paymentStatus,
      fulfillmentStatus: existing.fulfillmentStatus,
    },
    newState: updated,
  });

  return updated;
}

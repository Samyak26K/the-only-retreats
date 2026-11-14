import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/services/audit";
import type { CheckoutPricing } from "@/lib/services/checkout-pricing";

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

export type CheckoutCustomerDetails = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
};

/**
 * Persists a captured payment as an order: customer (find or create), one
 * address used for shipping and billing, line items and the payment row.
 * Address, order, items and payment are written in one transaction.
 */
export async function createPaidOrder(params: {
  orderNumber: string;
  customerDetails: CheckoutCustomerDetails;
  pricing: CheckoutPricing;
  currency: string;
  provider: string;
  providerTransactionId: string;
}) {
  const { customerDetails, pricing, currency } = params;
  const [firstName, ...rest] = customerDetails.fullName.trim().split(/\s+/);

  let customer = await prisma.customer.findFirst({
    where: { email: customerDetails.email },
    select: { id: true, phone: true },
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        clerkUserId: "guest-" + Date.now(),
        email: customerDetails.email,
        firstName,
        lastName: rest.join(" "),
        phone: customerDetails.phone,
      },
      select: { id: true, phone: true },
    });
  }

  const customerId = customer.id;
  const backfillPhone = !customer.phone && !!customerDetails.phone;

  return prisma.$transaction(async (tx) => {
    const address = await tx.customerAddress.create({
      data: {
        customerId,
        type: "shipping",
        fullName: customerDetails.fullName,
        line1: customerDetails.addressLine1,
        line2: customerDetails.addressLine2 || "",
        city: customerDetails.city,
        state: customerDetails.state,
        postalCode: customerDetails.pincode,
        country: "IN",
      },
      select: { id: true },
    });

    if (backfillPhone) {
      await tx.customer.update({
        where: { id: customerId },
        data: { phone: customerDetails.phone },
      });
    }

    const order = await tx.order.create({
      data: {
        orderNumber: params.orderNumber,
        customerId,
        status: "CONFIRMED",
        paymentStatus: "CAPTURED",
        fulfillmentStatus: "UNFULFILLED",
        currency,
        subtotal: pricing.subtotal,
        couponCode: pricing.couponCode,
        discountAmount: pricing.discountAmount,
        shippingAmount: 0,
        taxAmount: 0,
        total: pricing.total,
        shippingAddressId: address.id,
        billingAddressId: address.id,
        items: {
          create: pricing.items.map((item) => ({
            productVariantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalAmount: item.unitPrice * item.quantity,
          })),
        },
        payments: {
          create: {
            provider: params.provider,
            providerTransactionId: params.providerTransactionId,
            amount: pricing.total,
            currency,
            status: "CAPTURED",
            paymentMethod: params.provider,
          },
        },
      },
      select: { id: true, orderNumber: true },
    });

    return {
      success: true as const,
      orderNumber: order.orderNumber,
      orderId: order.id,
    };
  });
}

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
  couponCode: string | null;
  payments: Array<{
    provider: string | null;
    providerTransactionId: string | null;
    amount: number;
    status: string;
    createdAt: Date;
  }>;
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
      payments: {
        orderBy: { createdAt: "asc" },
        select: {
          provider: true,
          providerTransactionId: true,
          amount: true,
          status: true,
          createdAt: true,
        },
      },
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
    couponCode: order.couponCode,
    payments: order.payments.map((payment) => ({
      ...payment,
      amount: Number(payment.amount),
    })),
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

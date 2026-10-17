import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

import { prisma } from "@/lib/prisma";
import { calculateCheckoutPricing } from "@/lib/services/checkout-pricing";
import {
  returnExistingPaymentOnConflict,
  type PaymentResult,
} from "@/lib/services/payment-idempotency";

type CustomerDetails = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
};

type VerifyPaymentBody = {
  razorpay_order_id?: unknown;
  razorpay_payment_id?: unknown;
  razorpay_signature?: unknown;
  customerDetails: CustomerDetails;
  items?: unknown;
  couponCode?: unknown;
  currency?: unknown;
};

async function getExistingPaymentResult(
  paymentId: string,
): Promise<
  (PaymentResult & { expectedAmount: number; expectedCurrency: string }) | null
> {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      provider: "razorpay",
      providerTransactionId: paymentId,
    },
    select: {
      amount: true,
      currency: true,
      order: { select: { id: true, orderNumber: true } },
    },
  });

  return existingPayment
    ? {
        success: true,
        orderNumber: existingPayment.order.orderNumber,
        orderId: existingPayment.order.id,
        expectedAmount: Number(existingPayment.amount) * 100,
        expectedCurrency: existingPayment.currency,
      }
    : null;
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VerifyPaymentBody;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerDetails,
      currency,
    } = body;

    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      typeof currency !== "string" ||
      currency !== "INR" ||
      !customerDetails ||
      typeof customerDetails.email !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid payment data" },
        { status: 400 },
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (
      expectedSignature.length !== razorpay_signature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature),
      )
    ) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);
    const existingPaymentResult =
      await getExistingPaymentResult(razorpay_payment_id);
    if (existingPaymentResult) {
      if (
        razorpayPayment.order_id !== razorpay_order_id ||
        razorpayPayment.currency !== currency ||
        razorpayPayment.status !== "captured" ||
        razorpayOrder.amount !== existingPaymentResult.expectedAmount ||
        razorpayPayment.amount !== existingPaymentResult.expectedAmount ||
        existingPaymentResult.expectedCurrency !== currency
      ) {
        return NextResponse.json(
          { error: "Payment does not match the existing order" },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        orderNumber: existingPaymentResult.orderNumber,
        orderId: existingPaymentResult.orderId,
      });
    }

    const pricing = await calculateCheckoutPricing(body.items, body.couponCode);
    if (
      razorpayOrder.currency !== currency ||
      razorpayOrder.amount !== Math.round(pricing.total * 100) ||
      razorpayPayment.order_id !== razorpay_order_id ||
      razorpayPayment.currency !== currency ||
      razorpayPayment.amount !== Math.round(pricing.total * 100) ||
      razorpayPayment.status !== "captured"
    ) {
      return NextResponse.json(
        { error: "Payment amount does not match the order" },
        { status: 400 },
      );
    }

    const orderNumber = "TOR-" + Date.now();

    let customer = await prisma.customer.findFirst({
      where: { email: customerDetails.email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          clerkUserId: "guest-" + Date.now(),
          email: customerDetails.email,
          firstName: customerDetails.fullName.split(" ")[0],
          lastName:
            customerDetails.fullName.split(" ").slice(1).join(" ") || "",
          phone: customerDetails.phone,
        },
      });
    }

    if (customer && !customer.phone && customerDetails.phone) {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: { phone: customerDetails.phone },
      });
    }

    const order = await returnExistingPaymentOnConflict(
      () =>
        prisma.$transaction(async (tx) => {
          const order = await tx.order.create({
            data: {
              orderNumber,
              customerId: customer.id,
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
              items: {
                create: pricing.items.map((item) => ({
                  productVariantId: item.variantId,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  totalAmount: item.unitPrice * item.quantity,
                })),
              },
            },
          });

          await tx.payment.create({
            data: {
              orderId: order.id,
              provider: "razorpay",
              providerTransactionId: razorpay_payment_id,
              amount: pricing.total,
              currency,
              status: "CAPTURED",
              paymentMethod: "razorpay",
            },
          });

          return {
            success: true as const,
            orderNumber: order.orderNumber,
            orderId: order.id,
          };
        }),
      async () => {
        const existingResult =
          await getExistingPaymentResult(razorpay_payment_id);
        return existingResult
          ? {
              success: true as const,
              orderNumber: existingResult.orderNumber,
              orderId: existingResult.orderId,
            }
          : null;
      },
    );

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.orderId,
    });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 },
    );
  }
}

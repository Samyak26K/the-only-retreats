import crypto from "crypto";
import { after, NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

import { prisma } from "@/lib/prisma";
import { calculateCheckoutPricing } from "@/lib/services/checkout-pricing";
import { notifyNewOrder } from "@/lib/services/order-notifications";
import {
  createPaidOrder,
  type CheckoutCustomerDetails,
} from "@/lib/services/orders";
import {
  returnExistingPaymentOnConflict,
  type PaymentResult,
} from "@/lib/services/payment-idempotency";

type VerifyPaymentBody = {
  razorpay_order_id?: unknown;
  razorpay_payment_id?: unknown;
  razorpay_signature?: unknown;
  customerDetails: CheckoutCustomerDetails;
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

    // Independent lookups (two Razorpay API calls + one DB read) in parallel.
    const [razorpayOrder, razorpayPayment, existingPaymentResult] =
      await Promise.all([
        razorpay.orders.fetch(razorpay_order_id),
        razorpay.payments.fetch(razorpay_payment_id),
        getExistingPaymentResult(razorpay_payment_id),
      ]);
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
    let createdNewOrder = false;

    const order = await returnExistingPaymentOnConflict(
      async () => {
        const result = await createPaidOrder({
          orderNumber,
          customerDetails,
          pricing,
          currency,
          provider: "razorpay",
          providerTransactionId: razorpay_payment_id,
        });
        createdNewOrder = true;
        return result;
      },
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

    console.log("Order saved:", order.orderNumber);

    if (createdNewOrder) {
      // Runs after the response is sent; it can never block or fail the order.
      after(() => notifyNewOrder(order.orderId));
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.orderId,
    });
  } catch (err) {
    console.error("=== VERIFY ERROR ===", err);
    return NextResponse.json(
      { error: "Failed to save order", details: String(err) },
      { status: 500 },
    );
  }
}

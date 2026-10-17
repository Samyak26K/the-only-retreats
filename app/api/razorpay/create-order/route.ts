import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

import { calculateCheckoutPricing } from "@/lib/services/checkout-pricing";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, couponCode, currency, receipt } = body as {
      items?: unknown;
      couponCode?: unknown;
      currency?: unknown;
      receipt?: string;
    };

    if (currency !== "INR") {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 },
      );
    }

    const pricing = await calculateCheckoutPricing(items, couponCode);
    const order = await razorpay.orders.create({
      amount: Math.round(pricing.total * 100),
      currency,
      receipt,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      subtotal: pricing.subtotal,
      discountAmount: pricing.discountAmount,
      couponCode: pricing.couponCode,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Invalid promo code" ||
        error.message === "Invalid cart item" ||
        error.message === "Duplicate cart item" ||
        error.message === "Cart is empty" ||
        error.message === "One or more products are unavailable")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error(
      "Razorpay create-order error:",
      JSON.stringify(error, null, 2),
    );

    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "object"
          ? JSON.stringify(error)
          : String(error);

    return NextResponse.json(
      {
        error: "Failed to create payment order",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}

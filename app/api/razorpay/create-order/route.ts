import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, receipt } = body as {
      amount?: unknown;
      currency?: unknown;
      receipt?: string;
    };

    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      typeof currency !== "string" ||
      currency.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 },
      );
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
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

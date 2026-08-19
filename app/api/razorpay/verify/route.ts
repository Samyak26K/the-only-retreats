import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type CheckoutItem = {
  variantId: string;
  productId: string;
  productName: string;
  variantLabel: string;
  price: number;
  currency: string;
  quantity: number;
};

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
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  customerDetails: CustomerDetails;
  items: CheckoutItem[];
  subtotal: number;
  currency: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VerifyPaymentBody;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerDetails,
      subtotal,
      currency,
    } = body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    const orderNumber = "TOR-" + Date.now();
    const nameParts = customerDetails.fullName.trim().split(" ");
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ");

    let customer = await prisma.customer.findUnique({
      where: { email: customerDetails.email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          clerkUserId: "guest-" + Date.now(),
          email: customerDetails.email,
          firstName,
          lastName,
          phone: customerDetails.phone,
        },
      });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        status: "CONFIRMED",
        paymentStatus: "CAPTURED",
        fulfillmentStatus: "UNFULFILLED",
        currency,
        subtotal,
        shippingAmount: 0,
        taxAmount: 0,
        total: subtotal,
        payments: {
          create: {
            provider: "razorpay",
            providerTransactionId: razorpay_payment_id,
            amount: subtotal,
            currency,
            status: "CAPTURED",
            paymentMethod: "razorpay",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: order.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 },
    );
  }
}

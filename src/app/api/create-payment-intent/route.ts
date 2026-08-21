import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb, saveDb, Order } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-07-29.dahlia", // Using latest stable stripe API version string format
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, cartItems = [], addressData = {}, taxAmount = 0, shippingCost = 0, subtotal = 0 } = body;

    // Generate unique Order ID using current timestamp and a random number
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const random = Math.floor(100 + Math.random() * 900); // 3 digit random number
    const orderId = `ORD-${timestamp}${random}`;

    let paymentIntentId = "pi_mock_secret";
    let clientSecret = "pi_mock_secret";

    // If using placeholder key, mock response
    if (process.env.STRIPE_SECRET_KEY !== "sk_test_placeholder") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // amount in cents
        currency: "eur",
        payment_method_types: ["card", "paypal"],
        metadata: {
          orderId: orderId,
        },
      });
      clientSecret = paymentIntent.client_secret as string;
      paymentIntentId = paymentIntent.id;
    }

    // Prepare address string
    const fullAddress = `${addressData.address1 || ''} ${addressData.additionalInfo ? addressData.additionalInfo + ', ' : ''}${addressData.city || ''}, ${addressData.state || ''}, ${addressData.postalCode || ''}, ${addressData.country || ''}`.trim();

    // Create a new Pending Order
    const newOrder: Order = {
      id: orderId,
      customerName: `${addressData.firstName || ''} ${addressData.lastName || ''}`.trim() || 'Guest',
      customerEmail: addressData.email || 'guest@example.com',
      customerPhone: `${addressData.phoneCode || ''} ${addressData.phoneNumber || ''}`.trim(),
      shippingAddress: fullAddress,
      items: cartItems,
      subtotal: subtotal,
      tax: taxAmount,
      total: amount,
      status: "Pending",
      courier: "",
      trackingCode: "",
      date: new Date().toISOString(),
      stripePaymentIntentId: paymentIntentId,
    };

    // Save to Database
    const db = await getDb();
    if (!db.orders) {
      db.orders = [];
    }
    db.orders.unshift(newOrder); // Add to beginning of array
    await saveDb(db);

    return NextResponse.json({
      clientSecret,
      orderId,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Error creating payment intent: " + error.message },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-07-29.dahlia", // Using latest stable stripe API version string format
});

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    // If using placeholder key, return a mock response
    if (process.env.STRIPE_SECRET_KEY === "sk_test_placeholder") {
       return NextResponse.json({
          clientSecret: "pi_mock_secret",
          amount: Math.round(amount * 100),
          currency: "eur",
       });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Error creating payment intent: " + error.message },
      { status: 500 }
    );
  }
}

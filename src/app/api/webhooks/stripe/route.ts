import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb, saveDb } from "@/lib/db";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-07-29.dahlia", // Using latest stable stripe API version string format
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    // Verify webhook signature if the secret is set
    if (webhookSecret && process.env.STRIPE_SECRET_KEY !== "sk_test_placeholder") {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: any) {
        console.error("Webhook signature verification failed.", err.message);
        return NextResponse.json({ error: "Webhook Error: " + err.message }, { status: 400 });
      }
    } else {
      // In development or when webhook secret is missing, fallback to raw parsing
      event = JSON.parse(body);
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      
      const orderId = paymentIntent.metadata.orderId;
      if (orderId) {
        const db = await getDb();
        const orderIndex = db.orders.findIndex(o => o.id === orderId);
        
        if (orderIndex >= 0) {
          // Update order status to Processing
          db.orders[orderIndex].status = "Processing";
          await saveDb(db);
          console.log(`Order ${orderId} status updated to Processing.`);
          
          const order = db.orders[orderIndex];
          
          // Send receipt email
          if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
            try {
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_APP_PASSWORD,
                }
              });

              const itemsHtml = order.items.map(item => {
                const sizeStr = item.size ? ` (Size: ${item.size})` : "";
                const descStr = item.description ? `<br/><small>${item.description}</small>` : "";
                return `<li>${item.title}${sizeStr} (Qty: ${item.quantity}) - ${item.price}${descStr}</li>`;
              }).join("");

              const mailOptions = {
                from: process.env.EMAIL_USER,
                to: order.customerEmail,
                subject: `Order Confirmation - ${order.id}`,
                html: `
                  <h2>Thank you for your purchase, ${order.customerName}!</h2>
                  <p>Your payment was successful and your order is now processing.</p>
                  <h3>Order ID: ${order.id}</h3>
                  <p><strong>Shipping to:</strong><br/>
                  ${order.shippingAddress}
                  </p>
                  <h3>Items Ordered:</h3>
                  <ul>
                    ${itemsHtml}
                  </ul>
                  <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
                `
              };

              await transporter.sendMail(mailOptions);
              console.log(`Receipt email sent to ${order.customerEmail}`);
            } catch (err) {
              console.error("Failed to send email:", err);
            }
          }
        } else {
          console.warn(`Order ${orderId} not found in database.`);
        }
      }
    } else if (event.type === "payment_intent.payment_failed" || event.type === "payment_intent.canceled") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;
      if (orderId) {
        const db = await getDb();
        const orderIndex = db.orders.findIndex(o => o.id === orderId);
        
        if (orderIndex >= 0) {
          // Remove the order from the database
          db.orders.splice(orderIndex, 1);
          await saveDb(db);
          console.log(`Order ${orderId} removed because payment failed or was canceled.`);
        }
      }
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook Error: " + error.message },
      { status: 500 }
    );
  }
}

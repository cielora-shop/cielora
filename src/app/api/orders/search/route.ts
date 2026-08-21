import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const email = searchParams.get("email");

    if (!orderId && !email) {
      return NextResponse.json({ error: "Missing search parameters" }, { status: 400 });
    }

    const db = await getDb();
    const orders = db.orders || [];

    let results: any[] = [];

    if (orderId) {
      const found = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
      if (found) results.push(found);
    } else if (email) {
      results = orders.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
    }

    // Sort results by date descending
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Error searching orders:", error);
    return NextResponse.json(
      { error: "Error searching orders: " + error.message },
      { status: 500 }
    );
  }
}

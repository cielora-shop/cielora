import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("cielora");
    
    const record = await db.collection("otps").findOne({ email: email.toLowerCase() });

    if (!record) {
      return NextResponse.json({ error: "No OTP request found for this email" }, { status: 400 });
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    if (record.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }

    // OTP is valid
    return NextResponse.json({ success: true, message: "OTP verified successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error in verify-otp:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

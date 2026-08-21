import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Email, OTP, and new password are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("cielora");
    
    // Verify OTP again just in case they hit this endpoint directly
    const record = await db.collection("otps").findOne({ email: email.toLowerCase() });

    if (!record || new Date() > record.expiresAt || record.otp !== otp) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const result = await db.collection("users").updateOne(
      { email: email.toLowerCase() },
      { $set: { password: hashedPassword } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the used OTP
    await db.collection("otps").deleteOne({ email: email.toLowerCase() });

    return NextResponse.json({ success: true, message: "Password reset successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error in reset-password:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

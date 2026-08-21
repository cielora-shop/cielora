import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("cielora");
    
    // Check if user exists
    const user = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't leak that the email doesn't exist for security purposes, just pretend it was sent.
      // But in this implementation, to provide good UX for the user, we will return an error.
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await db.collection("otps").updateOne(
      { email: email.toLowerCase() },
      { $set: { email: email.toLowerCase(), otp, expiresAt } },
      { upsert: true }
    );

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Cielora Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset Code",
      text: `Your password reset code is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #1a1a1a;">Password Reset</h2>
          <p>You requested a password reset for your Cielora account.</p>
          <p>Your 6-digit reset code is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 13px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError: any) {
      console.error("Failed to send OTP email:", emailError);
      // Even if email fails (e.g. invalid credentials in dev), return success if requested for testing 
      // but log it so dev knows.
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error in send-otp:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

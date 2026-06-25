import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import clientPromise from '../../../lib/mongodb';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, phone, email, reason, description } = await req.json();

    // Rate Limiting check
    const client = await clientPromise;
    const db = client.db("cielora");
    const rateLimitCollection = db.collection("contactRateLimits");
    
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    
    // Count how many messages this email sent in the last 12 hours
    const recentMessagesCount = await rateLimitCollection.countDocuments({
      email: email.toLowerCase(),
      timestamp: { $gte: twelveHoursAgo }
    });

    if (recentMessagesCount >= 3) {
      return NextResponse.json(
        { success: false, message: 'You have reached the maximum limit of 3 messages per 12 hours. Please try again later.' },
        { status: 429 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${firstName} ${lastName} (via Website)" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL || 'cielorashop@gmail.com', // Receiver is the client
      replyTo: email, // Set the reply-to address to the sender's email
      subject: `New Contact Form Submission: ${reason}`,
      text: `
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Reason: ${reason}
        
Message:
${description}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Message:</strong></p>
        <p>${description.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Record the message in the database for the Admin Panel
    const messagesCollection = db.collection("contactMessages");
    await messagesCollection.insertOne({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      reason,
      description,
      date: new Date().toISOString()
    });

    // Record the successful submission for rate limiting
    await rateLimitCollection.insertOne({
      email: email.toLowerCase(),
      timestamp: new Date()
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to send email' }, { status: 500 });
  }
}

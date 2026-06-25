import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.verify();
    console.log('Nodemailer configuration is valid.');
    
    // Optional: send a test email
    /*
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Email',
      text: 'This is a test email.'
    });
    console.log('Test email sent.');
    */
  } catch (error) {
    console.error('Nodemailer test failed:', error);
  }
}

testEmail();

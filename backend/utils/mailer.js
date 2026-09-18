//Resend is a transporter mail API
//Nodemailer is a library , using which we write transporter code 
//But companies use transactional email apis like Sendgrid, Mailgun, Postmark, Resend etc. to send emails
//because sender domain has better reputation and ipv6 will not reject the request, just like it rejected the smpt port 587 request from nodemailer. So we use Resend here to send emails.

// utils/mailer.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(toEmail, verificationLink) {
  await resend.emails.send({
    from: "Smart Rent <onboarding@resend.dev>",
    to: toEmail,
    subject: "Verify your email",
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your account.</p>`,
  });
}
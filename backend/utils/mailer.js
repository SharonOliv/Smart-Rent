//Resend is a transporter mail API
//Nodemailer is a library , using which we write transporter code 
//But companies use transactional email apis like Sendgrid, Mailgun, Postmark, Resend etc. to send emails
//because sender domain has better reputation and ipv6 will not reject the request, just like it rejected the smpt port 587 request from nodemailer. So we use Resend here to send emails.

// utils/mailer.js
// cannot use this now, since i do not have/own a domain . example @smartrent.com
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendVerificationEmail(toEmail, verificationLink) {
//   await resend.emails.send({
//     from: "Smart Rent <onboarding@resend.dev>",
//     to: toEmail,
//     subject: "Verify your email",
//     html: `<p>Click <a href="${verificationLink}">here</a> to verify your account.</p>`,
//   });
// }

// utils/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password, not your regular password
  },
});

export async function sendVerificationEmail(toEmail, verificationLink) {
  await transporter.sendMail({
    from: `"Smart Rent" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h2 style="color: #16232B; margin-bottom: 8px;">Verify your email</h2>
        <p style="color: #444; font-size: 14px; line-height: 1.5;">
          Thanks for signing up for Smart Rent. Click the button below to verify your email address and continue.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationLink}"
             style="background-color: #16232B; color: #ffffff; text-decoration: none;
                    padding: 12px 28px; border-radius: 6px; font-size: 15px;
                    font-weight: 600; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #888; font-size: 12px; line-height: 1.5;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${verificationLink}" style="color: #C2873E; word-break: break-all;">${verificationLink}</a>
        </p>
      </div>
    `,
  });
}
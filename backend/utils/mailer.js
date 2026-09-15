import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password — not your regular password
  },
});

export const sendVerificationEmail = async (to, verifyUrl) => {
  await transporter.sendMail({
    from: `"Smart Rent" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Confirm your Smart Rent account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Welcome to Smart Rent</h2>
        <p>Click the button below to confirm your email address and activate your account. This link expires in 24 hours.</p>
        <p style="text-align:center; margin: 24px 0;">
          <a href="${verifyUrl}" style="background:#C2873E;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">Confirm email</a>
        </p>
        <p>Or paste this into your browser:<br>${verifyUrl}</p>
      </div>
    `,
  });
};
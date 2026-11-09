
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendVerificationCode(email, code) {
  return transporter.sendMail({
    from: `"CodeMentor" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Your CodeMentor verification code",
    text: `Your CodeMentor verification code is ${code}.\n\nThis code expires in 10 minutes. If you did not request it, ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#222">
        <h2>CodeMentor</h2>
        <p>Use this code to verify your email:</p>
        <div style="font-size:30px;font-weight:bold;letter-spacing:8px;padding:18px;background:#f2f3f8;text-align:center;border-radius:8px">
          ${code}
        </div>
        <p>This code expires in 10 minutes.</p>
        <p>If you didn't request this code, you can ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendVerificationCode };

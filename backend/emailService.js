
async function sendVerificationCode(email, code) {
  const apiKey = process.env.RESEND_API_KEY;

  const from =
    process.env.EMAIL_FROM ||
    "CodeMentor <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!email || !code) {
    throw new Error("Email address and verification code are required.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your CodeMentor verification code",

      text: `Your CodeMentor verification code is ${code}.

This code expires in 10 minutes. If you did not request it, ignore this email.`,

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
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Resend email error:", response.status, result);

    throw new Error(
      result.message || "Failed to send verification email."
    );
  }

  console.log("Verification email accepted by Resend:", result.id);

  return result;
}

module.exports = { sendVerificationCode };

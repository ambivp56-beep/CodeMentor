const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { sendVerificationCode } = require("./emailService");
const { runWebCode } = require("./webRunner");
const {
  createLoginCode,
  resendLoginCode,
  verifyLoginCode,
  createSignupCode,
  verifySignupCode,
  resendSignupCode,
  createPasswordResetCode,
  verifyPasswordResetCode,
  consumePasswordResetToken,
} = require("./otpStore");

const app = express();
const PORT = process.env.PORT || 4000;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (
  !SUPABASE_URL ||
  !SUPABASE_PUBLISHABLE_KEY ||
  !SUPABASE_SERVICE_ROLE_KEY
) {
  throw new Error(
    "Missing Supabase configuration. Check backend/.env."
  );
}

const adminClient = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);
const authClient = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY,
  
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

// ======================================================
// MIDDLEWARE AND AUTHENTICATION
// ======================================================

const FRONTEND_ORIGINS = new Set(
  (process.env.FRONTEND_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean)
);

app.disable("x-powered-by");

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        FRONTEND_ORIGINS.has(origin.replace(/\/+$/, ""))
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

app.use(express.json({ limit: "16kb" }));

app.use((req, res, next) => {
  console.log("INCOMING REQUEST:", req.method, req.url);
  next();
});

async function getAuthenticatedUser(req) {
  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) return null;

  const { data, error } = await adminClient.auth.getUser(
    match[1]
  );

  if (error || !data.user) return null;

  return data.user;
}

async function findAuthUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  let page = 1;

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) throw error;

    const users = data.users || [];
    const user = users.find(
      (item) => item.email?.trim().toLowerCase() === normalizedEmail
    );

    if (user) return user;
    if (users.length < 1000) return null;

    page++;
  }
}

// ======================================================
// ADMIN ACCESS CONTROL
// ======================================================

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

async function requireAdmin(req, res, next) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please sign in again.",
      });
    }

    const email = user.email?.trim().toLowerCase();

    if (!email || !ADMIN_EMAILS.has(email)) {
      return res.status(403).json({
        success: false,
        message: "Administrator access is not authorized.",
      });
    }

    req.adminUser = user;
    return next();
  } catch (error) {
    console.error(
      "Admin authentication error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Could not verify administrator access.",
    });
  }
}

app.get("/api/admin/me", requireAdmin, (req, res) => {
  return res.json({
    success: true,
    isAdmin: true,
    admin: {
      id: req.adminUser.id,
      email: req.adminUser.email,
    },
  });
});

app.get("/api/admin/overview", requireAdmin, async (req, res) => {
  try {
    const { data: userData, error: userError } =
      await adminClient.auth.admin.listUsers({
        page: 1,
        perPage: 100,
      });

    if (userError) {
      console.error(
        "Admin user listing error:",
        userError.message
      );

      return res.status(502).json({
        success: false,
        message: "Could not load student accounts.",
      });
    }

    const progressRecords = [];
    const pageSize = 1000;
    let from = 0;

    while (true) {
      const { data, error } = await adminClient
        .from("lesson_progress")
        .select("user_id, course_id, lesson_id")
        .eq("completed", true)
        .range(from, from + pageSize - 1);

      if (error) {
        console.error(
          "Lesson progress query error:",
          error.message
        );

        return res.status(502).json({
          success: false,
          message:
            "Could not load lesson progress. Check the lesson_progress table.",
        });
      }

      progressRecords.push(...(data || []));

      if (!data || data.length < pageSize) break;

      from += pageSize;
    }

    const studentCounts = new Map();
    const courseCounts = new Map();

    for (const record of progressRecords) {
      studentCounts.set(
        record.user_id,
        (studentCounts.get(record.user_id) || 0) + 1
      );

      courseCounts.set(
        record.course_id,
        (courseCounts.get(record.course_id) || 0) + 1
      );
    }

    const users = userData.users || [];

    return res.json({
      success: true,
      totalStudents:
        typeof userData.total === "number"
          ? userData.total
          : null,
      studentsOnThisPage: users.length,
      confirmedAccounts: users.filter(
        (user) => Boolean(user.email_confirmed_at)
      ).length,
      totalCompletedLessons: progressRecords.length,
      courseProgress: Array.from(
        courseCounts,
        ([courseId, count]) => ({
          courseId,
          completedLessons: count,
        })
      ).sort((a, b) => b.completedLessons - a.completedLessons),
      students: users.map((user) => ({
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
        emailConfirmed: Boolean(user.email_confirmed_at),
        lastSignInAt: user.last_sign_in_at,
        completedLessons: studentCounts.get(user.id) || 0,
      })),
    });
  } catch (error) {
    console.error("Admin overview error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not load the admin dashboard.",
    });
  }
});

// ======================================================
// ADMIN PASSWORD RESET
// ======================================================

// REQUEST ADMIN PASSWORD RESET CODE
app.post("/api/admin/password-reset/request", async (req, res) => {
  try {
    const { email } = req.body || {};

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Do not reveal whether an email belongs to an administrator.
    const genericResponse = {
      success: true,
      message:
        "If an authorized administrator account exists for that email, a recovery code will be sent.",
    };

    if (!ADMIN_EMAILS.has(normalizedEmail)) {
      return res.json(genericResponse);
    }

    const user = await findAuthUserByEmail(normalizedEmail);

    if (!user) {
      return res.json(genericResponse);
    }

    const code = createPasswordResetCode(normalizedEmail);

    try {
      await sendVerificationCode(normalizedEmail, code);
    } catch (emailError) {
      console.error(
        "Admin password reset email error:",
        emailError.message
      );

      return res.status(502).json({
        success: false,
        message: "Could not send the recovery code. Please try again.",
      });
    }

    return res.json(genericResponse);
  } catch (error) {
    console.error("Admin password reset request error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not request a password reset.",
    });
  }
});


// VERIFY ADMIN RECOVERY CODE
app.post("/api/admin/password-reset/verify", async (req, res) => {
  try {
    const { email, code } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof code !== "string" ||
      !email.trim() ||
      !code.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and recovery code are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!ADMIN_EMAILS.has(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired recovery code.",
      });
    }

    const user = await findAuthUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired recovery code.",
      });
    }

    const result = verifyPasswordResetCode(
      normalizedEmail,
      code.trim()
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json({
      success: true,
      resetToken: result.resetToken,
      message: "Recovery code verified successfully.",
    });
  } catch (error) {
    console.error("Admin password reset verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not verify the recovery code.",
    });
  }
});


// COMPLETE ADMIN PASSWORD RESET
app.post("/api/admin/password-reset/complete", async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof resetToken !== "string" ||
      typeof newPassword !== "string" ||
      !email.trim() ||
      !resetToken.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email, reset token, and new password are required.",
      });
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 128 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!ADMIN_EMAILS.has(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset authorization.",
      });
    }

    const user = await findAuthUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset authorization.",
      });
    }

    // Consume the one-time reset token.
    const authorized = consumePasswordResetToken(
      normalizedEmail,
      resetToken.trim()
    );

    if (!authorized.success) {
      return res.status(400).json(authorized);
    }

    const { error } = await adminClient.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) {
      console.error("Admin password update error:", error.message);

      return res.status(500).json({
        success: false,
        message:
          "Could not update the password. Please request a new recovery code.",
      });
    }

    return res.json({
      success: true,
      message: "Administrator password updated successfully.",
    });
  } catch (error) {
    console.error("Admin password reset completion error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not update the administrator password.",
    });
  }
});

// ======================================================
// BASIC HEALTH ROUTES
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message: "CodeMentor backend is running!",
  });
});

app.get("/api/health/supabase", (req, res) => {
  res.json({
    configured: true,
    message: "Supabase configuration is loaded.",
  });
});

// ======================================================
// SIGNUP
// ======================================================

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    const { data, error } =
      await adminClient.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: false,
      });

    if (error || !data.user) {
      console.error("Signup error:", error?.message);

      return res.status(400).json({
        success: false,
        message:
          "Account could not be created. Check the email or try signing in.",
      });
    }

    const code = createSignupCode(
      normalizedEmail,
      data.user.id
    );

    try {
      await sendVerificationCode(normalizedEmail, code);
    } catch (emailError) {
      console.error(
        "Signup verification email failed:",
        emailError.message
      );

      return res.status(502).json({
        success: false,
        message:
          "The account was created, but the verification email could not be sent. Try resending the code.",
        email: normalizedEmail,
      });
    }

    return res.json({
      success: true,
      email: normalizedEmail,
      requiresVerification: true,
      message: "Your six-character verification code has been sent.",
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Signup could not be completed.",
    });
  }
});

// ======================================================
// VERIFY SIGNUP EMAIL
// ======================================================

app.post("/api/auth/verify-signup-code", async (req, res) => {
  try {
    const { email, code } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof code !== "string" ||
      !email.trim() ||
      !code.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required.",
      });
    }

    const result = verifySignupCode(email, code);

    if (!result.success) {
      return res.status(400).json(result);
    }

    const { error } =
      await adminClient.auth.admin.updateUserById(
        result.userId,
        { email_confirm: true }
      );

    if (error) {
      console.error(
        "Email confirmation error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Email confirmation failed. Please try again.",
      });
    }

    return res.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error(
      "Signup code verification error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Verification could not be completed.",
    });
  }
});
/* ======================================================
   RESEND SIGNUP CODE
   ====================================================== */

app.post("/api/auth/resend-signup-code", async (req, res) => {
  try {
    const { email } = req.body || {};

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // This function returns a code string or null.
    const code = resendSignupCode(normalizedEmail);

    if (!code) {
      return res.status(400).json({
        success: false,
        message:
          "No pending signup found or your verification code expired. Please sign up again.",
      });
    }

    try {
      await sendVerificationCode(normalizedEmail, code);
    } catch (emailError) {
      console.error("Resend email failed:", emailError.message);

      return res.status(502).json({
        success: false,
        message: "Could not send the email. Please try again.",
      });
    }

    return res.json({
      success: true,
      message: "A new verification code has been sent.",
    });
  } catch (error) {
    console.error("Resend signup code error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not resend the verification code.",
    });
  }
});



/* ======================================================
   STUDENT LOGIN
   ====================================================== */

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify the email and password with Supabase.
    const { data, error } = await authClient.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.session || !data.user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please try again.",
      });
    }

    // Require verified email before continuing.
    if (!data.user.email_confirmed_at) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before signing in.",
      });
    }

    // Store the session with the login verification code.
    const code = createLoginCode(
      normalizedEmail,
      data.session
    );

    try {
      await sendVerificationCode(normalizedEmail, code);
    } catch (emailError) {
      console.error(
        "Login verification email failed:",
        emailError.message
      );

      return res.status(502).json({
        success: false,
        message: "Could not send the login verification code. Please try again.",
      });
    }

    return res.json({
      success: true,
      email: normalizedEmail,
      requiresVerification: true,
      message: "A login verification code has been sent to your email.",
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login could not be completed. Please try again.",
    });
  }
});


app.post("/api/auth/resend-login-code", async (req, res) => {
  try {
    const { email } = req.body || {};

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const code = resendLoginCode(normalizedEmail);

    if (!code) {
      return res.status(400).json({
        success: false,
        message:
          "Your login verification session expired. Please sign in again.",
      });
    }

    try {
      await sendVerificationCode(normalizedEmail, code);
    } catch (emailError) {
      console.error(
        "Resend login email failed:",
        emailError.message
      );

      return res.status(502).json({
        success: false,
        message: "Could not send the login code. Please try again.",
      });
    }

    return res.json({
      success: true,
      message: "A new login verification code has been sent.",
    });
  } catch (error) {
    console.error("Resend login code error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not resend the login code.",
    });
  }
});


/* ======================================================
   VERIFY LOGIN CODE
   ====================================================== */
app.post("/api/auth/verify-code", (req, res) => {
  try {
    const { email, code } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof code !== "string" ||
      !email.trim() ||
      !code.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required.",
      });
    }

    const result = verifyLoginCode(
      email.trim().toLowerCase(),
      code.trim()
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    const session = result.session;

    return res.json({
      success: true,
      message: "Email verified successfully.",
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        token_type: session.token_type,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
      },
    });
  } catch (error) {
    console.error("Login code verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Verification could not be completed.",
    });
  }
})

/* ======================================================
   STUDENT FORGOT PASSWORD
   ====================================================== */

app.post("/api/auth/password-reset/request", async (req, res) => {
  try {
    const { email } = req.body || {};

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await findAuthUserByEmail(normalizedEmail);

    // Use the same response whether the account exists or not.
    if (!user) {
      return res.json({
        success: true,
        message:
          "If an account exists for that email, a reset code will be sent.",
      });
    }

    const code = createPasswordResetCode(normalizedEmail);
    await sendVerificationCode(normalizedEmail, code);

    return res.json({
      success: true,
      message: "If an account exists for that email, a reset code will be sent.",
    });
  } catch (error) {
    console.error("Password reset request error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not send the reset code. Please try again.",
    });
  }
});

app.post("/api/auth/password-reset/verify", async (req, res) => {
  try {
    const { email, code } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof code !== "string" ||
      !email.trim() ||
      !code.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and reset code are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await findAuthUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code.",
      });
    }

    const result = verifyPasswordResetCode(
      normalizedEmail,
      code.trim()
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json({
      success: true,
      resetToken: result.resetToken,
      message: "Code verified. You can now set a new password.",
    });
  } catch (error) {
    console.error("Password reset verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not verify the reset code.",
    });
  }
});

app.post("/api/auth/password-reset/complete", async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof resetToken !== "string" ||
      typeof newPassword !== "string" ||
      !email.trim() ||
      !resetToken.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email, reset token, and new password are required.",
      });
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 128 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await findAuthUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset authorization.",
      });
    }

    const authorized = consumePasswordResetToken(
      normalizedEmail,
      resetToken.trim()
    );

    if (!authorized.success) {
      return res.status(400).json(authorized);
    }

    const { error } = await adminClient.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) {
      console.error("Password update error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not update your password. Please request a new code.",
      });
    }

    return res.json({
      success: true,
      message: "Password changed successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Password reset completion error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not change your password. Please try again.",
    });
  }
});


/* ======================================================
   CODE RUNNER CONFIGURATION
   ====================================================== */
const JUDGE0_URL = (
  process.env.JUDGE0_URL || "https://ce.judge0.com"
).replace(/\/+$/, "");

const CODE_LANGUAGES = {
  python: 71,
  cpp: 54,
  javascript: 63,
};

const executionCache = new Map();
const EXECUTION_CACHE_TTL_MS = 30_000;
const EXECUTION_CACHE_MAX_SIZE = 100;

/* ======================================================
   SERVER-DEFINED LESSON TESTS
   ====================================================== */
const LESSON_TESTS = {
  // Python Fundamentals — 30 lessons
  // ======================================================
// PYTHON FUNDAMENTALS — 30 LESSONS
// Matches src/courseData.ts
// ======================================================

"python:python-1": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "Hello, CodeMentor!",
      type: "exact",
    },
  ],
},

"python:python-2": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "Notebook\n50",
      type: "exact",
    },
  ],
},

"python:python-3": {
  language: "python",
  tests: [
    {
      stdin: "Notebook\n3\n",
      expected: "Product: Notebook\nQuantity: 3",
      type: "exact",
    },
  ],
},

"python:python-4": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "Positive",
      type: "exact",
    },
  ],
},

"python:python-5": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
      type: "exact",
    },
  ],
},

"python:python-6": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "22\n85\n3\n2",
      type: "numbers",
    },
  ],
},

"python:python-7": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "PYTHON",
      type: "exact",
    },
  ],
},

"python:python-8": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "['Python', 'C++', 'JavaScript', 'Java']",
      type: "exact",
    },
  ],
},

"python:python-9": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "[1, 2, 3, 4]",
      type: "exact",
    },
  ],
},

"python:python-10": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "Python",
      type: "exact",
    },
  ],
},

"python:python-11": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "Student A",
      type: "exact",
    },
  ],
},

"python:python-12": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "16",
      type: "exact",
    },
  ],
},

"python:python-13": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "24",
      type: "exact",
    },
  ],
},

"python:python-14": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "36",
      type: "exact",
    },
  ],
},

"python:python-15": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "24",
      type: "exact",
    },
  ],
},

"python:python-16": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "[1, 4, 9, 16, 25]",
      type: "exact",
    },
  ],
},

"python:python-17": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "1\n2\n3\n4\n6\n7\n8\n9\n10",
      type: "exact",
    },
  ],
},

"python:python-18": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "12.0",
      type: "exact",
    },
  ],
},

"python:python-19": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "123",
      type: "exact",
    },
  ],
},

"python:python-20": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "Hello Python",
      type: "exact",
    },
  ],
},

"python:python-21": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "Woof",
      type: "exact",
    },
  ],
},

"python:python-22": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "Meow",
      type: "exact",
    },
  ],
},

"python:python-23": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "12",
      type: "exact",
    },
  ],
},

"python:python-24": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "4",
      type: "exact",
    },
  ],
},

"python:python-25": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "[1, 2, 3, 4]",
      type: "exact",
    },
  ],
},

"python:python-26": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "Start\nWorking",
      type: "exact",
    },
  ],
},

"python:python-27": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "[1, 2, 5, 8]",
      type: "exact",
    },
  ],
},

"python:python-28": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "10",
      type: "exact",
    },
  ],
},

"python:python-29": {
  language: "python",
  tests: [
    {
      stdin: "",
      expected: "All checks passed",
      type: "exact",
    },
  ],
},

"python:python-30": {
  language: "python",
  tests: [
    {
      stdin: "mars\n7\n",
      expected: "Score: 2 / 2",
      type: "contains",
    },
  ],
},

  
  // ======================================================
  // C++ & DSA — 50 LESSONS
  // Matches courseData.ts
  // ======================================================

  "cpp:cpp-1": {
    language: "cpp",
    tests: [{ stdin: "", expected: "Hello, CodeMentor!", type: "exact" }],
  },

  "cpp:cpp-2": {
    language: "cpp",
    tests: [{ stdin: "", expected: "Alex\n20", type: "exact" }],
  },

  "cpp:cpp-3": {
    language: "cpp",
    tests: [{ stdin: "8\n", expected: "Even", type: "exact" }],
  },

  "cpp:cpp-4": {
    language: "cpp",
    tests: [{ stdin: "", expected: "1 2 3 4 5", type: "exact" }],
  },

  "cpp:cpp-5": {
    language: "cpp",
    tests: [{ stdin: "", expected: "10", type: "exact" }],
  },

  "cpp:cpp-6": {
    language: "cpp",
    tests: [{ stdin: "25\n", expected: "25", type: "exact" }],
  },

  "cpp:cpp-7": {
    language: "cpp",
    tests: [{ stdin: "", expected: "10", type: "exact" }],
  },

  "cpp:cpp-8": {
    language: "cpp",
    tests: [{ stdin: "", expected: "1 2 3 4 5", type: "exact" }],
  },

  "cpp:cpp-9": {
    language: "cpp",
    tests: [{ stdin: "", expected: "24", type: "exact" }],
  },

  "cpp:cpp-10": {
    language: "cpp",
    tests: [{ stdin: "", expected: "4", type: "exact" }],
  },

  "cpp:cpp-11": {
    language: "cpp",
    tests: [{ stdin: "", expected: "*\n**\n***", type: "exact" }],
  },

  "cpp:cpp-12": {
    language: "cpp",
    tests: [{ stdin: "", expected: "1 2 4 5", type: "exact" }],
  },

  "cpp:cpp-13": {
    language: "cpp",
    tests: [{ stdin: "", expected: "25", type: "exact" }],
  },

  "cpp:cpp-14": {
    language: "cpp",
    tests: [{ stdin: "", expected: "12\n10", type: "exact" }],
  },

  "cpp:cpp-15": {
    language: "cpp",
    tests: [{ stdin: "", expected: "15", type: "exact" }],
  },

  "cpp:cpp-16": {
    language: "cpp",
    tests: [{ stdin: "", expected: "10", type: "exact" }],
  },

  "cpp:cpp-17": {
    language: "cpp",
    tests: [{ stdin: "", expected: "10 20 30 40", type: "exact" }],
  },

  "cpp:cpp-18": {
    language: "cpp",
    tests: [{ stdin: "", expected: "15", type: "exact" }],
  },

  "cpp:cpp-19": {
    language: "cpp",
    tests: [{ stdin: "", expected: "42", type: "exact" }],
  },

  "cpp:cpp-20": {
    language: "cpp",
    tests: [{ stdin: "", expected: "100", type: "exact" }],
  },

  "cpp:cpp-21": {
    language: "cpp",
    tests: [{ stdin: "", expected: "200", type: "exact" }],
  },

  "cpp:cpp-22": {
    language: "cpp",
    tests: [{ stdin: "", expected: "20", type: "exact" }],
  },

  "cpp:cpp-23": {
    language: "cpp",
    tests: [{ stdin: "", expected: "500", type: "exact" }],
  },

  "cpp:cpp-24": {
    language: "cpp",
    tests: [{ stdin: "", expected: "20", type: "exact" }],
  },

  "cpp:cpp-25": {
    language: "cpp",
    tests: [{ stdin: "", expected: "Vehicle started", type: "exact" }],
  },

  "cpp:cpp-26": {
    language: "cpp",
    tests: [{ stdin: "", expected: "Circle", type: "exact" }],
  },

  "cpp:cpp-27": {
    language: "cpp",
    tests: [{ stdin: "", expected: "Fan powered", type: "exact" }],
  },

  "cpp:cpp-28": {
    language: "cpp",
    tests: [{ stdin: "", expected: "5", type: "exact" }],
  },

  "cpp:cpp-29": {
    language: "cpp",
    tests: [{ stdin: "", expected: "3", type: "exact" }],
  },

  "cpp:cpp-30": {
    language: "cpp",
    tests: [{ stdin: "", expected: "3", type: "exact" }],
  },

  "cpp:cpp-31": {
    language: "cpp",
    tests: [{ stdin: "", expected: "Invalid operation", type: "exact" }],
  },

  "cpp:cpp-32": {
    language: "cpp",
    tests: [{ stdin: "", expected: "1 2 3 4", type: "exact" }],
  },

  "cpp:cpp-33": {
    language: "cpp",
    tests: [{ stdin: "", expected: "90", type: "exact" }],
  },

  "cpp:cpp-34": {
    language: "cpp",
    tests: [{ stdin: "", expected: "20", type: "exact" }],
  },

  "cpp:cpp-35": {
    language: "cpp",
    tests: [{ stdin: "", expected: "Notebook\n50", type: "exact" }],
  },

  "cpp:cpp-36": {
    language: "cpp",
    tests: [{ stdin: "", expected: "3", type: "exact" }],
  },

  "cpp:cpp-37": {
    language: "cpp",
    tests: [{ stdin: "", expected: "File written", type: "exact" }],
  },

  "cpp:cpp-38": {
    language: "cpp",
    tests: [{ stdin: "", expected: "2 4 6", type: "exact" }],
  },

  "cpp:cpp-39": {
    language: "cpp",
    tests: [{ stdin: "", expected: "25", type: "exact" }],
  },

  "cpp:cpp-40": {
    language: "cpp",
    tests: [{ stdin: "", expected: "0 1 2 3 4", type: "exact" }],
  },

  "cpp:cpp-41": {
    language: "cpp",
    tests: [{ stdin: "", expected: "2", type: "exact" }],
  },

  "cpp:cpp-42": {
    language: "cpp",
    tests: [{ stdin: "", expected: "3", type: "exact" }],
  },

  "cpp:cpp-43": {
    language: "cpp",
    tests: [{ stdin: "", expected: "1 2 4 5", type: "exact" }],
  },

  "cpp:cpp-44": {
    language: "cpp",
    tests: [{ stdin: "", expected: "5 4 2 1", type: "exact" }],
  },

  "cpp:cpp-45": {
    language: "cpp",
    tests: [{ stdin: "", expected: "15", type: "exact" }],
  },

  "cpp:cpp-46": {
    language: "cpp",
    tests: [{ stdin: "", expected: "10 20", type: "exact" }],
  },

  "cpp:cpp-47": {
    language: "cpp",
    tests: [{ stdin: "", expected: "1 2 3", type: "exact" }],
  },

  "cpp:cpp-48": {
    language: "cpp",
    tests: [{ stdin: "", expected: "0 1 2 3", type: "exact" }],
  },

  "cpp:cpp-49": {
    language: "cpp",
    tests: [{ stdin: "", expected: "A\n90", type: "exact" }],
  },

  "cpp:cpp-50": {
    language: "cpp",
    tests: [{ stdin: "", expected: "Found.", type: "exact" }],
  },
};



  const WEB_LESSON_TESTS = {
    // =========================
    // HTML — Lessons 1–15
    // =========================

    "web:web-1": {
      language: "html",
      tests: [
        { expected: "<h1>My First Website</h1>", type: "contains" },
        { expected: "<p>Welcome to my website!</p>", type: "contains" },
      ],
    },

    "web:web-2": {
      language: "html",
      tests: [
        { expected: "<h1>Technology News</h1>", type: "contains" },
        { expected: "Discover the latest technology updates.", type: "contains" },
      ],
    },

    "web:web-3": {
      language: "html",
      tests: [
        { expected: "<!DOCTYPE html>", type: "contains" },
        { expected: "<html", type: "contains" },
        { expected: "<head", type: "contains" },
        { expected: "<title>Student Portal</title>", type: "contains" },
        { expected: "<body", type: "contains" },
        { expected: "<h1>Student Portal</h1>", type: "contains" },
      ],
    },

    "web:web-4": {
      language: "html",
      tests: [
        { expected: "<h1>Programming</h1>", type: "contains" },
        { expected: "<h2>Web Development</h2>", type: "contains" },
        { expected: "<h3>HTML Basics</h3>", type: "contains" },
      ],
    },

    "web:web-5": {
      language: "html",
      tests: [
        { expected: "<p>Learn HTML</p>", type: "contains" },
        { expected: "<p>Build your first webpage.</p>", type: "contains" },
        { expected: "Line one", type: "contains" },
        { expected: "Line two", type: "contains" },
        { expected: "<br", type: "contains" },
      ],
    },

    "web:web-6": {
      language: "html",
      tests: [
        { expected: "<strong>Important notice</strong>", type: "contains" },
        { expected: "<em>Read carefully</em>", type: "contains" },
        { expected: "<mark>Special offer</mark>", type: "contains" },
        { expected: "<del>₹999</del>", type: "contains" },
      ],
    },

    "web:web-7": {
      language: "html",
      tests: [
        { expected: "<a", type: "contains" },
        { expected: 'href="https://example.com"', type: "contains" },
        { expected: "Visit Example", type: "contains" },
      ],
    },

    "web:web-8": {
      language: "html",
      tests: [
        { expected: "<img", type: "contains" },
        { expected: 'src="product.jpg"', type: "contains" },
        { expected: 'alt="Blue backpack"', type: "contains" },
      ],
    },

    "web:web-9": {
      language: "html",
      tests: [
        { expected: "<ul", type: "contains" },
        { expected: "<ol", type: "contains" },
        { expected: "<li>HTML</li>", type: "contains" },
        { expected: "<li>CSS</li>", type: "contains" },
        { expected: "<li>Choose product</li>", type: "contains" },
        { expected: "<li>Checkout</li>", type: "contains" },
      ],
    },

    "web:web-10": {
      language: "html",
      tests: [
        { expected: "<table", type: "contains" },
        { expected: "<th>Subject</th>", type: "contains" },
        { expected: "<th>Marks</th>", type: "contains" },
        { expected: "<td>Maths</td>", type: "contains" },
        { expected: "<td>90</td>", type: "contains" },
      ],
    },

    "web:web-11": {
      language: "html",
      tests: [
        { expected: "<form", type: "contains" },
        { expected: "<label", type: "contains" },
        { expected: "Username", type: "contains" },
        { expected: 'type="text"', type: "contains" },
        { expected: 'type="submit"', type: "contains" },
        { expected: "Submit", type: "contains" },
      ],
    },

    "web:web-12": {
      language: "html",
      tests: [
        { expected: 'type="email"', type: "contains" },
        { expected: 'type="password"', type: "contains" },
        { expected: 'type="number"', type: "contains" },
        { expected: "required", type: "contains" },
        { expected: "min=", type: "contains" },
        { expected: "max=", type: "contains" },
        { expected: "100", type: "contains" },
      ],
    },

    "web:web-13": {
      language: "html",
      tests: [
        { expected: "<header", type: "contains" },
        { expected: "<nav", type: "contains" },
        { expected: "<main", type: "contains" },
        { expected: "<article", type: "contains" },
        { expected: "<footer", type: "contains" },
        { expected: "My Website", type: "contains" },
        { expected: "Home", type: "contains" },
        { expected: "Courses", type: "contains" },
        { expected: "Latest updates", type: "contains" },
        { expected: "Contact us", type: "contains" },
      ],
    },

    "web:web-14": {
      language: "html",
      tests: [
        { expected: "<audio", type: "contains" },
        { expected: 'src="lesson.mp3"', type: "contains" },
        { expected: "<video", type: "contains" },
        { expected: 'src="lesson.mp4"', type: "contains" },
        { expected: "controls", type: "contains" },
      ],
    },

    "web:web-15": {
      language: "html",
      tests: [
        { expected: "<h1>Student Profile</h1>", type: "contains" },
        { expected: "I am learning web development.", type: "contains" },
        { expected: "<h2>Skills</h2>", type: "contains" },
        { expected: "<li>HTML</li>", type: "contains" },
        { expected: "<li>CSS</li>", type: "contains" },
      ],
    },

    // =========================
    // CSS — Lessons 16–30
    // =========================

    "web:web-16": {
      language: "css",
      tests: [
        { expected: "h1{color:blue}", type: "contains" },
      ],
    },

    "web:web-17": {
      language: "css",
      tests: [
        { expected: ".card{color:green}", type: "contains" },
        { expected: "#title{color:blue}", type: "contains" },
        { expected: "p{font-size:16px}", type: "contains" },
      ],
    },

    "web:web-18": {
      language: "css",
      tests: [
        { expected: "body{background-color:#f0f0f0}", type: "contains" },
        { expected: "h1{color:#222222}", type: "contains" },
      ],
    },

    "web:web-19": {
      language: "css",
      tests: [
        { expected: "font-family:arial", type: "contains" },
        { expected: "font-size:18px", type: "contains" },
        { expected: "line-height:1.5", type: "contains" },
      ],
    },

    "web:web-20": {
    language: "css",
    tests: [
      { expected: "padding:20px", type: "contains" },
      { expected: "border:1pxsolidblack", type: "contains" },
      { expected: "margin:10px", type: "contains" },
      { expected: "box-sizing:border-box", type: "contains" },
    ],
  },

    "web:web-21": {
      language: "css",
      tests: [
        { expected: "width:80%", type: "contains" },
        { expected: "min-height:200px", type: "contains" },
        { expected: "padding:1rem", type: "contains" },
      ],
    },

    "web:web-22": {
      language: "css",
      tests: [
        { expected: ".block{display:block}", type: "contains" },
        { expected: ".inline{display:inline}", type: "contains" },
        { expected: ".hidden{display:none}", type: "contains" },
      ],
    },

    "web:web-23": {
      language: "css",
      tests: [
        { expected: "position:sticky", type: "contains" },
        { expected: "top:0", type: "contains" },
        { expected: "position:absolute", type: "contains" },
        { expected: "top:10px", type: "contains" },
        { expected: "right:10px", type: "contains" },
      ],
    },

    "web:web-24": {
      language: "css",
      tests: [
        { expected: "display:flex", type: "contains" },
        { expected: "justify-content:space-between", type: "contains" },
        { expected: "align-items:center", type: "contains" },
        { expected: "gap:16px", type: "contains" },
      ],
    },

    "web:web-25": {
      language: "css",
      tests: [
        { expected: "display:grid", type: "contains" },
        { expected: "grid-template-columns:repeat(3,1fr)", type: "contains" },
        { expected: "gap:20px", type: "contains" },
      ],
    },

    "web:web-26": {
      language: "css",
      tests: [
        { expected: "border:1pxsolid#dddddd", type: "contains" },
        { expected: "border-radius:12px", type: "contains" },
        { expected: "box-shadow:0 4px 8px rgba(0,0,0,0.1)", type: "contains" },
      ],
    },

    "web:web-27": {
      language: "css",
      tests: [
        { expected: "button{", type: "contains" },
        { expected: "background-color:blue", type: "contains" },
        { expected: "color:white", type: "contains" },
        { expected: "button:hover{", type: "contains" },
        { expected: "background-color:darkblue", type: "contains" },
      ],
    },

    "web:web-28": {
      language: "css",
      tests: [
        { expected: "transition:background-color 0.3s ease", type: "contains" },
        { expected: "@keyframesfadein", type: "contains" },
        { expected: "from{opacity:0}", type: "contains" },
        { expected: "to{opacity:1}", type: "contains" },
      ],
    },

    "web:web-29": {
      language: "css",
      tests: [
        { expected: ".container{width:90%", type: "contains" },
        
        { expected: "@media", type: "contains" },
        { expected: "max-width:600px", type: "contains" },
        { expected: "width:100%", type: "contains" },
      ],
    },

    "web:web-30": {
      language: "css",
      tests: [
        { expected: "--primary-color:#2563eb", type: "contains" },
        { expected: "background-color:var(--primary-color)", type: "contains" },
      ],
    },

    // =========================
    // JAVASCRIPT — Lessons 31–50
    // =========================

    "web:web-31": {
    language: "javascript",
    tests: [
      { expected: "Hello, JavaScript!", type: "contains" },
    ],
  },
    "web:web-32": {
    language: "javascript",
    tests: [
      { expected: 'const product = "Notebook"', type: "contains" },
      { expected: "let quantity = 2", type: "contains" },
      { expected: "console.log(product, quantity)", type: "contains" },
      { expected: "Notebook", type: "contains" },
    ],
  },
    "web:web-33": {
      language: "javascript",
      tests: [
        { expected: "typeof", type: "contains" },
        { expected: '"Hello"', type: "contains" },
        { expected: "42", type: "contains" },
        { expected: "true", type: "contains" },
      ],
    },

    "web:web-34": {
      language: "javascript",
      tests: [
        { expected: "price=100", type: "contains" },
        { expected: "quantity=3", type: "contains" },
        { expected: "price*quantity", type: "contains" },
        { expected: "price>50", type: "contains" },
      ],
    },

    "web:web-35": {
      language: "javascript",
      tests: [
        { expected: "if", type: "contains" },
        { expected: "score>=50", type: "contains" },
        { expected: "Pass", type: "contains" },
        { expected: "Try again", type: "contains" },
        { expected: "75", type: "contains" },
      ],
    },

    "web:web-36": {
      language: "javascript",
      tests: [
        { expected: "for", type: "contains" },
        { expected: "i<=5", type: "contains" },
        { expected: "console.log(i)", type: "contains" },
      ],
    },

    "web:web-37": {
      language: "javascript",
      tests: [
        { expected: "function add", type: "contains" },
        { expected: "return", type: "contains" },
        { expected: "add(4,6)", type: "contains" },
        { expected: "console.log", type: "contains" },
      ],
    },

    "web:web-38": {
      language: "javascript",
      tests: [
        { expected: '"HTML"', type: "contains" },
        { expected: '"CSS"', type: "contains" },
        { expected: '"JavaScript"', type: "contains" },
        { expected: "console.log", type: "contains" },
        { expected: ".length", type: "contains" },
      ],
    },

    "web:web-39": {
      language: "javascript",
      tests: [
        { expected: "[1,2,3]", type: "contains" },
        { expected: ".push(4)", type: "contains" },
        { expected: ".join(", type: "contains" },
        { expected: ".includes(3)", type: "contains" },
      ],
    },

  "web:web-40": {
    language: "javascript",
    tests: [
      {
        expected: "Notebook 50",
        type: "exact",
        target: "output",
      },
    ],
  },
    "web:web-41": {
  language: "javascript",
  tests: [
    {
      expected: 'document.getelementbyid("title")',
      type: "contains",
    },
    {
      expected: "textcontent",
      type: "contains",
    },
    {
      expected: "console.log(",
      type: "contains",
    },
  ],
},

    "web:web-42": {
      language: "javascript",
      tests: [
        { expected: 'document.getelementbyid("btn")', type: "contains" },
        { expected: "addeventlistener", type: "contains" },
        { expected: "click", type: "contains" },
        { expected: "Button clicked", type: "contains" },
      ],
    },

    "web:web-43": {
      language: "javascript",
      tests: [
        { expected: 'document.getelementbyid("status")', type: "contains" },
        { expected: ".textcontent", type: "contains" },
        { expected: "Saved successfully", type: "contains" },
      ],
    },

    "web:web-44": {
  language: "javascript",
  tests: [
    { expected: 'getElementById("myForm")', type: "contains" },
    { expected: 'addEventListener("submit"', type: "contains" },
    { expected: "preventDefault()", type: "contains" },
    { expected: "Form submitted", type: "contains" },
  ],
},

    "web:web-45": {
      language: "javascript",
      tests: [
        { expected: "JSON.parse", type: "contains" },
        { expected: "Notebook", type: "contains" },
        { expected: "price", type: "contains" },
        { expected: "console.log", type: "contains" },
      ],
    },

   "web:web-46": {
  language: "javascript",
  tests: [
    { expected: 'fetch("/api/message")', type: "contains" },
    { expected: "response.ok", type: "contains" },
    { expected: "response.json()", type: "contains" },
    { expected: "data.message", type: "contains" },
    { expected: ".catch(", type: "contains" },
  ],
},

    "web:web-47": {
  language: "javascript",
  tests: [
    { expected: "async function", type: "contains" },
    { expected: "await Promise.resolve", type: "contains" },
    { expected: "Data loaded", type: "contains" },
    { expected: "console.log", type: "contains" },
  ],
},

    "web:web-48": {
      language: "javascript",
      tests: [
        { expected: "localstorage.setitem", type: "contains" },
        { expected: '"theme"', type: "contains" },
        { expected: '"dark"', type: "contains" },
        { expected: "localstorage.getitem", type: "contains" },
        { expected: "console.log", type: "contains" },
      ],
    },

    "web:web-49": {
      language: "javascript",
      tests: [
        { expected: "function addtask", type: "contains" },
        { expected: "Learn HTML", type: "contains" },
        { expected: "Practice CSS", type: "contains" },
        { expected: "tasks", type: "contains" },
      ],
    },

    "web:web-50": {
      language: "javascript",
      tests: [
        { expected: "Portfolio", type: "contains" },
        { expected: "To-Do List", type: "contains" },
        { expected: "Weather App", type: "contains" },
        { expected: "My Portfolio", type: "contains" },
        { expected: "Projects:", type: "contains" },
      ],
    },
  };

  function validateWebLesson(lessonId, code) {
    const testConfig = WEB_LESSON_TESTS[`web:${lessonId}`];

    if (!testConfig) {
      return {
        status: "Not Configured",
        passed: false,
        total: 0,
        passedCount: 0,
        message: `No web tests found for ${lessonId}.`,
        testResults: [],
        stdout: "",
        stderr: "",
      };
    }

    const source = String(code ?? "")
    .toLowerCase()
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, "")
    .replace(/;}/g, "}");

    const testResults = testConfig.tests.map((test, index) => {
      const expected = String(test.expected ?? "")
        .toLowerCase()
        .replace(/\s+/g, "");

      const passed =
        test.type === "contains" &&
        expected.length > 0 &&
        source.includes(expected);

      return {
        name: `CSS check ${index + 1}`,
        passed,
        expected: test.expected,
        status: passed ? "Passed" : "Failed",
      };
    });

    const passedCount = testResults.filter(
      (test) => test.passed
    ).length;

    const allPassed =
      testResults.length > 0 &&
      passedCount === testResults.length;

    return {
      status: allPassed ? "Accepted" : "Wrong Answer",
      passed: allPassed,
      total: testResults.length,
      passedCount,
      testResults,
      stdout: `${passedCount}/${testResults.length} source checks passed.`,
      stderr: "",
      message: allPassed
        ? "All Web source checks passed."
        : "Some source checks did not pass. Review your code.",
    };
  }
  // ======================================================
  // CODE RUNNER — Python, C++, JavaScript, HTML and CSS
  // ======================================================

  function normalizeOutput(value) {
    return String(value ?? "")
      .replace(/\r\n/g, "\n")
      .trim();
  }

  function extractNumbers(value) {
    return (String(value ?? "").match(/-?\d+(?:\.\d+)?/g) || [])
      .map(Number);
  }

  function validateLesson(lessonId, language, output) {
  const config =
    language === "javascript" && lessonId.startsWith("web-")
      ? WEB_LESSON_TESTS[`web:${lessonId}`]
      : LESSON_TESTS[`${lessonId}`] ||
        LESSON_TESTS[`${language}:${lessonId}`];

    if (!config) {
      return {
        passed: false,
        status: "Not Configured",
        testsPassed: 0,
        totalTests: 0,
        testResults: [],
        message: "No tests are configured for this lesson.",
      };
    }

    const actual = normalizeOutput(output);

    const testResults = config.tests.map((test, index) => {
      const expected = normalizeOutput(test.expected);

      let passed = false;

      if (test.type === "exact") {
        passed = actual === expected;
      } else if (test.type === "contains") {
        passed = actual.includes(expected);
      } else if (test.type === "numbers") {
        passed =
          JSON.stringify(extractNumbers(actual)) ===
          JSON.stringify(extractNumbers(expected));
      }

      return {
        name: `Test ${index + 1}`,
        passed,
        expected: test.expected,
        actual,
        status: passed ? "Passed" : "Failed",
      };
    });

    const testsPassed = testResults.filter((test) => test.passed).length;
    const totalTests = testResults.length;
    const passed = totalTests > 0 && testsPassed === totalTests;

    return {
      passed,
      status: passed ? "Accepted" : "Wrong Answer",
      testsPassed,
      totalTests,
      testResults,
      message: passed
        ? "All challenge tests passed!"
        : "Some tests failed. Review your solution.",
    };
  }
  function validateJavaScriptWebLesson(lessonId, code, output) {
    const config = WEB_LESSON_TESTS[`web:${lessonId}`];

    if (!config || config.language !== "javascript") {
      return {
        passed: false,
        status: "Not Configured",
        testsPassed: 0,
        totalTests: 0,
        testResults: [],
        message: `No JavaScript tests configured for ${lessonId}.`,
      };
    }

    const source = String(code ?? "");
    const actualOutput = normalizeOutput(output);

    const testResults = config.tests.map((test, index) => {
      const expected = normalizeOutput(test.expected);

      // Source-code checks
      const isSourceCheck =
    test.source === true ||
    /const |let |var |console\.log|function |=>|return |document\.|typeof|class |"Hello"|'Hello'/.test(expected) ||
    (lessonId === "web-33" && ["42", "true"].includes(expected));

      const passed = isSourceCheck
        ? source.includes(expected)
        : test.type === "exact"
          ? actualOutput === expected
          : test.type === "contains"
            ? actualOutput.includes(expected)
            : test.type === "numbers"
              ? JSON.stringify(extractNumbers(actualOutput)) ===
                JSON.stringify(extractNumbers(expected))
              : false;

      return {
        name: `Test ${index + 1}`,
        passed,
        expected: test.expected,
        actual: isSourceCheck ? source : actualOutput,
        status: passed ? "Passed" : "Failed",
      };
    });

    const testsPassed = testResults.filter(test => test.passed).length;
    const totalTests = testResults.length;
    const passed = totalTests > 0 && testsPassed === totalTests;

    return {
      passed,
      status: passed ? "Accepted" : "Wrong Answer",
      testsPassed,
      totalTests,
      testResults,
      message: passed
        ? "All JavaScript Web tests passed!"
        : "Some tests failed. Review your solution.",
    };
  }
  async function executeCode(language, code, stdin = "") {
    const languageId = CODE_LANGUAGES[language];

    if (!languageId) {
      throw new Error("Unsupported programming language.");
    }

    const response = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Judge0 returned HTTP ${response.status}.`);
    }

    const result = await response.json();

    return {
      status: result.status?.description || "Failed",
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compileOutput: result.compile_output || "",
      time: result.time || null,
      memory: result.memory || null,
    };
  }

  async function validateConfiguredLesson({
  courseId,
  lessonId,
  language,
  code,
  html = "",
  css = "",
  javascript = "",
  executionCode = code,
  stdin = "",
}) {
    const config =
  courseId === "web"
    ? WEB_LESSON_TESTS[`web:${lessonId}`]
    : LESSON_TESTS[`${courseId}:${lessonId}`] ||
      LESSON_TESTS[lessonId];

const isWeb = courseId === "web";

const combinedWebSource = `
${html}
${css}
${javascript}
`.toLowerCase();

    if (
  !config ||
  (!isWeb && config.language !== language) ||
  !Array.isArray(config.tests)
) {
      return {
        passed: false,
        status: "Not Configured",
        testsPassed: 0,
        totalTests: 0,
        testResults: [],
        output: "",
        message: `No matching tests configured for ${courseId}:${lessonId}.`,
      };
    }

    const normalizeSource = (value) => {
      let source = String(value ?? "").replace(/\r\n/g, "\n");

      if (language === "javascript" || language === "css") {
        source = source.toLowerCase();
      }

      if (language === "css") {
        source = source.replace(/\/\*[\s\S]*?\*\//g, "");
      }

      return source
        .replace(/\s+/g, "")
        .replace(/;}/g, "}");
    };

    const source = isWeb
  ? combinedWebSource.replace(/\s+/g, "").replace(/;}/g, "}")
  : normalizeSource(code);
    const outputCache = new Map();

    // Execute each distinct stdin input only once.
    for (const test of config.tests) {
      const target =
        test.target || (courseId === "web" ? "source" : "output");

      if (target !== "source" && target !== "output") {
        return {
          passed: false,
          status: "Invalid Configuration",
          testsPassed: 0,
          totalTests: config.tests.length,
          testResults: [],
          output: "",
          message: `Invalid test target: ${target}`,
        };
      }

      if (target === "output") {
        const testStdin =
          test.stdin === undefined ? String(stdin ?? "") : String(test.stdin);

        if (!outputCache.has(testStdin)) {
          const execution = await executeCode(language, executionCode, testStdin);

          if (execution.status !== "Accepted") {
            return {
              passed: false,
              status: execution.status,
              testsPassed: 0,
              totalTests: config.tests.length,
              testResults: [],
              output: normalizeOutput(execution.stdout),
              stderr: execution.stderr,
              compileOutput: execution.compileOutput,
              message: execution.stderr ||
                execution.compileOutput ||
                "Program execution failed.",
            };
          }

          outputCache.set(testStdin, execution);
        }
      }
    }

    const testResults = config.tests.map((test, index) => {
      const target =
        test.target || (courseId === "web" ? "source" : "output");

      const testStdin =
        test.stdin === undefined ? String(stdin ?? "") : String(test.stdin);

      const actual =
        target === "source"
          ? source
          : normalizeOutput(outputCache.get(testStdin)?.stdout);

     const expected =
  target === "source"
    ? isWeb
      ? String(test.expected ?? "")
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/;}/g, "}")
      : normalizeSource(test.expected)
    : normalizeOutput(test.expected);

      let passed = false;

      if (test.type === "exact") {
        passed = actual === expected;
      } else if (test.type === "contains") {
        passed = actual.includes(expected);
      } else if (test.type === "numbers") {
        passed =
          JSON.stringify(extractNumbers(actual)) ===
          JSON.stringify(extractNumbers(expected));
      }

      return {
        name: `Test ${index + 1}`,
        target,
        passed,
        expected: test.expected,
        actual,
        status: passed ? "Passed" : "Failed",
      };
    });

    const testsPassed = testResults.filter(test => test.passed).length;
    const totalTests = testResults.length;
    const passed = totalTests > 0 && testsPassed === totalTests;

    const firstExecution = outputCache.values().next().value;

    return {
      passed,
      status: passed ? "Accepted" : "Wrong Answer",
      testsPassed,
      totalTests,
      testResults,
      output: firstExecution
        ? normalizeOutput(firstExecution.stdout)
        : `${testsPassed}/${totalTests} source checks passed.`,
      time: firstExecution?.time || null,
      memory: firstExecution?.memory || null,
      message: passed
        ? "All challenge tests passed!"
        : "Some tests failed. Review your solution.",
    };
  }

  function validateWebChallenge(lessonId, code) {
    const config = WEB_LESSON_TESTS[`web:${lessonId}`];
  console.log("TEST CONFIG DEBUG:", {
    key: `web:${lessonId}`,
    found: Boolean(config),
    language: config?.language,
  });
    if (!config) {
      return {
        passed: false,
        status: "Not Configured",
        testsPassed: 0,
        totalTests: 0,
        testResults: [],
        message: "No Web tests are configured for this lesson.",
      };
    }

    const normalizeCSS = (value) =>
      String(value ?? "")
        .toLowerCase()
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, "")
        .replace(/;}/g, "}");

    const source = normalizeCSS(code);

    const testResults = config.tests.map((test, index) => {
      const expected = normalizeCSS(test.expected);

      const passed =
        test.type === "exact"
          ? source === expected
          : test.type === "contains"
            ? source.includes(expected)
            : false;

      return {
        name: `${config.language.toUpperCase()} check ${index + 1}`,
        passed,
        expected: test.expected,
        actual: code,
        status: passed ? "Passed" : "Failed",
      };
    });

    const testsPassed = testResults.filter(
      (test) => test.passed
    ).length;

    const totalTests = testResults.length;
    const passed = totalTests > 0 && testsPassed === totalTests;

    return {
      passed,
      status: passed ? "Accepted" : "Wrong Answer",
      testsPassed,
      totalTests,
      testResults,
      stdout: `${testsPassed}/${totalTests} source checks passed.`,
      message: passed
        ? "All Web challenge tests passed!"
        : "Some Web checks failed. Review your code.",
    };
  }

  app.post("/api/code/run", async (req, res) => {
    try {
      const user = await getAuthenticatedUser(req);

      if (!user) {
        return res.status(401).json({
          success: false,
          completed: false,
          message: "Please sign in again.",
        });
      }

      const {
  language,
  code,
  html = "",
  css = "",
  javascript = "",
  stdin = "",
  courseId,
  lessonId,
  mode,
} = req.body || {};
  console.log("CODE REQUEST:", { courseId, lessonId, language, mode });
      if (
        !["python", "cpp", "javascript", "html", "css"].includes(language) ||
        typeof code !== "string" ||
        !["run", "lesson"].includes(mode)
      ) {
        return res.status(400).json({
          success: false,
          completed: false,
          message: "Invalid code runner request.",
        });
      }

      if ( Buffer.byteLength(
  courseId === "web"
    ? String(html) + String(css) + String(javascript)
    : String(code),
  "utf8",
) > 8192||
          Buffer.byteLength(String(stdin), "utf8") > 2048) {
        return res.status(413).json({
          success: false,
          completed: false,
          message: "Code or input exceeds the allowed size.",
        });
      }
  const executionCode = code;
      // HTML and CSS use source validation, not Judge0.
    // Execute Web code in the real browser runner.
if (courseId === "web" && mode === "run") {
  const browserResult = await runWebCode({
    html,
    css,
    javascript,
  });

  const output = [
    ...(browserResult.logs || []),
    browserResult.text || "",
    ...(browserResult.errors || []).map(
      (error) => `Error: ${error}`
    ),
  ].filter(Boolean).join("\n");

  return res.json({
    success: true,
    completed: true,
    passed: false,
    status: browserResult.success
      ? browserResult.errors?.length
        ? "Runtime Error"
        : "Accepted"
      : "Runtime Error",
    output: output || "(No output produced)",
    previewHtml: browserResult.html || "",
    previewText: browserResult.text || "",
    message: browserResult.message || "",
  });
}
  // HTML and CSS use source validation.
  if (language === "html" || language === "css") {
    if (mode === "run") {
      return res.json({
        success: true,
        completed: true,
        status: "Accepted",
        output: "Preview updated successfully.",
        passed: false,
        testsPassed: 0,
        totalTests: 0,
        testResults: [],
      });
    }

    if (courseId !== "web") {
      return res.status(400).json({
        success: false,
        completed: false,
        message: "Invalid Web course.",
      });
    }
  }

  // Web course supports JavaScript, HTML and CSS.
  if (courseId === "web" && language !== "javascript" &&
      language !== "html" && language !== "css") {
    return res.status(400).json({
      success: false,
      completed: false,
      message: "Select a valid language for this Web lesson.",
    });
  }

  // Normal Run mode: execute once and show output.
  if (mode === "run") {
    const execution = await executeCode(language, executionCode, stdin);
    const output = normalizeOutput(execution.stdout);

    if (execution.status !== "Accepted") {
      return res.json({
        success: true,
        completed: true,
        passed: false,
        status: execution.status,
        output,
        stderr: execution.stderr,
        compileOutput: execution.compileOutput,
        time: execution.time,
        memory: execution.memory,
        testsPassed: 0,
        totalTests: 0,
        testResults: [],
      });
    }

    return res.json({
      success: true,
      completed: true,
      passed: false,
      status: "Accepted",
      output,
      time: execution.time,
      memory: execution.memory,
    });
  }

  // Centralized lesson validation for every course.
  const validation = await validateConfiguredLesson({
    courseId,
    lessonId,
    language,
    code,
    html,
    css,
    javascript,
    executionCode,
    stdin,
  });

  return res.json({
    success: true,
    completed: true,
    ...validation,
  });

    } catch (error) {
      console.error("Code runner error:", error);

      return res.status(500).json({
        success: false,
        completed: false,
        message: error.message || "Code execution failed.",
      });
    }
  });

  const MENTOR_ROLES = {
    "code-tutor": {
      title: "Code Tutor",
      instruction: `Teach programming concepts clearly to beginners. Explain definitions, syntax, examples, and common mistakes. Use step-by-step explanations and readable code examples.`
    },

    "debug-assistant": {
      title: "Debug Assistant",
      instruction: `Help students understand and fix programming errors. Explain the likely cause, why it happens, and show corrected examples. Never claim to have executed code unless you actually have.`
    },

    "project-mentor": {
      title: "Project Mentor",
      instruction: `Help students plan, build, test, and improve programming projects. Break projects into manageable milestones and explain files, components, and design decisions.`
    },

    "problem-solving-coach": {
      title: "Problem-Solving Coach",
      instruction: `Help students develop logical thinking. Explain problem analysis, inputs, outputs, algorithms, edge cases, and complexity using beginner-friendly steps.`
    }
  };
  function getGeminiModels() {
    return [
      "gemini-3.5-flash-lite",
      "gemini-3.6-flash",
      "gemini-3.8-flash"
    ];
  }

  app.post("/api/ai-tutor/chat", async (req, res) => {
    try {
      const user = await getAuthenticatedUser(req);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Please sign in again."
        });
      }

      const {
        message,
        mentorRole = "code-tutor",
        language = "Python",
        mode = "lesson",
        history = [],
        lessonTitle = "",
        code = ""
      } = req.body || {};

      if (typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please enter a message."
        });
      }

      if (message.length > 12000) {
        return res.status(400).json({
          success: false,
          message: "Message is too long."
        });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "Gemini API key is missing in backend configuration."
        });
      }

      const role = MENTOR_ROLES[mentorRole]
        ? mentorRole
        : "code-tutor";

      const mentor = MENTOR_ROLES[role];

      const safeHistory = Array.isArray(history)
        ? history
            .filter(item =>
              item &&
              ["user", "model"].includes(item.role) &&
              typeof item.text === "string"
            )
            .slice(-12)
            .map(item => ({
              role: item.role,
              parts: [{ text: item.text.slice(0, 4000) }]
            }))
        : [];

      const systemInstruction = `
  You are CodeMentor's ${mentor.title}.

  ${mentor.instruction}

  Programming language: ${String(language).slice(0, 50)}
  Learning mode: ${String(mode).slice(0, 50)}
  Lesson: ${String(lessonTitle).slice(0, 200)}

  Student's code, if provided:
  ${String(code).slice(0, 8000)}

  Be friendly, accurate, educational, and beginner-friendly.
  Use Markdown formatting and code blocks when useful.
  `;

      const contents = [
        ...safeHistory,
        {
          role: "user",
          parts: [{ text: message.trim() }]
        }
      ];

      const { GoogleGenAI } = await import("@google/genai");
      const client = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
      });

      let reply = "";
      let lastError = null;

      for (const model of getGeminiModels()) {
        try {
          const result = await client.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.5,
              maxOutputTokens: 2000
            }
          });

          reply = result.text || "";

          if (!reply.trim()) {
            throw new Error("Gemini returned an empty response.");
          }

          break;
        } catch (error) {
          lastError = error;
          console.error(`Gemini model ${model} failed:`, error.message);
        }
      }

      if (!reply.trim()) {
        throw lastError || new Error("All Gemini models failed.");
      }

      return res.json({
        success: true,
        mentorRole: role,
        mentorTitle: mentor.title,
        reply
      });

    } catch (error) {
      console.error("AI Tutor error:", error);

      return res.status(502).json({
        success: false,
        message: "AI Mentor could not generate a response. Please try again."
      });
    }
  });
  // ======================================================
  // CERTIFICATE REQUESTS — STUDENT + ADMIN
  // ======================================================

  const CERTIFICATE_COURSES = {
    python: {
      title: "Python Fundamentals",
      requiredCount: 30,
    },
    cpp: {
      title: "C++ & DSA",
      requiredCount: 50,
    },
    web: {
      title: "Complete Web Development",
      requiredCount: 50,
    },
  };

  // Count distinct completed lessons for one student/course.
  async function getCertificateEligibility(userId, courseId) {
    const course = CERTIFICATE_COURSES[courseId];

    if (!course) {
      return {
        completedCount: 0,
        requiredCount: 0,
        remainingCount: 0,
        eligible: false,
      };
    }

    const { data, error } = await adminClient
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .eq("completed", true);

    if (error) {
      throw error;
    }

    const completedCount = new Set(
      (data || []).map((item) => item.lesson_id)
    ).size;

    const requiredCount = course.requiredCount;

    return {
      completedCount,
      requiredCount,
      remainingCount: Math.max(0, requiredCount - completedCount),
      eligible: completedCount >= requiredCount,
    };
  }


  // ------------------------------------------------------
  // STUDENT: GET MY CERTIFICATE REQUESTS
  // ------------------------------------------------------

  app.get("/api/certificate-requests/mine", async (req, res) => {
    try {
      const user = await getAuthenticatedUser(req);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Please sign in again.",
        });
      }

      const { data, error } = await adminClient
        .from("certificate_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("requested_at", { ascending: false });

      if (error) {
        throw error;
      }

      return res.json({
        success: true,
        requests: data || [],
      });
    } catch (error) {
      console.error("Load student certificate requests error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not load certificate requests.",
      });
    }
  });


  // ------------------------------------------------------
  // STUDENT: SUBMIT CERTIFICATE REQUEST
  // ------------------------------------------------------

  app.post("/api/certificate-requests", async (req, res) => {
    try {
      const user = await getAuthenticatedUser(req);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Please sign in again.",
        });
      }

      const { courseId, studentName } = req.body || {};
      const course = CERTIFICATE_COURSES[courseId];

      if (!course) {
        return res.status(400).json({
          success: false,
          message: "Invalid certificate course.",
        });
      }

      const email = user.email;

      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        (typeof studentName === "string" ? studentName.trim() : "") ||
        email;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Your account email could not be found.",
        });
      }

      // Prevent duplicate requests for the same student/course.
      const { data: existing, error: existingError } = await adminClient
        .from("certificate_requests")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      if (existing) {
        return res.json({
          success: true,
          request: existing,
          message: "A certificate request already exists.",
        });
      }

      const { data, error } = await adminClient
        .from("certificate_requests")
        .insert({
          user_id: user.id,
          student_name: name,
          email,
          course_id: courseId,
          course_title: course.title,
          status: "pending",
          requested_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return res.status(201).json({
        success: true,
        request: data,
        message: "Certificate request submitted successfully.",
      });
    } catch (error) {
      console.error("Create certificate request error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not submit certificate request.",
      });
    }
  });


  // ------------------------------------------------------
  // ADMIN: GET CERTIFICATE REQUESTS
  // ------------------------------------------------------

  app.get(
    "/api/admin/certificate-requests",
    requireAdmin,
    async (req, res) => {
      try {
        const requestedStatus = req.query.status;

        let query = adminClient
          .from("certificate_requests")
          .select("*")
          .order("requested_at", { ascending: false });

        if (["pending", "sent"].includes(requestedStatus)) {
          query = query.eq("status", requestedStatus);
        }

        const { data: requests, error } = await query;

        if (error) {
          throw error;
        }

        const rows = requests || [];

        if (rows.length === 0) {
          return res.json({
            success: true,
            requests: [],
          });
        }

        const userIds = [...new Set(rows.map((row) => row.user_id))];
        const courseIds = [...new Set(rows.map((row) => row.course_id))];

        const { data: progress, error: progressError } = await adminClient
          .from("lesson_progress")
          .select("user_id,course_id,lesson_id")
          .in("user_id", userIds)
          .in("course_id", courseIds)
          .eq("completed", true);

        if (progressError) {
          throw progressError;
        }

        const completedLessons = new Map();

        for (const item of progress || []) {
          const key = `${item.user_id}:${item.course_id}`;

          if (!completedLessons.has(key)) {
            completedLessons.set(key, new Set());
          }

          completedLessons.get(key).add(item.lesson_id);
        }

        const enrichedRequests = rows.map((request) => {
          const course = CERTIFICATE_COURSES[request.course_id];

          const completedCount =
            completedLessons.get(
              `${request.user_id}:${request.course_id}`
            )?.size || 0;

          const requiredCount = course?.requiredCount || 0;

          return {
            ...request,
            completedCount,
            requiredCount,
            remainingCount: Math.max(
              0,
              requiredCount - completedCount
            ),
            eligible:
              requiredCount > 0 &&
              completedCount >= requiredCount,
          };
        });

        return res.json({
          success: true,
          requests: enrichedRequests,
        });
      } catch (error) {
        console.error("Load admin certificate requests error:", error);

        return res.status(500).json({
          success: false,
          message: "Could not load certificate requests.",
        });
      }
    }
  );


  // ------------------------------------------------------
  // ADMIN: MARK CERTIFICATE AS SENT
  // ------------------------------------------------------

  app.patch(
    "/api/admin/certificate-requests/:id",
    requireAdmin,
    async (req, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body || {};

        if (status !== "sent") {
          return res.status(400).json({
            success: false,
            message: "Invalid certificate status.",
          });
        }

        const { data: existing, error: findError } = await adminClient
          .from("certificate_requests")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (findError) {
          throw findError;
        }

        if (!existing) {
          return res.status(404).json({
            success: false,
            message: "Certificate request not found.",
          });
        }

        // Do not change the timestamp or overwrite an already-sent request.
        if (existing.status === "sent") {
          return res.json({
            success: true,
            request: existing,
            message: "Certificate is already marked as sent.",
          });
        }

        const eligibility = await getCertificateEligibility(
          existing.user_id,
          existing.course_id
        );

        if (!eligibility.eligible) {
          return res.status(400).json({
            success: false,
            message: "Student has not completed all required lessons.",
            ...eligibility,
          });
        }

        const { data, error } = await adminClient
          .from("certificate_requests")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select("*")
          .single();

        if (error) {
          throw error;
        }

        return res.json({
          success: true,
          request: data,
          message: "Certificate marked as sent.",
        });
      } catch (error) {
        console.error("Update certificate request error:", error);

        return res.status(500).json({
          success: false,
          message: "Could not update certificate request.",
        });
      }
    }
  );
  app.listen(PORT, () => {
    console.log(`CodeMentor backend running on port ${PORT}`);
  });


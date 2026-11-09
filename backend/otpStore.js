
const crypto = require("crypto");

const pendingLogins = new Map();
const pendingSignups = new Map();
const pendingPasswordResets = new Map();
const verifiedPasswordResets = new Map();

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const RESET_TOKEN_EXPIRY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const CODE_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function normalizeEmail(email) {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

function generateCode() {
  const bytes = crypto.randomBytes(6);
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += CODE_CHARACTERS[bytes[i] % CODE_CHARACTERS.length];
  }

  return code;
}

function hashCode(code, salt) {
  return crypto
    .createHash("sha256")
    .update(`${salt}:${code}`)
    .digest("hex");
}

function makeCodeRecord(code, extra = {}) {
  const salt = crypto.randomBytes(16).toString("hex");

  return {
    salt,
    codeHash: hashCode(code, salt),
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
    ...extra,
  };
}

function codeMatches(submittedCode, record) {
  if (
    typeof submittedCode !== "string" ||
    !record ||
    typeof record.salt !== "string" ||
    typeof record.codeHash !== "string"
  ) {
    return false;
  }

  const normalizedCode = submittedCode.trim().toUpperCase();

  if (!/^[A-Z0-9]{6}$/.test(normalizedCode)) {
    return false;
  }

  const expected = Buffer.from(record.codeHash, "hex");
  const actual = Buffer.from(hashCode(normalizedCode, record.salt), "hex");

  return (
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual)
  );
}

function createLoginCode(email, session) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new Error("A valid email is required.");
  }

  const code = generateCode();

  pendingLogins.set(
    normalizedEmail,
    makeCodeRecord(code, { session }),
  );

  return code;
}

function resendLoginCode(email) {
  const normalizedEmail = normalizeEmail(email);
  const existingRecord = pendingLogins.get(normalizedEmail);

  if (!existingRecord) {
    return null;
  }

  if (Date.now() > existingRecord.expiresAt) {
    pendingLogins.delete(normalizedEmail);
    return null;
  }

  // Generate a new code while preserving the original login session.
  const code = generateCode();

  pendingLogins.set(
    normalizedEmail,
    makeCodeRecord(code, {
      session: existingRecord.session,
    }),
  );

  return code;
}


function verifyLoginCode(email, submittedCode) {
  const normalizedEmail = normalizeEmail(email);
  const record = pendingLogins.get(normalizedEmail);

  if (!record) {
    return {
      success: false,
      message: "No pending verification code. Request a new code.",
    };
  }

  if (Date.now() > record.expiresAt) {
    pendingLogins.delete(normalizedEmail);

    return {
      success: false,
      message: "Verification code expired. Request a new code.",
    };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    pendingLogins.delete(normalizedEmail);

    return {
      success: false,
      message: "Too many attempts. Request a new code.",
    };
  }

  record.attempts += 1;

  if (!codeMatches(submittedCode, record)) {
    if (record.attempts >= MAX_ATTEMPTS) {
      pendingLogins.delete(normalizedEmail);
    }

    return {
      success: false,
      message: "Invalid verification code.",
    };
  }

  pendingLogins.delete(normalizedEmail);

  return {
    success: true,
    session: record.session,
  };
}

function createSignupCode(email, userId) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new Error("A valid email is required.");
  }

  const code = generateCode();

  pendingSignups.set(
    normalizedEmail,
    makeCodeRecord(code, { userId }),
  );

  return code;
}

function resendSignupCode(email) {
  const normalizedEmail = normalizeEmail(email);
  const existingRecord = pendingSignups.get(normalizedEmail);

  if (!existingRecord) {
    return null;
  }

  if (Date.now() > existingRecord.expiresAt) {
    pendingSignups.delete(normalizedEmail);
    return null;
  }

  const code = generateCode();

  pendingSignups.set(
    normalizedEmail,
    makeCodeRecord(code, { userId: existingRecord.userId }),
  );

  return code;
}

function verifySignupCode(email, submittedCode) {
  const normalizedEmail = normalizeEmail(email);
  const record = pendingSignups.get(normalizedEmail);

  if (!record) {
    return {
      success: false,
      message: "No pending signup code. Request a new code.",
    };
  }

  if (Date.now() > record.expiresAt) {
    pendingSignups.delete(normalizedEmail);

    return {
      success: false,
      message: "Verification code expired. Request a new code.",
    };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    pendingSignups.delete(normalizedEmail);

    return {
      success: false,
      message: "Too many attempts. Request a new code.",
    };
  }

  record.attempts += 1;

  if (!codeMatches(submittedCode, record)) {
    if (record.attempts >= MAX_ATTEMPTS) {
      pendingSignups.delete(normalizedEmail);
    }

    return {
      success: false,
      message: "Invalid verification code.",
    };
  }

  pendingSignups.delete(normalizedEmail);

  return {
    success: true,
    userId: record.userId,
  };
}

// ========================================
// ADMIN PASSWORD RESET
// ========================================

function createPasswordResetCode(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new Error("A valid email is required.");
  }

  // A new reset request invalidates any previous reset flow.
  verifiedPasswordResets.delete(normalizedEmail);

  const code = generateCode();

  pendingPasswordResets.set(
    normalizedEmail,
    makeCodeRecord(code),
  );

  return code;
}

function verifyPasswordResetCode(email, submittedCode) {
  const normalizedEmail = normalizeEmail(email);
  const record = pendingPasswordResets.get(normalizedEmail);

  if (!record) {
    return {
      success: false,
      message: "No pending password reset code. Request a new code.",
    };
  }

  if (Date.now() > record.expiresAt) {
    pendingPasswordResets.delete(normalizedEmail);

    return {
      success: false,
      message: "Verification code expired. Request a new code.",
    };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    pendingPasswordResets.delete(normalizedEmail);

    return {
      success: false,
      message: "Too many attempts. Request a new code.",
    };
  }

  record.attempts += 1;

  if (!codeMatches(submittedCode, record)) {
    if (record.attempts >= MAX_ATTEMPTS) {
      pendingPasswordResets.delete(normalizedEmail);
    }

    return {
      success: false,
      message: "Invalid verification code.",
    };
  }

  pendingPasswordResets.delete(normalizedEmail);

  // Generate a separate, short-lived token for the password update.
  const resetToken = crypto.randomBytes(32).toString("hex");
  const salt = crypto.randomBytes(16).toString("hex");

  verifiedPasswordResets.set(normalizedEmail, {
    salt,
    tokenHash: hashCode(resetToken, salt),
    expiresAt: Date.now() + RESET_TOKEN_EXPIRY_MS,
    attempts: 0,
  });

  return {
    success: true,
    resetToken,
  };
}

function consumePasswordResetToken(email, submittedToken) {
  const normalizedEmail = normalizeEmail(email);
  const record = verifiedPasswordResets.get(normalizedEmail);

  if (!record) {
    return {
      success: false,
      message: "Verify your reset code before changing the password.",
    };
  }

  if (Date.now() > record.expiresAt) {
    verifiedPasswordResets.delete(normalizedEmail);

    return {
      success: false,
      message: "Password reset authorization expired. Verify a new code.",
    };
  }

  if (
    record.attempts >= MAX_ATTEMPTS ||
    typeof submittedToken !== "string" ||
    !/^[a-f0-9]{64}$/i.test(submittedToken)
  ) {
    verifiedPasswordResets.delete(normalizedEmail);

    return {
      success: false,
      message: "Invalid or expired password reset authorization.",
    };
  }

  record.attempts += 1;

  const expected = Buffer.from(record.tokenHash, "hex");
  const actual = Buffer.from(
    hashCode(submittedToken, record.salt),
    "hex",
  );

  const matches =
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual);

  if (!matches) {
    if (record.attempts >= MAX_ATTEMPTS) {
      verifiedPasswordResets.delete(normalizedEmail);
    }

    return {
      success: false,
      message: "Invalid password reset authorization.",
    };
  }

  // One-time use: this authorization cannot be reused.
  verifiedPasswordResets.delete(normalizedEmail);

  return { success: true };
}

module.exports = {
  createLoginCode,
  resendLoginCode,
  verifyLoginCode,
  createSignupCode,
  resendSignupCode,
  verifySignupCode,
  createPasswordResetCode,
  verifyPasswordResetCode,
  consumePasswordResetToken,
};

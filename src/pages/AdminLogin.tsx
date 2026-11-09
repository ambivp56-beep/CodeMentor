
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Code2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Admin.css";
import { apiUrl } from "../lib/api";

const API = apiUrl("");

type Step =
  | "login"
  | "verify"
  | "forgot"
  | "reset-verify"
  | "reset-password";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [step, setStep] = useState<Step>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function clearFeedback() {
    setMessage("");
    setError("");
  }

  function changeStep(nextStep: Step) {
    setStep(nextStep);
    setCode("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    clearFeedback();
  }

  async function postJson(path: string, body: object) {
    const response = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "The request could not be completed.");
    }

    return result;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    clearFeedback();

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (step === "login") {
        const result = await postJson("/api/auth/login", {
          email: normalizedEmail,
          password,
        });

        setEmail(result.email || normalizedEmail);
        setPassword("");
        setStep("verify");
        setMessage("A verification code has been sent to your email.");
      } else if (step === "verify") {
        const result = await postJson("/api/auth/verify-code", {
          email: normalizedEmail,
          code: code.trim().toUpperCase(),
        });

        if (
          !result.session?.access_token ||
          !result.session?.refresh_token
        ) {
          throw new Error("The server did not return a valid session.");
        }

        const { data, error: sessionError } =
          await supabase.auth.setSession({
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token,
          });

        if (sessionError) throw sessionError;

        const accessToken = data.session?.access_token;

        if (!accessToken || !data.session?.user.email_confirmed_at) {
          await supabase.auth.signOut();
          throw new Error("Your verified session could not be confirmed.");
        }

        const adminResponse = await fetch(`${API}/api/admin/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const adminResult = await adminResponse.json();

        if (
          !adminResponse.ok ||
          !adminResult.success ||
          !adminResult.isAdmin
        ) {
          await supabase.auth.signOut();
          throw new Error(
            adminResponse.status === 403
              ? "This account is not authorized for administrator access."
              : adminResult.message ||
                  "Administrator access could not be verified.",
          );
        }

        navigate("/admin/dashboard", { replace: true });
      } else if (step === "forgot") {
        await postJson("/api/admin/password-reset/request", {
          email: normalizedEmail,
        });

        setStep("reset-verify");
        setMessage("Check your authorized admin email for the recovery code.");
      } else if (step === "reset-verify") {
        const result = await postJson("/api/admin/password-reset/verify", {
          email: normalizedEmail,
          code: code.trim().toUpperCase(),
        });

        if (!result.resetToken) {
          throw new Error("The server did not return a reset authorization.");
        }

        setResetToken(result.resetToken);
        setStep("reset-password");
        setCode("");
        setMessage("Code verified. You can now choose a new password.");
      } else if (step === "reset-password") {
        if (newPassword.length < 8) {
          throw new Error("Your new password must be at least 8 characters.");
        }

        if (newPassword.length > 128) {
          throw new Error("Your new password cannot exceed 128 characters.");
        }

        if (newPassword !== confirmPassword) {
          throw new Error("The passwords do not match.");
        }

        await postJson("/api/admin/password-reset/complete", {
          email: normalizedEmail,
          resetToken,
          newPassword,
        });

        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setResetToken("");
        setCode("");
        setStep("login");
        setMessage("Password updated successfully. Sign in with your new password.");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const isResetStep =
    step === "forgot" ||
    step === "reset-verify" ||
    step === "reset-password";

  const heading =
    step === "login"
      ? "Administrator sign in"
      : step === "verify"
        ? "Verify your email"
        : step === "forgot"
          ? "Forgot password?"
          : step === "reset-verify"
            ? "Verify recovery code"
            : "Set a new password";

  const description =
    step === "login"
      ? "Sign in with your authorized administrator account."
      : step === "verify"
        ? `Enter the six-character code sent to ${email}.`
        : step === "forgot"
          ? "Enter your authorized administrator email to receive a recovery code."
          : step === "reset-verify"
            ? `Enter the recovery code sent to ${email}.`
            : "Choose a new password for your administrator account.";

  return (
    <main className="admin-page">
      <div className="admin-glow admin-glow-one" />
      <div className="admin-glow admin-glow-two" />

      <header className="admin-header">
        <div className="admin-brand">
          <span className="admin-brand-icon">
            <Code2 size={22} />
          </span>
          <span>
            Code<span>Mentor</span>
          </span>
        </div>
        <span className="admin-badge">ADMIN PORTAL</span>
      </header>

      <section className="admin-login-card">
        <div className="admin-card-icon">
          <LockKeyhole size={25} />
        </div>

        <p className="admin-eyebrow">
          {isResetStep ? "ACCOUNT RECOVERY" : "RESTRICTED ACCESS"}
        </p>

        <h1>{heading}</h1>
        <p className="admin-description">{description}</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email address</label>
          <div className="admin-input-wrap">
            <Mail size={17} />
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading || step === "verify" ||
                step === "reset-verify" || step === "reset-password"}
            />
          </div>

          {step === "login" && (
            <>
              <label htmlFor="admin-password">Password</label>
              <div className="admin-input-wrap">
                <LockKeyhole size={17} />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <button
                type="button"
                className="admin-back"
                disabled={loading}
                onClick={() => changeStep("forgot")}
              >
                Forgot password?
              </button>
            </>
          )}

          {(step === "verify" || step === "reset-verify") && (
            <>
              <label htmlFor="admin-code">
                {step === "verify" ? "Email verification code" : "Recovery code"}
              </label>
              <div className="admin-input-wrap">
                <LockKeyhole size={17} />
                <input
                  id="admin-code"
                  type="text"
                  autoComplete="one-time-code"
                  inputMode="text"
                  placeholder="e.g. A7K9P2"
                  value={code}
                  onChange={(event) =>
                    setCode(
                      event.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "")
                        .slice(0, 6),
                    )
                  }
                  minLength={6}
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}

          {step === "reset-password" && (
            <>
              <label htmlFor="admin-new-password">New password</label>
              <div className="admin-input-wrap">
                <LockKeyhole size={17} />
                <input
                  id="admin-new-password"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={8}
                  maxLength={128}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowNewPassword((value) => !value)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <label htmlFor="admin-confirm-password">Confirm new password</label>
              <div className="admin-input-wrap">
                <LockKeyhole size={17} />
                <input
                  id="admin-confirm-password"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter the new password again"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={8}
                  maxLength={128}
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}

          {message && (
            <p className="admin-message" role="status">
              {message}
            </p>
          )}

          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}

          <button className="admin-submit" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : step === "login"
                ? "Continue securely"
                : step === "verify"
                  ? "Verify and continue"
                  : step === "forgot"
                    ? "Send recovery code"
                    : step === "reset-verify"
                      ? "Verify recovery code"
                      : "Update password"}
            <ArrowRight size={18} />
          </button>
        </form>

        {(step === "verify" || isResetStep) && (
          <button
            type="button"
            className="admin-back"
            disabled={loading}
            onClick={() => {
              if (step === "verify") {
                changeStep("login");
              } else {
                changeStep("login");
              }
            }}
          >
            Back to sign in
          </button>
        )}

        <button
          type="button"
          className="admin-home"
          onClick={() => navigate("/")}
        >
          Return to CodeMentor
        </button>

        <p className="admin-security-note">
          Access is verified by the CodeMentor server.
        </p>
      </section>
    </main>
  );
}

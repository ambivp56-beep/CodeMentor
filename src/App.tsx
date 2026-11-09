
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Code2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  Terminal,
} from "lucide-react";
import { apiUrl } from "./lib/api";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

type AuthMode = "login" | "signup" | "forgot" | "reset" | "verify";
type VerifyPurpose = "signup" | "login" | "password-reset";



function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<AuthMode>("login");
  const [verifyPurpose, setVerifyPurpose] =
    useState<VerifyPurpose>("signup");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (!mounted) return;

        const session = data.session;
        const emailVerified = Boolean(
          session?.user.email_confirmed_at,
        );

        setHasSession(
          !sessionError && Boolean(session) && emailVerified,
        );

        if (session && !emailVerified) {
          await supabase.auth.signOut();
        }
      } catch {
        if (mounted) {
          setHasSession(false);
        }
      } finally {
        if (mounted) {
          setSessionChecked(true);
        }
      }
    }

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const emailVerified = Boolean(
        session?.user.email_confirmed_at,
      );

      setHasSession(Boolean(session) && emailVerified);

      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
        setPassword("");
        setMessage("Choose a new password for your account.");
        setError("");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!sessionChecked) return;

    // Protect the student dashboard and nested dashboard routes.
    if (
      location.pathname.startsWith("/dashboard") &&
      !hasSession
    ) {
      navigate("/", { replace: true });
      return;
    }

    // Redirect authenticated students from the landing page.
    if (
      location.pathname === "/" &&
      hasSession &&
      mode !== "reset" &&
      mode !== "verify"
    ) {
      navigate("/dashboard", { replace: true });
    }
  }, [
    location.pathname,
    sessionChecked,
    hasSession,
    mode,
    navigate,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (mode === "signup" || mode === "login") {
        const endpoint =
          mode === "signup"
            ? "/api/auth/signup"
            : "/api/auth/login";

        const response = await fetch(
          apiUrl(endpoint),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: normalizedEmail,
              password,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              (mode === "signup" ? "Signup failed." : "Login failed."),
          );
        }

        setEmail(result.email || normalizedEmail);

if (mode === "login") {
  setPassword("");
}

setVerificationCode("");
setVerifyPurpose(mode === "signup" ? "signup" : "login");

        setMode("verify");
        setMessage(
          "A six-character verification code has been sent to your email.",
        );
      } else if (mode === "verify") {
        if (verifyPurpose === "password-reset") {
          const response = await fetch(
            apiUrl("/api/auth/password-reset/verify"),
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: normalizedEmail,
                code: verificationCode.trim().toUpperCase(),
              }),
            },
          );

          const result = await response.json();

          if (
            !response.ok ||
            !result.success ||
            !result.resetToken
          ) {
            throw new Error(
              result.message || "Invalid or expired reset code.",
            );
          }

          setResetToken(result.resetToken);
          setVerificationCode("");
          setPassword("");
          setMode("reset");
          setMessage("Code verified. Choose your new password.");
        } else if (verifyPurpose === "login") {
          const response = await fetch(
            apiUrl("/api/auth/verify-code"),
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: normalizedEmail,
                code: verificationCode.trim().toUpperCase(),
              }),
            },
          );

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(
              result.message || "Invalid verification code.",
            );
          }

          if (
            !result.session?.access_token ||
            !result.session?.refresh_token
          ) {
            throw new Error(
              "Verification response incomplete. Please sign in again.",
            );
          }

          const { data, error: sessionError } =
            await supabase.auth.setSession({
              access_token: result.session.access_token,
              refresh_token: result.session.refresh_token,
            });

          if (sessionError) throw sessionError;

          if (!data.session?.user.email_confirmed_at) {
            await supabase.auth.signOut();
            throw new Error("Your email must be verified first.");
          }

          setHasSession(true);
          setVerificationCode("");
          navigate("/dashboard", { replace: true });
        } else {
          const response = await fetch(
            apiUrl("/api/auth/verify-signup-code"),
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: normalizedEmail,
                code: verificationCode.trim().toUpperCase(),
              }),
            },
          );

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(
              result.message || "Invalid signup verification code.",
            );
          }

          const { data, error: signInError } =
            await supabase.auth.signInWithPassword({
              email: normalizedEmail,
              password,
            });

          if (signInError || !data.session) {
            setPassword("");
            throw new Error(
              signInError?.message ||
                "Email verified, but sign-in failed. Please sign in again.",
            );
          }

          if (!data.user?.email_confirmed_at) {
            await supabase.auth.signOut();
            throw new Error("Your email verification could not be confirmed.");
          }

          setHasSession(true);
          setPassword("");
          setVerificationCode("");
          navigate("/dashboard", { replace: true });
        }
      } else if (mode === "forgot") {
        const response = await fetch(
          apiUrl("/api/auth/password-reset/request"),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: normalizedEmail }),
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Could not request a reset code.",
          );
        }

        setEmail(normalizedEmail);
        setVerificationCode("");
        setResetToken("");
        setVerifyPurpose("password-reset");
        setMode("verify");
        setMessage(
          result.message ||
            "If an account exists for this email, check your inbox for a reset code.",
        );
      } else if (mode === "reset") {
        if (password.length < 8 || password.length > 128) {
          throw new Error(
            "Your new password must contain between 8 and 128 characters.",
          );
        }

        if (!resetToken) {
          throw new Error(
            "Your reset session expired. Please request a new code.",
          );
        }

        const response = await fetch(
          apiUrl("/api/auth/password-reset/complete"),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: normalizedEmail,
              resetToken,
              newPassword: password,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Could not update your password.",
          );
        }

        setPassword("");
        setResetToken("");
        setVerificationCode("");
        setConfirmPassword("");
        setHasSession(false);
        setMode("login");
        setMessage("Password updated successfully! You can now sign in.");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  
  
async function resendVerificationCode() {
  setMessage("");
  setError("");
  setLoading(true);

  try {
    const isLogin = verifyPurpose === "login";

    const endpoint = isLogin
      ? "/api/auth/resend-login-code"
      : "/api/auth/resend-signup-code";

    const response = await fetch(
      apiUrl(endpoint),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Could not resend the verification code."
      );
    }

    setVerificationCode("");

    setMessage(
      isLogin
        ? "A new login verification code has been sent to your email."
        : "A new signup verification code has been sent to your email."
    );
  } catch (err: unknown) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to resend the verification code."
    );
  } finally {
    setLoading(false);
  }
}

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage("");
    setError("");
    setResetToken("");

    if (nextMode === "signup" || nextMode === "login") {
      setVerifyPurpose("signup");
    }
  }

  // Admin login route.
  if (location.pathname === "/admin") {
    return <AdminLogin />;
  }

  // Admin dashboard route.
  // AdminDashboard must verify administrator access with the backend.
  if (location.pathname === "/admin/dashboard") {
    if (!sessionChecked) {
      return (
        <div className="cm-route-loading">
          Preparing your admin space...
        </div>
      );
    }

    return <AdminDashboard />;
  }

  // Render the existing dashboard for /dashboard and lesson routes.
  if (location.pathname.startsWith("/dashboard")) {
    if (!sessionChecked) {
      return (
        <div className="cm-route-loading">
          Preparing your learning space...
        </div>
      );
    }

    if (!hasSession) {
      return null;
    }

    return <Dashboard />;
  }

  const isRecovery = mode === "forgot" || mode === "reset";
  const isVerification = mode === "verify";

  return (
    <main className="auth-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a
          className="brand"
          href="/"
          aria-label="CodeMentor home"
        >
          <span className="brand-icon">
            <Code2 size={22} />
          </span>
          <span>
            Code<span className="brand-accent">Mentor</span>
          </span>
        </a>

        <span className="topbar-note">
          <span className="status-dot" />
          YOUR NEXT CHAPTER STARTS HERE
        </span>
      </header>

      <section className="auth-layout">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={14} />
            <span>YOUR PERSONAL CODING COMPANION</span>
          </div>

          <h1>
            Don't just learn
            <br />
            to code.
            <br />
            <span>Learn to think.</span>
          </h1>

          <p className="hero-description">
            From your first line of code to building real projects,
            learn at your pace with mentors that help you understand
            the why behind every line.
          </p>

          <div className="code-window">
            <div className="window-bar">
              <div className="window-dots">
                <span />
                <span />
                <span />
              </div>

              <span className="window-filename">
                <Terminal size={13} />
                your_journey.py
              </span>

              <span className="window-language">PYTHON</span>
            </div>

            <div className="code-content">
              <div>
                <span className="line-number">01</span>
                <span className="code-purple">def</span>{" "}
                <span className="code-blue">your_journey</span>():
              </div>

              <div>
                <span className="line-number">02</span>
                &nbsp;&nbsp;skills ={" "}
                <span className="code-green">"curiosity"</span>
              </div>

              <div>
                <span className="line-number">03</span>
                &nbsp;&nbsp;while{" "}
                <span className="code-orange">learning</span>:
              </div>

              <div>
                <span className="line-number">04</span>
                &nbsp;&nbsp;&nbsp;&nbsp;build_something()
              </div>

              <div>
                <span className="line-number">05</span>
                &nbsp;&nbsp;
                <span className="code-purple">return</span>{" "}
                <span className="code-green">
                  "you've got this!"
                </span>
              </div>

              <div className="code-cursor">▍</div>
            </div>
          </div>

          <div className="hero-footer">
            <div className="mini-avatars" aria-hidden="true">
              <span>C</span>
              <span>P</span>
              <span>J</span>
            </div>

            <p>
              Built for learners.
              <span> Designed for your growth.</span>
            </p>
          </div>
        </div>

        <div className="auth-card">
          <div className="card-top">
            <div className="card-symbol">
              {isRecovery ? (
                <LockKeyhole size={23} />
              ) : isVerification ? (
                <Mail size={23} />
              ) : (
                <Code2 size={23} />
              )}
            </div>

            <span className="secure-label">
              <LockKeyhole size={12} />
              LEARNING SPACE
            </span>
          </div>

          <div className="form-heading">
            <h2>
              {mode === "login"
                ? "Welcome back."
                : mode === "signup"
                  ? "Start your journey."
                  : mode === "forgot"
                    ? "Reset your password."
                    : mode === "reset"
                      ? "Choose a new password."
                      : "Verify your email."}
            </h2>

            <p>
              {mode === "login"
                ? "Your next breakthrough is one sign-in away."
                : mode === "signup"
                  ? "Create your account and learn something new."
                  : mode === "forgot"
                    ? "We'll help you get back into your account."
                    : mode === "reset"
                      ? "Choose a strong password for your account."
                      : verifyPurpose === "login"
                        ? "Enter the six-character login code sent to your inbox."
                        : "Enter the signup verification code sent to your inbox."}
            </p>
          </div>

          {((!isRecovery && !isVerification) || mode === "reset") && (
            <>
              <button
                type="button"
                className="github-button"
                onClick={() => {
                  setError("");
                  setMessage(
                    "GitHub sign-in isn't connected yet. Please use email and password.",
                  );
                }}
                disabled={loading}
              >
                <Code2 size={18} />
                Continue with GitHub
              </button>

              <div className="form-divider">
                <span />
                <p>OR CONTINUE WITH EMAIL</p>
                <span />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>

            <div className="input-wrap">
              <Mail size={17} />

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={loading || mode === "reset"}
              />
            </div>

            {isVerification && (
              <>
                <label htmlFor="verification-code">
                  Email verification code
                </label>

                <div className="input-wrap">
                  <LockKeyhole size={17} />

                  <input
                    id="verification-code"
                    type="text"
                    inputMode="text"
                    autoComplete="one-time-code"
                    placeholder="e.g. A7K9P2"
                    value={verificationCode}
                    onChange={(event) =>
                      setVerificationCode(
                        event.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, "")
                          .slice(0, 6),
                      )
                    }
                    maxLength={6}
                    minLength={6}
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="button"
                  className="text-button"
                  onClick={resendVerificationCode}
                  disabled={loading}
                >
                  Resend verification email
                </button>
              </>
            )}

            {((!isRecovery && !isVerification) || mode === "reset") && (
              <>
                <div className="password-label">
                  <label htmlFor="password">Password</label>

                  {mode === "login" && (
                    <button
                      className="text-button"
                      type="button"
                      onClick={() => changeMode("forgot")}
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="input-wrap">
                  <LockKeyhole size={17} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete={
                      mode === "login"
                        ? "current-password"
                        : "new-password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    minLength={8}
                    required
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
                
                {mode === "reset" && (
                  <>
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>

                    <div className="input-wrap">
                      <LockKeyhole size={17} />
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter your new password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        minLength={8}
                        maxLength={128}
                        required
                        disabled={loading}
                      />
                    </div>
                  </>
                )}


                {mode === "signup" && (
                  <p className="field-hint">
                    Use at least 8 characters.
                  </p>
                )}
              </>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in to CodeMentor"
                  : mode === "signup"
                    ? "Create my account"
                    : mode === "forgot"
                      ? "Send reset instructions"
                      : mode === "reset"
                        ? "Update password"
                        : "Verify email"}

              <ArrowRight size={18} />
            </button>
          </form>

          {message && (
            <div className="form-message" role="status">
              {message}
            </div>
          )}

          {error && (
            <div className="form-message" role="alert">
              {error}
            </div>
          )}

          <div className="auth-switch">
            {mode === "login" ? (
              <>
                New to CodeMentor?

                <button
                  type="button"
                  onClick={() => changeMode("signup")}
                  disabled={loading}
                >
                  Create an account
                </button>
              </>
            ) : mode === "verify" ? (
              <>
                Already verified?

                <button
                  type="button"
                  onClick={() => changeMode("login")}
                  disabled={loading}
                >
                  Back to sign in
                </button>
              </>
            ) : (
              <>
                {mode === "forgot"
                  ? "Remember your password?"
                  : mode === "reset"
                    ? "Already updated your password?"
                    : "Already learning with us?"}

                <button
                  type="button"
                  onClick={() => changeMode("login")}
                  disabled={loading}
                >
                  Back to sign in
                </button>
              </>
            )}
          </div>

          <p className="terms">
            By continuing, you agree to our{" "}
            <a href="#terms">Terms</a> and{" "}
            <a href="#privacy">Privacy Policy</a>.
          </p>
        </div>
      </section>

      <footer className="page-footer">
        <span>© 2026 CodeMentor</span>
        <span>Learn deeply. Build confidently.</span>

        <span className="footer-status">
          <span className="status-dot" />
          MADE FOR YOUR NEXT LEVEL
        </span>
      </footer>
    </main>
  );
}

export default App;

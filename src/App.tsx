import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Code2,
  Copy,
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

type AuthMode = "login" | "signup" | "recover-id";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<AuthMode>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCodeMentorId, setLoginCodeMentorId] = useState("");
  const [codementorId, setCodementorId] = useState("");
  const [recoveredCodeMentorId, setRecoveredCodeMentorId] =
    useState("");

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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const emailVerified = Boolean(
        session?.user.email_confirmed_at,
      );

      setHasSession(Boolean(session) && emailVerified);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!sessionChecked) return;

    if (
      location.pathname.startsWith("/dashboard") &&
      !hasSession
    ) {
      navigate("/", { replace: true });
      return;
    }

    if (
      location.pathname === "/" &&
      hasSession &&
      mode !== "signup"
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

      // STUDENT SIGNUP — NO OTP
      if (mode === "signup") {
        const normalizedName = name.trim();

        if (!normalizedName) {
          throw new Error("Please enter your name.");
        }

        if (password.length < 8 || password.length > 128) {
          throw new Error(
            "Your password must contain between 8 and 128 characters.",
          );
        }

        const response = await fetch(
          apiUrl("/api/auth/signup"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: normalizedName,
              email: normalizedEmail,
              password,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Could not create your account.",
          );
        }

        if (
          typeof result.codementorId !== "string" ||
          !/^CM-[A-F0-9]{12}$/.test(result.codementorId)
        ) {
          throw new Error(
            "Your account was created, but the CodeMentor ID was not returned. Please contact support.",
          );
        }

        if (
          !result.session?.access_token ||
          !result.session?.refresh_token
        ) {
          throw new Error(
            "Your account was created, but the sign-in session was not returned. Please contact support.",
          );
        }

        const { data, error: sessionError } =
          await supabase.auth.setSession({
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token,
          });

        if (sessionError) {
          throw sessionError;
        }

        if (!data.session?.user.email_confirmed_at) {
          await supabase.auth.signOut();
          throw new Error(
            "The account was created, but its email confirmation status is incorrect. Please contact support.",
          );
        }

        setHasSession(true);
        setCodementorId(result.codementorId);
        setPassword("");
        setName(normalizedName);
        setEmail(normalizedEmail);
        setMessage(
          "Your account has been created successfully. Save your CodeMentor ID before continuing.",
        );
      }

      // STUDENT LOGIN — EMAIL + CODEMENTOR ID + PASSWORD
      else if (mode === "login") {
        const response = await fetch(
          apiUrl("/api/student/auth/login"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: normalizedEmail,
              codementorId: loginCodeMentorId.trim().toUpperCase(),
              password,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Invalid email, CodeMentor ID or password.",
          );
        }

        if (
          !result.session?.access_token ||
          !result.session?.refresh_token
        ) {
          throw new Error(
            "Sign-in response incomplete. Please try again.",
          );
        }

        const { data, error: sessionError } =
          await supabase.auth.setSession({
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token,
          });

        if (sessionError) {
          throw sessionError;
        }

        if (!data.session?.user.email_confirmed_at) {
          await supabase.auth.signOut();
          throw new Error(
            "Your account email is not confirmed. Please contact support.",
          );
        }

        setEmail(normalizedEmail);
        setPassword("");
        setLoginCodeMentorId("");
        setHasSession(true);

        if (result.requiresIdSetup) {
          if (
            typeof result.codementorId !== "string" ||
            !/^CM-[A-F0-9]{12}$/.test(result.codementorId)
          ) {
            await supabase.auth.signOut();
            setHasSession(false);
            throw new Error(
              "Your CodeMentor ID could not be retrieved. Please try again.",
            );
          }

          setCodementorId(result.codementorId);
          setMessage(
            "Your CodeMentor ID is ready. Save it before continuing.",
          );
        } else {
          navigate("/dashboard", { replace: true });
        }
      }

      // FORGOT CODEMENTOR ID — EMAIL ONLY
      else if (mode === "recover-id") {
        const response = await fetch(
          apiUrl("/api/student/auth/id-recovery"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: normalizedEmail,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Could not retrieve your CodeMentor ID.",
          );
        }

        if (
          typeof result.codementorId !== "string" ||
          !/^CM-[A-F0-9]{12}$/.test(result.codementorId)
        ) {
          throw new Error(
            "The recovered CodeMentor ID is invalid.",
          );
        }

        setRecoveredCodeMentorId(result.codementorId);
        setMessage(
          "Your CodeMentor ID has been retrieved successfully.",
        );
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

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage("");
    setError("");
    setPassword("");
    setLoginCodeMentorId("");
    setRecoveredCodeMentorId("");
    setCodementorId("");
    setShowPassword(false);
  }

  // Admin login route — unchanged.
  if (location.pathname === "/admin") {
    return <AdminLogin />;
  }

  // Admin dashboard route — unchanged.
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

  // Student dashboard route.
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

  const isRecovery = mode === "recover-id";
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
                  : "Recover your CodeMentor ID."}
            </h2>

            <p>
              {mode === "login"
                ? "Sign in to CodeMentor"
                : mode === "signup"
                  ? "Create your account"
                  : "Enter your registered email address."}
            </p>
          </div>

         
          {codementorId || recoveredCodeMentorId ? (
            <div className="auth-success-panel">
              <h2>
                {recoveredCodeMentorId
                  ? "Your CodeMentor ID is recovered!"
                  : "Your CodeMentor ID is ready!"}
              </h2>

              <p>
                Save this ID. You will need it along with your email
                and password whenever you sign in.
              </p>

              <div className="form-message">
                <strong>
                  {codementorId || recoveredCodeMentorId}
                </strong>
              </div>

              <button
                type="button"
                className="text-button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      codementorId || recoveredCodeMentorId,
                    );
                    setMessage(
                      "CodeMentor ID copied successfully.",
                    );
                    setError("");
                  } catch {
                    setError(
                      "Could not copy automatically. Please copy the ID manually.",
                    );
                  }
                }}
              >
                <Copy size={16} />
                Copy CodeMentor ID
              </button>

              <button
                type="button"
                className="submit-button"
                onClick={() => {
                  if (recoveredCodeMentorId) {
                    setRecoveredCodeMentorId("");
                    changeMode("login");
                  } else {
                    setCodementorId("");
                    navigate("/dashboard", { replace: true });
                  }
                }}
              >
                {recoveredCodeMentorId
                  ? "Back to sign in"
                  : "Continue to dashboard"}
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {mode === "signup" && (
                <>
                  <label htmlFor="name">Your name</label>

                  <div className="input-wrap">
                    <Code2 size={17} />

                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      maxLength={100}
                      required
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              <label htmlFor="email">Email address</label>

              <div className="input-wrap">
                <Mail size={17} />

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  disabled={loading}
                />
              </div>

              {mode === "login" && (
                <>
                  <label htmlFor="login-codementor-id">
                    CodeMentor ID
                  </label>

                  <div className="input-wrap">
                    <Code2 size={17} />

                    <input
                      id="login-codementor-id"
                      type="text"
                      placeholder="CM-XXXXXXXXXXXX"
                      autoComplete="off"
                      value={loginCodeMentorId}
                      onChange={(event) =>
                        setLoginCodeMentorId(
                          event.target.value.toUpperCase(),
                        )
                      }
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="button"
                    className="text-button"
                    onClick={() => changeMode("recover-id")}
                    disabled={loading}
                  >
                    Forgot CodeMentor ID?
                  </button>
                </>
              )}

              {(mode === "login" || mode === "signup") && (
                <>
                  <div className="password-label">
                    <label htmlFor="password">Password</label>
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
                      maxLength={128}
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
                      : "Find my CodeMentor ID"}

                <ArrowRight size={18} />
              </button>
            </form>
          )}

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
            ) : (
              <>
                {mode === "signup"
                  ? "Already learning with us?"
                  : "Remember your CodeMentor ID?"}

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
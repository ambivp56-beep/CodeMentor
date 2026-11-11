
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

const API_BASE = apiUrl("").replace(/\/+$/, "");

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function readJson(response: Response) {
    const raw = await response.text();

    try {
      return JSON.parse(raw);
    } catch {
      throw new Error(
        `Server returned an invalid response (HTTP ${response.status}).`
      );
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Authenticate using the fixed administrator credentials.
      const loginResponse = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const loginResult = await readJson(loginResponse);

      if (!loginResponse.ok || !loginResult.success) {
        throw new Error(
          loginResult.message || "Invalid administrator email or password."
        );
      }

      const session = loginResult.session;

      if (!session?.access_token || !session?.refresh_token) {
        throw new Error("The server did not return a valid login session.");
      }

      // Save the Supabase session for the protected admin dashboard.
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      if (sessionError) {
        throw sessionError;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        await supabase.auth.signOut();
        throw new Error("Could not establish the administrator session.");
      }

      // Confirm administrator permissions with the backend.
      const adminResponse = await fetch(`${API_BASE}/api/admin/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const adminResult = await readJson(adminResponse);

      if (
        !adminResponse.ok ||
        !adminResult.success ||
        !adminResult.isAdmin
      ) {
        await supabase.auth.signOut();

        throw new Error(
          adminResult.message ||
            "This account is not authorized for administrator access."
        );
      }

      setPassword("");
      navigate("/admin/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

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

        <p className="admin-eyebrow">RESTRICTED ACCESS</p>

        <h1>Administrator sign in</h1>

        <p className="admin-description">
          Sign in with your authorized administrator email and password.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email address</label>

          <div className="admin-input-wrap">
            <Mail size={17} />

            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
          </div>

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
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>

          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="admin-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in to Admin Panel"}

            <ArrowRight size={18} />
          </button>
        </form>

        <button
          type="button"
          className="admin-home"
          onClick={() => navigate("/")}
        >
          Return to CodeMentor
        </button>

        <p className="admin-security-note">
          Administrator access is verified by the CodeMentor server.
        </p>
      </section>
    </main>
  );
}

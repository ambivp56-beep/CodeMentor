
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
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const result = await readJson(response);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Invalid administrator email or password."
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
              aria-label={showPassword ? "Hide password" : "Show password"}
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
            {loading ? "Signing in..." : "Sign into Admin Panel"}
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

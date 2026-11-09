import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { apiUrl } from "../lib/api";
import {
  LogOut,
  RefreshCw,
  ShieldCheck,
  Users,
  UserCheck,
  Clock3,
  BookOpenCheck,
  BarChart3,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import "./Admin.css";
const API = apiUrl("");

type Student = {
  id: string;
  email: string;
  createdAt: string;
  emailConfirmed: boolean;
  lastSignInAt: string | null;
  completedLessons: number;
};

type CourseProgress = {
  courseId: string;
  completedLessons: number;
};

type CertificateRequest = {
  id: string;
  user_id: string;
  student_name: string;
  email: string;
  course_id: string;
  course_title: string;
  status: "pending" | "sent";
  requested_at: string;
  sent_at: string | null;
  admin_notes: string | null;
  completedCount: number;
  requiredCount: number;
  remainingCount: number;
  eligible: boolean;
};

type Overview = {
  totalStudents: number | null;
  studentsOnThisPage: number;
  confirmedAccounts: number;
  totalCompletedLessons: number;
  courseProgress: CourseProgress[];
  students: Student[];
};

function formatCourseName(id: string) {
  const names: Record<string, string> = {
    python: "Python Fundamentals",
    cpp: "C++ & DSA",
    javascript: "JavaScript",
    web: "Web Development",
    "web-development": "Web Development",
  };

  return (
    names[id.toLowerCase()] ||
    id.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [certificateRequests, setCertificateRequests] = useState<CertificateRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");
  const [requestFilter, setRequestFilter] = useState<"pending" | "all" | "sent">("pending");
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);

  async function loadOverview() {
    setLoading(true);
    setError("");

    try {
      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !data.session) {
        navigate("/admin", { replace: true });
        return;
      }

      const response = await fetch(`${API}/api/admin/overview`, {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });

    const result = await response.json().catch(() => null);

if (!result) {
  console.error("Admin overview returned an invalid response:", {
    url: response.url,
    status: response.status,
    contentType: response.headers.get("content-type"),
  });

  throw new Error(
    "Admin API did not return JSON. Check the Network tab."
  );
}

      if (response.status === 401 || response.status === 403) {
        await supabase.auth.signOut();
        navigate("/admin", { replace: true });
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not load administrator data."
        );
      }

      setOverview({
        totalStudents: result.totalStudents,
        studentsOnThisPage: result.studentsOnThisPage,
        confirmedAccounts: result.confirmedAccounts,
        totalCompletedLessons: result.totalCompletedLessons ?? 0,
        courseProgress: result.courseProgress ?? [],
        students: result.students ?? [],
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load the dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadCertificateRequests(
    status: "all" | "pending" | "sent" = requestFilter
  ) {
    setRequestsLoading(true);
    setRequestsError("");

    try {
      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !data.session) {
        navigate("/admin", { replace: true });
        return;
      }

      const response = await fetch(
        `${API}/api/admin/certificate-requests?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
        }
      );

      const result = await response.json().catch(() => null);

      if (response.status === 401 || response.status === 403) {
        await supabase.auth.signOut();
        navigate("/admin", { replace: true });
        return;
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Could not load certificate requests."
        );
      }

      setCertificateRequests(result.requests ?? []);
    } catch (err: unknown) {
      setRequestsError(
        err instanceof Error
          ? err.message
          : "Could not load certificate requests."
      );
    } finally {
      setRequestsLoading(false);
    }
  }

  async function markCertificateRequestSent(request: CertificateRequest) {
    if (!request.eligible) {
      setRequestsError(
        `Cannot mark this request as sent: course progress is ${request.completedCount}/${request.requiredCount}.`
      );
      return;
    }

    setUpdatingRequestId(request.id);
    setRequestsError("");

    try {
      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !data.session) {
        navigate("/admin", { replace: true });
        return;
      }

      const response = await fetch(
        `${API}/api/admin/certificate-requests/${encodeURIComponent(request.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.session.access_token}`,
          },
          body: JSON.stringify({ status: "sent" }),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Could not update this certificate request."
        );
      }

      await loadCertificateRequests(requestFilter);
    } catch (err: unknown) {
      setRequestsError(
        err instanceof Error
          ? err.message
          : "Could not update this certificate request."
      );
    } finally {
      setUpdatingRequestId(null);
    }
  }
    useEffect(() => {
    void loadOverview();
    void loadCertificateRequests("pending");
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin", { replace: true });
  }

  const maxCourseCompletions = Math.max(
    1,
    ...(overview?.courseProgress.map(
      (course) => course.completedLessons
    ) ?? [])
  );

  return (
    <main className="admin-page admin-dashboard-page">
      <header className="admin-header">
        <div className="admin-brand">
          <span className="admin-brand-icon">
            <ShieldCheck size={22} />
          </span>
          <span>
            Code<span>Mentor</span>
          </span>
        </div>

        <div className="admin-header-actions">
          <span className="admin-badge">ADMIN CONSOLE</span>
          <button className="admin-logout" onClick={handleLogout}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </header>

      <section className="admin-dashboard-content">
        <p className="admin-eyebrow">SECURE ADMINISTRATION</p>
        <h1>Platform overview</h1>
        <p className="admin-description">
          Monitor student accounts, course activity, and completed lessons.
        </p>

        <div className="admin-stats">
          <article className="admin-stat-card">
            <Users size={21} />
            <span>Total registered accounts</span>
            <strong>
              {loading
                ? "…"
                : overview?.totalStudents ?? "Unavailable"}
            </strong>
          </article>

          <article className="admin-stat-card">
            <UserCheck size={21} />
            <span>Verified accounts on this page</span>
            <strong>
              {loading ? "…" : overview?.confirmedAccounts ?? "—"}
            </strong>
          </article>

          <article className="admin-stat-card">
            <BookOpenCheck size={21} />
            <span>Total completed lessons</span>
            <strong>
              {loading
                ? "…"
                : overview?.totalCompletedLessons ?? "—"}
            </strong>
          </article>

          <article className="admin-stat-card">
            <Clock3 size={21} />
            <span>Accounts loaded</span>
            <strong>
              {loading
                ? "…"
                : overview?.studentsOnThisPage ?? "—"}
            </strong>
          </article>
        </div>

        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}

        <section
          className="admin-student-panel"
          aria-labelledby="course-progress-heading"
        >
          <div className="admin-panel-heading">
            <div>
              <h2 id="course-progress-heading">
                <BarChart3
                  size={21}
                  style={{
                    display: "inline",
                    verticalAlign: "middle",
                    marginRight: 8,
                  }}
                />
                Course completion activity
              </h2>
              <p>
                Number of completed lesson records in each course.
              </p>
            </div>

            <button
              className="admin-refresh"
              onClick={() => void loadOverview()}
              disabled={loading}
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </div>

          {loading ? (
            <p className="admin-empty">Loading course progress…</p>
          ) : overview?.courseProgress.length ? (
            <div style={{ display: "grid", gap: 22, padding: "20px 0" }}>
              {overview.courseProgress.map((course) => {
                const percentage =
                  (course.completedLessons / maxCourseCompletions) * 100;

                return (
                  <div key={course.courseId}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 9,
                      }}
                    >
                      <strong>{formatCourseName(course.courseId)}</strong>
                      <span>
                        {course.completedLessons} completions
                      </span>
                    </div>

                    <div
                      role="img"
                      aria-label={`${formatCourseName(
                        course.courseId
                      )}: ${course.completedLessons} completed lessons`}
                      style={{
                        height: 14,
                        width: "100%",
                        background: "rgba(128, 128, 128, 0.18)",
                        borderRadius: 20,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #6575f5, #42c6e8)",
                          borderRadius: 20,
                          transition: "width 300ms ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="admin-empty">
              No completed lessons have been recorded yet.
            </p>
          )}
        </section>

        <div className="admin-student-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Student learning progress</h2>
              <p>
                Completed lessons recorded for each registered account.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="admin-empty">Loading student progress…</p>
          ) : overview?.students.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Lessons completed</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Last sign-in</th>
                  </tr>
                </thead>

                <tbody>
                  {overview.students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.email || "—"}</td>
                      <td>
                        <strong>{student.completedLessons}</strong>
                      </td>
                      <td>
                        <span
                          className={
                            student.emailConfirmed
                              ? "admin-status verified"
                              : "admin-status pending"
                          }
                        >
                          {student.emailConfirmed
                            ? "Verified"
                            : "Unverified"}
                        </span>
                      </td>
                      <td>
                        {student.createdAt
                          ? new Date(
                              student.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        {student.lastSignInAt
                          ? new Date(
                              student.lastSignInAt
                            ).toLocaleString()
                          : "Never"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="admin-empty">
              No account records were returned.
            </p>
          )}

          {!loading &&
            overview &&
            overview.totalStudents !== null &&
            overview.totalStudents > overview.studentsOnThisPage && (
              <p className="admin-table-note">
                Showing {overview.studentsOnThisPage} accounts from the
                first page. The total count includes accounts beyond
                this page.
              </p>
            )}
        </div>
                <section
          className="admin-student-panel"
          aria-labelledby="certificate-requests-heading"
          style={{ marginTop: 24 }}
        >
          <div className="admin-panel-heading">
            <div>
              <h2 id="certificate-requests-heading">Certificate requests</h2>
              <p>
                Check each student’s saved course progress before manually
                sending a certificate.
              </p>
            </div>
            <button
              className="admin-refresh"
              onClick={() => void loadCertificateRequests(requestFilter)}
              disabled={requestsLoading}
            >
              <RefreshCw size={15} /> Refresh requests
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 18,
            }}
            aria-label="Filter certificate requests"
          >
            {([
              { value: "pending", label: "Pending" },
              { value: "all", label: "All requests" },
              { value: "sent", label: "Sent" },
            ] as const).map((option) => (
              <button
                key={option.value}
                type="button"
                className="admin-refresh"
                aria-pressed={requestFilter === option.value}
                onClick={() => {
                  setRequestFilter(option.value);
                  void loadCertificateRequests(option.value);
                }}
                disabled={requestsLoading}
              >
                {option.label}
              </button>
            ))}
          </div>

          {requestsError && (
            <p
              className="admin-error"
              role="alert"
              style={{ marginBottom: 16 }}
            >
              {requestsError}
            </p>
          )}

          {requestsLoading ? (
            <p className="admin-empty">Loading certificate requests…</p>
          ) : certificateRequests.length === 0 ? (
            <p className="admin-empty">
              No {requestFilter === "all" ? "" : `${requestFilter} `}
              certificate requests found.
            </p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student details</th>
                    <th>Course</th>
                    <th>Verified completion</th>
                    <th>Requested</th>
                    <th>Request status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificateRequests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <strong>{request.student_name}</strong>
                        <br />
                        <a
                          href={`mailto:${request.email}?subject=${encodeURIComponent(
                            `CodeMentor certificate - ${request.course_title}`
                          )}`}
                          style={{
                            color: "#9edfff",
                            textDecoration: "none",
                          }}
                        >
                          {request.email}
                        </a>
                      </td>
                      <td>
                        <strong>{request.course_title}</strong>
                        <br />
                        <span
                          style={{ color: "#96a3c1", fontSize: 11 }}
                        >
                          {request.course_id}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            request.eligible
                              ? "admin-status verified"
                              : "admin-status pending"
                          }
                        >
                          {request.eligible
                            ? "Eligible"
                            : "Not complete"}
                        </span>
                        <div style={{ marginTop: 7 }}>
                          <strong>
                            {request.completedCount}/{request.requiredCount}
                          </strong>{" "}
                          lessons
                        </div>
                        {!request.eligible && (
                          <div
                            style={{
                              color: "#ffd18a",
                              fontSize: 11,
                              marginTop: 4,
                            }}
                          >
                            {request.remainingCount} remaining
                          </div>
                        )}
                      </td>
                      <td>
                        {request.requested_at
                          ? new Date(
                              request.requested_at
                            ).toLocaleString()
                          : "—"}
                      </td>
                      <td>
                        <span
                          className={
                            request.status === "sent"
                              ? "admin-status verified"
                              : "admin-status pending"
                          }
                        >
                          {request.status === "sent"
                            ? "Sent"
                            : "Pending"}
                        </span>
                        {request.sent_at && (
                          <div
                            style={{
                              color: "#96a3c1",
                              fontSize: 11,
                              marginTop: 5,
                            }}
                          >
                            {new Date(
                              request.sent_at
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "grid", gap: 8 }}>
                          {request.status === "pending" ? (
                            <>
                              <a
                                className="admin-refresh"
                                href={`mailto:${request.email}?subject=${encodeURIComponent(
                                  `Your ${request.course_title} certificate from CodeMentor`
                                )}`}
                                style={{ textDecoration: "none" }}
                              >
                                Email student
                              </a>
                              <button
                                type="button"
                                className="admin-refresh"
                                disabled={
                                  !request.eligible ||
                                  updatingRequestId === request.id
                                }
                                title={
                                  request.eligible
                                    ? "Use after you have emailed the certificate."
                                    : "This student must complete every required lesson first."
                                }
                                onClick={() =>
                                  void markCertificateRequestSent(request)
                                }
                              >
                                {updatingRequestId === request.id
                                  ? "Saving…"
                                  : request.eligible
                                    ? "Mark as sent"
                                    : "Not eligible yet"}
                              </button>
                            </>
                          ) : (
                            <span
                              style={{
                                color: "#96a3c1",
                                fontSize: 11,
                              }}
                            >
                              Certificate marked sent
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="admin-table-note">
            Completion is checked against saved, completed lesson records. Open
            the student’s email link to send the certificate manually, then use
            “Mark as sent” to update the request. That action is disabled until
            all required lessons are complete.
          </p>
        </section>
      </section>
    </main>
  );
}
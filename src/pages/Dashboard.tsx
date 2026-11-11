import CodePracticeEditor from "../components/CodePracticeEditor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { apiUrl } from "../lib/api";

import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  ArrowUp,
  Bell,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Code2,
  Flame,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareCode,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Sphere } from "@react-three/drei";
import type { Group } from "three";
import { supabase } from "../lib/supabase";
import { courseData } from "./courseData";
import type { Lesson } from "./courseData";
import "./Dashboard.css";
type Mentor = {
  title: string;
  description: string;
  icon: typeof Code2;
  color: string;
  prompt: string;
};
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function isLimitReached(message: string): boolean {
  return /limit\s*(has\s*)?(been\s*)?reached|usage\s*limit|quota\s*exceeded|rate\s*limit|too many requests|daily limit/i.test(
    message,
  );
}

const LIMIT_REACHED_MESSAGE =
  "Your limit has been reached. You can continue when your limit resets.";

function normalizeTutorMarkdown(content: string) {
  return content
    .replace(/\\(?=[*_#`~])/g, "")
    .replace(/&#x20;/gi, " ")
    .replace(/&nbsp;/gi, " ");
}


type LessonProgressRow = {
  course_id: string;
  lesson_id: string;
  completed: boolean;
};
type StudentCertificateRequest = {
  id: string;
  student_name: string;
  email: string;
  course_id: string;
  course_title: string;
  status: "pending" | "sent";
  requested_at?: string;
  sent_at?: string | null;
};
const mentors: Mentor[] = [
  {
    title: "Code Tutor",
    description: "Understand concepts, syntax, and the why behind code.",
    icon: BookOpen,
    color: "cyan",
    prompt:
      "Your Code Tutor will help you understand programming concepts step by step.",
  },
  {
    title: "Debug Assistant",
    description: "Understand errors and learn how to fix them.",
    icon: ShieldCheck,
    color: "violet",
    prompt:
      "Your Debug Assistant will help you analyze errors and understand their causes.",
  },
  {
    title: "Project Mentor",
    description: "Turn your ideas into real applications.",
    icon: Rocket,
    color: "blue",
    prompt:
      "Your Project Mentor will guide you through planning and building projects.",
  },
  {
    title: "Problem-Solving Coach",
    description: "Build logic, algorithms, and problem-solving skills.",
    icon: BrainCircuit,
    color: "amber",
    prompt:
      "Your Problem-Solving Coach will help you develop a solution before writing code.",
  },
];
const courses = [
  {
    title: "Python Fundamentals",
    subtitle: "Start with the essentials",
    language: "PYTHON",
    icon: "Py",
    color: "python",
    progress: 0,
    lessons: "Beginner",
    courseId: "python",
  },
  {
    title: "C++ & DSA",
    subtitle: "Build strong programming logic",
    language: "C++",
    icon: "C+",
    color: "cpp",
    progress: 0,
    lessons: "Beginner",
    courseId: "cpp",
  },
  {
    title: "Web Development",
    subtitle: "Create interactive websites",
    language: "HTML · CSS · JS",
    icon: "</>",
    color: "web",
    progress: 0,
    lessons: "Beginner",
    courseId: "web",
  },
  {
    title: "Complete Cloud Computing",
    subtitle: "Learn cloud services and deployment",
    language: "CLOUD",
    icon: "☁️",
    color: "cloud",
    progress: 0,
    lessons: "Coming soon",
    courseId: "cloud",
  },
  {
    title: "100 Days of AI/ML",
    subtitle: "Explore AI through practical learning",
    language: "AI / ML",
    icon: "AI",
    color: "ai",
    progress: 0,
    lessons: "Coming soon",
    courseId: "ai-ml-100-days",
  },
  {
    title: "Machine Learning",
    subtitle: "Understand models and predictions",
    language: "ML",
    icon: "ML",
    color: "ml",
    progress: 0,
    lessons: "Coming soon",
    courseId: "machine-learning",
  },
  {
    title: "GitHub Essentials",
    subtitle: "Learn Git and version control",
    language: "GITHUB",
    icon: "Git",
    color: "github",
    progress: 0,
    lessons: "Coming soon",
    courseId: "github",
  },
  {
    title: "Database Management",
    subtitle: "Learn SQL and database fundamentals",
    language: "DATABASE",
    icon: "DB",
    color: "database",
    progress: 0,
    lessons: "Coming soon",
    courseId: "database",
  },
  {
    title: "DevOps Fundamentals",
    subtitle: "Explore automation and deployment",
    language: "DEVOPS",
    icon: "∞",
    color: "devops",
    progress: 0,
    lessons: "Coming soon",
    courseId: "devops",
  },
];
// Both course ID and lesson ID are required because different courses
// can contain lessons with similar IDs, such as python-1 and cpp-1.
function getProgressKey(courseId: string, lessonId: string) {
  return `${courseId}:${lessonId}`;
}
function Robot() {
  const robotRef = useRef<Group>(null);
  const eyeRef = useRef<Group>(null);
  useFrame((state, delta) => {
    if (robotRef.current) {
      robotRef.current.rotation.y += delta * 0.12;
      robotRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.1) * 0.07;
    }
    if (eyeRef.current) {
      eyeRef.current.position.x =
        Math.sin(state.clock.elapsedTime * 0.7) * 0.035;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.25}>
      <group ref={robotRef} position={[0, -0.12, 0]}>
        <RoundedBox
          args={[1.48, 1.22, 0.94]}
          radius={0.26}
          smoothness={5}
          position={[0, 0.65, 0]}
        >
          <meshStandardMaterial
            color="#dce7f3"
            metalness={0.55}
            roughness={0.27}
          />
        </RoundedBox>
        <RoundedBox
          args={[1.19, 0.77, 0.08]}
          radius={0.18}
          smoothness={5}
          position={[0, 0.65, 0.49]}
        >
          <meshStandardMaterial
            color="#111d2d"
            metalness={0.25}
            roughness={0.2}
          />
        </RoundedBox>
        <group ref={eyeRef}>
          <Sphere args={[0.105, 24, 24]} position={[-0.28, 0.73, 0.56]}>
            <meshStandardMaterial
              color="#66e6ff"
              emissive="#18bde8"
              emissiveIntensity={2.2}
            />
          </Sphere>
          <Sphere args={[0.105, 24, 24]} position={[0.28, 0.73, 0.56]}>
            <meshStandardMaterial
              color="#66e6ff"
              emissive="#18bde8"
              emissiveIntensity={2.2}
            />
          </Sphere>
        </group>
        <mesh position={[0, 0.42, 0.57]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.105, 0.018, 8, 24, Math.PI]} />
          <meshStandardMaterial
            color="#8caac6"
            emissive="#234f6b"
            emissiveIntensity={0.4}
          />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.77, 0.62, 0]}>
            <Sphere args={[0.17, 24, 24]}>
              <meshStandardMaterial
                color="#92a9c2"
                metalness={0.7}
                roughness={0.25}
              />
            </Sphere>
            <Sphere
              args={[0.07, 20, 20]}
              position={[0, 0, side * 0.08]}
            >
              <meshStandardMaterial
                color="#4eddf9"
                emissive="#13b9e9"
                emissiveIntensity={1.5}
              />
            </Sphere>
          </group>
        ))}
        <RoundedBox
          args={[0.34, 0.25, 0.32]}
          radius={0.07}
          position={[0, -0.04, 0]}
        >
          <meshStandardMaterial
            color="#647b97"
            metalness={0.75}
            roughness={0.3}
          />
        </RoundedBox>
        <RoundedBox
          args={[1.14, 0.95, 0.72]}
          radius={0.22}
          smoothness={5}
          position={[0, -0.59, 0]}
        >
          <meshStandardMaterial
            color="#c7d7e8"
            metalness={0.55}
            roughness={0.3}
          />
        </RoundedBox>
        <RoundedBox
          args={[0.58, 0.34, 0.055]}
          radius={0.09}
          position={[0, -0.48, 0.38]}
        >
          <meshStandardMaterial
            color="#172b40"
            metalness={0.3}
            roughness={0.25}
          />
        </RoundedBox>
        <Sphere args={[0.075, 20, 20]} position={[0, -0.48, 0.43]}>
          <meshStandardMaterial
            color="#5ce4ff"
            emissive="#15bce7"
            emissiveIntensity={2}
          />
        </Sphere>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.68, -0.48, 0]}>
            <RoundedBox
              args={[0.25, 0.66, 0.29]}
              radius={0.1}
              rotation={[0, 0, side * -0.14]}
            >
              <meshStandardMaterial
                color="#91a8c0"
                metalness={0.6}
                roughness={0.3}
              />
            </RoundedBox>
            <Sphere args={[0.17, 20, 20]} position={[0, -0.39, 0]}>
              <meshStandardMaterial
                color="#607993"
                metalness={0.7}
                roughness={0.25}
              />
            </Sphere>
          </group>
        ))}
        {[-1, 1].map((side) => (
          <RoundedBox
            key={side}
            args={[0.38, 0.19, 0.42]}
            radius={0.07}
            position={[side * 0.27, -1.14, 0.04]}
          >
            <meshStandardMaterial
              color="#8da3bc"
              metalness={0.65}
              roughness={0.3}
            />
          </RoundedBox>
        ))}
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 0.24, 12]} />
          <meshStandardMaterial color="#93abc5" metalness={0.7} />
        </mesh>
        <Sphere args={[0.075, 20, 20]} position={[0, 1.49, 0]}>
          <meshStandardMaterial
            color="#70e8ff"
            emissive="#12bce9"
            emissiveIntensity={2.4}
          />
        </Sphere>
      </group>
    </Float>
  );
}
class WebGLBoundary extends  Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("3D Robot could not load:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="img"
          aria-label="CodeMentor AI assistant"
          style={{
            width: "100%",
            height: "100%",
            minHeight: "240px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#66e6ff",
          }}
        >
          <BrainCircuit size={100} strokeWidth={1.2} />
        </div>
      );
    }

    return this.props.children;
  }
}
function MentorScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 5.2], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.7} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={2.2}
        color="#d6efff"
      />
      <pointLight position={[-3, 1, 2]} intensity={22} color="#6e79ff" />
      <pointLight position={[2, -1, 2]} intensity={16} color="#20c9f5" />
      <Robot />
    </Canvas>
  );
}
export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [learningStage, setLearningStage] = useState<
    "lesson" | "challenge"
  >("lesson");
  const [email, setEmail] = useState("");
  const [activeNav, setActiveNav] = useState("Overview");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  // Keep a separate conversation for each mentor, even when the modal is closed.
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});
  const chatMessages: ChatMessage[] = selectedMentor
    ? chatHistories[selectedMentor.title] ?? []
    : [];
  function setChatMessages(
    update: ChatMessage[] | ((current: ChatMessage[]) => ChatMessage[]),
  ) {
    if (!selectedMentor) return;
    const mentorTitle = selectedMentor.title;
    setChatHistories((currentHistories) => {
      const currentMessages = currentHistories[mentorTitle] ?? [];
      const nextMessages =
        typeof update === "function" ? update(currentMessages) : update;
      return { ...currentHistories, [mentorTitle]: nextMessages };
    });
  }
  const [chatInput, setChatInput] = useState("");
  const [chatMode, setChatMode] = useState<"explain" | "mentor">("explain");
  const [chatLanguage, setChatLanguage] = useState("python");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [notice, setNotice] = useState("");
  const [certificateStudentName, setCertificateStudentName] = useState("");
  const [certificateRequestEmail, setCertificateRequestEmail] = useState("");
  const [certificateRequestCourseId, setCertificateRequestCourseId] =
    useState<string | null>(null);
  const [certificateRequestLoading, setCertificateRequestLoading] =
    useState(false);
  const [certificateRequestedCourseIds, setCertificateRequestedCourseIds] =
    useState<string[]>([]);
  const [certificateRequests, setCertificateRequests] = useState<
    StudentCertificateRequest[]
  >([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Lesson URLs use: /dashboard/lesson/:courseId/:lessonId
  const routeMatch = location.pathname.match(/^\/dashboard\/lesson\/([^/]+)\/([^/]+)\/?$/);
  const routeCourseId = routeMatch?.[1] ?? null;
  const routeLessonId = routeMatch?.[2] ?? null;
  const activeCourse = useMemo(
    () =>
      courseData.find(
        (course) => course.id === (routeCourseId ?? activeCourseId),
      ) ?? null,
    [routeCourseId, activeCourseId],
  );
  const routeLessonIndex =
    activeCourse && routeLessonId
      ? activeCourse.lessons.findIndex(
          (lesson) => lesson.id === routeLessonId,
        )
      : -1;
  const currentLessonIndex =
    routeLessonIndex >= 0 ? routeLessonIndex : activeLessonIndex;
  const activeLesson: Lesson | null =
    activeCourse?.lessons[currentLessonIndex] ?? null;
  const isDedicatedLessonPage = Boolean(routeMatch);
  const totalCompletedLessons = completedLessons.length;
  function showNotice(message: string) {
    setNotice(message);
    if (noticeTimer.current) {
      clearTimeout(noticeTimer.current);
    }
    noticeTimer.current = setTimeout(() => {
      setNotice("");
    }, 4000);
  }
  function openCourse(courseId: string) {
    const courseExists = courseData.some((course) => course.id === courseId);
    if (!courseExists) {
      showNotice("This course is not available yet.");
      return;
    }
    setActiveCourseId(courseId);
    setActiveLessonIndex(0);
    setLearningStage("lesson");
    window.setTimeout(() => {
      document.getElementById("course-learning-view")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }
  function openLesson(courseId: string, lesson: Lesson, index: number) {
    setActiveCourseId(courseId);
    setActiveLessonIndex(index);
    setLearningStage("lesson");
    navigate(`/dashboard/lesson/${courseId}/${lesson.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function backToCourses() {
    setActiveCourseId(null);
    setActiveLessonIndex(0);
    setLearningStage("lesson");
    navigate("/dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function navigateToLesson(index: number) {
    if (!activeCourse) return;
    const lesson = activeCourse.lessons[index];
    if (!lesson) return;
    setActiveLessonIndex(index);
    setLearningStage("lesson");
    navigate(`/dashboard/lesson/${activeCourse.id}/${lesson.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function markLessonComplete() {
    if (!activeLesson || !activeCourse) return;
    setLearningStage("challenge");
  }
  // Load the signed-in student and their saved lesson progress.
  useEffect(() => {
    let mounted = true;
    async function loadUserAndProgress() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Could not load the signed-in user:", error.message);
        return;
      }
      if (!data.user || !mounted) return;
      setEmail(data.user.email ?? "");
      setCertificateRequestEmail(data.user.email ?? "");

      // Load certificate status from the backend so it persists across sign-ins.
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        const accessToken = sessionData.session?.access_token;

        if (accessToken) {
          const certificateResponse = await fetch(
            apiUrl("/api/certificate-requests/mine"),
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );
          const certificateResult = await certificateResponse
            .json()
            .catch(() => ({}));

          if (!certificateResponse.ok || !certificateResult.success) {
            throw new Error(
              certificateResult.message ||
                "Could not load certificate request status.",
            );
          }

          if (!mounted) return;
          const requests = (Array.isArray(certificateResult.requests)
            ? certificateResult.requests
            : []) as StudentCertificateRequest[];

          setCertificateRequests(requests);
          setCertificateRequestedCourseIds(
            [...new Set(requests.map((request) => request.course_id))],
          );

          // Show a toast only once for each newly marked-sent request. The
          // permanent banner and course card will continue to show the status.
          const sentRequests = requests.filter(
            (request) => request.status === "sent",
          );
          const seenStorageKey =
            `codementor:seen-certificate-notifications:${data.user.id}`;
          let seenIds: string[] = [];

          try {
            const stored = window.localStorage.getItem(seenStorageKey);
            const parsed: unknown = stored ? JSON.parse(stored) : [];
            if (Array.isArray(parsed)) {
              seenIds = parsed.filter(
                (value): value is string => typeof value === "string",
              );
            }
          } catch {
            // Storage may be unavailable; the certificate status still works.
          }

          const newlySent = sentRequests.filter(
            (request) => !seenIds.includes(request.id),
          );

          if (newlySent.length === 1) {
            showNotice(
              `🎉 Congratulations! You've received your first certificate for ${newlySent[0].course_title}. Check your email!`,
            );
          } else if (newlySent.length > 1) {
            showNotice(
              `🎉 Congratulations! You've received ${newlySent.length} course certificates. Check your email!`,
            );
          }

          try {
            window.localStorage.setItem(
              seenStorageKey,
              JSON.stringify([
                ...new Set([
                  ...seenIds,
                  ...sentRequests.map((request) => request.id),
                ]),
              ]),
            );
          } catch {
            // The banner below still makes sent certificate status visible.
          }
        }
      } catch (certificateError) {
        console.error(
          "Could not load certificate requests:",
          certificateError instanceof Error
            ? certificateError.message
            : certificateError,
        );
      }
        const { data: progressRows, error: progressError } = await supabase
        .from("lesson_progress")
        .select("course_id, lesson_id, completed")
        .eq("user_id", data.user.id)
        .eq("completed", true);
      if (progressError) {
        console.error(
          "Could not load lesson progress:",
          progressError.message,
        );
        return;
      }
      if (!mounted) return;
      const rows = (progressRows ?? []) as LessonProgressRow[];
      setCompletedLessons(
        rows.map((row) => getProgressKey(row.course_id, row.lesson_id)),
      );
    }
    void loadUserAndProgress();
    return () => {
      mounted = false;
      if (noticeTimer.current) {
        clearTimeout(noticeTimer.current);
      }
    };
  }, []);
  function goToSection(section: string) {
    setActiveNav(section);
    setMobileMenuOpen(false);
    if (isDedicatedLessonPage) {
      navigate("/dashboard");
    }
    const id =
      section === "Overview"
        ? "dashboard-overview"
        : section === "My Learning"
          ? "my-learning"
          : section === "AI Mentors"
            ? "ai-mentors"
            : section === "Certificates"
              ? "certificates"
              : "my-progress";
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showNotice(error.message);
      return;
    }
    window.location.replace("/");
  }
  async function handleCertificateRequest(
    event: FormEvent<HTMLFormElement>,
    courseId: string,
  ) {
    event.preventDefault();

    const studentName = certificateStudentName.trim();
    const requestEmail = certificateRequestEmail.trim();

    if (studentName.length < 2 || studentName.length > 100) {
      showNotice("Please enter your full name (2–100 characters).");
      return;
    }

    if (!requestEmail) {
      showNotice("Please enter an email address for your certificate.");
      return;
    }

    setCertificateRequestLoading(true);

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.access_token) {
        throw new Error("Please sign in again before requesting a certificate.");
      }

      const response = await fetch(
        apiUrl("/api/certificate-requests"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.session.access_token}`,
          },
          body: JSON.stringify({
            studentName,
            email: requestEmail,
            courseId,
          }),
        },
      );

      const result = await response.json().catch(() => ({}));

      
if (!response.ok) {
  const limitReached =
    response.status === 429 ||
    result.limitReached === true ||
    result.code === "AI_LIMIT_REACHED";

  if (limitReached) {
    const limitMessage =
      "Your limit has been reached. Please try again when your limit resets.";

    setChatError("");
    showNotice(limitMessage);
    return;
  }

  throw new Error(
    result.message ||
      `The AI Tutor request failed with status ${response.status}.`
  );
}

if (typeof result.reply !== "string" || !result.reply.trim()) {
  throw new Error("The AI Tutor returned an empty response. Please retry.");
}


      setCertificateRequestedCourseIds((previous) =>
        previous.includes(courseId) ? previous : [...previous, courseId],
      );

      if (result.request && typeof result.request.id === "string") {
        const savedRequest = result.request as StudentCertificateRequest;
        setCertificateRequests((previous) => [
          savedRequest,
          ...previous.filter((request) => request.id !== savedRequest.id),
        ]);
      }

      setCertificateRequestCourseId(null);
      setCertificateStudentName("");

      if (result.request?.status === "sent") {
        showNotice(
          `🎉 Congratulations! Your ${result.request.course_title || "course"} certificate has already been sent. Check your email!`,
        );
      } else {
        showNotice(
          result.message ||
            "Your certificate request has been submitted successfully. You will receive your certificate by email within 24 hours.",
        );
      }
    } catch (error) {
      showNotice(
        error instanceof Error
          ? error.message
          : "Could not submit your certificate request. Please try again.",
      );
    } finally {
      setCertificateRequestLoading(false);
    }
  }

  async function sendMentorMessage(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const message = chatInput.trim();
  if (!message || chatLoading || !selectedMentor) {
    return;
  }
  setChatInput("");
  setChatError("");
  setChatMessages((current) => [
    ...current,
    { role: "user", content: message },
  ]);
  setChatLoading(true);
  try {
    // Retrieve the current Supabase session.
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error("Unable to verify your session. Please sign in again.");
    }
    const accessToken = data.session?.access_token;
    if (!accessToken) {
      throw new Error("Your session has expired. Please sign in again.");
    }
    // Send the question to your existing Express backend.
    const response = await fetch(
      apiUrl("/api/ai-tutor/chat"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message,
          mode: chatMode,
          language: chatLanguage,
          lessonTitle: selectedMentor.title,
          mentorRole: ({
            "Code Tutor": "code-tutor",
            "AI Tutor": "code-tutor",
            "Debug Assistant": "debug-assistant",
            "Project Mentor": "project-mentor",
            "Problem-Solving Coach": "problem-solving-coach",
          } as Record<string, string>)[selectedMentor.title] ?? "code-tutor",
          code: "",
        }),
      },
    );
   
const result = await response.json().catch(() => ({}));

const errorMessage =
  typeof result.message === "string" ? result.message : "";

const limitReached =
  response.status === 429 ||
  isLimitReached(errorMessage) ||
  isLimitReached(
    typeof result.error === "string" ? result.error : "",
  );

if (!response.ok) {
  if (limitReached) {
    setChatError("");
    showNotice(LIMIT_REACHED_MESSAGE);
    throw new Error(LIMIT_REACHED_MESSAGE);
  }

  throw new Error(
    errorMessage ||
      `The AI Tutor request failed with status ${response.status}.`,
  );
}

    if (typeof result.reply !== "string" || !result.reply.trim()) {
      throw new Error("The AI Tutor returned an empty response. Please retry.");
    }
    setChatMessages((current) => [
      ...current,
      { role: "assistant", content: result.reply },
    ]);
  } catch (error) {
    setChatError(
      error instanceof Error
        ? error.message
        : "Could not connect to the AI Tutor. Please try again.",
    );
  } finally {
    setChatLoading(false);
  }
}
  // Use the signed-in user's email for the avatar and greeting.
  const firstName =
    email.split("@")[0]?.split(/[.\_-]/)[0] || "Developer";
  // Dedicated lesson page: render this instead of the dashboard underneath.
  if (isDedicatedLessonPage) {
    if (!activeCourse || !activeLesson) {
      return (
        <main className="cm-dashboard">
          <header className="cm-topbar">
            <a
              className="cm-brand"
              href="/dashboard"
              onClick={(event) => {
                event.preventDefault();
                backToCourses();
              }}
            >
              <span className="cm-brand-icon">
                <Code2 size={20} />
              </span>
              <span>
                Code<span>Mentor</span>
              </span>
            </a>
            <button
              className="cm-icon-button cm-signout"
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </header>
          <div className="cm-dashboard-shell">
            <section className="cm-progress-panel">
              <div className="cm-progress-copy">
                <span className="cm-section-kicker">LESSON UNAVAILABLE</span>
                <h2>We couldn't find this lesson.</h2>
                <p>
                  The course or lesson URL may be incorrect. Return to your
                  dashboard to select an available lesson.
                </p>
                <button
                  type="button"
                  className="cm-primary-button"
                  onClick={backToCourses}
                >
                  Back to dashboard <ArrowRight size={17} />
                </button>
              </div>
            </section>
          </div>
        </main>
      );
    }
    const activeLessonKey = getProgressKey(
      activeCourse.id,
      activeLesson.id,
    );
    const isActiveLessonCompleted =
      completedLessons.includes(activeLessonKey);
    return (
      <main className="cm-dashboard">
        <header className="cm-topbar">
          <a
            className="cm-brand"
            href="/dashboard"
            onClick={(event) => {
              event.preventDefault();
              backToCourses();
            }}
          >
            <span className="cm-brand-icon">
              <Code2 size={20} />
            </span>
            <span>
              Code<span>Mentor</span>
            </span>
          </a>
          <div className="cm-topbar-actions">
            <div className="cm-user-avatar" title={email || "Student"}>
              {firstName.charAt(0).toUpperCase()}
            </div>
            <button
              className="cm-icon-button cm-signout"
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <div className="cm-dashboard-shell">
          <button
            type="button"
            className="cm-text-link"
            onClick={backToCourses}
            style={{ marginBottom: "24px" }}
          >
            <ArrowRight
              size={16}
              style={{ transform: "rotate(180deg)" }}
            />
            Back to courses
          </button>
          <section className="cm-section cm-learning-view">
            <div className="cm-section-heading">
              <div>
                <span className="cm-section-kicker">
                  {activeCourse.language} · {activeCourse.level}
                </span>
                <h2>{activeCourse.title}</h2>
                <p>{activeCourse.description}</p>
              </div>
            </div>
            <article className="cm-progress-panel">
              <div className="cm-progress-copy">
                <span className="cm-section-kicker">
                  LESSON {currentLessonIndex + 1} OF{" "}
                  {activeCourse.lessons.length}
                  {" · "}
                  {activeLesson.duration}
                </span>
                <h2>{activeLesson.title}</h2>
                <p>{activeLesson.explanation}</p>
                
<h3>Example</h3>
<pre
  style={{
    whiteSpace: "pre-wrap",
    overflowX: "auto",
    padding: "16px",
    borderRadius: "12px",
  }}
>
  <code>{activeLesson.example}</code>
</pre>

{activeLesson.exampleExplanation && (
  <div className="example-explanation">
    <h4>Code Explanation</h4>
    <p>{activeLesson.exampleExplanation}</p>
  </div>
)}



                <h3>Practice task</h3>
                <p>{activeLesson.task}</p>
                {isActiveLessonCompleted && (
                  <p>
                    <CheckCircle2
                      size={17}
                      style={{
                        display: "inline",
                        verticalAlign: "middle",
                        marginRight: "6px",
                      }}
                    />
                    You've completed this lesson.
                  </p>
                )}
                {learningStage === "challenge" ? (
                  <>
                    <button
                      type="button"
                      className="cm-text-link"
                      onClick={() => setLearningStage("lesson")}
                      style={{ marginBottom: "16px" }}
                    >
                      <ArrowRight
                        size={16}
                        style={{ transform: "rotate(180deg)" }}
                      />
                      Back to lesson explanation
                    </button>
                    <CodePracticeEditor
                      courseId={activeCourse.id}
                      lessonId={activeLesson.id}
                      lessonTitle={activeLesson.title}
                      question={activeLesson.task}
                      onPassed={async () => {
                        // Confirm that a signed-in user exists.
                        const { data, error: userError } =
                          await supabase.auth.getUser();
                        if (userError || !data.user) {
                          showNotice(
                            "Please sign in again to save your progress.",
                          );
                          return;
                        }
                        const now = new Date().toISOString();
                        // Save or update this user's lesson completion.
                        const { error: saveError } = await supabase
                          .from("lesson_progress")
                          .upsert(
                            {
                              user_id: data.user.id,
                              course_id: activeCourse.id,
                              lesson_id: activeLesson.id,
                              completed: true,
                              completed_at: now,
                              updated_at: now,
                            },
                            {
                              onConflict:
                                "user_id,course_id,lesson_id",
                            },
                          );
                        if (saveError) {
                          console.error(
                            "Could not save lesson progress:",
                            saveError.message,
                          );
                          showNotice(
                            `Progress could not be saved: ${saveError.message}`,
                          );
                          return;
                        }
                        const key = getProgressKey(
                          activeCourse.id,
                          activeLesson.id,
                        );
                        setCompletedLessons((previous) =>
                          previous.includes(key)
                            ? previous
                            : [...previous, key],
                        );
                        setLearningStage("lesson");
                        showNotice(
                          "Challenge passed! Lesson completed.",
                        );
                      }}
                    />
                  </>
                ) : (
                  <button
                    type="button"
                    className="cm-primary-button"
                    onClick={markLessonComplete}
                  >
                    {isActiveLessonCompleted
                      ? "Practice again"
                      : "Start practice challenge"}
                    <CheckCircle2 size={17} />
                  </button>
                )}
              </div>
            </article>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "24px",
              }}
            >
              <button
                type="button"
                className="cm-text-link"
                disabled={currentLessonIndex === 0}
                onClick={() => navigateToLesson(currentLessonIndex - 1)}
              >
                <ArrowRight
                  size={16}
                  style={{ transform: "rotate(180deg)" }}
                />
                Previous lesson
              </button>
              <span>
                {currentLessonIndex + 1} / {activeCourse.lessons.length}
              </span>
              <button
                type="button"
                className="cm-primary-button"
                disabled={
                  currentLessonIndex >= activeCourse.lessons.length - 1
                }
                onClick={() => navigateToLesson(currentLessonIndex + 1)}
              >
                Next lesson <ArrowRight size={17} />
              </button>
            </div>
          </section>
        </div>
        {notice && (
          <div className="cm-toast" role="status">
            {notice}
          </div>
        )}
      </main>
    );
  }
  // Main dashboard remains available when no lesson URL is active.
  return (
    <main className="cm-dashboard">
      <header className="cm-topbar">
        <a
          className="cm-brand"
          href="#dashboard-overview"
          onClick={(event) => {
            event.preventDefault();
            goToSection("Overview");
          }}
        >
          <span className="cm-brand-icon">
            <Code2 size={20} />
          </span>
          <span>
            Code<span>Mentor</span>
          </span>
        </a>
        <nav
          className={`cm-nav ${mobileMenuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          {[
            { label: "Overview", icon: LayoutDashboard },
            { label: "My Learning", icon: BookOpen },
            { label: "AI Mentors", icon: BrainCircuit },
            { label: "Certificates", icon: CheckCircle2 },
            { label: "Progress", icon: Trophy },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className={activeNav === label ? "active" : ""}
              onClick={() => goToSection(label)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
        <div className="cm-topbar-actions">
          <button
            className="cm-icon-button"
            type="button"
            aria-label="Notifications"
            onClick={() => showNotice("You're all caught up!")}
          >
            <Bell size={18} />
            <span className="cm-notification-dot" />
          </button>
          <div className="cm-user-avatar" title={email || "Student"}>
            {firstName.charAt(0).toUpperCase()}
          </div>
          <button
            className="cm-icon-button cm-signout"
            type="button"
            onClick={handleSignOut}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
          <button
            className="cm-icon-button cm-menu-button"
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>
      <div className="cm-dashboard-shell">
        <section className="cm-welcome-row" id="dashboard-overview">
          <div>
            <div className="cm-overline">
              <span className="cm-live-dot" /> YOUR LEARNING SPACE
            </div>
            <h1>
              Welcome back, <span>{firstName}.</span>
            </h1>
            <p>Your next breakthrough starts with one small step.</p>
          </div>
          <button
            className="cm-search-button"
            type="button"
            onClick={() => goToSection("My Learning")}
          >
            <Search size={17} />
            <span>Explore learning</span>
            <ArrowRight size={16} />
          </button>
        </section>
        <section className="cm-mentor-hero" aria-label="AI mentor introduction">
          <div className="cm-hero-copy">
            <div className="cm-hero-label">
              <Sparkles size={14} /> YOUR AI LEARNING COMPANION
            </div>
            <h2>
              Think clearly.
              <br />
              <span>Code confidently.</span>
            </h2>
            <p>
              Meet your personal coding mentor. Learn concepts, explore ideas,
              and build the confidence to solve problems on your own.
            </p>
            <button
              className="cm-primary-button"
              type="button"
              onClick={() => goToSection("AI Mentors")}
            >
              Meet your mentors <ArrowRight size={17} />
            </button>
            <div className="cm-hero-footnote">
              <span className="cm-live-dot" /> READY WHEN YOU ARE
            </div>
          </div>
          <div className="cm-robot-stage">
            <div className="cm-orbit cm-orbit-one" />
            <div className="cm-orbit cm-orbit-two" />
            <div className="cm-robot-glow" />
            <div className="cm-robot-canvas">
  <WebGLBoundary>
    <MentorScene />
  </WebGLBoundary>
</div>
            <div className="cm-float-label cm-float-top">
              <Sparkles size={14} /> Learn at your pace
            </div>
            <div className="cm-float-label cm-float-bottom">
              <Code2 size={15} /> Built for curious minds
            </div>
              </div>
        </section>
        <section className="cm-stats-grid" aria-label="Learning statistics">
          <article className="cm-stat-card">
            <div className="cm-stat-icon cyan">
              <BookOpen size={19} />
            </div>
            <div>
              <span>Courses available</span>
              <strong>{courses.filter((course) => courseData.some((item) => item.id === course.courseId)).length.toString().padStart(2, "0")}</strong>
              <small>Choose your next skill</small>
            </div>
          </article>
          <article className="cm-stat-card">
            <div className="cm-stat-icon violet">
              <Zap size={19} />
            </div>
            <div>
              <span>Learning streak</span>
              <strong>
                0 <small>days</small>
              </strong>
              <small>Your journey starts today</small>
            </div>
          </article>
          <article className="cm-stat-card">
            <div className="cm-stat-icon amber">
              <Flame size={19} />
            </div>
            <div>
              <span>Lessons completed</span>
              <strong>{totalCompletedLessons}</strong>
              <small>Every expert starts somewhere</small>
            </div>
          </article>
          <article className="cm-stat-card">
            <div className="cm-stat-icon blue">
              <Trophy size={19} />
            </div>
            <div>
              <span>Current level</span>
              <strong>01</strong>
              <small>Curious beginner</small>
            </div>
          </article>
        </section>
        <section className="cm-section" id="my-learning">
          <div className="cm-section-heading">
            <div>
              <span className="cm-section-kicker">YOUR PATH</span>
              <h2>Choose what to learn</h2>
              <p>Build your foundation one concept at a time.</p>
            </div>
            <button
              className="cm-text-link"
              type="button"
              onClick={() =>
                showNotice("The complete course catalogue is coming next.")
              }
            >
              Explore courses <ArrowRight size={16} />
            </button>
          </div>
          <div className="cm-courses-grid">
            {courses.map((course) => {
              const courseDetails = courseData.find(
                (item) => item.id === course.courseId,
              );
              const courseCompletedCount =
                courseDetails?.lessons.filter((lesson) =>
                  completedLessons.includes(
                    getProgressKey(course.courseId, lesson.id),
                  ),
                ).length ?? 0;
              const courseProgress =
                courseDetails && courseDetails.lessons.length > 0
                  ? (courseCompletedCount / courseDetails.lessons.length) * 100
                  : 0;
              return (
                <article className="cm-course-card" key={course.title}>
                  <div className={`cm-course-icon ${course.color}`}>
                    {course.icon}
                  </div>
                  <div className="cm-course-tag">{course.language}</div>
                  <h3>{course.title}</h3>
                  <p>{course.subtitle}</p>
                  <div className="cm-course-meta">
                    <span>
                      <BookOpen size={14} /> {course.lessons}
                    </span>
                    <span>
                      {courseDetails ? "Beginner course" : "Coming soon"}
                    </span>
                  </div>
                  <div className="cm-progress-track">
                    <span style={{ width: `${courseProgress}%` }} />
                  </div>
                  <button
                    className="cm-course-button"
                    type="button"
                    disabled={!courseDetails}
                    onClick={() => {
                      if (courseDetails) openCourse(course.courseId);
                    }}
                  >
                    {courseDetails ? (
                      <>Start learning <ChevronRight size={16} /></>
                    ) : (
                      "Coming Soon"
                    )}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
        {activeCourse && (
          <section
            className="cm-section cm-learning-view"
            id="course-learning-view"
          >
            <button
              type="button"
              className="cm-text-link"
              onClick={() => {
                setActiveCourseId(null);
                setActiveLessonIndex(0);
                setLearningStage("lesson");
                document.getElementById("my-learning")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              <ArrowRight
                size={16}
                style={{ transform: "rotate(180deg)" }}
              />
              Back to courses
            </button>
            <div className="cm-section-heading">
              <div>
                <span className="cm-section-kicker">
                  {activeCourse.language} · {activeCourse.level}
                </span>
                <h2>{activeCourse.title}</h2>
                <p>{activeCourse.description}</p>
              </div>
            </div>
            <div className="cm-courses-grid">
              {activeCourse.lessons.map((lesson, index) => {
                const lessonKey = getProgressKey(
                  activeCourse.id,
                  lesson.id,
                );
                return (
                  <button
                    type="button"
                    key={lesson.id}
                    className="cm-course-card"
                    onClick={() =>
                      openLesson(activeCourse.id, lesson, index)
                    }
                    style={{
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div className="cm-course-tag">
                      LESSON {index + 1}
                    </div>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.duration}</p>
                    <span>
                      {completedLessons.includes(lessonKey)
                        ? "Completed ✓"
                        : "Open lesson"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}
        <section className="cm-section cm-mentors-section" id="ai-mentors">
          <div className="cm-section-heading">
            <div>
              <span className="cm-section-kicker">
                FOUR WAYS TO GET UNSTUCK
              </span>
              <h2>Your AI mentor team</h2>
              <p>
                Different challenges need different kinds of guidance.
              </p>
            </div>
          </div>
          <div className="cm-mentors-grid">
            {mentors.map((mentor) => {
              const Icon = mentor.icon;
              return (
                <button
                  className="cm-mentor-card"
                  type="button"
                  key={mentor.title}
                  onClick={() => setSelectedMentor(mentor)}
                >
                  <span className={`cm-mentor-icon ${mentor.color}`}>
                    <Icon size={21} />
                  </span>
                  <span className="cm-mentor-card-title">
                    {mentor.title}
                  </span>
                  <span className="cm-mentor-description">
                    {mentor.description}
                  </span>
                  <span className="cm-mentor-open">
                    Explore mentor <ArrowRight size={15} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        <section className="cm-section" id="certificates">
          <div className="cm-section-heading">
            <div>
              <span className="cm-section-kicker">YOUR ACHIEVEMENTS</span>
              <h2>My Certificates</h2>
              <p>
                Complete every lesson in a course, then request your certificate.
                We will email it to you within 24 hours.
              </p>
            </div>
          </div>

         

          {courseData.filter(
            (course) =>
              course.lessons.length > 0 &&
              course.lessons.every((lesson) =>
                completedLessons.includes(
                  getProgressKey(course.id, lesson.id),
                ),
              ),
          ).length === 0 ? (
            <div className="cm-progress-panel">
              <div className="cm-progress-symbol">
                <ShieldCheck size={24} />
              </div>
              <div className="cm-progress-copy">
                <h2>Your first certificate is waiting!</h2>
                <p>
                  Finish all lessons and pass their practice challenges to
                  unlock a course certificate request.
                </p>
              </div>
            </div>
          ) : (
            <div className="cm-courses-grid">
              {courseData
                .filter(
                  (course) =>
                    course.lessons.length > 0 &&
                    course.lessons.every((lesson) =>
                      completedLessons.includes(
                        getProgressKey(course.id, lesson.id),
                      ),
                    ),
                )
                .map((course) => {
                  const certificateRequest = certificateRequests.find(
                    (request) => request.course_id === course.id,
                  );
                  const alreadyRequested =
                    Boolean(certificateRequest) ||
                    certificateRequestedCourseIds.includes(course.id);
                  const certificateSent = certificateRequest?.status === "sent";

                  return (
                    <article className="cm-course-card" key={course.id}>
                      <div className="cm-course-icon">
                        <Trophy size={24} />
                      </div>
                      <div className="cm-course-tag">COURSE COMPLETED</div>
                      <h3>{course.title}</h3>
                      <p>
                        Congratulations! You've completed every lesson.
                      </p>

                      <button
                        type="button"
                        className="cm-course-button"
                        disabled={alreadyRequested || certificateRequestLoading}
                        onClick={() => {
                          setCertificateRequestCourseId((current) =>
                            current === course.id ? null : course.id,
                          );
                          setCertificateStudentName("");
                          setCertificateRequestEmail(email);
                        }}
                      >
                        {certificateSent
                          ? "Certificate Sent ✓"
                          : alreadyRequested
                            ? "Request Pending"
                            : certificateRequestCourseId === course.id
                              ? "Close Request Form"
                              : "Request Certificate"}
                        {!alreadyRequested && <ArrowRight size={16} />}
                      </button>

                      {certificateSent ? (
                        <div
                          role="status"
                          style={{
                            marginTop: "14px",
                            padding: "14px",
                            borderRadius: "10px",
                            background: "rgba(34, 197, 94, 0.10)",
                            border: "1px solid rgba(34, 197, 94, 0.35)",
                          }}
                        >
                          <strong>🎉 Congratulations!</strong>
                          <p style={{ margin: "8px 0 0" }}>
                            Your certificate has been sent. Check your email, including your spam/junk folder.
                          </p>
                        </div>
                      ) : certificateRequest?.status === "pending" ? (
                        <p style={{ marginTop: "12px" }}>
                          Your request is under review. The certificate will be emailed after it is approved and sent.
                        </p>
                      ) : null}

                      {certificateRequestCourseId === course.id &&
                        !alreadyRequested && (
                          <form
                            onSubmit={(event) =>
                              handleCertificateRequest(event, course.id)
                            }
                            style={{
                              display: "grid",
                              gap: "14px",
                              marginTop: "20px",
                              padding: "16px",
                              borderRadius: "12px",
                              border: "1px solid rgba(130, 150, 200, 0.3)",
                            }}
                          >
                            <label
                              style={{
                                display: "grid",
                                gap: "7px",
                                fontSize: "14px",
                              }}
                            >
                              Full name for certificate
                              <input
                                type="text"
                                value={certificateStudentName}
                                onChange={(event) =>
                                  setCertificateStudentName(event.target.value)
                                }
                                placeholder="Enter your full name"
                                autoComplete="name"
                                minLength={2}
                                maxLength={100}
                                required
                                disabled={certificateRequestLoading}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #64748b",
                                  background: "transparent",
                                  color: "inherit",
                                }}
                              />
                            </label>

                            <label
                              style={{
                                display: "grid",
                                gap: "7px",
                                fontSize: "14px",
                              }}
                            >
                              Email address
                              <input
                                type="email"
                                value={certificateRequestEmail}
                                onChange={(event) =>
                                  setCertificateRequestEmail(event.target.value)
                                }
                                placeholder="Where should we email your certificate?"
                                autoComplete="email"
                                maxLength={254}
                                required
                                disabled={certificateRequestLoading}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #64748b",
                                  background: "transparent",
                                  color: "inherit",
                                }}
                              />
                            </label>

                            <p style={{ fontSize: "13px", margin: 0 }}>
                              Course: <strong>{course.title}</strong>
                            </p>
                            <p style={{ fontSize: "13px", margin: 0 }}>
                              Your request will be reviewed and your certificate
                              will be emailed manually within 24 hours.
                            </p>

                            <button
                              type="submit"
                              className="cm-primary-button"
                              disabled={certificateRequestLoading}
                            >
                              {certificateRequestLoading
                                ? "Submitting..."
                                : "Submit Certificate Request"}
                              {!certificateRequestLoading && (
                                <ArrowRight size={16} />
                              )}
                            </button>

                            <button
                              type="button"
                              className="cm-text-link"
                              disabled={certificateRequestLoading}
                              onClick={() =>
                                setCertificateRequestCourseId(null)
                              }
                              style={{ justifyContent: "center" }}
                            >
                              Cancel
                            </button>
                          </form>
                        )}
                    </article>
                  );
                })}
            </div>
          )}
        </section>

        <section className="cm-progress-panel" id="my-progress">
          <div className="cm-progress-symbol">
            <Terminal size={24} />
          </div>
          <div className="cm-progress-copy">
            <span className="cm-section-kicker">YOUR PROGRESS</span>
            <h2>Every expert was once a beginner.</h2>
            <p>
              Your learning history will appear here as you complete lessons,
              practise problems, and build projects.
            </p>
          </div>
          <div className="cm-progress-badge">
            <CheckCircle2 size={16} /> Ready to begin
          </div>
        </section>
        <footer className="cm-dashboard-footer">
  <span>© 2026 CodeMentor</span>
  <span>Learn deeply. Build confidently.</span>

  <span className="cm-legal-links">
    <a href="/terms">Terms</a>
    <a href="/privacy">Privacy Policy</a>
  </span>

  <span>
    <span className="cm-live-dot" /> YOUR JOURNEY, YOUR PACE
  </span>
</footer>
      </div>
      {selectedMentor && (
  <div
    className="cm-modal-backdrop"
    onClick={() => {
      if (!chatLoading) {
        setSelectedMentor(null);
      }
    }}
  >
    <section
      className="cm-mentor-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cm-modal-title"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        className="cm-modal-close"
        type="button"
        onClick={() => {
          if (!chatLoading) {
            setSelectedMentor(null);
          }
        }}
        aria-label="Close"
        disabled={chatLoading}
      >
        <X size={18} />
      </button>
      {(() => {
        const SelectedMentorIcon = selectedMentor.icon;
        return (
          <span className={`cm-mentor-icon ${selectedMentor.color}`}>
            <SelectedMentorIcon size={22} />
          </span>
        );
      })()}
      <span className="cm-section-kicker">YOUR AI MENTOR</span>
      <h2 id="cm-modal-title">{selectedMentor.title}</h2>
      <p>{selectedMentor.description}</p>
      <div className="cm-chat-toolbar">
        <label>
          Teaching mode
          <select
            value={chatMode}
            onChange={(event) =>
              setChatMode(event.target.value as "explain" | "mentor")
            }
            disabled={chatLoading}
          >
            <option value="explain">Explain Mode</option>
            <option value="mentor">Mentor Mode</option>
          </select>
        </label>
        <label>
          Programming language
          <select
            value={chatLanguage}
            onChange={(event) => setChatLanguage(event.target.value)}
            disabled={chatLoading}
          >
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="javascript">JavaScript</option>
          </select>
        </label>
      </div>
      <div
        className="cm-chat-messages"
        aria-live="polite"
        aria-label="AI Tutor conversation"
      >
        {chatMessages.length === 0 && (
          <div className="cm-chat-empty">
            <MessageSquareCode size={28} />
            <p>{selectedMentor.prompt}</p>
            <p>Ask a question to begin your conversation.</p>
          </div>
        )}
        {chatMessages.map((message, index) => (
          <div
            key={`${index}-${message.role}`}
            className={`cm-chat-message ${
              message.role === "user"
                ? "cm-chat-user"
                : "cm-chat-assistant"
            }`}
          >
            <span>
              {message.role === "user" ? "You" : "CodeMentor AI"}
            </span>
            <div className="cm-chat-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.role === "assistant"
                  ? normalizeTutorMarkdown(message.content)
                  : message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {chatLoading && (
          <div className="cm-chat-loading" role="status">
            <Sparkles size={15} />
            CodeMentor is thinking…
          </div>
        )}
      </div>
      
{chatError && (
  <p
    className="cm-chat-error"
    role="alert"
  >
    {isLimitReached(chatError)
      ? LIMIT_REACHED_MESSAGE
      : chatError}
  </p>
)}

     
<form className="cm-chat-form" onSubmit={sendMentorMessage}>
  <div className="cm-chat-input-wrap">
    <textarea
      value={chatInput}
      onChange={(event) => setChatInput(event.target.value)}
      placeholder="Ask about programming, code, or errors..."
      aria-label="Your message"
      maxLength={4000}
      rows={2}
      disabled={chatLoading}
      required
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          event.currentTarget.form?.requestSubmit();
        }
      }}
    />

    <button
      className="cm-chat-send-button"
      type="submit"
      disabled={chatLoading || !chatInput.trim()}
      aria-label={chatLoading ? "AI mentor is thinking" : "Send message"}
      title={chatLoading ? "Thinking..." : "Send message"}
    >
      {chatLoading ? (
        <span className="cm-chat-send-spinner" />
      ) : (
        <ArrowUp size={21} strokeWidth={2.5} />
      )}
    </button>
  </div>

  <span className="cm-chat-hint">
    Enter to send · Shift + Enter for a new line
  </span>
</form>

    </section>
  </div>
)}
    </main>
  );
}
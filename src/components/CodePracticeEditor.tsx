import { useState } from "react";
import { apiUrl } from "../lib/api";
import Editor from "@monaco-editor/react";
import { supabase } from "../lib/supabase";
import type { editor as MonacoEditor } from "monaco-editor";
import "./CodePracticeEditor.css";

type Language =
  | "python"
  | "cpp"
  | "javascript"
  | "html"
  | "css";

type RunMode = "run" | "lesson";

type Props = {
  courseId?: string;
  lessonId?: string;
  lessonTitle?: string;
  question?: string;
  onPassed?: () => void | Promise<void>;
};

type TestResult = {
  passed?: boolean;
  expected?: string;
  actual?: string;
  status?: string;
};

type RunResult = {
  success?: boolean;
  completed?: boolean;
  passed?: boolean;
  status?: string;
  output?: string;
  error?: string;
  stderr?: string;
  compileOutput?: string;
  message?: string;
  testsPassed?: number;
  totalTests?: number;
  executionTime?: number | string;
  time?: number | string | null;
  memory?: number | string | null;
  testResults?: TestResult[];
};

const starterCode: Record<Language, string> = {
  python: `def add_numbers(a, b):
    # Write your solution here
    pass

print(add_numbers(5, 3))
`,

  cpp: `#include <iostream>
using namespace std;

int add_numbers(int a, int b) {
    // Write your solution here
    return 0;
}

int main() {
    cout << add_numbers(5, 3) << endl;
    return 0;
}
`,

  javascript: `function addNumbers(a, b) {
  // Write your solution here
  return 0;
}

console.log(addNumbers(5, 3));
`,

  html: `<!DOCTYPE html>
<html>
<head>
    <title>My First Website</title>
</head>
<body>
    <h1>My First Website</h1>
    <p>Welcome to my website!</p>
</body>
</html>
`,

  css: `/* Write your CSS solution here */

body {
  font-family: Arial, sans-serif;
}
`,
};

const REQUEST_TIMEOUT_MS = 60000;

/* =========================================
   UNIVERSAL JAVASCRIPT PREVIEW
========================================= */
function buildWebPreview(
  html: string,
  css: string,
  javascript: string,
): string {
  const safeCss = css.replace(/<\/style/gi, "<\\/style");
  const safeJavaScript = javascript.replace(
    /<\/script/gi,
    "<\\/script",
  );

  let document = html.trim();

  if (!/<html[\s>]/i.test(document)) {
    document = `<!DOCTYPE html>
<html>
<head></head>
<body>${document}</body>
</html>`;
  }

  if (!/<head[\s>]/i.test(document)) {
    document = document.replace(
      /<html([^>]*)>/i,
      `<html$1><head></head>`,
    );
  }

  document = document.replace(
    /<\/head>/i,
    `<style>${safeCss}</style></head>`,
  );

  const consoleCapture = `
<script>
(() => {
  const output = document.createElement("pre");

  output.style.cssText =
    "background:#101022;color:#86efac;padding:12px;" +
    "margin:15px 0;border-radius:8px;white-space:pre-wrap;";

  output.textContent = "Console output:\\n";
  document.body.appendChild(output);

  const originalLog = console.log.bind(console);

  console.log = (...args) => {
    originalLog(...args);
    output.textContent +=
      args.map(value =>
        typeof value === "object"
          ? JSON.stringify(value)
          : String(value)
      ).join(" ") + "\\n";
  };
})();
</script>`;

  const scriptTag = `<script>${safeJavaScript}</script>`;

  if (/<\/body>/i.test(document)) {
    document = document.replace(
      /<\/body>/i,
      `${consoleCapture}${scriptTag}</body>`,
    );
  } else {
    document += consoleCapture + scriptTag;
  }

  return document;
}
export default function CodePracticeEditor({
  courseId,
  lessonId,
  lessonTitle,
  question,
  onPassed,
}: Props) {
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(starterCode.python);
  const [htmlCode, setHtmlCode] = useState(starterCode.html);
const [cssCode, setCssCode] = useState(starterCode.css);
const [javascriptCode, setJavascriptCode] = useState(starterCode.javascript);

const [webTab, setWebTab] = useState<
  "html" | "css" | "javascript"
>("html");

const isWebCourse = courseId === "web";
  const [stdin, setStdin] = useState("");
  const [message, setMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeMode, setActiveMode] = useState<RunMode | null>(null);

  const [editorInstance, setEditorInstance] =
    useState<MonacoEditor.IStandaloneCodeEditor | null>(null);

  function resetCode() {
  if (isWebCourse) {
    if (webTab === "html") {
      setHtmlCode(starterCode.html);
    } else if (webTab === "css") {
      setCssCode(starterCode.css);
    } else {
      setJavascriptCode(starterCode.javascript);
    }
  } else {
    setCode(starterCode[language]);
  }

  setStdin("");
  setMessage("");
  editorInstance?.focus();
}

  async function runCode(mode: RunMode) {
    if (isRunning) return;

    

    setIsRunning(true);
    setActiveMode(mode);

    setMessage(
      mode === "run"
        ? "Running your code..."
        : "Running your code and checking the challenge...",
    );

    try {
      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          "Could not retrieve your login session. Please sign in again.",
        );
      }

      const accessToken = data.session?.access_token;

      if (!accessToken) {
        setMessage("Please sign in again before running code.");
        return;
      }

      const response = await fetch(
        apiUrl("/api/code/run"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
  language: isWebCourse ? "html" : language,
  code: isWebCourse
    ? `${htmlCode}\n<style>\n${cssCode}\n</style>\n<script>\n${javascriptCode}\n</script>`
    : code,
  html: htmlCode,
  css: cssCode,
  javascript: javascriptCode,
  stdin,
  courseId,
  lessonId,
  mode,
}),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        },
      );

      const result = (await response
        .json()
        .catch(() => ({}))) as RunResult;

      if (!response.ok || result.success === false) {
        setMessage(
          result.message ||
            `The code runner returned HTTP ${response.status}. Please try again.`,
        );
        return;
      }

      if (result.completed !== true) {
        setMessage(
          result.message ||
            "Execution did not finish successfully. Check the backend terminal.",
        );
        return;
      }

      const output =
        typeof result.output === "string" &&
        result.output.length > 0
          ? result.output.trimEnd()
          : "(No output produced)";

      // RUN CODE: execute only.
      if (mode === "run") {
        if (result.status === "Accepted") {
          setMessage(
            [
              "Code executed successfully!",
              "This does not mean your challenge has passed.",
              "Click Check challenge to evaluate your solution.",
              "",
              `Output:\n${output}`,
              result.time != null
                ? `\nExecution time: ${result.time} seconds`
                : "",
            ]
              .filter((line) => line !== "")
              .join("\n"),
          );
        } else {
          const errorOutput =
            result.compileOutput ||
            result.stderr ||
            result.error ||
            result.message ||
            output;

          setMessage(
            [
              `Execution status: ${result.status || "Failed"}`,
              "",
              errorOutput,
            ].join("\n"),
          );
        }

        return;
      }

      // CHECK CHALLENGE: evaluate automated tests.
      const details = Array.isArray(result.testResults)
        ? result.testResults
        : [];

      const hasDetailedResults =
        details.length > 0 &&
        details.every(
          (test) => typeof test.passed === "boolean",
        );

      const testsPassed = hasDetailedResults
        ? details.filter((test) => test.passed === true).length
        : result.testsPassed;

      const totalTests = hasDetailedResults
        ? details.length
        : result.totalTests;

      const hasTestResults =
        typeof testsPassed === "number" &&
        typeof totalTests === "number" &&
        totalTests > 0 &&
        testsPassed >= 0 &&
        testsPassed <= totalTests;

      const testSummary = hasTestResults
        ? `Automatic tests: ${testsPassed}/${totalTests} passed.`
        : "No valid automatic test results were provided.";

      if (result.passed === true) {
        if (
          !hasTestResults ||
          testsPassed !== totalTests
        ) {
          setMessage(
            [
              "The runner returned inconsistent test results.",
              "The lesson has not been marked complete.",
              "",
              `Output:\n${output}`,
              "",
              testSummary,
            ].join("\n"),
          );
          return;
        }

        setMessage(
          [
            "Challenge passed!",
            "",
            `Output:\n${output}`,
            "",
            testSummary,
            "",
            result.message ||
              "All configured challenge tests passed.",
          ].join("\n"),
        );

        await onPassed?.();
        return;
      }

      if (
        result.status === "Accepted" ||
        result.status === "Wrong Answer"
      ) {
        setMessage(
          [
            result.status === "Wrong Answer"
              ? "Incorrect answer."
              : "Your code ran, but the challenge has not passed.",
            "",
            `Output:\n${output}`,
            "",
            testSummary,
            "",
            result.message ||
              "Review your solution and try again.",
          ].join("\n"),
        );
        return;
      }

      setMessage(
        [
          `Execution status: ${result.status || "Failed"}`,
          "",
          result.compileOutput ||
            result.stderr ||
            result.error ||
            result.message ||
            output,
          ...(hasTestResults ? ["", testSummary] : []),
        ].join("\n"),
      );
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "TimeoutError" ||
          error.name === "AbortError")
      ) {
        setMessage(
          "The request timed out. Check the backend terminal to see whether Judge0 is queued, processing, or returning an error.",
        );
      } else {
        setMessage(
          error instanceof Error
            ? error.message
            : "Could not connect to the code runner.",
        );
      }
    } finally {
      setIsRunning(false);
      setActiveMode(null);
    }
  }
    return (
    <section className="cm-practice">
      <div className="cm-practice-heading">
        <div>
          <span className="cm-eyebrow">
            CODEMENTOR · PRACTICE LAB
          </span>

          <h2>Put your knowledge into practice</h2>

          <p>
            {lessonTitle || "Beginner coding challenge"}
            {courseId ? ` · ${courseId.toUpperCase()}` : ""}
          </p>
        </div>

        <span className="cm-practice-status">
          {isRunning
            ? activeMode === "lesson"
              ? "Checking challenge..."
              : "Running code..."
            : "Editor ready"}
        </span>
      </div>

      <div className="cm-question">
        <span className="cm-question-number">
          PRACTICE QUESTION
        </span>

        <h3>
          {question ||
            "Write a function that returns the sum of two numbers."}
        </h3>

        <p>
          Complete the function using your selected language.
        </p>
      </div>
<div className="cm-editor-toolbar">
  {isWebCourse ? (
    <div className="cm-web-tabs">
      {(["html", "css", "javascript"] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          className="cm-reset-button"
          disabled={isRunning}
          onClick={() => {
            setWebTab(tab);
            setMessage("");
          }}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  ) : (
    <>
      <label htmlFor="cm-language">Language</label>
      <select
        id="cm-language"
        value={language}
        disabled={isRunning}
        onChange={(event) => {
          const nextLanguage = event.target.value as Language;
          setLanguage(nextLanguage);
          setCode(starterCode[nextLanguage]);
          setStdin("");
          setMessage("");
        }}
      >
        <option value="python">Python</option>
        <option value="cpp">C++</option>
      </select>
    </>
  )}

  <span className="cm-editor-filename">
    {isWebCourse
      ? webTab === "html"
        ? "index.html"
        : webTab === "css"
          ? "style.css"
          : "script.js"
      : language === "python"
        ? "solution.py"
        : "solution.cpp"}
  </span>

  <button
    type="button"
    className="cm-reset-button"
    onClick={resetCode}
    disabled={isRunning}
  >
    Reset code
  </button>
</div>

      <div className="cm-monaco-wrapper">
        <Editor
          height="360px"
          language={isWebCourse ? webTab : language}
        value={
  isWebCourse
    ? webTab === "html"
      ? htmlCode
      : webTab === "css"
        ? cssCode
        : javascriptCode
    : code
}
          theme="codementor-indigo"
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("codementor-indigo", {
              base: "vs-dark",
              inherit: true,
              rules: [
                { token: "keyword", foreground: "A5B4FC" },
                { token: "string", foreground: "86EFAC" },
                {
                  token: "comment",
                  foreground: "9293B8",
                  fontStyle: "italic",
                },
                { token: "number", foreground: "F0ABFC" },
              ],
              colors: {
                "editor.background": "#101022",
                "editor.foreground": "#E5E7FF",
                "editorLineNumber.foreground": "#66678A",
                "editorLineNumber.activeForeground": "#C7D2FE",
                "editorCursor.foreground": "#A5B4FC",
                "editor.selectionBackground": "#4338CA66",
                "editor.lineHighlightBackground": "#1C1B35",
                "editorIndentGuide.background1": "#292844",
                "editorIndentGuide.activeBackground1": "#6366F1",
                "editorWidget.background": "#19182E",
                "editorSuggestWidget.background": "#19182E",
                "editorSuggestWidget.border": "#37345D",
                focusBorder: "#818CF8",
              },
            });
          }}
          onMount={(instance) => setEditorInstance(instance)}
          onChange={(value) => {
  const nextCode = value ?? "";

  if (!isWebCourse) {
    setCode(nextCode);
  } else if (webTab === "html") {
    setHtmlCode(nextCode);
  } else if (webTab === "css") {
    setCssCode(nextCode);
  } else {
    setJavascriptCode(nextCode);
  }
}}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "Consolas, monospace",
            lineNumbers: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: language === "python" ? 4 : 2,
            insertSpaces: true,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
            cursorBlinking: "smooth",
            smoothScrolling: true,
          }}
        />
      </div>
{/* Browser Preview */}
{isWebCourse && (
  <div className="cm-html-preview">
    <h3>Live Browser Preview</h3>

    <iframe
      title="CodeMentor Live Preview"
      srcDoc={buildWebPreview(
        htmlCode,
        cssCode,
        javascriptCode,
      )}
      sandbox="allow-scripts allow-forms"
      style={{
        width: "100%",
        minHeight: "300px",
        border: "none",
        borderRadius: "10px",
        background: "white",
      }}
    />
  </div>
)}
     
      {/* Program Input */}
      {!isWebCourse &&
  language !== "html" &&
  language !== "css" && (
        <div className="cm-stdin-section">
          <label htmlFor="cm-stdin">
            Program input (stdin)
          </label>

          <p>
            Enter one answer per line when your program asks
            multiple questions.
          </p>

          <textarea
            id="cm-stdin"
            value={stdin}
            onChange={(event) => setStdin(event.target.value)}
            placeholder={"Example:\n10\n20"}
            rows={4}
            disabled={isRunning}
            spellCheck={false}
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              marginTop: "10px",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #37345D",
              background: "#101022",
              color: "#E5E7FF",
              fontFamily: "Consolas, monospace",
              fontSize: "14px",
              resize: "vertical",
            }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="cm-practice-footer">
        <p>
          <span className="cm-status-dot" />
          Run your code first, then check the challenge when
          you're ready.
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="cm-run-button"
            onClick={() => void runCode("run")}
            disabled={isRunning}
          >
            {isRunning && activeMode === "run"
              ? "Running..."
              : isWebCourse || language === "html"
                ? "▶ Update preview"
                : "▶ Run code"}
          </button>

          <button
            type="button"
            className="cm-run-button"
            onClick={() => void runCode("lesson")}
            disabled={isRunning}
          >
            {isRunning && activeMode === "lesson"
              ? "Checking..."
              : "✓ Check challenge"}
          </button>
        </div>
      </div>

      {/* Execution Message */}
      {message && (
        <div
          className="cm-editor-message"
          role="status"
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
          }}
        >
          {message}
        </div>
      )}
    </section>
  );
}

import "./LegalPages.css";

type LegalPageProps = {
  type: "terms" | "privacy";
};

export default function LegalPages({ type }: LegalPageProps) {
  const isTerms = type === "terms";

  return (
    <main className="legal-page">
      <header className="legal-header">
        <a href="/" className="legal-brand">
          <span>Code</span>Mentor
        </a>
        <a href="/" className="legal-back">← Back to website</a>
      </header>

      <article className="legal-content">
        <span className="legal-label">CODEMENTOR / LEGAL</span>

        <h1>
          {isTerms ? "Terms & Conditions" : "Privacy Policy"}
        </h1>

        <p className="legal-updated">
          Last updated: November 11, 2026
        </p>

        {isTerms ? (
          <>
            <p>
              Welcome to CodeMentor. By accessing or using our
              website, you agree to these Terms & Conditions.
              Please read them carefully.
            </p>

            <h2>1. Using CodeMentor</h2>
            <p>
              CodeMentor provides programming education,
              learning resources, coding practice, and AI-based
              learning assistance. You agree to use the platform
              responsibly and for lawful educational purposes.
            </p>

            <h2>2. Your Account</h2>
            <p>
              You are responsible for maintaining the
              confidentiality of your login credentials and for
              activities performed through your account.
              Please provide accurate account information.
            </p>

            <h2>3. Learning Content</h2>
            <p>
              Lessons, examples, exercises, and other learning
              materials are provided for educational purposes.
              You may use them for personal learning, but must
              not redistribute or commercially exploit content
              without permission.
            </p>

            <h2>4. AI Mentors and Code Execution</h2>
            <p>
              AI-generated explanations and coding suggestions
              may occasionally be inaccurate. Always review and
              test code before using it. Do not submit passwords,
              private keys, or other confidential information
              through AI chats or coding exercises.
            </p>

            <h2>5. Acceptable Use</h2>
            <p>
              You must not misuse the platform, attempt
              unauthorized access, disrupt its services, or use
              it for unlawful activities.
            </p>

            <h2>6. Certificates and Progress</h2>
            <p>
              Certificates and learning progress are subject to
              the platform's course completion requirements.
              Submitting a certificate request does not
              automatically guarantee approval.
            </p>

            <h2>7. Service Availability</h2>
            <p>
              We aim to keep CodeMentor available and reliable,
              but uninterrupted access cannot be guaranteed.
              Features may change or become temporarily
              unavailable.
            </p>

            <h2>8. Changes to These Terms</h2>
            <p>
              We may update these Terms & Conditions when
              necessary. Updated terms will be published on
              this page.
            </p>

            <h2>9. Contact</h2>
            <p>
              For questions about these terms, contact the
              CodeMentor team through its official support
              channel.
            </p>
          </>
        ) : (
          <>
            <p>
              Your privacy matters to us. This Privacy Policy
              explains what information CodeMentor may process
              when you use our website and learning services.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              Depending on how you use CodeMentor, information
              may include your name, email address, account
              details, course progress, lesson activity,
              certificate requests, and information you submit
              through platform features.
            </p>

            <h2>2. AI Mentor Conversations</h2>
            <p>
              When you use AI Mentor features, your messages
              and relevant conversation context may be sent to
              our AI service provider to generate responses.
              Avoid sharing passwords, private keys, or
              sensitive personal information.
            </p>

            <h2>3. Code Execution</h2>
            <p>
              Code and input submitted through coding practice
              features may be sent to an external code execution
              service to run your programs. Do not include
              confidential information in your submissions.
            </p>

            <h2>4. How We Use Information</h2>
            <p>
              Information may be used to manage accounts,
              provide learning features, save course progress,
              process certificate requests, maintain security,
              and improve the platform.
            </p>

            <h2>5. Third-Party Services</h2>
            <p>
              CodeMentor uses third-party services for hosting,
              authentication, database storage, AI assistance,
              and code execution. These providers may process
              relevant information to deliver their services
              under their respective policies.
            </p>

            <h2>6. Data Security</h2>
            <p>
              We use technical measures intended to protect
              information. However, no online service can
              guarantee absolute security.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              Information may be retained for as long as
              necessary to provide the service, maintain
              records, meet applicable obligations, and
              resolve disputes.
            </p>

            <h2>8. Your Choices</h2>
            <p>
              You should contact the CodeMentor team through
              its official support channel for questions or
              requests concerning your account information.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              CodeMentor is an educational platform. Users
              under the applicable age of digital consent
              should use the service with the involvement
              and consent of a parent or guardian, where
              required by law.
            </p>

            <h2>10. Policy Updates</h2>
            <p>
              We may update this Privacy Policy when our
              services or legal requirements change. The
              latest version will be published on this page.
            </p>

            <h2>11. Contact</h2>
            <p>
              For privacy-related questions or requests,
              contact the CodeMentor team through its
              official support channel.
            </p>
          </>
        )}

        <footer className="legal-footer">
          © 2026 CodeMentor. All rights reserved.
        </footer>
      </article>
    </main>
  );
}

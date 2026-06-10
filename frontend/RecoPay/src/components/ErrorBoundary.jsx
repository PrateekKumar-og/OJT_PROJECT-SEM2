import React from "react";

/**
 * GlobalErrorBoundary — catches any unhandled React render errors.
 *
 * Renders a friendly full-page fallback so the app never shows a blank screen.
 * The fallback tells the user the service may be waking up (Render cold start)
 * and offers a page reload button.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console; swap for a real error-reporting service (e.g. Sentry) later
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          {/* Icon */}
          <div style={styles.iconWrapper}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={styles.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          <h1 style={styles.title}>Something went wrong</h1>
          <p style={styles.subtitle}>
            The application encountered an unexpected error.
            <br />
            If the server was asleep, it may still be waking up — please try
            again in a moment.
          </p>

          {/* Show collapsed error detail in dev mode */}
          {import.meta.env.DEV && this.state.error && (
            <details style={styles.details}>
              <summary style={styles.summary}>Error details</summary>
              <pre style={styles.pre}>{this.state.error.toString()}</pre>
            </details>
          )}

          <button style={styles.btn} onClick={this.handleReload}>
            ↻ &nbsp;Reload Page
          </button>
        </div>
      </div>
    );
  }
}

// ─── Inline styles (no external CSS dependency) ──────────────────────────────

const styles = {
  overlay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "24px",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "48px 40px",
    maxWidth: "480px",
    width: "100%",
    textAlign: "center",
    backdropFilter: "blur(12px)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  },
  iconWrapper: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "rgba(251,191,36,0.12)",
    border: "1px solid rgba(251,191,36,0.25)",
    marginBottom: "24px",
    color: "#fbbf24",
  },
  icon: {
    width: "36px",
    height: "36px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#f1f5f9",
    margin: "0 0 12px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#94a3b8",
    lineHeight: "1.6",
    margin: "0 0 28px",
  },
  details: {
    textAlign: "left",
    background: "rgba(0,0,0,0.3)",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "24px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  summary: {
    color: "#94a3b8",
    fontSize: "13px",
    cursor: "pointer",
    marginBottom: "8px",
  },
  pre: {
    color: "#f87171",
    fontSize: "12px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    margin: 0,
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "12px 28px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "100px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.2s",
    letterSpacing: "0.2px",
  },
};

export default ErrorBoundary;

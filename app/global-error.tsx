"use client";

/** Last-resort error page, used only if the root layout itself fails. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f7f4ee", color: "#1c211f", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "96px 16px" }}>
          <h1 style={{ fontSize: 36, margin: 0 }}>Something went wrong</h1>
          <p style={{ color: "#4a524d", lineHeight: 1.6 }}>
            The site hit an unexpected error. Please try again, or come back a little later.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ marginTop: 16, padding: "12px 20px", minHeight: 44, borderRadius: 8, border: 0, background: "#0e3b31", color: "#f7f4ee", fontWeight: 600, cursor: "pointer" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}

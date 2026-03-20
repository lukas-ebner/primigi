import Link from "next/link";

export default function CancelPage() {
  return (
    <div
      style={{
        background: "#08080f",
        color: "#e2e8f0",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480, padding: "0 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
        <h1
          style={{
            color: "#f87171",
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          Zahlung abgebrochen
        </h1>
        <p
          style={{
            color: "#94a3b8",
            lineHeight: 1.6,
            marginBottom: 32,
            fontSize: 16,
          }}
        >
          Die Zahlung wurde abgebrochen. Es wurde kein Betrag von deinem
          Konto abgebucht.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            background:
              "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
            color: "#08080f",
            padding: "14px 32px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            textDecoration: "none",
            letterSpacing: 0.5,
          }}
        >
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}

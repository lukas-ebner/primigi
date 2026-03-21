"use client";

import { useEffect, useState } from "react";

interface SuccessClientProps {
  token: string;
  sessionId: string;
  code: string;
}

export default function SuccessClient({ token, sessionId, code }: SuccessClientProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem("primigi_token", token);
    localStorage.setItem("primigi_session", sessionId);
    if (code) localStorage.setItem("primigi_code", code);
  }, [token, sessionId, code]);

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      style={{
        background: "#08080f",
        color: "#e2e8f0",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480, width: "100%" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h1 style={{ color: "#38bdf8", marginBottom: 8 }}>Zahlung erfolgreich!</h1>
        <p style={{ color: "#94a3b8", marginBottom: 32 }}>
          Notiere deinen Zugangscode — damit kannst du dich jederzeit wieder einloggen.
        </p>

        <div
          style={{
            background: "#1e1e2e",
            border: "1px solid #334155",
            borderRadius: 16,
            padding: "28px 24px",
            marginBottom: 24,
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Dein Zugangscode
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#38bdf8",
              textShadow: "0 0 20px rgba(56,189,248,0.4)",
              marginBottom: 20,
            }}
          >
            {code}
          </div>
          <button
            onClick={copyCode}
            style={{
              background: copied ? "#22c55e" : "rgba(56,189,248,0.15)",
              color: copied ? "#000" : "#38bdf8",
              border: "1px solid rgba(56,189,248,0.3)",
              borderRadius: 8,
              padding: "8px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {copied ? "Kopiert!" : "Code kopieren"}
          </button>
        </div>

        <a
          href={`/tool?token=${token}&session=${sessionId}`}
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
            color: "#000",
            borderRadius: 10,
            padding: "14px 40px",
            fontSize: 17,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Zur App →
        </a>
      </div>
    </div>
  );
}

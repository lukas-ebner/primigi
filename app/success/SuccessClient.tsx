"use client";

import { useEffect, useState } from "react";

interface SuccessClientProps {
  token: string;
  sessionId: string;
}

export default function SuccessClient({
  token,
  sessionId,
}: SuccessClientProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem("primigi_token", token);
    localStorage.setItem("primigi_session", sessionId);
  }, [token, sessionId]);

  function copyCode() {
    navigator.clipboard.writeText(sessionId).then(() => {
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
          Speichere deinen Zugangscode — du kannst dich damit jederzeit wieder einloggen.
        </p>

        <div
          style={{
            background: "#1e1e2e",
            border: "1px solid #334155",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 24,
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Dein Zugangscode
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 13,
              color: "#f1f5f9",
              wordBreak: "break-all",
              lineHeight: 1.6,
              marginBottom: 12,
            }}
          >
            {sessionId}
          </div>
          <button
            onClick={copyCode}
            style={{
              background: copied ? "#22c55e" : "#38bdf8",
              color: "#000",
              border: "none",
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
            background: "#38bdf8",
            color: "#000",
            borderRadius: 10,
            padding: "12px 32px",
            fontSize: 16,
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

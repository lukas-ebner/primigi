"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function StartPage() {
  const t = useTranslations();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    setCode(val);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.valid) {
        localStorage.setItem("primigi_token", data.token);
        localStorage.setItem("primigi_session", data.sessionId);
        localStorage.setItem("primigi_code", code);
        window.location.href = "/tool";
      } else {
        setError(t("start.error"));
      }
    } catch {
      setError(t("start.connError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        background: "#08080f",
        color: "#e2e8f0",
        minHeight: "100vh",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid rgba(56,189,248,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(8,8,15,0.85)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#38bdf8",
              boxShadow: "0 0 12px #38bdf8",
            }}
          />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: 2,
              color: "#38bdf8",
            }}
          >
            PRIMIGI.DEV
          </span>
        </Link>
      </nav>

      {/* MAIN CONTENT */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 65px)",
          padding: "40px 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            width: "100%",
            maxWidth: 800,
          }}
          className="start-cards"
        >
          {/* Card 1 — Returning users */}
          <div
            style={{
              background: "rgba(56,189,248,0.05)",
              border: "1px solid rgba(56,189,248,0.35)",
              borderRadius: 16,
              padding: "32px 28px",
              boxShadow: "0 0 32px rgba(56,189,248,0.08)",
              flex: 1,
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#f1f5f9",
                marginBottom: 8,
                marginTop: 0,
              }}
            >
              {t("start.returning.title")}
            </h2>
            <p
              style={{
                color: "#94a3b8",
                fontSize: 15,
                marginBottom: 24,
                marginTop: 0,
                lineHeight: 1.6,
              }}
            >
              {t("start.returning.desc")}
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder={t("start.returning.placeholder")}
                maxLength={6}
                autoComplete="off"
                spellCheck={false}
                style={{
                  display: "block",
                  width: "100%",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: 8,
                  textAlign: "center",
                  background: "rgba(15,15,25,0.8)",
                  border: "1px solid rgba(56,189,248,0.3)",
                  borderRadius: 10,
                  color: "#38bdf8",
                  padding: "14px 16px",
                  marginBottom: 16,
                  outline: "none",
                  boxSizing: "border-box",
                  textTransform: "uppercase",
                }}
              />
              {error && (
                <p
                  style={{
                    color: "#f87171",
                    fontSize: 14,
                    marginBottom: 12,
                    marginTop: 0,
                  }}
                >
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={code.length !== 6 || loading}
                style={{
                  display: "block",
                  width: "100%",
                  background:
                    code.length === 6 && !loading
                      ? "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)"
                      : "rgba(56,189,248,0.15)",
                  color: code.length === 6 && !loading ? "#08080f" : "#64748b",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 24px",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: code.length === 6 && !loading ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  letterSpacing: 0.5,
                }}
              >
                {loading ? t("start.returning.checking") : t("start.returning.button")}
              </button>
            </form>
          </div>

          {/* Card 2 — New customers */}
          <div
            style={{
              background: "rgba(15,15,25,0.5)",
              border: "1px solid rgba(148,163,184,0.15)",
              borderRadius: 16,
              padding: "32px 28px",
              flex: 1,
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#cbd5e1",
                marginBottom: 8,
                marginTop: 0,
              }}
            >
              {t("start.new.title")}
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: 15,
                marginBottom: 24,
                marginTop: 0,
                lineHeight: 1.6,
              }}
            >
              {t("start.new.desc")}
            </p>
            <form action="/api/checkout" method="POST">
              <button
                type="submit"
                style={{
                  display: "block",
                  width: "100%",
                  background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                  color: "#08080f",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 24px",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: 0.5,
                }}
              >
                {t("start.new.button")}
              </button>
            </form>
          </div>
        </div>
      </main>

      <style>{`
        @media (min-width: 680px) {
          .start-cards {
            flex-direction: row !important;
          }
        }
      `}</style>
    </div>
  );
}

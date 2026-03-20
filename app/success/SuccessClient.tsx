"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface SuccessClientProps {
  token: string;
  sessionId: string;
}

export default function SuccessClient({
  token,
  sessionId,
}: SuccessClientProps) {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("primigi_token", token);
    localStorage.setItem("primigi_session", sessionId);
    window.location.href = `/tool?token=${token}&session=${sessionId}`;
  }, [token, sessionId, router]);

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
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h1 style={{ color: "#38bdf8" }}>Zahlung erfolgreich!</h1>
        <p>Du wirst weitergeleitet...</p>
      </div>
    </div>
  );
}

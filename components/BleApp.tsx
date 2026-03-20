"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { sendTextToShoe } from "@/lib/ble-protocol";
import LEDDisplay from "./LEDDisplay";

const SERVICE_UUID = "0000ae00-0000-1000-8000-00805f9b34fb";
const CHAR_UUID = "0000ae01-0000-1000-8000-00805f9b34fb";
const DEVICE_NAME = "PRIMIGI LED";

const PRESETS = [
  "NOAH ♥",
  "BIRTHDAY BOY",
  "BIRTHDAY GIRL",
  "COOL KIDS",
  "ROCK AND ROLL",
  "HAPPY ★",
  "PARTY TIME",
  "I AM NUMBER 1",
];

interface BleAppProps {
  requireAuth?: boolean;
}

const pageStyle: React.CSSProperties = {
  background: "#08080f",
  color: "#e2e8f0",
  minHeight: "100vh",
  fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
};

const cardStyle: React.CSSProperties = {
  maxWidth: 480,
  margin: "0 auto",
  padding: "64px 24px",
  textAlign: "center",
};

export default function BleApp({ requireAuth = false }: BleAppProps) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(!requireAuth);
  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "error"
  >("idle");
  const [characteristic, setCharacteristic] =
    useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [text, setText] = useState("NOAH ♥");
  const [leftToRight, setLeftToRight] = useState(true);
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("bluetooth" in navigator)) {
      setIsSupported(false);
      return;
    }
    if (requireAuth) {
      const token = localStorage.getItem("primigi_token");
      const session = localStorage.getItem("primigi_session");
      if (!token || !session) {
        router.push("/");
        return;
      }
      fetch(`/api/verify?token=${encodeURIComponent(token)}&session=${encodeURIComponent(session)}`)
        .then((r) => r.json())
        .then((d: { valid: boolean }) => {
          if (d.valid) setIsAuthed(true);
          else router.push("/");
        })
        .catch(() => router.push("/"));
    }
  }, [requireAuth, router]);

  const connect = useCallback(async () => {
    if (!navigator.bluetooth) return;
    setStatus("connecting");
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: DEVICE_NAME }],
        optionalServices: [SERVICE_UUID],
      });
      device.addEventListener("gattserverdisconnected", () =>
        setStatus("idle")
      );
      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const char = await service.getCharacteristic(CHAR_UUID);
      setCharacteristic(char);
      setStatus("connected");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, []);

  const sendText = useCallback(async () => {
    if (!characteristic || !text.trim()) return;
    setSending(true);
    try {
      await sendTextToShoe(characteristic, text.trim(), leftToRight);
      setLastSent(text.trim());
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSending(false);
    }
  }, [characteristic, text, leftToRight]);

  if (!isSupported) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ color: "#f87171", marginBottom: 12 }}>
            Browser nicht unterstützt
          </h1>
          <p style={{ color: "#94a3b8", lineHeight: 1.6 }}>
            Web Bluetooth wird von diesem Browser nicht unterstützt.
            <br />
            <strong style={{ color: "#e2e8f0" }}>
              Bitte öffne die App in Google Chrome oder Microsoft Edge
            </strong>{" "}
            auf einem Computer oder Android-Gerät.
          </p>
          <div
            style={{
              marginTop: 24,
              padding: "16px",
              background: "rgba(56,189,248,0.05)",
              borderRadius: 8,
              fontSize: 14,
              color: "#64748b",
            }}
          >
            ❌ Safari — nicht unterstützt
            <br />
            ❌ Firefox — nicht unterstützt
            <br />
            ✅ Chrome (Mac, Windows, Android)
            <br />
            ✅ Edge (Windows)
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, color: "#94a3b8" }}>
          Zugang wird geprüft...
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid rgba(56,189,248,0.1)",
          marginBottom: 32,
        }}
      >
        <a
          href="/"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 2,
            color: "#38bdf8",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#38bdf8",
              display: "inline-block",
              marginRight: 8,
              boxShadow: "0 0 12px #38bdf8",
            }}
          />
          PRIMIGI.DEV
        </a>
        <span
          style={{
            fontSize: 12,
            color:
              status === "connected"
                ? "#4ade80"
                : "#64748b",
          }}
        >
          {status === "connected"
            ? "🟢 Verbunden"
            : status === "connecting"
            ? "🟡 Verbinde..."
            : status === "error"
            ? "🔴 Fehler"
            : "⚪ Getrennt"}
        </span>
      </nav>

      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "0 24px 64px",
        }}
      >
        {/* LED Preview */}
        <div
          style={{
            background: "#0f0f1a",
            borderRadius: 20,
            padding: "24px",
            border: "1px solid rgba(56,189,248,0.15)",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: "#475569",
              letterSpacing: 2,
              marginBottom: 12,
              textTransform: "uppercase",
            }}
          >
            Vorschau
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <LEDDisplay text={text} rows={7} visibleCols={28} />
          </div>
        </div>

        {/* Connect */}
        {status !== "connected" && (
          <button
            onClick={connect}
            disabled={status === "connecting"}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 12,
              border: "none",
              background:
                "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
              color: "#08080f",
              fontWeight: 700,
              fontSize: 17,
              cursor: status === "connecting" ? "wait" : "pointer",
              marginBottom: 16,
              opacity: status === "connecting" ? 0.7 : 1,
            }}
          >
            {status === "connecting"
              ? "Verbinde..."
              : status === "error"
              ? "Erneut verbinden"
              : "🔵 Schuh verbinden"}
          </button>
        )}

        {/* Text input */}
        <div
          style={{
            background: "#0f0f1a",
            borderRadius: 16,
            padding: 20,
            border: "1px solid rgba(56,189,248,0.1)",
            marginBottom: 16,
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: 13,
              color: "#64748b",
              marginBottom: 8,
              letterSpacing: 1,
            }}
          >
            DEIN TEXT
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendText()}
              maxLength={40}
              placeholder="Text eingeben..."
              style={{
                width: "100%",
                padding: "12px 48px 12px 16px",
                borderRadius: 10,
                border: "1px solid rgba(56,189,248,0.2)",
                background: "rgba(56,189,248,0.04)",
                color: "#e2e8f0",
                fontSize: 16,
                fontFamily: "'Space Mono', monospace",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 11,
                color: "#475569",
                fontFamily: "monospace",
              }}
            >
              {text.length}/40
            </span>
          </div>

          {/* Direction toggle */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              onClick={() => setLeftToRight(true)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 8,
                border: `1px solid ${
                  leftToRight ? "#38bdf8" : "rgba(56,189,248,0.15)"
                }`,
                background: leftToRight
                  ? "rgba(56,189,248,0.1)"
                  : "transparent",
                color: leftToRight ? "#38bdf8" : "#64748b",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              ← Links nach rechts
            </button>
            <button
              onClick={() => setLeftToRight(false)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 8,
                border: `1px solid ${
                  !leftToRight ? "#38bdf8" : "rgba(56,189,248,0.15)"
                }`,
                background: !leftToRight
                  ? "rgba(56,189,248,0.1)"
                  : "transparent",
                color: !leftToRight ? "#38bdf8" : "#64748b",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Rechts nach links →
            </button>
          </div>
        </div>

        {/* Send button */}
        <button
          onClick={sendText}
          disabled={status !== "connected" || sending || !text.trim()}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 12,
            border: "none",
            background:
              status === "connected" && !sending
                ? "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)"
                : "rgba(56,189,248,0.1)",
            color:
              status === "connected" && !sending ? "#08080f" : "#475569",
            fontWeight: 700,
            fontSize: 17,
            cursor:
              status === "connected" && !sending
                ? "pointer"
                : "not-allowed",
            marginBottom: 16,
            transition: "all 0.2s",
          }}
        >
          {sending
            ? "Sende..."
            : status !== "connected"
            ? "Erst verbinden →"
            : "📡 Text senden"}
        </button>

        {lastSent && (
          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#4ade80",
              marginBottom: 16,
            }}
          >
            ✓ Gesendet: „{lastSent}"
          </p>
        )}

        {/* Presets */}
        <div
          style={{
            background: "#0f0f1a",
            borderRadius: 16,
            padding: 16,
            border: "1px solid rgba(56,189,248,0.08)",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "#475569",
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            VORSCHLÄGE
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setText(p)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 20,
                  border: "1px solid rgba(56,189,248,0.15)",
                  background: "transparent",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Help */}
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "rgba(56,189,248,0.03)",
            borderRadius: 12,
            border: "1px solid rgba(56,189,248,0.06)",
            fontSize: 13,
            color: "#475569",
            lineHeight: 1.7,
          }}
        >
          <strong style={{ color: "#64748b" }}>Hilfe:</strong>
          <br />
          1. Schuh einschalten (roter Knopf unter der Fersenlasche)
          <br />
          2. Auf &quot;Schuh verbinden&quot; klicken
          <br />
          3. &quot;PRIMIGI LED&quot; in der Bluetooth-Liste auswählen
          <br />
          4. Text eingeben und senden
        </div>
      </div>
    </div>
  );
}

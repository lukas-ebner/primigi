"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  sendTextToShoe,
  sendAnimationMode,
  sendBrightness,
  sendSpeed,
  ANIMATION_MODES,
} from "@/lib/ble-protocol";
import LEDDisplay from "./LEDDisplay";

const SERVICE_UUID = "0000ae00-0000-1000-8000-00805f9b34fb";
const CHAR_UUID = "0000ae01-0000-1000-8000-00805f9b34fb";
const DEVICE_NAME = "PRIMIGI LED";

const PRESETS = [
  "BIRTHDAY BOY",
  "BIRTHDAY GIRL",
  "ROCK AND ROLL",
  "COOL KIDS",
  "HAPPY ★",
  "PARTY TIME",
  "I AM NUMBER 1",
  "WONDER GIRL",
  "HERO",
  "PLAY TO WIN",
];

const SYMBOLS = ["♥", "★", "!", "?", ".", ",", "-", "+", ":", "/", "(", ")", "#", "@", "*", "&", "%", "$", "=", "<", ">"];

const MODE_ICONS: Record<number, string> = {
  1: "⚡", 2: "👾", 3: "❄️", 4: "⬇️", 5: "⬆️", 6: "➡️", 7: "⬅️", 8: "■",
};

interface BleAppProps {
  requireAuth?: boolean;
}

const pageStyle: React.CSSProperties = {
  background: "#08080f",
  color: "#e2e8f0",
  minHeight: "100vh",
  fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
};

export default function BleApp({ requireAuth = false }: BleAppProps) {
  const [isAuthed, setIsAuthed] = useState(!requireAuth);
  const [authLoading, setAuthLoading] = useState(requireAuth);
  const [accessCode, setAccessCode] = useState("");
  const [accessError, setAccessError] = useState("");
  const [accessChecking, setAccessChecking] = useState(false);

  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [text, setText] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("primigi_last_text") || "BIRTHDAY BOY";
    }
    return "BIRTHDAY BOY";
  });
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [isIOS, setIsIOS] = useState(false);

  // Settings state
  const [brightness, setBrightnessState] = useState(4);
  const [speed, setSpeedState] = useState(4);
  const [activeAnimMode, setActiveAnimMode] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const sendTextRef = useRef<((t: string) => Promise<void>) | null>(null);

  // Check browser support + localStorage auth
  useEffect(() => {
    setIsIOS(/iPhone|iPad|iPod/.test(navigator.userAgent));
    if (typeof navigator === "undefined" || !("bluetooth" in navigator)) {
      setIsSupported(false);
      setAuthLoading(false);
      return;
    }
    if (!requireAuth) return;

    const token = localStorage.getItem("primigi_token");
    const session = localStorage.getItem("primigi_session");
    if (!token || !session) {
      setAuthLoading(false);
      return;
    }
    fetch(`/api/verify?token=${encodeURIComponent(token)}&session=${encodeURIComponent(session)}`)
      .then((r) => r.json())
      .then((d: { valid: boolean }) => {
        if (d.valid) setIsAuthed(true);
        setAuthLoading(false);
      })
      .catch(() => setAuthLoading(false));
  }, [requireAuth]);

  // Login via 6-char access code
  const handleAccessCode = useCallback(async () => {
    const code = accessCode.trim().toUpperCase();
    if (!code) return;
    setAccessChecking(true);
    setAccessError("");
    try {
      const res = await fetch(`/api/verify-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const d = await res.json();
      if (d.valid && d.token) {
        localStorage.setItem("primigi_token", d.token);
        localStorage.setItem("primigi_session", d.sessionId);
        localStorage.setItem("primigi_code", code);
        setIsAuthed(true);
      } else {
        setAccessError(d.error ?? "Ungültiger Code. Bitte prüfe deinen Zugangscode.");
      }
    } catch {
      setAccessError("Verbindungsfehler. Bitte versuche es erneut.");
    } finally {
      setAccessChecking(false);
    }
  }, [accessCode]);

  const connect = useCallback(async () => {
    if (!navigator.bluetooth) return;
    setStatus("connecting");
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: DEVICE_NAME }],
        optionalServices: [SERVICE_UUID],
      });
      device.addEventListener("gattserverdisconnected", () => {
        setStatus("idle");
        setCharacteristic(null);
      });
      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const char = await service.getCharacteristic(CHAR_UUID);
      setCharacteristic(char);
      setStatus("connected");
      // Auto-send last text after connect
      if (sendTextRef.current) {
        const saved = localStorage.getItem("primigi_last_text") || "BIRTHDAY BOY";
        setTimeout(() => sendTextRef.current?.(saved), 300);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, []);

  const sendText = useCallback(async (override?: string) => {
    const t = (override ?? text).trim();
    if (!characteristic || !t) return;
    setSending(true);
    try {
      await sendTextToShoe(characteristic, t);
      setLastSent(t);
      setActiveAnimMode(null);
      localStorage.setItem("primigi_last_text", t);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSending(false);
    }
  }, [characteristic, text]);

  useEffect(() => {
    sendTextRef.current = sendText;
  }, [sendText]);

  const insertSymbol = useCallback((sym: string) => {
    const input = inputRef.current;
    if (!input) {
      setText((t) => (t + sym).slice(0, 40));
      return;
    }
    const start = input.selectionStart ?? text.length;
    const end = input.selectionEnd ?? text.length;
    const newText = (text.slice(0, start) + sym + text.slice(end)).slice(0, 40);
    setText(newText);
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + sym.length, start + sym.length);
    });
  }, [text]);

  const handleBrightness = useCallback(async (val: number) => {
    setBrightnessState(val);
    if (characteristic) await sendBrightness(characteristic, val).catch(console.error);
  }, [characteristic]);

  const handleSpeed = useCallback(async (val: number) => {
    setSpeedState(val);
    if (characteristic) await sendSpeed(characteristic, val).catch(console.error);
  }, [characteristic]);

  const handleAnimMode = useCallback(async (mode: number) => {
    if (!characteristic) return;
    setActiveAnimMode(mode);
    await sendAnimationMode(characteristic, mode).catch(console.error);
  }, [characteristic]);

  const connected = status === "connected";

  // ── Browser not supported ──────────────────────────────────────────────────
  if (!isSupported) {
    return (
      <div style={pageStyle}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ color: "#f87171", marginBottom: 12 }}>Browser nicht unterstützt</h1>
          {isIOS ? (
            <>
              <p style={{ color: "#94a3b8", lineHeight: 1.7, marginBottom: 24 }}>
                Safari unterstützt kein Web Bluetooth. Für iPhone und iPad gibt es eine kostenlose App, die genau das ermöglicht:
              </p>
              <a
                href="https://apps.apple.com/app/bluefy-web-ble-browser/id1492822055"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                  color: "#000", borderRadius: 12, padding: "14px 28px",
                  fontSize: 16, fontWeight: 700, textDecoration: "none", marginBottom: 24,
                }}
              >
                📲 Bluefy aus dem App Store laden
              </a>
              <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.6 }}>
                Bluefy ist ein kostenloser Browser speziell für Bluetooth-Geräte. Nach der Installation diese Seite in Bluefy öffnen.
              </p>
            </>
          ) : (
            <>
              <p style={{ color: "#94a3b8", lineHeight: 1.6 }}>
                Web Bluetooth wird von diesem Browser nicht unterstützt.<br />
                <strong style={{ color: "#e2e8f0" }}>Bitte öffne die App in Google Chrome oder Microsoft Edge</strong> auf einem Computer oder Android-Gerät.
              </p>
              <div style={{ marginTop: 24, padding: 16, background: "rgba(56,189,248,0.05)", borderRadius: 8, fontSize: 14, color: "#64748b" }}>
                ❌ Safari — nicht unterstützt<br />
                ❌ Firefox — nicht unterstützt<br />
                ✅ Chrome (Mac, Windows, Android)<br />
                ✅ Edge (Windows)
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Auth loading ───────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#475569", fontSize: 14 }}>Lade...</span>
      </div>
    );
  }

  // ── Login form ─────────────────────────────────────────────────────────────
  if (!isAuthed) {
    return (
      <div style={pageStyle}>
        <nav style={{ display: "flex", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid rgba(56,189,248,0.1)" }}>
          <a href="/" style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 18, letterSpacing: 2, color: "#38bdf8", textDecoration: "none" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#38bdf8", display: "inline-block", marginRight: 8, boxShadow: "0 0 12px #38bdf8" }} />
            PRIMIGI.DEV
          </a>
        </nav>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "64px 24px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#e2e8f0" }}>Zugangscode eingeben</h1>
          <p style={{ color: "#64748b", marginBottom: 32, fontSize: 15, lineHeight: 1.6 }}>
            Gib deinen 6-stelligen Code ein — du hast ihn nach dem Kauf erhalten.
          </p>
          <div style={{ background: "#0f0f1a", borderRadius: 16, padding: 24, border: "1px solid rgba(56,189,248,0.1)" }}>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && accessCode.length === 6 && handleAccessCode()}
              placeholder="ABC123"
              maxLength={6}
              autoComplete="off"
              autoCapitalize="characters"
              style={{
                width: "100%", padding: "16px", borderRadius: 10,
                border: `1px solid ${accessError ? "rgba(248,113,113,0.4)" : "rgba(56,189,248,0.2)"}`,
                background: "rgba(56,189,248,0.04)", color: "#38bdf8",
                fontSize: 32, fontFamily: "'Space Mono', monospace",
                fontWeight: 700, letterSpacing: "0.3em", textAlign: "center",
                outline: "none", boxSizing: "border-box", marginBottom: 12,
              }}
            />
            {accessError && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{accessError}</p>}
            <button
              onClick={handleAccessCode}
              disabled={accessChecking || accessCode.length !== 6}
              style={{
                width: "100%", padding: "14px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                color: "#08080f", fontWeight: 700, fontSize: 16,
                cursor: accessChecking || accessCode.length !== 6 ? "not-allowed" : "pointer",
                opacity: accessChecking || accessCode.length !== 6 ? 0.6 : 1,
              }}
            >
              {accessChecking ? "Prüfe..." : "Zugang freischalten"}
            </button>
          </div>
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#334155" }}>
            Noch kein Zugangscode?{" "}
            <a href="/" style={{ color: "#38bdf8", textDecoration: "none" }}>App kaufen — 1,99 €</a>
          </p>
        </div>
      </div>
    );
  }

  // ── Main app ───────────────────────────────────────────────────────────────
  return (
    <div style={pageStyle}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid rgba(56,189,248,0.1)", marginBottom: 24 }}>
        <a href="/" style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 18, letterSpacing: 2, color: "#38bdf8", textDecoration: "none" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#38bdf8", display: "inline-block", marginRight: 8, boxShadow: "0 0 12px #38bdf8" }} />
          PRIMIGI.DEV
        </a>
        <span style={{ fontSize: 12, color: connected ? "#4ade80" : "#64748b" }}>
          {connected ? "🟢 Verbunden" : status === "connecting" ? "🟡 Verbinde..." : status === "error" ? "🔴 Fehler" : "⚪ Getrennt"}
        </span>
      </nav>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px 64px" }}>

        {/* LED Preview */}
        <div style={{ background: "#0f0f1a", borderRadius: 20, padding: 24, border: "1px solid rgba(56,189,248,0.15)", marginBottom: 20, textAlign: "center" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#475569", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>Vorschau</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <LEDDisplay text={activeAnimMode ? ANIMATION_MODES.find(m => m.value === activeAnimMode)?.label ?? "" : text} rows={7} visibleCols={28} />
          </div>
        </div>

        {/* Connect */}
        {!connected && (
          <button
            onClick={connect}
            disabled={status === "connecting"}
            style={{
              width: "100%", padding: "16px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
              color: "#08080f", fontWeight: 700, fontSize: 17,
              cursor: status === "connecting" ? "wait" : "pointer",
              marginBottom: 16, opacity: status === "connecting" ? 0.7 : 1,
            }}
          >
            {status === "connecting" ? "Verbinde..." : status === "error" ? "Erneut verbinden" : "🔵 Schuh verbinden"}
          </button>
        )}

        {/* Text input */}
        <div style={{ background: "#0f0f1a", borderRadius: 16, padding: 20, border: "1px solid rgba(56,189,248,0.1)", marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 13, color: "#64748b", marginBottom: 8, letterSpacing: 1 }}>DEIN TEXT</label>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendText(undefined)}
              maxLength={40}
              placeholder="Text eingeben..."
              style={{
                width: "100%", padding: "12px 48px 12px 16px", borderRadius: 10,
                border: "1px solid rgba(56,189,248,0.2)", background: "rgba(56,189,248,0.04)",
                color: "#e2e8f0", fontSize: 16, fontFamily: "'Space Mono', monospace",
                outline: "none", boxSizing: "border-box",
              }}
            />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#475569", fontFamily: "monospace" }}>
              {text.length}/40
            </span>
          </div>

          {/* Symbol buttons */}
          <div>
            <p style={{ fontSize: 11, color: "#475569", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>Symbole</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SYMBOLS.map((sym) => (
                <button
                  key={sym}
                  onClick={() => insertSymbol(sym)}
                  style={{
                    padding: "5px 10px", borderRadius: 6,
                    border: "1px solid rgba(56,189,248,0.2)",
                    background: "rgba(56,189,248,0.04)",
                    color: "#94a3b8", cursor: "pointer", fontSize: 15,
                    fontFamily: "'Space Mono', monospace",
                    minWidth: 36, textAlign: "center",
                  }}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Send button */}
        <button
          onClick={() => sendText()}
          disabled={!connected || sending || !text.trim()}
          style={{
            width: "100%", padding: "16px", borderRadius: 12, border: "none",
            background: connected && !sending ? "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)" : "rgba(56,189,248,0.1)",
            color: connected && !sending ? "#08080f" : "#475569",
            fontWeight: 700, fontSize: 17,
            cursor: connected && !sending ? "pointer" : "not-allowed",
            marginBottom: 16, transition: "all 0.2s",
          }}
        >
          {sending ? "Sende..." : !connected ? "Erst verbinden →" : "📡 Text senden"}
        </button>

        {lastSent && (
          <p style={{ textAlign: "center", fontSize: 13, color: "#4ade80", marginBottom: 16 }}>
            ✓ Gesendet: „{lastSent}"
          </p>
        )}

        {/* Presets */}
        <div style={{ background: "#0f0f1a", borderRadius: 16, padding: 16, border: "1px solid rgba(56,189,248,0.08)", marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: "#475569", letterSpacing: 1, marginBottom: 12 }}>VORSCHLÄGE</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setText(p)}
                style={{
                  padding: "6px 12px", borderRadius: 20,
                  border: "1px solid rgba(56,189,248,0.15)",
                  background: "transparent", color: "#94a3b8",
                  cursor: "pointer", fontSize: 13, fontFamily: "'Space Mono', monospace",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Animation modes */}
        <div style={{ background: "#0f0f1a", borderRadius: 16, padding: 16, border: "1px solid rgba(56,189,248,0.08)", marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: "#475569", letterSpacing: 1, marginBottom: 12 }}>EINGEBAUTE ANIMATIONEN</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {ANIMATION_MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => handleAnimMode(m.value)}
                disabled={!connected}
                style={{
                  padding: "10px 6px", borderRadius: 10,
                  border: `1px solid ${activeAnimMode === m.value ? "rgba(56,189,248,0.6)" : "rgba(56,189,248,0.12)"}`,
                  background: activeAnimMode === m.value ? "rgba(56,189,248,0.15)" : "rgba(56,189,248,0.03)",
                  color: activeAnimMode === m.value ? "#38bdf8" : "#64748b",
                  cursor: connected ? "pointer" : "not-allowed",
                  fontSize: 11, fontWeight: 500,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 18 }}>{MODE_ICONS[m.value]}</span>
                {m.label}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#334155", marginTop: 10 }}>
            Animationen laufen dauerhaft — Text senden um wieder Text anzuzeigen.
          </p>
        </div>

        {/* Brightness + Speed */}
        <div style={{ background: "#0f0f1a", borderRadius: 16, padding: 16, border: "1px solid rgba(56,189,248,0.08)", marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: "#475569", letterSpacing: 1, marginBottom: 16 }}>EINSTELLUNGEN</p>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: "#64748b" }}>☀️ Helligkeit</label>
              <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "monospace" }}>{brightness}</span>
            </div>
            <input
              type="range" min={0} max={8} value={brightness}
              onChange={(e) => handleBrightness(Number(e.target.value))}
              disabled={!connected}
              style={{ width: "100%", accentColor: "#38bdf8", cursor: connected ? "pointer" : "not-allowed" }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: "#64748b" }}>⚡ Geschwindigkeit</label>
              <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "monospace" }}>{speed}</span>
            </div>
            <input
              type="range" min={0} max={8} value={speed}
              onChange={(e) => handleSpeed(Number(e.target.value))}
              disabled={!connected}
              style={{ width: "100%", accentColor: "#38bdf8", cursor: connected ? "pointer" : "not-allowed" }}
            />
          </div>
        </div>

        {/* Help */}
        <div style={{ padding: 16, background: "rgba(56,189,248,0.03)", borderRadius: 12, border: "1px solid rgba(56,189,248,0.06)", fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
          <strong style={{ color: "#64748b" }}>Hilfe:</strong><br />
          1. Schuh einschalten (roter Knopf unter der Fersenlasche)<br />
          2. Auf &quot;Schuh verbinden&quot; klicken<br />
          3. &quot;PRIMIGI LED&quot; in der Bluetooth-Liste auswählen<br />
          4. Text eingeben und senden — wird beim Verbinden automatisch gesendet<br />
          <br />
          <strong style={{ color: "#64748b" }}>iPhone / iPad:</strong>{" "}
          <a href="https://apps.apple.com/app/bluefy-web-ble-browser/id1492822055" target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8" }}>
            Bluefy App
          </a>{" "}
          aus dem App Store laden und diese Seite darin öffnen.
        </div>
      </div>
    </div>
  );
}

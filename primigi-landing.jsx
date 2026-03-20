import { useState, useEffect, useRef, useCallback } from "react";

// --- 5x7 pixel font for LED matrix ---
const FONT = {
  ' ': [0,0,0,0,0],
  'A': [0x7E,0x11,0x11,0x11,0x7E],
  'B': [0x7F,0x49,0x49,0x49,0x36],
  'C': [0x3E,0x41,0x41,0x41,0x22],
  'D': [0x7F,0x41,0x41,0x41,0x3E],
  'E': [0x7F,0x49,0x49,0x49,0x41],
  'F': [0x7F,0x09,0x09,0x09,0x01],
  'G': [0x3E,0x41,0x49,0x49,0x7A],
  'H': [0x7F,0x08,0x08,0x08,0x7F],
  'I': [0x00,0x41,0x7F,0x41,0x00],
  'J': [0x20,0x40,0x41,0x3F,0x01],
  'K': [0x7F,0x08,0x14,0x22,0x41],
  'L': [0x7F,0x40,0x40,0x40,0x40],
  'M': [0x7F,0x02,0x0C,0x02,0x7F],
  'N': [0x7F,0x04,0x08,0x10,0x7F],
  'O': [0x3E,0x41,0x41,0x41,0x3E],
  'P': [0x7F,0x09,0x09,0x09,0x06],
  'Q': [0x3E,0x41,0x51,0x21,0x5E],
  'R': [0x7F,0x09,0x19,0x29,0x46],
  'S': [0x46,0x49,0x49,0x49,0x31],
  'T': [0x01,0x01,0x7F,0x01,0x01],
  'U': [0x3F,0x40,0x40,0x40,0x3F],
  'V': [0x1F,0x20,0x40,0x20,0x1F],
  'W': [0x3F,0x40,0x38,0x40,0x3F],
  'X': [0x63,0x14,0x08,0x14,0x63],
  'Y': [0x07,0x08,0x70,0x08,0x07],
  'Z': [0x61,0x51,0x49,0x45,0x43],
  '0': [0x3E,0x51,0x49,0x45,0x3E],
  '1': [0x00,0x42,0x7F,0x40,0x00],
  '2': [0x42,0x61,0x51,0x49,0x46],
  '3': [0x21,0x41,0x45,0x4B,0x31],
  '4': [0x18,0x14,0x12,0x7F,0x10],
  '5': [0x27,0x45,0x45,0x45,0x39],
  '6': [0x3C,0x4A,0x49,0x49,0x30],
  '7': [0x01,0x71,0x09,0x05,0x03],
  '8': [0x36,0x49,0x49,0x49,0x36],
  '9': [0x06,0x49,0x49,0x29,0x1E],
  '!': [0x00,0x00,0x5F,0x00,0x00],
  '?': [0x02,0x01,0x51,0x09,0x06],
  '.': [0x00,0x60,0x60,0x00,0x00],
  ',': [0x00,0x80,0x60,0x00,0x00],
  '-': [0x08,0x08,0x08,0x08,0x08],
  '+': [0x08,0x08,0x3E,0x08,0x08],
  ':': [0x00,0x36,0x36,0x00,0x00],
  '/': [0x20,0x10,0x08,0x04,0x02],
  "'": [0x00,0x05,0x03,0x00,0x00],
  '"': [0x00,0x03,0x00,0x03,0x00],
  '(': [0x00,0x1C,0x22,0x41,0x00],
  ')': [0x00,0x41,0x22,0x1C,0x00],
  '#': [0x14,0x7F,0x14,0x7F,0x14],
  '@': [0x3E,0x41,0x5D,0x55,0x1E],
  '*': [0x14,0x08,0x3E,0x08,0x14],
  '&': [0x36,0x49,0x55,0x22,0x50],
  '%': [0x23,0x13,0x08,0x64,0x62],
  '$': [0x24,0x2A,0x7F,0x2A,0x12],
  '_': [0x40,0x40,0x40,0x40,0x40],
  '=': [0x14,0x14,0x14,0x14,0x14],
  '<': [0x08,0x14,0x22,0x41,0x00],
  '>': [0x00,0x41,0x22,0x14,0x08],
  ä: [0x20,0x55,0x54,0x55,0x78],
  ö: [0x38,0x45,0x44,0x45,0x38],
  ü: [0x3C,0x41,0x40,0x21,0x7C],
  Ä: [0x7E,0x11,0x11,0x11,0x7E],
  Ö: [0x3E,0x41,0x41,0x41,0x3E],
  Ü: [0x3F,0x40,0x40,0x40,0x3F],
  ß: [0x7E,0x01,0x49,0x49,0x36],
  '♥': [0x0E,0x1F,0x3E,0x1F,0x0E],
  '★': [0x08,0x0E,0x3E,0x0E,0x08],
};

function textToPixels(text) {
  const cols = [];
  for (const ch of text) {
    const glyph = FONT[ch] || FONT[ch.toUpperCase()] || FONT['?'];
    for (const col of glyph) cols.push(col);
    cols.push(0); // 1px spacing
  }
  return cols;
}

// LED Display component
function LEDDisplay({ text, rows = 7, visibleCols = 32 }) {
  const canvasRef = useRef(null);
  const offsetRef = useRef(0);
  const pixelCols = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const t = text.trim() || "PRIMIGI";
    pixelCols.current = textToPixels(t);
    // Add padding so text scrolls fully off screen
    const padding = Array(visibleCols).fill(0);
    pixelCols.current = [...padding, ...pixelCols.current, ...padding];
    offsetRef.current = 0;
  }, [text, visibleCols]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dotSize = 8;
    const gap = 3;
    const cellSize = dotSize + gap;
    canvas.width = visibleCols * cellSize;
    canvas.height = rows * cellSize;

    let lastTime = 0;
    const speed = 60; // ms per column shift

    const draw = (timestamp) => {
      if (timestamp - lastTime > speed) {
        lastTime = timestamp;
        offsetRef.current++;
        if (offsetRef.current >= pixelCols.current.length) offsetRef.current = 0;
      }

      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let cx = 0; cx < visibleCols; cx++) {
        const colIdx = (offsetRef.current + cx) % pixelCols.current.length;
        const colData = pixelCols.current[colIdx] || 0;
        for (let ry = 0; ry < rows; ry++) {
          const isOn = (colData >> ry) & 1;
          const x = cx * cellSize;
          const y = ry * cellSize;
          if (isOn) {
            // Glow effect
            ctx.shadowColor = "#38bdf8";
            ctx.shadowBlur = 10;
            ctx.fillStyle = "#38bdf8";
            ctx.beginPath();
            ctx.arc(x + dotSize / 2, y + dotSize / 2, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = "rgba(56, 189, 248, 0.06)";
            ctx.beginPath();
            ctx.arc(x + dotSize / 2, y + dotSize / 2, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [rows, visibleCols]);

  return <canvas ref={canvasRef} style={{ width: "100%", maxWidth: 640, height: "auto", aspectRatio: `${visibleCols * 11} / ${rows * 11}`, borderRadius: 12, imageRendering: "pixelated" }} />;
}

// Compatible models data
const MODELS = [
  { name: "Infinity Light Sneaker (Jungen)", colors: ["Blau", "Weiß", "Schwarz"], sizes: "24–39", sku: "PIL 2959x" },
  { name: "Infinity Light Sneaker (Mädchen)", colors: ["Rosa", "Weiß", "Silber"], sizes: "24–39", sku: "PIL 2969x" },
  { name: "Infinity Light High-Top", colors: ["Blau", "Schwarz"], sizes: "27–39", sku: "PIL 2961x" },
  { name: "Infinity Light Velcro Low", colors: ["Weiß", "Navy"], sizes: "24–35", sku: "PIL 2963x" },
];

// FAQ data for SEO
const FAQ = [
  { q: "Funktioniert die Primigi App auf dem iPhone?", a: "Die original \"Primigi Lights\" App ist nur für Android verfügbar. Unsere App funktioniert direkt im Browser — auf iPhone, iPad, Mac, Windows und jedem anderen Gerät mit Bluetooth." },
  { q: "Wie verbinde ich die Schuhe mit der App?", a: "Schalten Sie den Schuh ein (roter Knopf unter der Fersenlasche), öffnen Sie die App im Browser und klicken Sie auf \"Verbinden\". Der Schuh erscheint als \"PRIMIGI LED\" in der Bluetooth-Liste." },
  { q: "Welche Texte kann ich auf die Schuhe schreiben?", a: "Beliebige Texte mit Buchstaben, Zahlen und Sonderzeichen. Der Text scrollt als LED-Laufschrift über das Display am Klettverschluss. Sie können auch die Laufrichtung ändern." },
  { q: "Muss ich die App installieren?", a: "Nein! Unsere App läuft direkt im Browser über Web Bluetooth. Kein App Store, kein Download, keine Installation. Einfach öffnen und verbinden." },
  { q: "Funktioniert das auch ohne Android-Gerät?", a: "Ja! Genau dafür wurde diese App entwickelt. Sie funktioniert auf jedem Gerät mit einem modernen Browser und Bluetooth — Mac, Windows-PC, iPhone, iPad, Android." },
  { q: "Wie lade ich die LED-Schuhe auf?", a: "Die Schuhe werden über das mitgelieferte USB-Kabel aufgeladen. Der USB-Anschluss befindet sich seitlich am Schuh. Eine volle Ladung hält ca. 4–6 Stunden." },
];

export default function PrimigiLanding() {
  const [inputText, setInputText] = useState("NOAH ♥");
  const [openFaq, setOpenFaq] = useState(null);
  const [cols, setCols] = useState(32);

  useEffect(() => {
    const update = () => setCols(window.innerWidth < 500 ? 20 : window.innerWidth < 768 ? 26 : 32);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: "#08080f", color: "#e2e8f0", minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid rgba(56,189,248,0.1)", position: "sticky", top: 0, zIndex: 50, background: "rgba(8,8,15,0.85)", backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 12px #38bdf8" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 18, letterSpacing: 2, color: "#38bdf8" }}>PRIMIGI.DEV</span>
        </div>
        <a href="#download" style={{ background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)", color: "#08080f", padding: "8px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", letterSpacing: 0.5 }}>
          App holen — 3 €
        </a>
      </nav>

      {/* HERO */}
      <section style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 24px 48px", textAlign: "center", position: "relative" }}>
        {/* Ambient glow */}
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: 3, color: "#38bdf8", textTransform: "uppercase", marginBottom: 12, opacity: 0.8 }}>
          Die App, die Primigi vergessen hat
        </p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.1, margin: "0 0 12px", maxWidth: 600 }}>
          Programmiere die <span style={{ color: "#38bdf8", textShadow: "0 0 30px rgba(56,189,248,0.4)" }}>LED-Laufschrift</span> deiner Primigi Schuhe
        </h1>
        <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#94a3b8", maxWidth: 520, margin: "0 0 40px", lineHeight: 1.6 }}>
          Funktioniert auf iPhone, Mac & Windows. Kein Android nötig. Einfach im Browser öffnen, verbinden, Text eingeben — fertig.
        </p>

        {/* Shoe Image */}
        <div style={{ position: "relative", maxWidth: 480, width: "100%", margin: "0 auto 32px" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "120%", height: "120%", background: "radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }} />
          <img
            src="/primigi-shoe.png"
            alt="Primigi Infinity Light Schuh mit LED-Laufschrift am Klettverschluss — blauer High-Top Sneaker mit leuchtender Textanzeige"
            style={{ width: "100%", height: "auto", position: "relative", zIndex: 1, filter: "drop-shadow(0 0 40px rgba(56,189,248,0.3))", }}
          />
        </div>

        {/* LED Simulator */}
        <div style={{ background: "#0f0f1a", borderRadius: 20, padding: "32px 24px 24px", border: "1px solid rgba(56,189,248,0.15)", maxWidth: 700, width: "100%", boxShadow: "0 0 60px rgba(56,189,248,0.06), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#475569", letterSpacing: 2, marginBottom: 16, textTransform: "uppercase" }}>
            ↓ Live-Vorschau der LED-Laufschrift
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <LEDDisplay text={inputText} rows={7} visibleCols={cols} />
          </div>
          <div style={{ position: "relative", maxWidth: 420, margin: "0 auto" }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Dein Text hier eingeben..."
              maxLength={40}
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 10,
                border: "1px solid rgba(56,189,248,0.25)",
                background: "rgba(56,189,248,0.05)",
                color: "#e2e8f0",
                fontSize: 16,
                fontFamily: "'Space Mono', monospace",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#38bdf8"}
              onBlur={(e) => e.target.style.borderColor = "rgba(56,189,248,0.25)"}
            />
            <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#475569", fontFamily: "'Space Mono', monospace" }}>
              {inputText.length}/40
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="download" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px 64px", textAlign: "center" }}>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)",
            color: "#08080f",
            padding: "18px 48px",
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 20,
            textDecoration: "none",
            letterSpacing: 0.5,
            boxShadow: "0 0 40px rgba(56,189,248,0.3), 0 8px 32px rgba(0,0,0,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 0 60px rgba(56,189,248,0.4), 0 12px 40px rgba(0,0,0,0.5)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 40px rgba(56,189,248,0.3), 0 8px 32px rgba(0,0,0,0.4)"; }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
          App herunterladen — 3 €
        </a>
        <p style={{ fontSize: 13, color: "#475569", marginTop: 16, maxWidth: 400 }}>
          Einmalzahlung. Kein Abo. Läuft im Browser auf allen Geräten.
          <br />Zahlung über Stripe. Sofort verfügbar nach Kauf.
        </p>

        {/* Trust badges */}
        <div style={{ display: "flex", gap: 32, marginTop: 32, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { icon: "🔒", label: "SSL-verschlüsselt" },
            { icon: "🌐", label: "Alle Geräte" },
            { icon: "⚡", label: "Sofort-Zugang" },
            { icon: "🔵", label: "Bluetooth LE" },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b" }}>
              <span>{icon}</span> {label}
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "64px 24px", maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, textAlign: "center", marginBottom: 48 }}>
          So einfach geht's
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          {[
            { step: "01", title: "Schuh einschalten", desc: "Roten Knopf unter der Fersenlasche drücken, bis die LEDs leuchten." },
            { step: "02", title: "App öffnen", desc: "primigi.dev im Browser aufrufen — auf Handy, Tablet oder Computer." },
            { step: "03", title: "Verbinden", desc: "Auf \"Verbinden\" klicken. Der Schuh erscheint als \"PRIMIGI LED\"." },
            { step: "04", title: "Text eingeben", desc: "Wunschtext eintippen, Senden — und staunen." },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ background: "#0f0f1a", borderRadius: 16, padding: 24, border: "1px solid rgba(56,189,248,0.08)", position: "relative" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 48, fontWeight: 700, color: "rgba(56,189,248,0.08)", position: "absolute", top: 12, right: 16 }}>{step}</span>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "#38bdf8" }}>{title}</h3>
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPATIBLE MODELS */}
      <section style={{ padding: "64px 24px", maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, textAlign: "center", marginBottom: 8 }}>
          Kompatible Modelle
        </h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40, fontSize: 15 }}>
          Alle Primigi Infinity Light Modelle mit programmierbarem LED-Display
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {MODELS.map((m) => (
            <div key={m.sku} style={{ background: "#0f0f1a", borderRadius: 14, padding: "20px 24px", border: "1px solid rgba(56,189,248,0.08)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#e2e8f0" }}>{m.name}</h3>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
                <div>Farben: <span style={{ color: "#94a3b8" }}>{m.colors.join(", ")}</span></div>
                <div>Größen: <span style={{ color: "#94a3b8" }}>{m.sizes}</span></div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#475569", marginTop: 4 }}>{m.sku}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO: FEATURES */}
      <section style={{ padding: "64px 24px", maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, textAlign: "center", marginBottom: 8 }}>
          Warum diese App?
        </h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40, fontSize: 15, maxWidth: 560, margin: "0 auto 40px" }}>
          Die originale Primigi Lights App gibt es nur für Android — und ist schwer zu finden. Unsere Lösung funktioniert überall.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { title: "Kein Android nötig", desc: "Funktioniert auf iPhone, iPad, Mac, Windows, Chromebook — überall wo ein moderner Browser mit Bluetooth läuft.", icon: "📱" },
            { title: "Keine Installation", desc: "Web-App im Browser. Kein App Store, kein Play Store, kein Download. Einfach URL öffnen und loslegen.", icon: "🌐" },
            { title: "Reverse Engineered", desc: "Wir haben das Bluetooth-Protokoll der Primigi Schuhe analysiert und eine eigene, bessere App gebaut.", icon: "🔧" },
            { title: "Sofort nach Kauf", desc: "Einmalzahlung von 3 €, kein Abo. Sofortiger Zugang per E-Mail. Funktioniert dauerhaft.", icon: "⚡" },
            { title: "Kinderleichte Bedienung", desc: "Text eingeben, auf Senden drücken. Laufrichtung wählbar. Keine technischen Kenntnisse erforderlich.", icon: "👶" },
            { title: "Deutsche Anleitung", desc: "Komplett auf Deutsch. Mit Schritt-für-Schritt Anleitung und Video-Tutorial. Support per E-Mail.", icon: "🇩🇪" },
          ].map(({ title, desc, icon }) => (
            <div key={title} style={{ background: "#0f0f1a", borderRadius: 14, padding: "24px 20px", border: "1px solid rgba(56,189,248,0.06)" }}>
              <span style={{ fontSize: 28, display: "block", marginBottom: 12 }}>{icon}</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#e2e8f0" }}>{title}</h3>
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO: FAQ */}
      <section style={{ padding: "64px 24px", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, textAlign: "center", marginBottom: 40 }}>
          Häufige Fragen
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQ.map((item, i) => (
            <div key={i} style={{ background: "#0f0f1a", borderRadius: 12, border: "1px solid rgba(56,189,248,0.08)", overflow: "hidden" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 20px",
                  background: "transparent",
                  border: "none",
                  color: "#e2e8f0",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                {item.q}
                <span style={{ color: "#38bdf8", fontSize: 20, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginLeft: 12 }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 20px 18px", fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SEO LONG-FORM TEXT */}
      <section style={{ padding: "64px 24px", maxWidth: 700, margin: "0 auto", borderTop: "1px solid rgba(56,189,248,0.06)" }}>
        <article style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#94a3b8", marginBottom: 16 }}>
            Primigi Infinity Light Schuhe programmieren — ohne Android
          </h2>
          <p>
            Die Primigi Infinity Light Kollektion begeistert Kinder mit ihrer programmierbaren LED-Laufschrift am Klettverschluss. Doch viele Eltern stehen vor einem Problem: Die offizielle „Primigi Lights" App ist ausschließlich für Android verfügbar und in den meisten App Stores nicht mehr auffindbar. Wer ein iPhone, ein iPad oder einen Mac nutzt, stand bisher ohne Lösung da.
          </p>
          <p style={{ marginTop: 16 }}>
            Unsere Web-App auf primigi.dev löst genau dieses Problem. Durch Reverse Engineering des Bluetooth-Low-Energy-Protokolls (BLE) der Schuhe haben wir eine browserbasierte Anwendung entwickelt, die auf jedem Gerät mit Bluetooth funktioniert — ganz ohne Installation. Sie öffnen die Seite, verbinden den Schuh per Bluetooth, geben Ihren Wunschtext ein und sehen ihn sofort als scrollende LED-Laufschrift auf dem Schuh-Display.
          </p>

          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#94a3b8", marginTop: 32, marginBottom: 12 }}>
            Primigi LED Schuhe App für iPhone und Mac
          </h3>
          <p>
            Wenn Sie nach „Primigi App iPhone", „Primigi App Mac" oder „Primigi Lights App Download" suchen, sind Sie hier richtig. Apple-Geräte unterstützen Web Bluetooth, was bedeutet, dass unsere App direkt im Safari- oder Chrome-Browser läuft. Kein Umweg über Android-Emulatoren, kein Ausleihen eines Android-Geräts — einfach primigi.dev öffnen und loslegen.
          </p>

          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#94a3b8", marginTop: 32, marginBottom: 12 }}>
            Primigi Infinity Light App für Windows PC
          </h3>
          <p>
            Auch Windows-Nutzer profitieren: Chrome und Edge unterstützen Web Bluetooth vollständig. Wenn Ihr PC oder Laptop Bluetooth hat (was bei den meisten modernen Geräten der Fall ist), können Sie die Primigi Schuhe direkt vom Computer aus programmieren. Ideal, wenn die Kinder ihren eigenen Text für den Schultag vorbereiten möchten.
          </p>

          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#94a3b8", marginTop: 32, marginBottom: 12 }}>
            Was ist die Primigi Lights App?
          </h3>
          <p>
            Die „Primigi Lights" App wurde vom Hersteller entwickelt, um die LED-Anzeige der Infinity Light Schuhe zu personalisieren. Über Bluetooth Low Energy (BLE) verbindet sich die App mit dem Schuh und überträgt Texte, Grafiken und Animationen an das LED-Display. Die Original-App wurde von „damonChen" für Android entwickelt und war im Google Play Store erhältlich, ist aber inzwischen schwer zu finden.
          </p>

          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#94a3b8", marginTop: 32, marginBottom: 12 }}>
            So funktionieren die Primigi LED-Schuhe
          </h3>
          <p>
            Jeder Primigi Infinity Light Schuh verfügt über ein kleines LED-Matrix-Display im Klettverschluss. Ein roter Knopf unter der Fersenlasche schaltet die LEDs ein. Im Standardmodus zeigt der Schuh „PRIMIGI" und vorinstallierte Grafiken an. Durch kurzes Doppelklicken kann die Laufrichtung und Orientierung geändert werden. Die Batterie wird über das mitgelieferte USB-Kabel geladen — der USB-Anschluss dient ausschließlich zum Laden, nicht zur Datenübertragung.
          </p>

          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#94a3b8", marginTop: 32, marginBottom: 12 }}>
            Technische Hintergründe
          </h3>
          <p>
            Die Kommunikation zwischen App und Schuh läuft über Bluetooth Low Energy (BLE). Der Schuh meldet sich als „PRIMIGI LED" und verwendet den BLE-Service UUID 0000ae00-0000-1000-8000-00805f9b34fb. Texte werden als Hex-kodierte Pakete mit Prüfsumme in 20-Byte-Blöcken übertragen. Unsere Web-App nutzt die Web Bluetooth API, um genau dieses Protokoll im Browser nachzubilden — sicher, schnell und ohne Zusatzsoftware.
          </p>
        </article>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 24px", borderTop: "1px solid rgba(56,189,248,0.06)", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 8px #38bdf8" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 14, letterSpacing: 2, color: "#38bdf8" }}>PRIMIGI.DEV</span>
        </div>
        <p style={{ fontSize: 12, color: "#334155", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
          Nicht verbunden mit Primigi S.p.A. oder IMAC S.p.A. Dies ist ein unabhängiges Tool.
          <br />
          „Primigi" und „Infinity Light" sind eingetragene Marken ihrer jeweiligen Inhaber.
          <br />
          <span style={{ color: "#475569" }}>© 2026 primigi.dev — Regensburg, Deutschland</span>
        </p>
      </footer>
    </div>
  );
}

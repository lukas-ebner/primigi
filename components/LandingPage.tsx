"use client";

import { useState, useEffect } from "react";
import LEDDisplay from "./LEDDisplay";

// Compatible models data
const MODELS = [
  {
    name: "Infinity Light Sneaker (Jungen)",
    colors: ["Blau", "Weiß", "Schwarz"],
    sizes: "24–39",
    sku: "PIL 2959x",
  },
  {
    name: "Infinity Light Sneaker (Mädchen)",
    colors: ["Rosa", "Weiß", "Silber"],
    sizes: "24–39",
    sku: "PIL 2969x",
  },
  {
    name: "Infinity Light High-Top",
    colors: ["Blau", "Schwarz"],
    sizes: "27–39",
    sku: "PIL 2961x",
  },
  {
    name: "Infinity Light Velcro Low",
    colors: ["Weiß", "Navy"],
    sizes: "24–35",
    sku: "PIL 2963x",
  },
];

// FAQ data for SEO
const FAQ = [
  {
    q: "Funktioniert die Primigi App auf dem iPhone?",
    a: 'Die original "Primigi Lights" App ist nur für Android verfügbar. Unsere App funktioniert direkt im Browser — auf iPhone, iPad, Mac, Windows und jedem anderen Gerät mit Bluetooth.',
  },
  {
    q: "Wie verbinde ich die Schuhe mit der App?",
    a: 'Schalten Sie den Schuh ein (roter Knopf unter der Fersenlasche), öffnen Sie die App im Browser und klicken Sie auf "Verbinden". Der Schuh erscheint als "PRIMIGI LED" in der Bluetooth-Liste.',
  },
  {
    q: "Welche Texte kann ich auf die Schuhe schreiben?",
    a: "Beliebige Texte mit Buchstaben, Zahlen und Sonderzeichen. Der Text scrollt als LED-Laufschrift über das Display am Klettverschluss. Sie können auch die Laufrichtung ändern.",
  },
  {
    q: "Muss ich die App installieren?",
    a: "Nein! Unsere App läuft direkt im Browser über Web Bluetooth. Kein App Store, kein Download, keine Installation. Einfach öffnen und verbinden.",
  },
  {
    q: "Funktioniert das auch ohne Android-Gerät?",
    a: "Ja! Genau dafür wurde diese App entwickelt. Sie funktioniert auf jedem Gerät mit einem modernen Browser und Bluetooth — Mac, Windows-PC, iPhone, iPad, Android.",
  },
  {
    q: "Wie lade ich die LED-Schuhe auf?",
    a: "Die Schuhe werden über das mitgelieferte USB-Kabel aufgeladen. Der USB-Anschluss befindet sich seitlich am Schuh. Eine volle Ladung hält ca. 4–6 Stunden.",
  },
  {
    q: "Welche Primigi Schuhe sind mit der App kompatibel?",
    a: "Alle Primigi Modelle der Reihe 'Infinity Light' bzw. 'B&g Infinity Light' — sowohl die Low-Top Sneaker für Jungen und Mädchen als auch die High-Top Varianten. Erkennbar am LED-Display im Klettverschluss und dem roten Knopf unter der Fersenlasche.",
  },
  {
    q: "Wo kann ich den Primigi Lights App Download finden?",
    a: "Die originale Primigi Lights App ist im App Store nicht verfügbar und im Google Play Store kaum noch zu finden. Unsere Web-App auf primigi.dev ist die zuverlässige Alternative — funktioniert direkt im Browser ohne Download.",
  },
  {
    q: "Wie fallen Primigi Infinity Light Schuhe aus?",
    a: "Primigi Infinity Light Schuhe fallen normal bis leicht klein aus. Wir empfehlen, eine halbe Größe größer zu bestellen. Die Schuhe gibt es in den Größen EU 24 bis 39.",
  },
];

export default function LandingPage() {
  const [inputText, setInputText] = useState("NOAH ♥");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [cols, setCols] = useState(32);

  useEffect(() => {
    const update = () =>
      setCols(
        window.innerWidth < 500 ? 20 : window.innerWidth < 768 ? 26 : 32
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        background: "#08080f",
        color: "#e2e8f0",
        minHeight: "100vh",
        overflowX: "hidden",
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
        </div>
        <a
          href="#download"
          style={{
            background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
            color: "#08080f",
            padding: "8px 20px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            letterSpacing: 0.5,
          }}
        >
          App holen — 3 €
        </a>
      </nav>

      {/* HERO */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "64px 24px 48px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 400,
            background:
              "radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            letterSpacing: 3,
            color: "#38bdf8",
            textTransform: "uppercase",
            marginBottom: 12,
            opacity: 0.8,
          }}
        >
          Die App, die Primigi vergessen hat
        </p>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.1,
            margin: "0 0 12px",
            maxWidth: 600,
          }}
        >
          Programmiere die{" "}
          <span
            style={{
              color: "#38bdf8",
              textShadow: "0 0 30px rgba(56,189,248,0.4)",
            }}
          >
            LED-Laufschrift
          </span>{" "}
          deiner Primigi Schuhe
        </h1>
        <p
          style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "#94a3b8",
            maxWidth: 520,
            margin: "0 0 40px",
            lineHeight: 1.6,
          }}
        >
          Funktioniert auf iPhone, Mac & Windows. Kein Android nötig. Einfach
          im Browser öffnen, verbinden, Text eingeben — fertig.
        </p>

        {/* Shoe Image */}
        <div
          style={{
            position: "relative",
            maxWidth: 480,
            width: "100%",
            margin: "0 auto 32px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "120%",
              height: "120%",
              background:
                "radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 60%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <img
            src="/primigi-shoe.png"
            alt="Primigi Infinity Light Schuh mit LED-Laufschrift am Klettverschluss — blauer High-Top Sneaker mit leuchtender Textanzeige"
            style={{
              width: "100%",
              height: "auto",
              position: "relative",
              zIndex: 1,
              filter: "drop-shadow(0 0 40px rgba(56,189,248,0.3))",
            }}
          />
        </div>

        {/* LED Simulator */}
        <div
          style={{
            background: "#0f0f1a",
            borderRadius: 20,
            padding: "32px 24px 24px",
            border: "1px solid rgba(56,189,248,0.15)",
            maxWidth: 700,
            width: "100%",
            boxShadow:
              "0 0 60px rgba(56,189,248,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: "#475569",
              letterSpacing: 2,
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            ↓ Live-Vorschau der LED-Laufschrift
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <LEDDisplay text={inputText} rows={7} visibleCols={cols} />
          </div>
          <div
            style={{ position: "relative", maxWidth: 420, margin: "0 auto" }}
          >
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
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "#38bdf8")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor =
                  "rgba(56,189,248,0.25)")
              }
            />
            <span
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 12,
                color: "#475569",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {inputText.length}/40
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="download"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px 24px 64px",
          textAlign: "center",
        }}
      >
        <form action="/api/checkout" method="POST">
          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background:
                "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)",
              color: "#08080f",
              padding: "18px 48px",
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 20,
              border: "none",
              letterSpacing: 0.5,
              boxShadow:
                "0 0 40px rgba(56,189,248,0.3), 0 8px 32px rgba(0,0,0,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 0 60px rgba(56,189,248,0.4), 0 12px 40px rgba(0,0,0,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 0 40px rgba(56,189,248,0.3), 0 8px 32px rgba(0,0,0,0.4)";
            }}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            App herunterladen — 3 €
          </button>
        </form>
        <p
          style={{
            fontSize: 13,
            color: "#475569",
            marginTop: 16,
            maxWidth: 400,
          }}
        >
          Einmalzahlung. Kein Abo. Läuft im Browser auf allen Geräten.
          <br />
          Zahlung über Stripe. Sofort verfügbar nach Kauf.
        </p>

        {/* Trust badges */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 32,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { icon: "🔒", label: "SSL-verschlüsselt" },
            { icon: "🌐", label: "Alle Geräte" },
            { icon: "⚡", label: "Sofort-Zugang" },
            { icon: "🔵", label: "Bluetooth LE" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "#64748b",
              }}
            >
              <span>{icon}</span> {label}
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{ padding: "64px 24px", maxWidth: 800, margin: "0 auto" }}
      >
        <h2
          style={{
            fontSize: "clamp(22px, 3.5vw, 32px)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          So einfach geht&apos;s
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24,
          }}
        >
          {[
            {
              step: "01",
              title: "Schuh einschalten",
              desc: "Roten Knopf unter der Fersenlasche drücken, bis die LEDs leuchten.",
            },
            {
              step: "02",
              title: "App öffnen",
              desc: "primigi.dev im Browser aufrufen — auf Handy, Tablet oder Computer.",
            },
            {
              step: "03",
              title: "Verbinden",
              desc: 'Auf "Verbinden" klicken. Der Schuh erscheint als "PRIMIGI LED".',
            },
            {
              step: "04",
              title: "Text eingeben",
              desc: "Wunschtext eintippen, Senden — und staunen.",
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              style={{
                background: "#0f0f1a",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(56,189,248,0.08)",
                position: "relative",
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 48,
                  fontWeight: 700,
                  color: "rgba(56,189,248,0.08)",
                  position: "absolute",
                  top: 12,
                  right: 16,
                }}
              >
                {step}
              </span>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: "#38bdf8",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#94a3b8",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPATIBLE MODELS */}
      <section
        style={{ padding: "64px 24px", maxWidth: 800, margin: "0 auto" }}
      >
        <h2
          style={{
            fontSize: "clamp(22px, 3.5vw, 32px)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Kompatible Modelle
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: 40,
            fontSize: 15,
          }}
        >
          Alle Primigi Infinity Light Modelle mit programmierbarem LED-Display
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {MODELS.map((m) => (
            <div
              key={m.sku}
              style={{
                background: "#0f0f1a",
                borderRadius: 14,
                padding: "20px 24px",
                border: "1px solid rgba(56,189,248,0.08)",
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 10,
                  color: "#e2e8f0",
                }}
              >
                {m.name}
              </h3>
              <div
                style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}
              >
                <div>
                  Farben:{" "}
                  <span style={{ color: "#94a3b8" }}>
                    {m.colors.join(", ")}
                  </span>
                </div>
                <div>
                  Größen:{" "}
                  <span style={{ color: "#94a3b8" }}>{m.sizes}</span>
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    color: "#475569",
                    marginTop: 4,
                  }}
                >
                  {m.sku}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO: FEATURES */}
      <section
        style={{ padding: "64px 24px", maxWidth: 800, margin: "0 auto" }}
      >
        <h2
          style={{
            fontSize: "clamp(22px, 3.5vw, 32px)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Warum diese App?
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: 40,
            fontSize: 15,
            maxWidth: 560,
            margin: "0 auto 40px",
          }}
        >
          Die originale Primigi Lights App gibt es nur für Android — und ist
          schwer zu finden. Unsere Lösung funktioniert überall.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              title: "Kein Android nötig",
              desc: "Funktioniert auf iPhone, iPad, Mac, Windows, Chromebook — überall wo ein moderner Browser mit Bluetooth läuft.",
              icon: "📱",
            },
            {
              title: "Keine Installation",
              desc: "Web-App im Browser. Kein App Store, kein Play Store, kein Download. Einfach URL öffnen und loslegen.",
              icon: "🌐",
            },
            {
              title: "Reverse Engineered",
              desc: "Wir haben das Bluetooth-Protokoll der Primigi Schuhe analysiert und eine eigene, bessere App gebaut.",
              icon: "🔧",
            },
            {
              title: "Sofort nach Kauf",
              desc: "Einmalzahlung von 3 €, kein Abo. Sofortiger Zugang per E-Mail. Funktioniert dauerhaft.",
              icon: "⚡",
            },
            {
              title: "Kinderleichte Bedienung",
              desc: "Text eingeben, auf Senden drücken. Laufrichtung wählbar. Keine technischen Kenntnisse erforderlich.",
              icon: "👶",
            },
            {
              title: "Deutsche Anleitung",
              desc: "Komplett auf Deutsch. Mit Schritt-für-Schritt Anleitung und Video-Tutorial. Support per E-Mail.",
              icon: "🇩🇪",
            },
          ].map(({ title, desc, icon }) => (
            <div
              key={title}
              style={{
                background: "#0f0f1a",
                borderRadius: 14,
                padding: "24px 20px",
                border: "1px solid rgba(56,189,248,0.06)",
              }}
            >
              <span
                style={{ fontSize: 28, display: "block", marginBottom: 12 }}
              >
                {icon}
              </span>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: "#e2e8f0",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#94a3b8",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO: FAQ */}
      <section
        style={{ padding: "64px 24px", maxWidth: 700, margin: "0 auto" }}
      >
        <h2
          style={{
            fontSize: "clamp(22px, 3.5vw, 32px)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          Häufige Fragen
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {FAQ.map((item, i) => (
            <div
              key={i}
              style={{
                background: "#0f0f1a",
                borderRadius: 12,
                border: "1px solid rgba(56,189,248,0.08)",
                overflow: "hidden",
              }}
            >
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
                <span
                  style={{
                    color: "#38bdf8",
                    fontSize: 20,
                    transform: openFaq === i ? "rotate(45deg)" : "none",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                    marginLeft: 12,
                  }}
                >
                  +
                </span>
              </button>
              {openFaq === i && (
                <div
                  style={{
                    padding: "0 20px 18px",
                    fontSize: 14,
                    color: "#94a3b8",
                    lineHeight: 1.7,
                  }}
                >
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SEO LONG-FORM TEXT */}
      <section
        style={{
          padding: "64px 24px",
          maxWidth: 700,
          margin: "0 auto",
          borderTop: "1px solid rgba(56,189,248,0.06)",
        }}
      >
        <article
          style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8 }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#94a3b8",
              marginBottom: 16,
            }}
          >
            Primigi Infinity Light Schuhe programmieren — die Primigi Lights App Alternative
          </h2>
          <p>
            Die Primigi Infinity Light Kollektion begeistert Kinder mit ihrer
            programmierbaren LED-Laufschrift am Klettverschluss. Ob als LED Schuhe
            für Kinder Jungen oder als LED Schuhe für Kinder Mädchen — die leuchtenden
            Sneaker sind der Hit auf dem Schulhof. Doch viele
            Eltern stehen vor einem Problem: Die offizielle „Primigi Lights"
            App ist ausschließlich für Android verfügbar und im Google Play Store
            nicht mehr auffindbar. Der Primigi Lights App Download funktioniert nicht
            mehr. Wer ein iPhone, ein iPad oder einen Mac nutzt, stand bisher ohne Lösung da.
          </p>
          <p style={{ marginTop: 16 }}>
            Wir hatten das gleiche Problem. Zwei Kinder, leuchtende Schuhe,
            kein Android-Gerät im Haus. Also haben wir kurzerhand die App
            selbst gebaut. Per Reverse Engineering des Bluetooth-Protokolls
            entstand eine Web-App, die im Browser läuft — egal ob iPhone,
            Mac oder Windows-Laptop. Seite öffnen, Schuh verbinden,
            Wunschtext eintippen. Fertig.
          </p>

          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#94a3b8",
              marginTop: 32,
              marginBottom: 12,
            }}
          >
            Primigi LED Schuhe App für iPhone und Mac
          </h3>
          <p>
            Wenn Sie nach „Primigi App iPhone", „Primigi App Mac", „Primigi App Download"
            oder „Primigi Lights App Apple" suchen, sind Sie hier richtig.
            Apple-Geräte unterstützen Web Bluetooth, was bedeutet, dass unsere
            Primigi App direkt im Safari- oder Chrome-Browser läuft. Kein Umweg über
            Android-Emulatoren, kein Ausleihen eines Android-Geräts — einfach
            primigi.dev öffnen und loslegen. Die Primigi App für iPhone funktioniert
            genauso zuverlässig wie die originale Android-Version.
          </p>

          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#94a3b8",
              marginTop: 32,
              marginBottom: 12,
            }}
          >
            Primigi Infinity Light App für Windows PC
          </h3>
          <p>
            Auch Windows-Nutzer profitieren: Chrome und Edge unterstützen Web
            Bluetooth vollständig. Wenn Ihr PC oder Laptop Bluetooth hat (was
            bei den meisten modernen Geräten der Fall ist), können Sie die
            Primigi Kinderschuhe direkt vom Computer aus programmieren. Ideal, wenn
            die Kinder ihren eigenen Text für den Schultag vorbereiten
            möchten. Die Primigi Infinity Light App funktioniert auf Windows 10 und 11
            ohne zusätzliche Software.
          </p>

          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#94a3b8",
              marginTop: 32,
              marginBottom: 12,
            }}
          >
            Was ist die Primigi Lights App?
          </h3>
          <p>
            Primigi hat die „Primigi Lights" App ursprünglich für Android
            veröffentlicht. Per Bluetooth Low Energy (BLE) verbindet sie sich
            mit dem Schuh und schickt Texte, Grafiken und Animationen ans
            LED-Display. Klingt toll — nur: Im Play Store ist sie praktisch
            verschwunden. Und für iPhones gab es sie nie. Genau diese Lücke
            füllt primigi.dev als Primigi Lights App Alternative.
          </p>

          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#94a3b8",
              marginTop: 32,
              marginBottom: 12,
            }}
          >
            So funktionieren die Primigi LED-Schuhe
          </h3>
          <p>
            Am Klettverschluss sitzt ein kleines LED-Matrix-Display. Roten
            Knopf unter der Fersenlasche drücken — schon leuchtet „PRIMIGI"
            über den Schuh. Vorinstallierte Grafiken laufen im Wechsel durch.
            Per Doppelklick ändern Sie Laufrichtung und Orientierung.
            Wichtig zu wissen: Der USB-Anschluss am Schuh lädt nur den Akku.
            Daten gehen ausschließlich per Bluetooth rein.
          </p>

          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#94a3b8",
              marginTop: 32,
              marginBottom: 12,
            }}
          >
            Technische Hintergründe
          </h3>
          <p>
            Unter der Haube ist es Bluetooth Low Energy (BLE). Der Schuh
            taucht als „PRIMIGI LED" auf und erwartet Hex-kodierte Pakete mit
            Prüfsumme — jeweils 20 Byte am Stück. Wir haben das Protokoll
            aus der Original-APK reverse-engineered und als Web Bluetooth
            API im Browser nachgebaut. Klingt nerdig, bedeutet für Sie aber
            einfach: Seite öffnen, verbinden, Text eintippen, läuft.
          </p>

          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#94a3b8",
              marginTop: 32,
              marginBottom: 12,
            }}
          >
            LED Schuhe Kinder — welche Modelle sind kompatibel?
          </h3>
          <p>
            Die Primigi Infinity Light Reihe umfasst mehrere Modelle für Jungen
            und Mädchen. LED Schuhe für Kinder Jungen gibt es als blaue oder
            schwarze Sneaker (PIL 2959x), LED Schuhe für Kinder Mädchen in Rosa,
            Weiß und Silber (PIL 2969x). Zusätzlich sind High-Top Varianten
            (PIL 2961x) und Velcro-Low-Modelle (PIL 2963x) erhältlich. Alle
            Modelle mit dem Markennamen „Infinity Light" oder „B&g Infinity Light"
            haben das programmierbare LED-Display und sind mit unserer App kompatibel.
            Die Schuhe sind in den Größen EU 24 bis 39 erhältlich und werden über
            Händler wie Amazon, Spartoo und den Primigi Online-Shop in ganz Europa
            verkauft.
          </p>

          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#94a3b8",
              marginTop: 32,
              marginBottom: 12,
            }}
          >
            Primigi Schuhe mit App steuern — wie fallen Primigi Schuhe aus?
          </h3>
          <p>
            Kurze Antwort: Eher knapp. Bei unseren Kids mussten wir eine halbe
            Nummer größer nehmen. Sportlicher Schnitt, Klettverschluss mit
            integriertem LED-Display — sitzt fest, aber bestellen Sie im Zweifel
            lieber eine Nummer größer. Der Akku hält bei normalem Spielplatz-Einsatz
            4 bis 6 Stunden, geladen wird per USB-Kabel (liegt bei).
          </p>
        </article>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "32px 24px",
          borderTop: "1px solid rgba(56,189,248,0.06)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#38bdf8",
              boxShadow: "0 0 8px #38bdf8",
            }}
          />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 2,
              color: "#38bdf8",
            }}
          >
            PRIMIGI.DEV
          </span>
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#334155",
            maxWidth: 500,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Nicht verbunden mit Primigi S.p.A. oder IMAC S.p.A. Dies ist ein
          unabhängiges Tool.
          <br />
          „Primigi" und „Infinity Light" sind eingetragene Marken ihrer
          jeweiligen Inhaber.
          <br />
          <span style={{ color: "#475569" }}>
            © 2026 primigi.dev — Regensburg, Deutschland
          </span>
        </p>
      </footer>
    </div>
  );
}

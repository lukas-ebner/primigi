"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LEDDisplay from "./LEDDisplay";
import LanguageSwitcher from "./LanguageSwitcher";

// Compatible models data (technical, not translated)
const MODELS = [
  {
    name: "Infinity Light Sneaker (Boys)",
    nameKey: "infinity_light_boys",
    colors: ["Blue", "White", "Black"],
    sizes: "24–39",
    sku: "PIL 2959x",
  },
  {
    name: "Infinity Light Sneaker (Girls)",
    nameKey: "infinity_light_girls",
    colors: ["Pink", "White", "Silver"],
    sizes: "24–39",
    sku: "PIL 2969x",
  },
  {
    name: "Infinity Light High-Top",
    nameKey: "infinity_light_hightop",
    colors: ["Blue", "Black"],
    sizes: "27–39",
    sku: "PIL 2961x",
  },
  {
    name: "Infinity Light Velcro Low",
    nameKey: "infinity_light_velcro",
    colors: ["White", "Navy"],
    sizes: "24–35",
    sku: "PIL 2963x",
  },
];

export default function LandingPage() {
  const t = useTranslations();
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

  const FAQ = Array.from({ length: 9 }, (_, i) => ({
    q: t(`faq.q${i + 1}`),
    a: t(`faq.a${i + 1}`),
  }));

  const FEATURES = [
    { title: t("features.f1title"), desc: t("features.f1desc"), icon: t("features.f1icon") },
    { title: t("features.f2title"), desc: t("features.f2desc"), icon: t("features.f2icon") },
    { title: t("features.f3title"), desc: t("features.f3desc"), icon: t("features.f3icon") },
    { title: t("features.f4title"), desc: t("features.f4desc"), icon: t("features.f4icon") },
    { title: t("features.f5title"), desc: t("features.f5desc"), icon: t("features.f5icon") },
    { title: t("features.f6title"), desc: t("features.f6desc"), icon: t("features.f6icon") },
  ];

  const STEPS = [
    { step: "01", title: t("steps.s1title"), desc: t("steps.s1desc") },
    { step: "02", title: t("steps.s2title"), desc: t("steps.s2desc") },
    { step: "03", title: t("steps.s3title"), desc: t("steps.s3desc") },
    { step: "04", title: t("steps.s4title"), desc: t("steps.s4desc") },
  ];

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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LanguageSwitcher />
          <Link
            href="/start"
            style={{
              background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
              color: "#08080f",
              padding: "8px 20px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              letterSpacing: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            {t("nav.start")}
          </Link>
        </div>
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
          {t("hero.tagline")}
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
          {t("hero.titleStart")}{" "}
          <span
            style={{
              color: "#38bdf8",
              textShadow: "0 0 30px rgba(56,189,248,0.4)",
            }}
          >
            {t("hero.titleHighlight")}
          </span>{" "}
          {t("hero.titleEnd")}
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
          Mac & Windows: direkt im Browser. iPhone & iPad: einmal die kostenlose{" "}
          <a
            href="https://apps.apple.com/app/bluefy-web-ble-browser/id1492822055"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#38bdf8", textDecoration: "underline" }}
          >
            Bluefy App
          </a>{" "}
          installieren — dann genauso einfach.
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
            {t("hero.previewLabel")}
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
              placeholder={t("hero.inputPlaceholder")}
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

      {/* iPhone callout */}
      <section style={{ padding: "0 24px 8px", maxWidth: 560, margin: "0 auto" }}>
        <div style={{
          background: "rgba(56,189,248,0.06)",
          border: "1px solid rgba(56,189,248,0.2)",
          borderRadius: 14,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 28 }}>📱</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", margin: "0 0 4px" }}>
              {t("iphone.title")}
            </p>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
              {t("iphone.desc").split("Bluefy App").map((part, idx, arr) =>
                idx < arr.length - 1 ? (
                  <span key={idx}>
                    {part}
                    <strong style={{ color: "#e2e8f0" }}>Bluefy App</strong>
                  </span>
                ) : (
                  <span key={idx}>{part}</span>
                )
              )}
            </p>
          </div>
          <a
            href="https://apps.apple.com/app/bluefy-web-ble-browser/id1492822055"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "rgba(56,189,248,0.15)",
              border: "1px solid rgba(56,189,248,0.3)",
              color: "#38bdf8",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {t("iphone.cta")}
          </a>
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
            {t("cta.button")}
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
          {t("cta.subtext")}
          <br />
          {t("cta.payment")}
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
            { icon: "🔒", label: t("cta.ssl") },
            { icon: "🌐", label: t("cta.devices") },
            { icon: "⚡", label: t("cta.instant") },
            { icon: "🔵", label: t("cta.ble") },
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
          {t("steps.title")}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24,
          }}
        >
          {STEPS.map(({ step, title, desc }) => (
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
          {t("models.title")}
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: 40,
            fontSize: 15,
          }}
        >
          {t("models.subtitle")}
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
                  Colors:{" "}
                  <span style={{ color: "#94a3b8" }}>
                    {m.colors.join(", ")}
                  </span>
                </div>
                <div>
                  Sizes:{" "}
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
          {t("features.title")}
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
          {t("features.subtitle")}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {FEATURES.map(({ title, desc, icon }) => (
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
          {t("faq.title")}
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
            {t("seo.h1")}
          </h2>
          <p>{t("seo.p1")}</p>
          <p style={{ marginTop: 16 }}>{t("seo.p2")}</p>

          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#94a3b8",
              marginTop: 32,
              marginBottom: 12,
            }}
          >
            {t("seo.h2")}
          </h3>
          <p>{t("seo.p3")}</p>

          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#94a3b8",
              marginTop: 32,
              marginBottom: 12,
            }}
          >
            {t("seo.h3")}
          </h3>
          <p>{t("seo.p4")}</p>

          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#94a3b8",
              marginTop: 32,
              marginBottom: 12,
            }}
          >
            {t("seo.h4")}
          </h3>
          <p>{t("seo.p5")}</p>

          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#94a3b8",
              marginTop: 32,
              marginBottom: 12,
            }}
          >
            {t("seo.h5")}
          </h3>
          <p>{t("seo.p6")}</p>

          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#94a3b8",
              marginTop: 32,
              marginBottom: 12,
            }}
          >
            {t("seo.h6")}
          </h3>
          <p>{t("seo.p7")}</p>

          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#94a3b8",
              marginTop: 32,
              marginBottom: 12,
            }}
          >
            {t("seo.h7")}
          </h3>
          <p>{t("seo.p8")}</p>
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
          {t("footer.disclaimer")}
          <br />
          {t("footer.trademark")}
          <br />
          <span style={{ color: "#475569" }}>
            {t("footer.copyright")}
          </span>
        </p>
      </footer>
    </div>
  );
}

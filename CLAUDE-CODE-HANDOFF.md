# Primigi.dev — Claude Code Handoff: i18n + Sprachversionen + SEO

## Projekt-Status
Das Next.js-Projekt in `/Users/lukasebner/projects/primigi` hat bereits:
- ✅ Landing Page (DE) mit SEO-optimierten Texten, FAQ, Schema-Markup
- ✅ `/app` Seite mit Web Bluetooth BLE-Verbindung (Paywall)
- ✅ Stripe Checkout + Webhook + Token-Verifizierung
- ✅ LED-Simulator (Canvas-basiert, scrollende Laufschrift)
- ✅ AI-Detection-Remediation durchgeführt (Score ~82/100)

## Offene Aufgaben

---

### AUFGABE 1: i18n-System einrichten (next-intl)

**Ziel:** Mehrsprachige Landing Pages mit eigenen URLs pro Sprache.

**Tech-Entscheidung:** `next-intl` (nicht `next-i18next`, das ist für Pages Router).

**Schritte:**
1. `npm install next-intl`
2. Ordnerstruktur umbauen auf `app/[locale]/page.tsx`
3. Middleware für Locale-Detection einrichten
4. Default-Locale: `de` (ohne Prefix, also `primigi.dev/` bleibt deutsch)
5. Andere Locales mit Prefix: `primigi.dev/it/`, `primigi.dev/en/`, `primigi.dev/pl/` etc.

**Dateistruktur nach Umbau:**
```
app/
  [locale]/
    page.tsx          ← Landing Page (dynamisch nach Locale)
    layout.tsx        ← Locale-spezifische Metadata + lang-Attribut
    app/
      page.tsx        ← BLE-App (kann einsprachig EN bleiben)
  api/
    checkout/route.ts ← bleibt unverändert
    webhook/route.ts  ← bleibt unverändert
    verify/route.ts   ← bleibt unverändert
messages/
  de.json
  it.json
  en.json
  pl.json
  ro.json
  bg.json
  hu.json
  fr.json
  cs.json
middleware.ts         ← next-intl Locale-Detection
i18n.ts               ← next-intl Config
```

**middleware.ts:**
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['de', 'it', 'en', 'pl', 'ro', 'bg', 'hu', 'fr', 'cs'],
  defaultLocale: 'de',
  localePrefix: 'as-needed' // DE ohne Prefix, alle anderen mit
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
```

---

### AUFGABE 2: Übersetzungsdateien erstellen

**Prioritätsreihenfolge (nach Suchvolumen):**
1. 🇮🇹 Italienisch (`it.json`) — 27.000 SV "primigi", größter Markt
2. 🇬🇧 Englisch (`en.json`) — UK + US + global
3. 🇵🇱 Polnisch (`pl.json`) — 2.400 SV
4. 🇷🇴 Rumänisch (`ro.json`) — 1.300 SV
5. 🇧🇬 Bulgarisch (`bg.json`) — 1.400 SV
6. 🇭🇺 Ungarisch (`hu.json`) — 600 SV
7. 🇫🇷 Französisch (`fr.json`) — Stores in FR + BE
8. 🇨🇿 Tschechisch (`cs.json`) — Stores in CZ

**Struktur jeder JSON-Datei (am Beispiel `de.json`):**
```json
{
  "meta": {
    "title": "Primigi App für iPhone & Mac — LED-Schuhe programmieren ohne Android | primigi.dev",
    "description": "Die Primigi Lights App gibt es nur für Android. Unsere Web-App funktioniert auf iPhone, iPad, Mac und Windows. LED-Laufschrift der Primigi Infinity Light Schuhe programmieren — direkt im Browser. Kein Download nötig.",
    "ogTitle": "Primigi LED-Schuhe programmieren — Primigi Lights App Alternative für iPhone & Mac",
    "ogDescription": "Web-App zum Programmieren der LED-Laufschrift auf Primigi Infinity Light Kinderschuhen. Die Primigi Lights App gibt es nur für Android — unsere Alternative funktioniert auf iPhone, iPad, Mac und Windows."
  },
  "nav": {
    "cta": "App holen — 3 €"
  },
  "hero": {
    "tagline": "Die App, die Primigi vergessen hat",
    "title": "Programmiere die {highlight} deiner Primigi Schuhe",
    "titleHighlight": "LED-Laufschrift",
    "subtitle": "Funktioniert auf iPhone, Mac & Windows. Kein Android nötig. Einfach im Browser öffnen, verbinden, Text eingeben — fertig.",
    "inputPlaceholder": "Dein Text hier eingeben...",
    "previewLabel": "↓ Live-Vorschau der LED-Laufschrift"
  },
  "cta": {
    "button": "App herunterladen — 3 €",
    "subtext": "Einmalzahlung. Kein Abo. Läuft im Browser auf allen Geräten.",
    "payment": "Zahlung über Stripe. Sofort verfügbar nach Kauf.",
    "badges": {
      "ssl": "SSL-verschlüsselt",
      "devices": "Alle Geräte",
      "instant": "Sofort-Zugang",
      "ble": "Bluetooth LE"
    }
  },
  "steps": {
    "title": "So einfach geht's",
    "items": [
      {
        "step": "01",
        "title": "Schuh einschalten",
        "desc": "Roten Knopf unter der Fersenlasche drücken, bis die LEDs leuchten."
      },
      {
        "step": "02",
        "title": "App öffnen",
        "desc": "primigi.dev im Browser aufrufen — auf Handy, Tablet oder Computer."
      },
      {
        "step": "03",
        "title": "Verbinden",
        "desc": "Auf \"Verbinden\" klicken. Der Schuh erscheint als \"PRIMIGI LED\"."
      },
      {
        "step": "04",
        "title": "Text eingeben",
        "desc": "Wunschtext eintippen, Senden — und staunen."
      }
    ]
  },
  "models": {
    "title": "Kompatible Modelle",
    "subtitle": "Alle Primigi Infinity Light Modelle mit programmierbarem LED-Display"
  },
  "features": {
    "title": "Warum diese App?",
    "subtitle": "Die originale Primigi Lights App gibt es nur für Android — und ist schwer zu finden. Unsere Lösung funktioniert überall.",
    "items": [
      {
        "title": "Kein Android nötig",
        "desc": "Funktioniert auf iPhone, iPad, Mac, Windows, Chromebook — überall wo ein moderner Browser mit Bluetooth läuft.",
        "icon": "📱"
      },
      {
        "title": "Keine Installation",
        "desc": "Web-App im Browser. Kein App Store, kein Play Store, kein Download. Einfach URL öffnen und loslegen.",
        "icon": "🌐"
      },
      {
        "title": "Reverse Engineered",
        "desc": "Wir haben das Bluetooth-Protokoll der Primigi Schuhe analysiert und eine eigene, bessere App gebaut.",
        "icon": "🔧"
      },
      {
        "title": "Sofort nach Kauf",
        "desc": "Einmalzahlung von 3 €, kein Abo. Sofortiger Zugang per E-Mail. Funktioniert dauerhaft.",
        "icon": "⚡"
      },
      {
        "title": "Kinderleichte Bedienung",
        "desc": "Text eingeben, auf Senden drücken. Laufrichtung wählbar. Keine technischen Kenntnisse erforderlich.",
        "icon": "👶"
      },
      {
        "title": "Deutsche Anleitung",
        "desc": "Komplett auf Deutsch. Mit Schritt-für-Schritt Anleitung und Video-Tutorial. Support per E-Mail.",
        "icon": "🇩🇪"
      }
    ]
  },
  "faq": {
    "title": "Häufige Fragen",
    "items": [
      {
        "q": "Funktioniert die Primigi App auf dem iPhone?",
        "a": "Die original \"Primigi Lights\" App ist nur für Android verfügbar. Unsere App funktioniert direkt im Browser — auf iPhone, iPad, Mac, Windows und jedem anderen Gerät mit Bluetooth."
      },
      {
        "q": "Wie verbinde ich die Schuhe mit der App?",
        "a": "Schalten Sie den Schuh ein (roter Knopf unter der Fersenlasche), öffnen Sie die App im Browser und klicken Sie auf \"Verbinden\". Der Schuh erscheint als \"PRIMIGI LED\" in der Bluetooth-Liste."
      },
      {
        "q": "Welche Texte kann ich auf die Schuhe schreiben?",
        "a": "Beliebige Texte mit Buchstaben, Zahlen und Sonderzeichen. Der Text scrollt als LED-Laufschrift über das Display am Klettverschluss. Sie können auch die Laufrichtung ändern."
      },
      {
        "q": "Muss ich die App installieren?",
        "a": "Nein! Unsere App läuft direkt im Browser über Web Bluetooth. Kein App Store, kein Download, keine Installation. Einfach öffnen und verbinden."
      },
      {
        "q": "Funktioniert das auch ohne Android-Gerät?",
        "a": "Ja! Genau dafür wurde diese App entwickelt. Sie funktioniert auf jedem Gerät mit einem modernen Browser und Bluetooth — Mac, Windows-PC, iPhone, iPad, Android."
      },
      {
        "q": "Wie lade ich die LED-Schuhe auf?",
        "a": "Die Schuhe werden über das mitgelieferte USB-Kabel aufgeladen. Der USB-Anschluss befindet sich seitlich am Schuh. Eine volle Ladung hält ca. 4–6 Stunden."
      },
      {
        "q": "Welche Primigi Schuhe sind mit der App kompatibel?",
        "a": "Alle Primigi Modelle der Reihe 'Infinity Light' bzw. 'B&g Infinity Light' — sowohl die Low-Top Sneaker für Jungen und Mädchen als auch die High-Top Varianten. Erkennbar am LED-Display im Klettverschluss und dem roten Knopf unter der Fersenlasche."
      },
      {
        "q": "Wo kann ich den Primigi Lights App Download finden?",
        "a": "Die originale Primigi Lights App ist im App Store nicht verfügbar und im Google Play Store kaum noch zu finden. Unsere Web-App auf primigi.dev ist die zuverlässige Alternative — funktioniert direkt im Browser ohne Download."
      },
      {
        "q": "Wie fallen Primigi Infinity Light Schuhe aus?",
        "a": "Primigi Infinity Light Schuhe fallen normal bis leicht klein aus. Wir empfehlen, eine halbe Größe größer zu bestellen. Die Schuhe gibt es in den Größen EU 24 bis 39."
      }
    ]
  },
  "seo": {
    "sections": [
      {
        "heading": "Primigi Infinity Light Schuhe programmieren — die Primigi Lights App Alternative",
        "paragraphs": [
          "Die Primigi Infinity Light Kollektion begeistert Kinder mit ihrer programmierbaren LED-Laufschrift am Klettverschluss. Ob als LED Schuhe für Kinder Jungen oder als LED Schuhe für Kinder Mädchen — die leuchtenden Sneaker sind der Hit auf dem Schulhof. Doch viele Eltern stehen vor einem Problem: Die offizielle „Primigi Lights" App ist ausschließlich für Android verfügbar und im Google Play Store nicht mehr auffindbar. Der Primigi Lights App Download funktioniert nicht mehr. Wer ein iPhone, ein iPad oder einen Mac nutzt, stand bisher ohne Lösung da.",
          "Wir hatten das gleiche Problem. Zwei Kinder, leuchtende Schuhe, kein Android-Gerät im Haus. Also haben wir kurzerhand die App selbst gebaut. Per Reverse Engineering des Bluetooth-Protokolls entstand eine Web-App, die im Browser läuft — egal ob iPhone, Mac oder Windows-Laptop. Seite öffnen, Schuh verbinden, Wunschtext eintippen. Fertig."
        ]
      },
      {
        "heading": "Primigi LED Schuhe App für iPhone und Mac",
        "paragraphs": [
          "Wenn Sie nach „Primigi App iPhone", „Primigi App Mac", „Primigi App Download" oder „Primigi Lights App Apple" suchen, sind Sie hier richtig. Apple-Geräte unterstützen Web Bluetooth, was bedeutet, dass unsere Primigi App direkt im Safari- oder Chrome-Browser läuft. Kein Umweg über Android-Emulatoren, kein Ausleihen eines Android-Geräts — einfach primigi.dev öffnen und loslegen. Die Primigi App für iPhone funktioniert genauso zuverlässig wie die originale Android-Version."
        ]
      },
      {
        "heading": "Primigi Infinity Light App für Windows PC",
        "paragraphs": [
          "Auch Windows-Nutzer profitieren: Chrome und Edge unterstützen Web Bluetooth vollständig. Wenn Ihr PC oder Laptop Bluetooth hat (was bei den meisten modernen Geräten der Fall ist), können Sie die Primigi Kinderschuhe direkt vom Computer aus programmieren. Ideal, wenn die Kinder ihren eigenen Text für den Schultag vorbereiten möchten. Die Primigi Infinity Light App funktioniert auf Windows 10 und 11 ohne zusätzliche Software."
        ]
      },
      {
        "heading": "Was ist die Primigi Lights App?",
        "paragraphs": [
          "Primigi hat die „Primigi Lights" App ursprünglich für Android veröffentlicht. Per Bluetooth Low Energy (BLE) verbindet sie sich mit dem Schuh und schickt Texte, Grafiken und Animationen ans LED-Display. Klingt toll — nur: Im Play Store ist sie praktisch verschwunden. Und für iPhones gab es sie nie. Genau diese Lücke füllt primigi.dev als Primigi Lights App Alternative."
        ]
      },
      {
        "heading": "So funktionieren die Primigi LED-Schuhe",
        "paragraphs": [
          "Am Klettverschluss sitzt ein kleines LED-Matrix-Display. Roten Knopf unter der Fersenlasche drücken — schon leuchtet „PRIMIGI" über den Schuh. Vorinstallierte Grafiken laufen im Wechsel durch. Per Doppelklick ändern Sie Laufrichtung und Orientierung. Wichtig zu wissen: Der USB-Anschluss am Schuh lädt nur den Akku. Daten gehen ausschließlich per Bluetooth rein."
        ]
      },
      {
        "heading": "Technische Hintergründe",
        "paragraphs": [
          "Unter der Haube ist es Bluetooth Low Energy (BLE). Der Schuh taucht als „PRIMIGI LED" auf und erwartet Hex-kodierte Pakete mit Prüfsumme — jeweils 20 Byte am Stück. Wir haben das Protokoll aus der Original-APK reverse-engineered und als Web Bluetooth API im Browser nachgebaut. Klingt nerdig, bedeutet für Sie aber einfach: Seite öffnen, verbinden, Text eintippen, läuft."
        ]
      },
      {
        "heading": "LED Schuhe Kinder — welche Modelle sind kompatibel?",
        "paragraphs": [
          "Die Primigi Infinity Light Reihe umfasst mehrere Modelle für Jungen und Mädchen. LED Schuhe für Kinder Jungen gibt es als blaue oder schwarze Sneaker (PIL 2959x), LED Schuhe für Kinder Mädchen in Rosa, Weiß und Silber (PIL 2969x). Zusätzlich sind High-Top Varianten (PIL 2961x) und Velcro-Low-Modelle (PIL 2963x) erhältlich. Alle Modelle mit dem Markennamen „Infinity Light" oder „B&g Infinity Light" haben das programmierbare LED-Display und sind mit unserer App kompatibel. Die Schuhe sind in den Größen EU 24 bis 39 erhältlich und werden über Händler wie Amazon, Spartoo und den Primigi Online-Shop in ganz Europa verkauft."
        ]
      },
      {
        "heading": "Primigi Schuhe mit App steuern — wie fallen Primigi Schuhe aus?",
        "paragraphs": [
          "Kurze Antwort: Eher knapp. Bei unseren Kids mussten wir eine halbe Nummer größer nehmen. Sportlicher Schnitt, Klettverschluss mit integriertem LED-Display — sitzt fest, aber bestellen Sie im Zweifel lieber eine Nummer größer. Der Akku hält bei normalem Spielplatz-Einsatz 4 bis 6 Stunden, geladen wird per USB-Kabel (liegt bei)."
        ]
      }
    ]
  },
  "footer": {
    "disclaimer": "Nicht verbunden mit Primigi S.p.A. oder IMAC S.p.A. Dies ist ein unabhängiges Tool.",
    "trademark": "„Primigi" und „Infinity Light" sind eingetragene Marken ihrer jeweiligen Inhaber.",
    "copyright": "© 2026 primigi.dev — Regensburg, Deutschland"
  }
}
```

**WICHTIG bei der Übersetzung pro Sprache:**

Jede Sprachversion braucht NICHT nur eine wörtliche Übersetzung, sondern **SEO-optimierte Texte** mit den lokal relevanten Keywords. Hier die Target-Keywords pro Sprache:

#### 🇮🇹 Italienisch (it.json)
- **Primary:** "primigi app" (SV 20), "app primigi", "primigi lights app"
- **Secondary:** "scarpe led bambini", "scarpe a led per bambini", "scarpe bambini led"
- **Long-Tail:** "primigi lights app apple", "primigi app iphone", "primigi infinity light app"
- **Meta-Title:** "Primigi App per iPhone e Mac — Programma le scarpe LED | primigi.dev"
- **Meta-Desc:** "L'app Primigi Lights è disponibile solo per Android. La nostra web-app funziona su iPhone, iPad, Mac e Windows. Programma la scritta LED delle scarpe Primigi Infinity Light — direttamente nel browser."
- Feature "Deutsche Anleitung" → "Guida in italiano" mit 🇮🇹 Flag
- SEO-Texte müssen natürlich klingen, nicht wie Google Translate
- "Wir hatten das gleiche Problem..." → Persönliche Anekdote beibehalten, kulturell anpassen

#### 🇬🇧 Englisch (en.json)
- **Primary:** "primigi app", "primigi lights app", "primigi app iphone"
- **Secondary:** "led shoes app", "led shoes kids", "app controlled led shoes"
- **Long-Tail:** "primigi lights app download", "primigi lights app apple", "geox led shoes app" (redirect-fähig)
- **Meta-Title:** "Primigi App for iPhone & Mac — Program LED Shoes | primigi.dev"
- **Meta-Desc:** "The Primigi Lights App is Android-only. Our web app works on iPhone, iPad, Mac and Windows. Program the LED scrolling text on Primigi Infinity Light shoes — right in your browser."
- Feature "Deutsche Anleitung" → "English Guide" mit 🇬🇧 Flag

#### 🇵🇱 Polnisch (pl.json)
- **Primary:** "primigi aplikacja", "primigi lights app", "primigi buty led"
- **Secondary:** "buty led dla dzieci", "buty świecące dzieci"
- **Meta-Title:** "Aplikacja Primigi na iPhone i Mac — Programuj buty LED | primigi.dev"
- Feature "Deutsche Anleitung" → "Instrukcja po polsku" mit 🇵🇱 Flag

#### 🇷🇴 Rumänisch (ro.json)
- **Primary:** "primigi aplicație", "primigi lights app", "primigi pantofi led"
- **Secondary:** "pantofi led copii", "pantofi cu led pentru copii"
- **Meta-Title:** "Aplicația Primigi pentru iPhone și Mac — Programează pantofii LED | primigi.dev"
- Feature "Deutsche Anleitung" → "Ghid în română" mit 🇷🇴 Flag

#### 🇧🇬 Bulgarisch (bg.json)
- **Primary:** "primigi приложение", "primigi lights app", "primigi обувки led"
- **Secondary:** "led обувки деца", "светещи обувки деца"
- **Meta-Title:** "Primigi приложение за iPhone и Mac — Програмирай LED обувки | primigi.dev"
- Feature "Deutsche Anleitung" → "Ръководство на български" mit 🇧🇬 Flag

#### 🇭🇺 Ungarisch (hu.json)
- **Primary:** "primigi alkalmazás", "primigi lights app", "primigi led cipő"
- **Secondary:** "led cipő gyerekeknek", "világító cipő gyerek"
- **Meta-Title:** "Primigi alkalmazás iPhone-ra és Mac-re — LED cipő programozása | primigi.dev"
- Feature "Deutsche Anleitung" → "Magyar útmutató" mit 🇭🇺 Flag

#### 🇫🇷 Französisch (fr.json)
- **Primary:** "primigi application", "primigi lights app", "primigi chaussures led"
- **Secondary:** "chaussures led enfant", "chaussures lumineuses enfant"
- **Meta-Title:** "Application Primigi pour iPhone et Mac — Programmez les chaussures LED | primigi.dev"
- Feature "Deutsche Anleitung" → "Guide en français" mit 🇫🇷 Flag

#### 🇨🇿 Tschechisch (cs.json)
- **Primary:** "primigi aplikace", "primigi lights app", "primigi boty led"
- **Secondary:** "led boty pro děti", "svítící boty děti"
- **Meta-Title:** "Primigi aplikace pro iPhone a Mac — Programování LED bot | primigi.dev"
- Feature "Deutsche Anleitung" → "Návod v češtině" mit 🇨🇿 Flag

---

### AUFGABE 3: Layout + Metadata pro Locale

**`app/[locale]/layout.tsx`:**
```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });

  const localeToOGLocale = {
    de: 'de_DE', it: 'it_IT', en: 'en_US', pl: 'pl_PL',
    ro: 'ro_RO', bg: 'bg_BG', hu: 'hu_HU', fr: 'fr_FR', cs: 'cs_CZ'
  };

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL('https://primigi.dev'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: locale === 'de' ? 'https://primigi.dev' : `https://primigi.dev/${locale}`,
      siteName: 'primigi.dev',
      images: [{ url: '/primigi-shoe.png', width: 1200, height: 630, alt: 'Primigi Infinity Light' }],
      locale: localeToOGLocale[locale] || 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: t('title'), description: t('description') },
    robots: { index: true, follow: true },
    alternates: {
      canonical: locale === 'de' ? 'https://primigi.dev' : `https://primigi.dev/${locale}`,
      languages: {
        'de': 'https://primigi.dev',
        'it': 'https://primigi.dev/it',
        'en': 'https://primigi.dev/en',
        'pl': 'https://primigi.dev/pl',
        'ro': 'https://primigi.dev/ro',
        'bg': 'https://primigi.dev/bg',
        'hu': 'https://primigi.dev/hu',
        'fr': 'https://primigi.dev/fr',
        'cs': 'https://primigi.dev/cs',
        'x-default': 'https://primigi.dev/en',
      }
    }
  };
}

export default async function LocaleLayout({ children, params: { locale } }) {
  if (!routing.locales.includes(locale)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

### AUFGABE 4: LandingPage-Komponente auf i18n umbauen

Die aktuelle `LandingPage.tsx` hat alle Texte hardcoded. Umbau:

1. Alle String-Literale durch `t('key')` ersetzen (via `useTranslations()`)
2. Das `MODELS` Array kann bleiben (technische Daten, sprachunabhängig)
3. Das `FAQ` Array kommt aus den Translations
4. Die Feature-Cards kommen aus den Translations
5. Die SEO-Sektionen kommen aus den Translations

**Beispiel für den Umbau-Anfang:**
```typescript
'use client';
import { useTranslations } from 'next-intl';

export default function LandingPage() {
  const t = useTranslations();
  // ...
  return (
    <div>
      {/* HERO */}
      <p>{t('hero.tagline')}</p>
      <h1>{t.rich('hero.title', { highlight: (chunks) => <span className="text-sky-400">{chunks}</span> })}</h1>
      <p>{t('hero.subtitle')}</p>
      {/* ... */}
    </div>
  );
}
```

---

### AUFGABE 5: Schema-Markup pro Sprache

Die FAQ- und Product-Schema müssen pro Sprache generiert werden. In `app/[locale]/page.tsx`:

```typescript
import { getTranslations } from 'next-intl/server';

export default async function Home({ params: { locale } }) {
  const t = await getTranslations({ locale });

  const faqItems = t.raw('faq.items'); // Array aus translations
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a }
    }))
  };

  // ... render mit schema
}
```

---

### AUFGABE 6: Hreflang + Sitemap

**`app/sitemap.ts`:**
```typescript
import { MetadataRoute } from 'next';

const locales = ['de', 'it', 'en', 'pl', 'ro', 'bg', 'hu', 'fr', 'cs'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const url = locale === 'de' ? 'https://primigi.dev' : `https://primigi.dev/${locale}`;
    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: locale === 'de' ? 1.0 : locale === 'it' ? 0.9 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, l === 'de' ? 'https://primigi.dev' : `https://primigi.dev/${l}`])
        )
      }
    });
  }

  return entries;
}
```

**`app/robots.ts`:**
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://primigi.dev/sitemap.xml',
  };
}
```

---

### AUFGABE 7: Sprachswitcher-Komponente

Erstelle eine kleine Sprachswitcher-Komponente für die Navigation:

```typescript
// components/LanguageSwitcher.tsx
'use client';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const LOCALES = [
  { code: 'de', flag: '🇩🇪', label: 'DE' },
  { code: 'it', flag: '🇮🇹', label: 'IT' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'pl', flag: '🇵🇱', label: 'PL' },
  { code: 'ro', flag: '🇷🇴', label: 'RO' },
  { code: 'bg', flag: '🇧🇬', label: 'BG' },
  { code: 'hu', flag: '🇭🇺', label: 'HU' },
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'cs', flag: '🇨🇿', label: 'CZ' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const newPath = newLocale === 'de' ? '/' : `/${newLocale}`;
    router.push(newPath);
  };

  return (
    <select
      value={locale}
      onChange={(e) => switchLocale(e.target.value)}
      style={{
        background: 'transparent',
        border: '1px solid rgba(56,189,248,0.2)',
        color: '#94a3b8',
        borderRadius: 6,
        padding: '4px 8px',
        fontSize: 13,
        cursor: 'pointer'
      }}
    >
      {LOCALES.map(({ code, flag, label }) => (
        <option key={code} value={code}>{flag} {label}</option>
      ))}
    </select>
  );
}
```

Einbauen in die Navigation (LandingPage.tsx, neben dem CTA-Button).

---

### AUFGABE 8: Stripe-Checkout Währungsanpassung

Der Stripe Checkout sollte die Währung je nach Locale anpassen:

| Locale | Währung | Preis |
|--------|---------|-------|
| de, it, fr, cs | EUR | 3,00 € |
| pl | PLN | ~13 zł |
| ro | RON | ~15 lei |
| bg | BGN | ~6 лв |
| hu | HUF | ~1200 Ft |
| en (UK) | GBP | £2.50 |
| en (US) | USD | $3.00 |

In `app/api/checkout/route.ts` den `locale` Parameter mitgeben und Stripe-Preis anpassen:
```typescript
// Locale aus dem Referer oder einem hidden field ableiten
const currencyMap = {
  de: 'eur', it: 'eur', fr: 'eur', cs: 'eur',
  pl: 'pln', ro: 'ron', bg: 'bgn', hu: 'huf',
  en: 'eur' // Default EUR, oder GBP/USD je nach IP
};
```

---

### AUFGABE 9: OG-Image pro Sprache (optional)

Für maximale CTR in Social Shares ein dynamisches OG-Image pro Sprache:
- `primigi.dev/api/og?locale=it` → Bild mit italienischem Text
- Nutze `@vercel/og` (ImageResponse)
- Zeigt den Schuh + den Locale-spezifischen Tagline

---

## Reihenfolge der Umsetzung

1. **next-intl installieren + middleware.ts + i18n.ts** (10 min)
2. **`de.json` aus bestehendem Code extrahieren** (15 min)
3. **LandingPage.tsx auf `useTranslations()` umbauen** (30 min)
4. **`app/[locale]/layout.tsx` + `page.tsx` mit Metadata** (15 min)
5. **`it.json` erstellen** (Priorität 1, SEO-optimiert!) (20 min)
6. **`en.json` erstellen** (Priorität 2) (15 min)
7. **Restliche Sprachen** (pl, ro, bg, hu, fr, cs) (je 15 min)
8. **Sprachswitcher in Navigation** (10 min)
9. **Sitemap + Robots** (5 min)
10. **Schema-Markup pro Locale** (10 min)
11. **Stripe-Währungsanpassung** (15 min)
12. **Testen: `npm run build` + alle Locales prüfen** (10 min)

**Geschätzte Gesamtzeit: ~3 Stunden**

---

## Verzeichnis des Projekts
`/Users/lukasebner/projects/primigi`

## Bestehende Dateien die geändert werden müssen
- `app/layout.tsx` → wird zu `app/[locale]/layout.tsx`
- `app/page.tsx` → wird zu `app/[locale]/page.tsx`
- `components/LandingPage.tsx` → alle Strings durch `t()` ersetzen
- `app/api/checkout/route.ts` → Locale-Parameter + Währung
- `next.config.mjs` → next-intl Plugin hinzufügen

## Bestehende Dateien die NICHT geändert werden
- `components/LEDDisplay.tsx` → rein visuell, sprachunabhängig
- `app/app/page.tsx` → BLE-App, kann englisch bleiben
- `lib/primigi-ble.ts` → Bluetooth-Protokoll, sprachunabhängig
- `app/api/webhook/route.ts` → Stripe Webhook, sprachunabhängig
- `app/api/verify/route.ts` → Token-Check, sprachunabhängig

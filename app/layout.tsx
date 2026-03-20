import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Primigi App für iPhone & Mac — LED-Schuhe programmieren ohne Android | primigi.dev",
  description:
    "Die Primigi Lights App gibt es nur für Android. Unsere Web-App funktioniert auf iPhone, iPad, Mac und Windows. LED-Laufschrift der Primigi Infinity Light Schuhe programmieren — direkt im Browser. Kein Download nötig.",
  keywords: ["Primigi App", "Primigi Lights App", "Primigi App iPhone", "Primigi App Download", "LED Schuhe Kinder App", "Primigi Infinity Light App", "Primigi LED Schuhe programmieren", "LED Schuhe Kinder Jungen", "LED Schuhe Kinder Mädchen", "Primigi Lights App Apple", "Kinderschuhe LED App"],
  metadataBase: new URL("https://primigi.dev"),
  openGraph: {
    title: "Primigi LED-Schuhe programmieren — Primigi Lights App Alternative für iPhone & Mac",
    description:
      "Web-App zum Programmieren der LED-Laufschrift auf Primigi Infinity Light Kinderschuhen. Die Primigi Lights App gibt es nur für Android — unsere Alternative funktioniert auf iPhone, iPad, Mac und Windows.",
    url: "https://primigi.dev",
    siteName: "primigi.dev",
    images: [
      {
        url: "/primigi-shoe.png",
        width: 1200,
        height: 630,
        alt: "Primigi Infinity Light Schuh",
      },
    ],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Primigi LED App",
    description: "LED-Schuhe ohne Android programmieren",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://primigi.dev" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}

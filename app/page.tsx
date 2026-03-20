import LandingPage from "@/components/LandingPage";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Funktioniert die Primigi App auf dem iPhone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Die original "Primigi Lights" App ist nur für Android verfügbar. Unsere App funktioniert direkt im Browser — auf iPhone, iPad, Mac, Windows und jedem anderen Gerät mit Bluetooth.',
      },
    },
    {
      "@type": "Question",
      name: "Wie verbinde ich die Schuhe mit der App?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Schalten Sie den Schuh ein (roter Knopf unter der Fersenlasche), öffnen Sie die App im Browser und klicken Sie auf "Verbinden". Der Schuh erscheint als "PRIMIGI LED" in der Bluetooth-Liste.',
      },
    },
    {
      "@type": "Question",
      name: "Welche Texte kann ich auf die Schuhe schreiben?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Beliebige Texte mit Buchstaben, Zahlen und Sonderzeichen. Der Text scrollt als LED-Laufschrift über das Display am Klettverschluss. Sie können auch die Laufrichtung ändern.",
      },
    },
    {
      "@type": "Question",
      name: "Muss ich die App installieren?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nein! Unsere App läuft direkt im Browser über Web Bluetooth. Kein App Store, kein Download, keine Installation. Einfach öffnen und verbinden.",
      },
    },
    {
      "@type": "Question",
      name: "Funktioniert das auch ohne Android-Gerät?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja! Genau dafür wurde diese App entwickelt. Sie funktioniert auf jedem Gerät mit einem modernen Browser und Bluetooth — Mac, Windows-PC, iPhone, iPad, Android.",
      },
    },
    {
      "@type": "Question",
      name: "Wie lade ich die LED-Schuhe auf?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Schuhe werden über das mitgelieferte USB-Kabel aufgeladen. Der USB-Anschluss befindet sich seitlich am Schuh. Eine volle Ladung hält ca. 4–6 Stunden.",
      },
    },
  ],
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Primigi LED Web-App",
  description:
    "Web-App zum Programmieren der LED-Laufschrift auf Primigi Infinity Light Schuhen. Funktioniert auf iPhone, Mac und Windows.",
  url: "https://primigi.dev",
  image: "https://primigi.dev/primigi-shoe.png",
  brand: {
    "@type": "Brand",
    name: "primigi.dev",
  },
  offers: {
    "@type": "Offer",
    price: "3.00",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: "https://primigi.dev",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <LandingPage />
    </>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  verification: {
    google: "nj4CabwTZmPmdXc9MAdVUckZu9xDXotNmhqwihm-0O8",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17857016257"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17857016257');
        `}</Script>
      </head>
      <body>{children}</body>
    </html>
  );
}

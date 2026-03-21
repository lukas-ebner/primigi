import { getTranslations } from 'next-intl/server';
import LandingPage from '@/components/LandingPage';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Array.from({ length: 9 }, (_, i) => ({
      "@type": "Question",
      name: t(`faq.q${i + 1}`),
      acceptedAnswer: { "@type": "Answer", text: t(`faq.a${i + 1}`) }
    }))
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Primigi LED Web-App",
    description: t('meta.description'),
    url: "https://primigi.dev",
    image: "https://primigi.dev/primigi-shoe.png",
    brand: { "@type": "Brand", name: "primigi.dev" },
    offers: {
      "@type": "Offer",
      price: "3.00",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: "https://primigi.dev",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <LandingPage />
    </>
  );
}

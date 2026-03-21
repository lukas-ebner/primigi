import { MetadataRoute } from 'next';

const locales = ['de', 'it', 'en', 'pl', 'ro', 'bg', 'hu', 'fr', 'cs'];
const base = 'https://primigi.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: locale === 'de' ? base : `${base}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: locale === 'de' ? 1.0 : locale === 'it' ? 0.9 : 0.8,
  }));
}

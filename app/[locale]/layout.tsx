import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const localeToOGLocale: Record<string, string> = {
  de: 'de_DE', it: 'it_IT', en: 'en_US', pl: 'pl_PL',
  ro: 'ro_RO', bg: 'bg_BG', hu: 'hu_HU', fr: 'fr_FR', cs: 'cs_CZ'
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = 'https://primigi.dev';
  const localeUrl = locale === 'de' ? baseUrl : `${baseUrl}/${locale}`;

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: localeUrl,
      siteName: 'primigi.dev',
      images: [{ url: '/primigi-shoe.png', width: 1200, height: 630 }],
      locale: localeToOGLocale[locale] || 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: localeUrl,
      languages: {
        'de': baseUrl,
        'it': `${baseUrl}/it`,
        'en': `${baseUrl}/en`,
        'pl': `${baseUrl}/pl`,
        'ro': `${baseUrl}/ro`,
        'bg': `${baseUrl}/bg`,
        'hu': `${baseUrl}/hu`,
        'fr': `${baseUrl}/fr`,
        'cs': `${baseUrl}/cs`,
        'x-default': `${baseUrl}/en`,
      }
    }
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

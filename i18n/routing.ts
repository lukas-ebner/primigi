import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['de', 'it', 'en', 'pl', 'ro', 'bg', 'hu', 'fr', 'cs'],
  defaultLocale: 'de',
  localePrefix: 'as-needed'
});

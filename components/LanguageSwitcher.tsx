'use client';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

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

  return (
    <select
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      style={{
        background: 'transparent',
        border: '1px solid rgba(56,189,248,0.2)',
        color: '#94a3b8',
        borderRadius: 6,
        padding: '4px 8px',
        fontSize: 13,
        cursor: 'pointer',
      }}
    >
      {LOCALES.map(({ code, flag, label }) => (
        <option key={code} value={code} style={{ background: '#0f0f1a' }}>
          {flag} {label}
        </option>
      ))}
    </select>
  );
}

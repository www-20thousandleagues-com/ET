import i18n from '../i18n';

/**
 * Formats a number according to the active locale standard.
 * English: 1,500.50
 * Danish: 1.500,50
 */
export function formatNumber(value: number, decimals: number = 0): string {
  const locale = i18n.language === 'dk' ? 'da-DK' : 'en-US';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a date string according to the active locale standard.
 * English: Jan 12, 2026
 * Danish: 12. jan. 2026
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const locale = i18n.language === 'dk' ? 'da-DK' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Formats time according to active locale.
 * English: 3:00 PM
 * Danish: 15:00
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const locale = i18n.language === 'dk' ? 'da-DK' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: i18n.language !== 'dk', // Force 24h clock for DK
  }).format(date);
}

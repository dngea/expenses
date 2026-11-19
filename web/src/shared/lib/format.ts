import type { DecimalString } from '../api/types';

const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

/** Formats a decimal string as EUR. The string is passed as-is, so no precision is lost. */
export function formatEur(amount: DecimalString): string {
  return eur.format(amount as Intl.StringNumericLiteral);
}

/**
 * Adds decimal strings exactly (via integer cents with BigInt), avoiding floating-point errors.
 * Only used because the backend has no "grand total" field; replace it once it does.
 */
export function sumDecimals(values: DecimalString[]): DecimalString {
  let cents = 0n;
  for (const value of values) cents += toCents(value);
  const negative = cents < 0n;
  const abs = negative ? -cents : cents;
  const whole = abs / 100n;
  const fraction = (abs % 100n).toString().padStart(2, '0');
  return `${negative ? '-' : ''}${whole}.${fraction}`;
}

function toCents(value: DecimalString): bigint {
  const negative = value.startsWith('-');
  const [whole = '0', fraction = ''] = value.replace('-', '').split('.');
  const cents = BigInt(whole || '0') * 100n + BigInt((fraction + '00').slice(0, 2));
  return negative ? -cents : cents;
}

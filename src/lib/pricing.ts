import type { App } from './schema';

export function formatPrice(amount: number, currency: string) {
  const value = amount.toLocaleString('ko-KR', { maximumFractionDigits: currency === 'KRW' ? 0 : 2 });
  const symbol =
    currency === 'KRW' ? '₩' : currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : `${currency} `;
  return `${symbol}${value}`;
}

export function priceLabel(a: Pick<App, 'pricing'>) {
  const p = a.pricing;
  if (p.model === 'free' || p.billing === 'free') return '무료';
  if (p.source.status !== 'verified') return '가격 확인 필요';
  if (p.quoteOnly) return '요금 문의';
  if (p.billing === 'prepaid') {
    return p.oneTimeNative === null || !p.periodDays
      ? '가격 확인 필요'
      : `${formatPrice(p.oneTimeNative, p.currency)} / ${p.periodDays}일`;
  }
  if (p.billing === 'one-time') {
    return p.oneTimeNative === null
      ? '가격 확인 필요'
      : `${formatPrice(p.oneTimeNative, p.currency)} · 한 번 구매`;
  }
  const annual = p.billing === 'annual' || p.billing === 'annual-monthly';
  const amount = annual ? p.annualMonthlyNative : p.monthlyNative;
  if (amount === null) return '가격 확인 필요';
  if (amount === 0) return '무료';
  const period = p.billing === 'annual-monthly' ? ' · 연 약정' : annual ? ' · 연 결제' : '';
  return `${formatPrice(amount, p.currency)}/${p.perSeat ? '인·' : ''}월${period}`;
}

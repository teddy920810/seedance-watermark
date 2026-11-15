import { expect, it } from 'vitest';
import { allowsPreviewTester, isHostedPilot, isWithinPreviewBudget, matchesPreviewOptions, PREVIEW_OPTIONS } from './preview-pilot';

it('requires an explicit preview flag, expected HTTPS origin, and short active window', () => {
  const now = Date.parse('2026-11-15T09:00:00Z');
  const env = { VERCEL_ENV: 'preview', SEEDANCE_PREVIEW_PAID: 'true', SEEDANCE_PREVIEW_ORIGIN: 'https://test.vercel.app',
    SEEDANCE_PREVIEW_UNTIL: '2026-11-15T10:00:00Z', SEEDANCE_PREVIEW_TESTER_EMAIL: 'tester@example.com' };
  expect(isHostedPilot(env, new URL('https://test.vercel.app/api/video'), now)).toBe(true);
  expect(isHostedPilot({ ...env, VERCEL_ENV: 'production' }, undefined, now)).toBe(false);
  expect(isHostedPilot(env, new URL('https://other.vercel.app/api/video'), now)).toBe(false);
  expect(isHostedPilot(env, undefined, now + 3600_000)).toBe(false);
  expect(isHostedPilot({ ...env, SEEDANCE_PREVIEW_TESTER_EMAIL: '' }, undefined, now)).toBe(false);
});

it('allows only the verified tester and fixed in-budget Seedance settings', () => {
  expect(allowsPreviewTester('tester@example.com', { email: 'Tester@example.com', emailVerified: true })).toBe(true);
  expect(allowsPreviewTester('tester@example.com', { email: 'tester@example.com', emailVerified: false })).toBe(false);
  expect(allowsPreviewTester('tester@example.com', { email: 'other@example.com', emailVerified: true })).toBe(false);
  expect(matchesPreviewOptions(PREVIEW_OPTIONS)).toBe(true);
  expect(matchesPreviewOptions({ ...PREVIEW_OPTIONS, duration: '5' })).toBe(false);
  expect(isWithinPreviewBudget({ currency: 'USD', unit: '1000 tokens', unit_price: 0.0112 })).toBe(true);
  expect(isWithinPreviewBudget({ currency: 'USD', unit: '1000 tokens', unit_price: 0.014 })).toBe(false);
  expect(isWithinPreviewBudget({ currency: 'EUR', unit: '1000 tokens', unit_price: 0.009 })).toBe(false);
});

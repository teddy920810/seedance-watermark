import { expect, it } from 'vitest';
import { allowsPreviewTester, isHostedPilot, isWithinPreviewBudget, matchesPreviewOptions, PREVIEW_OPTIONS } from './preview-pilot';

it('requires the explicit flag and exact Vercel branch origin without manual origin or expiry', () => {
  const env = {
    VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'codex/seedance-2-fast-preview',
    VERCEL_BRANCH_URL: 'test.vercel.app', SEEDANCE_PREVIEW_PAID: 'true',
    SEEDANCE_PREVIEW_TESTER_EMAIL: 'tester@example.com',
  };
  expect(isHostedPilot(env, new URL('https://test.vercel.app/api/video'))).toBe(true);
  expect(isHostedPilot({ ...env, VERCEL_ENV: 'production' })).toBe(false);
  expect(isHostedPilot({ ...env, VERCEL_GIT_COMMIT_REF: 'other' })).toBe(false);
  expect(isHostedPilot(env, new URL('https://other.vercel.app/api/video'))).toBe(false);
  expect(isHostedPilot({ ...env, VERCEL_BRANCH_URL: 'test.vercel.app/other' })).toBe(false);
  expect(isHostedPilot({ ...env, SEEDANCE_PREVIEW_TESTER_EMAIL: '' })).toBe(false);
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

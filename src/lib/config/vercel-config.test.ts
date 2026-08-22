import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const config = JSON.parse(
  readFileSync(new URL('../../../vercel.json', import.meta.url), 'utf8'),
) as {
  trailingSlash?: boolean;
  redirects?: Array<{ source: string; destination: string; permanent: boolean }>;
  headers?: Array<{
    source: string;
    headers: Array<{ key: string; value: string }>;
  }>;
};

describe('Vercel canonical URL redirects', () => {
  it('keeps clean public and API routes in the no-trailing-slash form', () => {
    expect(config.trailingSlash).toBe(false);
  });
  it('permanently redirects /index.html to the homepage', () => {
    expect(config.redirects).toContainEqual({
      source: '/index.html',
      destination: '/',
      permanent: true,
    });
  });

  it('removes nested /index.html filenames from public URLs', () => {
    expect(config.redirects).toContainEqual({
      source: '/:path*/index.html',
      destination: '/:path*',
      permanent: true,
    });
  });
});

describe('Vercel security headers', () => {
  const globalHeaders = Object.fromEntries(
    config.headers?.find(({ source }) => source === '/(.*)')?.headers.map(({ key, value }) => [
      key,
      value,
    ]) ?? [],
  );

  it('adds browser hardening without breaking OAuth popups', () => {
    expect(globalHeaders).toMatchObject({
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    });
  });

  it('introduces CSP in report-only mode with the current Google and R2 integrations allowed', () => {
    // Google CSP requirements: https://developers.google.com/tag-platform/security/guides/csp
    const csp = globalHeaders['Content-Security-Policy-Report-Only'];

    expect(globalHeaders['Content-Security-Policy']).toBeUndefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("script-src 'self' 'unsafe-inline' https://www.googletagmanager.com");
    expect(csp).toContain('https://*.r2.cloudflarestorage.com');
    expect(csp).toContain('https://*.google-analytics.com');
    expect(csp).toContain('https://*.analytics.google.com');
    expect(csp).toContain('https://accounts.google.com');
  });
});

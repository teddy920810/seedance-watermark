import { describe, expect, it, vi } from 'vitest';
import { runAuthenticatedSmoke, runPublicSmoke } from '../../../scripts/production-smoke-lib.mjs';

const jsonResponse = (value: unknown, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: { 'Content-Type': 'application/json' },
});

describe('production smoke boundaries', () => {
  it('keeps the public smoke non-destructive and confirms anonymous uploads are rejected', async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response('<html><link rel="canonical" href="https://www.seedances.co/"></html>'))
      .mockResolvedValueOnce(new Response('User-agent: *\nSitemap: https://www.seedances.co/sitemap.xml'))
      .mockResolvedValueOnce(new Response('<?xml version="1.0"?><urlset><url><loc>https://www.seedances.co/</loc></url></urlset>'))
      .mockResolvedValueOnce(jsonResponse({ error: 'Sign in with Google to upload an image.' }, 401));

    await expect(runPublicSmoke({ baseUrl: 'https://www.seedances.co', fetcher })).resolves.toEqual({ status: 'passed' });

    expect(fetcher).toHaveBeenCalledTimes(4);
    expect(fetcher.mock.calls[3]?.[0]).toBe('https://www.seedances.co/api/upload-url');
    expect(fetcher.mock.calls[3]?.[1]).toMatchObject({ method: 'POST' });
    expect(fetcher.mock.calls.every(([url]) => !String(url).includes('r2.cloudflarestorage.com'))).toBe(true);
  });

  it('skips the authenticated smoke without a session secret and performs no requests', async () => {
    const fetcher = vi.fn<typeof fetch>();

    await expect(runAuthenticatedSmoke({
      baseUrl: 'https://www.seedances.co',
      sessionCookie: '',
      fetcher,
    })).resolves.toEqual({ status: 'skipped', reason: 'SMOKE_SESSION_COOKIE is not configured.' });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('uses the session only for same-origin API calls in an authenticated smoke', async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({
        url: 'https://account.r2.cloudflarestorage.com/signed-upload',
        key: 'uploads/owner/image.png',
      }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(jsonResponse({ id: 'job-id', status: 'processing' }, 201))
      .mockResolvedValueOnce(jsonResponse({
        status: 'completed',
        resultUrl: 'https://account.r2.cloudflarestorage.com/signed-result',
        downloadUrl: 'https://account.r2.cloudflarestorage.com/signed-download',
      }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    await expect(runAuthenticatedSmoke({
      baseUrl: 'https://www.seedances.co',
      sessionCookie: 'better-auth.session_token=secret',
      fetcher,
      sleep: vi.fn(async () => undefined),
    })).resolves.toEqual({ status: 'passed' });

    const uploadHeaders = new Headers(fetcher.mock.calls[1]?.[1]?.headers);
    expect(uploadHeaders.has('Cookie')).toBe(false);
    for (const callIndex of [0, 2, 3]) {
      const headers = new Headers(fetcher.mock.calls[callIndex]?.[1]?.headers);
      expect(headers.get('Cookie')).toBe('better-auth.session_token=secret');
    }
  });
});

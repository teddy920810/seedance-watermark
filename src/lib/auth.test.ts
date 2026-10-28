import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const originalEnv = process.env;

vi.mock('astro:env/server', () => ({
  getSecret: (name: string) => process.env[name],
}));

describe('Google authentication integration contract', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      BETTER_AUTH_SECRET: 'test-secret-that-is-at-least-thirty-two-characters',
      BETTER_AUTH_URL: 'http://localhost:3000',
      GOOGLE_CLIENT_ID: 'google-client-id.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: 'google-client-secret',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('starts Google OAuth with the registered callback path', async () => {
    const { auth } = await import('./auth');
    const response = await auth.handler(new Request('http://localhost:3000/api/auth/sign-in/social', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ provider: 'google', callbackURL: 'http://localhost:3000/auth/popup' }),
    }));

    expect(response.status).toBe(200);
    const body = await response.json() as { url: string };
    const authorizationUrl = new URL(body.url);
    expect(authorizationUrl.origin).toBe('https://accounts.google.com');
    expect(authorizationUrl.searchParams.get('redirect_uri')).toBe('http://localhost:3000/api/auth/callback/google');
    expect(authorizationUrl.searchParams.get('scope')).toContain('openid');
    expect(authorizationUrl.searchParams.get('state')?.length).toBeGreaterThan(20);
    expect(authorizationUrl.searchParams.get('code_challenge_method')).toBe('S256');
    expect(authorizationUrl.searchParams.get('code_challenge')?.length).toBeGreaterThan(20);
    const stateCookie = response.headers.getSetCookie().find(cookie => cookie.startsWith('better-auth.oauth_state='));
    expect(Boolean(stateCookie)).toBe(true);
    expect(stateCookie?.toLowerCase().includes('httponly')).toBe(true);
  }, 10_000);

  it('keeps an anonymous request unauthenticated', async () => {
    const { auth } = await import('./auth');
    const response = await auth.handler(new Request('http://localhost:3000/api/auth/get-session'));
    expect(response.status).toBe(200);
    expect(await response.json()).toBeNull();
  });

  it('rejects an unbound OAuth callback without issuing a session', async () => {
    const { auth } = await import('./auth');
    const response = await auth.handler(new Request('http://localhost:3000/api/auth/callback/google?code=untrusted&state=unbound'));
    expect(response.status).toBe(302);
    const destination = new URL(response.headers.get('location')!, 'http://localhost:3000');
    expect(destination.origin).toBe('http://localhost:3000');
    expect(destination.pathname).toBe('/api/auth/error');
    expect(destination.searchParams.has('error')).toBe(true);
    expect(response.headers.getSetCookie().some(cookie => /session_token=[^;]/.test(cookie))).toBe(false);
  });
});

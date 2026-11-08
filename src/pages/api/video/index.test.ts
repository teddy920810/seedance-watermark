import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ getSession: vi.fn(), generationReadiness: vi.fn(), generationService: vi.fn() }));
vi.mock('../../../lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('../../../lib/video/runtime', () => ({ generationReadiness: mocks.generationReadiness, generationService: mocks.generationService }));
import { GET, POST } from './index';
const id = '00000000-0000-4000-8000-000000000001';
function context(origin = 'http://localhost:4321', body: unknown = { id, prompt: 'a cat' }) {
  return { request: new Request('http://localhost:4321/api/video', {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }) } as Parameters<typeof POST>[0];
}
beforeEach(() => {
  vi.resetAllMocks();
  mocks.getSession.mockResolvedValue({ user: { id: 'user-1' } });
  mocks.generationReadiness.mockReturnValue({ configured: true, enabled: true, missing: [] });
});
describe('local generation routes', () => {
  it('reports setup status without contacting the provider', async () => {
    expect((await GET(context())).status).toBe(200);
    expect(mocks.generationService).not.toHaveBeenCalled();
  });
  it('rejects a cross-origin request before accessing credentials', async () => {
    expect((await POST(context('https://evil.test'))).status).toBe(403);
    expect(mocks.generationService).not.toHaveBeenCalled();
  });
  it('rejects non-local hosts', async () => {
    const ctx = { request: new Request('https://www.seedances.co/api/video') } as Parameters<typeof GET>[0];
    expect((await GET(ctx)).status).toBe(404);
  });
  it('blocks spending until explicitly enabled, then requires a session', async () => {
    mocks.generationReadiness.mockReturnValue({ configured: true, enabled: false, missing: [] });
    const disabled = await POST(context());
    expect(disabled.status).toBe(503);
    expect(await disabled.json()).toMatchObject({ code: 'SERVICE_UNAVAILABLE' });
    mocks.generationReadiness.mockReturnValue({ configured: true, enabled: true, missing: [] });
    mocks.getSession.mockResolvedValue(null);
    const signedOut = await POST(context());
    expect(signedOut.status).toBe(401);
    expect(await signedOut.json()).toMatchObject({ code: 'LOGIN_REQUIRED' });
  });
  it('rejects invalid input without calling the service', async () => {
    expect((await POST(context(undefined, { id, prompt: 'cat', resolution: '4k' }))).status).toBe(400);
    expect(mocks.generationService).not.toHaveBeenCalled();
  });
  it('returns specific prompt validation codes without reserving a task or calling fal', async () => {
    for (const [prompt, code] of [['   ', 'PROMPT_REQUIRED'], ['x'.repeat(2001), 'PROMPT_TOO_LONG']]) {
      const response = await POST(context(undefined, { id, prompt }));
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({ code });
    }
    expect(mocks.generationService).not.toHaveBeenCalled();
  });
  it('rejects unsupported video settings before accessing the service', async () => {
    const response = await POST(context(undefined, { id, prompt: 'cat', options: { duration: '30', resolution: '4k', aspectRatio: '4:3', generateAudio: true } }));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ code: 'INVALID_OPTIONS' });
    expect(mocks.generationService).not.toHaveBeenCalled();
  });
  it('submits only validated input for the authenticated owner', async () => {
    const create = vi.fn().mockResolvedValue({ id, status: 'queued' });
    mocks.generationService.mockReturnValue({ create, present: vi.fn().mockResolvedValue({ id, status: 'queued' }) });
    const response = await POST(context());
    expect(response.status).toBe(201);
    expect(create).toHaveBeenCalledWith({ id, prompt: 'a cat' }, 'user-1');
  });
  it('returns a limit error without leaking provider details', async () => {
    mocks.generationService.mockReturnValue({ create: vi.fn().mockRejectedValue(new Error('The local test limit has been reached.')) });
    expect((await POST(context())).status).toBe(429);
    mocks.generationService.mockImplementation(() => { throw new Error('secret credentials'); });
    const response = await POST(context());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('secret credentials');
  });
});

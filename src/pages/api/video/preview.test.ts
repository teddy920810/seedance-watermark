import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const { session, create } = vi.hoisted(() => ({ session: vi.fn(), create: vi.fn() }));
vi.mock('../../../lib/auth', () => ({ getSession: session }));
vi.mock('../../../lib/video/runtime', () => ({
  generationReadiness: () => ({ configured: true, enabled: true, missing: [] }),
  generationService: () => ({ create, present: (job: unknown) => job }),
}));
import { POST } from './index';

const host = 'https://preview.vercel.app';
const payload = { id: '00000000-0000-4000-8000-000000000001', prompt: 'A red kite', options: {
  duration: '4', resolution: '480p', aspectRatio: '16:9', generateAudio: false,
} };
function submit(body: unknown = payload, origin = host) {
  const request = new Request(host + '/api/video', { method: 'POST',
    headers: { 'Content-Type': 'application/json', origin }, body: JSON.stringify(body) });
  return POST({ request } as Parameters<typeof POST>[0]);
}
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv('VERCEL_ENV', 'preview');
  vi.stubEnv('SEEDANCE_PREVIEW_PAID', 'true');
  vi.stubEnv('VERCEL_GIT_COMMIT_REF', 'codex/seedance-2-fast-preview');
  vi.stubEnv('VERCEL_BRANCH_URL', new URL(host).hostname);
  vi.stubEnv('SEEDANCE_PREVIEW_TESTER_EMAIL', 'tester@example.com');
});
afterEach(() => vi.unstubAllEnvs());

it('rejects anonymous, wrong account, unverified and cross-origin submissions before reaching generation', async () => {
  session.mockResolvedValueOnce(null).mockResolvedValueOnce({ user: { id: 'a', email: 'other@example.com', emailVerified: true } })
    .mockResolvedValueOnce({ user: { id: 'a', email: 'tester@example.com', emailVerified: false } });
  expect((await submit()).status).toBe(401);
  expect((await submit()).status).toBe(403);
  expect((await submit()).status).toBe(403);
  expect((await submit(payload, 'https://other.example.com')).status).toBe(403);
  expect(create).not.toHaveBeenCalled();
});

it('submits only the authorized preset in preview and leaves production disabled', async () => {
  session.mockResolvedValue({ user: { id: 'a', email: 'tester@example.com', emailVerified: true } });
  create.mockResolvedValue({ id: payload.id });
  expect((await submit({ ...payload, options: { ...payload.options, duration: '5' } })).status).toBe(400);
  expect((await submit()).status).toBe(201);
  expect(create).toHaveBeenCalledWith(payload, 'a');
  vi.stubEnv('VERCEL_ENV', 'production');
  expect((await submit()).status).toBe(404);
  expect(create).toHaveBeenCalledTimes(1);
});

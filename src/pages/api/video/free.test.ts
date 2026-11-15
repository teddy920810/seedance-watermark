import { createHash } from 'node:crypto';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const { session, create, read } = vi.hoisted(() => ({ session: vi.fn(), create: vi.fn(), read: vi.fn() }));
vi.mock('../../../lib/auth', () => ({ getSession: session }));
vi.mock('../../../lib/video/runtime', () => ({ generationReadiness: () => ({ configured: true, enabled: true, missing: [] }) }));
vi.mock('../../../lib/video/free-runtime', () => ({ freeVideoService: () => ({ create, read, present: (job: unknown) => job }) }));
import { GET, POST } from './index';
import { GET as getTask } from './[id]';

const origin = 'https://www.seedances.co';
const email = 'tester@example.com';
const owner = createHash('sha256').update(email).digest('hex');
const input = { id: '00000000-0000-4000-8000-000000000001', prompt: 'A red kite' };
function submit(body: unknown = input, host = origin, source = origin) {
  return POST({ request: new Request(`${host}/api/video`, { method: 'POST', headers: { origin: source, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) } as Parameters<typeof POST>[0]);
}
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv('VERCEL_ENV', 'production');
  vi.stubEnv('SEEDANCE_FREE_VIDEO_ENABLED', 'true');
});
afterEach(() => vi.unstubAllEnvs());

it('exposes the production endpoint only on the canonical site with the rollout enabled', async () => {
  const request = new Request(`${origin}/api/video`);
  session.mockResolvedValue(null);
  const response = await GET({ request } as Parameters<typeof GET>[0]);
  expect(response.status).toBe(200);
  expect(response.headers.get('Cache-Control')).toBe('no-store');
  expect(await response.json()).toMatchObject({ signedIn: false });
  expect((await submit(input, 'https://preview.vercel.app')).status).toBe(404);
  vi.stubEnv('SEEDANCE_FREE_VIDEO_ENABLED', 'false');
  expect((await submit()).status).toBe(404);
});

it('checks origin and verified login before reaching generation, then fixes the billed preset', async () => {
  session.mockResolvedValueOnce(null).mockResolvedValueOnce({ user: { id: 'u', emailVerified: false } });
  expect((await submit(input, origin, 'https://other.example')).status).toBe(403);
  expect(await (await submit()).json()).toMatchObject({ code: 'FREE_LOGIN_REQUIRED' });
  expect((await submit()).status).toBe(401);
  expect(create).not.toHaveBeenCalled();
  session.mockResolvedValue({ user: { id: 'u', email: 'Tester@Example.Com', emailVerified: true } });
  expect((await submit({ ...input, options: { duration: '12', resolution: '720p', aspectRatio: '16:9', generateAudio: true } })).status).toBe(400);
  create.mockResolvedValue({ id: input.id });
  expect((await submit()).status).toBe(201);
  expect(create).toHaveBeenCalledExactlyOnceWith({ ...input, options: { duration: '4', resolution: '480p', aspectRatio: '16:9', generateAudio: false } }, owner);
});

it('allows only verified sessions to retrieve tasks using their account scope', async () => {
  const request = new Request(`${origin}/api/video/${input.id}`);
  const params = { id: input.id };
  const lookup = () => getTask({ request, params } as unknown as Parameters<typeof getTask>[0]);
  session.mockResolvedValueOnce(null).mockResolvedValue({ user: { id: 'other', email, emailVerified: true } });
  expect((await lookup()).status).toBe(401);
  read.mockResolvedValue(null);
  expect((await lookup()).status).toBe(404);
  expect(read).toHaveBeenCalledExactlyOnceWith(input.id, owner);
});

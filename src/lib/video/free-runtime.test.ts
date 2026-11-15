import { afterEach, expect, it, vi } from 'vitest';
import type { GenerationStore } from './generation';

const { submit, poll, download, trim, store, ready } = vi.hoisted(() => ({
  submit: vi.fn(), poll: vi.fn(), download: vi.fn(), trim: vi.fn(), store: vi.fn(), ready: vi.fn(),
}));
vi.mock('astro:env/server', () => ({ getSecret: () => 'server-key' }));
vi.mock('./fal-provider', () => ({ FalVideoProvider: class { submit = submit; poll = poll; download = download; } }));
vi.mock('./trim-video', () => ({ trimFreeVideo: trim }));
vi.mock('./runtime', async (importOriginal) => ({
  ...await importOriginal<typeof import('./runtime')>(), generationStore: store, generationReadiness: ready,
}));
import { freeVideoService } from './free-runtime';
import { MODEL } from './generation';
import { freeVideoJobSlot } from './free-quota';

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

it('checks the live price before claiming or calling fal, and stores only the trimmed result', async () => {
  vi.stubEnv('VERCEL_ENV', 'production');
  vi.stubEnv('SEEDANCE_FREE_VIDEO_ENABLED', 'true');
  ready.mockReturnValue({ configured: true });
  const entries = new Map<string, unknown>();
  const putVideo = vi.fn();
  store.mockReturnValue({
    async getJson(key: string) { return entries.get(key) ?? null; },
    async putJson(key: string, value: unknown) { entries.set(key, value); },
    async putJsonIfAbsent(key: string, value: unknown) {
      if (entries.has(key)) return false;
      entries.set(key, value);
      return true;
    },
    putVideo,
  } as unknown as GenerationStore);
  const price = (unit_price: number) => Response.json({ prices: [{ endpoint_id: MODEL, unit_price, currency: 'USD', unit: '1000 tokens' }] });
  const fetch = vi.fn().mockResolvedValueOnce(price(10)).mockResolvedValueOnce(price(0.0112));
  vi.stubGlobal('fetch', fetch);
  const input = { id: 'first', prompt: 'A red kite' };
  await expect(freeVideoService('owner').create(input, 'owner')).rejects.toMatchObject({ code: 'SERVICE_UNAVAILABLE' });
  expect(entries.size).toBe(0);
  expect(submit).not.toHaveBeenCalled();

  submit.mockResolvedValue('fal-id');
  poll.mockResolvedValue({ status: 'completed', videoUrl: 'https://fal.media/result.mp4' });
  download.mockResolvedValue(new Uint8Array([4]));
  trim.mockResolvedValue(new Uint8Array([3]));
  const service = freeVideoService('owner');
  expect(await service.create(input, 'owner')).toMatchObject({ status: 'queued' });
  expect(submit).toHaveBeenCalledExactlyOnceWith(input.prompt, { duration: '4', resolution: '480p', aspectRatio: '16:9', generateAudio: false });
  expect(await service.read(input.id, 'owner')).toMatchObject({ status: 'completed' });
  expect(putVideo).toHaveBeenCalledExactlyOnceWith(`${freeVideoJobSlot('owner').resultPrefix}first.mp4`, new Uint8Array([3]));
});

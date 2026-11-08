import { describe, expect, it, vi } from 'vitest';
import { GenerationService, parseGenerationInput, type GenerationJob } from './generation';

const id = '00000000-0000-4000-8000-000000000001';
function fixture() {
  const values = new Map<string, unknown>();
  const store = {
    getJson: async <T>(key: string): Promise<T | null> => values.has(key) ? values.get(key) as T : null,
    putJson: vi.fn(async (key: string, value: unknown) => { values.set(key, structuredClone(value)); }),
    putVideo: vi.fn().mockResolvedValue(undefined),
    createResultUrl: vi.fn().mockResolvedValue('https://storage.test/result.mp4'),
    createDownloadUrl: vi.fn().mockResolvedValue('https://storage.test/download.mp4'),
  };
  const provider = {
    submit: vi.fn().mockResolvedValue('fal-request-1'),
    poll: vi.fn().mockResolvedValue({ status: 'running' }),
    download: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
  };
  const service = new GenerationService(store, provider);
  return { service, store, provider, values };
}

describe('local video generation', () => {
  it('allows only supported settings and a bounded prompt', () => {
    expect(parseGenerationInput({ id, prompt: ' A cat walking ' })).toEqual({ id, prompt: 'A cat walking' });
    expect(parseGenerationInput({ id, prompt: 'x'.repeat(2000) }).prompt).toHaveLength(2000);
    expect(() => parseGenerationInput({ id, prompt: ` ${'x'.repeat(2000)}` })).toThrow();
    for (const input of [{ id, prompt: '' }, { id: '../x', prompt: 'cat' }, { id, prompt: 'x'.repeat(2001) }, { id, prompt: 'cat', model: 'expensive' }]) {
      expect(() => parseGenerationInput(input)).toThrow();
    }
  });

  it('validates settings, forwards them once and restores the original settings', async () => {
    const options = { duration: '12', resolution: '1080p', aspectRatio: '4:3', generateAudio: true } as const;
    const input = parseGenerationInput({ id, prompt: 'cat', options });
    expect(input.options).toEqual(options);
    for (const invalid of [{ ...options, duration: '30' }, { ...options, resolution: '4k' }, { ...options, aspectRatio: '2:1' }, { ...options, generateAudio: 'true' }, { ...options, model: 'other' }]) {
      expect(() => parseGenerationInput({ id, prompt: 'cat', options: invalid })).toThrow();
    }
    const { service, provider } = fixture();
    await service.create(input, 'user-1');
    expect(provider.submit).toHaveBeenCalledWith('cat', options);
    const job = await service.create({ id, prompt: 'cat' }, 'user-1');
    expect((await service.present(job)).options).toEqual(options);
    expect(provider.submit).toHaveBeenCalledTimes(1);
  });

  it('reserves one persistent test slot before submitting and deduplicates double clicks', async () => {
    const { service, store, provider } = fixture();
    const [one, two] = await Promise.all([
      service.create({ id, prompt: 'cat' }, 'user-1'),
      service.create({ id, prompt: 'cat' }, 'user-1'),
    ]);
    expect(one.id).toBe(two.id);
    expect(provider.submit).toHaveBeenCalledTimes(1);
    expect(store.putJson.mock.invocationCallOrder[0]).toBeLessThan(provider.submit.mock.invocationCallOrder[0]);
    await expect(service.create({ id: '00000000-0000-4000-8000-000000000002', prompt: 'dog' }, 'user-1')).rejects.toThrow('The local test limit has been reached.');
  });

  it('retains the slot on an ambiguous provider failure and never retries submission', async () => {
    const { service, provider } = fixture();
    provider.submit.mockRejectedValue(new Error('secret provider detail'));
    const failed = await service.create({ id, prompt: 'cat' }, 'user-1');
    expect(failed.status).toBe('failed');
    expect(failed.errorCode).toBe('SUBMISSION_UNKNOWN');
    expect(JSON.stringify(failed)).not.toContain('secret provider detail');
    await service.create({ id, prompt: 'cat' }, 'user-1');
    expect(provider.submit).toHaveBeenCalledTimes(1);
  });

  it('rejects unknown IDs and another user before querying fal', async () => {
    const { service, provider } = fixture();
    await service.create({ id, prompt: 'cat' }, 'user-1');
    expect(await service.read(id, 'user-2')).toBeNull();
    expect(await service.read('invalid', 'user-1')).toBeNull();
    expect(provider.poll).not.toHaveBeenCalled();
  });

  it('restores progress from R2 and saves completed video privately before exposing links', async () => {
    const { service, provider, store } = fixture();
    await service.create({ id, prompt: 'cat' }, 'user-1');
    const restored = new GenerationService(store, provider);
    expect((await restored.read(id, 'user-1'))?.status).toBe('running');
    provider.poll.mockResolvedValue({ status: 'completed', videoUrl: 'https://v3.fal.media/example.mp4' });
    const job = await restored.read(id, 'user-1');
    expect(job?.status).toBe('completed');
    expect(store.putVideo).toHaveBeenCalledWith(`results/fal-${id}.mp4`, new Uint8Array([1, 2, 3]));
    const output = await restored.present(job!);
    expect(output).toMatchObject({ videoUrl: 'https://storage.test/result.mp4', downloadUrl: 'https://storage.test/download.mp4' });
    expect(output).not.toHaveProperty('ownerId');
    expect(output).not.toHaveProperty('requestId');
    await restored.read(id, 'user-1');
    expect(provider.download).toHaveBeenCalledTimes(1);
  });

  it('keeps completed provider jobs retryable when saving to storage fails', async () => {
    const { service, provider, store } = fixture();
    await service.create({ id, prompt: 'cat' }, 'user-1');
    provider.poll.mockResolvedValue({ status: 'completed', videoUrl: 'https://v3.fal.media/example.mp4' });
    store.putVideo.mockRejectedValueOnce(new Error('storage failure'));
    await expect(service.read(id, 'user-1')).rejects.toThrow('storage failure');
    expect((await service.read(id, 'user-1'))?.status).toBe('completed');
    expect(provider.submit).toHaveBeenCalledTimes(1);
  });

  it('returns a safe failure when provider processing fails', async () => {
    const { service, provider } = fixture();
    await service.create({ id, prompt: 'cat' }, 'user-1');
    provider.poll.mockResolvedValue({ status: 'failed' });
    expect((await service.read(id, 'user-1'))?.status).toBe('failed');
  });

  it('returns link expiry and preserves a typed moderation failure', async () => {
    const { service, provider } = fixture();
    await service.create({ id, prompt: 'cat' }, 'user-1');
    provider.poll.mockResolvedValue({ status: 'failed', errorCode: 'CONTENT_RESTRICTED' });
    const job = await service.read(id, 'user-1');
    expect(await service.present(job!)).toMatchObject({ errorCode: 'CONTENT_RESTRICTED' });
    const completed = { ...job!, status: 'completed' as const, resultKey: 'results/test.mp4' };
    const before = Date.now();
    const output = await service.present(completed);
    expect(output.linksExpireAt).toBeGreaterThanOrEqual(before + 600_000);
  });

  it('returns safe public statuses without storage calls for unfinished jobs', async () => {
    const { service, store } = fixture();
    const job = { id, ownerId: 'u', status: 'submitting' } as GenerationJob;
    expect(await service.present(job)).toEqual({ id, status: 'submitting', error: undefined, options: { duration: '5', resolution: '480p', aspectRatio: '16:9', generateAudio: false } });
    expect(store.createResultUrl).not.toHaveBeenCalled();
  });
});

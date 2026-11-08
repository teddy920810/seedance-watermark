import { afterEach, describe, expect, it, vi } from 'vitest';

const { fal } = vi.hoisted(() => ({ fal: { config: vi.fn(), queue: { submit: vi.fn(), status: vi.fn(), result: vi.fn() } } }));
vi.mock('@fal-ai/client', () => ({ fal }));
import { FalVideoProvider } from './fal-provider';
import { MODEL } from './generation';
afterEach(() => { vi.resetAllMocks(); vi.unstubAllGlobals(); });

describe('fal video provider contract', () => {
  it('sets server credentials and retains the low-cost default arguments', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ request_id: 'request-1' }));
    vi.stubGlobal('fetch', fetcher);
    const provider = new FalVideoProvider('test-key');
    expect(await provider.submit('a cat')).toBe('request-1');
    expect(fal.config).toHaveBeenCalledWith({ credentials: 'test-key' });
    expect(fetcher.mock.calls[0][0]).toBe(`https://queue.fal.run/${MODEL}`);
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({
      prompt: 'a cat', resolution: '480p', aspect_ratio: '16:9', duration: '5',
      generate_audio: false, enable_safety_checker: true,
    });
    expect(fetcher.mock.calls[0][1].headers.Authorization).toBe('Key test-key');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('forwards selected model arguments while keeping safety enabled and never retries', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ request_id: 'r' }));
    vi.stubGlobal('fetch', fetcher);
    await new FalVideoProvider('test-key').submit('cat', { duration: '12', resolution: '1080p', aspectRatio: '4:3', generateAudio: true });
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({ prompt: 'cat', duration: '12', resolution: '1080p', aspect_ratio: '4:3', generate_audio: true, enable_safety_checker: true });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('never retries a failed billable submission', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('upstream failure', { status: 503 }));
    vi.stubGlobal('fetch', fetcher);
    await expect(new FalVideoProvider('key').submit('a cat')).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('recognizes typed moderation errors without exposing provider messages', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ detail: [{ type: 'content_policy_violation', msg: 'private prompt' }] }, { status: 422 })));
    await expect(new FalVideoProvider('key').submit('cat')).rejects.toMatchObject({ code: 'CONTENT_RESTRICTED' });
    fal.queue.status.mockResolvedValue({ status: 'COMPLETED' });
    fal.queue.result.mockRejectedValue({ status: 422, body: { detail: [{ type: 'content_policy_violation' }] } });
    expect(await new FalVideoProvider('key').poll('r')).toEqual({ status: 'failed', errorCode: 'CONTENT_RESTRICTED' });
  });
  it('distinguishes unavailable service from an uncertain submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 402 })));
    await expect(new FalVideoProvider('key').submit('cat')).rejects.toMatchObject({ code: 'SERVICE_UNAVAILABLE' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })));
    await expect(new FalVideoProvider('key').submit('cat')).rejects.toMatchObject({ code: 'SUBMISSION_UNKNOWN' });
  });
  it('does not mislabel ordinary validation failures as moderation', async () => {
    fal.queue.status.mockResolvedValue({ status: 'COMPLETED' });
    fal.queue.result.mockRejectedValue({ status: 422, body: { detail: [{ type: 'value_error', msg: 'content policy text is not a type' }] } });
    expect(await new FalVideoProvider('key').poll('r')).toEqual({ status: 'failed' });
  });
  it('maps queue states and retrieves output only after completion', async () => {
    const provider = new FalVideoProvider('test-key');
    fal.queue.status.mockResolvedValueOnce({ status: 'IN_QUEUE' }).mockResolvedValueOnce({ status: 'IN_PROGRESS' }).mockResolvedValueOnce({ status: 'COMPLETED' });
    fal.queue.result.mockResolvedValue({ data: { video: { url: 'https://v3.fal.media/video.mp4' } } });
    expect((await provider.poll('r')).status).toBe('queued');
    expect((await provider.poll('r')).status).toBe('running');
    expect(await provider.poll('r')).toEqual({ status: 'completed', videoUrl: 'https://v3.fal.media/video.mp4' });
    expect(fal.queue.result).toHaveBeenCalledTimes(1);
    expect(fal.queue.status).toHaveBeenCalledWith(MODEL, { requestId: 'r', logs: false });
  });
  it('maps provider-declared errors to a safe failed state', async () => {
    fal.queue.status.mockResolvedValue({ status: 'COMPLETED', error: 'private provider error' });
    expect(await new FalVideoProvider('test-key').poll('r')).toEqual({ status: 'failed' });
    expect(fal.queue.result).not.toHaveBeenCalled();
  });
  it('rejects result URLs outside the provider CDN without fetching them', async () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    const provider = new FalVideoProvider('test-key');
    for (const url of ['http://v3.fal.media/x', 'https://127.0.0.1/x', 'https://fal.media.evil.test/x']) {
      await expect(provider.download(url)).rejects.toThrow();
    }
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('downloads bounded MP4 results without forwarding the API key', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(new Uint8Array([1, 2]), { headers: { 'Content-Type': 'video/mp4' } }));
    vi.stubGlobal('fetch', fetcher);
    expect(await new FalVideoProvider('test-key').download('https://v3b.fal.media/x.mp4')).toEqual(new Uint8Array([1, 2]));
    expect(fetcher.mock.calls[0][1]).not.toHaveProperty('headers');
    expect(fetcher.mock.calls[0][1].redirect).toBe('error');
  });
  it('rejects oversized or non-video output', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(new Response('x', { headers: { 'Content-Length': '999999999', 'Content-Type': 'video/mp4' } }))
      .mockResolvedValueOnce(new Response('html', { headers: { 'Content-Type': 'text/html' } }));
    vi.stubGlobal('fetch', fetcher);
    const provider = new FalVideoProvider('key');
    await expect(provider.download('https://fal.media/x')).rejects.toThrow();
    await expect(provider.download('https://fal.media/x')).rejects.toThrow();
  });
});

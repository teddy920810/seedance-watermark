import { fal } from '@fal-ai/client';
import { MODEL, type VideoProvider } from './generation';
import { isContentRestricted, VideoProviderError } from './errors';
import { DEFAULT_VIDEO_OPTIONS, type VideoOptions } from './options';

// Official SDK contracts, verified 2026-10-25:
// https://fal.ai/models/fal-ai/bytedance/seedance/v1.5/pro/text-to-video/api
// https://fal.ai/docs/documentation/model-apis/inference/client-setup
export class FalVideoProvider implements VideoProvider {
  constructor(private readonly key: string) {
    fal.config({ credentials: key });
  }

  async submit(prompt: string, options: VideoOptions = DEFAULT_VIDEO_OPTIONS): Promise<string> {
    // Use the documented REST submit operation once. The SDK's submit method
    // retries network failures, which could enqueue a second billable task.
    // https://fal.ai/docs/documentation/model-apis/inference/queue
    const response = await fetch(`https://queue.fal.run/${MODEL}`, {
      method: 'POST',
      headers: { Authorization: `Key ${this.key}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(45_000),
      body: JSON.stringify({
        prompt,
        resolution: options.resolution,
        aspect_ratio: options.aspectRatio,
        duration: options.duration,
        generate_audio: options.generateAudio,
        enable_safety_checker: true,
      }),
    });
    if (!response.ok) {
      const body: unknown = await response.json().catch(() => null);
      const code = isContentRestricted(body) ? 'CONTENT_RESTRICTED' :
        [401, 402, 403, 429].includes(response.status) ? 'SERVICE_UNAVAILABLE' : 'SUBMISSION_UNKNOWN';
      throw new VideoProviderError(code);
    }
    const { request_id } = await response.json() as { request_id?: string };
    if (!request_id) throw new Error('Provider submission unconfirmed');
    return request_id;
  }

  async poll(requestId: string) {
    const status = await fal.queue.status(MODEL, { requestId, logs: false });
    if (status.status === 'IN_QUEUE') return { status: 'queued' as const };
    if (status.status === 'IN_PROGRESS') return { status: 'running' as const };
    if ('error' in status && status.error) return { status: 'failed' as const };
    let result;
    try { result = await fal.queue.result(MODEL, { requestId }); }
    catch (error) {
      const failure = error as { status?: number; body?: unknown };
      if (failure.status === 422) return isContentRestricted(failure.body)
        ? { status: 'failed' as const, errorCode: 'CONTENT_RESTRICTED' as const }
        : { status: 'failed' as const };
      throw error;
    }
    const data = result.data as { video?: { url?: string } };
    if (!data.video?.url) return { status: 'failed' as const };
    return { status: 'completed' as const, videoUrl: data.video.url };
  }

  async download(value: string): Promise<Uint8Array> {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443') ||
      !(url.hostname === 'fal.media' || url.hostname.endsWith('.fal.media'))) throw new Error('Invalid provider result');
    const response = await fetch(url.toString(), { redirect: 'error', signal: AbortSignal.timeout(60_000) });
    const maxBytes = 50 * 1024 * 1024;
    if (!response.ok || !response.body || Number(response.headers.get('content-length')) > maxBytes ||
      !(response.headers.get('content-type') ?? '').startsWith('video/')) throw new Error('Invalid video response');
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value: chunk } = await reader.read();
      if (done) break;
      size += chunk.length;
      if (size > maxBytes) { await reader.cancel(); throw new Error('Video too large'); }
      chunks.push(chunk);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return bytes;
  }
}

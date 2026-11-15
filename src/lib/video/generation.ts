import { z } from 'zod';
import { MAX_PROMPT_LENGTH, VideoProviderError, videoNotices, type VideoErrorCode } from './errors';
import { DEFAULT_VIDEO_OPTIONS, VIDEO_DURATIONS, VIDEO_RESOLUTIONS, VIDEO_ASPECT_RATIOS, type VideoOptions } from './options';

export const MODEL = 'bytedance/seedance-2.0/fast/text-to-video';
export const MODEL_LABEL = 'Seedance 2.0 Fast';
const SLOT = 'jobs/fal-local-test.json';
const optionsSchema = z.object({ duration: z.enum(VIDEO_DURATIONS), resolution: z.enum(VIDEO_RESOLUTIONS),
  aspectRatio: z.enum(VIDEO_ASPECT_RATIOS), generateAudio: z.boolean() }).strict();
const inputSchema = z.object({ id: z.uuid(), prompt: z.string().max(MAX_PROMPT_LENGTH).trim().min(1), options: optionsSchema.optional() }).strict();
export const parseGenerationInput = (value: unknown) => inputSchema.parse(value);
export type GenerationInput = z.infer<typeof inputSchema>;
export type GenerationStatus = 'submitting' | 'queued' | 'running' | 'completed' | 'failed';
export interface GenerationJob extends GenerationInput {
  ownerId: string;
  status: GenerationStatus;
  requestId?: string;
  resultKey?: string;
  error?: string;
  errorCode?: VideoErrorCode;
}
export interface GenerationStore {
  getJson<T>(key: string): Promise<T | null>;
  putJson(key: string, value: unknown): Promise<void>;
  putJsonIfAbsent?(key: string, value: unknown): Promise<boolean>;
  putVideo(key: string, bytes: Uint8Array): Promise<void>;
  createResultUrl(key: string): Promise<string>;
  createDownloadUrl(key: string, filename?: string): Promise<string>;
}
export interface VideoProvider {
  submit(prompt: string, options?: VideoOptions): Promise<string>;
  poll(requestId: string): Promise<{ status: 'queued' | 'running' | 'completed' | 'failed'; videoUrl?: string; errorCode?: VideoErrorCode }>;
  download(url: string): Promise<Uint8Array>;
}

// The preview slot uses an atomic R2 reservation across Vercel instances.
export class GenerationService {
  private pending: Promise<unknown> = Promise.resolve();
  constructor(
    private readonly store: GenerationStore,
    private readonly provider: VideoProvider,
    private readonly slot: { key: string; atomic: boolean; reservationKey?: string } = { key: SLOT, atomic: false },
  ) {}

  private serial<T>(operation: () => Promise<T>): Promise<T> {
    const next = this.pending.then(operation, operation);
    this.pending = next.catch(() => undefined);
    return next;
  }

  create(input: GenerationInput, ownerId: string): Promise<GenerationJob> {
    return this.serial(async () => {
      const existing = await this.store.getJson<GenerationJob>(this.slot.key);
      if (existing) {
        if (existing.id === input.id && existing.ownerId === ownerId) return existing;
        throw new Error('The local test limit has been reached.');
      }
      let job: GenerationJob = { ...input, options: input.options || { ...DEFAULT_VIDEO_OPTIONS }, ownerId, status: 'submitting' };
      if (this.slot.atomic) {
        if (!this.store.putJsonIfAbsent) throw new Error('Atomic reservation unavailable');
        const reservationKey = this.slot.reservationKey;
        const reserved = reservationKey
          ? await this.store.putJsonIfAbsent(reservationKey, { reserved: true })
          : await this.store.putJsonIfAbsent(this.slot.key, job);
        if (!reserved) {
          const existing = await this.store.getJson<GenerationJob>(this.slot.key);
          if (existing?.id === input.id && existing.ownerId === ownerId) return existing;
          throw new Error('The local test limit has been reached.');
        }
        if (reservationKey) await this.store.putJson(this.slot.key, job);
      } else {
        await this.store.putJson(this.slot.key, job);
      }
      try {
        const requestId = await this.provider.submit(input.prompt, job.options);
        job = { ...job, requestId, status: 'queued' };
      } catch (error) {
        const errorCode = error instanceof VideoProviderError ? error.code : 'SUBMISSION_UNKNOWN';
        job = { ...job, status: 'failed', errorCode, error: videoNotices[errorCode].message };
      }
      await this.store.putJson(this.slot.key, job);
      return job;
    });
  }

  read(id: string, ownerId: string): Promise<GenerationJob | null> {
    return this.serial(async () => {
      const job = await this.store.getJson<GenerationJob>(this.slot.key);
      if (!job || job.id !== id || job.ownerId !== ownerId) return null;
      if (!job.requestId || job.status === 'completed' || job.status === 'failed') return job;
      const update = await this.provider.poll(job.requestId);
      if (update.status === 'completed') {
        if (!update.videoUrl) throw new Error('Missing video result');
        const resultKey = `results/fal-${job.id}.mp4`;
        const bytes = await this.provider.download(update.videoUrl);
        await this.store.putVideo(resultKey, bytes);
        Object.assign(job, { status: 'completed', resultKey });
      } else {
        job.status = update.status;
        if (update.status === 'failed') {
          job.errorCode = update.errorCode || 'GENERATION_FAILED';
          job.error = videoNotices[job.errorCode].message;
        }
      }
      await this.store.putJson(this.slot.key, job);
      return job;
    });
  }

  async present(job: GenerationJob) {
    const output: { id: string; status: GenerationStatus; options: VideoOptions; error?: string; errorCode?: VideoErrorCode; videoUrl?: string; downloadUrl?: string; linksExpireAt?: number } = {
      id: job.id, status: job.status, error: job.error, options: job.options || { ...DEFAULT_VIDEO_OPTIONS },
    };
    // Older pilot receipts have no code; an unconfirmed submit is not a known generation failure.
    if (job.errorCode || job.status === 'failed') {
      output.errorCode = job.errorCode || (job.requestId ? 'GENERATION_FAILED' : 'SUBMISSION_UNKNOWN');
      output.error = videoNotices[output.errorCode].message;
    }
    if (job.status === 'completed' && job.resultKey) {
      output.linksExpireAt = Date.now() + 600_000;
      output.videoUrl = await this.store.createResultUrl(job.resultKey);
      output.downloadUrl = await this.store.createDownloadUrl(job.resultKey, 'seedances-video.mp4');
    }
    return output;
  }
}

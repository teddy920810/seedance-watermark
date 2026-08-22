import type { WatermarkProvider } from '../providers/watermark-provider';
import {
  contentTypeForUploadKey,
  isUploadKey,
  isUploadKeyForOwner,
  validateUploadMetadata,
} from '../upload/validation';
import { createJob, failJob, finishJob, type Job } from './job';
import type { JobStore } from './job-store';

interface JobServiceDependencies {
  jobStore: JobStore;
  objects: {
    getMetadata(key: string): Promise<{ contentLength: number | undefined; contentType: string | undefined } | null>;
    deleteObject(key: string): Promise<void>;
  };
  provider: WatermarkProvider;
}

export class JobService {
  constructor(
    private readonly dependencies: JobServiceDependencies,
    private readonly createId: () => string = () => crypto.randomUUID(),
  ) {}

  private async deleteOrphan(inputKey: string): Promise<void> {
    try {
      await this.dependencies.objects.deleteObject(inputKey);
    } catch {
      // R2 lifecycle rules remain the fallback when best-effort cleanup is unavailable.
    }
  }

  async create(inputKey: string, ownerId: string): Promise<Job> {
    if (!isUploadKey(inputKey)) throw new Error('Invalid upload key');
    if (!(await isUploadKeyForOwner(inputKey, ownerId))) throw new Error('Upload not found');

    const metadata = await this.dependencies.objects.getMetadata(inputKey);
    if (!metadata) throw new Error('Upload not found');
    const expectedContentType = contentTypeForUploadKey(inputKey);
    const validation = validateUploadMetadata({
      contentType: metadata.contentType ?? '',
      size: metadata.contentLength ?? Number.NaN,
    });
    if (!validation.ok || metadata.contentType !== expectedContentType) {
      await this.deleteOrphan(inputKey);
      throw new Error('Invalid uploaded object');
    }

    let job = createJob(this.createId(), inputKey, ownerId);
    try {
      await this.dependencies.jobStore.save(job);
    } catch (error) {
      await this.deleteOrphan(inputKey);
      throw error;
    }

    try {
      const result = await this.dependencies.provider.remove({ jobId: job.id, inputKey });
      if (result.status === 'completed') {
        job = finishJob(job, result.resultKey);
        await this.dependencies.jobStore.save(job);
      }
    } catch {
      job = failJob(job, 'Image processing failed. Please try again.');
      try {
        await this.dependencies.jobStore.save(job);
      } finally {
        await this.deleteOrphan(inputKey);
      }
    }

    return job;
  }

  get(id: string): Promise<Job | null> {
    return this.dependencies.jobStore.get(id);
  }
}

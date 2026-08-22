import { describe, expect, it, vi } from 'vitest';
import { createUploadKey, MAX_UPLOAD_BYTES } from '../upload/validation';
import type { Job } from './job';
import { JobService } from './job-service';

function createDependencies() {
  const jobs = new Map<string, Job>();
  return {
    jobStore: {
      save: vi.fn(async (job: Job) => void jobs.set(job.id, job)),
      get: vi.fn(async (id: string) => jobs.get(id) ?? null),
    },
    objects: {
      getMetadata: vi.fn().mockResolvedValue({ contentLength: 68, contentType: 'image/png' }),
      deleteObject: vi.fn().mockResolvedValue(undefined),
    },
    provider: { remove: vi.fn().mockResolvedValue({ status: 'completed', resultKey: 'results/job-1.png' }) },
  };
}

describe('JobService', () => {
  it('rejects object keys outside uploads', async () => {
    const deps = createDependencies();
    const service = new JobService(deps, () => 'job-1');
    await expect(service.create('../private/file.png', 'google-user-1')).rejects.toThrow('Invalid upload key');
  });

  it('rejects an upload belonging to another user without deleting it', async () => {
    const deps = createDependencies();
    const service = new JobService(deps, () => 'job-1');
    const inputKey = await createUploadKey('google-user-2', 'image/png', 'eb8fa168-c11c-4e54-8c63-137d649ed1db');
    await expect(service.create(inputKey, 'google-user-1')).rejects.toThrow('Upload not found');
    expect(deps.objects.getMetadata).not.toHaveBeenCalled();
    expect(deps.objects.deleteObject).not.toHaveBeenCalled();
  });

  it('rejects an upload that does not exist', async () => {
    const deps = createDependencies();
    deps.objects.getMetadata.mockResolvedValue(null);
    const service = new JobService(deps, () => 'job-1');
    const inputKey = await createUploadKey('google-user-1', 'image/png', 'eb8fa168-c11c-4e54-8c63-137d649ed1db');
    await expect(service.create(inputKey, 'google-user-1')).rejects.toThrow('Upload not found');
  });

  it.each([
    { metadata: { contentLength: 0, contentType: 'image/png' }, label: 'empty' },
    { metadata: { contentLength: MAX_UPLOAD_BYTES + 1, contentType: 'image/png' }, label: 'oversized' },
    { metadata: { contentLength: 68, contentType: 'image/jpeg' }, label: 'content-type mismatch' },
  ])('rejects and cleans up a $label uploaded object', async ({ metadata }) => {
    const deps = createDependencies();
    deps.objects.getMetadata.mockResolvedValue(metadata);
    const service = new JobService(deps, () => 'job-1');
    const inputKey = await createUploadKey('google-user-1', 'image/png', 'eb8fa168-c11c-4e54-8c63-137d649ed1db');

    await expect(service.create(inputKey, 'google-user-1')).rejects.toThrow('Invalid uploaded object');
    expect(deps.objects.deleteObject).toHaveBeenCalledWith(inputKey);
    expect(deps.provider.remove).not.toHaveBeenCalled();
  });

  it('persists processing then completed state', async () => {
    const deps = createDependencies();
    const service = new JobService(deps, () => 'job-1');
    const inputKey = await createUploadKey('google-user-1', 'image/png', 'eb8fa168-c11c-4e54-8c63-137d649ed1db');
    const job = await service.create(inputKey, 'google-user-1');
    expect(deps.jobStore.save).toHaveBeenCalledTimes(2);
    expect(job).toMatchObject({ id: 'job-1', ownerId: 'google-user-1', status: 'completed', resultKey: 'results/job-1.png' });
  });

  it('best-effort deletes an orphan when the initial job save fails', async () => {
    const deps = createDependencies();
    deps.jobStore.save.mockRejectedValueOnce(new Error('job store unavailable'));
    deps.objects.deleteObject.mockRejectedValueOnce(new Error('cleanup unavailable'));
    const service = new JobService(deps, () => 'job-1');
    const inputKey = await createUploadKey('google-user-1', 'image/png', 'eb8fa168-c11c-4e54-8c63-137d649ed1db');

    await expect(service.create(inputKey, 'google-user-1')).rejects.toThrow('job store unavailable');
    expect(deps.objects.deleteObject).toHaveBeenCalledWith(inputKey);
  });

  it('persists a safe provider failure and best-effort deletes the input object', async () => {
    const deps = createDependencies();
    deps.provider.remove.mockRejectedValue(new Error('secret provider response'));
    deps.objects.deleteObject.mockRejectedValue(new Error('cleanup unavailable'));
    const service = new JobService(deps, () => 'job-1');
    const inputKey = await createUploadKey('google-user-1', 'image/png', 'eb8fa168-c11c-4e54-8c63-137d649ed1db');
    const job = await service.create(inputKey, 'google-user-1');
    expect(job).toMatchObject({ status: 'failed', error: 'Image processing failed. Please try again.' });
    expect(deps.jobStore.save).toHaveBeenCalledTimes(2);
    expect(deps.objects.deleteObject).toHaveBeenCalledWith(inputKey);
  });
});

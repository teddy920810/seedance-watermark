import { expect, it } from 'vitest';
import { GenerationService, type GenerationStore, type VideoProvider } from './generation';
import { freeVideoJobSlot, reserveFreeVideoSlot } from './free-quota';

it('limits concurrent submissions to one per account and five across all instances', async () => {
  const objects = new Map<string, unknown>();
  const store = {
    async getJson(key: string) { return objects.get(key) ?? null; },
    async putJson(key: string, value: unknown) { objects.set(key, value); },
    async putJsonIfAbsent(key: string, value: unknown) {
      if (objects.has(key)) return false;
      objects.set(key, value);
      return true;
    },
  } as GenerationStore;
  let submissions = 0;
  const provider: VideoProvider = {
    async submit() {
      await reserveFreeVideoSlot(store);
      submissions += 1;
      return String(submissions);
    },
    async poll() { return { status: 'queued' }; },
    async download() { return new Uint8Array(); },
  };
  const service = (owner: string) => new GenerationService(store, provider, freeVideoJobSlot(owner));
  const one = { id: 'one', prompt: 'A red kite' };
  const results = await Promise.allSettled([
    service('alice').create(one, 'alice'),
    service('alice').create(one, 'alice'),
    service('alice').create({ ...one, id: 'duplicate' }, 'alice'),
    ...Array.from({ length: 7 }, (_, index) => service(`user-${index}`).create({ ...one, id: String(index) }, `user-${index}`)),
  ]);
  expect(submissions).toBe(5);
  expect(results[2]).toMatchObject({ status: 'rejected', reason: { code: 'FREE_VIDEO_LIMIT' } });
  expect(results).toContainEqual(expect.objectContaining({ status: 'fulfilled', value: expect.objectContaining({ errorCode: 'FREE_VIDEO_QUOTA' }) }));
  expect(await service('bob').read(one.id, 'bob')).toBeNull();
  expect(freeVideoJobSlot('alice').resultPrefix).not.toBe(freeVideoJobSlot('bob').resultPrefix);
  objects.delete(freeVideoJobSlot('alice').key);
  await expect(service('alice').create(one, 'alice')).rejects.toMatchObject({ code: 'FREE_VIDEO_LIMIT' });
});

import { createHash } from 'node:crypto';
import { VideoProviderError } from './errors';
import type { GenerationStore } from './generation';

// Each fal request must pass a US$1 price check. Persist the five claims outside
// the 24-hour job lifecycle so redeploys and expired jobs do not reset the cap.
const prefix = 'free-video-reservations/v1';

export function freeVideoJobSlot(ownerId: string) {
  const account = createHash('sha256').update(ownerId).digest('hex');
  return {
    key: `jobs/fal-free-${account}.json`,
    resultPrefix: `results/fal-free-${account}-`,
    reservationKey: `${prefix}/accounts/${account}.json`,
    atomic: true,
    limitCode: 'FREE_VIDEO_LIMIT',
  } as const;
}

export async function reserveFreeVideoSlot(store: Pick<GenerationStore, 'putJsonIfAbsent'>) {
  if (!store.putJsonIfAbsent) throw new Error('Atomic reservation unavailable');
  for (let slot = 1; slot <= 5; slot += 1) {
    if (await store.putJsonIfAbsent(`${prefix}/budget/${slot}.json`, { reserved: true })) return;
  }
  throw new VideoProviderError('FREE_VIDEO_QUOTA');
}

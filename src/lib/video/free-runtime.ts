import { getSecret } from 'astro:env/server';
import { VideoProviderError } from './errors';
import { FalVideoProvider } from './fal-provider';
import { freeVideoJobSlot, reserveFreeVideoSlot } from './free-quota';
import { FREE_VIDEO_OPTIONS, isFreeVideoEnabled } from './free-rollout';
import { GenerationService } from './generation';
import { assertFalPrice, generationReadiness, generationStore } from './runtime';
import { trimFreeVideo } from './trim-video';

export function freeVideoService(ownerId: string) {
  if (!isFreeVideoEnabled(process.env) || !generationReadiness(true).configured) {
    throw new VideoProviderError('SERVICE_UNAVAILABLE');
  }
  const store = generationStore();
  const key = getSecret('FAL_KEY')!;
  const fal = new FalVideoProvider(key);
  return new GenerationService(store, {
    async submit(prompt) {
      await reserveFreeVideoSlot(store);
      return fal.submit(prompt, FREE_VIDEO_OPTIONS);
    },
    poll: (id) => fal.poll(id),
    async download(url) { return trimFreeVideo(await fal.download(url)); },
  }, {
    ...freeVideoJobSlot(ownerId),
    beforeReserve: () => assertFalPrice(key),
    persistProgress: false,
  });
}

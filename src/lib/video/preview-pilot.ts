import type { VideoOptions } from './options';

export const PREVIEW_OPTIONS = { duration: '4', resolution: '480p', aspectRatio: '16:9', generateAudio: false } satisfies VideoOptions;
const TEST_WINDOW_MS = 2 * 60 * 60 * 1000;

export function isHostedPilot(env: Readonly<Record<string, string | undefined>>, requestUrl?: URL, now = Date.now()) {
  if (env.VERCEL_ENV !== 'preview' || env.SEEDANCE_PREVIEW_PAID !== 'true' ||
      !env.SEEDANCE_PREVIEW_TESTER_EMAIL?.trim()) return false;
  const deadline = Date.parse(env.SEEDANCE_PREVIEW_UNTIL ?? '');
  if (!(deadline > now && deadline - now <= TEST_WINDOW_MS)) return false;
  try {
    const origin = new URL(env.SEEDANCE_PREVIEW_ORIGIN ?? '');
    return origin.protocol === 'https:' && origin.origin === env.SEEDANCE_PREVIEW_ORIGIN &&
      (!requestUrl || requestUrl.origin === origin.origin);
  } catch { return false; }
}

export function allowsPreviewTester(email: string | undefined, user: { email?: string; emailVerified?: boolean } | undefined) {
  return user?.emailVerified === true && Boolean(email?.trim()) &&
    user.email?.toLowerCase() === email?.trim().toLowerCase();
}

export function matchesPreviewOptions(options: VideoOptions | undefined) {
  return options?.duration === PREVIEW_OPTIONS.duration && options.resolution === PREVIEW_OPTIONS.resolution &&
    options.aspectRatio === PREVIEW_OPTIONS.aspectRatio && options.generateAudio === PREVIEW_OPTIONS.generateAudio;
}

export function isWithinPreviewBudget(price: { unit_price?: unknown; currency?: unknown; unit?: unknown }) {
  // Allow for one extra frame and conservatively price the next resolution up.
  const units = 1280 * 720 * 97 / 1024 / 1000;
  return price.currency === 'USD' && price.unit === '1000 tokens' && typeof price.unit_price === 'number' &&
    price.unit_price > 0 && price.unit_price * units <= 1;
}

import type { VideoOptions } from './options';

export const PREVIEW_OPTIONS = { duration: '4', resolution: '480p', aspectRatio: '16:9', generateAudio: false } satisfies VideoOptions;
const TEST_BRANCH = 'codex/seedance-2-fast-preview';

export function isHostedPilot(env: Readonly<Record<string, string | undefined>>, requestUrl?: URL) {
  if (env.VERCEL_ENV !== 'preview' || env.SEEDANCE_PREVIEW_PAID !== 'true' ||
      env.VERCEL_GIT_COMMIT_REF !== TEST_BRANCH || !env.SEEDANCE_PREVIEW_TESTER_EMAIL?.trim()) return false;
  // Vercel provides the stable branch hostname without a protocol.
  // https://vercel.com/docs/environment-variables/system-environment-variables#vercel_branch_url
  const host = env.VERCEL_BRANCH_URL;
  return Boolean(host && /^[a-z0-9-]+\.vercel\.app$/i.test(host) &&
    (!requestUrl || requestUrl.origin === `https://${host.toLowerCase()}`));
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

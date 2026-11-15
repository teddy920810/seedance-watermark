import { createHash } from 'node:crypto';
import { PREVIEW_OPTIONS } from './preview-pilot';

export const FREE_VIDEO_OPTIONS = PREVIEW_OPTIONS;

export function isFreeVideoEnabled(env: Readonly<Record<string, string | undefined>>, url?: URL) {
  return env.VERCEL_ENV === 'production' && env.SEEDANCE_FREE_VIDEO_ENABLED === 'true' &&
    (!url || url.origin === 'https://www.seedances.co');
}

export function freeVideoOwner(user?: { email?: string; emailVerified?: boolean }) {
  const email = user?.emailVerified === true ? user.email?.trim().toLowerCase() : undefined;
  // A verified email is stable across OAuth sessions even without a user database.
  return email ? createHash('sha256').update(email).digest('hex') : null;
}

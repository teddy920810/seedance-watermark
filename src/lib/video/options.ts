// Seedance 1.5 Pro text-to-video schema, verified 2026-11-08:
// https://fal.ai/models/fal-ai/bytedance/seedance/v1.5/pro/text-to-video/api
export const VIDEO_DURATIONS = ['4', '5', '6', '7', '8', '9', '10', '11', '12'] as const;
export const VIDEO_RESOLUTIONS = ['480p', '720p', '1080p'] as const;
export const VIDEO_ASPECT_RATIOS = ['16:9', '4:3', '1:1', '9:16', '3:4', '21:9', 'auto'] as const;
export type VideoOptions = {
  duration: typeof VIDEO_DURATIONS[number];
  resolution: typeof VIDEO_RESOLUTIONS[number];
  aspectRatio: typeof VIDEO_ASPECT_RATIOS[number];
  generateAudio: boolean;
};
export const DEFAULT_VIDEO_OPTIONS: VideoOptions = {
  duration: '5', resolution: '480p', aspectRatio: '16:9', generateAudio: false,
};

export function isVideoOptions(value: unknown): value is VideoOptions {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return Object.keys(candidate).length === 4 && Object.keys(candidate).every((key) => Object.hasOwn(DEFAULT_VIDEO_OPTIONS, key)) &&
    VIDEO_DURATIONS.some((v) => v === candidate.duration) &&
    VIDEO_RESOLUTIONS.some((v) => v === candidate.resolution) &&
    VIDEO_ASPECT_RATIOS.some((v) => v === candidate.aspectRatio) && typeof candidate.generateAudio === 'boolean';
}

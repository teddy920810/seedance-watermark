export type VideoErrorCode = 'LOGIN_REQUIRED' | 'SUBMISSION_UNKNOWN' | 'SERVICE_UNAVAILABLE' |
  'CONTENT_RESTRICTED' | 'GENERATION_FAILED' | 'LINK_EXPIRED' | 'PROMPT_REQUIRED' | 'PROMPT_TOO_LONG' | 'INVALID_OPTIONS';

export const MAX_PROMPT_LENGTH = 2000;
export function getPromptError(prompt: string): 'PROMPT_REQUIRED' | 'PROMPT_TOO_LONG' | null {
  if (!prompt.trim()) return 'PROMPT_REQUIRED';
  return prompt.length > MAX_PROMPT_LENGTH ? 'PROMPT_TOO_LONG' : null;
}

export const videoNotices: Record<VideoErrorCode, { title: string; message: string }> = {
  INVALID_OPTIONS: { title: 'Check video settings', message: 'Please choose a supported duration, resolution, aspect ratio and audio setting. No video generation has been started.' },
  PROMPT_REQUIRED: { title: 'Prompt required', message: 'Please describe the video you want to create. A prompt containing only spaces cannot be submitted. No generation request has been sent.' },
  PROMPT_TOO_LONG: { title: 'Prompt too long', message: 'Your prompt exceeds the 2,000-character limit. Please shorten it and try again. Your text has been kept, and no generation request has been sent.' },
  LOGIN_REQUIRED: { title: 'Sign in required', message: 'Please sign in to generate a video or view your task. Your prompt and existing task will be kept.' },
  SUBMISSION_UNKNOWN: { title: 'Submission status unknown', message: 'We couldn’t confirm your submission. Check the task status before trying again to avoid duplicate charges. If it remains unknown, keep your task ID and contact support.' },
  SERVICE_UNAVAILABLE: { title: 'Service temporarily unavailable', message: 'Video generation or task retrieval is currently unavailable. Please try again later. If you already submitted a task, check its status instead of generating again.' },
  CONTENT_RESTRICTED: { title: 'Please revise your prompt', message: 'This request couldn’t be processed due to content restrictions. Please revise your prompt before a future generation. This task will not be retried automatically. Keep your task ID if you need help.' },
  GENERATION_FAILED: { title: 'Generation failed', message: 'We couldn’t complete this video. Keep your task ID if you contact support. No new generation has been started automatically.' },
  LINK_EXPIRED: { title: 'Download link expired', message: 'Refresh the link to download your video. This retrieves a new link for the existing video and does not generate another video.' },
};

export class VideoProviderError extends Error {
  constructor(public readonly code: VideoErrorCode) { super(videoNotices[code].message); }
}

// Use fal's typed detail, never guess moderation from a 422 or private message.
// https://fal.ai/docs/documentation/model-apis/errors
export function isContentRestricted(body: unknown): boolean {
  if (!body || typeof body !== 'object' || !('detail' in body)) return false;
  const detail = body.detail;
  return Array.isArray(detail) && detail.some((item: unknown) => item && typeof item === 'object' &&
    'type' in item && item.type === 'content_policy_violation');
}

export function isVideoErrorCode(value: unknown): value is VideoErrorCode {
  return typeof value === 'string' && Object.hasOwn(videoNotices, value);
}

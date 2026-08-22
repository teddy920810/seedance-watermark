export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const extensions = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const;

export type AllowedContentType = keyof typeof extensions;

const contentTypesByExtension = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
} as const;

export type ValidationResult =
  | { ok: true }
  | { ok: false; code: 'invalid_type' | 'invalid_size'; message: string };

export function validateUploadMetadata(input: { contentType: string; size: number }): ValidationResult {
  if (!(input.contentType in extensions)) {
    return { ok: false, code: 'invalid_type', message: 'Please upload a JPG, PNG, or WEBP image.' };
  }

  if (!Number.isFinite(input.size) || input.size <= 0 || input.size > MAX_UPLOAD_BYTES) {
    return { ok: false, code: 'invalid_size', message: 'The image must be between 1 byte and 10 MB.' };
  }

  return { ok: true };
}

async function ownerNamespace(ownerId: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ownerId));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

export async function createUploadKey(
  ownerId: string,
  contentType: string,
  id: string = crypto.randomUUID(),
): Promise<string> {
  const extension = extensions[contentType as AllowedContentType];
  if (!extension) throw new Error('Unsupported image type');
  return `uploads/${await ownerNamespace(ownerId)}/${id}.${extension}`;
}

export function isUploadKey(key: string): boolean {
  return /^uploads\/[0-9a-f]{32}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|png|webp)$/i.test(key);
}

export async function isUploadKeyForOwner(key: string, ownerId: string): Promise<boolean> {
  return isUploadKey(key) && key.startsWith(`uploads/${await ownerNamespace(ownerId)}/`);
}

export function contentTypeForUploadKey(key: string): AllowedContentType | null {
  const extension = key.match(/\.(jpg|png|webp)$/i)?.[1]?.toLowerCase() as keyof typeof contentTypesByExtension | undefined;
  return extension ? contentTypesByExtension[extension] : null;
}

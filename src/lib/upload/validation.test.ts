import { describe, expect, it } from 'vitest';
import {
  MAX_UPLOAD_BYTES,
  createUploadKey,
  isUploadKeyForOwner,
  validateUploadMetadata,
} from './validation';

describe('upload validation', () => {
  it.each(['image/jpeg', 'image/png', 'image/webp'])('accepts %s', (contentType) => {
    expect(validateUploadMetadata({ contentType, size: 1024 })).toEqual({ ok: true });
  });

  it('rejects unsupported file types', () => {
    expect(validateUploadMetadata({ contentType: 'image/svg+xml', size: 1024 })).toMatchObject({ ok: false });
  });

  it('rejects files larger than 10 MB', () => {
    expect(validateUploadMetadata({ contentType: 'image/png', size: MAX_UPLOAD_BYTES + 1 })).toMatchObject({ ok: false });
  });

  it('creates opaque, user-isolated upload keys with the expected extension', async () => {
    const key = await createUploadKey(
      'google-user-1',
      'image/webp',
      '00000000-0000-4000-8000-000000000001',
    );

    expect(key).toMatch(/^uploads\/[0-9a-f]{32}\/00000000-0000-4000-8000-000000000001\.webp$/);
    expect(key).not.toContain('google-user-1');
    await expect(isUploadKeyForOwner(key, 'google-user-1')).resolves.toBe(true);
    await expect(isUploadKeyForOwner(key, 'google-user-2')).resolves.toBe(false);
  });
});

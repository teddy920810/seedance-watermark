import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readLanding = (name: string) => JSON.parse(
  readFileSync(new URL(`../../content/landing-pages/${name}.json`, import.meta.url), 'utf8'),
) as { featuresSource?: string; features?: unknown };

describe('landing-page feature source migration', () => {
  it('marks existing custom content as custom and other tools as shared', () => {
    expect(readLanding('seedance-watermark-from-video')).toMatchObject({
      featuresSource: 'custom',
      features: expect.any(Object),
    });
    expect(readLanding('remove-seedance-watermark').featuresSource).toBe('shared');
    expect(readLanding('seedance-watermark-from-image').featuresSource).toBe('shared');
  });
});

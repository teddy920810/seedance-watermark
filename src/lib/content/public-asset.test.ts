import { describe, expect, it } from 'vitest';
import { publicAssetAvailable } from './public-asset';

describe('editorial public asset tolerance', () => {
  it('omits missing local assets while allowing existing and remote assets', () => {
    expect(publicAssetAvailable('/uploads/existing.png', { exists: (path) => path.endsWith('existing.png') })).toBe(true);
    expect(publicAssetAvailable('/uploads/missing.png', { exists: () => false })).toBe(false);
    expect(publicAssetAvailable('https://cdn.example.com/image.png', { exists: () => false })).toBe(true);
    expect(publicAssetAvailable('', { exists: () => true })).toBe(false);
  });
});

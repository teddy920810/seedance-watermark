import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ getSecret: vi.fn(), R2ObjectStore: vi.fn(), FalVideoProvider: vi.fn() }));
vi.mock('astro:env/server', () => ({ getSecret: mocks.getSecret }));
vi.mock('../r2/r2-object-store', () => ({ R2ObjectStore: mocks.R2ObjectStore }));
vi.mock('./fal-provider', () => ({ FalVideoProvider: mocks.FalVideoProvider }));
import { generationReadiness, generationService } from './runtime';
beforeEach(() => { vi.resetAllMocks(); });
describe('generation server configuration', () => {
  it('reports missing names only and never the secret values', () => {
    mocks.getSecret.mockImplementation((key: string) => key === 'FAL_KEY' ? 'private-key' : undefined);
    const ready = generationReadiness();
    expect(ready.configured).toBe(false);
    expect(ready.missing).not.toContain('FAL_KEY');
    expect(JSON.stringify(ready)).not.toContain('private-key');
    expect(() => generationService()).toThrow('Generation configuration incomplete');
  });
  it('does not treat placeholder R2 URLs as configured', () => {
    mocks.getSecret.mockImplementation((key: string) => key === 'R2_ENDPOINT' ? 'https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com' : 'configured');
    expect(generationReadiness().missing).toEqual(['R2_ENDPOINT']);
    expect(generationReadiness().enabled).toBe(false);
  });
});

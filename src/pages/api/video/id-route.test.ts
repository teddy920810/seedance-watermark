import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ getSession: vi.fn(), generationReadiness: vi.fn(), generationService: vi.fn() }));
vi.mock('../../../lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('../../../lib/video/runtime', () => ({ generationReadiness: mocks.generationReadiness, generationService: mocks.generationService }));
import { GET } from './[id]';
const id = '00000000-0000-4000-8000-000000000001';
function ctx(value = id, host = 'http://localhost:4321') {
  return { request: new Request(`${host}/api/video/${value}`), params: { id: value } } as unknown as Parameters<typeof GET>[0];
}
beforeEach(() => { vi.resetAllMocks(); mocks.getSession.mockResolvedValue({ user: { id: 'user-1' } }); });
describe('read generation task', () => {
  it('rejects production hosts and unauthenticated requests', async () => {
    expect((await GET(ctx(id, 'https://www.seedances.co'))).status).toBe(404);
    mocks.getSession.mockResolvedValue(null);
    expect((await GET(ctx())).status).toBe(401);
    expect(mocks.generationService).not.toHaveBeenCalled();
  });
  it('rejects invalid and unknown task IDs', async () => {
    expect((await GET(ctx('invalid'))).status).toBe(404);
    mocks.generationService.mockReturnValue({ read: vi.fn().mockResolvedValue(null) });
    expect((await GET(ctx())).status).toBe(404);
  });
  it('queries for the authenticated owner and returns only public data', async () => {
    const read = vi.fn().mockResolvedValue({ id, status: 'running' });
    mocks.generationService.mockReturnValue({ read, present: vi.fn().mockResolvedValue({ id, status: 'running' }) });
    const response = await GET(ctx());
    expect(read).toHaveBeenCalledWith(id, 'user-1');
    expect(await response.json()).toEqual({ id, status: 'running' });
  });
  it('does not expose secrets on infrastructure errors', async () => {
    mocks.generationService.mockImplementation(() => { throw new Error('secret key'); });
    const response = await GET(ctx());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('secret key');
  });
});

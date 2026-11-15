import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { json } from '../../../lib/api/response';
import { generationService } from '../../../lib/video/runtime';
import { isLocalPilot } from './index';
import { allowsPreviewTester, isHostedPilot } from '../../../lib/video/preview-pilot';
import { freeVideoOwner, isFreeVideoEnabled } from '../../../lib/video/free-rollout';

export const prerender = false;
export const GET: APIRoute = async ({ request, params }) => {
  const hosted = isHostedPilot(process.env, new URL(request.url));
  const free = isFreeVideoEnabled(process.env, new URL(request.url));
  if (!free && !hosted && !isLocalPilot(request)) return json({ error: 'Not found' }, { status: 404 });
  try {
    const session = await getSession(request);
    if (!session?.user.id) return json({ error: 'Sign in to view this task.', code: 'LOGIN_REQUIRED' }, { status: 401 });
    const freeOwner = free ? freeVideoOwner(session.user) : null;
    if (free && !freeOwner) return json({ error: 'Sign in to view this task.', code: 'LOGIN_REQUIRED' }, { status: 401 });
    if (hosted && !allowsPreviewTester(process.env.SEEDANCE_PREVIEW_TESTER_EMAIL, session.user)) return json({ error: 'Not found' }, { status: 404 });
    if (!params.id || !/^[0-9a-f-]{36}$/i.test(params.id)) return json({ error: 'Task not found' }, { status: 404 });
    const service = freeOwner ? (await import('../../../lib/video/free-runtime')).freeVideoService(freeOwner) : generationService(hosted);
    const job = await service.read(params.id, freeOwner ?? session.user.id);
    if (!job) return json({ error: 'Task not found' }, { status: 404 });
    return json(await service.present(job));
  } catch {
    return json({ error: 'Unable to check this task. Retry status; do not submit a new generation.', code: 'SERVICE_UNAVAILABLE' }, { status: 503 });
  }
};

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { json } from '../../../lib/api/response';
import { generationService } from '../../../lib/video/runtime';
import { isLocalPilot } from './index';

export const prerender = false;
export const GET: APIRoute = async ({ request, params }) => {
  if (!isLocalPilot(request)) return json({ error: 'Not found' }, { status: 404 });
  try {
    const session = await getSession(request);
    if (!session?.user.id) return json({ error: 'Sign in to view this task.', code: 'LOGIN_REQUIRED' }, { status: 401 });
    if (!params.id || !/^[0-9a-f-]{36}$/i.test(params.id)) return json({ error: 'Task not found' }, { status: 404 });
    const service = generationService();
    const job = await service.read(params.id, session.user.id);
    if (!job) return json({ error: 'Task not found' }, { status: 404 });
    return json(await service.present(job));
  } catch {
    return json({ error: 'Unable to check this task. Retry status; do not submit a new generation.', code: 'SERVICE_UNAVAILABLE' }, { status: 503 });
  }
};

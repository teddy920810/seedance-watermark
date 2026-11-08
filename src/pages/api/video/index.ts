import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getSession } from '../../../lib/auth';
import { json, readJson } from '../../../lib/api/response';
import { parseGenerationInput } from '../../../lib/video/generation';
import { getPromptError, videoNotices } from '../../../lib/video/errors';
import { generationReadiness, generationService } from '../../../lib/video/runtime';

export const prerender = false;
export function isLocalPilot(request: Request) {
  return import.meta.env.DEV && ['localhost', '127.0.0.1', '[::1]'].includes(new URL(request.url).hostname);
}

export const GET: APIRoute = async ({ request }) => {
  if (!isLocalPilot(request)) return json({ error: 'Not found' }, { status: 404 });
  return json(generationReadiness());
};

export const POST: APIRoute = async ({ request }) => {
  if (!isLocalPilot(request)) return json({ error: 'Not found' }, { status: 404 });
  if (request.headers.get('origin') !== new URL(request.url).origin) return json({ error: 'Invalid origin' }, { status: 403 });
  const readiness = generationReadiness();
  if (!readiness.configured || !readiness.enabled) return json({ error: 'Local generation is not enabled or setup is incomplete.', code: 'SERVICE_UNAVAILABLE' }, { status: 503 });
  try {
    const session = await getSession(request);
    if (!session?.user.id) return json({ error: 'Sign in with Google before generating a video.', code: 'LOGIN_REQUIRED' }, { status: 401 });
    let input;
    try {
      const body = await readJson(request);
      if (body && typeof body === 'object' && 'prompt' in body && typeof body.prompt === 'string') {
        const code = getPromptError(body.prompt);
        if (code) return json({ error: videoNotices[code].message, code }, { status: 400 });
      }
      input = parseGenerationInput(body);
    }
    catch (error) {
      if (error instanceof z.ZodError && error.issues.some((issue) => issue.path[0] === 'options')) {
        return json({ error: videoNotices.INVALID_OPTIONS.message, code: 'INVALID_OPTIONS' }, { status: 400 });
      }
      return json({ error: 'Check your prompt and video settings, then try again.' }, { status: 400 });
    }
    const service = generationService();
    const job = await service.create(input, session.user.id);
    return json(await service.present(job), { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'The local test limit has been reached.') return json({ error: error.message }, { status: 429 });
    return json({ error: 'Unable to submit. Keep this task ID and check fal history before retrying.', code: 'SUBMISSION_UNKNOWN' }, { status: 503 });
  }
};

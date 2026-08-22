/* global Buffer, Headers, URL, fetch, setTimeout */

const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);

const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeBaseUrl(value) {
  const url = new URL(value);
  return url.toString().replace(/\/$/, '');
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

async function apiJson(fetcher, url, init, sessionCookie) {
  const headers = new Headers(init?.headers);
  headers.set('Cookie', sessionCookie);
  const response = await fetcher(url, { ...init, headers });
  const body = await readJson(response);
  if (!response.ok) {
    throw new Error(`${new URL(url).pathname} returned ${response.status}: ${body.error ?? 'unknown error'}`);
  }
  return body;
}

export async function runPublicSmoke({ baseUrl, fetcher = fetch }) {
  const origin = normalizeBaseUrl(baseUrl);
  const publicChecks = [
    { path: '/', marker: '<link rel="canonical"' },
    { path: '/robots.txt', marker: 'Sitemap:' },
    { path: '/sitemap.xml', marker: '<urlset' },
  ];

  for (const check of publicChecks) {
    const response = await fetcher(`${origin}${check.path}`);
    const body = await response.text();
    if (!response.ok || !body.includes(check.marker)) {
      throw new Error(`${check.path} failed the public production check.`);
    }
  }

  const anonymousUpload = await fetcher(`${origin}/api/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType: 'image/png', size: png.byteLength }),
  });
  const anonymousBody = await readJson(anonymousUpload);
  if (anonymousUpload.status !== 401 || anonymousBody.url || anonymousBody.key) {
    throw new Error('Anonymous upload signing must return 401 without an upload contract.');
  }

  return { status: 'passed' };
}

export async function runAuthenticatedSmoke({
  baseUrl,
  sessionCookie,
  fetcher = fetch,
  sleep = defaultSleep,
}) {
  if (!sessionCookie) {
    return { status: 'skipped', reason: 'SMOKE_SESSION_COOKIE is not configured.' };
  }
  if (/\r|\n/.test(sessionCookie)) throw new Error('SMOKE_SESSION_COOKIE contains invalid characters.');

  const origin = normalizeBaseUrl(baseUrl);
  const signed = await apiJson(fetcher, `${origin}/api/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType: 'image/png', size: png.byteLength }),
  }, sessionCookie);

  const upload = await fetcher(signed.url, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/png' },
    body: png,
  });
  if (!upload.ok) throw new Error(`R2 PUT returned ${upload.status}`);

  const created = await apiJson(fetcher, `${origin}/api/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputKey: signed.key }),
  }, sessionCookie);

  let job;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    job = await apiJson(fetcher, `${origin}/api/jobs/${created.id}`, undefined, sessionCookie);
    if (job.status === 'completed' || job.status === 'failed') break;
    await sleep(1_000);
  }

  if (job?.status !== 'completed' || !job.resultUrl || !job.downloadUrl) {
    throw new Error(`Production job did not complete: ${job?.status ?? 'unknown'}`);
  }

  for (const url of [job.resultUrl, job.downloadUrl]) {
    const response = await fetcher(url);
    if (!response.ok) throw new Error(`Signed result request returned ${response.status}`);
  }

  return { status: 'passed' };
}

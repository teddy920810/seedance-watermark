/* global console, fetch, process, URL */

import { runAuthenticatedSmoke } from './production-smoke-lib.mjs';

const baseUrl = process.env.SMOKE_BASE_URL ?? 'https://www.seedances.co';
const result = await runAuthenticatedSmoke({
  baseUrl,
  sessionCookie: process.env.SMOKE_SESSION_COOKIE ?? '',
  fetcher: fetch,
});

if (result.status === 'skipped') {
  console.warn(`Authenticated production smoke skipped: ${result.reason}`);
} else {
  console.log(`Authenticated production smoke passed for ${new URL(baseUrl).origin}; sensitive values were redacted.`);
}


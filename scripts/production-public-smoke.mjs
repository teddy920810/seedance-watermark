/* global console, fetch, process, URL */

import { runPublicSmoke } from './production-smoke-lib.mjs';

const baseUrl = process.env.SMOKE_BASE_URL ?? 'https://www.seedances.co';
await runPublicSmoke({ baseUrl, fetcher: fetch });
console.log(`Public production smoke passed for ${new URL(baseUrl).origin}; no objects were created.`);

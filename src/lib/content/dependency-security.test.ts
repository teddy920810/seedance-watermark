import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const lock = JSON.parse(readFileSync(new URL('../../../package-lock.json', import.meta.url), 'utf8')) as {
  packages: Record<string, { version?: string }>;
};

// Minimum upstream patched versions for the September/October 2026 audit findings.
// Astro: https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2
// Sharp: https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c
// October updates: https://github.com/advisories/GHSA-mpr7-6m5w-76rw
// https://github.com/advisories/GHSA-wq5f-xc86-pv6w
// https://github.com/advisories/GHSA-mrhx-c7xc-m3w5
// https://github.com/advisories/GHSA-qxg6-89mg-rqv8
// https://github.com/advisories/GHSA-q2hr-2g5m-vwhr
// https://github.com/advisories/GHSA-j22f-vq7h-c4qm
// https://github.com/advisories/GHSA-w74x-v6f9-j3xg
// https://github.com/advisories/GHSA-rj75-hqrm-r3gf
// https://github.com/advisories/GHSA-r4xh-jqrq-34v2
// https://github.com/advisories/GHSA-68fv-2mgg-jv7q
// https://github.com/advisories/GHSA-xjj6-f33q-929c
// https://github.com/advisories/GHSA-587h-7wmj-h5pm
// https://github.com/advisories/GHSA-ch52-4w7c-c8xp (affected through 4.2.0)
// Better Auth 1.7.7 security release (no database migration):
// https://github.com/better-auth/better-auth/releases/tag/v1.7.7
// https://github.com/advisories/GHSA-965c-763c-88jm
// https://github.com/advisories/GHSA-r4xp-prcw-77qf
// https://github.com/advisories/GHSA-44jh-23m7-hpcf
const patched = {
  astro: '7.3.3', sharp: '0.35.5', 'fast-uri': '3.1.9',
  'js-yaml': '4.3.2', svgo: '4.1.0', vitest: '4.1.12',
  '@vitest/mocker': '4.1.12', '@vitest/coverage-v8': '4.1.12',
  zod: '4.6.6', devalue: '5.9.3', 'postcss-selector-parser': '7.1.6',
  'smol-toml': '1.9.0', 'source-map-js': '1.2.2', undici: '8.12.2',
  vite: '8.2.4', 'http-cache-semantics': '4.3.0',
  'better-auth': '1.7.7', '@better-auth/drizzle-adapter': '1.7.7',
  '@better-auth/kysely-adapter': '1.7.0',
};

function atLeast(version: string, floor: string) {
  const actual = version.split('.').map(Number);
  const minimum = floor.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) {
    if (actual[i] !== minimum[i]) return actual[i] > minimum[i];
  }
  return true;
}

describe('security-patched dependency lock', () => {
  for (const [name, floor] of Object.entries(patched)) {
    it(`keeps every installed ${name} copy at or above ${floor}`, () => {
      const copies = Object.entries(lock.packages).filter(([path]) => path.endsWith(`node_modules/${name}`));
      expect(copies.length).toBeGreaterThan(0);
      for (const [path, entry] of copies) {
        expect(atLeast(entry.version ?? '0.0.0', floor), `${path}: ${entry.version}`).toBe(true);
      }
    });
  }

  it('keeps both brace-expansion branches on their upstream patched releases', () => {
    const copies = Object.entries(lock.packages).filter(([path]) => path.endsWith('node_modules/brace-expansion'));
    expect(copies.length).toBeGreaterThan(0);
    for (const [path, entry] of copies) {
      const version = entry.version ?? '0.0.0';
      expect(['1', '5'], `${path}: ${version}`).toContain(version.split('.')[0]);
      const floor = version.startsWith('1.') ? '1.1.21' : '5.0.12';
      expect(atLeast(version, floor), `${path}: ${version}`).toBe(true);
    }
  });

  it('excludes the vulnerable Vite 8.3 releases as well as older 8.2 releases', () => {
    const copies = Object.entries(lock.packages).filter(([path]) => path.endsWith('node_modules/vite'));
    for (const [path, entry] of copies) {
      const version = entry.version ?? '0.0.0';
      expect(version.startsWith('8.3.') && !atLeast(version, '8.3.3'), `${path}: ${version}`).toBe(false);
    }
  });

  it('keeps the coverage provider matched to its exact Vitest peer version', () => {
    expect(lock.packages['node_modules/@vitest/coverage-v8'].version).toBe(lock.packages['node_modules/vitest'].version);
  });
});

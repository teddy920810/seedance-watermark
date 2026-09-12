import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const lock = JSON.parse(readFileSync(new URL('../../../package-lock.json', import.meta.url), 'utf8')) as {
  packages: Record<string, { version?: string }>;
};

// Minimum upstream patched versions for the September 2026 audit findings.
// Astro: https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2
// Sharp: https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c
const patched = {
  astro: '7.2.8', sharp: '0.35.4', 'fast-uri': '3.1.6',
  'js-yaml': '4.3.2', svgo: '4.1.0', vitest: '4.1.11',
  '@vitest/mocker': '4.1.11', '@vitest/coverage-v8': '4.1.11',
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
});

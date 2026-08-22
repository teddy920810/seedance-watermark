import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readWorkflow = (name: string) =>
  readFileSync(new URL(`../../../.github/workflows/${name}`, import.meta.url), 'utf8');

describe('CI workflow resilience', () => {
  const workflow = readWorkflow('ci.yml');

  it('cancels superseded runs and audits installed dependencies', () => {
    expect(workflow).toContain('concurrency:');
    expect(workflow).toContain('cancel-in-progress: true');
    expect(workflow).toContain('npm audit --audit-level=high');
  });

  it('keeps browser diagnostics when verification fails', () => {
    expect(workflow).toContain('uses: actions/upload-artifact@v4');
    expect(workflow).toContain('if: failure()');
    expect(workflow).toContain('playwright-report/');
    expect(workflow).toContain('test-results/');
  });
});

describe('production smoke workflow boundaries', () => {
  const workflow = readWorkflow('production-smoke.yml');

  it('runs public checks independently from authenticated checks', () => {
    expect(workflow).toContain('npm run test:smoke:production:public');
    expect(workflow).toContain('npm run test:smoke:production:auth');
    expect(workflow).toContain('SMOKE_SESSION_COOKIE: ${{ secrets.SMOKE_SESSION_COOKIE }}');
  });
});

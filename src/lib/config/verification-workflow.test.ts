import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const repoRoot = new URL('../../../', import.meta.url);
const packageJson = JSON.parse(readFileSync(new URL('package.json', repoRoot), 'utf8')) as {
  scripts: Record<string, string>;
};
const auditScript = new URL('scripts/release-audit.mjs', repoRoot);
const temporaryDirectories: string[] = [];

const run = (cwd: string, command: string, args: string[], env?: NodeJS.ProcessEnv) =>
  spawnSync(command, args, { cwd, encoding: 'utf8', env: env ? { ...process.env, ...env } : process.env });

const createRepository = () => {
  const directory = mkdtempSync(join(tmpdir(), 'seedance-release-audit-'));
  temporaryDirectories.push(directory);
  run(directory, 'git', ['init']);
  run(directory, 'git', ['config', 'user.email', 'audit@example.com']);
  run(directory, 'git', ['config', 'user.name', 'Release Audit']);
  writeFileSync(join(directory, 'README.md'), '# Fixture\n');
  run(directory, 'git', ['add', 'README.md']);
  run(directory, 'git', ['commit', '-m', 'fixture']);
  return directory;
};

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('tiered verification workflow', () => {
  it('exposes fast, content, UI sampling, full, and release gates', () => {
    expect(packageJson.scripts['check:content']).toBe('npm run site:validate && vitest run src/lib/content');
    expect(packageJson.scripts['check:ui']).toBe('playwright test tests/e2e/visual-sampling.spec.ts');
    expect(packageJson.scripts['check:fast']).toBe('npm run site:validate && npm test');
    expect(packageJson.scripts['release:verify']).toBe('npm run site:validate && npm run verify && node scripts/release-audit.mjs');
  });

  it('documents risk-based sampling without weakening the main release gate', () => {
    const guide = readFileSync(new URL('docs/TESTING_GUIDE.md', repoRoot), 'utf8');
    expect(guide).toContain('风险抽样');
    expect(guide).toContain('所有新增或修改的路由');
    expect(guide).toContain('发现一个问题');
    expect(guide).toContain('npm run release:verify');
    expect(guide).toContain('合并 `main`');
  });

  it('enforces the release gate against the complete PR diff in CI', () => {
    const workflow = readFileSync(new URL('.github/workflows/ci.yml', repoRoot), 'utf8');
    expect(workflow).toContain('fetch-depth: 0');
    expect(workflow).toContain('RELEASE_BASE:');
    expect(workflow).toContain('npm run release:verify');
  });

  it('allows ordinary changes and blocks sensitive paths or secret material', () => {
    const repository = createRepository();
    const base = run(repository, 'git', ['rev-parse', 'HEAD']).stdout.trim();

    writeFileSync(join(repository, 'article.md'), 'Safe editorial copy.\n');
    const ordinaryResult = run(repository, process.execPath, [fileURLToPath(auditScript)]);
    expect(ordinaryResult.status, ordinaryResult.stderr).toBe(0);
    rmSync(join(repository, 'article.md'));

    writeFileSync(join(repository, '.env.local'), 'SAFE_PLACEHOLDER=true\n');
    const sensitivePathResult = run(repository, process.execPath, [fileURLToPath(auditScript)]);
    expect(sensitivePathResult.status).not.toBe(0);
    expect(sensitivePathResult.stderr).toContain('.env.local');
    rmSync(join(repository, '.env.local'));

    writeFileSync(join(repository, 'notes.txt'), ['-----BEGIN ', 'PRIVATE KEY-----\nnot-a-real-key\n'].join(''));
    const secretMaterialResult = run(repository, process.execPath, [fileURLToPath(auditScript)]);
    expect(secretMaterialResult.status).not.toBe(0);
    expect(secretMaterialResult.stderr).toContain('potential secret material');

    run(repository, 'git', ['add', 'notes.txt']);
    run(repository, 'git', ['commit', '-m', 'unsafe fixture']);
    const committedSecretResult = run(
      repository,
      process.execPath,
      [fileURLToPath(auditScript)],
      { RELEASE_BASE: base },
    );
    expect(committedSecretResult.status).not.toBe(0);
    expect(committedSecretResult.stderr).toContain('potential secret material');
  }, 15_000);
});

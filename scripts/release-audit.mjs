#!/usr/bin/env node

/* global process */

import { readFileSync, statSync } from 'node:fs';
import { extname } from 'node:path';
import { spawnSync } from 'node:child_process';

const binaryExtensions = new Set(['.avif', '.gif', '.ico', '.jpeg', '.jpg', '.mp4', '.pdf', '.png', '.webp', '.zip']);
const sensitivePathPattern = /(^|\/)(?:\.env(?:\.(?!example$)[^/]*)?|S3-info\.txt|[^/]*(?:credentials|secret)[^/]*\.(?:json|key|pem|txt))$/i;
const secretMaterialPatterns = [
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:R2|S3|AWS)_[A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD)\s*[:=]\s*["']?[A-Za-z0-9/+_-]{16,}/,
];

function git(args, { allowFailure = false } = {}) {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  if (!allowFailure && result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || `git ${args.join(' ')} failed.\n`);
    process.exit(result.status ?? 1);
  }
  return result;
}

function nulPaths(args) {
  const result = git(args);
  return result.stdout.split('\0').filter(Boolean);
}

git(['diff', '--check']);
git(['diff', '--cached', '--check']);

const changedPaths = new Set([
  ...nulPaths(['diff', '--name-only', '-z']),
  ...nulPaths(['diff', '--cached', '--name-only', '-z']),
  ...nulPaths(['ls-files', '--others', '--exclude-standard', '-z']),
]);

const releaseBase = process.env.RELEASE_BASE?.trim();
if (releaseBase) {
  const validBase = git(['rev-parse', '--verify', '--quiet', releaseBase], { allowFailure: true }).status === 0;
  if (!validBase) {
    process.stderr.write(`Release audit could not resolve RELEASE_BASE ${releaseBase}.\n`);
    process.exit(1);
  }
  for (const path of nulPaths(['diff', '--name-only', '-z', `${releaseBase}...HEAD`])) changedPaths.add(path);
}

const branch = git(['branch', '--show-current']).stdout.trim();
const hasOriginMain = git(['rev-parse', '--verify', '--quiet', 'origin/main'], { allowFailure: true }).status === 0;
if (!releaseBase && branch && branch !== 'main' && hasOriginMain) {
  for (const path of nulPaths(['diff', '--name-only', '-z', 'origin/main...HEAD'])) changedPaths.add(path);
}

const sensitivePaths = [...changedPaths].filter((path) => sensitivePathPattern.test(path.replaceAll('\\', '/')));
if (sensitivePaths.length > 0) {
  process.stderr.write(`Release audit blocked sensitive paths:\n${sensitivePaths.map((path) => `- ${path}`).join('\n')}\n`);
  process.exit(1);
}

const secretHits = [];
for (const path of changedPaths) {
  if (binaryExtensions.has(extname(path).toLowerCase())) continue;
  let stats;
  try {
    stats = statSync(path);
  } catch {
    continue;
  }
  if (!stats.isFile() || stats.size > 2_000_000) continue;
  const content = readFileSync(path, 'utf8');
  if (secretMaterialPatterns.some((pattern) => pattern.test(content))) secretHits.push(path);
}

if (secretHits.length > 0) {
  process.stderr.write(`Release audit found potential secret material in:\n${secretHits.map((path) => `- ${path}`).join('\n')}\n`);
  process.exit(1);
}

process.stdout.write(`Release audit passed for ${changedPaths.size} changed files.\n`);

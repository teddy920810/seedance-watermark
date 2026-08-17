import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const sourcePath = process.argv[2];
if (!sourcePath) {
  process.stderr.write('Usage: npm run r2:import -- <path-to-S3-info.txt>\n');
  process.exit(1);
}

const source = await readFile(path.resolve(sourcePath), 'utf8');
const fields = new Map();
for (const line of source.split(/\r?\n/)) {
  const match = line.match(/^\s*([^:=]+?)\s*[:=]\s*(.*?)\s*$/);
  if (match) fields.set(match[1].toLowerCase(), match[2]);
}

const required = {
  R2_ACCOUNT_ID: fields.get('account id'),
  R2_ACCESS_KEY_ID: fields.get('access key id'),
  R2_SECRET_ACCESS_KEY: fields.get('secret access key'),
  R2_ENDPOINT: fields.get('s3 api endpoint'),
  R2_BUCKET: process.env.R2_BUCKET || 'watermark',
};

const missing = Object.entries(required).filter(([, value]) => !value).map(([key]) => key);
if (missing.length > 0) throw new Error(`Missing required R2 fields: ${missing.join(', ')}`);

const envPath = path.join(process.cwd(), '.env.local');
let existing = '';
try {
  existing = await readFile(envPath, 'utf8');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const managedKeys = Object.keys(required);
const unmanagedLines = existing
  .split(/\r?\n/)
  .filter((line) => !managedKeys.some((key) => line.startsWith(`${key}=`)))
  .filter(Boolean);
const managedLines = managedKeys.map((key) => `${key}=${required[key]}`);

await writeFile(envPath, [...unmanagedLines, ...managedLines, ''].join('\n'), { encoding: 'utf8', mode: 0o600 });
process.stdout.write('R2 credentials imported securely into .env.local.\n');

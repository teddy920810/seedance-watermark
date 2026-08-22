import { existsSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';

interface PublicAssetOptions {
  root?: string;
  exists?: (path: string) => boolean;
}

export function publicAssetAvailable(value: string, options: PublicAssetOptions = {}): boolean {
  const asset = value.trim();
  if (!asset) return false;
  if (asset.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(asset)) return true;
  if (!asset.startsWith('/')) return false;

  const publicDirectory = resolve(options.root ?? process.cwd(), 'public');
  const assetPath = resolve(publicDirectory, `.${asset.split(/[?#]/, 1)[0]}`);
  const fromPublic = relative(publicDirectory, assetPath);
  if (fromPublic === '..' || fromPublic.startsWith(`..${sep}`) || isAbsolute(fromPublic)) return false;
  return (options.exists ?? existsSync)(assetPath);
}

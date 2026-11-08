import { getSecret } from 'astro:env/server';
import { R2ObjectStore } from '../r2/r2-object-store';
import { FalVideoProvider } from './fal-provider';
import { GenerationService } from './generation';

const required = ['FAL_KEY', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'BETTER_AUTH_SECRET', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_ENDPOINT'] as const;
export function generationReadiness() {
  const missing = required.filter((name) => {
    const value = getSecret(name)?.trim();
    return !value || value.includes('YOUR_ACCOUNT_ID');
  });
  const enabled = getSecret('FAL_LOCAL_GENERATION_ENABLED') === 'true';
  return { configured: missing.length === 0, enabled, missing };
}

let cached: GenerationService | undefined;
export function generationService() {
  if (!generationReadiness().configured) throw new Error('Generation configuration incomplete');
  return cached ??= new GenerationService(new R2ObjectStore({
    endpoint: getSecret('R2_ENDPOINT')!,
    accessKeyId: getSecret('R2_ACCESS_KEY_ID')!,
    secretAccessKey: getSecret('R2_SECRET_ACCESS_KEY')!,
    bucket: getSecret('R2_BUCKET') || 'watermark',
  }), new FalVideoProvider(getSecret('FAL_KEY')!));
}

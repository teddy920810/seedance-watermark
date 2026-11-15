import { getSecret } from 'astro:env/server';
import { R2ObjectStore } from '../r2/r2-object-store';
import { FalVideoProvider } from './fal-provider';
import { GenerationService, MODEL } from './generation';

import { isHostedPilot, isWithinPreviewBudget } from './preview-pilot';
import { VideoProviderError } from './errors';

const required = ['FAL_KEY', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'BETTER_AUTH_SECRET', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_ENDPOINT'] as const;
export function generationReadiness(hosted = false) {
  const missing = required.filter((name) => {
    const value = getSecret(name)?.trim();
    return !value || value.includes('YOUR_ACCOUNT_ID');
  });
  const enabled = hosted || getSecret('FAL_LOCAL_GENERATION_ENABLED') === 'true';
  return { configured: missing.length === 0, enabled, missing };
}

const cached = new Map<boolean, GenerationService>();

class BudgetedFalVideoProvider extends FalVideoProvider {
  constructor(private readonly pricingKey: string) { super(pricingKey); }

  override async submit(...args: Parameters<FalVideoProvider['submit']>) {
    const url = new URL('https://api.fal.ai/v1/models/pricing');
    url.searchParams.set('endpoint_id', MODEL);
    const response = await fetch(url, {
      headers: { Authorization: `Key ${this.pricingKey}` },
      redirect: 'error', signal: AbortSignal.timeout(10_000),
    }).catch(() => null);
    if (!response?.ok) throw new VideoProviderError('SERVICE_UNAVAILABLE');
    const body = await response.json().catch(() => null);
    const price = Array.isArray(body?.prices) ? body.prices.find((row: { endpoint_id?: unknown } | null) => row?.endpoint_id === MODEL) : null;
    if (!price || !isWithinPreviewBudget(price) || !isHostedPilot(process.env)) {
      throw new VideoProviderError('SERVICE_UNAVAILABLE');
    }
    return super.submit(...args);
  }
}
export function generationService(hosted = false) {
  if (!generationReadiness(hosted).configured) throw new Error('Generation configuration incomplete');
  const prior = cached.get(hosted);
  if (prior) return prior;
  const key = getSecret('FAL_KEY')!;
  const service = new GenerationService(new R2ObjectStore({
    endpoint: getSecret('R2_ENDPOINT')!,
    accessKeyId: getSecret('R2_ACCESS_KEY_ID')!,
    secretAccessKey: getSecret('R2_SECRET_ACCESS_KEY')!,
    bucket: getSecret('R2_BUCKET') || 'watermark',
  }), hosted ? new BudgetedFalVideoProvider(key) : new FalVideoProvider(key),
  hosted ? { key: 'jobs/fal-preview-one-clip-v1.json', atomic: true } : undefined);
  cached.set(hosted, service);
  return service;
}

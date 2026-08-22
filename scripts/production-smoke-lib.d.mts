export interface SmokeResult {
  status: 'passed' | 'skipped';
  reason?: string;
}

export interface PublicSmokeOptions {
  baseUrl: string;
  fetcher?: typeof fetch;
}

export interface AuthenticatedSmokeOptions extends PublicSmokeOptions {
  sessionCookie: string;
  sleep?: (ms: number) => Promise<void>;
}

export function runPublicSmoke(options: PublicSmokeOptions): Promise<SmokeResult>;
export function runAuthenticatedSmoke(options: AuthenticatedSmokeOptions): Promise<SmokeResult>;

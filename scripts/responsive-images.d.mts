export interface ResponsiveImageManifest {
  version: number;
  images: Record<string, {
    width: number;
    height: number;
    variants: Array<{ src: string; width: number }>;
  }>;
}

export function isOptimizableUpload(src: string): boolean;
export function generateResponsiveImages(options?: {
  publicDirectory?: string;
  widths?: number[];
}): Promise<{ manifest: ResponsiveImageManifest; sourceCount: number; variantCount: number }>;
export function auditResponsiveHtml(
  html: string,
  manifest: ResponsiveImageManifest,
  fileName: string,
): { references: number; issues: string[] };
export function verifyResponsiveBuild(options?: {
  rootDirectory?: string;
  manifestPath?: string;
}): Promise<{ htmlCount: number; references: number; outputDirectory: string }>;

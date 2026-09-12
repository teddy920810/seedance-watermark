export function importBlogHtml(html: string, publishedAt: string): {
  metadata: Record<string, string | boolean | undefined>;
  body: string;
  bodyText: string;
  images: Array<{ source: string; target: string; alt: string; role: string }>;
  sourceSha256: string;
  markdown: string;
};

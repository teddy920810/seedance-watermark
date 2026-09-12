export function importBlogHtml(html: string, publishedAt: string): {
  metadata: Record<string, string | boolean | undefined>;
  body: string;
  bodyText: string;
  sourceSha256: string;
  markdown: string;
};

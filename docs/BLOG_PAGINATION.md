# Blog pagination

The blog index now uses `postsPerPage` as a real page size. Its value and the
Pages CMS default are 10. Featured-first, newest-first sorting and draft exclusion
are unchanged. The shared listing component renders at most ten article cards
per page, article counts, page numbers and Previous/Next links.

- Page 1: `/blog`
- Further pages: `/blog/page/2`, `/blog/page/3`, etc.
- Each page has its own canonical URL, CollectionPage URL and page-specific title.
- Listing URLs are statically generated and added to the sitemap; article URLs
  and article bodies are unchanged. Unknown page URLs return 404.
- Pagination works without client JavaScript and supports keyboard/mobile use.

For the current 31 published articles, page sizes are 10, 10, 10 and 1. When
published content changes, the next build regenerates the required listing pages.

## Verification

Unit tests cover 10/11/20/31-post boundaries, complete ordered coverage, empty
content and sitemap pagination with drafts excluded. Browser tests visit every
listing page, check exact article order without duplicate links, canonical URLs,
mobile navigation, page boundaries, unknown URLs and sitemap links. Run
`PLAYWRIGHT_BROWSERS_PATH=.tools/playwright-browsers npm run verify` before handoff.

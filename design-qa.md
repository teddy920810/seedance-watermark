# Design QA — Static handoff implementation

## Comparison target

- Source visual truth: `E:/xwechat_files/sy236577346_7b05/msg/file/2026-08/seedances-static-handoff/static-delivery`
- Source captures: `output/design-qa/reference-home.png`, `reference-seedance-video-upscale.png`, `reference-seedance-ai-generated.png`, `reference-seedance-watermark-remover.png`
- Implementation captures: matching `output/design-qa/prototype-*.png` files
- Side-by-side evidence: matching `output/design-qa/compare-*.png` files, with source on the left and implementation on the right
- Desktop viewport: 1280 × 720 CSS px, device scale factor 1; scrollbar-excluded screenshots are 1265 px wide
- Mobile viewport: 390 × 844 CSS px, device scale factor 1; scrollbar-excluded screenshots are 375 px wide
- State: signed out, initial workspace state; prompt workspace additionally tested after entering a prompt and activating its preview action

## Full-view comparison

All four desktop pages use the same source assets, Geist font, copy, section order, dark/paper/lime/violet palette, grid structure, header, and footer as the handoff. Final full-page heights are:

| Route | Source | Implementation | Difference |
| --- | ---: | ---: | ---: |
| Home | 4066 px | 4100 px | +34 px |
| Video upscale | 4341 px | 4330 px | -11 px |
| AI generated video | 4380 px | 4376 px | -4 px |
| Watermark remover | 4367 px | 4330 px | -37 px |

No desktop horizontal overflow or browser console warning/error was observed on the three tool routes.

## Focused comparisons

- Hero/header: `output/design-qa/focus-hero-seedance-video-upscale.png` compares the source and implementation at the same desktop viewport.
- Mobile showcase: `output/design-qa/focus-mobile-showcase-comparison.png` compares the visible mobile results section after scrolling it into view. This focused capture confirms that the source assets, crops, comparison split, labels, and generated WebP rendering are present; the browser's full-page compositor did not paint offscreen responsive pictures in the mobile full-page capture.
- Responsive image evidence: all eight before/after image elements completed with a non-zero natural width and selected `/generated/*-640.webp` as `currentSrc`, while their `img src` remains the original `/uploads/*.png` fallback.

## Required fidelity surfaces

- Fonts and typography: Geist is used throughout. Display hierarchy, italic lime emphasis, body scale, tracking, and weights match the source. A small mobile heading wrap difference remains within the same hierarchy.
- Spacing and layout rhythm: desktop section heights differ by less than 1%; grids, gutters, card spacing, CTA and footer rhythm match. Mobile stacks in the same order without horizontal overflow.
- Colors and tokens: ink, paper, lime, violet, muted copy, borders, and gradients match the source CSS tokens.
- Image quality and asset fidelity: every visible handoff image and logo is reused directly; no placeholder, generated substitute, custom SVG illustration, or CSS-art replacement was introduced. Responsive WebP is selected in the browser with the original raster retained as fallback.
- Copy and content: Home and all three operations tool pages use the handoff's visible copy. Workspace, steps, showcase, feature cards, and CTA are page-owned CMS data.
- Interaction and accessibility: prompt input enables the CTA and exposes the honest not-connected status after activation. Upload previews stay local. Keyboard semantics, labels, focusable controls, alt text, and color contrast are retained. The mobile header keeps a menu button so navigation remains usable, an intentional usability addition to the static handoff.

## Comparison history

1. P2 — Header occupied document flow and shifted every marketing hero down by 80 px.
   - Fix: changed the marketing header to the source's absolute overlay position.
   - Post-fix evidence: desktop page-height differences reduced to 4–37 px and the hero/header focused comparison aligns.
2. P2 — Mobile full-page screenshot showed unpainted offscreen responsive pictures.
   - Fix/check: matched the source's eager showcase loading and captured a scrolled, visible focused comparison. Browser inspection confirms every result image is complete and uses generated WebP.
   - Post-fix evidence: `focus-mobile-showcase-comparison.png` and the recorded `/generated/*-640.webp` current sources.

## Findings

- P3 — The upscale showcase heading wraps to three lines rather than two at the narrow mobile viewport. This does not change order, readability, or interaction and contributes to the remaining 192 px full-page height difference.
- P3 — The implementation shows a mobile navigation menu button that is absent from the static source. It is retained intentionally so all tool routes remain reachable by keyboard and touch.

## Implementation checklist

- [x] Source and implementation opened and captured at matched desktop and mobile viewports
- [x] Full-page and focused side-by-side comparisons reviewed
- [x] Typography, spacing, colors, imagery, copy, interactions, responsiveness, and accessibility checked
- [x] P2 header offset corrected and recaptured
- [x] Responsive images checked in a scrolled visible state and by browser `currentSrc`
- [x] Console errors checked on all three tool routes

final result: passed

---

# Design QA — Blog detail static handoff

## Comparison target

- Source visual truth: `E:/xwechat_files/sy236577346_7b05/msg/file/2026-08/seedances-blog-static-html-2026-08-29/seedances-blog-static-html/blog/ai-cartoon-avatar-seedance-2-0/index.html`
- Source captures: `output/design-qa/reference-blog-ai-cartoon-avatar.jpg` and `reference-blog-ai-cartoon-avatar-mobile.jpg`
- Implementation captures: `output/design-qa/prototype-blog-ai-cartoon-avatar.jpg` and `prototype-blog-ai-cartoon-avatar-mobile.jpg`
- Focused hero captures: `output/design-qa/focus-blog-hero-source.jpg` and `focus-blog-hero-prototype.jpg`
- Desktop viewport: 1280 × 720 CSS px at device scale factor 1; captures are 1265 px wide after the browser scrollbar.
- Mobile viewport: 390 × 844 CSS px at device scale factor 1; captures are 375 px wide after the browser scrollbar.
- State: signed out, article loaded, hero and rich-content states visible.

## Full-view comparison

| View | Source | Implementation | Difference |
| --- | ---: | ---: | ---: |
| Desktop full page | 10252 px | 10205 px | -47 px |
| Mobile full page | 14099 px | 14096 px | -3 px |

The final captures align the dark hero, two-column cover treatment, breadcrumb, sticky contents column, 760 px article track, rich text hierarchy, prompt rows, table, violet CTA, and footer. There is no page-level horizontal overflow at 390 px; the wide table scrolls within its own 335 px container.

## Focused comparison

The focused hero pair checks the system Inter stack, 1180 px hero grid, title wrapping, lime eyebrow, muted description, byline mark, metadata, share controls, 4:3 cover crop, border radius, and caption. The source image, logo, and editorial mark are reused as real assets. The prompt module was also compared in-browser at the same desktop viewport; its 118 px label track, row dividers, lime labels, panel color, radius, and wrapping match the handoff.

## Required fidelity surfaces

- Fonts and typography: the Blog route uses the source `Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` stack. Desktop and mobile title wrapping now matches the source; heading, body, metadata, label, and CTA weights retain the same hierarchy.
- Spacing and layout rhythm: final full-page height differs by under 0.5% on desktop and under 0.1% on mobile. Hero, grid, article, prompt rows, table, CTA, and footer align without overlap or clipping.
- Colors and tokens: `#10110f`, `#171815`, `#f3f1e9`, `#b7b9b1`, `#7861ee`, and `#d8ff62` map directly to the handoff. The hero description and eyebrow specificity were checked in the browser.
- Image quality and asset fidelity: the article cover is the existing identical source image; the real logo and editorial mark are used. No placeholder, CSS drawing, emoji, or substitute illustration was introduced.
- Copy and content: every Markdown article body remains unchanged. Current CMS title, category, author, dates, and read time intentionally remain the project's operational values rather than overwriting them with the static example.
- Interaction and accessibility: X, LinkedIn, and Facebook links open in a new tab with safe `rel` values; Copy link changes to `Copied`. Breadcrumbs and TOC links are semantic, cover alt text is preserved, mobile has no document overflow, and the existing mobile menu remains keyboard/touch accessible.
- Browser and console: the implementation was rendered and interacted with in the selected in-app browser. The targeted UI browser suite passed; no user-visible runtime error was observed in the manual article flow.

## Comparison history

1. P2 — The legacy `.blog-hero` rule constrained the new hero to 840 px, producing an over-tall title and 1339 px hero.
   - Fix: reset the Blog detail hero width/margin and restore the 1180 px two-column source grid.
   - Post-fix evidence: final desktop hero height and composition align with the source; full-page height differs by 47 px.
2. P2 — Shiki retained the prompt as a generic code block instead of the source's labeled rows.
   - Fix: exclude plain-text prompts from highlighting and convert fully labeled prompt blocks into shared semantic row markup without changing words.
   - Post-fix evidence: seven prompt rows render with source label/value tracks and no generic `pre` on the representative article.
3. P2 — The 560 px Markdown table widened the entire 390 px page.
   - Fix: contain wide table tracks in a local horizontal scroller and add browser coverage for document width.
   - Post-fix evidence: document width is 375 px, table client width is 335 px, and table scroll width is 560 px.
4. P2 — The project-wide Geist font and a higher-specificity legacy paragraph color changed mobile title wrapping and made the hero description too dark.
   - Fix: apply the source system Inter stack to Blog detail pages and raise the Blog description/eyebrow selectors to source token specificity.
   - Post-fix evidence: the mobile title uses the same four-line wrap as the source and the full mobile height differs by 3 px.

## Findings

- P3 — The implementation retains the shared mobile navigation menu button absent from the static mock so site navigation remains available by touch and keyboard.
- P3 — The generated TOC uses complete current H2 labels instead of the static mock's abbreviated labels. This preserves article text and keeps future CMS articles automatic.
- Expected content variance — author, category, publication date, read time, and eyebrow use current CMS values. The user explicitly requested Blog copy remain unchanged.

## Implementation checklist

- [x] Desktop and mobile full-page source/implementation captures compared at matched viewport and density
- [x] Focused hero and prompt regions reviewed
- [x] Typography, layout, colors, images, copy, interactions, responsiveness, and accessibility checked
- [x] Social links and Copy link behavior exercised
- [x] Mobile page overflow removed while keeping table scrolling available
- [x] Current Blog Markdown files kept unchanged

final result: passed

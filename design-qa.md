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

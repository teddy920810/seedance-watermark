# First editorial batch: 01 and 02

This resumes the originally scheduled September 12 batch after the publisher
authorized compatible security dependency fixes. The actual publication date is
September 13, 2026 (Asia/Shanghai). These are two Blog posts, not new page templates.

| Source | Blog slug | Source HTML SHA256 | Body characters excluding whitespace |
| --- | --- | --- | --- |
| 01-seedance-prompts-static-html.zip | seedance-prompts | 0b3f28520442de4400a938641272c6005cdac1ac75ba4771949893d094c78a2a | 8875 |
| 02-how-to-use-seedance-static-html.zip | how-to-use-seedance | 1fa2875a546f3241c06289e537b348aeeba7313fc004cd4d7464eeab6712a910 | 8215 |

Source article text and CTA explanation match rendered Markdown character-for-character
after whitespace normalization. Editorial wording, punctuation, editing notes and
claims were not corrected. Headings, summaries and CTA labels were extracted into
existing Pages CMS fields. Original media, existing articles, landing-page/settings
content, Mock Provider, API handlers, OAuth, domains and credentials are unchanged.

## Security repair boundary

The baseline lockfile failed `npm audit --audit-level=high` with eight dependency
alerts (one critical, four high, three moderate). The repair updates affected packages
within their existing major versions and aligns their required peers:

- Astro 7.2.8 with markdown-remark 7.2.4 and Sharp 0.35.4.
- Vitest and its coverage/mocking packages 4.1.11.
- Patched fast-uri, js-yaml and SVGO versions in the lockfile.
- Node minimum 22.19.0, required by the updated transitive Undici dependency.

Upstream references:

- https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2
- https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c
- Remaining advisory IDs are available in the baseline npm audit output.

Sharp is used to decode repository CMS uploads during image generation. Authentication
is checked inside upload/job handlers, and the Mock Provider only copies objects.
This release removes vulnerable dependency versions; it does not claim a demonstrated
production exploit or perform destructive exploit testing. Legitimate image handling,
content rendering, authenticated route guards and ownership tests must remain green.

## Verification and release record

- Eight new lockfile-floor assertions failed before dependency updates and passed after.
- Three importer regressions pass, including literal punctuation and Applications as a Blog category.
- Fresh `npm ci` and npm audit pass; audit reports zero vulnerabilities.
- A fresh independent read-only review found no concrete surviving dependency finding
  or compatibility regression; native Linux execution remains a CI gate.
- Desktop/mobile manual checks cover both new routes and all table-of-contents targets.
- Final full release gate, GitHub checks, merge SHA and Vercel production evidence are
  recorded in the associated PR/current Codex task. Files or a commit alone do not
  mark this batch published; require production success before advancing the queue.
- Authenticated R2 writes, OAuth sign-in and real provider processing are excluded.

Local reproducibility: use Node >=22.19.0, then `npm ci`, `npm audit --audit-level=high`
and `npm run release:verify`. npm 10.9.2's update resolver failed with an internal
`edgesOut` error; temporary npm 11.6.0 resolved the lock without disabling peers.
No global Node/npm installation or security gate was changed.

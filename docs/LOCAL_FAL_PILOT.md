# Local fal video-generation pilot

The public page previews video settings and validates prompts in the browser.
Paid submission and task lookup are available only in the local pilot.

## Model and budget

- Endpoint: `fal-ai/bytedance/seedance/v1.5/pro/text-to-video`.
- Default input settings: 16:9, 480p, 5 seconds, audio off. Safety checker is always on.
- Dropdowns support 4–12 seconds (whole seconds), 480p/720p/1080p, audio off/on, and 16:9/4:3/1:1/9:16/3:4/21:9/auto. These enums are the model's documented schema, checked 2026-11-08; no different model is selected.
- The first row shows Aspect ratio then Resolution. Duration and Audio are inside a keyboard-accessible native disclosure (Duration & audio), collapsed initially to keep the hero panel compact. Collapsing keeps selected values; returning from an invalid-settings dialog automatically expands it before focusing Duration.
- Settings are validated server-side, sent in the one-shot fal request, stored with the task and returned in status responses. Old tasks without settings use the previous fixed defaults. Changing settings clears the paid-request consent; submitted tasks lock the controls. Draft settings survive refresh.
- For a saved task, Edit draft (also offered in task dialogs) unlocks prompt/settings without signing in or clearing the receipt/quota. The task's submitted settings remain separately visible. Draft-edit mode persists for that task; status responses never overwrite an edited draft, and task lookup failures stay inline in this mode. Another generation remains locked while the saved task is present.
- Higher resolution, longer duration and audio may cost more. There is no fixed-price or dollar-cap guarantee. The earlier USD 1 real-test authorization remains limited to one short default-settings video; configurable settings are verified with mocks only.
- One submission per local test slot in private R2 (`jobs/fal-local-test.json`).
- The UI asks the operator to acknowledge that the prompt is sent to fal and uses paid credits.
- Provider prices are external and can change; verify the price before enabling.
- The slot is a local test safeguard, not a dollar-denominated billing cap. R2 lifecycle deletion can clear it. Do not reset it or run parallel local checkouts during a budgeted test.
- Ambiguous submissions are not retried automatically. Check fal request history first.

## Configuration

Use the ignored `.env.local` file:

- `FAL_KEY`: the user's fal API key.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_SECRET`: existing authentication configuration. The auth secret must be at least 32 bytes.
- `BETTER_AUTH_URL=http://localhost:4321`: open this same origin when testing Google login.
- Register `http://localhost:4321/api/auth/callback/google` in the Google OAuth client's authorized redirect URIs.
- `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET`: existing private object storage.
- After confirming budget and readiness, add `FAL_LOCAL_GENERATION_ENABLED=true`.

No credentials belong in client components or Git. Readiness returns variable names only.
Do not replace production OAuth or R2 configuration. Add the local OAuth callback if needed.

## Verification

1. Stop any other Astro dev server from this checkout before building or testing.
2. Run `PLAYWRIGHT_BROWSERS_PATH=.tools/playwright-browsers npm run verify`.
3. Automated tests mock generation and use no paid fal requests.
4. Start `npm run dev -- --host 127.0.0.1 --port 4321`.
5. Open `http://localhost:4321/seedance-ai-generated`, sign in, enter a test prompt,
   acknowledge the paid request, and submit once.
6. Refresh and confirm the same task is restored. Check queue state and playback/download.
7. Confirm actual usage in fal. Disable `FAL_LOCAL_GENERATION_ENABLED` after testing.

The result is copied to private R2 before signed preview/download links are shown.
R2's existing one-day lifecycle applies; links last ten minutes. Status refresh renews
links while the stored result still exists. Generation remains server-side and the
API explicitly rejects production mode and non-loopback hosts. Production rollout
requires separate quota, billing, retention, webhook and end-user-access design.

## Vendor contracts

- https://fal.ai/models/fal-ai/bytedance/seedance/v1.5/pro/text-to-video/api
- https://fal.ai/models/fal-ai/bytedance/seedance/v1.5/pro/text-to-video
- https://fal.ai/docs/documentation/model-apis/inference/queue
- https://fal.ai/docs/documentation/model-apis/inference/client-setup

The billable submission uses the documented REST POST once (no client retry).
Read-only status and result retrieval use the official SDK queue operations.
No vendor installation snippet is rewritten.

## Exception dialogs

The video workspace uses a native modal dialog with keyboard dismissal, focus
containment, an accessible title/description, and a persistent inline error after
dismissal. Stable public codes select safe English copy:

- `PROMPT_REQUIRED` / `PROMPT_TOO_LONG`: clicking Generate with an empty/whitespace-only prompt or more than 2,000 characters opens a validation dialog before allocating a task ID or sending a request. The full draft is kept; Edit prompt, Close, and Escape return focus to the input. The character counter and server validation use the same 2,000-character limit (JavaScript string length, including whitespace). Overlong paste is preserved rather than silently truncated.
- `INVALID_OPTIONS`: unsupported or malformed settings are rejected before the generation service is called. The dialog allows returning to the settings controls.

- `LOGIN_REQUIRED`: preserve the prompt and existing task; offer the existing Google sign-in flow. A pre-submit 401 removes only the unsubmitted receipt.
- `SUBMISSION_UNKNOWN`: keep the task ID and offer status lookup; never automatically submit again. Older failed receipts without a provider request ID are treated as unknown.
- `SERVICE_UNAVAILABLE`: hide provider credentials/balance details; allow status lookup for an existing task.
- `CONTENT_RESTRICTED`: shown only for fal's typed `content_policy_violation`, not arbitrary 422 errors or message text.
- `GENERATION_FAILED`: retain the task ID and offer copying it for support.
- `LINK_EXPIRED`: intercept an expired download link and refresh the existing task's signed links; no new generation. A player error alone is not considered proof of expiry.

The server supplies `linksExpireAt` for ten-minute signed links. Refresh errors
remain visible (including a new sign-in prompt if the session expired). Refreshing
a link does not restore a result already removed by R2 retention. The one-test
slot remains reserved after failures; dismissing a dialog does not reset it or
promise a refund. Browser drafts/receipts contain no credentials.

Typed fal error contract checked 2026-11-08:
https://fal.ai/docs/documentation/model-apis/errors

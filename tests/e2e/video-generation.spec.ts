import { expect, test } from '@playwright/test';
const id = '00000000-0000-4000-8000-000000000001';

test('an expired session allows draft editing while retaining and protecting the old task', async ({ page }) => {
  let submissions = 0;
  await page.addInitScript((savedId) => localStorage.setItem('seedances-fal-local-task', JSON.stringify({ id: savedId, prompt: 'Old task prompt' })), id);
  await page.route('**/api/video', (route) => {
    if (route.request().method() === 'POST') submissions++;
    return route.fulfill({ json: { configured: true, enabled: true, missing: [] } });
  });
  await page.route('**/api/video/*', (route) => route.fulfill({ status: 401, json: { code: 'LOGIN_REQUIRED' } }));
  await page.goto('/seedance-ai-generated');
  const dialog = page.getByRole('dialog', { name: 'Sign in required' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Edit draft' }).click();
  await expect(dialog).not.toBeVisible();
  await page.getByLabel('Describe your video').fill('My new draft');
  await page.getByLabel('Aspect ratio', { exact: true }).selectOption('4:3');
  await page.getByRole('button', { name: 'Check task status' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByLabel('Describe your video')).toHaveValue('My new draft');
  await expect(page.getByRole('button', { name: 'Generate video' })).toBeDisabled();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('seedances-fal-local-task')!).id)).toBe(id);
  expect(submissions).toBe(0);
  await page.route('**/api/video/*', (route) => route.fulfill({ json: { id, status: 'running', options: { duration: '5', resolution: '480p', aspectRatio: '16:9', generateAudio: false } } }));
  await page.getByRole('button', { name: 'Check task status' }).click();
  await expect(page.getByLabel('Aspect ratio', { exact: true })).toHaveValue('4:3');
  await expect(page.getByText(/Submitted settings: 5 sec · 480p · 16:9 · No audio/)).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Describe your video')).toHaveValue('My new draft');
  await expect(page.getByLabel('Aspect ratio', { exact: true })).toHaveValue('4:3');
  await expect(page.getByLabel('Aspect ratio', { exact: true })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Generate video' })).toBeDisabled();
});

test('video settings retain defaults, persist selections and submit the selected settings once', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const options = { duration: '12', resolution: '1080p', aspectRatio: '4:3', generateAudio: true };
  let submissions = 0;
  await page.route('**/api/video', async (route) => {
    if (route.request().method() === 'POST') {
      submissions++;
      expect(route.request().postDataJSON().options).toEqual(options);
      await route.fulfill({ status: 201, json: { id, status: 'queued', options } });
    } else await route.fulfill({ json: { configured: true, enabled: true, missing: [] } });
  });
  await page.route('**/api/video/*', (route) => route.fulfill({ json: { id, status: 'running', options } }));
  await page.goto('/seedance-ai-generated');
  await expect(page.getByLabel('Duration', { exact: true })).toHaveValue('5');
  await expect(page.getByLabel('Duration', { exact: true })).toBeHidden();
  await expect(page.getByLabel('Audio', { exact: true })).toBeHidden();
  const aspectBounds = await page.getByLabel('Aspect ratio', { exact: true }).boundingBox();
  const resolutionBounds = await page.getByLabel('Resolution', { exact: true }).boundingBox();
  expect(aspectBounds!.x).toBeLessThan(resolutionBounds!.x);
  expect(Math.abs(aspectBounds!.y - resolutionBounds!.y)).toBeLessThan(2);
  await expect(page.getByLabel('Resolution', { exact: true })).toHaveValue('480p');
  await expect(page.getByLabel('Aspect ratio', { exact: true })).toHaveValue('16:9');
  await expect(page.getByLabel('Audio', { exact: true })).toHaveValue('false');
  await expect(page.getByLabel('Duration', { exact: true }).locator('option')).toHaveCount(9);
  await expect(page.getByLabel('Aspect ratio', { exact: true }).locator('option')).toHaveCount(7);
  await page.getByText('Duration & audio', { exact: true }).click();
  await expect(page.getByLabel('Duration', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Audio', { exact: true })).toBeVisible();
  await page.getByLabel('Duration', { exact: true }).selectOption('12');
  await page.getByLabel('Resolution', { exact: true }).selectOption('1080p');
  await page.getByLabel('Aspect ratio', { exact: true }).selectOption('4:3');
  await page.getByLabel('Audio', { exact: true }).selectOption('true');
  await page.reload();
  await expect(page.getByLabel('Duration', { exact: true })).toBeHidden();
  await expect(page.getByLabel('Duration', { exact: true })).toHaveValue('12');
  await expect(page.getByLabel('Resolution', { exact: true })).toHaveValue('1080p');
  await expect(page.getByLabel('Audio', { exact: true })).toHaveValue('true');
  await page.getByLabel('Describe your video').fill('A cat');
  await page.getByLabel(/I understand this uses paid fal credits/).check();
  await page.getByLabel('Aspect ratio', { exact: true }).selectOption('1:1');
  await expect(page.getByLabel(/I understand this uses paid fal credits/)).not.toBeChecked();
  await page.getByLabel('Aspect ratio', { exact: true }).selectOption('4:3');
  await page.screenshot({ path: 'test-results/video-settings-mobile.png' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByRole('group', { name: 'Video settings' }).screenshot({ path: 'test-results/video-settings-desktop.png' });
  await page.getByLabel(/I understand this uses paid fal credits/).check();
  await page.getByRole('button', { name: 'Generate video' }).click();
  await expect(page.getByLabel('Duration', { exact: true })).toBeDisabled();
  await page.reload();
  await expect(page.getByLabel('Aspect ratio', { exact: true })).toHaveValue('4:3');
  await expect(page.getByLabel('Aspect ratio', { exact: true })).toBeDisabled();
  expect(submissions).toBe(1);
});

test('server-rejected settings keep the draft and return focus to settings', async ({ page }) => {
  await page.route('**/api/video', (route) => route.fulfill(route.request().method() === 'POST'
    ? { status: 400, json: { code: 'INVALID_OPTIONS' } }
    : { json: { configured: true, enabled: true, missing: [] } }));
  await page.goto('/seedance-ai-generated');
  await page.getByLabel('Describe your video').fill('My cat');
  await page.getByText('Duration & audio', { exact: true }).click();
  await page.getByLabel('Duration', { exact: true }).selectOption('6');
  await page.getByText('Duration & audio', { exact: true }).click();
  await page.getByLabel(/I understand this uses paid fal credits/).check();
  await page.getByRole('button', { name: 'Generate video' }).click();
  await expect(page.getByRole('dialog', { name: 'Check video settings' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit settings' }).click();
  await expect(page.getByLabel('Duration', { exact: true })).toBeFocused();
  await expect(page.getByLabel('Duration', { exact: true })).toHaveValue('6');
  await expect(page.getByLabel('Describe your video')).toHaveValue('My cat');
  expect(await page.evaluate(() => localStorage.getItem('seedances-fal-local-task'))).toBeNull();
});

test.beforeEach(async ({ page }) => {
  // The development-only toolbar can cover the consent checkbox after scrolling.
  // Exercise the actual product controls without that overlay intercepting clicks.
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style');
      style.textContent = 'astro-dev-toolbar { display: none !important; }';
      document.head.append(style);
    });
  });
});

for (const [prompt, title] of [
  ['', 'Prompt required'],
  ['   ', 'Prompt required'],
  ['x'.repeat(2001), 'Prompt too long'],
] as const) {
  test(`invalid prompt (${prompt.length} characters) opens ${title} without submitting`, async ({ page }) => {
    let submissions = 0;
    await page.route('**/api/video', (route) => {
      if (route.request().method() === 'POST') {
        submissions++;
        return route.fulfill({ status: 201, json: { id: route.request().postDataJSON().id, status: 'queued' } });
      }
      return route.fulfill({ json: { configured: true, enabled: true, missing: [] } });
    });
    await page.goto('/seedance-ai-generated');
    const input = page.getByLabel('Describe your video');
    await input.fill(prompt);
    await page.getByLabel(/I understand this uses paid fal credits/).check();
    await page.getByRole('button', { name: 'Generate video' }).click();
    const dialog = page.getByRole('dialog', { name: title });
    await expect(dialog).toBeVisible();
    if (prompt === '') await dialog.getByRole('button', { name: 'Edit prompt' }).click();
    else if (!prompt.trim()) await page.keyboard.press('Escape');
    else await dialog.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(input).toBeFocused();
    await expect(input).toHaveValue(prompt);
    expect(submissions).toBe(0);
    expect(await page.evaluate(() => localStorage.getItem('seedances-fal-local-task'))).toBeNull();
    await input.fill(prompt.length > 2000 ? 'x'.repeat(2000) : 'A cat');
    await page.getByRole('button', { name: 'Generate video' }).click();
    await expect.poll(() => submissions).toBe(1);
  });
}

test('local setup reports missing configuration and cannot submit a paid request', async ({ page }) => {
  let submissions = 0;
  await page.route('**/api/video', async (route) => {
    if (route.request().method() === 'POST') submissions++;
    await route.fulfill({ json: { configured: false, enabled: false, missing: ['R2_ENDPOINT'] } });
  });
  await page.goto('/seedance-ai-generated');
  await page.getByLabel('Describe your video').fill('A cat walking through a garden');
  await expect(page.getByRole('button', { name: 'Generate video' })).toBeDisabled();
  await expect(page.getByText(/Local setup needed/)).toBeVisible();
  expect(submissions).toBe(0);
});

test('submits once, restores the task after refresh and exposes private result links', async ({ page }) => {
  let submissions = 0;
  let submittedId = '';
  let complete = false;
  await page.route('**/api/video', async (route) => {
    if (route.request().method() === 'POST') {
      submissions++;
      submittedId = route.request().postDataJSON().id;
      await route.fulfill({ status: 201, json: { id: submittedId, status: 'queued' } });
    } else await route.fulfill({ json: { configured: true, enabled: true, missing: [] } });
  });
  await page.route('**/api/video/*', async (route) => route.fulfill({ json: {
    id: submittedId, status: complete ? 'completed' : 'running',
    ...(complete ? { videoUrl: '/fixture-video.mp4', downloadUrl: '/fixture-download.mp4' } : {}),
  } }));
  await page.goto('/seedance-ai-generated');
  await expect(page.getByText('Seedance 1.5 Pro', { exact: true })).toBeVisible();
  await page.getByLabel('Describe your video').fill('A cat walking through a garden');
  await expect(page.getByRole('button', { name: 'Generate video' })).toBeDisabled();
  await page.getByLabel(/I understand this uses paid fal credits/).check();
  await page.getByRole('button', { name: 'Generate video' }).click();
  await expect(page.getByRole('button', { name: 'Generate video' })).toBeDisabled();
  await page.reload();
  complete = true;
  await expect(page.locator('video')).toHaveAttribute('src', '/fixture-video.mp4', { timeout: 15_000 });
  await expect(page.getByRole('link', { name: 'Download video' })).toHaveAttribute('href', '/fixture-download.mp4');
  expect(submissions).toBe(1);
});

test('a submission failure keeps the same task ID instead of automatically resubmitting', async ({ page }) => {
  let submissions = 0;
  await page.route('**/api/video', async (route) => {
    if (route.request().method() === 'POST') {
      submissions++;
      await route.fulfill({ status: 503, json: { error: 'Check fal history before retrying.' } });
    } else await route.fulfill({ json: { configured: true, enabled: true, missing: [] } });
  });
  await page.goto('/seedance-ai-generated');
  await page.getByLabel('Describe your video').fill('A cat');
  await page.getByLabel(/I understand this uses paid fal credits/).check();
  await page.getByRole('button', { name: 'Generate video' }).click();
  await expect(page.getByRole('alert')).toContainText('Check fal history');
  expect(submissions).toBe(1);
  expect(await page.evaluate(() => Boolean(localStorage.getItem('seedances-fal-local-task')))).toBe(true);
});

test('status endpoint requires authentication without querying fal', async ({ request }) => {
  const response = await request.get(`/api/video/${id}`);
  expect(response.status()).toBe(401);
});

test('a sign-in rejection allows retry without leaving an ambiguous task receipt', async ({ page }) => {
  await page.route('**/api/video', async (route) => {
    if (route.request().method() === 'POST') await route.fulfill({ status: 401, json: { error: 'Sign in with Google before generating a video.' } });
    else await route.fulfill({ json: { configured: true, enabled: true, missing: [] } });
  });
  await page.goto('/seedance-ai-generated');
  await page.getByLabel('Describe your video').fill('A cat');
  await page.getByLabel(/I understand this uses paid fal credits/).check();
  await page.getByRole('button', { name: 'Generate video' }).click();
  await expect(page.getByRole('alert')).toContainText('Sign in with Google');
  await expect(page.getByRole('button', { name: 'Generate video' })).toBeEnabled();
  expect(await page.evaluate(() => localStorage.getItem('seedances-fal-local-task'))).toBeNull();
});

for (const [code, title] of [
  ['SUBMISSION_UNKNOWN', 'Submission status unknown'],
  ['SERVICE_UNAVAILABLE', 'Service temporarily unavailable'],
  ['CONTENT_RESTRICTED', 'Please revise your prompt'],
  ['GENERATION_FAILED', 'Generation failed'],
] as const) {
  test(`${code} opens a dismissible dialog and never resubmits`, async ({ page }) => {
    if (code === 'CONTENT_RESTRICTED') await page.setViewportSize({ width: 390, height: 844 });
    let submissions = 0;
    await page.route('**/api/video', async (route) => {
      if (route.request().method() === 'POST') {
        submissions++;
        await route.fulfill({ status: 201, json: { id, status: 'failed', errorCode: code } });
      } else await route.fulfill({ json: { configured: true, enabled: true, missing: [] } });
    });
    await page.goto('/seedance-ai-generated');
    await page.getByLabel('Describe your video').fill('A cat');
    await page.getByLabel(/I understand this uses paid fal credits/).check();
    await page.getByRole('button', { name: 'Generate video' }).click();
    const dialog = page.getByRole('dialog', { name: title });
    await expect(dialog).toBeVisible();
    const bounds = await dialog.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(Math.abs(bounds!.x + bounds!.width / 2 - page.viewportSize()!.width / 2)).toBeLessThan(2);
    if (code === 'CONTENT_RESTRICTED') await page.screenshot({ path: 'test-results/video-dialog-mobile.png' });
    await dialog.getByRole('button', { name: 'Close', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate video' })).toBeDisabled();
    expect(submissions).toBe(1);
  });
}

test('expired login preserves the prompt and offers sign in without another paid request', async ({ page }) => {
  await page.route('**/api/video', async (route) => route.fulfill(route.request().method() === 'POST'
    ? { status: 401, json: { error: 'Sign in with Google', code: 'LOGIN_REQUIRED' } }
    : { json: { configured: true, enabled: true, missing: [] } }));
  await page.goto('/seedance-ai-generated');
  await page.getByLabel('Describe your video').fill('My saved cat prompt');
  await page.getByLabel(/I understand this uses paid fal credits/).check();
  await page.getByRole('button', { name: 'Generate video' }).click();
  await expect(page.getByRole('dialog', { name: 'Sign in required' })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Describe your video')).toHaveValue('My saved cat prompt');
});

test('expired download refreshes signed links without submitting another video', async ({ page }) => {
  let reads = 0;
  await page.addInitScript((savedId) => localStorage.setItem('seedances-fal-local-task', JSON.stringify({ id: savedId, prompt: 'cat' })), id);
  await page.route('**/api/video', (route) => route.fulfill({ json: { configured: true, enabled: true, missing: [] } }));
  await page.route('**/api/video/*', (route) => {
    reads++;
    return route.fulfill({ json: { id, status: 'completed', downloadUrl: `/download-${reads}.mp4`, linksExpireAt: reads === 1 ? Date.now() - 1000 : Date.now() + 600000 } });
  });
  await page.goto('/seedance-ai-generated');
  await page.getByRole('link', { name: 'Download video' }).click();
  const dialog = page.getByRole('dialog', { name: 'Download link expired' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Refresh link' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('link', { name: 'Download video' })).toHaveAttribute('href', '/download-2.mp4');
});

test('expired task session retains its receipt and a failed link refresh keeps a recovery dialog', async ({ page }) => {
  await page.addInitScript((savedId) => localStorage.setItem('seedances-fal-local-task', JSON.stringify({ id: savedId, prompt: 'cat' })), id);
  await page.route('**/api/video', (route) => route.fulfill({ json: { configured: true, enabled: true, missing: [] } }));
  await page.route('**/api/video/*', (route) => route.fulfill({ status: 401, json: { code: 'LOGIN_REQUIRED' } }));
  await page.goto('/seedance-ai-generated');
  await expect(page.getByRole('dialog', { name: 'Sign in required' })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('seedances-fal-local-task')!).id)).toBe(id);
  await page.keyboard.press('Escape');
  await page.route('**/api/video/*', (route) => route.fulfill({ json: { id, status: 'completed', downloadUrl: '/download.mp4', linksExpireAt: Date.now() - 1000 } }));
  await page.getByRole('button', { name: 'Check task status' }).click();
  await page.getByRole('link', { name: 'Download video' }).click();
  await page.route('**/api/video/*', (route) => route.fulfill({ status: 503, json: { code: 'SERVICE_UNAVAILABLE' } }));
  await page.getByRole('button', { name: 'Refresh link' }).click();
  await expect(page.getByRole('dialog', { name: 'Service temporarily unavailable' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Generate video' })).toBeDisabled();
});

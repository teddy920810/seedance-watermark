import { expect, test } from '@playwright/test';

test.skip(process.env.SEEDANCE_FREE_VIDEO_ENABLED !== 'true' || process.env.VERCEL_ENV !== 'production', 'Requires the free trial UI enabled for the local test server.');

test('prompts signed-out visitors to sign in and submits one free request after verified sign-in', async ({ page }) => {
  let signedIn = false;
  let submissions = 0;
  await page.route('**/api/video', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: { configured: true, enabled: true, signedIn } });
      return;
    }
    submissions++;
    const { id, prompt, options } = route.request().postDataJSON();
    expect(prompt).toBe('A red kite over the sea');
    expect(options).toBeUndefined();
    await route.fulfill({ status: 201, json: { id, status: 'queued' } });
  });
  await page.goto('/seedance-ai-generated');
  const button = page.getByRole('button', { name: 'Generate now' });
  await button.click();
  const dialog = page.getByRole('dialog', { name: 'Sign in to continue' });
  await expect(dialog).toContainText('Sign in with Google to generate one free 3-second video.');
  await expect(dialog.getByRole('button', { name: 'Sign in' })).toBeVisible();
  const font = await dialog.getByRole('button', { name: 'Sign in' }).evaluate((el) => getComputedStyle(el).fontSize);
  expect(font).toBe(await page.getByText('1 free video per account').evaluate((el) => getComputedStyle(el).fontSize));
  await dialog.getByRole('button', { name: 'Close' }).click();
  await page.getByLabel('Describe your video').fill('A red kite over the sea');
  expect(submissions).toBe(0);
  signedIn = true;
  await page.reload();
  await expect(page.getByLabel('Describe your video')).toHaveValue('A red kite over the sea');
  await button.click();
  await expect(page.getByText('Queued — waiting for a runner.')).toBeVisible();
  await expect(button).toBeDisabled();
  expect(submissions).toBe(1);
});

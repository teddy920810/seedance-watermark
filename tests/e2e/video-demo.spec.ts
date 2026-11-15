import { expect, test } from '@playwright/test';

test('demo waits for quota, restores the same task, and delivers a playable sample', async ({ page }) => {
  const providerRequests: string[] = [];
  await page.route('**/api/video**', async (route) => {
    providerRequests.push(route.request().url());
    await route.abort();
  });
  await page.goto('/seedance-ai-generated?mode=demo');
  await page.getByLabel('Describe your video').fill('A kite circles over the beach');
  await page.getByLabel('Demo scenario').selectOption('quota');
  const run = page.getByRole('button', { name: 'Run demo' });
  await run.dblclick();
  const task = page.getByRole('region', { name: 'Recent demo task' });
  await expect(task.getByText('Waiting for quota to recover.')).toBeVisible();
  const receipt = await task.getByText(/^Task: /).textContent();
  await page.reload();
  await expect(task.getByText(receipt!, { exact: true })).toBeVisible();
  await expect(task.getByText('Demo complete.')).toBeVisible({ timeout: 15_000 });
  await expect(task.locator('video')).toHaveJSProperty('readyState', 4);
  const downloaded = page.waitForEvent('download');
  await task.getByRole('link', { name: 'Download sample' }).click();
  expect((await downloaded).suggestedFilename()).toBe('seedances-demo.webm');
  expect(providerRequests).toEqual([]);
});

test('preview gives inline feedback and confirms before replacing a draft', async ({ page }) => {
  await page.goto('/seedance-ai-generated?mode=preview');
  const prompt = page.getByLabel('Describe your video');
  const review = page.getByRole('button', { name: 'Review prompt', exact: true });
  await review.click();
  await expect(page.getByText('Enter a prompt to continue.')).toBeVisible();
  await prompt.fill('x'.repeat(2001));
  await expect(page.getByText('Shorten your prompt by 1 character.')).toBeVisible();
  await expect(review).toBeDisabled();
  await page.getByRole('button', { name: 'Use this prompt' }).first().click();
  const confirm = page.getByRole('dialog', { name: 'Replace your draft?' });
  await expect(prompt).toHaveValue('x'.repeat(2001));
  await confirm.getByRole('button', { name: 'Replace draft' }).click();
  await expect(prompt).toHaveValue(/jellyfish/i);
  await review.click();
  await expect(page.getByText('Prompt review', { exact: true })).toBeVisible();
});

test('demo cancellation stops recovery and a sample link can refresh on the same receipt', async ({ page }) => {
  await page.clock.install();
  await page.goto('/seedance-ai-generated?mode=demo');
  await page.getByLabel('Describe your video').fill('A kite over the water');
  const scenario = page.getByLabel('Demo scenario');
  const run = page.getByRole('button', { name: 'Run demo' });
  await scenario.selectOption('quota');
  await run.click();
  const task = page.getByRole('region', { name: 'Recent demo task' });
  await task.getByRole('button', { name: 'Cancel demo' }).click();
  await page.clock.fastForward(10_000);
  await expect(task.getByText('Demo cancelled.')).toBeVisible();

  await scenario.selectOption('expired-link');
  await run.click();
  await page.clock.fastForward(4000);
  await expect(task.getByText('Demo complete.')).toBeVisible();
  const receipt = await task.getByText(/^Task: /).textContent();
  await task.getByRole('link', { name: 'Download sample' }).click();
  const expired = page.getByRole('dialog', { name: 'Download link expired' });
  await expired.getByRole('button', { name: 'Refresh link' }).click();
  await expect(expired).not.toBeVisible();
  await expect(task.getByText(receipt!, { exact: true })).toBeVisible();
  const downloaded = page.waitForEvent('download');
  await task.getByRole('link', { name: 'Download sample' }).click();
  expect((await downloaded).suggestedFilename()).toBe('seedances-demo.webm');

  await scenario.selectOption('quota-timeout');
  await run.click();
  await page.clock.fastForward(10_000);
  await expect(task.getByText('Demo paused. Quota did not recover within the waiting window.')).toBeVisible();
  await expect(task.getByRole('link', { name: 'Download sample' })).toHaveCount(0);
});

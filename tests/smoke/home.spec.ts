import { test, expect } from '@playwright/test';

test('login screen renders', async ({ page }) => {
  await page.goto('/auth/login');
  await expect(page.getByText('Sign in')).toBeVisible();
});

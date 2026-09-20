import { test, expect } from './fixtures';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_JSON = path.resolve(__dirname, '../public/data/questions.json');

test.describe('Admin PIN', () => {
  test('shows PIN gate and rejects a wrong PIN', async ({ page }) => {
    await page.goto('/#/admin');
    await expect(page.getByRole('heading', { name: /admin/i })).toBeVisible({
      timeout: 8000,
    });
    await expect(page.getByTestId('admin-pin-input')).toBeVisible();
    await page.getByTestId('admin-pin-input').fill('wrong-pin');
    await page.getByTestId('admin-unlock').click();
    await expect(page.getByTestId('admin-pin-error')).toBeVisible();
    await expect(page.getByTestId('admin-unlocked')).toHaveCount(0);
  });

  test('unlocks with DEV PIN and shows import + analytics tabs', async ({
    page,
  }) => {
    await page.goto('/#/admin');
    await page.getByTestId('admin-pin-input').fill('pixfan');
    await page.getByTestId('admin-unlock').click();
    await expect(page.getByTestId('admin-unlocked')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByTestId('admin-tab-reports')).toBeVisible();
    await expect(page.getByTestId('admin-tab-analytics')).toBeVisible();
    await expect(page.getByTestId('admin-export')).toBeVisible();
    await expect(page.getByTestId('admin-import')).toBeVisible();

    await page.getByTestId('admin-tab-analytics').click();
    await expect(page.getByTestId('admin-analytics')).toBeVisible();

    await page.getByTestId('admin-tab-reports').click();
    await expect(page.getByTestId('admin-reports')).toBeVisible();
  });

  test('imports valid questions.json into the session', async ({ page }) => {
    await page.goto('/#/admin');
    await page.getByTestId('admin-pin-input').fill('pixfan');
    await page.getByTestId('admin-unlock').click();
    await expect(page.getByTestId('admin-unlocked')).toBeVisible();

    await page.getByTestId('admin-import-input').setInputFiles(QUESTIONS_JSON);
    await expect(page.locator('.admin__status')).toContainText(
      /import|quiz/i,
      { timeout: 5000 }
    );
  });
});

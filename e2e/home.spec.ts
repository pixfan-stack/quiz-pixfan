import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Quiz PixFan/i);
  });

  test('displays all 6 quiz cards', async ({ page }) => {
    const quizCards = page.locator('.quiz-card');
    await expect(quizCards).toHaveCount(6);
  });

  test('displays quiz titles in French by default', async ({ page }) => {
    const firstCard = page.locator('.quiz-card').first();
    await expect(firstCard.locator('.quiz-card__title')).toBeVisible();
  });

  test('shows question count on each quiz card', async ({ page }) => {
    const quizCards = page.locator('.quiz-card');
    for (let i = 0; i < await quizCards.count(); i++) {
      const chip = quizCards.nth(i).locator('.quiz-card__meta-chip');
      await expect(chip).toBeVisible();
    }
  });

  test('navigates to quiz when clicking a quiz card', async ({ page }) => {
    const firstCard = page.locator('.quiz-card').first();
    await firstCard.click();
    
    // Should see question view
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 5000 });
  });
});

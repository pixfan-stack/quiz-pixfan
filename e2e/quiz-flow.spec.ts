import { test, expect, openMorePacks, CATEGORY_CARD } from './fixtures';

test.describe('Quiz Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await openMorePacks(page);
    await page.locator(CATEGORY_CARD).first().click();
    // Wait for question to load
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 5000 });
  });

  test('displays first question', async ({ page }) => {
    await expect(page.locator('.question-text')).toBeVisible();
    await expect(page.locator('.answer-option')).toHaveCount(4); // Default 4 answers
  });

  test('allows selecting an answer', async ({ page }) => {
    const firstAnswer = page.locator('.answer-option').first();
    await firstAnswer.click();
    
    await expect(firstAnswer).toHaveClass(/is-selected/);
  });

  test('submit button is disabled when no answer selected', async ({ page }) => {
    const submitBtn = page.getByRole('button', {
      name: /^(Vérifier|Check answer)$/,
    });
    await expect(submitBtn).toBeDisabled();
  });

  test('submit button is enabled after selecting answer', async ({ page }) => {
    const firstAnswer = page.locator('.answer-option').first();
    await firstAnswer.click();

    const submitBtn = page.getByRole('button', {
      name: /^(Vérifier|Check answer)$/,
    });
    await expect(submitBtn).toBeEnabled();
  });

  test('shows feedback after submitting answer', async ({ page }) => {
    await page.locator('.answer-option').first().click();
    await page
      .getByRole('button', { name: /^(Vérifier|Check answer)$/ })
      .click();
    await expect(page.locator('.feedback')).toBeVisible({ timeout: 3000 });
  });

  test('navigates to next question after feedback', async ({ page }) => {
    await page.locator('.answer-option').first().click();
    await page
      .getByRole('button', { name: /^(Vérifier|Check answer)$/ })
      .click();
    await expect(page.locator('.feedback')).toBeVisible({ timeout: 3000 });
    await page
      .getByRole('button', { name: /^(Question suivante|Next question)$/ })
      .click();
    await expect(page.locator('.question-text')).toBeVisible();
  });

  test('progress bar updates', async ({ page }) => {
    const progressBar = page.locator('.progress-track__fill');
    const initialWidth = await progressBar.evaluate((el) => el.style.width);

    await page.locator('.answer-option').first().click();
    await page
      .getByRole('button', { name: /^(Vérifier|Check answer)$/ })
      .click();
    await expect(page.locator('.feedback')).toBeVisible({ timeout: 3000 });
    await page
      .getByRole('button', { name: /^(Question suivante|Next question)$/ })
      .click();

    const newWidth = await progressBar.evaluate((el) => el.style.width);
    expect(newWidth).not.toBe(initialWidth);
  });

  test('shows streak counter in the quiz toolbar', async ({ page }) => {
    await expect(
      page.locator('.stat-pill').filter({ hasText: /Série|Streak/i })
    ).toBeVisible();
  });
});

import { test, expect } from './fixtures';

test.describe('Quiz Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Click first category quiz (skip random mix card)
    await page
      .locator(
        '.quiz-card:not(.quiz-card--random):not(.quiz-card--daily):not(.quiz-card--duel):not(.quiz-card--weak):not(.quiz-card--photo)'
      )
      .first()
      .click();
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
    const submitBtn = page.locator('button[type="button"]:has-text("Vérifier"), button[type="button"]:has-text("Check answer")');
    await expect(submitBtn).toBeDisabled();
  });

  test('submit button is enabled after selecting answer', async ({ page }) => {
    const firstAnswer = page.locator('.answer-option').first();
    await firstAnswer.click();
    
    const submitBtn = page.locator('button[type="button"]:has-text("Vérifier"), button[type="button"]:has-text("Check answer")');
    await expect(submitBtn).toBeEnabled();
  });

  test('shows feedback after submitting answer', async ({ page }) => {
    // Select first answer
    await page.locator('.answer-option').first().click();
    
    // Submit
    const submitBtn = page.locator('button[type="button"]:has-text("Vérifier"), button[type="button"]:has-text("Check answer")');
    await submitBtn.click();
    
    // Wait for feedback
    await expect(page.locator('.feedback')).toBeVisible({ timeout: 3000 });
  });

  test('navigates to next question after feedback', async ({ page }) => {
    // Select and submit
    await page.locator('.answer-option').first().click();
    await page.locator('button[type="button"]:has-text("Vérifier"), button[type="button"]:has-text("Check answer")').click();
    
    // Wait for feedback
    await expect(page.locator('.feedback')).toBeVisible({ timeout: 3000 });
    
    // Click next
    const nextBtn = page.locator('button:has-text("Question suivante"), button:has-text("Next question")');
    await nextBtn.click();
    
    // Should see new question
    await expect(page.locator('.question-text')).toBeVisible();
  });

  test('progress bar updates', async ({ page }) => {
    const progressBar = page.locator('.progress-track__fill');
    const initialWidth = await progressBar.evaluate(el => el.style.width);
    
    // Answer and go to next
    await page.locator('.answer-option').first().click();
    await page.locator('button[type="button"]:has-text("Vérifier"), button[type="button"]:has-text("Check answer")').click();
    await expect(page.locator('.feedback')).toBeVisible({ timeout: 3000 });
    await page.locator('button:has-text("Question suivante"), button:has-text("Next question")').click();
    
    const newWidth = await progressBar.evaluate(el => el.style.width);
    // Progress should increase
    expect(newWidth).not.toBe(initialWidth);
  });

  test('shows streak counter in the quiz toolbar', async ({ page }) => {
    await expect(
      page.locator('.stat-pill').filter({ hasText: /Série|Streak/i })
    ).toBeVisible();
  });
});



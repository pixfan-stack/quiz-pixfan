import { test, expect } from './fixtures';

test.describe('Results Screen', () => {
  test('shows results after completing quiz', async ({ page }) => {
    await page.goto('/');

    // Start first category quiz (skip special packs)
    await page
      .locator(
        '.quiz-card:not(.quiz-card--random):not(.quiz-card--daily):not(.quiz-card--duel):not(.quiz-card--weak):not(.quiz-card--photo)'
      )
      .first()
      .click();
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 5000 });

    // Answer every question until results (category packs can grow beyond 20)
    test.setTimeout(120_000);
    for (let i = 0; i < 40; i++) {
      await page.locator('.answer-option').first().click();
      await page
        .locator('button:has-text("Vérifier"), button:has-text("Check answer")')
        .first()
        .click();
      await expect(page.locator('.feedback')).toBeVisible({ timeout: 3000 });

      const finishBtn = page
        .locator('button:has-text("Voir les résultats"), button:has-text("See results")')
        .first();
      if (await finishBtn.isVisible().catch(() => false)) {
        await finishBtn.click({ force: true });
        break;
      }

      await page
        .locator(
          'button:has-text("Question suivante"), button:has-text("Next question")'
        )
        .first()
        .click({ force: true });
      await expect(page.locator('.question-text')).toBeVisible({ timeout: 5000 });
    }

    await expect(page.locator('.result-section')).toBeVisible({ timeout: 5000 });
  });
});

import { test, expect } from './fixtures';

/** Answer every question until the results screen appears. */
async function completeCurrentQuiz(
  page: import('@playwright/test').Page,
  maxQuestions = 15
): Promise<void> {
  for (let i = 0; i < maxQuestions; i++) {
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 8000 });
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
  }
  await expect(page.locator('.result-section')).toBeVisible({ timeout: 8000 });
}

test.describe('Daily challenge path', () => {
  test('starts daily from home and reaches results', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/');
    await expect(page.locator('.quiz-card--daily')).toBeVisible({
      timeout: 8000,
    });
    await page.locator('.quiz-card--daily').click();
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 8000 });
    await completeCurrentQuiz(page, 12);
    await expect(page.locator('.daily-ceremony')).toBeVisible();
  });
});

test.describe('Duel path', () => {
  test('starts a duel from home and shows rematch on results', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.goto('/');
    await expect(page.locator('.quiz-card--duel')).toBeVisible({
      timeout: 8000,
    });
    await page.locator('.quiz-card--duel').click();
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 8000 });
    await completeCurrentQuiz(page, 12);
    await expect(
      page.locator('button:has-text("Revanche"), button:has-text("Rematch")')
    ).toBeVisible();
    await expect(
      page.locator(
        'button:has-text("Envoyer le lien"), button:has-text("Send duel link")'
      )
    ).toBeVisible();
  });

  test('shared duel deep-link with score reaches results with outcome', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.goto('/#/quiz/duel-abcd2345?score=70');
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(/70|Bats|Beat/i).first()).toBeVisible();
    await completeCurrentQuiz(page, 12);
    await expect(page.locator('.duel-outcome')).toBeVisible();
  });
});

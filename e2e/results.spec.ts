import { test, expect } from '@playwright/test';

test.describe('Results Screen', () => {
  test('shows results after completing quiz', async ({ page }) => {
    await page.goto('/');
    
    // Start first quiz
    await page.locator('.quiz-card').first().click();
    await expect(page.locator('.question-text')).toBeVisible({ timeout: 5000 });
    
    // Answer all 20 questions
    for (let i = 0; i < 20; i++) {
      await page.locator('.answer-option').first().click();
      await page.locator('button:has-text("Vérifier"), button:has-text("Check answer")').first().click();
      await expect(page.locator('.feedback')).toBeVisible({ timeout: 3000 });
      
      if (i < 19) {
        // Not last question: click "Next"
        const nextBtn = page.locator('button:has-text("Question suivante"), button:has-text("Next question")').first();
        await nextBtn.click({ force: true });
        await expect(page.locator('.question-text')).toBeVisible({ timeout: 5000 });
      } else {
        // Last question: click "See results" / "Voir les résultats"
        const finishBtn = page.locator('button:has-text("Voir les résultats"), button:has-text("See results")').first();
        await finishBtn.click({ force: true });
      }
    }
    
    // Should see results
    await expect(page.locator('.result-section')).toBeVisible({ timeout: 5000 });
  });
});

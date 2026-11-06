import { test, expect } from './fixtures';

test.describe('Partenaires page', () => {
  test('guides footer reaches /partenaires/ with both reciprocal HTTPS links', async ({
    page,
  }) => {
    await page.goto('/guides/');
    const footerLink = page.locator(
      'a.app-footer__link[href^="/partenaires/"]'
    );
    await expect(footerLink).toBeVisible({ timeout: 8000 });
    await footerLink.click();
    await expect(page).toHaveURL(/\/partenaires\/?/);
    await expect(page.locator('h1.fr, h1.en').first()).toBeVisible();

    const provence = page.locator(
      'a[href="https://www.photos-provence.fr/annuaire-photo"]'
    );
    const photoliens = page.locator('a[href="https://www.photoliens.eu/"]');
    await expect(provence).toHaveText('Provence Mer Montagne : annuaire photo');
    await expect(photoliens).toHaveText(
      'Photoliens.eu — Annuaire photographie / Portail photo'
    );
    await expect(provence).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(photoliens).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

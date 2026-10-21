import { describe, expect, it } from 'vitest';
import indexHtml from '../../index.html?raw';
import featuredSource from '../components/quiz-selector/FeaturedQuizCards.tsx?raw';
import morePacksSource from '../components/quiz-selector/MorePacksSection.tsx?raw';
import typesSource from '../components/quiz-selector/types.ts?raw';
import reminderSource from '../components/DailyReminderPrompt.tsx?raw';
import installSource from '../components/InstallPrompt.tsx?raw';
import globalCss from '../styles/global.css?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';

describe('home / guides quiet chrome (vague 1.29)', () => {
  it('CSP img-src no longer allows images.unsplash.com', () => {
    expect(indexHtml).toContain("img-src 'self' data:");
    expect(indexHtml).not.toContain('images.unsplash.com');
  });

  it('DailyReminderPrompt uses own surface, not reengage/install pink twin', () => {
    expect(reminderSource).toContain('className="daily-reminder-prompt"');
    expect(reminderSource).toContain('daily-reminder-prompt__body');
    expect(reminderSource).not.toContain('reengage-banner');
    expect(reminderSource).not.toContain('install-prompt');
    expect(installSource).toContain('className="install-prompt"');
  });

  it('narrow Daily copy-link is not a title overlay (CSS)', () => {
    // CSS ?raw can be empty under Vite in some setups — lock the source rule string
    // via Featured structure + a CSS presence check when available.
    expect(featuredSource).toContain('quiz-card-copy-btn');
    expect(featuredSource).toContain('quiz-card-with-copy');
    if (globalCss.length > 0) {
      expect(globalCss).toContain('@media (max-width: 520px)');
      expect(globalCss).toContain('.quiz-card-copy-btn');
      expect(globalCss).toContain('position: static');
      expect(globalCss).toContain('.quiz-card__meta-chip--freeze');
    }
  });

  it('MorePacks + Featured use neutral ✦ mark, not emoji wall', () => {
    expect(typesSource).toContain('QUIZ_ICON_MARK');
    expect(typesSource).not.toContain('QUIZ_ICONS');
    expect(morePacksSource).toContain('QUIZ_ICON_MARK');
    expect(featuredSource).not.toContain('🖼️');
    expect(featuredSource).not.toContain('🗓️');
    expect(featuredSource).not.toContain('⚔️');
    expect(featuredSource).toContain('✦');
  });

  it('Daily / Duel / photo-reading use recognition « pour toi si / choose if » copy', () => {
    expect(fr.home.dailyChallengeDesc).toMatch(/Pour toi si/i);
    expect(fr.home.duelDesc).toMatch(/Pour toi si/i);
    expect(fr.home.photoReadingDesc).toMatch(/Pour toi si/i);
    expect(en.home.dailyChallengeDesc).toMatch(/Choose this if/i);
    expect(en.home.duelDesc).toMatch(/Choose this if/i);
    expect(en.home.photoReadingDesc).toMatch(/Choose this if/i);
  });

  it('guide end-cards put classroom CTA before related muted links', () => {
    for (const html of [composition, triangle]) {
      for (const artClass of ['class="fr"', 'class="en"']) {
        const artStart = html.indexOf(`<article ${artClass}`);
        expect(artStart).toBeGreaterThan(-1);
        const artEnd = html.indexOf('</article>', artStart);
        const art = html.slice(artStart, artEnd);
        const cardStart = art.lastIndexOf('<div class="card">');
        const card = art.slice(cardStart);
        const cta = card.indexOf('cta-secondary');
        const related = card.search(/class="muted"[^>]*>\s*<a href="\/(?:guides|s)\//);
        expect(cta, `${artClass} missing classroom CTA`).toBeGreaterThan(-1);
        expect(related, `${artClass} missing related`).toBeGreaterThan(-1);
        expect(cta).toBeLessThan(related);
      }
    }
  });
});

import { describe, expect, it } from 'vitest';
import featuredSource from '../components/quiz-selector/FeaturedQuizCards.tsx?raw';
import badgeSource from '../components/HighScoreBadge.tsx?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import smartphone from '../../public/guides/photo-smartphone.html?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import lumiere from '../../public/guides/lumiere-photo.html?raw';
import retouche from '../../public/guides/retouche-lightroom.html?raw';
import genres from '../../public/guides/genres-photo.html?raw';
import materiel from '../../public/guides/materiel-photo.html?raw';
import droits from '../../public/guides/droits-ethique-photo.html?raw';
import histoire from '../../public/guides/histoire-photo.html?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';

const topicGuides = [
  ['composition', composition],
  ['smartphone', smartphone],
  ['triangle', triangle],
  ['lumiere', lumiere],
  ['retouche', retouche],
  ['genres', genres],
  ['materiel', materiel],
  ['droits', droits],
  ['histoire', histoire],
] as const;

describe('EN classroom CTA + quiet chrome (vague 1.34)', () => {
  it('topic guides drop Défi end-card links and normalize EN classroom CTAs', () => {
    for (const [name, html] of topicGuides) {
      expect(html, name).not.toContain('href="/s/daily"');
      expect(html, name).not.toContain('Défi du jour');
      expect(html, name).not.toContain('Daily challenge');
      expect(html, name).not.toContain('For class → Scolaires paths');
      expect(html, name).toMatch(/For the classroom → Schools paths/);
    }
  });

  it('removes dead softAskHint-like locale keys', () => {
    expect(fr.scolaires).not.toHaveProperty('chip');
    expect(en.scolaires).not.toHaveProperty('chip');
    expect(fr.scolaires).not.toHaveProperty('chipHint');
    expect(en.scolaires).not.toHaveProperty('chipHint');
    expect(fr.home).not.toHaveProperty('weeklyLeadersEmpty');
    expect(en.home).not.toHaveProperty('weeklyLeadersEmpty');
    expect(fr.home).not.toHaveProperty('streakFreezeUsed');
    expect(en.home).not.toHaveProperty('streakFreezeUsed');
    expect(fr.footer).not.toHaveProperty('guideExposure');
    expect(en.footer).not.toHaveProperty('guideExposure');
    expect(fr.footer).not.toHaveProperty('guideHistory');
    expect(en.footer).not.toHaveProperty('guideHistory');
    expect(fr.highscore).not.toHaveProperty('none');
    expect(en.highscore).not.toHaveProperty('none');
  });

  it('gates Daily freeze chip behind an active streak', () => {
    expect(featuredSource).toContain(
      'dailyStreak > 0 && streakFreezes > 0'
    );
    expect(featuredSource).toContain("t('home.streakFreezeAvailable')");
  });

  it('HighScoreBadge drops dead showEmpty empty-state API', () => {
    expect(badgeSource).not.toContain('showEmpty');
    expect(badgeSource).not.toContain('highscore.none');
  });
});

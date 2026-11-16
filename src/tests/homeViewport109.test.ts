import { describe, expect, it } from 'vitest';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';
import es from '../../public/locales/es/translation.json';
import de from '../../public/locales/de/translation.json';
import selectorSource from '../components/quiz-selector/QuizSelector.tsx?raw';
import latestSource from '../components/quiz-selector/LatestQuizzesSection.tsx?raw';

describe('vague 1.109 — home latest quizzes encart (QP-300)', () => {
  // Pack IDs locked in 1.110 (option B pin) — 1.109 only keeps chrome / i18n.

  it('mounts LatestQuizzesSection after featured and before Autres quiz', () => {
    expect(selectorSource).toContain('LatestQuizzesSection');
    expect(selectorSource).toContain('getLatestPacks');
    const latestAt = selectorSource.indexOf('<LatestQuizzesSection');
    const moreAt = selectorSource.indexOf('<MorePacksSection');
    expect(latestAt).toBeGreaterThan(0);
    expect(moreAt).toBeGreaterThan(latestAt);
    expect(selectorSource).toContain('!classeMode && (');
    expect(selectorSource).toMatch(
      /morePackQuizzes = !classeMode[\s\S]*!latestIds\.has\(q\.id\)/
    );
    expect(latestSource).toContain('home-latest-packs');
    expect(latestSource).toContain('latest-quiz-card');
    expect(latestSource).toContain("t('home.latestSection')");
  });

  it('ships FR/EN/ES/DE latestSection copy', () => {
    expect(fr.home.latestSection).toBe('Nouveautés');
    expect(en.home.latestSection).toBe('New quizzes');
    expect(es.home.latestSection).toBe('Novedades');
    expect(de.home.latestSection).toBe('Neu');
    for (const locale of [fr, en, es, de] as const) {
      expect(locale.home.latestSectionHint.length).toBeGreaterThan(8);
    }
  });
});

import { describe, expect, it } from 'vitest';
import homeHeroSource from '../components/quiz-selector/HomeHero.tsx?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';

describe('home hero Persuade polish (vague 1.24)', () => {
  it('exposes no-account reassure + teachers link to scolaires hub', () => {
    expect(homeHeroSource).toContain('data-testid="home-hero-no-account"');
    expect(homeHeroSource).toContain('data-testid="home-hero-scolaires"');
    expect(homeHeroSource).toContain("'/guides/scolaires/#c4-regard'");
    expect(homeHeroSource).toContain("'/guides/scolaires/?lang=en#c4-regard'");
    expect(homeHeroSource).toContain('home.noAccountHint');
    expect(homeHeroSource).toContain('home.teachersCta');
  });

  it('ships photo-first lead without burying modes in the headline', () => {
    expect(fr.home.selectQuiz).toMatch(/photos|vraies/i);
    expect(fr.home.selectQuiz).not.toMatch(/sans compte/i);
    expect(fr.home.noAccountHint).toMatch(/sans compte/i);
    expect(en.home.selectQuiz).toMatch(/photos|real/i);
    expect(en.home.noAccountHint).toMatch(/no account/i);
    expect(fr.home.teachersCta).toMatch(/scolaires/i);
    expect(en.home.teachersCta).toMatch(/schools|teacher/i);
  });
});

import { describe, expect, it } from 'vitest';
import appSource from '../App.tsx?raw';
import heroSource from '../components/quiz-selector/HomeHero.tsx?raw';
import selectorSource from '../components/quiz-selector/QuizSelector.tsx?raw';
import resultSource from '../components/result/ResultScreen.tsx?raw';
import hub from '../../public/guides/scolaires/index.html?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';

describe('home + scolaires polish (vague 1.26 P1–P2)', () => {
  it('hides footer Save until post-play and admin until unlock', () => {
    expect(appSource).toContain('hasCompletedAnyQuiz');
    expect(appSource).toContain('footer-save-progress');
    expect(appSource).toContain('isAdminUnlocked()');
    expect(appSource).toContain('footer-admin');
    expect(appSource).toMatch(
      /hasCompletedAnyQuiz\(\)\s*&&\s*\(\s*<button[\s\S]*?footer-save-progress/
    );
    expect(appSource).toMatch(
      /isAdminEnabled\(\)\s*&&\s*isAdminUnlocked\(\)\s*&&/
    );
  });

  it('removes mid-page scolaires chip; hero deep-links to c4-regard', () => {
    expect(selectorSource).not.toContain('scolaires-home-chip');
    expect(heroSource).toContain('href="/guides/scolaires/#c4-regard"');
    expect(heroSource).toContain('data-testid="home-hero-scolaires"');
  });

  it('dedupes hero lead vs CTA hint copy', () => {
    expect(fr.home.selectQuiz).toMatch(/Lisez de vraies photos/i);
    expect(en.home.selectQuiz).toMatch(/Read real photos/i);
    expect(fr.home.photoReadingDesc).toMatch(/^10 questions/i);
    expect(en.home.photoReadingDesc).toMatch(/^10 questions/i);
    expect(fr.home.photoReadingDesc).not.toMatch(/^Lisez de vraies photos/i);
    expect(en.home.photoReadingDesc).not.toMatch(/^Read real photos/i);
  });

  it('promotes result classroom CTAs to secondary buttons', () => {
    expect(resultSource).toContain(
      'btn btn--secondary result-continue-pack__scolaires'
    );
    expect(resultSource).toContain('/guides/scolaires/#c4-regard');
    expect(resultSource).toContain('/guides/scolaires/#c4-lumiere');
  });

  it('hub: EN parcours ids, jump to c4-regard, CTA before step list', () => {
    expect(hub).toContain('id="c4-regard-en"');
    expect(hub).toContain('id="c4-lumiere-en"');
    expect(hub).toContain('id="c4-emi-droits-en"');
    expect(hub).toContain('href="#c4-regard"');
    expect(hub).toContain('href="#c4-regard-en"');
    expect(hub).toContain('visibleParcoursCard');
    expect(hub).toContain('scrollParcoursHash');

    const frCard = hub.match(
      /id="c4-regard"[\s\S]*?<\/div>\s*\n\s*<div class="card" id="c4-lumiere"/
    )?.[0];
    expect(frCard).toBeTruthy();
    expect(frCard!.indexOf('data-track-parcours')).toBeLessThan(
      frCard!.indexOf('<ol>')
    );

    const enCard = hub.match(
      /id="c4-regard-en"[\s\S]*?<\/div>\s*\n\s*<div class="card" id="c4-lumiere-en"/
    )?.[0];
    expect(enCard).toBeTruthy();
    expect(enCard!.indexOf('data-track-parcours')).toBeLessThan(
      enCard!.indexOf('<ol>')
    );

    expect(hub).toMatch(
      /id="c4-lumiere"[\s\S]*?parcours-badge">Collège/
    );
    expect(hub).toMatch(
      /id="c4-lumiere-en"[\s\S]*?parcours-badge">Collège/
    );
  });
});

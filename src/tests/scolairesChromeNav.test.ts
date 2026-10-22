import { describe, expect, it } from 'vitest';
import appSource from '../App.tsx?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import smartphone from '../../public/guides/photo-smartphone.html?raw';
import lumiere from '../../public/guides/lumiere-photo.html?raw';
import retouche from '../../public/guides/retouche-lightroom.html?raw';
import genres from '../../public/guides/genres-photo.html?raw';
import materiel from '../../public/guides/materiel-photo.html?raw';
import droits from '../../public/guides/droits-ethique-photo.html?raw';
import histoire from '../../public/guides/histoire-photo.html?raw';
import hub from '../../public/guides/scolaires/index.html?raw';
import quizSelectorSource from '../components/quiz-selector/QuizSelector.tsx?raw';

const guidePages: Array<{ name: string; html: string }> = [
  { name: 'index', html: guidesIndex },
  { name: 'triangle-exposition', html: triangle },
  { name: 'composition-photo', html: composition },
  { name: 'photo-smartphone', html: smartphone },
  { name: 'lumiere-photo', html: lumiere },
  { name: 'retouche-lightroom', html: retouche },
  { name: 'genres-photo', html: genres },
  { name: 'materiel-photo', html: materiel },
  { name: 'droits-ethique-photo', html: droits },
  { name: 'histoire-photo', html: histoire },
];

describe('scolaires chrome URL + nav', () => {
  it('app chrome links to real /guides/scolaires/ (not hash-only)', () => {
    expect(appSource).toContain("'/guides/scolaires/'");
    expect(appSource).toContain('withGuideLang');
    expect(appSource).toContain('scolairesHubHref');
    expect(appSource).toContain('data-testid="footer-scolaires-link"');
    expect(appSource).toContain('data-testid="header-scolaires-link"');
    expect(appSource).not.toMatch(
      /data-testid="footer-scolaires-link"[\s\S]{0,120}href="#\/scolaires"/
    );
  });

  it('every top-level guide ships Scolaires in header + footer chrome', () => {
    expect(guidePages.length).toBe(10);
    for (const { name, html } of guidePages) {
      expect(
        html,
        `${name} missing header Scolaires → /guides/scolaires/`
      ).toMatch(/class="guide-nav-link[^"]*" href="\/guides\/scolaires\/"/);
      expect(
        html,
        `${name} missing footer Scolaires → /guides/scolaires/`
      ).toContain('href="/guides/scolaires/" class="app-footer__link">Scolaires');
    }
  });

  it('hub keeps Scolaires in chrome', () => {
    expect(hub).toMatch(/href="\/guides\/scolaires\/"/);
    expect(hub).toContain(
      'href="/guides/scolaires/" class="app-footer__link">Scolaires'
    );
  });

  it('triangle / smartphone / matériel expose Pour la classe as secondary CTA (vague 1.27)', () => {
    expect(triangle).toContain('/guides/scolaires/#c4-lumiere');
    expect(triangle).toContain('/guides/scolaires/?lang=en#c4-lumiere');
    expect(triangle).toMatch(
      /cta-secondary"[^>]*>Pour la classe|cta-secondary"[^>]*>For the classroom/
    );
    expect(smartphone).toContain('class="cta-secondary"');
    expect(smartphone).toContain('Pour la classe → parcours Scolaires');
    expect(materiel).toContain('/guides/scolaires/#lycee-pratique');
    expect(materiel).toContain('/guides/scolaires/?lang=en#lycee-pratique');
    expect(materiel).toMatch(/class="cta-secondary"/);
  });

  it('EN classroom links on lumière / droits / genres / retouche (vague 1.24/1.27/1.38)', () => {
    expect(lumiere).toContain('/guides/scolaires/?lang=en#c4-lumiere');
    expect(lumiere).toMatch(/cta-secondary"[^>]*>For the classroom/);
    expect(droits).toContain('/guides/scolaires/?lang=en#c4-emi-droits');
    expect(droits).toMatch(/cta-secondary"[^>]*>For the classroom/);
    expect(genres).toContain('/guides/scolaires/?lang=en#c3-decouvrir');
    expect(genres).toMatch(/cta-secondary"[^>]*>For the classroom/);
    expect(retouche).toContain('/guides/scolaires/?lang=en#lycee-pratique');
    expect(retouche).toMatch(/cta-secondary"[^>]*>For the classroom/);
  });
});

describe('scolaires home distill (vague 1.26)', () => {
  it('removes mid-page chip; WeeklyLeaders stays post-play only', () => {
    expect(quizSelectorSource).not.toContain('scolaires-home-chip');
    expect(quizSelectorSource).toContain('<WeeklyLeaders');
    expect(quizSelectorSource).toContain('postPlay && state.difficultyFilter');
  });
});

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import appSource from '../App.tsx?raw';
import morePacksSource from '../components/quiz-selector/MorePacksSection.tsx?raw';
import dailyNudgeSource from '../components/DailyNudge.tsx?raw';
import hub from '../../public/guides/scolaires/index.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';

const css = readFileSync(
  resolve(__dirname, '../styles/global.css'),
  'utf8'
);

describe('quiet chrome + guides polish (vague 1.27 P1–P2)', () => {
  it('collapses app footer guides to Guides + Scolaires only', () => {
    expect(appSource).toContain('app-footer__guides');
    expect(appSource).toContain('footer-scolaires-link');
    expect(appSource).not.toContain('footer.guideExposure');
    expect(appSource).not.toContain('footer.guideComposition');
    expect(appSource).not.toContain('footer.guideHistory');
  });

  it('drops empty high-score badges in MorePacks', () => {
    expect(morePacksSource).toContain('HighScoreBadge');
    expect(morePacksSource).not.toContain('showEmpty');
  });

  it('promotes guide classroom links off muted style', () => {
    expect(composition).toContain('class="cta-secondary"');
    expect(composition).toContain('/guides/scolaires/#c4-regard');
    expect(composition).not.toMatch(
      /class="muted"[^>]*>\s*<a href="\/guides\/scolaires\/#c4-regard"/
    );
  });

  it('distills static hub away from App fork', () => {
    expect(hub).not.toContain('href="/#/scolaires"');
    expect(hub).not.toContain('Ouvrir dans l’app');
    expect(hub).not.toContain('Open in the app');
    expect(hub).toContain('data-track-parcours');
  });

  it('uses local mist BG (no Unsplash CDN mountain)', () => {
    expect(css).toContain(
      "url('/images/packs/photo-1506905925346-21bda4d32df4.avif')"
    );
    expect(css).not.toContain('images.unsplash.com/photo-1506905925346');
  });

  it('gives DailyNudge its own surface (not install-prompt twin)', () => {
    expect(dailyNudgeSource).toContain('className="daily-nudge"');
    expect(dailyNudgeSource).not.toContain('install-prompt');
    expect(dailyNudgeSource).toContain('btn--secondary');
    expect(css).toContain('.daily-nudge {');
  });
});

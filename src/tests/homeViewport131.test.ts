import { describe, expect, it } from 'vitest';
import resultScreenSource from '../components/result/ResultScreen.tsx?raw';
import softAskSource from '../components/ResultNameSoftAsk.tsx?raw';
import hub from '../../public/guides/scolaires/index.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import globalCss from '../styles/global.css?raw';

describe('result / guides quiet chrome (vague 1.31)', () => {
  it('Daily share sits before soft-ask and PixfanCta', () => {
    const dailyBranch = resultScreenSource.indexOf(
      '{!classeMode && isDaily && ('
    );
    const softAsk = resultScreenSource.indexOf('<ResultNameSoftAsk');
    const cta = resultScreenSource.indexOf('<PixfanCta');
    const nonDailyBranch = resultScreenSource.indexOf(
      '{!classeMode && !isDaily && ('
    );
    expect(dailyBranch).toBeGreaterThan(-1);
    expect(
      resultScreenSource.indexOf('<ResultShareSection', dailyBranch)
    ).toBeLessThan(softAsk);
    expect(softAsk).toBeGreaterThan(dailyBranch);
    expect(cta).toBeGreaterThan(softAsk);
    expect(nonDailyBranch).toBeGreaterThan(cta);
    expect(
      resultScreenSource.indexOf('<ResultShareSection', nonDailyBranch)
    ).toBeGreaterThan(cta);
    const continueIdx = resultScreenSource.indexOf(
      'data-testid="result-continue-composition"'
    );
    expect(softAsk).toBeGreaterThan(continueIdx);
  });

  it('hub title/og match shortened h1 (no programme officiel)', () => {
    expect(hub).toContain(
      '<title>Scolaires — photo en classe | Quiz PixFan</title>'
    );
    expect(hub).toContain(
      'content="Scolaires — photo en classe | Quiz PixFan"'
    );
    expect(hub).not.toContain('programme officiel | Quiz PixFan');
    expect(hub).toContain('<h1>Scolaires — photo en classe</h1>');
  });

  it('topic guide headers drop quiz deep-link; end-card CTA remains', () => {
    const header = composition.match(/<header[\s\S]*?<\/header>/)?.[0] ?? '';
    expect(header).toContain('href="/guides/"');
    expect(header).toContain('href="/guides/scolaires/"');
    expect(header).not.toMatch(/href="\/s\//);
    expect(composition).toContain('href="/s/composition"');
    const triHeader = triangle.match(/<header[\s\S]*?<\/header>/)?.[0] ?? '';
    expect(triHeader).not.toMatch(/href="\/s\//);
    expect(guidesIndex).toContain('href="/s/daily"');
  });

  it('classe-mode-banner is not an install-prompt pink twin', () => {
    expect(resultScreenSource).toContain('classe-mode-banner');
    expect(resultScreenSource).toContain('role="status"');
    // CSS ?raw can be empty under Vite — assert rule when available.
    if (globalCss.length > 0) {
      const banner = globalCss.match(/\.classe-mode-banner\s*\{[^}]+\}/)?.[0];
      expect(banner).toBeTruthy();
      expect(banner).toContain('background: transparent');
      expect(banner).toContain('border-bottom');
      expect(banner).not.toMatch(/pixfan-pink\)\s*8%/);
    }
  });

  it('soft-ask is title-only (no hint paragraph)', () => {
    expect(softAskSource).toContain('result.softAskTitle');
    expect(softAskSource).not.toContain('result.softAskHint');
    expect(softAskSource).not.toContain('result-name-soft__hint');
  });
});

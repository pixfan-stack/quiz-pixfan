import { describe, expect, it } from 'vitest';
import resultScreenSource from '../components/result/ResultScreen.tsx?raw';
import softAskSource from '../components/ResultNameSoftAsk.tsx?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';

describe('photo-reading continue placement (vague 1.23)', () => {
  it('renders continue pack before PixfanCta in ResultScreen source', () => {
    const continueIdx = resultScreenSource.indexOf(
      'data-testid="result-continue-composition"'
    );
    const ctaIdx = resultScreenSource.indexOf('<PixfanCta');
    expect(continueIdx).toBeGreaterThan(-1);
    expect(ctaIdx).toBeGreaterThan(-1);
    expect(continueIdx).toBeLessThan(ctaIdx);
  });

  it('exposes soft scolaires link to c4-regard after photo-reading', () => {
    expect(resultScreenSource).toContain(
      'data-testid="result-continue-scolaires"'
    );
    expect(resultScreenSource).toContain('#c4-regard');
    expect(resultScreenSource).toContain('scolairesLang');
    expect(resultScreenSource).toContain('result.continueScolairesCta');
  });

  it('ships FR/EN copy for scolaires soft link', () => {
    expect(fr.result.continueScolairesCta).toMatch(/collège/i);
    expect(en.result.continueScolairesCta).toMatch(/classroom|middle-school/i);
  });
});

describe('composition → light continue (vague 1.24)', () => {
  it('renders light continue before PixfanCta', () => {
    const lightIdx = resultScreenSource.indexOf(
      'data-testid="result-continue-light"'
    );
    const ctaIdx = resultScreenSource.indexOf('<PixfanCta');
    expect(lightIdx).toBeGreaterThan(-1);
    expect(lightIdx).toBeLessThan(ctaIdx);
  });

  it('exposes soft scolaires link to c4-lumiere after composition', () => {
    expect(resultScreenSource).toContain(
      'data-testid="result-continue-scolaires-light"'
    );
    expect(resultScreenSource).toContain('#c4-lumiere');
    expect(resultScreenSource).toContain('scolairesLang');
    expect(fr.result.continueLightCta).toMatch(/lumière|couleur/i);
    expect(en.result.continueLightCta).toMatch(/light|color/i);
    expect(fr.result.continueScolairesLightCta).toMatch(/lumière/i);
    expect(en.result.continueScolairesLightCta).toMatch(/light|classroom/i);
  });
});

describe('result soft-ask copy (vague 1.24 / 1.31)', () => {
  it('uses dedicated softAsk title key without hint paragraph', () => {
    expect(softAskSource).toContain('result.softAskTitle');
    expect(softAskSource).not.toContain('result.softAskHint');
    expect(softAskSource).not.toContain('home.playerModalTitle');
    expect(softAskSource).not.toContain('home.playerModalSkip');
    expect(fr.result.softAskTitle).toMatch(/pseudo|classement/i);
    expect(en.result.softAskTitle).toMatch(/display name|leaderboard/i);
  });
});

describe('soft-ask after continue (vague 1.28)', () => {
  it('places ResultNameSoftAsk after continue packs and before PixfanCta', () => {
    const continueIdx = resultScreenSource.indexOf(
      'data-testid="result-continue-composition"'
    );
    const lightIdx = resultScreenSource.indexOf(
      'data-testid="result-continue-light"'
    );
    const softAskIdx = resultScreenSource.indexOf('<ResultNameSoftAsk');
    const ctaIdx = resultScreenSource.indexOf('<PixfanCta');
    expect(softAskIdx).toBeGreaterThan(continueIdx);
    expect(softAskIdx).toBeGreaterThan(lightIdx);
    expect(softAskIdx).toBeLessThan(ctaIdx);
  });
});

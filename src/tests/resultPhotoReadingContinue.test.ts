import { describe, expect, it } from 'vitest';
import resultScreenSource from '../components/result/ResultScreen.tsx?raw';
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
    expect(resultScreenSource).toContain('/guides/scolaires/#c4-regard');
    expect(resultScreenSource).toContain('result.continueScolairesCta');
  });

  it('ships FR/EN copy for scolaires soft link', () => {
    expect(fr.result.continueScolairesCta).toMatch(/collège/i);
    expect(en.result.continueScolairesCta).toMatch(/classroom|middle-school/i);
  });
});

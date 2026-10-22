import { describe, expect, it } from 'vitest';
import histoire from '../../public/guides/histoire-photo.html?raw';
import scolairesSource from '../components/ScolairesScreen.tsx?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';

describe('dead locales + scolaires openHub (vague 1.35)', () => {
  it('removes remaining softAskHint-class dead locale keys', () => {
    expect(fr.app).not.toHaveProperty('tagline');
    expect(en.app).not.toHaveProperty('tagline');
    expect(fr.nav).not.toHaveProperty('home');
    expect(en.nav).not.toHaveProperty('home');
    expect(fr.home).not.toHaveProperty('welcome');
    expect(en.home).not.toHaveProperty('welcome');
    expect(fr.home).not.toHaveProperty('bestScore');
    expect(en.home).not.toHaveProperty('bestScore');
    expect(fr.home).not.toHaveProperty('duelLinkCopied');
    expect(en.home).not.toHaveProperty('duelLinkCopied');
    expect(fr.home).not.toHaveProperty('copyDuelLink');
    expect(en.home).not.toHaveProperty('copyDuelLink');
    expect(fr.account).not.toHaveProperty('openSync');
    expect(en.account).not.toHaveProperty('openSync');
    expect(fr.common).not.toHaveProperty('accessibilitySkipToMain');
    expect(en.common).not.toHaveProperty('accessibilitySkipToMain');
    expect(fr.common).toHaveProperty('accessibilitySkipToContent');
    expect(en.common).toHaveProperty('accessibilitySkipToContent');
    expect(fr.common).not.toHaveProperty('questions');
    expect(en.common).not.toHaveProperty('questions');
    expect(fr.result).not.toHaveProperty('copyDailyGrid');
    expect(en.result).not.toHaveProperty('copyDailyGrid');
    expect(fr.result).not.toHaveProperty('dailyGridCopied');
    expect(en.result).not.toHaveProperty('dailyGridCopied');
    expect(fr.result).not.toHaveProperty('copyLink');
    expect(en.result).not.toHaveProperty('copyLink');
    expect(fr.result).not.toHaveProperty('copyDuelLink');
    expect(en.result).not.toHaveProperty('copyDuelLink');
    expect(fr.pixfan).not.toHaveProperty('exploreMore');
    expect(en.pixfan).not.toHaveProperty('exploreMore');
  });

  it('EN scolaires openHub uses Schools wording', () => {
    expect(scolairesSource).toContain("t('scolaires.openHub')");
    expect(en.scolaires.openHub).toBe('Schools guides hub');
    expect(en.scolaires.openHub).not.toMatch(/Scolaires/i);
    expect(fr.scolaires.openHub).toBe('Hub Scolaires');
  });

  it('histoire classroom CTA deep-links cycle 3 parcours', () => {
    expect(histoire).toContain(
      'cta-secondary" href="/guides/scolaires/#c3-decouvrir">Pour la classe → parcours Scolaires (cycle 3)'
    );
    expect(histoire).toContain(
      'cta-secondary" href="/guides/scolaires/#c3-decouvrir">For the classroom → Schools paths (cycle 3)'
    );
    expect(histoire).not.toContain(
      'cta-secondary" href="/guides/scolaires/">Pour la classe'
    );
    expect(histoire).not.toContain(
      'cta-secondary" href="/guides/scolaires/?lang=en"'
    );
  });
});

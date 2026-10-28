import { describe, expect, it } from 'vitest';
import hub from '../../public/guides/scolaires/index.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import selectorState from '../components/quiz-selector/useQuizSelectorState.ts?raw';
import accountSync from '../components/AccountSyncPanel.tsx?raw';
import resultShare from '../components/result/useResultShareActions.ts?raw';
import shareSource from '../utils/share.ts?raw';

describe('vague 1.39 — JSON-LD EN + soft clipboard + docs', () => {
  it('docs still mention vague 1.38; no-go line covers 1.39+', () => {
    /* Docs headline moved to v1.39.0 in vague 1.40 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.38**');
    expect(nextSteps).toMatch(/no-go.*1\.39/);
    expect(readme).toMatch(/v1\.(3[89]|4[0123456789]|5[0123456789]|60|61|62|63)\.0/);
  });

  it('hub sniff swaps JSON-LD to EN names and flips og:locale:alternate', () => {
    expect(hub).toContain('applyJsonLdEn');
    expect(hub).toContain("'Schools'");
    expect(hub).toContain("'Schools paths Quiz PixFan'");
    expect(hub).toContain("'Reading an image (cycle 4)'");
    expect(hub).toContain("'Still-image practice (lycée)'");
    expect(hub).toContain("setLocales('en_US', 'fr_FR')");
    expect(hub).toContain("setLocales('fr_FR', 'en_US')");
    expect(hub).toContain('"name": "Scolaires"');
    expect(hub).toContain('"name": "Lire une image (cycle 4)"');
  });

  it('fiche EN title is de-duped; alternate twin flips', () => {
    expect(fiche).toContain("'Lesson sheet — Schools | Quiz PixFan'");
    expect(fiche).not.toContain(
      'Lesson sheet — Schools Quiz PixFan | Quiz PixFan'
    );
    expect(fiche).toContain("setLocales('en_US', 'fr_FR')");
    expect(fiche).toContain("setLocales('fr_FR', 'en_US')");
  });

  it('Daily / Account / grid clipboard use copyTextWithFallback', () => {
    expect(shareSource).toContain('export async function copyTextWithFallback');
    expect(selectorState).toContain('copyTextWithFallback');
    expect(accountSync).toContain('copyTextWithFallback');
    expect(resultShare).toContain('copyTextWithFallback');
  });
});

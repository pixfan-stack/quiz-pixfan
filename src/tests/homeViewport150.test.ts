import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';
import langSource from '../utils/lang.ts?raw';
import {
  buildUrlWithLangParam,
  SUPPORTED_LANGUAGES,
} from '../utils/lang';

describe('vague 1.50 — docs v1.49.0 + SPA ?lang= sync', () => {
  it('docs still mention vague 1.49; no-go line covers 1.50+', () => {
    /* Docs headline moved to v1.50.0 in vague 1.51 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.49**');
    expect(nextSteps).toMatch(/no-go.*1\.50/);
    expect(readme).toMatch(/v1\.(49|5[0123456789]|60|61|62|63|64|65|66|67|68)\.0/);
  });

  it('LanguageSwitcher syncs ?lang= via syncLangSearchParam', () => {
    expect(switcherSource).toContain('syncLangSearchParam');
    expect(switcherSource).toContain('syncLangSearchParam(lang)');
    expect(langSource).toContain('buildUrlWithLangParam');
    expect(langSource).toContain('replaceState');
  });

  it('buildUrlWithLangParam sets lang and preserves hash + other query', () => {
    expect(buildUrlWithLangParam('/', '', '', 'es')).toBe('/?lang=es');
    expect(buildUrlWithLangParam('/', '?classe=1', '#/quiz/history-icons', 'de')).toBe(
      '/?classe=1&lang=de#/quiz/history-icons'
    );
    expect(buildUrlWithLangParam('/', '?lang=en', '#/daily', 'fr')).toBe(
      '/?lang=fr#/daily'
    );
    expect(buildUrlWithLangParam('/guides/', '?lang=en', '', 'es')).toBe(
      '/guides/?lang=es'
    );
  });

  it('SUPPORTED_LANGUAGES still four UI langs', () => {
    expect([...SUPPORTED_LANGUAGES]).toEqual(['en', 'fr', 'es', 'de']);
  });


  it('still no path-locale /es/ scheme in LanguageSwitcher', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
  });
});

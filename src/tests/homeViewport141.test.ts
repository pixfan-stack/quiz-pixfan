import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import stubsMd from '../../public/locales/STUBS.md?raw';
import i18nSource from '../i18n.ts?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';
import sw from '../../public/sw.js?raw';
import esLocale from '../../public/locales/es/translation.json';
import deLocale from '../../public/locales/de/translation.json';
import enLocale from '../../public/locales/en/translation.json';
import { SUPPORTED_LANGUAGES } from '../utils/lang';

function leafEntries(obj: unknown, prefix = ''): [string, unknown][] {
  if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) {
    return prefix ? [[prefix, obj]] : [];
  }
  const out: [string, unknown][] = [];
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v != null && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...leafEntries(v, path));
    } else {
      out.push([path, v]);
    }
  }
  return out;
}

describe('vague 1.41 — docs v1.40.0 + real ES UI + DE stub', () => {
  it('docs still mention vague 1.40; no-go line covers 1.41+', () => {
    /* Docs headline moved to v1.41.0 in vague 1.42 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.40**');
    expect(nextSteps).toMatch(/no-go.*1\.41/);
    expect(readme).toMatch(/v1\.(4[0123456789]|5[01])\.0/);
  });

  it('SUPPORTED_LANGUAGES still four langs; comments say ES real', () => {
    expect([...SUPPORTED_LANGUAGES]).toEqual(['en', 'fr', 'es', 'de']);
    expect(i18nSource).toContain('real Spanish UI');
    expect(switcherSource).toContain('real Spanish UI');
    expect(stubsMd).toMatch(/es\/translation\.json.*real Spanish/s);
  });

  it('es/de keep 508-key parity with en', () => {
    const enKeys = leafEntries(enLocale).map(([k]) => k).sort();
    const esKeys = leafEntries(esLocale).map(([k]) => k).sort();
    const deKeys = leafEntries(deLocale).map(([k]) => k).sort();
    expect(enKeys.length).toBe(508);
    expect(esKeys).toEqual(enKeys);
    expect(deKeys).toEqual(enKeys);
  });

  it('Spanish UI samples differ from EN (not a stub)', () => {
    const samples = [
      'nav.language',
      'home.start',
      'home.selectQuiz',
      'quiz.submit',
      'quiz.finish',
      'result.title',
      'result.backHome',
      'footer.guides',
      'common.darkMode',
    ] as const;
    const enMap = Object.fromEntries(leafEntries(enLocale));
    const esMap = Object.fromEntries(leafEntries(esLocale));
    for (const key of samples) {
      expect(esMap[key]).toBeTruthy();
      expect(esMap[key]).not.toBe(enMap[key]);
    }
    expect(esMap['home.start']).toBe('Empezar el quiz');
    expect(esMap['quiz.submit']).toBe('Comprobar respuesta');
    expect(esMap['result.backHome']).toBe('Volver a los quizzes');

    const differing = leafEntries(esLocale).filter(
      ([k, v]) => enMap[k] !== v
    ).length;
    expect(differing).toBeGreaterThan(450);
  });

  it('SW precaches Spanish locale bundle (v19+)', () => {
    expect(sw).toMatch(/CACHE_NAME = 'quiz-pixfan-v(?:19|2\d)'/);
    expect(sw).toContain('/locales/es/translation.json');
  });
});

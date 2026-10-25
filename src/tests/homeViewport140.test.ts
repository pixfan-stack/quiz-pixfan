import { describe, expect, it } from 'vitest';
import hub from '../../public/guides/scolaires/index.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import themeJs from '../../public/guides/theme.js?raw';
import guidesI18nCss from '../../public/guides/i18n-display.css.txt?raw';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import i18nSource from '../i18n.ts?raw';
import langSource from '../utils/lang.ts?raw';
import localeSource from '../utils/locale.ts?raw';
import esLocale from '../../public/locales/es/translation.json';
import deLocale from '../../public/locales/de/translation.json';
import enLocale from '../../public/locales/en/translation.json';
import { parseLang, toContentLang } from '../../functions/lib/sharePreview';
import { pickLocale } from '../utils/locale';
import {
  guideLangQuery,
  resolveUiLang,
  SUPPORTED_LANGUAGES,
  withGuideLang,
} from '../utils/lang';

function leafKeys(obj: unknown, prefix = ''): string[] {
  if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) {
    return prefix ? [prefix] : [];
  }
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v != null && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...leafKeys(v, path));
    } else {
      out.push(path);
    }
  }
  return out;
}

describe('vague 1.40 — docs + ES/DE foundation + guides index meta', () => {
  it('docs still mention vague 1.39; no-go line covers 1.40+', () => {
    /* Docs headline moved to v1.40.0 in vague 1.41 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.39**');
    expect(nextSteps).toMatch(/no-go.*1\.40/);
    expect(readme).toMatch(/v1\.(4[0123456789]|5[01])\.0/);
  });

  it('SUPPORTED_LANGUAGES includes es and de; i18n imports stubs', () => {
    expect([...SUPPORTED_LANGUAGES]).toEqual(['en', 'fr', 'es', 'de']);
    expect(i18nSource).toContain("from '../public/locales/es/translation.json'");
    expect(i18nSource).toContain("from '../public/locales/de/translation.json'");
    expect(langSource).toContain("['en', 'fr', 'es', 'de']");
  });

  it('es/de locale stubs match en leaf-key count (EN scaffold)', () => {
    const enKeys = leafKeys(enLocale).sort();
    const esKeys = leafKeys(esLocale).sort();
    const deKeys = leafKeys(deLocale).sort();
    expect(enKeys.length).toBe(508);
    expect(esKeys).toEqual(enKeys);
    expect(deKeys).toEqual(enKeys);
  });

  it('parseLang / resolveUiLang / toContentLang / guideLangQuery', () => {
    expect(parseLang('es')).toBe('es');
    expect(parseLang('es-ES')).toBe('es');
    expect(parseLang('de-DE')).toBe('de');
    expect(parseLang('fr-FR')).toBe('fr');
    expect(toContentLang('es')).toBe('en');
    expect(toContentLang('de')).toBe('en');
    expect(toContentLang('fr')).toBe('fr');
    expect(resolveUiLang('de-AT')).toBe('de');
    expect(guideLangQuery('es')).toBe('?lang=es');
    expect(guideLangQuery('fr')).toBe('');
    expect(withGuideLang('/guides/scolaires/#c4', 'de')).toBe(
      '/guides/scolaires/?lang=de#c4'
    );
    expect(withGuideLang('/guides/scolaires/', 'en')).toBe(
      '/guides/scolaires/?lang=en'
    );
    expect(withGuideLang('/guides/scolaires/#c4-regard', 'en')).toBe(
      '/guides/scolaires/?lang=en#c4-regard'
    );
  });

  it('pickLocale falls back es/de → en', () => {
    const value = { en: 'Hello', fr: 'Bonjour', es: 'Hola' };
    expect(pickLocale(value, 'fr')).toBe('Bonjour');
    expect(pickLocale(value, 'es')).toBe('Hola');
    expect(pickLocale(value, 'de')).toBe('Hello');
    expect(pickLocale({ en: 'Hello', fr: 'Bonjour' }, 'es')).toBe('Hello');
    expect(localeSource).toContain('value.es');
    expect(localeSource).toContain('value.de');
  });

  it('CSS + theme + hub/fiche: es/de show EN interim; switcher ES/DE', () => {
    expect(guidesI18nCss).toContain('html[lang="es"] .en');
    expect(guidesI18nCss).toContain('html[lang="de"] .en');
    expect(guidesI18nCss).toContain('html[lang="es"] .fr');
    expect(themeJs).toContain("document.documentElement.lang !== 'fr'");
    expect(hub).toContain("p === 'es' || p === 'de'");
    expect(hub).toContain("p === 'en' || p === 'es' || p === 'de'");
    expect(hub).toContain('href="?lang=es">ES</a>');
    expect(hub).toContain('href="?lang=de">DE</a>');
    expect(fiche).toContain('href="?lang=es">ES</a>');
    expect(fiche).toContain('href="?lang=de">DE</a>');
    expect(fiche).toContain("p === 'en' || p === 'es' || p === 'de'");
  });

  it('guides index ships twitter + og:locale:alternate + EN sniff', () => {
    expect(guidesIndex).toContain('name="twitter:card"');
    expect(guidesIndex).toContain('og:locale:alternate');
    expect(guidesIndex).toContain("setLocales('en_US', 'fr_FR')");
    expect(guidesIndex).toContain(
      "'Photo quiz guides — learn then practice | Quiz PixFan'"
    );
    expect(guidesIndex).toContain('href="?lang=es">ES</a>');
  });
});

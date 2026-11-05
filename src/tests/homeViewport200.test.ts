import { describe, expect, it } from 'vitest';
import appSource from '../App.tsx?raw';
import scolairesSource from '../components/ScolairesScreen.tsx?raw';
import resultSource from '../components/result/ResultScreen.tsx?raw';
import mistakesSource from '../components/MistakesReview.tsx?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';
import themeJs from '../../public/guides/theme.js?raw';
import {
  withGuideLang,
  withLocalePath,
} from '../utils/lang';

describe('vague 1.100 hotfix — Guides/Scolaires href follow displayed locale', () => {
  it('withGuideLang maps hubs to path locales (FR bare)', () => {
    expect(withGuideLang('/guides/', 'fr')).toBe('/guides/');
    expect(withGuideLang('/guides/', 'en')).toBe('/en/guides/');
    expect(withGuideLang('/guides/scolaires/', 'es')).toBe(
      '/es/guides/scolaires/'
    );
    expect(withGuideLang('/guides/scolaires/#c4', 'de')).toBe(
      '/de/guides/scolaires/#c4'
    );
    expect(withLocalePath('/guides/', 'en')).toBe('/en/guides/');
  });

  it('SPA chrome uses withGuideLang for Guides + Scolaires (not bare /guides/)', () => {
    expect(appSource).toContain('guidesHubHref');
    expect(appSource).toContain("withGuideLang('/guides/'");
    expect(appSource).toContain('scolairesHubHref');
    expect(appSource).toContain("'/guides/scolaires/'");
    expect(appSource).toContain('href={guidesHubHref}');
    expect(appSource).toContain('href={scolairesHubHref}');
    expect(appSource).not.toMatch(/href="\/guides\/"/);
  });

  it('Scolaires / Result / Mistakes prefer path locales over ?lang=', () => {
    expect(scolairesSource).toContain('withGuideLang');
    expect(scolairesSource).not.toContain('guideLangQuery');
    expect(resultSource).toContain('withGuideLang');
    expect(resultSource).not.toContain('guideLangQuery');
    expect(mistakesSource).toContain('withGuideLang');
    expect(mistakesSource).not.toContain('guideLangQuery');
  });

  it('theme.js withLangHref prefers path /en|/es|/de; switcher uses navigateToLang', () => {
    expect(themeJs).toContain('withLangHref');
    expect(themeJs).toMatch(/location\.pathname\.match\(\/\^\\\/\(en\|es\|de\)/);
    expect(themeJs).toMatch(/lang === 'fr'/);
    expect(themeJs).toMatch(/'\/' \+ lang \+/);
    expect(switcherSource).toContain('navigateToLang');
  });
});

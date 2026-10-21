import { describe, expect, it } from 'vitest';
import guidesIndex from '../../public/guides/index.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import hub from '../../public/guides/scolaires/index.html?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';

describe('guides index quiet chrome (vague 1.32)', () => {
  it('guides index header drops Défi du jour deep-link', () => {
    const header = guidesIndex.match(/<header[\s\S]*?<\/header>/)?.[0] ?? '';
    expect(header).toContain('href="/guides/"');
    expect(header).toContain('href="/guides/scolaires/"');
    expect(header).not.toContain('href="/s/daily"');
    expect(header).not.toContain('Défi du jour');
  });

  it('guides index scolaires card + JSON-LD match hub naming', () => {
    expect(guidesIndex).toContain('<h2>Scolaires — photo en classe</h2>');
    expect(guidesIndex).toContain('<h2>Schools — photo in class</h2>');
    expect(guidesIndex).toContain('"name": "Scolaires — photo en classe"');
    expect(guidesIndex).not.toContain('programme officiel');
    expect(guidesIndex).not.toContain('curriculum paths');
    expect(hub).toContain('<h1>Scolaires — photo en classe</h1>');
  });

  it('guide dark toggles ship short text, not emoji FOUC', () => {
    for (const html of [guidesIndex, composition, hub]) {
      expect(html).toContain('>Nuit</button>');
      expect(html).not.toContain('>🌙</button>');
    }
  });

  it('softAskHint locale key is removed', () => {
    expect(fr.result).not.toHaveProperty('softAskHint');
    expect(en.result).not.toHaveProperty('softAskHint');
    expect(fr.result.softAskTitle).toMatch(/pseudo|classement/i);
    expect(en.result.softAskTitle).toMatch(/display name|leaderboard/i);
  });
});

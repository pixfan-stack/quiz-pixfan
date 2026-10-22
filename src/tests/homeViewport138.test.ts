import { describe, expect, it } from 'vitest';
import hub from '../../public/guides/scolaires/index.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import lumiere from '../../public/guides/lumiere-photo.html?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import droits from '../../public/guides/droits-ethique-photo.html?raw';
import genres from '../../public/guides/genres-photo.html?raw';
import histoire from '../../public/guides/histoire-photo.html?raw';
import smartphone from '../../public/guides/photo-smartphone.html?raw';
import materiel from '../../public/guides/materiel-photo.html?raw';
import retouche from '../../public/guides/retouche-lightroom.html?raw';
import appSource from '../App.tsx?raw';
import heroSource from '../components/quiz-selector/HomeHero.tsx?raw';
import resultSource from '../components/result/ResultScreen.tsx?raw';

describe('EN hub lang + share meta (vague 1.38)', () => {
  it('EN classroom / index / SPA paths preserve ?lang=en to hub', () => {
    for (const [name, html, hash] of [
      ['composition', composition, '#c4-regard'],
      ['lumiere', lumiere, '#c4-lumiere'],
      ['triangle', triangle, '#c4-lumiere'],
      ['droits', droits, '#c4-emi-droits'],
      ['genres', genres, '#c3-decouvrir'],
      ['histoire', histoire, '#c3-decouvrir'],
      ['smartphone', smartphone, '#c3-decouvrir'],
      ['materiel', materiel, '#lycee-pratique'],
      ['retouche', retouche, '#lycee-pratique'],
    ] as const) {
      expect(html, name).toContain(
        `href="/guides/scolaires/?lang=en${hash}">For the classroom`
      );
    }
    expect(guidesIndex).toContain(
      'href="/guides/scolaires/?lang=en">View school paths →'
    );
    expect(heroSource).toContain('withGuideLang');
    expect(heroSource).toContain("'/guides/scolaires/#c4-regard'");
    expect(appSource).toContain('scolairesHubHref');
    expect(appSource).toContain('withGuideLang');
    expect(resultSource).toContain('scolairesLang');
    expect(resultSource).toContain('guideLangQuery');
    expect(resultSource).toContain(
      'href={`/guides/scolaires/${scolairesLang}#c4-regard`}'
    );
  });

  it('hub and fiche ship twitter + og:locale:alternate; EN sniff updates twitter', () => {
    for (const [name, html] of [
      ['hub', hub],
      ['fiche', fiche],
    ] as const) {
      expect(html, name).toContain('name="twitter:card"');
      expect(html, name).toContain('name="twitter:title"');
      expect(html, name).toContain('name="twitter:description"');
      expect(html, name).toContain('property="og:locale:alternate"');
      expect(html, name).toContain("meta[name=\"twitter:title\"]");
      expect(html, name).toContain("twTitle.setAttribute('content'");
    }
  });

  it('EN copy-seance appends &lang=en; FR copy-seance stays bare', () => {
    expect(hub).toContain(
      'data-seance="/s/photo-reading?classe=1&amp;lang=en"'
    );
    expect(hub).toContain('data-seance="/s/photo-reading?classe=1"');
    expect(hub).toMatch(
      /data-seance="\/s\/photo-reading\?classe=1" data-copied="Lien copié/
    );
  });

  it('cycle-4 classroom CTAs share (cycle 4) suffix', () => {
    for (const [name, html] of [
      ['composition', composition],
      ['lumiere', lumiere],
      ['triangle', triangle],
      ['droits', droits],
    ] as const) {
      expect(html, name).toContain(
        'Pour la classe → parcours Scolaires (cycle 4)'
      );
      expect(html, name).toContain(
        'For the classroom → Schools paths (cycle 4)'
      );
    }
  });
});

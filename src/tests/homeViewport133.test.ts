import { describe, expect, it } from 'vitest';
import hub from '../../public/guides/scolaires/index.html?raw';
import smartphone from '../../public/guides/photo-smartphone.html?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';
import scolairesSource from '../components/ScolairesScreen.tsx?raw';

describe('scolaires SPA + smartphone quiet chrome (vague 1.33)', () => {
  it('SPA scolaires title matches hub naming', () => {
    expect(scolairesSource).toContain("t('scolaires.title')");
    expect(fr.scolaires.title).toBe('Scolaires — photo en classe');
    expect(en.scolaires.title).toBe('Schools — photo in class');
    expect(fr.scolaires.title).not.toMatch(/programme/i);
    expect(en.scolaires.title).not.toMatch(/curriculum/i);
    expect(fr.scolaires).not.toHaveProperty('chipHint');
    expect(en.scolaires).not.toHaveProperty('chipHint');
  });

  it('smartphone end-card drops Défi; keeps Scolaires + related guides', () => {
    expect(smartphone).not.toContain('href="/s/daily"');
    expect(smartphone).not.toContain('Défi du jour');
    expect(smartphone).not.toContain('Daily challenge');
    expect(smartphone).toContain('cta-secondary');
    expect(smartphone).toContain('/guides/scolaires/#c3-decouvrir');
    expect(smartphone).toContain('Pour la classe → parcours Scolaires');
    expect(smartphone).toContain('For the classroom → Schools paths');
    // Classroom CTA before related muted links (same order as other topics)
    for (const artClass of ['class="fr"', 'class="en"']) {
      const artStart = smartphone.indexOf(`<article ${artClass}`);
      expect(artStart).toBeGreaterThan(-1);
      const artEnd = smartphone.indexOf('</article>', artStart);
      const art = smartphone.slice(artStart, artEnd);
      const cardStart = art.lastIndexOf('<div class="card">');
      const card = art.slice(cardStart);
      const cta = card.indexOf('cta-secondary');
      const related = card.search(/class="muted"[^>]*>\s*<a href="\/guides\//);
      expect(cta).toBeGreaterThan(-1);
      expect(related).toBeGreaterThan(-1);
      expect(cta).toBeLessThan(related);
    }
  });

  it('hub JSON-LD description drops programme officiel phrasing', () => {
    expect(hub).toContain('"@type": "ItemList"');
    expect(hub).toContain('lecture d’image, lumière, droit à l’image');
    expect(hub).not.toContain(
      'alignés sur le programme officiel français'
    );
  });
});

import { describe, expect, it } from 'vitest';
import hub from '../../public/guides/scolaires/index.html?raw';
import guidesIndex from '../../public/guides/index.html?raw';

describe('scolaires P0 hub', () => {
  it('ships FR hub with H1, 3 parcours, classe séance links, MEN disclaimer', () => {
    expect(hub).toContain('<h1>Scolaires — photo &amp; programme officiel</h1>');
    expect(hub).toContain('id="c4-regard"');
    expect(hub).toContain('id="c4-lumiere"');
    expect(hub).toContain('id="c4-emi-droits"');
    expect(hub).toContain('/s/photo-reading?classe=1');
    expect(hub).toContain('/s/exposure-basics?classe=1');
    expect(hub).toContain('/s/photo-rights?classe=1');
    expect(hub).toContain('Pas d’affiliation au ministère');
    expect(hub).toContain('rel="canonical" href="https://quiz.pixfan.fr/guides/scolaires/"');
    expect(hub).toContain("trackEvt('scolaires_hub')");
    expect(hub).toContain('guides.css');
    expect(hub).toContain('theme.js');
  });

  it('is listed from the guides index', () => {
    expect(guidesIndex).toContain('/guides/scolaires/');
    expect(guidesIndex).toContain('Scolaires');
  });
});

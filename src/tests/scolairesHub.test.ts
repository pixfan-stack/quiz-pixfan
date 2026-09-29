import { describe, expect, it } from 'vitest';
import hub from '../../public/guides/scolaires/index.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import genresGuide from '../../public/guides/genres-photo.html?raw';
import retoucheGuide from '../../public/guides/retouche-lightroom.html?raw';

describe('scolaires P0–P2 hub', () => {
  it('ships FR hub with H1, 5 parcours, classe séance links, MEN disclaimer', () => {
    expect(hub).toContain('<h1>Scolaires — photo &amp; programme officiel</h1>');
    expect(hub).toContain('id="c3-decouvrir"');
    expect(hub).toContain('id="c4-regard"');
    expect(hub).toContain('id="c4-lumiere"');
    expect(hub).toContain('id="c4-emi-droits"');
    expect(hub).toContain('id="lycee-pratique"');
    expect(hub).toContain('/s/genres?classe=1');
    expect(hub).toContain('/s/photo-reading?classe=1');
    expect(hub).toContain('/s/exposure-basics?classe=1');
    expect(hub).toContain('/s/photo-rights?classe=1');
    expect(hub).toContain('/s/portrait-light?classe=1');
    expect(hub).toContain('/s/lexique-image-fixe?classe=1');
    expect(hub).toContain('Pas d’affiliation au ministère');
    expect(hub).toContain('rel="canonical" href="https://quiz.pixfan.fr/guides/scolaires/"');
    expect(hub).toContain("trackEvt('scolaires_hub')");
    expect(hub).toContain('scolaires_parcours_c3_decouvrir');
    expect(hub).toContain('scolaires_parcours_lycee_pratique');
    expect(hub).toContain('/guides/scolaires/fiche-seance.html');
    expect(hub).toContain('/#/scolaires');
    expect(hub).toContain('id="corpus-bac"');
    expect(hub).toContain('eduscol.education.fr');
    expect(hub).toContain('guides.css');
    expect(hub).toContain('theme.js');
  });

  it('ships printable fiche séance with print CSS', () => {
    expect(fiche).toContain('@media print');
    expect(fiche).toContain('window.print()');
    expect(fiche).toContain('id="c3-decouvrir"');
    expect(fiche).toContain('id="c4-regard"');
    expect(fiche).toContain('id="lycee-pratique"');
    expect(fiche).toContain('/s/genres?classe=1');
    expect(fiche).toContain('/s/portrait-light?classe=1');
    expect(fiche).toContain('Contenu original PixFan');
  });

  it('ships fiche timing grid + one débrief prompt per parcours (vague 1.19 P2)', () => {
    expect(fiche).toContain('id="grille-duree"');
    expect(fiche).toContain('class="fiche-timing"');
    expect(fiche).toContain('class="fiche-debrief"');
    expect(fiche).toContain('Citez une photo de portrait');
    expect(fiche).toContain('Peut-on publier une photo de la classe');
    expect(fiche).toContain('Où s’arrête une retouche honnête');
    expect(hub).toContain('id="grille-duree"');
    expect(hub).toContain('Prompts de débrief');
    expect(hub).toContain('Citez une photo de portrait');
    expect(hub).toContain('Peut-on publier une photo de la classe');
  });

  it('is listed from the guides index', () => {
    expect(guidesIndex).toContain('/guides/scolaires/');
    expect(guidesIndex).toContain('Scolaires');
  });

  it('links cycle 3 from genres guide and lycée from retouche guide', () => {
    expect(genresGuide).toContain('/guides/scolaires/#c3-decouvrir');
    expect(retoucheGuide).toContain('/guides/scolaires/#lycee-pratique');
  });
});

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
    expect(hub).toContain('class="fr"');
  });

  it('orders cycle 4 first with jump nav + collège badge (vague 1.22)', () => {
    const c4 = hub.indexOf('id="cycle-4"');
    const c3 = hub.indexOf('id="cycle-3"');
    const regard = hub.indexOf('id="c4-regard"');
    const decouvrir = hub.indexOf('id="c3-decouvrir"');
    expect(c4).toBeGreaterThan(0);
    expect(c3).toBeGreaterThan(c4);
    expect(regard).toBeGreaterThan(0);
    expect(decouvrir).toBeGreaterThan(regard);
    expect(hub).toContain('class="hub-jump"');
    expect(hub).toContain('href="#cycle-4"');
    expect(hub).toContain('parcours-badge');
    expect(hub).toContain('card--recommended');
    expect(hub).toContain('Priorité <strong>collège cycle&nbsp;4</strong>');
    expect(hub).toContain('a[href*="classe=1"]');
    // ItemList JSON-LD lists c4-regard first
    const itemList = hub.indexOf('"@type": "ItemList"');
    const firstPath = hub.indexOf('"Lire une image (cycle 4)"', itemList);
    const c3Path = hub.indexOf('"Découvrir la photo (cycle 3)"', itemList);
    expect(firstPath).toBeGreaterThan(itemList);
    expect(c3Path).toBeGreaterThan(firstPath);
  });

  it('ships EN article + lang switcher + hreflang (vague 1.20 P1)', () => {
    expect(hub).toContain('class="lang-switcher"');
    expect(hub).toContain('href="?lang=fr"');
    expect(hub).toContain('href="?lang=en"');
    expect(hub).toContain('hreflang="en"');
    expect(hub).toContain('hreflang="fr"');
    expect(hub).toContain('<h1>Schools — photo &amp; French national curriculum</h1>');
    expect(hub).toContain('class="en"');
    expect(hub).toContain('No affiliation with the French Ministry of Education');
    expect(hub).toContain('Start the lesson');
    expect(hub).toContain('Copy lesson link');
    expect(hub).toContain('/s/genres?classe=1&amp;lang=en');
    expect(hub).toContain('document.documentElement.lang');
    expect(hub).toContain('<strong>Collège cycle&nbsp;4 first</strong>');
    expect(hub).toContain('href="#cycle-4-en"');
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

  it('ships fiche EN article + lang switcher + hreflang (vague 1.21 P1)', () => {
    expect(fiche).toContain('class="lang-switcher"');
    expect(fiche).toContain('href="?lang=fr"');
    expect(fiche).toContain('href="?lang=en"');
    expect(fiche).toContain('hreflang="en"');
    expect(fiche).toContain('hreflang="fr"');
    expect(fiche).toContain('hreflang="x-default"');
    expect(fiche).toContain('<h1>Lesson sheet — Schools Quiz PixFan</h1>');
    expect(fiche).toContain('class="en"');
    expect(fiche).toContain('class="fr"');
    expect(fiche).toContain('id="grille-duree-en"');
    expect(fiche).toContain('Name a portrait, a landscape');
    expect(fiche).toContain('Where does honest retouching stop');
    expect(fiche).toContain('document.documentElement.lang');
    expect(hub).toContain('/guides/scolaires/fiche-seance.html?lang=en');
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

  it('guides index chrome links Scolaires via real URL', () => {
    expect(guidesIndex).toMatch(
      /class="guide-nav-link" href="\/guides\/scolaires\/"/
    );
    expect(guidesIndex).toContain(
      'href="/guides/scolaires/" class="app-footer__link">Scolaires'
    );
  });

  it('links cycle 3 from genres guide and lycée from retouche guide', () => {
    expect(genresGuide).toContain('/guides/scolaires/#c3-decouvrir');
    expect(retoucheGuide).toContain('/guides/scolaires/#lycee-pratique');
  });

  it('genres and retouche chrome include Scolaires footer entry', () => {
    expect(genresGuide).toContain(
      'href="/guides/scolaires/" class="app-footer__link">Scolaires'
    );
    expect(retoucheGuide).toContain(
      'href="/guides/scolaires/" class="app-footer__link">Scolaires'
    );
  });
});

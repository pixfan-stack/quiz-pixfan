import { describe, expect, it } from 'vitest';
import hub from '../../public/guides/scolaires/index.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import scolairesSource from '../components/ScolairesScreen.tsx?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';

describe('EN scolaires naming + EN titles (vague 1.36)', () => {
  it('SPA printSheet and openHub match hub lesson-sheet wording', () => {
    expect(scolairesSource).toContain("t('scolaires.printSheet')");
    expect(scolairesSource).toContain("t('scolaires.openHub')");
    expect(en.scolaires.printSheet).toBe('Print the lesson sheet');
    expect(en.scolaires.printSheet).not.toMatch(/session/i);
    expect(hub).toContain('Print the lesson sheet');
    expect(en.scolaires.openHub).toBe('Schools guides hub');
    expect(en.scolaires.openHub).not.toMatch(/page$/i);
    expect(en.scolaires.openHub).not.toMatch(/Scolaires/i);
    expect(fr.scolaires.printSheet).toBe('Imprimer la fiche séance');
    expect(fr.scolaires.openHub).toBe('Page guides Scolaires');
  });

  it('hub and fiche set EN document.title when ?lang=en', () => {
    expect(hub).toContain(
      "document.title = 'Schools — photo in class | Quiz PixFan'"
    );
    expect(hub).toContain(
      "document.title = 'Scolaires — photo en classe | Quiz PixFan'"
    );
    expect(fiche).toContain(
      "document.title = 'Lesson sheet — Schools Quiz PixFan | Quiz PixFan'"
    );
    expect(fiche).toContain(
      "document.title = 'Fiche séance Scolaires | Quiz PixFan'"
    );
  });
});

import { describe, expect, it } from 'vitest';
import sw from '../../public/sw.js?raw';
import questionsData from '../../public/data/questions.json';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';
import es from '../../public/locales/es/translation.json';
import de from '../../public/locales/de/translation.json';

const data = questionsData as {
  quizzes: Array<{ id: string; title: { fr: string; en: string } }>;
};

describe('vague 1.108 — Nikon/Tamron visible in menu (QP-298)', () => {
  it('SW cache is v21 and questions.json is network-first', () => {
    expect(sw).toContain("CACHE_NAME = 'quiz-pixfan-v21'");
    expect(sw).not.toContain("CACHE_NAME = 'quiz-pixfan-v20'");
    expect(sw).toContain("url.pathname === '/data/questions.json'");
    expect(sw).toMatch(
      /Catalog \(\/data\/questions\.json\): network-first|questions\.json[\s\S]*?network-first/
    );
  });

  it('nikon-histoire and tamron-histoire sit with marques-photo in catalog order', () => {
    const ids = data.quizzes.map((q) => q.id);
    expect(ids).toContain('nikon-histoire');
    expect(ids).toContain('tamron-histoire');
    const marques = ids.indexOf('marques-photo');
    expect(marques).toBeGreaterThanOrEqual(0);
    expect(ids[marques + 1]).toBe('nikon-histoire');
    expect(ids[marques + 2]).toBe('tamron-histoire');
  });

  it('history topic copy mentions Nikon and Tamron in all locales', () => {
    for (const locale of [fr, en, es, de] as const) {
      const desc = locale.pixfan.topic_history_desc;
      expect(desc.toLowerCase()).toMatch(/nikon/);
      expect(desc.toLowerCase()).toMatch(/tamron/);
    }
  });
});

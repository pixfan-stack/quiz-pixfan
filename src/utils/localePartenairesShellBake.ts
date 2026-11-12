/**
 * Pure bake for partenaires path-locale shells (vague 1.104 / QP-291).
 * Real files at dist/{en,es,de}/partenaires/index.html beat the SPA catch-all
 * (live 200 rewrite to /partenaires/index.html was ignored → homepage FAQ JSON-LD).
 */

export type PartenairesPathLocale = 'en' | 'es' | 'de';

type PartenairesMeta = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogLocale: string;
  twitterTitle: string;
  twitterDescription: string;
  breadcrumbName: string;
};

const META: Record<PartenairesPathLocale, PartenairesMeta> = {
  en: {
    title: 'Partners & photo resources | Quiz PixFan',
    description:
      'Useful photo directories and resources — Quiz PixFan partner links.',
    ogTitle: 'Partners & resources | Quiz PixFan',
    ogDescription:
      'Useful photo directories and resources — Quiz PixFan partner links.',
    ogLocale: 'en_US',
    twitterTitle: 'Partners & resources | Quiz PixFan',
    twitterDescription:
      'Useful photo directories and resources — Quiz PixFan partner links.',
    breadcrumbName: 'Partners',
  },
  es: {
    title: 'Socios y recursos foto | Quiz PixFan',
    description:
      'Directorios y recursos fotográficos útiles — enlaces de socios de Quiz PixFan.',
    ogTitle: 'Socios y recursos | Quiz PixFan',
    ogDescription:
      'Directorios y recursos fotográficos útiles — enlaces de socios de Quiz PixFan.',
    ogLocale: 'es_ES',
    twitterTitle: 'Socios y recursos | Quiz PixFan',
    twitterDescription:
      'Directorios y recursos fotográficos útiles — enlaces de socios de Quiz PixFan.',
    breadcrumbName: 'Socios',
  },
  de: {
    title: 'Partner & Foto-Ressourcen | Quiz PixFan',
    description:
      'Nützliche Foto-Verzeichnisse und Ressourcen — Partnerlinks von Quiz PixFan.',
    ogTitle: 'Partner & Ressourcen | Quiz PixFan',
    ogDescription:
      'Nützliche Foto-Verzeichnisse und Ressourcen — Partnerlinks von Quiz PixFan.',
    ogLocale: 'de_DE',
    twitterTitle: 'Partner & Ressourcen | Quiz PixFan',
    twitterDescription:
      'Nützliche Foto-Verzeichnisse und Ressourcen — Partnerlinks von Quiz PixFan.',
    breadcrumbName: 'Partner',
  },
};

function replaceAttr(
  html: string,
  attr: string,
  name: string,
  value: string
): string {
  const re = new RegExp(
    `(<meta[^>]*${attr}=["']${name}["'][^>]*content=["'])([^"']*)(["'])`,
    'i'
  );
  if (re.test(html)) return html.replace(re, `$1${value}$3`);
  const re2 = new RegExp(
    `(<meta[^>]*content=["'])([^"']*)(["'][^>]*${attr}=["']${name}["'])`,
    'i'
  );
  return html.replace(re2, `$1${value}$3`);
}

/** Pure transform used by the Vite plugin and unit tests. */
export function bakeLocalePartenairesHtml(
  sourceHtml: string,
  lang: PartenairesPathLocale
): string {
  const m = META[lang];
  const origin = 'https://quiz.pixfan.fr';
  const pathUrl = `${origin}/${lang}/partenaires/`;

  let html = sourceHtml;
  html = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}"`);
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${m.title}</title>`);
  html = replaceAttr(html, 'name', 'description', m.description);
  html = replaceAttr(html, 'property', 'og:title', m.ogTitle);
  html = replaceAttr(html, 'property', 'og:description', m.ogDescription);
  html = replaceAttr(html, 'property', 'og:locale', m.ogLocale);
  html = replaceAttr(html, 'property', 'og:url', pathUrl);
  html = replaceAttr(html, 'name', 'twitter:title', m.twitterTitle);
  html = replaceAttr(html, 'name', 'twitter:description', m.twitterDescription);
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/i,
    `<link rel="canonical" href="${pathUrl}" />`
  );

  // BreadcrumbList — keep home + partenaires items, locale URL + name
  html = html.replace(
    /("name":\s*")Partenaires("\s*,\s*"item":\s*")https:\/\/quiz\.pixfan\.fr\/partenaires\/(")/,
    `$1${m.breadcrumbName}$2${pathUrl}$3`
  );

  return html;
}

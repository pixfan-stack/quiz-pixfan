/**
 * Pure bake transforms for guides hub (+ scolaires) path-locale shells (vague 1.103).
 * Vite plugin writes dist/{en,es,de}/guides/... using these helpers.
 */

export type GuidePathLocale = 'en' | 'es' | 'de';

type HubMeta = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogLocale: string;
  twitterTitle: string;
  twitterDescription: string;
  breadcrumbGuides: string;
  itemListName: string;
  itemListDescription: string;
};

type ScolairesMeta = HubMeta & {
  breadcrumbScolaires: string;
};

const GUIDES_META: Record<GuidePathLocale, HubMeta> = {
  en: {
    title: 'Photo quiz guides — learn then practice | Quiz PixFan',
    description:
      'Free guides on exposure, composition, light, retouching, genres, smartphone, gear, rights and photo history, with interactive FR/EN/ES/DE quizzes on Quiz PixFan.',
    ogTitle: 'Photo quiz guides | Quiz PixFan',
    ogDescription:
      'Learn exposure, composition, light, genres, retouching, smartphone, gear, rights and history — then quiz yourself.',
    ogLocale: 'en_US',
    twitterTitle: 'Photo quiz guides | Quiz PixFan',
    twitterDescription:
      'Learn exposure, composition, light, genres, retouching, smartphone, gear, rights and history — then quiz yourself.',
    breadcrumbGuides: 'Guides',
    itemListName: 'Photo guides Quiz PixFan',
    itemListDescription:
      'Local guides linked to Quiz PixFan interactive quizzes.',
  },
  es: {
    title: 'Guías quiz foto — aprender luego practicar | Quiz PixFan',
    description:
      'Guías gratuitas sobre exposición, composición, luz, retoque, géneros, smartphone, material, derechos e historia foto, con quizzes interactivos FR/EN/ES/DE en Quiz PixFan.',
    ogTitle: 'Guías quiz foto | Quiz PixFan',
    ogDescription:
      'Aprende exposición, composición, luz, géneros, retoque, smartphone, material, derechos e historia — luego ponte a prueba.',
    ogLocale: 'es_ES',
    twitterTitle: 'Guías quiz foto | Quiz PixFan',
    twitterDescription:
      'Aprende exposición, composición, luz, géneros, retoque, smartphone, material, derechos e historia — luego ponte a prueba.',
    breadcrumbGuides: 'Guías',
    itemListName: 'Guías foto Quiz PixFan',
    itemListDescription:
      'Guías locales enlazadas a los quizzes interactivos de Quiz PixFan.',
  },
  de: {
    title: 'Foto-Leitfäden — lernen, dann üben | Quiz PixFan',
    description:
      'Kostenlose Fotoguides zu Belichtung, Komposition, Licht, Retusche, Genres, Smartphone, Ausrüstung, Rechte und Fotogeschichte, mit interaktiven FR/EN/ES/DE-Quizzes auf Quiz PixFan.',
    ogTitle: 'Foto-Leitfäden | Quiz PixFan',
    ogDescription:
      'Lernen Sie Belichtung, Komposition, Licht, Genres, Retusche, Smartphone, Ausrüstung, Rechte und Geschichte — und prüfen Sie sich dann.',
    ogLocale: 'de_DE',
    twitterTitle: 'Foto-Leitfäden | Quiz PixFan',
    twitterDescription:
      'Lernen Sie Belichtung, Komposition, Licht, Genres, Retusche, Smartphone, Ausrüstung, Rechte und Geschichte — und prüfen Sie sich dann.',
    breadcrumbGuides: 'Leitfäden',
    itemListName: 'Fotoguides Quiz PixFan',
    itemListDescription:
      'Lokale Leitfäden, verknüpft mit den interaktiven Quizzes von Quiz PixFan.',
  },
};

const SCOLAIRES_META: Record<GuidePathLocale, ScolairesMeta> = {
  en: {
    title: 'Schools — photo in class | Quiz PixFan',
    description:
      'Free cycle 3–4, lycée and media-literacy paths: discover photography, read an image, light, image rights, still-image practice. Quiz PixFan quizzes + guides, no account, class mode without a public leaderboard.',
    ogTitle: 'Schools — photo in class | Quiz PixFan',
    ogDescription:
      'Cycle 3–4 / lycée / media-literacy paths: discover photography, read an image, light, image rights, still-image practice. Free, no account, shareable lesson links.',
    ogLocale: 'en_US',
    twitterTitle: 'Schools — photo in class | Quiz PixFan',
    twitterDescription:
      'Cycle 3–4 / lycée / media-literacy paths: discover photography, read an image, light, image rights, still-image practice. Free, no account, shareable lesson links.',
    breadcrumbGuides: 'Guides',
    breadcrumbScolaires: 'Schools',
    itemListName: 'Schools paths Quiz PixFan',
    itemListDescription:
      'Cycle 4 (collège) first, then cycle 3, media literacy and lycée — image reading, light, image rights.',
  },
  es: {
    title: 'Escolares — foto en clase | Quiz PixFan',
    description:
      'Recorridos pedagógicos gratuitos ciclo 3–4, liceo y alfabetización mediática: descubrir la foto, leer una imagen, luz, derecho a la imagen, práctica imagen fija. Quizzes + guías Quiz PixFan, sin cuenta, modo clase sin clasificación pública.',
    ogTitle: 'Escolares — foto en clase | Quiz PixFan',
    ogDescription:
      'Recorridos ciclo 3–4 / liceo / alfabetización mediática: descubrir la foto, leer una imagen, luz, derecho a la imagen, práctica imagen fija. Gratis, sin cuenta, enlaces de sesión compartibles.',
    ogLocale: 'es_ES',
    twitterTitle: 'Escolares — foto en clase | Quiz PixFan',
    twitterDescription:
      'Recorridos ciclo 3–4 / liceo / alfabetización mediática: descubrir la foto, leer una imagen, luz, derecho a la imagen, práctica imagen fija. Gratis, sin cuenta, enlaces de sesión compartibles.',
    breadcrumbGuides: 'Guías',
    breadcrumbScolaires: 'Escolares',
    itemListName: 'Recorridos escolares Quiz PixFan',
    itemListDescription:
      'Ciclo 4 (collège) primero, luego ciclo 3, alfabetización mediática y liceo — lectura de imagen, luz, derecho a la imagen.',
  },
  de: {
    title: 'Schulpfade — Foto im Unterricht | Quiz PixFan',
    description:
      'Kostenlose Schulpfade Zyklus 3–4, lycée und Medienkompetenz: Fotografie entdecken, ein Bild lesen, Licht, Bildrecht, Praxis Standbild. Quizzes + Leitfäden Quiz PixFan, ohne Konto, Klassenmodus ohne öffentliche Rangliste.',
    ogTitle: 'Schulpfade — Foto im Unterricht | Quiz PixFan',
    ogDescription:
      'Schulpfade Zyklus 3–4 / lycée / Medienkompetenz: Fotografie entdecken, ein Bild lesen, Licht, Bildrecht, Praxis Standbild. Kostenlos, ohne Konto, teilbare Sitzungslinks.',
    ogLocale: 'de_DE',
    twitterTitle: 'Schulpfade — Foto im Unterricht | Quiz PixFan',
    twitterDescription:
      'Schulpfade Zyklus 3–4 / lycée / Medienkompetenz: Fotografie entdecken, ein Bild lesen, Licht, Bildrecht, Praxis Standbild. Kostenlos, ohne Konto, teilbare Sitzungslinks.',
    breadcrumbGuides: 'Leitfäden',
    breadcrumbScolaires: 'Schulpfade',
    itemListName: 'Schulpfade Quiz PixFan',
    itemListDescription:
      'Zyklus 4 (collège) zuerst, dann Zyklus 3, Medienkompetenz und lycée — Bildlesen, Licht, Bildrecht.',
  },
};

const ORIGIN = 'https://quiz.pixfan.fr';

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

/** Rewrite ?lang=xx body/chrome hrefs to path locales inside a locale shell. */
export function rewriteLangQueryHrefs(
  html: string,
  lang: GuidePathLocale
): string {
  html = html.replace(
    new RegExp(`href="/\\?lang=${lang}"`, 'g'),
    `href="/${lang}/"`
  );
  html = html.replace(
    new RegExp(`href="(/guides/[^"#?]*)(?:\\?lang=${lang})(#[^"]*)?"`, 'g'),
    (_m, path: string, hash: string | undefined) =>
      `href="/${lang}${path}${hash ?? ''}"`
  );
  return html;
}

function bakeCommonHead(
  sourceHtml: string,
  lang: GuidePathLocale,
  pathSuffix: string,
  meta: HubMeta
): string {
  const pathUrl = `${ORIGIN}/${lang}${pathSuffix}`;
  let html = sourceHtml;
  html = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}"`);
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${meta.title}</title>`);
  html = replaceAttr(html, 'name', 'description', meta.description);
  html = replaceAttr(html, 'property', 'og:title', meta.ogTitle);
  html = replaceAttr(html, 'property', 'og:description', meta.ogDescription);
  html = replaceAttr(html, 'property', 'og:locale', meta.ogLocale);
  html = replaceAttr(html, 'property', 'og:url', pathUrl);
  html = replaceAttr(html, 'name', 'twitter:title', meta.twitterTitle);
  html = replaceAttr(html, 'name', 'twitter:description', meta.twitterDescription);
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/i,
    `<link rel="canonical" href="${pathUrl}" />`
  );
  html = rewriteLangQueryHrefs(html, lang);
  return html;
}

function localizeJsonLdGuides(
  html: string,
  lang: GuidePathLocale,
  meta: HubMeta
): string {
  const home = `${ORIGIN}/${lang}/`;
  const guides = `${ORIGIN}/${lang}/guides/`;
  return html.replace(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
    (full, body: string) => {
      try {
        const data = JSON.parse(body) as Record<string, unknown>;
        if (
          data['@type'] === 'BreadcrumbList' &&
          Array.isArray(data.itemListElement)
        ) {
          for (const crumb of data.itemListElement as Array<
            Record<string, unknown>
          >) {
            if (crumb.position === 1) {
              crumb.item = home;
            } else if (crumb.position === 2) {
              crumb.name = meta.breadcrumbGuides;
              crumb.item = guides;
            }
          }
          return `<script type="application/ld+json">\n  ${JSON.stringify(data, null, 2)}\n  </script>`;
        }
        if (data['@type'] === 'ItemList') {
          data.name = meta.itemListName;
          data.description = meta.itemListDescription;
          if (Array.isArray(data.itemListElement)) {
            for (const item of data.itemListElement as Array<
              Record<string, unknown>
            >) {
              if (typeof item.url === 'string') {
                item.url = item.url.replace(
                  `${ORIGIN}/guides/`,
                  `${ORIGIN}/${lang}/guides/`
                );
              }
            }
          }
          return `<script type="application/ld+json">\n  ${JSON.stringify(data, null, 2)}\n  </script>`;
        }
      } catch {
        /* keep original */
      }
      return full;
    }
  );
}

function localizeJsonLdScolaires(
  html: string,
  lang: GuidePathLocale,
  meta: ScolairesMeta
): string {
  const home = `${ORIGIN}/${lang}/`;
  const guides = `${ORIGIN}/${lang}/guides/`;
  const scolaires = `${ORIGIN}/${lang}/guides/scolaires/`;
  const namesByLang: Record<GuidePathLocale, string[]> = {
    en: [
      'Reading an image (cycle 4)',
      'Light & photography',
      'Image rights (EMI)',
      'Discover photography (cycle 3)',
      'Still-image practice (lycée)',
    ],
    es: [
      'Leer una imagen (ciclo 4)',
      'Luz y fotografía',
      'Derecho a la imagen (EMI)',
      'Descubrir la fotografía (ciclo 3)',
      'Práctica de imagen fija (liceo)',
    ],
    de: [
      'Ein Bild lesen (Zyklus 4)',
      'Licht & Fotografie',
      'Bildrecht (EMI)',
      'Fotografie entdecken (Zyklus 3)',
      'Praxis Standbild (lycée)',
    ],
  };
  return html.replace(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
    (full, body: string) => {
      try {
        const data = JSON.parse(body) as Record<string, unknown>;
        if (
          data['@type'] === 'BreadcrumbList' &&
          Array.isArray(data.itemListElement)
        ) {
          for (const crumb of data.itemListElement as Array<
            Record<string, unknown>
          >) {
            if (crumb.position === 1) {
              crumb.item = home;
            } else if (crumb.position === 2) {
              crumb.name = meta.breadcrumbGuides;
              crumb.item = guides;
            } else if (crumb.position === 3) {
              crumb.name = meta.breadcrumbScolaires;
              crumb.item = scolaires;
            }
          }
          return `<script type="application/ld+json">\n  ${JSON.stringify(data, null, 2)}\n  </script>`;
        }
        if (data['@type'] === 'ItemList') {
          data.name = meta.itemListName;
          data.description = meta.itemListDescription;
          const names = namesByLang[lang];
          if (Array.isArray(data.itemListElement)) {
            (
              data.itemListElement as Array<Record<string, unknown>>
            ).forEach((item, n) => {
              if (names[n]) item.name = names[n];
              if (typeof item.url === 'string') {
                item.url = item.url.replace(
                  `${ORIGIN}/guides/`,
                  `${ORIGIN}/${lang}/guides/`
                );
              }
            });
          }
          return `<script type="application/ld+json">\n  ${JSON.stringify(data, null, 2)}\n  </script>`;
        }
      } catch {
        /* keep original */
      }
      return full;
    }
  );
}

/** Pure transform used by the Vite plugin and unit tests. */
export function bakeLocaleGuidesHubHtml(
  sourceHtml: string,
  lang: GuidePathLocale
): string {
  const meta = GUIDES_META[lang];
  let html = bakeCommonHead(sourceHtml, lang, '/guides/', meta);
  html = localizeJsonLdGuides(html, lang, meta);
  return html;
}

/** Pure transform for scolaires hub shells. */
export function bakeLocaleScolairesHubHtml(
  sourceHtml: string,
  lang: GuidePathLocale
): string {
  const meta = SCOLAIRES_META[lang];
  let html = bakeCommonHead(sourceHtml, lang, '/guides/scolaires/', meta);
  html = localizeJsonLdScolaires(html, lang, meta);
  return html;
}

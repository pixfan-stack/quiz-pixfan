import {
  buildShareHtml,
  normalizeQuizId,
  parseLang,
  parseScore,
  themeOgImageUrl,
} from './sharePreview';

export type ShareLandingOptions = {
  /** Soft path locale from /en|es|de/s/:id (prefer ?lang= when set). */
  pathLang?: string | null;
};

type ShareParams = { id?: string | string[] };

/**
 * Crawlable share landing HTML with dynamic OG tags.
 * Used by bare `/s/:id` and path-locale `/en|es|de/s/:id` Functions.
 */
export async function handleShareLanding(
  context: { request: Request; params: ShareParams },
  options: ShareLandingOptions = {}
): Promise<Response> {
  const rawId = context.params.id;
  const quizId = normalizeQuizId(
    Array.isArray(rawId) ? (rawId[0] ?? '') : (rawId ?? '')
  );
  if (!quizId) {
    return Response.redirect(new URL('/', context.request.url).toString(), 302);
  }

  const url = new URL(context.request.url);
  const score = parseScore(url.searchParams.get('score'));
  const pathLang =
    options.pathLang ??
    url.pathname.match(/^\/(en|es|de)(?:\/|$)/i)?.[1] ??
    null;
  // Prefer ?lang=; else path locale (vague 1.104 / 1.105).
  const lang = parseLang(url.searchParams.get('lang') ?? pathLang);
  const classeRaw = url.searchParams.get('classe');
  const classe = classeRaw === '1' || classeRaw === 'true';
  const origin = url.origin;
  // Theme PNG (+ score tier) — Facebook / LinkedIn / X / Slack reject SVG.
  const ogImageUrl = themeOgImageUrl(origin, quizId, score);

  const pageUrl = url.toString();
  const html = buildShareHtml({
    quizId,
    score,
    lang,
    pageUrl,
    ogImageUrl,
    appOrigin: origin,
    classe,
  });

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

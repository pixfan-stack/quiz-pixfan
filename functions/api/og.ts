import {
  buildOgSvg,
  normalizeQuizId,
  parseLang,
  parseScore,
  staticOgImageUrl,
} from '../lib/sharePreview';

/**
 * Open Graph image endpoint.
 *
 * Default: 302 → static PNG (Facebook / LinkedIn / X / Slack reject SVG).
 * Debug / legacy: `?format=svg` still returns the dynamic SVG card.
 *
 * GET /api/og?quiz=composition&score=80&lang=fr
 * GET /api/og?quiz=composition&format=svg
 */
export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const quizId = normalizeQuizId(url.searchParams.get('quiz') ?? '');
  if (!quizId) {
    return new Response('Invalid quiz id', { status: 400 });
  }

  if (url.searchParams.get('format') === 'svg') {
    const score = parseScore(url.searchParams.get('score'));
    const lang = parseLang(url.searchParams.get('lang'));
    const svg = buildOgSvg({ quizId, score, lang });
    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return Response.redirect(staticOgImageUrl(url.origin), 302);
};

/** Social crawlers often probe with HEAD before fetching the image. */
export const onRequestHead: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const quizId = normalizeQuizId(url.searchParams.get('quiz') ?? '');
  if (!quizId) {
    return new Response(null, { status: 400 });
  }
  if (url.searchParams.get('format') === 'svg') {
    return new Response(null, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
  return Response.redirect(staticOgImageUrl(url.origin), 302);
};

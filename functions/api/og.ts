import {
  buildOgSvg,
  normalizeQuizId,
  parseLang,
  parseScore,
} from '../lib/sharePreview';

/**
 * Dynamic Open Graph image (SVG).
 * GET /api/og?quiz=composition&score=80&lang=fr
 */
export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const quizId = normalizeQuizId(url.searchParams.get('quiz') ?? '');
  if (!quizId) {
    return new Response('Invalid quiz id', { status: 400 });
  }

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
};

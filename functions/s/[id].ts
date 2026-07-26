import {
  buildShareHtml,
  normalizeQuizId,
  parseLang,
  parseScore,
} from '../lib/sharePreview';

/**
 * Crawlable share landing page with dynamic OG tags.
 * GET /s/:id?score=80&lang=fr → redirects humans to /#/quiz/:id
 */
export const onRequestGet: PagesFunction<{ id: string }> = async (context) => {
  const rawId = context.params.id;
  const quizId = normalizeQuizId(
    Array.isArray(rawId) ? (rawId[0] ?? '') : (rawId ?? '')
  );
  if (!quizId) {
    return Response.redirect(new URL('/', context.request.url).toString(), 302);
  }

  const url = new URL(context.request.url);
  const score = parseScore(url.searchParams.get('score'));
  const lang = parseLang(url.searchParams.get('lang'));
  const origin = url.origin;

  const og = new URL('/api/og', origin);
  og.searchParams.set('quiz', quizId);
  if (score != null) og.searchParams.set('score', String(score));
  og.searchParams.set('lang', lang);

  const pageUrl = url.toString();
  const html = buildShareHtml({
    quizId,
    score,
    lang,
    pageUrl,
    ogImageUrl: og.toString(),
    appOrigin: origin,
  });

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};

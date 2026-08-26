/**
 * Exact-path handler so GSC verification is not 308'd by Cloudflare Pretty URLs.
 * Static file remains in public/ as the source of truth for the token.
 */
export const onRequestGet: PagesFunction = async () => {
  return new Response('google-site-verification: google865d672b76036b3a.html\n', {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'x-robots-tag': 'noindex',
    },
  });
};

import { handleShareLanding } from '../../lib/shareLanding';

/**
 * Path-locale share landing (vague 1.105 / QP-293).
 * CF Pages `_redirects` 200 proxies only resolve static assets — rewriting
 * `/en/s/:id → /s/:id` never invoked the bare Function and fell through to
 * the SPA catch-all (homepage FAQ JSON-LD). A real Function at this path
 * matches before static/SPA handling.
 */
export const onRequestGet: PagesFunction<{ id: string }> = async (context) =>
  handleShareLanding(context, { pathLang: 'en' });

import { handleShareLanding } from '../lib/shareLanding';

/**
 * Crawlable share landing page with dynamic OG tags.
 * GET /s/:id?score=80&lang=fr&classe=1 → redirects humans to /#/quiz/:id?…
 */
export const onRequestGet: PagesFunction<{ id: string }> = async (context) =>
  handleShareLanding(context);

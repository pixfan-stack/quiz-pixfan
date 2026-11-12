import { handleShareLanding } from '../../lib/shareLanding';

/**
 * Path-locale share landing (vague 1.105 / QP-293).
 * See `functions/en/s/[id].ts` for why a Function is required (not a rewrite).
 */
export const onRequestGet: PagesFunction<{ id: string }> = async (context) =>
  handleShareLanding(context, { pathLang: 'es' });

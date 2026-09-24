# Quiz PixFan

Quiz photo bilingue (FR / EN) — **React + TypeScript + Vite**, déployé sur **Cloudflare Pages** (frontend + Pages Functions + D1 + PWA).

**Version courante : v1.17.0**

## Contenu actuel

- **12 quiz** · **317 questions** · **199 illustrées**
- Triangle d’exposition, composition, lumière & couleur, matériel, histoire & icônes
- Galerie domaine public, genres, smartphone, droits & éthique, retouche, workflow Lightroom, **portrait & lumière**
- Modes générés : défi du jour, photo-reading, duel, mix difficulté, points faibles, aléatoire
- Guides locaux : exposition, composition, lumière, retouche, smartphone, **genres** (BreadcrumbList JSON-LD)

Source de vérité du contenu : **`public/data/questions.json`** (pas `src/data/`).

## Fonctionnalités

- Bilingue FR/EN (détection auto + switcher)
- Scores locaux (localStorage) + scores distants / classements via D1
- Classements période (semaine / mois) + signalement de pseudo
- Compte léger (code de récupération + sync streak / succès / high scores / vault / saisons)
- Streak, freezes, succès (dont photo-reader · vault-clear · streak-14), maîtrise, saisons
- Revue d’erreurs / weak spots, CTA Pixfan / newsletter
- PWA (manifest, service worker, install prompt)
- Admin minimal `#/admin` (édition session, signalements, analytics, export JSON) si `VITE_ADMIN_PIN` est défini au **build** ; APIs admin nécessitent aussi `ADMIN_PIN` / `VITE_ADMIN_PIN` **runtime**
- Partage social (OG / deep links duel)

## Architecture (résumé)

| Couche | Rôle |
| --- | --- |
| UI | `QuizSelector`, `QuizScreen`, `ResultScreen`, `AdminScreen`, … |
| Données | `public/data/questions.json` → `useQuizEngine` → résultats / scores |
| i18n | `react-i18next` + `public/locales/{fr,en}/translation.json` |
| Backend | `functions/api/*` + D1 (`wrangler.toml`) |
| Migrations | `migrations/` (+ `setup-schema.sql` pour install neuve) |

## Développement local

```bash
npm install
cp .env.example .env   # ajuster VITE_* si besoin
npm run dev
```

```bash
npm run build
npm run preview
npm test
npm run test:e2e
```

### Variables d’environnement (Vite)

Voir `.env.example` :

| Variable | Rôle |
| --- | --- |
| `VITE_APP_URL` | URL publique (partage / OG) |
| `VITE_ENABLE_REMOTE_SCORES` | Active les appels `/api/*` scores |
| `VITE_ADMIN_PIN` | Active `#/admin` en build prod (sinon désactivé hors DEV) |
| `ADMIN_PIN` | Secret **runtime** Pages Functions pour `/api/admin/*` (préféré ; sinon `VITE_ADMIN_PIN` runtime) |

`VITE_*` SPA sont injectées **au build**. Sur Cloudflare Pages, les définir dans **Settings → Environment variables** (Production). Les Functions lisent l’env **runtime** du projet (`ADMIN_PIN` ou `VITE_ADMIN_PIN`) — voir [`DEPLOYMENT.md`](./DEPLOYMENT.md) § Admin PIN runtime.

## Contenu : ajouter des questions

Éditer `public/data/questions.json`. Chaque chaîne utilisateur doit avoir `fr` et `en`. Voir aussi `#/admin` (export JSON) une fois le PIN configuré.

## Déploiement Cloudflare

Guides détaillés : [`DEPLOYMENT.md`](./DEPLOYMENT.md), [`GUIDE_DEPLOIEMENT.md`](./GUIDE_DEPLOIEMENT.md).

Points ops fréquents :

1. Migrations D1 `004` / `005` / `006` — voir [`migrations/README.md`](./migrations/README.md)
2. **`VITE_ADMIN_PIN`** en build (CI / Pages) + **`ADMIN_PIN`** runtime Functions (même valeur)
3. Binding D1 `DB` → `quiz-pixfan-scores` sur le projet Pages

## Licence

Projet démo / Pixfan — polices système ; crédits images dans le JSON quand présents.

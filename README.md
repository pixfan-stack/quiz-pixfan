# Quiz PixFan

Quiz photo bilingue (FR / EN) — **React + TypeScript + Vite**, déployé sur **Cloudflare Pages** (frontend + Pages Functions + D1 + PWA).

**Version courante : v1.12.0**

## Contenu actuel

- **10 quiz** · **248 questions** · **~74 illustrées**
- Triangle d’exposition, composition, lumière & couleur, matériel, histoire & icônes
- Galerie domaine public, genres, smartphone, droits & éthique, retouche
- Modes générés : défi du jour, photo-reading, duel, mix difficulté, points faibles, aléatoire

Source de vérité du contenu : **`public/data/questions.json`** (pas `src/data/`).

## Fonctionnalités

- Bilingue FR/EN (détection auto + switcher)
- Scores locaux (localStorage) + scores distants / classements via D1
- Classements période (semaine / mois) + signalement de pseudo
- Streak, freezes, succès, maîtrise (vague v1.12)
- Revue d’erreurs / weak spots, CTA Pixfan / newsletter
- PWA (manifest, service worker, install prompt)
- Admin minimal `#/admin` (édition session + export JSON) si `VITE_ADMIN_PIN` est défini au **build**
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

`VITE_*` sont injectées **au build**. Sur Cloudflare Pages, les définir dans **Settings → Environment variables** (Production), puis **rebuilder**.

## Contenu : ajouter des questions

Éditer `public/data/questions.json`. Chaque chaîne utilisateur doit avoir `fr` et `en`. Voir aussi `#/admin` (export JSON) une fois le PIN configuré.

## Déploiement Cloudflare

Guides détaillés : [`DEPLOYMENT.md`](./DEPLOYMENT.md), [`GUIDE_DEPLOIEMENT.md`](./GUIDE_DEPLOIEMENT.md).

Points ops fréquents (P0) :

1. **Migration D1 004** (classements période + reports) — voir [`migrations/README.md`](./migrations/README.md)  
   `npm run db:migrate:004` puis `npm run db:verify:004`
2. **`VITE_ADMIN_PIN`** en variable de build Pages Production, puis redéploiement
3. Binding D1 `DB` → `quiz-pixfan-scores` sur le projet Pages

## Licence

Projet démo / Pixfan — polices système ; crédits images dans le JSON quand présents.

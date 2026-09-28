# Prochaines étapes — Quiz PixFan

Document à jour avec l’état réel du dépôt (**v1.17.4**).

## ✅ Livré

- Contenu : **14 quiz · 365 questions · 256 illustrées** (`public/data/questions.json`), dont packs **`marques-photo`** (Histoire des marques) et **`flash-studio`** (Flash & studio)
- Pédagogie : difficultés filtrables, revue des erreurs / weak spots (SRS léger)
- Engagement : défi du jour, duel, succès (photo-reader · vault-clear · streak-14 + badges saison), streak + freezes, **maîtrise** + home featured, saisons
- Classement : tout temps + saisons semaine/mois, signalement de pseudo (API + migration `004`)
- Compte léger : code de récupération + sync streak / succès / high scores / **vault** / badges saison (migrations `005` + `006`)
- Produit : CTA pixfan.com + newsletter, modes photo-reading / mix / aléatoire, guides ↔ quiz (9 topics locaux : exposition, composition, lumière, retouche, smartphone, genres, matériel, droits, histoire) + BreadcrumbList
- Technique : **PWA** (manifest, SW, install prompt), footer i18n, **admin** `#/admin` (export JSON, signalements, analytics habit + modes)

## 🔜 Ops prod (P0 — reste live)

- [x] Migration D1 `004` (période + reports) — appliquée en prod
- [x] `VITE_ADMIN_PIN` en **build** Pages / CI (SPA `#/admin`)
- [x] **`ADMIN_PIN` (+ `VITE_ADMIN_PIN`) runtime Pages Functions** — vérifié live 2026-09-20 (`/api/admin/analytics` + `/reports` → 200). Docs : `DEPLOYMENT.md` § Admin PIN runtime ; code distingue 503 (absent) vs 401 (mauvais PIN) après merge.
- [x] Rate-limit `create_code` / `redeem` sur `/api/account` (repo)
- [ ] **Lire Admin Analytics 7–14 j post v1.17.4** (habit funnel, modes `mix`/`random` séparés, CTA) — checklist dans `vague-1-16` § P0.3 ; **ne pas inventer de chiffres** ; Web Push = **non par défaut** tant que non remplie
- [x] Rate-limit soft `POST /api/analytics` (Cache API / IP, 1 s) — repo vague 1.17 P0
- [x] Admin modes : ventiler `mix-*` / `random-mix` hors `packs` — **client + Functions** (`functions/lib/attemptModes.ts`, vague 1.18 P0)
- [x] Docs headline → **v1.17.4** + marques + 9 guides (vague 1.18 P0)
- [x] Sitemap harden (`_redirects` SEO exceptions + `_headers` MIME) + `lastmod` 2026-09-27 (vague 1.18 P0)

## 🔜 Suite produit possible

- [ ] **Re-vérifier** migration D1 `006` en prod (`npm run db:verify:006`) — colonnes `vault_json` / `season_badges_json` (appliquée 2026-09-20 ; pas de re-migrate)
- [x] Enrichir images packs sous-illustrés + quiz `portrait-light` + rebalance `history-icons` (vague 1.16 P3)
- [x] SRS vault + CTA weak-spots (vague 1.16 P2)
- [x] BreadcrumbList guides + succès manquants (vague 1.16 P1.4 / P2.3)
- [x] Guides droits / matériel / histoire (vague 1.17 P2)
- [x] Densifier illus packs + allonger Lightroom / portrait + OG thèmes (vague 1.17 P4.A/B/D)
- [x] Pack **`marques-photo`** (vague 1.17 P4.C / post-wave) — livré live depuis v1.17.1+
- [x] Pack **`flash-studio`** (vague 1.18 P4 — 14ᵉ quiz) — Flash & studio

Contenu : `public/data/questions.json`. Priorisation : docs vague / release notes hors dépôt.

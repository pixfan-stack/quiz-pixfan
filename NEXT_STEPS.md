# Prochaines étapes — Quiz PixFan

Document à jour avec l’état réel du dépôt (**v1.15.0**).

## ✅ Livré

- Contenu : **12 quiz · 305 questions · 164 illustrées** (`public/data/questions.json`)
- Pédagogie : difficultés filtrables, revue des erreurs / weak spots
- Engagement : défi du jour, duel, succès, streak + freezes, **maîtrise** + home featured, saisons
- Classement : tout temps + saisons semaine/mois, signalement de pseudo (API + migration `004`)
- Compte léger : code de récupération + sync streak / succès / high scores / **vault** / badges saison (migrations `005` + `006`)
- Produit : CTA pixfan.com + newsletter, modes photo-reading / mix / aléatoire, guides ↔ quiz (dont **genres**)
- Technique : **PWA** (manifest, SW, install prompt), footer i18n, **admin** `#/admin` (export JSON, signalements, analytics habit + modes)

## 🔜 Ops prod (P0 — reste live)

- [x] Migration D1 `004` (période + reports) — appliquée en prod
- [x] `VITE_ADMIN_PIN` en **build** Pages / CI (SPA `#/admin`)
- [x] **`ADMIN_PIN` (+ `VITE_ADMIN_PIN`) runtime Pages Functions** — vérifié live 2026-09-20 (`/api/admin/analytics` + `/reports` → 200). Docs : `DEPLOYMENT.md` § Admin PIN runtime ; code distingue 503 (absent) vs 401 (mauvais PIN) après merge.
- [x] Rate-limit `create_code` / `redeem` sur `/api/account` (repo)

## 🔜 Suite produit possible

- [ ] Appliquer migration D1 `006` en prod (vault + badges saison) si pas encore fait
- [x] Enrichir images packs sous-illustrés + quiz `portrait-light` + rebalance `history-icons` (vague 1.16 P3)
- [x] SRS vault + CTA weak-spots (vague 1.16 P2)
- [ ] BreadcrumbList guides + éventuel guide droits (vague 1.16 P1.4 / P1.3 suite)

Contenu : `public/data/questions.json`. Priorisation : [`vague-1-16`](docs hors dépôt) / release notes.

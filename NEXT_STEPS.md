# Prochaines étapes — Quiz PixFan

Document à jour avec l’état réel du dépôt (**v1.21.0**).

## ✅ Livré

- Contenu : **15 quiz · 386 questions · 268 illustrées** (`public/data/questions.json`), dont packs **`marques-photo`**, **`flash-studio`** et **`lexique-image-fixe`** (Lexique image fixe · scolaires)
- Vague **1.21** : fiche enseignant EN · photo-reading → CTA composition · copy histoire↔marques · docs v1.20.0 (puis bump **v1.21.0**)
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
- [x] **Vague 1.20 ops — Admin Analytics lu** (2026-09-29) — chiffres réels ; **Web Push / salon / 16ᵉ pack = no-go** (volume insuffisant). Doc store `ops-admin-1-20`. Re-lire slots CTA primary/secondary dans ~7–14 j post-1.20.
- [x] Rate-limit soft `POST /api/analytics` (Cache API / IP, 1 s) — repo vague 1.17 P0
- [x] Admin modes : ventiler `mix-*` / `random-mix` hors `packs` — **client + Functions** (`functions/lib/attemptModes.ts`, vague 1.18 P0)
- [x] Docs headline → **v1.21.0** + 15 quiz · 386 Q · 268 illus (vague 1.21 release + 1.22 P0)
- [x] Sitemap harden (`_redirects` SEO exceptions + `_headers` MIME) + `/s/lexique-image-fixe` + `lastmod` home/scolaires ≥ 2026-09-30 (vague 1.19–1.22)

### Ops Antony — checklist P0.4 (hors code)

Lecture **faite** 2026-09-29 (all-time + 14 j) — voir `ops-admin-1-20`. Web Push / salon / 16ᵉ restent **non**. À re-lire : slots CTA `primary`/`secondary`/`newsletter` (post-1.20) + funnel c4.

- [x] Date de lecture analytics : **2026-09-29** (all-time + `recentDays` 14 j)
- [x] Habit funnel : `reminder_*` / `ics` / `pwa_install` = **0** → push no-go
- [x] Modes : photo-reading dominant · packs 9 · lexique 0 · mix/duel 0
- [x] Scolaires : hub 7 · parcours 2 (c4 = 0) → salon no-go
- [x] CTA : conversion **0,4 %** · slots v1.20 encore à 0 (legacy 2)
- [x] Décision Web Push : **non** — 2026-09-29
- [ ] **`npm run db:verify:006`** (prod) — pass/fail colonnes `vault_json` / `season_badges_json` : ________

## 🔜 Suite produit possible

- [ ] **Re-vérifier** migration D1 `006` en prod (`npm run db:verify:006`) — colonnes `vault_json` / `season_badges_json` (appliquée 2026-09-20 ; pas de re-migrate) — même item que checklist P0.4 ci-dessus
- [x] Enrichir images packs sous-illustrés + quiz `portrait-light` + rebalance `history-icons` (vague 1.16 P3)
- [x] SRS vault + CTA weak-spots (vague 1.16 P2)
- [x] BreadcrumbList guides + succès manquants (vague 1.16 P1.4 / P2.3)
- [x] Guides droits / matériel / histoire (vague 1.17 P2)
- [x] Densifier illus packs + allonger Lightroom / portrait + OG thèmes (vague 1.17 P4.A/B/D)
- [x] Pack **`marques-photo`** (vague 1.17 P4.C / post-wave) — livré live depuis v1.17.1+
- [x] Pack **`flash-studio`** (vague 1.18 P4 — 14ᵉ quiz) — Flash & studio

Contenu : `public/data/questions.json`. Priorisation : docs vague / release notes hors dépôt.

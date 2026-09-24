# Prochaines étapes — Quiz PixFan

Document à jour avec l’état réel du dépôt (**v1.16.1**).

## ✅ Livré

- Contenu : **12 quiz · 317 questions · 199 illustrées** (`public/data/questions.json`)
- Pédagogie : difficultés filtrables, revue des erreurs / weak spots (SRS léger)
- Engagement : défi du jour, duel, succès (photo-reader · vault-clear · streak-14 + badges saison), streak + freezes, **maîtrise** + home featured, saisons
- Classement : tout temps + saisons semaine/mois, signalement de pseudo (API + migration `004`)
- Compte léger : code de récupération + sync streak / succès / high scores / **vault** / badges saison (migrations `005` + `006`)
- Produit : CTA pixfan.com + newsletter, modes photo-reading / mix / aléatoire, guides ↔ quiz (dont **genres**) + BreadcrumbList
- Technique : **PWA** (manifest, SW, install prompt), footer i18n, **admin** `#/admin` (export JSON, signalements, analytics habit + modes)

## 🔜 Ops prod (P0 — reste live)

- [x] Migration D1 `004` (période + reports) — appliquée en prod
- [x] `VITE_ADMIN_PIN` en **build** Pages / CI (SPA `#/admin`)
- [x] **`ADMIN_PIN` (+ `VITE_ADMIN_PIN`) runtime Pages Functions** — vérifié live 2026-09-20 (`/api/admin/analytics` + `/reports` → 200). Docs : `DEPLOYMENT.md` § Admin PIN runtime ; code distingue 503 (absent) vs 401 (mauvais PIN) après merge.
- [x] Rate-limit `create_code` / `redeem` sur `/api/account` (repo)
- [ ] **Lire Admin Analytics 7–14 j post v1.16.1** (habit funnel, modes, CTA) — checklist dans `vague-1-16` § P0.3 ; **ne pas inventer de chiffres**
- [x] Rate-limit soft `POST /api/analytics` (Cache API / IP, 1 s) — repo vague 1.17 P0
- [x] Admin modes : ventiler `mix-*` / `random-mix` hors `packs` — repo vague 1.17 P0

## 🔜 Suite produit possible

- [ ] Appliquer migration D1 `006` en prod (vault + badges saison) si pas encore fait
- [x] Enrichir images packs sous-illustrés + quiz `portrait-light` + rebalance `history-icons` (vague 1.16 P3)
- [x] SRS vault + CTA weak-spots (vague 1.16 P2)
- [x] BreadcrumbList guides + succès manquants (vague 1.16 P1.4 / P2.3)
- [x] Guides droits / matériel / histoire (vague 1.17 P2)
- [x] Densifier illus packs + allonger Lightroom / portrait + OG thèmes (vague 1.17 P4.A/B/D)
- [ ] Éventuel +1 quiz thématique (vague 1.17 P4.C — optionnel, data-driven)

Contenu : `public/data/questions.json`. Priorisation : docs vague / release notes hors dépôt.

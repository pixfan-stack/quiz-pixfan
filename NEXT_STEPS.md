# Prochaines étapes — Quiz PixFan

Document à jour avec l’état réel du dépôt (**v1.12.0**).

## ✅ Livré

- Contenu : **11 quiz · 285 questions · ~97 illustrées** (`public/data/questions.json`)
- Pédagogie : difficultés filtrables, revue des erreurs / weak spots
- Engagement : défi du jour, duel, succès, streak + freezes, **maîtrise** + home featured (v1.12)
- Classement : tout temps + saisons semaine/mois, signalement de pseudo (API + migration `004`)
- Produit : CTA pixfan.com + newsletter, modes photo-reading / mix / aléatoire
- Technique : **PWA** (manifest, SW, install prompt), footer i18n, **admin** `#/admin` (export JSON)

## 🔜 Ops prod (P0 — à faire hors repo)

- [ ] Appliquer / vérifier la migration D1 `004-period-leaderboard-reports.sql` en prod  
      → `npm run db:migrate:004` puis `npm run db:verify:004` (détail : `migrations/README.md`)
- [ ] Définir `VITE_ADMIN_PIN` dans Cloudflare Pages (build Production) et **rebuilder** pour activer `#/admin`

## 🔜 Suite produit possible

- [x] Compte léger / sync multi-appareil (code de récupération + sync streak/succès/high scores)
- [ ] Enrichir images sur quiz techniques + CTA post-score mesurés
- [x] Rééquilibrer difficultés (peu de « hard ») / +1 quiz thématique Pixfan (P2)
- [ ] UI admin des `name_reports` ; découpage gros composants

Contenu : `public/data/questions.json`. Priorisation détaillée hors dépôt si besoin.

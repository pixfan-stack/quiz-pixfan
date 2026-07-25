# Prochaines étapes — Quiz PixFan

Document à jour avec l’état réel du dépôt (v1.10+).

## ✅ Livré

- Contenu : **9 quiz × 20** (180 questions), illustrations (~32)
- Pédagogie : difficultés filtrables, revue des erreurs
- Engagement : défi du jour, duel, succès
- Classement : saisons / semaine / tout temps, signalement
- Produit : CTA pixfan.com + newsletter
- Technique : **PWA** (manifest, icônes, SW v5, install prompt), **footer i18n**, **admin minimal** (`#/admin`, export JSON)

## 🔜 Suite possible

- [ ] Déployer ce lot sur `main` (+ migration D1 `004-period-leaderboard-reports.sql`)
- [ ] Définir `VITE_ADMIN_PIN` en prod pour activer l’éditeur
- [ ] Compte léger / sync multi-appareil

Contenu : `public/data/questions.json`.

# Prochaines étapes — Quiz PixFan

Document à jour avec l’état réel du dépôt (v1.8+).

## ✅ Livré

- Contenu : **9 quiz × 20** (180 questions), illustrations (~32), catégories **Smartphone**, **Droits & éthique**, **Retouche**
- Pédagogie : niveaux **facile / intermédiaire / difficile**, filtre + mix par niveau, revue des erreurs
- Engagement : **défi du jour** + streak journalier, **duel entre amis** (lien `#/quiz/duel-…`), **succès** locaux
- Classement : multi-joueurs, **saison mensuelle** / semaine / tout temps, **signalement** de pseudos
- Gameplay : timer, mode focus, mix aléatoire, badges
- Popup pseudo, analytics D1, deep links, PWA légère

## 🔜 Suite possible

- [ ] Déployer ce lot sur `main` (+ migration D1 `004-period-leaderboard-reports.sql`)
- [ ] CTA pixfan.com contextualisé après un quiz
- [ ] Admin léger d’édition de questions

Contenu : `public/data/questions.json`.

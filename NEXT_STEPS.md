# Prochaines étapes — Quiz PixFan

Document à jour avec l’état réel du dépôt (v1.9+).

## ✅ Livré

- Contenu : **9 quiz × 20** (180 questions), illustrations (~32), catégories **Smartphone**, **Droits & éthique**, **Retouche**
- Pédagogie : niveaux **facile / intermédiaire / difficile**, filtre + mix par niveau, revue des erreurs
- Engagement : **défi du jour** + streak journalier, **duel entre amis**, **succès** locaux
- Classement : multi-joueurs, **saison / semaine / tout temps**, **signalement** de pseudos
- Produit : **CTA pixfan.com contextualisé** post-quiz + lien **newsletter**
- Gameplay : timer, mode focus, mix aléatoire, badges, deep links, PWA légère

## 🔜 Suite possible

- [ ] Déployer ce lot sur `main` (+ migration D1 `004-period-leaderboard-reports.sql`)
- [ ] Admin léger d’édition de questions
- [ ] Compte léger / sync multi-appareil (au-delà de la newsletter)

Contenu : `public/data/questions.json`.

# Prochaines étapes — Quiz PixFan

Document à jour avec l’état réel du dépôt (v1.4+).

## ✅ Livré

- Contenu : 6 quiz × 20 questions, FR/EN, illustrations optionnelles (`imageUrl`)
- Gameplay : timer, mode focus, mix aléatoire, badges de résultat, export image, partage + deep link
- Classement : D1 `player_highscores`, popup pseudo, rang joueur
- Analytics : D1 `quiz_attempts` + `/api/analytics` + compteur de parties sur les cartes
- UX : dark mode, deep links `#/quiz/{id}`, prefetch, Enter pour valider
- Qualité : Vitest, Playwright, CI (typecheck, lint, e2e, deploy Pages)
- Offline : service worker + cache `questions.json`
- API : rate limit POST scores, filtre pseudo élargi

## 🔜 Court terme

- [ ] **Déployer** les commits locaux sur `main` (CI production)
- [ ] **Migration D1 003** en prod : `migrations/003-quiz-attempts.sql`
- [ ] Ajouter plus d’illustrations aux questions restantes
- [ ] Nouvelle catégorie de contenu (retouche / smartphone / droits)

## 📋 Maintenance

```bash
npm run dev
npm run build
npm test
npm run test:e2e
npm run lint
```

### D1

```bash
wrangler d1 execute quiz-pixfan-scores --remote --file=migrations/002-player-leaderboard.sql
wrangler d1 execute quiz-pixfan-scores --remote --file=migrations/003-quiz-attempts.sql
```

Contenu quiz : `public/data/questions.json`.

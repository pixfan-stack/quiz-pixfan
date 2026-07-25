# 🚀 Guide de déploiement Cloudflare pour Quiz PixFan

## 📋 Prérequis

1. Compte Cloudflare (gratuit)
2. Node.js et npm installés
3. Wrangler CLI installée : `npm install -g wrangler`
4. Repository GitHub lié à Cloudflare Pages

## 🔧 Configuration du backend D1

### Étape 1 : Créer la base de données D1

```bash
# Se connecter à Cloudflare
wrangler login

# Créer une base de données D1
wrangler d1 create quiz-pixfan-scores
```

Cela va retourner un `DATABASE_ID` (ex: `abc123-def456-ghi789`).

### Étape 2 : Initialiser le schéma

```bash
# Exécuter le script SQL d'initialisation
wrangler d1 execute quiz-pixfan-scores --file=setup-schema.sql
```

**Déploiements D1 existants** : après la mise à jour multi-joueurs, exécutez aussi la migration :

```bash
wrangler d1 execute quiz-pixfan-scores --remote --file=migrations/002-player-leaderboard.sql
```

(L’option `--remote` cible la base de production ; omettez-la pour l’environnement local.)

### Étape 3 : Configurer wrangler.toml

Remplacez `YOUR_D1_DATABASE_ID_HERE` par l'ID obtenu à l'étape 1 :

```toml
[d1_databases]
binding = "DB"
database_name = "quiz-pixfan-scores"
database_id = "VOTRE_DATABASE_ID_ICI"
```

### Étape 4 : Activer les scores distants

Créez un fichier `.env` local :

```bash
VITE_ENABLE_REMOTE_SCORES=true
VITE_APP_URL=https://quiz-pixfan.pages.dev
```

## 🌐 Déploiement sur Cloudflare Pages

### Option A : Déploiement via Git (recommandé)

1. Pushez votre code sur GitHub/GitLab
2. Dans Cloudflare Dashboard > Pages > Create a project
3. Connectez votre repository
4. Configurez :
   - **Project name**: `quiz-pixfan`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
5. Ajoutez les variables d'environnement :
   - `VITE_ENABLE_REMOTE_SCORES`: `true`
   - `VITE_APP_URL`: `https://quiz-pixfan.pages.dev`
6. Liez la base de données D1 :
   - **Binding name**: `DB`
   - **Database**: `quiz-pixfan-scores`
7. Cliquez sur "Save and Deploy"

### Option B : Déploiement manuel via Wrangler

```bash
# Build production
npm run build

# Déployer sur Cloudflare Pages
wrangler pages deploy dist
```

## 🧪 Test du déploiement

### Vérifier l'API

```bash
# Tester GET /api/highscore
curl "https://your-site.pages.dev/api/highscore?quizId=exposure-basics"

# Tester POST /api/highscore
curl -X POST "https://your-site.pages.dev/api/highscore" \
  -H "Content-Type: application/json" \
  -d '{"quizId":"exposure-basics","percentage":85,"correctCount":17,"totalQuestions":20}'
```

### Vérifier la base de données

```bash
# Voir les scores stockés
wrangler d1 execute quiz-pixfan-scores --command="SELECT * FROM highscores;"

# Voir les statistiques
wrangler d1 execute quiz-pixfan-scores --command="SELECT * FROM quiz_analytics;"
```

## 🔄 Migration depuis localStorage

Si vous avez déjà des scores locaux à migrer :

```javascript
// Exécutez ceci dans la console du navigateur
const localScores = JSON.parse(localStorage.getItem('quiz-pixfan-highscores') || '{}');

for (const [quizId, score] of Object.entries(localScores)) {
  await fetch('/api/highscore', {
    method: 'POST',
    headers: { 'Content-Type': ' application/json' },
    body: JSON.stringify({
      quizId,
      percentage: score.percentage,
      correctCount: score.correctCount,
      totalQuestions: score.totalQuestions,
    }),
  });
}
```

## 📊 Monitoring et analytics

### Tableaux de bord recommandés

1. **Scores par quiz** : Visualiser les quiz les plus populaires
2. **Taux de réussite** : Identifier les questions difficiles
3. **Temps moyen** : Analyser l'engagement utilisateur
4. **Leaderboards** : Motiver la compétition

### Requêtes utiles

```sql
-- Quiz les plus joués
SELECT quiz_id, COUNT(*) as attempts 
FROM highscores 
GROUP BY quiz_id 
ORDER BY attempts DESC;

-- Meilleurs scores par quiz
SELECT quiz_id, MAX(percentage) as best_score 
FROM highscores 
GROUP BY quiz_id;

-- Score moyen par quiz
SELECT quiz_id, AVG(percentage) as avg_score 
FROM highscores 
GROUP BY quiz_id;
```

## 🔒 Sécurité et bonnes pratiques

1. **CORS** : L'API est configurée pour accepter les requêtes cross-origin
2. **Validation** : Les scores sont validés côté serveur
3. **Rate limiting** : Configurez dans Cloudflare Dashboard si nécessaire
4. **Monitoring** : Activez les logs dans Cloudflare Pages

## 🆘 Dépannage

### Problèmes courants

1. **"D1 not bound"** : Vérifiez que la base est liée dans wrangler.toml
2. **"CORS error"** : Vérifiez les headers CORS dans l'API
3. **"Score not saving"** : Vérifiez que `VITE_ENABLE_REMOTE_SCORES=true`
4. **"Build failed"** : Vérifiez les erreurs TypeScript avec `npm run typecheck`

### Logs et debugging

```bash
# Voir les logs Cloudflare
wrangler pages deployment logs

# Tester localement avec D1
npx wrangler pages dev dist
```

## 📈 Scaling et optimisation

### Pour plus de trafic

1. Activez le cache Cloudflare
2. Optimisez les requêtes SQL
3. Utilisez des vues materialisées pour les analytics
4. Configurez le rate limiting

### Pour moins de coûts

1. D1 est gratuit jusqu'à 5M lectures/jour
2. Les Pages Functions ont un quota généreux
3. Le cache Cloudflare réduit les coûts de bande passante

## 🎉 Félicitations !

Votre application Quiz PixFan est maintenant déployée avec un backend Cloudflare complet pour les high scores cross-device !

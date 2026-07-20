# 🚀 Guide de Déploiement Cloudflare - Quiz PixFan

## 📋 Prérequis

1. **Compte Cloudflare** : Créez un compte gratuit sur [cloudflare.com](https://cloudflare.com)
2. **Node.js & npm** : Vérifié sur votre système (v26.4.0)
3. **Wrangler CLI** : Installé globalement (`npm install -g wrangler`)
4. **Repository Git** : Votre code doit être pushé sur GitHub/GitLab

## ⚡ Déploiement Rapide (Automatisé)

### Option 1 : Script automatique

```bash
cd /Users/antonybarroux/Documents/dev/quizz-pixfan
./deploy.sh
```

Ce script va :
1. Vous connecter à Cloudflare
2. Créer la base de données D1
3. Configurer wrangler.toml
4. Initialiser le schéma
5. Construire l'application
6. Déployer sur Cloudflare Pages

### Option 2 : Déploiement manuel étape par étape

## 📝 Déploiement Manuel Détaillé

### Étape 1 : Connexion à Cloudflare

```bash
wrangler login
```

Ceci va ouvrir votre navigateur pour autoriser l'accès à votre compte Cloudflare.

### Étape 2 : Créer la base de données D1

```bash
wrangler d1 create quiz-pixfan-scores
```

**Note** : Copiez l'ID de la base de données qui sera affiché (format: `abc123-def456-ghi789`)

### Étape 3 : Configurer wrangler.toml

Remplacez `YOUR_D1_DATABASE_ID_HERE` par l'ID obtenu à l'étape 2 :

```toml
[d1_databases]
binding = "DB"
database_name = "quiz-pixfan-scores"
database_id = "VOTRE_ID_ICI"
```

### Étape 4 : Initialiser le schéma de la base de données

```bash
wrangler d1 execute quiz-pixfan-scores --file=setup-schema.sql
```

Cela va créer :
- Table `highscores` avec contraintes
- Index pour les performances
- Vues pour le leaderboard et les analytics

### Étape 5 : Construire l'application

```bash
npm run build
```

Vérifiez que le build se termine sans erreur.

### Étape 6 : Déployer sur Cloudflare Pages

```bash
wrangler pages deploy dist
```

Cela va déployer :
- Les fichiers statiques (HTML, CSS, JS)
- Les Cloudflare Pages Functions (`functions/api/highscore.ts`)

### Étape 7 : Vérifier le déploiement

```bash
# Tester l'API GET
curl "https://your-site.pages.dev/api/highscore?quizId=exposure-basics"

# Tester l'API POST
curl -X POST "https://your-site.pages.dev/api/highscore" \
  -H "Content-Type: application/json" \
  -d '{
    "quizId": "exposure-basics",
    "percentage": 85,
    "correctCount": 17,
    "totalQuestions": 20
  }'
```

## 🌐 Déploiement via Git (Recommandé)

### Configuration du repository

1. **Push sur GitHub/GitLab** :
   ```bash
   git add .
   git commit -m "Configure Cloudflare backend with D1"
   git push origin main
   ```

2. **Connecter à Cloudflare Pages** :
   - Allez sur [cloudflare.com/pages](https://developers.cloudflare.com/pages/)
   - Cliquez sur "Create a project"
   - Sélectionnez votre repository
   - Configurez :
     - **Project name**: `quiz-pixfan`
     - **Production branch**: `main`
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - **Root directory**: `/`

3. **Configurer les variables d'environnement** :
   - `VITE_ENABLE_REMOTE_SCORES`: `true`
   - `VITE_APP_URL`: `https://quiz-pixfan.pages.dev`

4. **Lier la base de données D1** :
   - **Binding name**: `DB`
   - **Database**: `quiz-pixfan-scores`

5. **Déployer** :
   - Cliquez sur "Save and Deploy"
   - Cloudflare va automatiquement build et déployer

## 🔧 Configuration Avancée

### Domaine personnalisé

1. Allez dans Cloudflare Dashboard > Pages > quiz-pixfan
2. Cliquez sur "Custom domains"
3. Ajoutez votre domaine (ex: `quiz.pixfan.com`)
4. Configurez les enregistrements DNS

### Variables d'environnement

Créez un fichier `.env.production` :

```bash
VITE_APP_URL=https://your-custom-domain.com
VITE_ENABLE_REMOTE_SCORES=true
```

### Monitoring

Activez les logs dans Cloudflare Dashboard :
- Pages > quiz-pixfan > Settings > Logs
- Configurez les alertes pour les erreurs

## 🧪 Tests Post-Déploiement

### Test de l'application

1. **Accéder à l'application** :
   ```
   https://your-site.pages.dev
   ```

2. **Tester un quiz** :
   - Sélectionnez un quiz
   - Répondez aux questions
   - Vérifiez que les scores sont sauvegardés

3. **Tester les scores cross-device** :
   - Jouez sur un appareil
   - Vérifiez le score sur un autre appareil

### Test de l'API

```bash
# Voir tous les scores
curl https://your-site.pages.dev/api/leaderboard

# Filtrer par quiz
curl "https://your-site.pages.dev/api/leaderboard?quizId=exposure-basics&limit=5"
```

## 🆘 Dépannage

### Problèmes courants

1. **"D1 not bound"**
   - Vérifiez que `database_id` est correct dans wrangler.toml
   - Redéployez après correction

2. **"CORS error"**
   - Vérifiez les headers CORS dans `functions/api/highscore.ts`
   - Le fichier est déjà configuré correctement

3. **"Build failed"**
   - Vérifiez les erreurs TypeScript : `npm run typecheck`
   - Assurez-vous que toutes les dépendances sont installées

4. **"Score not saving"**
   - Vérifiez que `VITE_ENABLE_REMOTE_SCORES=true`
   - Testez l'API manuellement avec curl

### Logs et debugging

```bash
# Voir les logs Cloudflare
wrangler pages deployment logs

# Tester localement avec D1
npx wrangler pages dev dist

# Voir les données D1
wrangler d1 execute quiz-pixfan-scores --command="SELECT * FROM highscores;"
```

## 📊 Monitoring et Analytics

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

## 🎉 Félicitations !

Votre application Quiz PixFan est maintenant déployée avec un backend Cloudflare complet pour les high scores cross-device !

### Prochaines étapes

1. **Configurer un domaine personnalisé**
2. **Activer le cache Cloudflare**
3. **Mettre en place le monitoring**
4. **Collecter les retours utilisateurs**

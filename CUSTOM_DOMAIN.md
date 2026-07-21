# 🌐 Configuration du domaine personnalisé quiz.pixfan.fr

## Étape 1 : Configurer le domaine dans Cloudflare Pages

1. Allez sur [Cloudflare Dashboard > Pages](https://dash.cloudflare.com)
2. Cliquez sur `quiz-pixfan`
3. Cliquez sur **"Custom domains"** dans le menu de gauche
4. Cliquez sur **"Set up a custom domain"**
5. Entrez `quiz.pixfan.fr`
6. Cloudflare va configurer automatiquement le DNS

## Étape 2 : Configurer le DNS (si nécessaire)

Si le domaine `pixfan.fr` est déjà hébergé sur Cloudflare :
- Cloudflare détectera automatiquement les enregistrements
- Un certificat SSL sera provisionné automatiquement

Si le domaine est hébergé ailleurs :
- Ajoutez un enregistrement CNAME : `quiz → quiz-pixfan.pages.dev`
- Ou un enregistrement A vers l'IP de Cloudflare Pages

## Étape 3 : Vérifier le déploiement

```bash
# Tester le domaine personnalisé
curl -sI "https://quiz.pixfan.fr/"

# Vérifier les headers SEO
curl -s "https://quiz.pixfan.fr/" | grep -E '(canonical|og:|twitter:)'
```

## Étape 4 : Mettre à jour les variables d'environnement

Dans Cloudflare Dashboard > Pages > quiz-pixfan > Settings > Environment variables :
- `VITE_APP_URL` = `https://quiz.pixfan.fr`
- `VITE_ENABLE_REMOTE_SCORES` = `true`

## Vérifications SEO

Après déploiement, vérifiez :
- ✅ Canonical URL → `https://quiz.pixfan.fr`
- ✅ OG URL → `https://quiz.pixfan.fr`
- ✅ Schema.org URL → `https://quiz.pixfan.fr`
- ✅ Manifest PWA → `/manifest.json`
- ✅ Service Worker → `/sw.js`
- ✅ Meta tags Twitter Card
- ✅ Thème color → `#4f46e5`

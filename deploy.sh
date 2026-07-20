#!/bin/bash
# Guide de déploiement interactif pour Quiz PixFan sur Cloudflare

echo "🚀 GUIDE DE DÉPLOIEMENT - QUIZ PIXFAN"
echo "========================================"
echo ""

# Étape 1 : Connexion Cloudflare
echo "📝 ÉTAPE 1 : Connexion à Cloudflare"
echo "------------------------------------"
echo "Ceci va ouvrir votre navigateur pour vous connecter à Cloudflare."
read -p "Voulez-vous continuer ? (o/n) " confirm
if [ "$confirm" != "o" ]; then
    echo "Annulé."
    exit 1
fi

wrangler login
echo "✅ Connecté à Cloudflare !"
echo ""

# Étape 2 : Créer la base de données D1
echo "📝 ÉTAPE 2 : Créer la base de données D1"
echo "-----------------------------------------"
echo "Ceci va créer une base de données D1 appelée 'quiz-pixfan-scores'."
read -p "Voulez-vous continuer ? (o/n) " confirm
if [ "$confirm" != "o" ]; then
    echo "Annulé."
    exit 1
fi

echo "Création de la base de données..."
DB_OUTPUT=$(wrangler d1 create quiz-pixfan-scores)
DB_ID=$(echo "$DB_OUTPUT" | grep -oP '⛓️  Database ID: \K.*' || echo "")

if [ -z "$DB_ID" ]; then
    echo "❌ Erreur lors de la création de la base de données."
    echo "Sortie brute :"
    echo "$DB_OUTPUT"
    exit 1
fi

echo "✅ Base de données créée !"
echo "🔑 DATABASE_ID: $DB_ID"
echo ""

# Étape 3 : Mettre à jour wrangler.toml
echo "📝 ÉTAPE 3 : Configurer wrangler.toml"
echo "--------------------------------------"
echo "Mise à jour du fichier wrangler.toml avec l'ID de la base de données..."

# Sauvegarder le fichier original
cp wrangler.toml wrangler.toml.backup

# Remplacer l'ID de la base de données
sed -i.bak "s/YOUR_D1_DATABASE_ID_HERE/$DB_ID/g" wrangler.toml
rm wrangler.toml.backup

echo "✅ wrangler.toml mis à jour !"
echo ""

# Étape 4 : Initialiser le schéma
echo "📝 ÉTAPE 4 : Initialiser le schéma de la base de données"
echo "----------------------------------------------------------"
echo "Ceci va créer les tables et index nécessaires."
read -p "Voulez-vous continuer ? (o/n) " confirm
if [ "$confirm" != "o" ]; then
    echo "Annulé."
    exit 1
fi

echo "Initialisation du schéma..."
wrangler d1 execute quiz-pixfan-scores --file=setup-schema.sql
echo "✅ Schéma initialisé !"
echo ""

# Étape 5 : Construire l'application
echo "📝 ÉTAPE 5 : Construire l'application"
echo "-------------------------------------"
echo "Compilation TypeScript et build Vite..."
npm run build
echo "✅ Build terminé !"
echo ""

# Étape 6 : Déployer
echo "📝 ÉTAPE 6 : Déployer sur Cloudflare Pages"
echo "-------------------------------------------"
echo "Déploiement de l'application et des functions..."
read -p "Voulez-vous continuer ? (o/n) " confirm
if [ "$confirm" != "o" ]; then
    echo "Annulé."
    exit 1
fi

echo "Déploiement en cours..."
wrangler pages deploy dist
echo "✅ Déploiement terminé !"
echo ""

# Résumé
echo "🎉 DÉPLOIEMENT TERMINÉ !"
echo "========================"
echo ""
echo "📊 Récapitulatif :"
echo "  - Base de données D1 : quiz-pixfan-scores"
echo "  - Database ID : $DB_ID"
echo "  - Application déployée sur Cloudflare Pages"
echo ""
echo "🔗 Prochaines étapes :"
echo "  1. Vérifier le déploiement dans le dashboard Cloudflare"
echo "  2. Tester l'API avec : curl https://your-site.pages.dev/api/highscore?quizId=exposure-basics"
echo "  3. Configurer le domaine personnalisé si nécessaire"
echo ""
echo "📖 Documentation :"
echo "  - Guide complet : DEPLOYMENT.md"
echo "  - Schéma SQL : setup-schema.sql"
echo "  - Configuration : wrangler.toml"

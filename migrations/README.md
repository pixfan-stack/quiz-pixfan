# Migrations D1 — Quiz PixFan

Schéma complet (install neuve) : `../setup-schema.sql` (inclut déjà les tables de la migration 004).

Sur une base **déjà en prod**, appliquer les fichiers manquants dans l’ordre :

| Fichier | Contenu |
|---------|---------|
| `002-player-leaderboard.sql` | `player_highscores` |
| `003-quiz-attempts.sql` | `quiz_attempts` |
| `004-period-leaderboard-reports.sql` | `period_highscores` + `name_reports` |
| `005-account-sync.sql` | `player_progress` + `player_recovery_codes` |
| `006-vault-season-sync.sql` | `player_progress.vault_json` + `season_badges_json` |

## Appliquer la 004 (prod)

```bash
# depuis la racine du dépôt, après `npx wrangler login`
npm run db:migrate:004
```

Équivalent :

```bash
npx wrangler d1 execute quiz-pixfan-scores --remote \
  --file=migrations/004-period-leaderboard-reports.sql
```

Sans `--remote`, la commande cible l’environnement local Wrangler.

## Vérifier que la 004 est bien en place

```bash
npm run db:verify:004
```

Attendu : deux lignes `name_reports` et `period_highscores`.

Si les tables manquent, les classements semaine/mois et le signalement de pseudo restent en échec côté API (logs `migration 004?`).

## Appliquer la 005 (compte léger / sync)

```bash
npm run db:migrate:005
npm run db:verify:005
```

Attendu : `player_progress` et `player_recovery_codes`. Sans elles, la génération / récupération de code échoue côté `/api/account`.

## Appliquer la 006 (vault + badges saison)

```bash
npm run db:migrate:006
npm run db:verify:006
```

Attendu : deux colonnes `season_badges_json` et `vault_json` sur `player_progress`. Sans elles, le sync multi-appareil ignore le vault d’erreurs et les badges saison (streak / succès continuent de marcher).

## Dashboard Cloudflare

Alternative : Cloudflare Dashboard → **D1** → `quiz-pixfan-scores` → **Console** → coller le SQL de `004-period-leaderboard-reports.sql` (sans les commentaires `-- npx …`).

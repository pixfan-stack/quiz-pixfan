# Prochaines étapes — Quiz PixFan

Document à jour avec l’état réel du dépôt (**v1.103.0**).

## ✅ Livré

- Vague **1.104** : **JSON-LD home syntax** (`]` parasite FAQ `mainEntity`) · bake shells **partenaires** path-locale (rewrite 200 ignoré live → SPA FAQ) · `_redirects` `/xx/s/:id → /s/:id` · armor 104 — Web Push · salon · 16ᵉ **no-go** through **1.104** (QP-291)
- Vague **1.103** : **guides path shells** `/en|es|de/guides/` (+ scolaires) baked lang/meta/canonical/hreflang · hotfix `_redirects` `:slug` (pas `/*` splat qui réécrivait le hub en FR) · topics rewrite+sniff · armor 103
- Vague **1.102** : page **partenaires** liens retour HTTPS · footer guides · sitemap 78 locs · armor 102
- Vague **1.101** / **1.100** : hotfix FR path-locale + Guides/Scolaires suivent la locale affichée
- Vague **1.99** : **path locales** `/en/` `/es/` `/de/` (FR = `/` x-default) · shells home build · LanguageSwitcher path · guides rewrite+sniff · sitemap path locs · armor 199
- Contenu : **15 quiz · 386 questions · 268 illustrées** (`public/data/questions.json`), dont packs **`marques-photo`**, **`flash-studio`** et **`lexique-image-fixe`** (Lexique image fixe · scolaires)
- Vague **1.98** : **sitemap lastmod refresh** (74 locs · floor 2026-11-05) · inventaire CI (`sitemapHygiene`) · textes crawlables Googlebot (FAQ catalogues complets · meta FR/EN/ES/DE · `<noscript>` home · hub guides lead) · docs v1.97.0 · armor 198 — **pas** path `/es/` `/de/` · **pas** inventer D1–D5 GSC
- Vague **1.97** : docs v1.96.0 · **indexation / coverage** gate (checklist D1–D5 + remédiation ops ; **pas** path `/es/` `/de/`) · armor 197 — crawlability locks (robots Allow · sitemap · no noindex home) · SVG + `withLangHref` + catalogues 15/15 inchangés
- Vague **1.96** : docs v1.95.0 · **ROI Search Console measurement gate / readout** (checklist + evidence ou blocker) · armor 196 — **pas** path `/es/` `/de/` (path seulement si ROI SC documenté + oui) · chrome static **fermé** · SVG + `withLangHref` inchangés
- Vague **1.95** : préserver `?lang=` sur href chrome Guides/Schools (nav+footer `/guides/` ↔ `/guides/scolaires/`) · docs v1.94.0 · armor 195 — **pas** path `/es/` `/de/` · labels i18n 1.94 + SVG inchangés
- Vague **1.94** : chrome Guides/Schools static i18n (nav+footer + theme.js es/de) · docs v1.93.0 · armor 194 — catalogues ES+DE **complets (15/15)** — residual chrome — **pas** path `/es/` `/de/` comme suite
- Vague **1.93** : `marques-photo` LocalizedString.de ×194 · docs v1.92.0 · armor 193 — **3ᵉ non-scolaire `.de`** (miroir ES 1.78) — catalogue `.de` **complets (15/15)** — **pas** path `/es/` `/de/` · **pas** autre pack hors catalogue
- Vague **1.92** : `lightroom-workflow` LocalizedString.de ×194 · docs v1.91.0 · armor 192 — **2ᵉ non-scolaire `.de`** (miroir ES 1.77) — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain + exposure-basics + genres + composition + smartphone + gear-lenses + lightroom-workflow — suite annoncée : `marques-photo` `.de`
- Vague **1.91** : `gear-lenses` LocalizedString.de ×192 · docs v1.90.0 · armor 191 — **1ʳᵉ non-scolaire `.de`** (miroir ES 1.76) — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain + exposure-basics + genres + composition + smartphone + gear-lenses
- Vague **1.90** : `smartphone` LocalizedString.de ×230 · docs v1.89.0 · armor 190 — **12ᵉ scolaire `.de`** (miroir ES 1.75) — scolaires DE **complets** — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain + exposure-basics + genres + composition + smartphone
- Vague **1.89** : `composition` LocalizedString.de ×230 · docs v1.88.0 · armor 189 — **11ᵉ scolaire `.de`** (miroir ES 1.74) — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain + exposure-basics + genres + composition
- Vague **1.88** : `genres` LocalizedString.de ×226 · docs v1.87.0 · armor 188 — **10ᵉ scolaire `.de`** (miroir ES 1.73) — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain + exposure-basics + genres
- Vague **1.87** : `exposure-basics` LocalizedString.de ×226 · docs v1.86.0 · armor 187 — **9ᵉ scolaire `.de`** (miroir ES 1.72) — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain + exposure-basics
- Vague **1.86** : `public-domain` LocalizedString.de ×194 · docs v1.85.0 · armor 186 — **8ᵉ scolaire `.de`** (miroir ES 1.71) — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain
- Vague **1.85** : `portrait-light` LocalizedString.de ×194 · docs v1.84.0 · armor 185 — **7ᵉ scolaire `.de`** (miroir ES 1.70) — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light
- Vague **1.84** : `history-icons` LocalizedString.de ×192 · docs v1.83.0 · armor 184 — **6ᵉ scolaire `.de`** (miroir ES 1.49) — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons
- Vague **1.83** : `retouching` LocalizedString.de ×190 · docs v1.82.0 · armor 183 — **5ᵉ scolaire `.de`** (miroir ES 1.48) — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching
- Vague **1.82** : `flash-studio` LocalizedString.de ×184 · docs v1.81.0 · armor 182 — **4ᵉ scolaire `.de`** (miroir ES 1.47) — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio
- Vague **1.81** : `light-color` LocalizedString.de ×182 · docs v1.80.0 · armor 181 — **3ᵉ scolaire `.de`** (miroir ES 1.46) — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color
- Vague **1.80** : `photo-rights` LocalizedString.de ×180 · docs v1.79.0 · armor 180 — **2ᵉ scolaire `.de`** (miroir ES 1.45) — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights
- Vague **1.79** : `lexique-image-fixe` LocalizedString.de ×74 · docs v1.78.0 · armor 179 — **toe-hold catalogue `.de`** (jalon ES catalogue fermé) — **pas** path `/es/` `/de/` · **pas** autre pack `.de`
- Vague **1.78** : `marques-photo` LocalizedString.es ×194 · docs v1.77.0 · armor 178 — non-scolaires `.es` **complets (3/3)** — **pas** path `/es/` `/de/` · **pas** catalogue `.de`
- Vague **1.77** : `lightroom-workflow` LocalizedString.es ×194 · docs v1.76.0 · armor 177 — 2ᵉ non-scolaire `.es` — **pas** path `/es/` `/de/` · **pas** marques-photo `.es` · **pas** catalogue `.de`
- Vague **1.76** : `gear-lenses` LocalizedString.es ×192 · docs v1.75.0 · armor 176 — 1ʳᵉ non-scolaire `.es` — **pas** path `/es/` `/de/` · **pas** lightroom-workflow / marques-photo `.es` · **pas** catalogue `.de`
- Vague **1.75** : `smartphone` LocalizedString.es ×230 · docs v1.74.0 · armor 175 — scolaires `.es` **complets** — **pas** path `/es/` `/de/` · **pas** non-scolaires `.es` · **pas** catalogue `.de`
- Vague **1.74** : `composition` LocalizedString.es ×230 · docs v1.73.0 · armor 174 — **pas** path `/es/` `/de/` · **pas** `smartphone` `.es` · **pas** catalogue `.de`
- Vague **1.73** : `genres` LocalizedString.es ×226 · docs v1.72.0 · armor 173 — **pas** path `/es/` `/de/` · **pas** `composition` `.es` · **pas** catalogue `.de`
- Vague **1.72** : `exposure-basics` LocalizedString.es ×226 · docs v1.71.2 · armor 172 — **pas** path `/es/` `/de/` · **pas** `genres` `.es` · **pas** catalogue `.de`
- Vague **1.71** : `public-domain` LocalizedString.es ×194 · docs v1.70.0 · armor 171 (+ patches 1.71.1 header · 1.71.2 SVG icons) — **pas** path `/es/` `/de/` · **pas** `exposure-basics` `.es` · **pas** catalogue `.de`
- Vague **1.70** : `portrait-light` LocalizedString.es ×194 · docs v1.69.0 · armor 170 — **pas** path `/es/` `/de/` · **pas** `public-domain` `.es` · **pas** catalogue `.de`
- Vague **1.69** : FAQ JSON-LD ES+DE (6 topics) · sharePreview LABELS/chips es+de · docs v1.68.0 · armor 169 — **pas** path `/es/` `/de/` · **pas** pack catalogue `.es`/`.de`
- Vague **1.68** : fiche séance `article.de` · sniff meta DE · `hreflang="de"` · og `de_DE` · sitemap twin fiche · docs v1.67.0 (bump **v1.68.0**) — **pas** path `/de/`
- Vague **1.67** : home SPA sniff meta DE · `hreflang="de"` · og `de_DE` · JSON-LD `inLanguage` +de · sitemap `/?lang=de` · docs v1.66.0 (bump **v1.67.0**) — **pas** fiche DE · **pas** path `/de/`
- Vague **1.66** : unlock hreflang de + og `de_DE` + sitemap `?lang=de` twins sur 11 pages `article.de` · docs v1.65.0 (bump **v1.66.0**) — **pas** hreflang de home/fiche · **pas** path `/de/`
- Vague **1.65** : hub guides + hub scolaires `article.de` · sniff meta DE · JSON-LD DE scolaires · docs v1.64.0 (bump **v1.65.0**) — **pas** hreflang de · **pas** twin sitemap `?lang=de` (unlock = 1.66)
- Vague **1.64** : expand `article.de` droits + histoire · sniff meta DE · docs v1.63.0 (bump **v1.64.0**) — topics **9/9** — **pas** hreflang de · **pas** twin sitemap `?lang=de`
- Vague **1.63** : expand `article.de` retouche + matériel · sniff meta DE · docs v1.62.0 (bump **v1.63.0**) — **pas** hreflang de · **pas** twin sitemap `?lang=de`
- Vague **1.62** : expand `article.de` lumière + genres · sniff meta DE · docs v1.61.0 (bump **v1.62.0**) — **pas** hreflang de · **pas** twin sitemap `?lang=de`
- Vague **1.61** : expand `article.de` triangle + smartphone · sniff meta DE · docs v1.60.0 (bump **v1.61.0**) — **pas** hreflang de · **pas** twin sitemap `?lang=de`
- Vague **1.60** : pilote guide `article.de` composition · CSS `:has(article.de)` · sniff meta DE · docs v1.59.0 (bump **v1.60.0**) — **pas** hreflang de · **pas** twin sitemap `?lang=de`
- Vague **1.59** : fiche séance `article.es` · sniff meta ES · `hreflang="es"` · og es_ES · sitemap twin fiche · docs v1.58.0 (bump **v1.59.0**)
- Vague **1.58** : home SPA sniff meta ES (+ EN parity) · `hreflang="es"` · og es_ES · JSON-LD `inLanguage` +es · sitemap `/?lang=en` + `/?lang=es` · docs v1.57.0 (bump **v1.58.0**)
- Vague **1.57** : unlock hreflang es + og es_ES + sitemap `?lang=` twins sur 11 pages `article.es` · docs v1.56.0 (bump **v1.57.0**)
- Vague **1.56** : hub guides + hub scolaires `article.es` · sniff meta ES · docs v1.55.0 (bump **v1.56.0**)
- Vague **1.55** : expand `article.es` droits + histoire · sniff meta ES · docs v1.54.0 (bump **v1.55.0**) — topics **9/9**
- Vague **1.54** : expand `article.es` retouche + matériel · sniff meta ES · docs v1.53.0 (bump **v1.54.0**)
- Vague **1.53** : expand `article.es` lumière + genres · sniff meta ES · docs v1.52.0 (bump **v1.53.0**)
- Vague **1.52** : expand `article.es` triangle + smartphone · sniff meta ES · docs v1.51.0 (bump **v1.52.0**)
- Vague **1.51** : pilote guide `article.es` composition · CSS `:has` · sniff meta ES · docs v1.50.0 (bump **v1.51.0**)
- Vague **1.50** : SEO SPA `?lang=` sync LanguageSwitcher · docs v1.49.0 (bump **v1.50.0**)
- Vague **1.49** : `history-icons` LocalizedString.es ×192 · docs v1.48.0 (bump **v1.49.0**)
- Vague **1.48** : `retouching` LocalizedString.es ×190 · docs v1.47.0 (bump **v1.48.0**)
- Vague **1.47** : `flash-studio` LocalizedString.es ×184 · docs v1.46.0 (bump **v1.47.0**)
- Vague **1.46** : `light-color` LocalizedString.es ×182 · docs v1.45.0 (bump **v1.46.0**)
- Vague **1.45** : `photo-rights` LocalizedString.es ×180 · docs v1.44.0 (bump **v1.45.0**)
- Vague **1.44** : `lexique-image-fixe` LocalizedString.es ×74 · docs v1.43.0 (bump **v1.44.0**)
- Vague **1.43** : topics twitter×9 + `og:locale:alternate` + EN sniff · docs v1.42.0 (bump **v1.43.0**)
- Vague **1.42** : UI allemande réelle (508) · un-stub DE · SW de · docs v1.41.0 (bump **v1.42.0**)
- Vague **1.41** : UI espagnole réelle (508) · un-stub ES · DE stub EN · SW es · docs v1.40.0 (bump **v1.41.0**)
- Vague **1.40** : fondation ES/DE (stubs EN · switcher 4 langues · CSS/sniff interim) · guides-index twitter + `og:locale:alternate` · docs v1.39.0 (bump **v1.40.0**)
- Vague **1.39** : hub JSON-LD EN sniff · fiche title de-dupe · `og:locale:alternate` twin · clipboard soft-fail · docs v1.38.0 (bump **v1.39.0**)
- Vague **1.38** : EN teacher → hub `?lang=en` · hub/fiche twitter + `og:locale:alternate` · EN copy-seance · cycle-4 CTA · docs v1.37.0 (bump **v1.38.0**)
- Vague **1.37** : hub/fiche EN meta+og · cycle-3 CTA · quiet Daily copy · FR Hub Scolaires · SPA `?lang=` · docs v1.36.0 (bump **v1.37.0**)
- Vague **1.36** : EN lesson-sheet naming · hub/fiche EN titles · sitemap floor 2026-10-22 · docs v1.35.0 (bump **v1.36.0**)
- Vague **1.35** : 14 dead locales · EN openHub Schools · histoire `#c3-decouvrir` · sitemap guides floors · docs v1.34.0 (bump **v1.35.0**)
- Vague **1.34** : EN classroom CTA · dead locales (chip / footer.guide* / highscore.none) · freeze chip gated · showEmpty drop · docs v1.33.0 (bump **v1.34.0**)
- Vague **1.33** : SPA scolaires « photo en classe » · chipHint cleanup · smartphone end-card sans Défi · hub JSON-LD · sitemap `/s/*` lastmod · docs v1.32.0 (bump **v1.33.0**)
- Vague **1.32** : guides index sans Défi · scolaires naming index · dark Nuit FOUC · softAskHint cleanup · docs v1.31.0 (bump **v1.32.0**)
- Vague **1.31** : Daily share-first · hub title/og · topic headers sans Quiz · classe-mode quiet · soft-ask title-only · docs v1.30.0 (bump **v1.31.0**)
- Vague **1.30** : Daily share fold · WeakSpotsDueChip quiet · hub h1 court · dark short text · weak/random recognition · photoReadingHint · docs v1.29.0 (bump **v1.30.0**)
- Vague **1.29** : Daily copy narrow · CSP sans Unsplash · reengage/reminder quiet · classroom CTA above related · catalogue ✦ · recognition featured · docs v1.28.0 (bump **v1.29.0**)
- Vague **1.28** : soft-ask après continue · hub Lancer above-fold · footers guides Guides+Scolaires · SeasonBanner / achievements / dark `aria-pressed` · docs v1.27.0 (bump **v1.28.0**)
- Vague **1.27** : guides classroom `cta-secondary` · MorePacks sans empty score · hub sans fork App · footer Guides+Scolaires · BG local AVIF · DailyNudge propre · docs v1.26.0 (bump **v1.27.0**)
- Vague **1.26** : footer admin/Save différés · distill chip scolaires · hero `#c4-regard` · hub CTA-first + EN deep-links · classroom result CTAs · docs v1.25.0 (bump **v1.26.0**)
- Vague **1.25** : Install + Save/name différés pré-play · flagship hero-only · Daily/Duel secondaires · chips plain · closer photo · AA hero shade · docs v1.24.0 (bump **v1.25.0**)
- Vague **1.24** : hero Persuade (lead photo + sans compte + enseignants) · Composition → Lumière · soft-ask dédié · EN « For the classroom » · chip avant WeeklyLeaders · docs v1.23.0 (bump **v1.24.0**)
- Vague **1.23** : suite Composition avant Pixfan CTA · soft `#c4-regard` · chip `/guides/scolaires/` · Pour la classe (3 guides) · empty social quieter (P2b) · docs v1.22.2 (bump **v1.23.0**)
- Vague **1.22** : CTA haut + suite Composition après photo-reading · scolaires C4-first + track liens · docs v1.21.0 (bump **v1.22.0**)
- Patch **v1.22.1** : chrome Scolaires → `/guides/scolaires/` (app + tous les guides)
- Patch **v1.22.2** : accueil Impeccable P0–P1 (hero marque, AA, quieter first contact)
- Vague **1.21** : fiche enseignant EN · photo-reading → CTA composition · copy histoire↔marques
- Pédagogie : difficultés filtrables, revue des erreurs / weak spots (SRS léger)
- Engagement : défi du jour, duel, succès (photo-reader · vault-clear · streak-14 + badges saison), streak + freezes, **maîtrise** + home featured, saisons
- Classement : tout temps + saisons semaine/mois, signalement de pseudo (API + migration `004`)
- Compte léger : code de récupération + sync streak / succès / high scores / **vault** / badges saison (migrations `005` + `006`)
- Produit : CTA pixfan.com + newsletter, modes photo-reading / mix / aléatoire, guides ↔ quiz (9 topics locaux : exposition, composition, lumière, retouche, smartphone, genres, matériel, droits, histoire) + BreadcrumbList
- Technique : **PWA** (manifest, SW, install prompt), footer i18n, **admin** `#/admin` (export JSON, signalements, analytics habit + modes)

## 🔜 Ops prod (P0 — reste live)

- [x] Migration D1 `004` (période + reports) — appliquée en prod
- [x] `VITE_ADMIN_PIN` en **build** Pages / CI (SPA `#/admin`)
- [x] **`ADMIN_PIN` (+ `VITE_ADMIN_PIN`) runtime Pages Functions** — vérifié live 2026-09-20 (`/api/admin/analytics` + `/reports` → 200). Docs : `DEPLOYMENT.md` § Admin PIN runtime ; code distingue 503 (absent) vs 401 (mauvais PIN) après merge.
- [x] Rate-limit `create_code` / `redeem` sur `/api/account` (repo)
- [x] **Vague 1.20 ops — Admin Analytics lu** (2026-09-29) — chiffres réels ; **Web Push / salon / 16ᵉ pack = no-go** (volume insuffisant). Doc store `ops-admin-1-20`. Re-lire slots CTA primary/secondary dans ~7–14 j post-1.20.
- [x] Rate-limit soft `POST /api/analytics` (Cache API / IP, 1 s) — repo vague 1.17 P0
- [x] Admin modes : ventiler `mix-*` / `random-mix` hors `packs` — **client + Functions** (`functions/lib/attemptModes.ts`, vague 1.18 P0)
- [x] Docs headline → **v1.96.0** + 15 quiz · 386 Q · 268 illus (vague 1.97 P0 ; baseline live post-1.96.0)
- [x] Docs headline → **v1.95.0** + 15 quiz · 386 Q · 268 illus (vague 1.96 P0 ; baseline live post-1.95.0)
- [x] Docs headline → **v1.94.0** + 15 quiz · 386 Q · 268 illus (vague 1.95 P0 ; baseline live post-1.94.0)
- [x] Docs headline → **v1.93.0** + 15 quiz · 386 Q · 268 illus (vague 1.94 P0 ; baseline live post-1.93.0)
- [x] Docs headline → **v1.92.0** + 15 quiz · 386 Q · 268 illus (vague 1.93 P0 ; baseline live post-1.92.0)
- [x] Docs headline → **v1.91.0** + 15 quiz · 386 Q · 268 illus (vague 1.92 P0 ; baseline live post-1.91.0)
- [x] Docs headline → **v1.90.0** + 15 quiz · 386 Q · 268 illus (vague 1.91 P0 ; baseline live post-1.90.0)
- [x] Docs headline → **v1.89.0** + 15 quiz · 386 Q · 268 illus (vague 1.90 P0 ; baseline live post-1.89.0)
- [x] Docs headline → **v1.88.0** + 15 quiz · 386 Q · 268 illus (vague 1.89 P0 ; baseline live post-1.88.0)
- [x] Docs headline → **v1.87.0** + 15 quiz · 386 Q · 268 illus (vague 1.88 P0 ; baseline live post-1.87.0)
- [x] Docs headline → **v1.86.0** + 15 quiz · 386 Q · 268 illus (vague 1.87 P0 ; baseline live post-1.86.0)
- [x] Docs headline → **v1.85.0** + 15 quiz · 386 Q · 268 illus (vague 1.86 P0 ; baseline live post-1.85.0)
- [x] Docs headline → **v1.84.0** + 15 quiz · 386 Q · 268 illus (vague 1.85 P0 ; baseline live post-1.84.0)
- [x] Docs headline → **v1.83.0** + 15 quiz · 386 Q · 268 illus (vague 1.84 P0 ; baseline live post-1.83.0)
- [x] Docs headline → **v1.82.0** + 15 quiz · 386 Q · 268 illus (vague 1.83 P0 ; baseline live post-1.82.0)
- [x] Docs headline → **v1.81.0** + 15 quiz · 386 Q · 268 illus (vague 1.82 P0 ; baseline live post-1.81.0)
- [x] Docs headline → **v1.80.0** + 15 quiz · 386 Q · 268 illus (vague 1.81 P0 ; baseline live post-1.80.0)
- [x] Docs headline → **v1.79.0** + 15 quiz · 386 Q · 268 illus (vague 1.80 P0 ; baseline live post-1.79.0)
- [x] Docs headline → **v1.78.0** + 15 quiz · 386 Q · 268 illus (vague 1.79 P0 ; baseline live post-1.78.0)
- [x] Docs headline → **v1.77.0** + 15 quiz · 386 Q · 268 illus (vague 1.78 P0 ; baseline live post-1.77.0)
- [x] Docs headline → **v1.76.0** + 15 quiz · 386 Q · 268 illus (vague 1.77 P0 ; baseline live post-1.76.0)
- [x] Sitemap harden (`_redirects` SEO exceptions + `_headers` MIME) + `/s/lexique-image-fixe` + `lastmod` home/scolaires/fiche/`/s/*` ≥ 2026-10-22 (vague 1.19–1.37)
- [x] Web Push / salon / 16ᵉ pack restent **no-go** (ops 1.20) — inchangé en 1.22 / 1.23 / 1.24 / 1.25 / 1.26 / 1.27 / 1.28 / 1.29 / 1.30 / 1.31 / 1.32 / 1.33 / 1.34 / 1.35 / 1.36 / 1.37 / 1.38 / 1.39 / 1.40 / 1.41 / 1.42 / 1.43 / 1.44 / 1.45 / 1.46 / 1.47 / 1.48 / 1.49 / 1.50 / 1.51 / 1.52 / 1.53 / 1.54 / 1.55 / 1.56 / 1.57 / 1.58 / 1.59 / 1.60 / 1.61 / 1.62 / 1.63 / 1.64 / 1.65 / 1.66 / 1.67 / 1.68 / 1.69 / 1.70 / 1.71 / 1.72 / 1.73 / 1.74 / 1.75 / 1.76 / 1.77 / 1.78 / 1.79 / 1.80 / 1.81 / 1.82 / 1.83 / 1.84 / 1.85 / 1.86 / 1.87 / 1.88 / 1.89 / 1.90 / 1.91 / 1.92 / 1.93 / 1.94 / 1.95 / 1.96 / 1.97 / 1.98 / 1.99 / 1.100 / 1.101 / 1.102 / 1.103 / **1.104**

### Ops Antony — checklist P0.4 (hors code)

Lecture **faite** 2026-09-29 (all-time + 14 j) — voir `ops-admin-1-20`. Web Push / salon / 16ᵉ restent **non**. À re-lire : slots CTA `primary`/`secondary`/`newsletter` (post-1.20) + funnel c4.

- [x] Date de lecture analytics : **2026-09-29** (all-time + `recentDays` 14 j)
- [x] Habit funnel : `reminder_*` / `ics` / `pwa_install` = **0** → push no-go
- [x] Modes : photo-reading dominant · packs 9 · lexique 0 · mix/duel 0
- [x] Scolaires : hub 7 · parcours 2 (c4 = 0) → salon no-go
- [x] CTA : conversion **0,4 %** · slots v1.20 encore à 0 (legacy 2)
- [x] Décision Web Push : **non** — 2026-09-29
- [ ] **`npm run db:verify:006`** (prod) — pass/fail colonnes `vault_json` / `season_badges_json` : ________

## 🔜 Suite produit possible

- [ ] **Re-vérifier** migration D1 `006` en prod (`npm run db:verify:006`) — colonnes `vault_json` / `season_badges_json` (appliquée 2026-09-20 ; pas de re-migrate) — même item que checklist P0.4 ci-dessus
- [x] Enrichir images packs sous-illustrés + quiz `portrait-light` + rebalance `history-icons` (vague 1.16 P3)
- [x] SRS vault + CTA weak-spots (vague 1.16 P2)
- [x] BreadcrumbList guides + succès manquants (vague 1.16 P1.4 / P2.3)
- [x] Guides droits / matériel / histoire (vague 1.17 P2)
- [x] Densifier illus packs + allonger Lightroom / portrait + OG thèmes (vague 1.17 P4.A/B/D)
- [x] Pack **`marques-photo`** (vague 1.17 P4.C / post-wave) — livré live depuis v1.17.1+
- [x] Pack **`flash-studio`** (vague 1.18 P4 — 14ᵉ quiz) — Flash & studio

- [x] SEO SPA `?lang=` sync LanguageSwitcher (vague **1.50**) — plan store `seo-urls-i18n`
- [x] Pilote guide `article.es` composition (vague **1.51**) — **pas** hreflang es encore (contenu partiel)
- [x] Expand `article.es` triangle + smartphone (vague **1.52**) — **pas** hreflang es encore (contenu encore partiel)
- [x] Expand `article.es` lumière + genres (vague **1.53**) — **pas** hreflang es encore (5/9 topics ; hub/scolaires EN)
- [x] Expand `article.es` retouche + matériel (vague **1.54**) — **pas** hreflang es encore (7/9 topics ; droits/histoire/hub/scolaires EN)
- [x] Expand `article.es` droits + histoire (vague **1.55**) — **pas** hreflang es encore (9/9 topics ; hub/scolaires EN)
- [x] Hub guides + hub scolaires `article.es` (vague **1.56**) — **pas** hreflang es encore (fiche EN interim)
- [x] Unlock SEO ES : hreflang es + `og:locale:alternate` es_ES + sitemap `?lang=` twins sur 11 pages `article.es` (vague **1.57**) — **pas** hreflang de · **pas** path `/es/` · fiche/home sans hreflang es
- [x] Home SPA sniff meta ES (+ EN parity) · `hreflang="es"` · og es_ES · JSON-LD `inLanguage` +es · sitemap `/?lang=en` + `/?lang=es` (vague **1.58**) — **pas** fiche ES · **pas** hreflang de · **pas** path `/es/`
- [x] Fiche séance `article.es` (+ sniff + hreflang/sitemap page-scoped) (vague **1.59**) — **pas** hreflang de · **pas** path `/es/`
- [x] Pilote guide `article.de` composition (+ CSS `:has` + sniff meta DE) (vague **1.60**) — **pas** hreflang de · **pas** twin sitemap `?lang=de` · **pas** path `/de/`
- [x] Expand `article.de` triangle + smartphone (+ sniff meta DE) (vague **1.61**) — **pas** hreflang de · **pas** twin sitemap `?lang=de` · **pas** path `/de/`
- [x] Expand `article.de` lumière + genres (+ sniff meta DE) (vague **1.62**) — **pas** hreflang de · **pas** twin sitemap `?lang=de` · **pas** path `/de/`
- [x] Expand `article.de` retouche + matériel (+ sniff meta DE) (vague **1.63**) — **pas** hreflang de · **pas** twin sitemap `?lang=de` · **pas** path `/de/`
- [x] Expand `article.de` droits + histoire (+ sniff meta DE) (vague **1.64**) — topics **9/9** — **pas** hreflang de · **pas** twin sitemap `?lang=de` · **pas** path `/de/`
- [x] Hub guides + hub scolaires `article.de` (+ sniff meta DE · JSON-LD DE scolaires) (vague **1.65**) — **pas** hreflang de · **pas** twin sitemap `?lang=de` · **pas** path `/de/` (fiche/home encore EN)
- [x] Unlock SEO DE : hreflang de + `og:locale:alternate` de_DE + sitemap `?lang=de` twins sur 11 pages `article.de` (vague **1.66**) — **pas** hreflang de home/fiche · **pas** path `/de/`
- [x] Home SPA sniff meta DE · `hreflang="de"` · og `de_DE` · JSON-LD `inLanguage` +de · sitemap `/?lang=de` (vague **1.67**) — **pas** fiche DE · **pas** path `/de/`
- [x] Fiche séance `article.de` (+ sniff + hreflang/sitemap page-scoped) (vague **1.68**) — **pas** path `/de/`
- [x] FAQ JSON-LD ES+DE (6 topics) · sharePreview LABELS/chips es+de · armor 169 (vague **1.69**) — **pas** path `/es/` `/de/` · **pas** pack catalogue `.es` restants / `.de`
- [x] `portrait-light` LocalizedString.es ×194 · docs v1.69.0 · armor 170 (vague **1.70**) — **pas** `public-domain` `.es` · **pas** path `/es/` `/de/` · **pas** catalogue `.de`
- [x] `public-domain` LocalizedString.es ×194 · docs v1.70.0 · armor 171 (vague **1.71**) — **pas** `exposure-basics` `.es` · **pas** path `/es/` `/de/` · **pas** catalogue `.de`
- [x] `exposure-basics` LocalizedString.es ×226 · docs v1.71.2 · armor 172 (vague **1.72**) — **pas** `genres` `.es` · **pas** path `/es/` `/de/` · **pas** catalogue `.de`
- [x] `genres` LocalizedString.es ×226 · docs v1.72.0 · armor 173 (vague **1.73**) — **pas** `composition` `.es` · **pas** path `/es/` `/de/` · **pas** catalogue `.de`
- [x] `composition` LocalizedString.es ×230 · docs v1.73.0 · armor 174 (vague **1.74**) — **pas** `smartphone` `.es` · **pas** path `/es/` `/de/` · **pas** catalogue `.de`
- [x] `smartphone` LocalizedString.es ×230 · docs v1.74.0 · armor 175 (vague **1.75**) — scolaires `.es` **complets** — **pas** non-scolaires `.es` · **pas** path `/es/` `/de/` · **pas** catalogue `.de`
- [x] `gear-lenses` LocalizedString.es ×192 · docs v1.75.0 · armor 176 (vague **1.76**) — 1ʳᵉ non-scolaire `.es` — **pas** lightroom-workflow / marques-photo `.es` · **pas** path `/es/` `/de/` · **pas** catalogue `.de`
- [x] `lightroom-workflow` LocalizedString.es ×194 · docs v1.76.0 · armor 177 (vague **1.77**) — 2ᵉ non-scolaire `.es` — **pas** marques-photo `.es` · **pas** path `/es/` `/de/` · **pas** catalogue `.de`
- [x] `marques-photo` LocalizedString.es ×194 · docs v1.77.0 · armor 178 (vague **1.78**) — non-scolaires `.es` **complets (3/3)** — **pas** path `/es/` `/de/` · **pas** catalogue `.de`
- [x] `lexique-image-fixe` LocalizedString.de ×74 · docs v1.78.0 · armor 179 (vague **1.79**) — **toe-hold catalogue `.de`** — **pas** path `/es/` `/de/` · **pas** autre pack `.de`
- [x] `photo-rights` LocalizedString.de ×180 · docs v1.79.0 · armor 180 (vague **1.80**) — **2ᵉ scolaire `.de`** — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights
- [x] `light-color` LocalizedString.de ×182 · docs v1.80.0 · armor 181 (vague **1.81**) — **3ᵉ scolaire `.de`** — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color
- [x] `flash-studio` LocalizedString.de ×184 · docs v1.81.0 · armor 182 (vague **1.82**) — **4ᵉ scolaire `.de`** — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio
- [x] `retouching` LocalizedString.de ×190 · docs v1.82.0 · armor 183 (vague **1.83**) — **5ᵉ scolaire `.de`** — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching
- [x] `history-icons` LocalizedString.de ×192 · docs v1.83.0 · armor 184 (vague **1.84**) — **6ᵉ scolaire `.de`** — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons
- [x] `portrait-light` LocalizedString.de ×194 · docs v1.84.0 · armor 185 (vague **1.85**) — **7ᵉ scolaire `.de`** — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light
- [x] `public-domain` LocalizedString.de ×194 · docs v1.85.0 · armor 186 (vague **1.86**) — **8ᵉ scolaire `.de`** — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain
- [x] `exposure-basics` LocalizedString.de ×226 · docs v1.86.0 · armor 187 (vague **1.87**) — **9ᵉ scolaire `.de`** — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain + exposure-basics
- [x] `genres` LocalizedString.de ×226 · docs v1.87.0 · armor 188 (vague **1.88**) — **10ᵉ scolaire `.de`** — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain + exposure-basics + genres
- [x] `composition` LocalizedString.de ×230 · docs v1.88.0 · armor 189 (vague **1.89**) — **11ᵉ scolaire `.de`** — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain + exposure-basics + genres + composition
- [x] `smartphone` LocalizedString.de ×230 · docs v1.89.0 · armor 190 (vague **1.90**) — **12ᵉ scolaire `.de`** — scolaires DE **complets** — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain + exposure-basics + genres + composition + smartphone
- [x] `gear-lenses` LocalizedString.de ×192 · docs v1.90.0 · armor 191 (vague **1.91**) — **1ʳᵉ non-scolaire `.de`** (miroir ES 1.76) — title.de « Ausrüstung & Objektive » — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain + exposure-basics + genres + composition + smartphone + gear-lenses — suite annoncée : `lightroom-workflow` / `marques-photo` `.de`
- [x] `lightroom-workflow` LocalizedString.de ×194 · docs v1.91.0 · armor 192 (vague **1.92**) — **2ᵉ non-scolaire `.de`** (miroir ES 1.77) — title.de « Lightroom-Workflow (Pixfan-Pfad) » — **pas** path `/es/` `/de/` · **pas** autre pack `.de` hors lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain + exposure-basics + genres + composition + smartphone + gear-lenses + lightroom-workflow — suite annoncée : `marques-photo` `.de`
- [x] `marques-photo` LocalizedString.de ×194 · docs v1.92.0 · armor 193 (vague **1.93**) — **3ᵉ non-scolaire `.de`** (miroir ES 1.78) — title.de « Markengeschichte » — catalogue `.de` **complets (15/15)** — **pas** path `/es/` `/de/`
- [x] Chrome Guides/Schools static i18n (nav+footer + theme.js es/de) · docs v1.93.0 · armor 194 (vague **1.94**) — catalogues ES+DE **complets (15/15)** — residual chrome — **pas** path `/es/` `/de/` comme suite
- [x] Préserver `?lang=` sur href chrome Guides/Schools (nav+footer) · docs v1.94.0 · armor 195 (vague **1.95**) — **pas** path `/es/` `/de/` · SVG + labels 1.94 inchangés
- [x] ROI Search Console measurement gate + baseline readout · docs v1.95.0 · armor 196 (vague **1.96**) — checklist Q1–Q5 + pass/fail path · evidence ou blocker daté — **pas** path `/es/` `/de/` shippé · **pas** suite automatique path
- [x] Indexation / coverage gate · docs v1.96.0 · armor 197 (vague **1.97**) — checklist D1–D5 (GSC Sitemaps · Coverage · URL Inspection · CF Bot Fight · propriété) · remédiation **ops-only** en attendant captures Antony — **pas** path `/es/` `/de/` · **pas** patch SEO cosmétique sans Inspection
- [x] Sitemap lastmod + textes crawlables Googlebot · docs v1.97.0 · armor 198 (vague **1.98**) — 74 locs · floor 2026-11-05 · inventaire CI · FAQ catalogues complets · noscript home · hub guides lead FR/EN/ES/DE — **pas** path `/es/` `/de/` · **pas** inventer D1–D5

### ROI SC — verdict 1.96

Gate + evidence : store `docs/roi-sc-gate.md` · `docs/roi-sc-evidence-1-96.md`.  
**Verdict :** **ROI insuffisant → path no-go** (GSC UI Antony 2026-11-05 : **0 pages indexées** · **0 clics** ; **aucun** chiffre inventé). Path `/es/` `/de/` **reste interdit**.

### Indexation / coverage — vague 1.97 (ops, **pas** path)

Checklist store : `docs/indexation-coverage-1-97.md` (D1–D5 — **slots vides** en attente readout GSC/CF Antony). Path `/es/` `/de/` **reste no-go**.

### Sitemap + crawl text — vague 1.98

Demande Antony : sitemap à jour + URLs/textes lisibles Googlebot.  
Livré : `public/sitemap.xml` lastmod **2026-11-05** · `sitemapHygiene` inventaire strict (74 locs · packs sync) · `index.html` FAQ/meta/noscript · hub guides lead.  
D1–D5 GSC/CF **reste awaiting** (pas inventé).

### Path locales — vague 1.99 (**override ROI Antony**)

Override : « go path `/es/` `/de/` `/en` ».  
Livré : shells `/en/` `/es/` `/de/` · SPA path detect · LanguageSwitcher path · guides `_redirects` rewrite + sniff · sitemap path locs (74, remplace `?lang=` twins) · home `/?lang=` → 301 path.  
`/s/*` reste `?lang=` runtime. Web Push · salon · 16ᵉ **no-go** through **1.99**.

Contenu : `public/data/questions.json`. Catalogues ES+DE **complets (15/15)**. Web Push · salon · 16ᵉ **no-go** through **1.99**.

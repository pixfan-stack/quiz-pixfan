#!/usr/bin/env python3
"""P2 content: more hard questions + Lightroom workflow quiz."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public/data/questions.json"

IMG = {
    "cascade": "https://images.unsplash.com/photo-1432405972618-c60b0225d3f8?auto=format&fit=crop&w=960&q=80",
    "street": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=960&q=80",
    "portrait": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=960&q=80",
    "phone": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=960&q=80",
    "desk": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=960&q=80",
    "night": "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=960&q=80",
    "forest": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=960&q=80",
}


def credit(en: str, fr: str | None = None) -> dict:
    return {"en": en, "fr": fr or en}


def Q(
    id: str,
    *,
    typ: str,
    difficulty: str,
    en: str,
    fr: str,
    answers: list[tuple[str, str, str]],
    correct: list[str],
    expl_en: str,
    expl_fr: str,
    image: str | None = None,
    alt_en: str | None = None,
    alt_fr: str | None = None,
    image_credit: dict | None = None,
) -> dict:
    q: dict = {
        "id": id,
        "type": typ,
        "difficulty": difficulty,
        "text": {"en": en, "fr": fr},
        "answers": [{"id": a, "text": {"en": en_a, "fr": fr_a}} for a, en_a, fr_a in answers],
        "correctAnswers": correct,
        "explanation": {"en": expl_en, "fr": expl_fr},
    }
    if image:
        q["imageUrl"] = image
        q["imageAlt"] = {"en": alt_en or "", "fr": alt_fr or ""}
        if image_credit:
            q["imageCredit"] = image_credit
    return q


HARD_ADDITIONS: dict[str, list[dict]] = {
    "exposure-basics": [
        Q(
            "exp-29",
            typ="single",
            difficulty="hard",
            en="Concert pit, subject moving, stage lights pumping. You need subject freeze AND readable blacks. Best priority?",
            fr="Fosse de concert, sujet en mouvement, projecteurs. Tu veux figer ET garder des noirs lisibles. Priorité ?",
            answers=[
                ("a", "Lowest ISO, slow shutter, hope for the best", "ISO mini, obturateur lent, et on espère"),
                (
                    "b",
                    "Shutter fast enough to freeze, open aperture, raise ISO only as needed",
                    "Vitesse assez rapide pour figer, ouvrir le diaphragme, monter l’ISO seulement si besoin",
                ),
                ("c", "f/16 for maximum depth every time", "f/16 pour un max de profondeur à chaque fois"),
                ("d", "Flash only — ambient light never works on stage", "Flash seul — la lumière scène ne marche jamais"),
            ],
            correct=["b"],
            expl_en="Freeze first (shutter), gather light (aperture), then ISO. Protecting blacks comes from exposure discipline, not underexposing blindly.",
            expl_fr="On fige d’abord (vitesse), on collecte la lumière (ouverture), puis l’ISO. Les noirs se protègent par une expo maîtrisée, pas une sous-expo aveugle.",
            image=IMG["night"],
            alt_en="City lights at night suggesting low-light performance",
            alt_fr="Lumières de ville la nuit évoquant la photo en basse lumière",
            image_credit=credit("Photo: Unsplash"),
        ),
        Q(
            "exp-30",
            typ="single",
            difficulty="hard",
            en="You meter a backlit portrait at −1 EV ‘to keep drama’. Skin goes muddy and noisy when lifted. What went wrong?",
            fr="Tu mesures un portrait à contre-jour à −1 IL « pour le drama ». La peau devient boueuse et bruitée en remontant. Erreur ?",
            answers=[
                (
                    "a",
                    "You underexposed the face; lift later amplifies noise — expose for skin, accept brighter background",
                    "Tu as sous-exposé le visage ; remonter amplifie le bruit — expose pour la peau, accepte un fond plus clair",
                ),
                ("b", "ISO was too low for drama", "L’ISO était trop bas pour le drama"),
                ("c", "Only JPEG can handle backlight", "Seul le JPEG gère le contre-jour"),
                ("d", "−1 EV always improves skin texture", "−1 IL améliore toujours la texture de peau"),
            ],
            correct=["a"],
            expl_en="Drama from a bright rim is fine; crushing facial midtones is not. Expose for the subject you care about.",
            expl_fr="Un contour lumineux, oui ; écraser les tons du visage, non. Expose pour le sujet qui compte.",
        ),
        Q(
            "exp-31",
            typ="multiple",
            difficulty="hard",
            en="Which pairs keep exposure roughly equivalent (same EV) if nothing else changes?",
            fr="Quelles paires gardent à peu près la même exposition (même EV) si rien d’autre ne change ?",
            answers=[
                ("a", "1/250 s at f/2.8 ↔ 1/125 s at f/4", "1/250 s à f/2.8 ↔ 1/125 s à f/4"),
                ("b", "ISO 400 at 1/100 ↔ ISO 800 at 1/200", "ISO 400 à 1/100 ↔ ISO 800 à 1/200"),
                ("c", "f/8 at ISO 100 ↔ f/4 at ISO 100 (same shutter)", "f/8 à ISO 100 ↔ f/4 à ISO 100 (même vitesse)"),
                ("d", "1/60 s at f/5.6 ↔ 1/30 s at f/8", "1/60 s à f/5.6 ↔ 1/30 s à f/8"),
            ],
            correct=["a", "b", "d"],
            expl_en="One stop open + one stop faster shutter (or +1 ISO / −1 shutter) balances. Opening two stops without changing shutter is +2 EV.",
            expl_fr="Un stop d’ouverture + un stop de vitesse (ou +1 ISO / −1 vitesse) s’équilibrent. Ouvrir de deux stops sans changer la vitesse = +2 IL.",
        ),
    ],
    "composition": [
        Q(
            "comp-29",
            typ="single",
            difficulty="hard",
            en="Street corner, strong leading lines into a cluttered background. Subject is mid-frame. Strongest fix without moving farther?",
            fr="Coin de rue, lignes fortes vers un fond encombré. Sujet au milieu. Meilleure correction sans reculer ?",
            answers=[
                ("a", "Always center and hope symmetry saves it", "Toujours centrer et espérer la symétrie"),
                (
                    "b",
                    "Shift laterally / change height so lines point at a clean subject, then crop intent",
                    "Décaler latéralement / changer de hauteur pour que les lignes pointent un sujet propre, puis cadrer avec intention",
                ),
                ("c", "Max telephoto compression only — composition doesn’t matter", "Télé max seulement — la composition n’importe pas"),
                ("d", "Add a heavy vignette in-camera as the only fix", "Ajouter un vignettage fort à la prise comme seul remède"),
            ],
            correct=["b"],
            expl_en="Leading lines are tools: aim them. Small lateral/height moves often beat zooming in place.",
            expl_fr="Les lignes directrices sont des outils : oriente-les. Un petit déplacement bat souvent le zoom sur place.",
            image=IMG["street"],
            alt_en="Urban street with strong perspective lines",
            alt_fr="Rue urbaine avec de fortes lignes de perspective",
            image_credit=credit("Photo: Unsplash"),
        ),
        Q(
            "comp-30",
            typ="single",
            difficulty="hard",
            en="Environmental portrait: face sharp, but a bright doorway behind competes. Best compositional decision?",
            fr="Portrait d’environnement : visage net, mais une porte claire derrière concurrence. Meilleure décision de cadrage ?",
            answers=[
                (
                    "a",
                    "Recompose so the bright shape supports (not rivals) the face — or wait for softer light",
                    "Recadrer pour que la forme claire soutienne (pas rivalise) le visage — ou attendre une lumière plus douce",
                ),
                ("b", "Always leave the bright shape centered", "Toujours laisser la forme claire au centre"),
                ("c", "Crop the face out to keep the doorway", "Rogner le visage pour garder la porte"),
                ("d", "Use the widest aperture and ignore the background entirely", "Ouvrir au max et ignorer totalement le fond"),
            ],
            correct=["a"],
            expl_en="Brightness pulls the eye. Place or time it so it frames the subject instead of fighting it.",
            expl_fr="La luminosité attire l’œil. Place-la ou attends pour qu’elle cadre le sujet au lieu de le concurrencer.",
        ),
        Q(
            "comp-31",
            typ="multiple",
            difficulty="hard",
            en="When is breaking the rule of thirds often stronger than following it?",
            fr="Quand enfreindre la règle des tiers est souvent plus fort que la suivre ?",
            answers=[
                ("a", "Deliberate symmetry / reflection shots", "Symétrie volontaire / reflets"),
                ("b", "Minimal subjects needing dead-center gravity", "Sujets minimaux qui demandent une gravité centrée"),
                ("c", "Every snapshot — rules never help beginners", "Chaque snapshot — les règles n’aident jamais les débutants"),
                ("d", "Patterns and architecture where center emphasizes structure", "Motifs et architecture où le centre souligne la structure"),
            ],
            correct=["a", "b", "d"],
            expl_en="Rules guide attention; intentional center/symmetry can be clearer. Random centering is not the same as designed centering.",
            expl_fr="Les règles guident l’attention ; un centre/une symétrie volontaire peuvent être plus clairs. Centrer au hasard ≠ centrer avec intention.",
        ),
    ],
    "smartphone": [
        Q(
            "phone-29",
            typ="single",
            difficulty="hard",
            en="Night mode stacks frames. Subject walks mid-capture. Cleanest result strategy?",
            fr="Le mode Nuit empile des vues. Le sujet marche pendant la prise. Meilleure stratégie ?",
            answers=[
                (
                    "a",
                    "Ask them to hold still, brace the phone, or switch to a faster Pro/shutter mode",
                    "Leur demander de rester immobile, stabiliser le téléphone, ou passer en mode Pro/vitesse plus rapide",
                ),
                ("b", "Shake the phone more to ‘average’ motion", "Secouer plus le téléphone pour « moyenner » le mouvement"),
                ("c", "Force HDR+flash together every time", "Forcer HDR+flash à chaque fois"),
                ("d", "Night mode always freezes motion — ignore it", "Le mode Nuit fige toujours — on peut ignorer"),
            ],
            correct=["a"],
            expl_en="Multi-frame night modes hate motion. Stillness or a faster single exposure beats ghosting.",
            expl_fr="Les modes nuit multi-vues détestent le mouvement. L’immobilité ou une expo plus courte bat les fantômes.",
            image=IMG["phone"],
            alt_en="Smartphone held ready to shoot",
            alt_fr="Smartphone prêt à photographier",
            image_credit=credit("Photo: Unsplash"),
        ),
        Q(
            "phone-30",
            typ="single",
            difficulty="hard",
            en="Ultra-wide selfie in a small room looks warped at the edges. Smartest optical choice?",
            fr="Selfie ultra grand-angle dans une petite pièce : bords déformés. Meilleur choix optique ?",
            answers=[
                ("a", "Stay ultra-wide and crop later — distortion is free", "Rester en ultra grand-angle et recadrer — la distorsion est gratuite"),
                (
                    "b",
                    "Step back and use the main (or 2×) lens; keep faces away from extreme edges",
                    "Reculer et utiliser la focale principale (ou 2×) ; garder les visages loin des bords extrêmes",
                ),
                ("c", "Only digital zoom 10× fixes faces", "Seul le zoom numérique 10× corrige les visages"),
                ("d", "Turn on beauty mode as the only fix", "Activer le mode beauté comme seule correction"),
            ],
            correct=["b"],
            expl_en="Ultra-wide stretch is geometry, not a skin problem. Prefer the main lens and distance.",
            expl_fr="L’étirement ultra grand-angle est géométrique, pas un souci de peau. Préfère l’objectif principal et de la distance.",
        ),
        Q(
            "phone-31",
            typ="multiple",
            difficulty="hard",
            en="Which habits reduce computational ‘overcooked’ look on modern phones?",
            fr="Quelles habitudes réduisent le rendu « trop cuit » des algos sur les téléphones modernes ?",
            answers=[
                ("a", "Shoot in good light so the phone stacks less aggressively", "Shooter en bonne lumière pour moins forcer l’empilement"),
                ("b", "Prefer RAW/Pro when you want natural tonality", "Préférer RAW/Pro quand tu veux une tonalité naturelle"),
                ("c", "Max HDR + max sharpening + max contrast always", "HDR max + netteté max + contraste max toujours"),
                ("d", "Gentle edit; avoid stacking heavy filters on already processed JPEGs", "Retouche légère ; éviter d’empiler des filtres sur un JPEG déjà traité"),
            ],
            correct=["a", "b", "d"],
            expl_en="Phones already bake tone and detail. Start cleaner, then edit lightly.",
            expl_fr="Les téléphones cuisent déjà ton et détail. Pars plus propre, puis retouche léger.",
        ),
    ],
    "genres": [
        Q(
            "gen-29",
            typ="single",
            difficulty="hard",
            en="Documentary street in France: you want candid gesture without staging. Strongest ethical + craft approach?",
            fr="Street documentaire en France : geste candide, sans mise en scène. Meilleure approche éthique + technique ?",
            answers=[
                (
                    "a",
                    "Anticipate, blend in, respect dignity; know when not to publish identifiable private moments",
                    "Anticiper, se fondre, respecter la dignité ; savoir quand ne pas publier un moment privé identifiable",
                ),
                ("b", "Always confront and pose strangers for ‘truth’", "Toujours confronter et poser les inconnus pour la « vérité »"),
                ("c", "Publish every face regardless of context", "Publier chaque visage quel que soit le contexte"),
                ("d", "Only shoot from a rooftop with a 600 mm — never engage the scene", "Ne shooter qu’au 600 mm depuis un toit — jamais s’engager dans la scène"),
            ],
            correct=["a"],
            expl_en="Street craft is anticipation and presence; ethics is dignity and context — especially when publishing.",
            expl_fr="Le craft street = anticipation et présence ; l’éthique = dignité et contexte — surtout à la publication.",
            image=IMG["street"],
            alt_en="Busy urban street scene for candid photography",
            alt_fr="Scène de rue animée pour la photo candide",
            image_credit=credit("Photo: Unsplash"),
        ),
        Q(
            "gen-30",
            typ="single",
            difficulty="hard",
            en="Natural-light portrait outdoors at noon. Harsh overhead sun. Best genre-aware fix?",
            fr="Portrait en lumière naturelle à midi. Soleil zénithal dur. Meilleure correction « genre » ?",
            answers=[
                (
                    "a",
                    "Open shade / diffuser / bounce fill; keep catchlights without raccoon eyes",
                    "Ombre ouverte / diffuseur / fill en rebond ; garder des catchlights sans yeux de raton",
                ),
                ("b", "Force on-camera flash pointed straight up only", "Flash cobasse uniquement vers le haut"),
                ("c", "Underexpose three stops and crush skin", "Sous-exposer de trois stops et écraser la peau"),
                ("d", "Always wait for blue hour — noon is unusable forever", "Toujours attendre l’heure bleue — midi est inutilisable à jamais"),
            ],
            correct=["a"],
            expl_en="Portrait genre prioritizes flattering face light. Soften or fill noon sun; don’t just suffer it.",
            expl_fr="Le genre portrait priorise une lumière flatteuse sur le visage. Adoucis ou fill le midi ; ne le subis pas.",
            image=IMG["portrait"],
            alt_en="Soft natural-light portrait",
            alt_fr="Portrait en lumière naturelle douce",
            image_credit=credit("Photo: Unsplash"),
        ),
        Q(
            "gen-31",
            typ="multiple",
            difficulty="hard",
            en="Which clues help you tell editorial fashion from documentary portrait?",
            fr="Quels indices aident à distinguer mode éditoriale et portrait documentaire ?",
            answers=[
                ("a", "Styling, art direction, and controlled locations in fashion", "Stylisme, direction artistique et lieux contrôlés en mode"),
                ("b", "Observational lighting and less staged gesture in documentary", "Lumière d’observation et gestes moins mis en scène en documentaire"),
                ("c", "Both genres always use identical flash setups", "Les deux genres utilisent toujours les mêmes setups flash"),
                ("d", "Intent: sell a look vs. describe a life/situation", "Intention : vendre un look vs décrire une vie/situation"),
            ],
            correct=["a", "b", "d"],
            expl_en="Genres are about intent and control level, not just cameras.",
            expl_fr="Les genres portent sur l’intention et le niveau de contrôle, pas seulement les boîtiers.",
        ),
    ],
    "retouching": [
        Q(
            "edit-24",
            typ="single",
            difficulty="hard",
            en="Client wants ‘cleaner skin’ but natural texture for a lifestyle brand. Risky pipeline?",
            fr="Le client veut une peau « plus propre » mais une texture naturelle pour une marque lifestyle. Pipeline risqué ?",
            answers=[
                (
                    "a",
                    "Global heavy blur / plastic skin smoothers on the whole face",
                    "Flou global / lisseurs plastiques sur tout le visage",
                ),
                ("b", "Spot heal dust only, then gentle frequency or masked texture work", "Corriger poussières au spot, puis travail texture doux / masqué"),
                ("c", "Leave every temporary blemish forever — never touch skin", "Laisser chaque imperfection temporaire — ne jamais toucher la peau"),
                ("d", "Push Clarity +100 on pores to ‘enhance realism’", "Clarity +100 sur les pores pour « plus de réalisme »"),
            ],
            correct=["a"],
            expl_en="Global smoothers kill pores and brand trust. Targeted cleanup keeps texture.",
            expl_fr="Les lisseurs globaux tuent les pores et la confiance de marque. Un nettoyage ciblé garde la texture.",
        ),
        Q(
            "edit-25",
            typ="single",
            difficulty="hard",
            en="You soft-proof for a matte paper profile and see duller reds. Correct interpretation?",
            fr="Tu fais un soft proof pour un profil papier mat et les rouges paraissent ternes. Bonne lecture ?",
            answers=[
                (
                    "a",
                    "Out-of-gamut / paper limits — adjust with proofing on, don’t chase screen pop",
                    "Hors gamut / limites papier — ajuste avec le soft proof, ne chasse pas le pop écran",
                ),
                ("b", "The monitor is broken — ignore paper profiles", "L’écran est cassé — ignore les profils papier"),
                ("c", "Always convert to sRGB before print soft-proof", "Toujours convertir en sRGB avant le soft proof print"),
                ("d", "Matte paper always needs +2 exposure on export", "Le mat demande toujours +2 IL à l’export"),
            ],
            correct=["a"],
            expl_en="Soft proof shows printable color. Fix while proofing instead of trusting an unproofed display.",
            expl_fr="Le soft proof montre la couleur imprimable. Corrige en proof plutôt que de croire l’écran non prouvé.",
        ),
    ],
    "light-color": [
        Q(
            "light-24",
            typ="single",
            difficulty="hard",
            en="Golden-hour backlight through trees: faces underexpose, leaves glow. Best light reading strategy?",
            fr="Contre-jour golden hour dans les arbres : visages sous-exposés, feuilles qui brillent. Meilleure stratégie de mesure ?",
            answers=[
                (
                    "a",
                    "Meter / expose for faces (spot or compensation), accept brighter foliage or add fill",
                    "Mesurer / exposer pour les visages (spot ou compensation), accepter un feuillage plus clair ou ajouter du fill",
                ),
                ("b", "Always expose for the brightest leaf only", "Toujours exposer pour la feuille la plus claire seule"),
                ("c", "Set tungsten WB to fix exposure", "Passer en WB tungstène pour corriger l’expo"),
                ("d", "Lock EV −3 for ‘mood’ on every face", "Verrouiller EV −3 pour l’ambiance sur chaque visage"),
            ],
            correct=["a"],
            expl_en="Decide what must hold detail. Faces usually win; glow can be a rim, not the meter target.",
            expl_fr="Décide ce qui doit garder du détail. Les visages gagnent souvent ; le glow peut être un contour, pas la cible de mesure.",
            image=IMG["forest"],
            alt_en="Sunlight filtering through forest canopy",
            alt_fr="Soleil filtrant à travers la canopée",
            image_credit=credit("Photo: Unsplash"),
        ),
        Q(
            "light-25",
            typ="multiple",
            difficulty="hard",
            en="Mixed lighting (sodium street + LED shop). Which tactics keep skin believable?",
            fr="Lumières mixtes (sodium rue + LED magasin). Quelles tactiques gardent une peau crédible ?",
            answers=[
                ("a", "Pick a dominant source and white-balance for it", "Choisir une source dominante et balancer pour elle"),
                ("b", "Gel flash to match ambient when adding light", "Gélifier le flash pour matcher l’ambiance si on ajoute de la lumière"),
                ("c", "Correct locally in raw for secondary casts", "Corriger localement en raw les dominantes secondaires"),
                ("d", "Auto WB + heavy teal/orange grade as the only plan", "AWB + grade teal/orange lourd comme seul plan"),
            ],
            correct=["a", "b", "c"],
            expl_en="Choose a hero white point, match added light, then local fixes. Global fantasy grades rarely fix mixed casts.",
            expl_fr="Choisis un point blanc héros, aligne la lumière ajoutée, puis corrections locales. Un grade fantaisie global corrige rarement les mixtes.",
        ),
    ],
    "photo-rights": [
        Q(
            "rights-24",
            typ="single",
            difficulty="hard",
            en="You photograph a street musician in a French public place for an editorial blog. What’s the careful default?",
            fr="Tu photographies un musicien de rue dans un lieu public français pour un blog éditorial. Réflexe prudent ?",
            answers=[
                (
                    "a",
                    "Public place helps, but identifiable people + commercial/sensitive use may still need consent — when unsure, ask or don’t publish the face",
                    "Le lieu public aide, mais personnes identifiables + usage commercial/sensible peuvent encore exiger un accord — en doute, demande ou ne publie pas le visage",
                ),
                ("b", "Public place = unlimited commercial use forever", "Lieu public = usage commercial illimité pour toujours"),
                ("c", "Only celebrities need any care", "Seules les célébrités demandent de la prudence"),
                ("d", "Cropping a logo out always erases every right", "Rogner un logo efface toujours tous les droits"),
            ],
            correct=["a"],
            expl_en="Public space ≠ blank check. Context, purpose, and dignity matter — especially for monetized or sensitive publishing.",
            expl_fr="Espace public ≠ chèque en blanc. Contexte, finalité et dignité comptent — surtout pour une publication monétisée ou sensible.",
        ),
    ],
}

# Promote a few already-demanding public-domain mediums to hard (no new images needed).
PROMOTE_HARD = {
    "public-domain": ["pd-05", "pd-14", "pd-15"],
}

LIGHTROOM_QUIZ = {
    "id": "lightroom-workflow",
    "title": {
        "en": "Lightroom workflow",
        "fr": "Workflow Lightroom",
    },
    "description": {
        "en": "Catalogs, Develop, masks, and clean exports — the Pixfan editing path.",
        "fr": "Catalogues, Développement, masques et exports propres — le parcours retouche Pixfan.",
    },
    "difficulty": "medium",
    "questions": [
        Q(
            "lr-01",
            typ="single",
            difficulty="easy",
            en="In Lightroom Classic, photos are best managed primarily through…",
            fr="Dans Lightroom Classic, les photos se gèrent surtout via…",
            answers=[
                ("a", "A catalog that references files (plus folders/collections)", "Un catalogue qui référence les fichiers (plus dossiers/collections)"),
                ("b", "Only renaming files on the Desktop each day", "Seulement renommer les fichiers sur le Bureau chaque jour"),
                ("c", "Deleting the catalog after every export", "Supprimer le catalogue après chaque export"),
                ("d", "Editing only inside the Recycle Bin", "Éditer uniquement dans la Corbeille"),
            ],
            correct=["a"],
            expl_en="Classic is catalog-centric: the database tracks edits while files stay where you store them.",
            expl_fr="Classic est centré catalogue : la base suit les retouches pendant que les fichiers restent où tu les ranges.",
        ),
        Q(
            "lr-02",
            typ="single",
            difficulty="easy",
            en="A non-destructive Develop edit in Lightroom means…",
            fr="Une retouche Développement non destructive dans Lightroom signifie…",
            answers=[
                ("a", "Pixels of the original file are rewritten immediately", "Les pixels du fichier original sont réécrits tout de suite"),
                ("b", "Edits are stored as instructions until you export / save out", "Les retouches sont des instructions jusqu’à l’export / l’enregistrement sortant"),
                ("c", "You can only undo once ever", "Tu ne peux annuler qu’une seule fois dans ta vie"),
                ("d", "JPEG is required for non-destructive work", "Le JPEG est obligatoire pour le non-destructif"),
            ],
            correct=["b"],
            expl_en="Lightroom keeps a recipe. Export (or external edit) materializes pixels.",
            expl_fr="Lightroom garde une recette. L’export (ou l’édition externe) matérialise les pixels.",
        ),
        Q(
            "lr-03",
            typ="single",
            difficulty="easy",
            en="A sensible first Develop check after import is often…",
            fr="Un premier réflexe Développement après import est souvent…",
            answers=[
                ("a", "Max Clarity + Dehaze before looking at exposure", "Clarity + Dehaze au max avant de regarder l’expo"),
                ("b", "Crop randomly without checking horizon or intent", "Rogner au hasard sans regarder l’horizon ni l’intention"),
                (
                    "c",
                    "Review histogram / clipping, set white balance, then global tone",
                    "Regarder histogramme / hautes lumières, régler la balance des blancs, puis le ton global",
                ),
                ("d", "Export 100 copies at full res immediately", "Exporter 100 copies en pleine définition tout de suite"),
            ],
            correct=["c"],
            expl_en="See the data, neutralize cast, set the global exposure story — then local work.",
            expl_fr="Voir les données, neutraliser la dominante, poser l’expo globale — puis le local.",
        ),
        Q(
            "lr-04",
            typ="single",
            difficulty="easy",
            en="Virtual copies are useful because they…",
            fr="Les copies virtuelles sont utiles parce qu’elles…",
            answers=[
                ("a", "Duplicate full RAW files on disk each time", "Dupliquent le RAW complet sur le disque à chaque fois"),
                ("b", "Let you try alternate edits without extra master files", "Permettent d’essayer d’autres retouches sans fichiers masters en plus"),
                ("c", "Replace the need for backups", "Remplacent le besoin de sauvegardes"),
                ("d", "Only work on videos", "Ne marchent que sur les vidéos"),
            ],
            correct=["b"],
            expl_en="Virtual copies are alternate recipes pointing at the same file.",
            expl_fr="Une copie virtuelle = une autre recette pointant le même fichier.",
        ),
        Q(
            "lr-05",
            typ="single",
            difficulty="easy",
            en="Collections (vs folders) are mainly for…",
            fr="Les collections (vs dossiers) servent surtout à…",
            answers=[
                ("a", "Organizing picks/sets without moving files on disk", "Organiser sélections/ensembles sans déplacer les fichiers sur le disque"),
                ("b", "Physically relocating every file into one folder", "Déplacer physiquement chaque fichier dans un seul dossier"),
                ("c", "Deleting rejected photos automatically", "Supprimer auto les photos rejetées"),
                ("d", "Changing camera firmware", "Changer le firmware du boîtier"),
            ],
            correct=["a"],
            expl_en="Folders = disk location. Collections = editorial grouping.",
            expl_fr="Dossiers = emplacement disque. Collections = regroupement éditorial.",
        ),
        Q(
            "lr-06",
            typ="single",
            difficulty="easy",
            en="Export sharpening ‘Screen’ vs ‘Print’ mainly differs because…",
            fr="La netteté d’export « Écran » vs « Impression » diffère surtout parce que…",
            answers=[
                ("a", "Print usually needs stronger sharpening for viewing distance / ink spread", "L’impression demande souvent plus de netteté (distance de vue / diffusion encre)"),
                ("b", "Screen sharpening only works in CMYK", "La netteté écran ne marche qu’en CMJN"),
                ("c", "They are identical always", "Elles sont toujours identiques"),
                ("d", "Print sharpening deletes metadata", "La netteté print efface les métadonnées"),
            ],
            correct=["a"],
            expl_en="Output sharpening matches the medium. Don’t reuse print settings blindly for Instagram.",
            expl_fr="La netteté de sortie suit le support. N’applique pas des réglages print à Instagram sans réfléchir.",
        ),
        Q(
            "lr-07",
            typ="single",
            difficulty="medium",
            en="Profiles vs presets in modern Lightroom — accurate statement?",
            fr="Profils vs préréglages dans Lightroom moderne — affirmation juste ?",
            answers=[
                (
                    "a",
                    "Profiles remap color/tone foundation; presets apply a stack of slider settings",
                    "Les profils remappent la base couleur/ton ; les préréglages appliquent un pile de curseurs",
                ),
                ("b", "Presets replace the need for profiles forever", "Les préréglages remplacent les profils pour toujours"),
                ("c", "Profiles only change file names", "Les profils ne changent que les noms de fichiers"),
                ("d", "They are the same button", "C’est le même bouton"),
            ],
            correct=["a"],
            expl_en="Start with a sensible profile, then dial with presets/sliders — don’t stack conflicting looks blindly.",
            expl_fr="Pars d’un profil sensé, puis ajuste avec préréglages/curseurs — n’empile pas des looks contradictoires.",
        ),
        Q(
            "lr-08",
            typ="single",
            difficulty="medium",
            en="Sync / paste Develop settings across a burst is smart when…",
            fr="Synchroniser / coller les réglages Développement sur une rafale est malin quand…",
            answers=[
                (
                    "a",
                    "Lighting and intent are consistent; then tweak outliers locally",
                    "Lumière et intention sont stables ; puis peaufiner les exceptions en local",
                ),
                ("b", "Every frame has totally different WB and crop needs — sync everything anyway", "Chaque vue a WB et crop totalement différents — tout sync quand même"),
                ("c", "You want to overwrite spot removals uniquely placed on each face", "Tu veux écraser des corrections de taches uniques sur chaque visage"),
                ("d", "Only for JPEG, never RAW", "Seulement pour JPEG, jamais RAW"),
            ],
            correct=["a"],
            expl_en="Batch the shared look; don’t blindly sync highly local fixes.",
            expl_fr="Batch le look commun ; ne synchronise pas à l’aveugle les corrections très locales.",
        ),
        Q(
            "lr-09",
            typ="single",
            difficulty="medium",
            en="Masking (subject / sky / brush) beats a global slider when…",
            fr="Un masque (sujet / ciel / pinceau) bat un curseur global quand…",
            answers=[
                ("a", "You need different treatment on different regions", "Tu dois traiter différemment des zones distinctes"),
                ("b", "You want identical changes on every pixel always", "Tu veux le même changement sur chaque pixel toujours"),
                ("c", "Masks only work on phone exports", "Les masques ne marchent que sur les exports téléphone"),
                ("d", "Global Exposure is forbidden in Lightroom", "L’Exposition globale est interdite dans Lightroom"),
            ],
            correct=["a"],
            expl_en="Global sets the base; masks refine the story without wrecking the rest.",
            expl_fr="Le global pose la base ; les masques raffinent l’histoire sans casser le reste.",
            image=IMG["desk"],
            alt_en="Laptop on a desk suggesting a digital editing workflow",
            alt_fr="Laptop sur un bureau évoquant un flux de retouche numérique",
            image_credit=credit("Photo: Unsplash"),
        ),
        Q(
            "lr-10",
            typ="single",
            difficulty="medium",
            en="Smart Previews help most when you…",
            fr="Les Aperçus dynamiques aident surtout quand tu…",
            answers=[
                (
                    "a",
                    "Edit away from original files (travel/laptop) with lighter proxies",
                    "Retouches loin des originaux (voyage/laptop) via des proxies plus légers",
                ),
                ("b", "Want to permanently delete masters safely", "Veux supprimer définitivement les masters en sécurité"),
                ("c", "Need print-ready TIFF embedded in the catalog", "As besoin de TIFF print embarqués dans le catalogue"),
                ("d", "Only shoot JPEG already", "Shootes déjà uniquement en JPEG"),
            ],
            correct=["a"],
            expl_en="Smart Previews are portable stand-ins. Sync back when originals reconnect.",
            expl_fr="Les aperçus dynamiques sont des doublures portables. On resynchronise quand les originaux reviennent.",
        ),
        Q(
            "lr-11",
            typ="single",
            difficulty="medium",
            en="Lens Corrections / Enable Profile Corrections mainly fix…",
            fr="Corrections de l’objectif / Activer le profil corrige surtout…",
            answers=[
                ("a", "Distortion, vignetting, and often chromatic aberration for known lenses", "Distorsion, vignetage, et souvent aberrations chromatiques pour objectifs connus"),
                ("b", "Focus missed by two meters", "La mise au point ratée de deux mètres"),
                ("c", "Copyright ownership disputes", "Les litiges de droit d’auteur"),
                ("d", "Battery drain on the camera", "La batterie du boîtier"),
            ],
            correct=["a"],
            expl_en="Optical profiles straighten known lens quirks — not creative focus mistakes.",
            expl_fr="Les profils optiques redressent les défauts d’objectifs connus — pas les erreurs de focus créatives.",
        ),
        Q(
            "lr-12",
            typ="single",
            difficulty="medium",
            en="Before client delivery from Lightroom, a smart last pass includes…",
            fr="Avant livraison client depuis Lightroom, une dernière passe maligne inclut…",
            answers=[
                (
                    "a",
                    "Spot check crops, dust, skin ethics, soft-proof if printing, and correct export size/color space",
                    "Vérifier crops, poussières, éthique peau, soft proof si print, et export taille/espace colorimétrique corrects",
                ),
                ("b", "Export once at 72 px wide for everything", "Exporter une fois en 72 px de large pour tout"),
                ("c", "Strip all copyright metadata always", "Retirer toute métadonnée copyright toujours"),
                ("d", "Apply 10 random presets stacked", "Empiler 10 préréglages au hasard"),
            ],
            correct=["a"],
            expl_en="Delivery is craft + professionalism: technical QA and the right output recipe.",
            expl_fr="La livraison = craft + pro : QA technique et la bonne recette de sortie.",
        ),
        Q(
            "lr-13",
            typ="single",
            difficulty="medium",
            en="Tone Curve vs Basic panel — when prefer the curve?",
            fr="Courbe des tons vs panneau de base — quand préférer la courbe ?",
            answers=[
                (
                    "a",
                    "For precise contrast shaping / channel curves after a solid Basic exposure",
                    "Pour modeler précisément le contraste / courbes par canal après une expo Basic solide",
                ),
                ("b", "Always instead of setting Exposure at all", "Toujours à la place de régler l’Exposition"),
                ("c", "Only to change filename case", "Seulement pour changer la casse des noms de fichiers"),
                ("d", "Never — curves are obsolete", "Jamais — les courbes sont obsolètes"),
            ],
            correct=["a"],
            expl_en="Basic gets you close; curves refine contrast and color with finer control.",
            expl_fr="Le Basic rapproche ; la courbe raffine contraste et couleur avec plus de contrôle.",
        ),
        Q(
            "lr-14",
            typ="single",
            difficulty="medium",
            en="Range masks (luminance/color) refine a selection by…",
            fr="Les masques de gamme (luminance/couleur) raffinent une sélection en…",
            answers=[
                ("a", "Limiting the mask to similar brightness or hue ranges", "Limitant le masque à des plages de luminosité ou de teinte similaires"),
                ("b", "Deleting the catalog automatically", "Supprimant automatiquement le catalogue"),
                ("c", "Changing shutter speed on the camera", "Changeant la vitesse d’obturation sur le boîtier"),
                ("d", "Converting RAW to TIFF in place", "Convertissant le RAW en TIFF sur place"),
            ],
            correct=["a"],
            expl_en="After a broad mask, range limits keep adjustments on the tones/colors you mean.",
            expl_fr="Après un masque large, la gamme garde l’ajustement sur les tons/couleurs visés.",
        ),
        Q(
            "lr-15",
            typ="single",
            difficulty="hard",
            en="AI Denoise vs sharpening: best order of thinking?",
            fr="Denoise IA vs netteté : meilleur ordre de pensée ?",
            answers=[
                (
                    "a",
                    "Clean noise first (especially on high ISO), then sharpen carefully for output",
                    "Nettoyer le bruit d’abord (surtout haut ISO), puis aiguiser avec soin pour la sortie",
                ),
                ("b", "Sharpen aggressively first to ‘create’ detail from noise", "Aiguiser fort d’abord pour « créer » du détail depuis le bruit"),
                ("c", "Never denoise portraits", "Ne jamais débruiter les portraits"),
                ("d", "Denoise only after uploading to social", "Débruiter seulement après upload social"),
            ],
            correct=["a"],
            expl_en="Sharpening noise makes grit. Stabilize the file, then sharpen for the medium.",
            expl_fr="Aiguiser du bruit = du grain agressif. Stabilise le fichier, puis netteté selon le support.",
        ),
        Q(
            "lr-16",
            typ="single",
            difficulty="hard",
            en="Color Grading wheels vs HSL — when is Grading the better tool?",
            fr="Roues Color Grading vs HSL — quand le Grading est le meilleur outil ?",
            answers=[
                (
                    "a",
                    "Shaping mood across shadows/midtones/highlights as a cinematic grade",
                    "Modeler l’ambiance ombres/tons moyens/hautes lumières comme un grade cinéma",
                ),
                ("b", "Fixing a single wrong white-balance reading only", "Corriger uniquement une balance des blancs fausse"),
                ("c", "Removing dust spots", "Retirer des poussières"),
                ("d", "Renaming folders", "Renommer des dossiers"),
            ],
            correct=["a"],
            expl_en="HSL targets specific hues; Grading paints atmosphere across tonal regions.",
            expl_fr="HSL cible des teintes ; le Grading peint une atmosphère par zones tonales.",
        ),
        Q(
            "lr-17",
            typ="single",
            difficulty="hard",
            en="Soft proof shows clipping warnings on a print profile. Best response?",
            fr="Le soft proof montre des alertes de gamut sur un profil print. Bonne réaction ?",
            answers=[
                (
                    "a",
                    "Adjust with soft proof on (intent/rendering) until critical colors hold",
                    "Ajuster avec soft proof actif (intention de rendu) jusqu’à tenir les couleurs critiques",
                ),
                ("b", "Ignore and print the screen look anyway", "Ignorer et imprimer le rendu écran quand même"),
                ("c", "Convert to sRGB then soft-proof the same sRGB again", "Convertir en sRGB puis soft-proof le même sRGB"),
                ("d", "Raise Vibrance +100 to ‘force’ gamut", "Monter Vibrance +100 pour « forcer » le gamut"),
            ],
            correct=["a"],
            expl_en="Soft proof is the rehearsal. Edit for the paper, not the glowing display.",
            expl_fr="Le soft proof est la répétition. Retouche pour le papier, pas pour l’écran qui brille.",
        ),
        Q(
            "lr-18",
            typ="multiple",
            difficulty="hard",
            en="Which practices keep a Lightroom catalog healthy long-term?",
            fr="Quelles pratiques gardent un catalogue Lightroom sain sur la durée ?",
            answers=[
                ("a", "Regular catalog backups + verified disk backups of originals", "Sauvegardes régulières du catalogue + backups disque vérifiés des originaux"),
                ("b", "Store the only catalog copy on a failing USB stick", "Garder la seule copie du catalogue sur une clé USB mourante"),
                ("c", "Use consistent folder moves inside Lightroom so links don’t break", "Déplacer les dossiers via Lightroom pour ne pas casser les liens"),
                ("d", "Occasional Optimize Catalog / don’t ignore integrity warnings", "Optimiser le catalogue de temps en temps / ne pas ignorer les alertes d’intégrité"),
            ],
            correct=["a", "c", "d"],
            expl_en="Catalog + masters both need backups. Move files through Lightroom; maintain the database.",
            expl_fr="Catalogue + masters doivent être sauvegardés. Déplace via Lightroom ; entretiens la base.",
        ),
        Q(
            "lr-19",
            typ="single",
            difficulty="hard",
            en="You batch-synced a look, then notice one face has a healing spot cloned from another frame’s dust. Cause?",
            fr="Tu as synchronisé un look, puis un visage a un tampon collé depuis la poussière d’une autre vue. Cause ?",
            answers=[
                (
                    "a",
                    "Spot removal / local fixes were included in sync — deselect highly local tools when batching",
                    "Les corrections localisées / tampon étaient dans la sync — décoche les outils très locaux en batch",
                ),
                ("b", "Lightroom always invents spots from AI", "Lightroom invente toujours des taches via IA"),
                ("c", "Export sharpening creates healing spots", "La netteté d’export crée des tampons"),
                ("d", "Virtual copies disable spot tools", "Les copies virtuelles désactivent les tampons"),
            ],
            correct=["a"],
            expl_en="Sync checkboxes matter. Share WB/tone; keep healing unique per frame.",
            expl_fr="Les cases de sync comptent. Partage WB/ton ; garde le tampon unique par vue.",
        ),
        Q(
            "lr-20",
            typ="single",
            difficulty="hard",
            en="Client needs sRGB web + Adobe RGB print from one master. Clean Pixfan-style workflow?",
            fr="Le client veut sRGB web + Adobe RGB print depuis un master. Workflow propre façon Pixfan ?",
            answers=[
                (
                    "a",
                    "Finish the master in a wide working space, soft-proof print, then separate exports with correct profiles/sizes",
                    "Finir le master en grand espace de travail, soft-proof print, puis exports séparés avec profils/tailles corrects",
                ),
                ("b", "Export once to sRGB and upsample that for print", "Exporter une fois en sRGB et sur-échantillonner pour le print"),
                ("c", "Email the .lrcat file as the deliverable", "Envoyer le .lrcat comme livrable"),
                ("d", "Convert to grayscale to ‘simplify color management’", "Passer en niveaux de gris pour « simplifier » la couleur"),
            ],
            correct=["a"],
            expl_en="One master, multiple purposeful exports — don’t print from a crushed web JPEG.",
            expl_fr="Un master, plusieurs exports ciblés — n’imprime pas depuis un JPEG web écrasé.",
            image=IMG["cascade"],
            alt_en="Long-exposure waterfall suggesting careful processing of highlights and motion",
            alt_fr="Cascade en pose longue suggérant un traitement soigné des hautes lumières",
            image_credit=credit("Photo: Unsplash"),
        ),
    ],
}


def main() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    quizzes = {q["id"]: q for q in data["quizzes"]}

    before = {"easy": 0, "medium": 0, "hard": 0}
    for qz in data["quizzes"]:
        for q in qz["questions"]:
            before[q.get("difficulty", "medium")] += 1

    for quiz_id, new_qs in HARD_ADDITIONS.items():
        quiz = quizzes[quiz_id]
        existing = {q["id"] for q in quiz["questions"]}
        for q in new_qs:
            if q["id"] in existing:
                raise SystemExit(f"duplicate id {q['id']} in {quiz_id}")
            quiz["questions"].append(q)

    for quiz_id, ids in PROMOTE_HARD.items():
        quiz = quizzes[quiz_id]
        by_id = {q["id"]: q for q in quiz["questions"]}
        for qid in ids:
            by_id[qid]["difficulty"] = "hard"

    if "lightroom-workflow" in quizzes:
        raise SystemExit("lightroom-workflow already exists")
    data["quizzes"].append(LIGHTROOM_QUIZ)

    after = {"easy": 0, "medium": 0, "hard": 0}
    total = 0
    for qz in data["quizzes"]:
        for q in qz["questions"]:
            after[q.get("difficulty", "medium")] += 1
            total += 1

    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("quizzes", len(data["quizzes"]))
    print("total", total)
    print("before", before)
    print("after", after)
    print("delta hard", after["hard"] - before["hard"])


if __name__ == "__main__":
    main()

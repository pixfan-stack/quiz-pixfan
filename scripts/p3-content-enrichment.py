#!/usr/bin/env python3
"""Vague 1.16 P3: enrich under-illustrated packs, rebalance history-icons,
and add portrait-light Pixfan thematic quiz.

Downloads missing Unsplash photos → AVIF, assigns imageUrl/alt/credit,
updates SOURCES.md + sw.js IMAGE_URLS.
"""

from __future__ import annotations

import json
import re
import subprocess
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public/data/questions.json"
OUT_DIR = ROOT / "public/images/packs"
PUBLIC_DIR = ROOT / "public/images/public-domain"
SOURCES = OUT_DIR / "SOURCES.md"
SW = ROOT / "public/sw.js"
USER_AGENT = "QuizPixFanMirror/1.0 (+https://github.com/pixfan-stack/quiz-pixfan)"

CREDIT = {
    "en": "Unsplash — free to use (Unsplash License)",
    "fr": "Unsplash — libre d'utilisation (licence Unsplash)",
}

U = "https://images.unsplash.com/{id}?auto=format&fit=crop&w=960&q=80"


def meta(photo_id: str, alt_en: str, alt_fr: str) -> dict:
    return {
        "photo_id": photo_id,
        "imageAlt": {"en": alt_en, "fr": alt_fr},
    }


# Raise packs still at 8–10 toward ≥12 illustrated questions.
ASSIGNMENTS: dict[str, dict[str, dict]] = {
    "exposure-basics": {
        "exp-6": meta(
            "photo-1518182170546-07661fd94144",
            "Silky waterfall long exposure — slow shutter territory",
            "Cascade soyeuse en pose longue — terrain de l’obturateur lent",
        ),
        "exp-13": meta(
            "photo-1493863641943-9b68992a8d07",
            "Photographer with shallow depth of field behind the subject",
            "Photographe avec faible profondeur de champ derrière le sujet",
        ),
        "exp-17": meta(
            "photo-1514565131-fce0801e5785",
            "City lights at night — high ISO trade-offs",
            "Lumières de ville la nuit — compromis haut ISO",
        ),
        "exp-25": meta(
            "photo-1419242902214-272b3f66ee7a",
            "Night sky — noise vs blur when raising ISO",
            "Ciel nocturne — bruit vs flou en montant l’ISO",
        ),
    },
    "genres": {
        "gen-5": meta(
            "photo-1564349683136-77e08dba1ef7",
            "Wildlife subject in natural habitat",
            "Sujet wildlife dans son habitat naturel",
        ),
        "gen-8": meta(
            "photo-1504674900247-0877df9cc836",
            "Styled food plate ready for a food-photography setup",
            "Assiette stylisée prête pour un setup food photo",
        ),
        "gen-10": meta(
            "photo-1419242902214-272b3f66ee7a",
            "Starry night sky for astrophotography",
            "Ciel étoilé pour l’astrophotographie",
        ),
        "gen-20": meta(
            "photo-1519501025264-65ba15a82390",
            "Night city skyline — night photography trade-offs",
            "Skyline urbain de nuit — compromis de la photo nocturne",
        ),
    },
    "history-icons": {
        "hist-6": meta(
            "photo-1554048612-b6a482bc67e5",
            "Vintage camera suggesting early photographic processes",
            "Appareil vintage évoquant les premiers procédés photo",
        ),
        "hist-7": meta(
            "photo-1452587925148-ce544e77e70d",
            "Classic camera body — democratized snapshot culture",
            "Boîtier classique — culture du cliché démocratisé",
        ),
        "hist-9": meta(
            "photo-1500534314209-a25ddb2bd429",
            "Documentary landscape mood — Depression-era photo tradition",
            "Paysage documentaire — tradition photo des années de crise",
        ),
        "hist-13": meta(
            "photo-1469474968028-56623f02e42e",
            "Dramatic tonal landscape — Zone System territory",
            "Paysage aux tons dramatiques — terrain du Zone System",
        ),
        "hist-16": meta(
            "photo-1449824913935-59a10b8d2000",
            "Crowded urban square — iconic photojournalism moments",
            "Place urbaine bondée — moments iconiques du photojournalisme",
        ),
        "hist-22": meta(
            "photo-1495616811223-4d98c6e9c869",
            "Parisian street atmosphere — staged vs candid debates",
            "Atmosphère de rue parisienne — débats mise en scène vs candide",
        ),
    },
    "photo-rights": {
        "rights-3": meta(
            "photo-1450101499163-c8848c66ca85",
            "License paperwork — Creative Commons choices matter",
            "Documents de licence — les choix Creative Commons comptent",
        ),
        "rights-6": meta(
            "photo-1449824913935-59a10b8d2000",
            "Public street and buildings — freer to photograph, not always to sell",
            "Rue et bâtiments publics — plus libre à photographier, pas toujours à vendre",
        ),
        "rights-7": meta(
            "photo-1534528741775-53994a69daeb",
            "Recognizable person — dignity and consent habits",
            "Personne reconnaissable — dignité et réflexes de consentement",
        ),
        "rights-12": meta(
            "photo-1677442136019-21780ecad995",
            "Abstract AI / neural imagery — scraped-training debates",
            "Imagerie abstraite IA — débats sur l’entraînement scrapé",
        ),
        "rights-15": meta(
            "photo-1521791136064-7986c2920216",
            "Handshake — clear delivery agreements with clients",
            "Poignée de main — accords de livraison clairs avec les clients",
        ),
        "rights-23": meta(
            "photo-1620712943543-bcc4688e7485",
            "Robot / AI metaphor — disclose synthetic images honestly",
            "Métaphore robot / IA — divulguer honnêtement les images synthétiques",
        ),
    },
    "portrait-light": {
        "pl-01": meta(
            "photo-1531746020798-e6953c6e8e04",
            "Close portrait with soft directional light on the face",
            "Portrait serré avec lumière directionnelle douce sur le visage",
        ),
        "pl-02": meta(
            "photo-1544005313-94ddf0286df2",
            "Face lit from the side — Rembrandt / loop lighting territory",
            "Visage éclairé de côté — terrain Rembrandt / loop",
        ),
        "pl-03": meta(
            "photo-1438761681033-6461ffad8d80",
            "Warm outdoor portrait in flattering open shade",
            "Portrait outdoor chaud à l’ombre ouverte flatteuse",
        ),
        "pl-05": meta(
            "photo-1500648767791-00dcc994a43e",
            "Short-tele portrait look with compressed background",
            "Look portrait petit télé avec arrière-plan compressé",
        ),
        "pl-07": meta(
            "photo-1494790108377-be9c29b29330",
            "Catchlights visible in the eyes under soft key light",
            "Catchlights visibles dans les yeux sous une clé douce",
        ),
        "pl-09": meta(
            "photo-1517841905240-472988babdf9",
            "Outdoor portrait with golden-hour rim light",
            "Portrait outdoor avec lumière d’accent golden hour",
        ),
        "pl-11": meta(
            "photo-1487412720507-e7ab37603c6f",
            "Soft beauty light wrapping the face evenly",
            "Lumière beauté douce enveloppant le visage",
        ),
        "pl-13": meta(
            "photo-1529626455594-4ff0802cfb7e",
            "Fashion-leaning portrait with controlled contrast",
            "Portrait mode avec contraste maîtrisé",
        ),
        "pl-15": meta(
            "photo-1507003211169-0a1dd7228f2d",
            "Male portrait with clean key and gentle fill",
            "Portrait masculin avec clé nette et fill doux",
        ),
        "pl-17": meta(
            "photo-1515886657613-9f3515b0c78f",
            "Full-length fashion portrait — light shape on the figure",
            "Portrait mode en pied — dessin de lumière sur la silhouette",
        ),
        "pl-19": meta(
            "photo-1524504388940-b1c1722653e1",
            "Environmental portrait with window light from camera-left",
            "Portrait environnemental avec lumière de fenêtre à gauche",
        ),
        "pl-20": meta(
            "photo-1552374196-c4e7ffc6e126",
            "Dramatic portrait with harder side light and deep shadows",
            "Portrait dramatique avec lumière latérale plus dure et ombres profondes",
        ),
    },
}

# history-icons: demote trivia-hard → medium; promote a few medium → easy.
HIST_HARD_TO_MEDIUM = [
    "hist-8",
    "hist-9",
    "hist-10",
    "hist-12",
    "hist-14",
    "hist-15",
    "hist-16",
    "hist-17",
]
HIST_MEDIUM_TO_EASY = ["hist-1", "hist-2", "hist-5", "hist-6", "hist-7"]


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
) -> dict:
    return {
        "id": id,
        "type": typ,
        "difficulty": difficulty,
        "text": {"en": en, "fr": fr},
        "answers": [
            {"id": a, "text": {"en": en_a, "fr": fr_a}} for a, en_a, fr_a in answers
        ],
        "correctAnswers": correct,
        "explanation": {"en": expl_en, "fr": expl_fr},
    }


PORTRAIT_LIGHT_QUIZ = {
    "id": "portrait-light",
    "title": {
        "en": "Portrait & light (Pixfan path)",
        "fr": "Portrait & lumière (parcours Pixfan)",
    },
    "description": {
        "en": "Key, fill, window light, and flattering face light — the portrait craft Pixfan teaches before heavy retouching.",
        "fr": "Clé, fill, lumière de fenêtre et lumière flatteuse sur le visage — le craft portrait que Pixfan enseigne avant la grosse retouche.",
    },
    "difficulty": "medium",
    "questions": [
        Q(
            "pl-01",
            typ="single",
            difficulty="easy",
            en="In a classic one-light portrait, the main light shaping the face is called the…",
            fr="Dans un portrait classique à une lumière, la lumière principale qui sculpte le visage s’appelle…",
            answers=[
                ("a", "Key light", "La lumière clé (key)"),
                ("b", "Hair light only", "Seulement le hair light"),
                ("c", "Background gel", "Le gélatiné de fond"),
                ("d", "Catchlight gel", "Le gélatiné catchlight"),
            ],
            correct=["a"],
            expl_en="The key sets direction and contrast on the face; fill and accents come after.",
            expl_fr="La clé pose la direction et le contraste sur le visage ; fill et accents viennent ensuite.",
        ),
        Q(
            "pl-02",
            typ="single",
            difficulty="easy",
            en="Rembrandt lighting is recognized by…",
            fr="La lumière Rembrandt se reconnaît à…",
            answers=[
                (
                    "a",
                    "A triangle of light on the shadowed cheek under the eye",
                    "Un triangle de lumière sur la joue ombrée sous l’œil",
                ),
                ("b", "Even flat light with zero nose shadow", "Une lumière plate sans aucune ombre de nez"),
                ("c", "Only rim light from behind", "Seulement un rim light de derrière"),
                ("d", "Red/cyan split gel on both cheeks", "Un split gel rouge/cyan sur les deux joues"),
            ],
            correct=["a"],
            expl_en="Key ≈45° up and to the side creates the classic cheek triangle.",
            expl_fr="Une clé ≈45° en hauteur et de côté crée le triangle classique sur la joue.",
        ),
        Q(
            "pl-03",
            typ="single",
            difficulty="easy",
            en="Harsh noon sun outdoors for a flattering headshot — best first rescue?",
            fr="Soleil de midi cruel pour un portrait flatteur — premier sauvetage ?",
            answers=[
                (
                    "a",
                    "Open shade, diffuser, or bounce fill — soften the overhead punch",
                    "Ombre ouverte, diffuseur ou fill en bounce — adoucir le coup d’en haut",
                ),
                ("b", "Always underexpose two stops and crush skin", "Toujours sous-exposer de 2 IL et écraser la peau"),
                ("c", "Shoot only at f/22 facing the sun", "Shooter seulement à f/22 face au soleil"),
                ("d", "Disable white balance forever", "Désactiver la balance des blancs pour toujours"),
            ],
            correct=["a"],
            expl_en="Portrait craft prioritizes flattering face light; don’t fight hard overhead sun bare.",
            expl_fr="Le craft portrait priorise une lumière flatteuse sur le visage ; ne subis pas le soleil zénithal nu.",
        ),
        Q(
            "pl-04",
            typ="single",
            difficulty="easy",
            en="What does fill light mainly do in a portrait?",
            fr="Que fait surtout le fill light en portrait ?",
            answers=[
                (
                    "a",
                    "Lift shadow side contrast without becoming a second hard key",
                    "Remonter le contraste du côté ombre sans devenir une seconde clé dure",
                ),
                ("b", "Replace the need for a key light", "Remplacer le besoin d’une lumière clé"),
                ("c", "Only light the background seamless", "Éclairer seulement le fond cyclorama"),
                ("d", "Freeze motion like a high-speed flash", "Figer le mouvement comme un flash ultra-rapide"),
            ],
            correct=["a"],
            expl_en="Fill controls how deep shadows feel; key still owns direction.",
            expl_fr="Le fill contrôle la profondeur des ombres ; la clé garde la direction.",
        ),
        Q(
            "pl-05",
            typ="single",
            difficulty="easy",
            en="A classic flattering full-frame portrait focal-length instinct is often…",
            fr="Un réflexe de focale flatteuse en portrait plein format est souvent…",
            answers=[
                (
                    "a",
                    "Short tele (~70–105 mm) with a moderate working distance",
                    "Petit télé (~70–105 mm) avec une distance de travail raisonnable",
                ),
                ("b", "Ultra-wide at arm’s length for every headshot", "Ultra grand-angle à bout de bras pour chaque tête"),
                ("c", "Fish-eye for corporate headshots", "Fish-eye pour les portraits corporate"),
                ("d", "Only 14 mm for beauty work", "Seulement 14 mm pour la beauté"),
            ],
            correct=["a"],
            expl_en="Short teles compress gently and keep facial proportions natural at a polite distance.",
            expl_fr="Les petits télés compressent doucement et gardent des proportions naturelles à bonne distance.",
        ),
        Q(
            "pl-06",
            typ="single",
            difficulty="medium",
            en="Butterfly (Paramount) lighting places the key…",
            fr="La lumière papillon (Paramount) place la clé…",
            answers=[
                (
                    "a",
                    "High and centered, casting a small nose shadow under the nose",
                    "Haute et centrée, avec une petite ombre sous le nez",
                ),
                ("b", "Low from the floor for horror shadows", "Basse depuis le sol pour des ombres d’horreur"),
                ("c", "Directly behind the subject only", "Directement derrière le sujet seulement"),
                ("d", "As two opposing hard rim lights with no front light", "Comme deux rim durs opposés sans lumière frontale"),
            ],
            correct=["a"],
            expl_en="Classic beauty/old-Hollywood key sits high on axis for a butterfly nose shadow.",
            expl_fr="La clé beauté / vieux Hollywood est haute sur l’axe pour l’ombre papillon sous le nez.",
        ),
        Q(
            "pl-07",
            typ="single",
            difficulty="medium",
            en="Catchlights in the eyes usually tell you…",
            fr="Les catchlights dans les yeux indiquent surtout…",
            answers=[
                (
                    "a",
                    "Where the key (and fill) sat relative to the subject",
                    "Où étaient la clé (et le fill) par rapport au sujet",
                ),
                ("b", "The exact ISO the camera used", "L’ISO exact utilisé par l’appareil"),
                ("c", "Whether the lens is prime or zoom", "Si l’objectif est une focale fixe ou un zoom"),
                ("d", "That the photo is always AI-generated", "Que la photo est toujours générée par IA"),
            ],
            correct=["a"],
            expl_en="Read the eye reflections to reverse-engineer light position and modifier size.",
            expl_fr="Lis les reflets dans l’œil pour retrouver position et taille de la source.",
        ),
        Q(
            "pl-08",
            typ="single",
            difficulty="medium",
            en="Window light portrait: subject faces the window. Softest look usually comes from…",
            fr="Portrait à la fenêtre : le sujet face à la fenêtre. Le look le plus doux vient souvent de…",
            answers=[
                (
                    "a",
                    "A large north-facing / overcast window acting like a softbox",
                    "Une grande fenêtre nord / ciel couvert qui agit comme une softbox",
                ),
                ("b", "Hard direct sun speckles through venetian blinds only", "Seulement des taches de soleil dur à travers des stores"),
                ("c", "A tiny spotlight from across the room", "Un tout petit spot de l’autre bout de la pièce"),
                ("d", "Turning the subject’s back fully to the window always", "Toujours tourner le dos complètement à la fenêtre"),
            ],
            correct=["a"],
            expl_en="Large, soft, diffused sources wrap the face; harsh sun through glass is another tool.",
            expl_fr="Une grande source proche et diffusée enveloppe le visage ; le soleil dur à travers la vitre est un autre outil.",
        ),
        Q(
            "pl-09",
            typ="single",
            difficulty="medium",
            en="Golden-hour outdoor portraits often work because…",
            fr="Les portraits golden hour marchent souvent parce que…",
            answers=[
                (
                    "a",
                    "Low warm light is softer and more directional than harsh midday sun",
                    "La lumière basse et chaude est plus douce et directionnelle que le midi cruel",
                ),
                ("b", "ISO must be locked at 50 forever", "L’ISO doit rester bloqué à 50 pour toujours"),
                ("c", "White balance disappears as a concept", "La balance des blancs disparaît comme concept"),
                ("d", "You can only shoot silhouettes then", "Tu ne peux shooter que des silhouettes à ce moment-là"),
            ],
            correct=["a"],
            expl_en="Angle + warmth + longer shadows give flattering shape without fighting overhead sun.",
            expl_fr="L’angle + la chaleur + les ombres longues sculptent sans combattre le soleil zénithal.",
        ),
        Q(
            "pl-10",
            typ="multiple",
            difficulty="medium",
            en="Which choices usually soften a hard key on a face?",
            fr="Quels choix adoucissent généralement une clé dure sur un visage ?",
            answers=[
                ("a", "Larger modifier / diffuser closer to the subject", "Modificateur plus grand / diffuseur plus proche du sujet"),
                ("b", "Moving a bare bulb farther and smaller in the frame", "Éloigner une ampoule nue pour la rendre plus petite"),
                ("c", "Adding bounce or a reflector as gentle fill", "Ajouter un bounce ou un réflecteur en fill doux"),
                ("d", "Always raising Clarity to +100 in-camera", "Toujours monter Clarity à +100 dans l’appareil"),
            ],
            correct=["a", "c"],
            expl_en="Bigger/closer sources wrap; fill lifts shadows. Tiny distant bare bulbs get harder.",
            expl_fr="Sources plus grandes/proches = plus d’enveloppe ; le fill remonte les ombres. Une ampoule nue lointaine durcit.",
        ),
        Q(
            "pl-11",
            typ="single",
            difficulty="medium",
            en="Clamshell beauty lighting typically combines…",
            fr="La lumière beauté « clamshell » combine typiquement…",
            answers=[
                (
                    "a",
                    "A key from above and a fill/reflector from below under the chin",
                    "Une clé du dessus et un fill/réflecteur sous le menton",
                ),
                ("b", "Only two rim lights and a black flag on the face", "Seulement deux rim lights et un drapeau noir sur le visage"),
                ("c", "A single candle at floor level", "Une seule bougie au niveau du sol"),
                ("d", "Cross-polarized flash through a microscope", "Un flash polarisé croisé à travers un microscope"),
            ],
            correct=["a"],
            expl_en="Top key + under-fill opens eye sockets and softens under-chin shadows.",
            expl_fr="Clé du dessus + fill dessous ouvre les orbites et adoucit sous le menton.",
        ),
        Q(
            "pl-12",
            typ="single",
            difficulty="medium",
            en="Split lighting on a face means…",
            fr="La lumière split sur un visage signifie…",
            answers=[
                (
                    "a",
                    "Half the face in key, half essentially in shadow",
                    "Une moitié de visage en clé, l’autre essentiellement à l’ombre",
                ),
                ("b", "Even loop shadows on both cheeks identically", "Des ombres loop identiques sur les deux joues"),
                ("c", "Only hair light with no front exposure", "Seulement un hair light sans expo frontale"),
                ("d", "RGB continuous lights cycling every second", "Des LED RGB qui cyclent chaque seconde"),
            ],
            correct=["a"],
            expl_en="Key at ~90° creates a dramatic half-and-half face — useful, not default flattering.",
            expl_fr="Une clé à ~90° crée un demi-visage dramatique — utile, pas le flatteur par défaut.",
        ),
        Q(
            "pl-13",
            typ="single",
            difficulty="medium",
            en="You want creamy background separation on a portrait without moving outdoors. First instinct?",
            fr="Tu veux un fond crémeux en portrait sans sortir. Premier réflexe ?",
            answers=[
                (
                    "a",
                    "Wider aperture + more subject-to-background distance + longer focal length",
                    "Ouverture plus ouverte + plus de distance sujet–fond + focale plus longue",
                ),
                ("b", "f/16 and put the subject against the seamless at 10 cm", "f/16 et coller le sujet à 10 cm du fond"),
                ("c", "Raise ISO until noise blurs the background", "Monter l’ISO jusqu’à ce que le bruit floute le fond"),
                ("d", "Always use the built-in popup flash bounced off nothing", "Toujours le flash pop-up sans bounce"),
            ],
            correct=["a"],
            expl_en="DOF is optics + geometry — aperture, distance, and focal length work together.",
            expl_fr="La PdC = optique + géométrie — ouverture, distances et focale travaillent ensemble.",
        ),
        Q(
            "pl-14",
            typ="single",
            difficulty="hard",
            en="Lighting ratio ~4:1 (key vs fill) on a face generally feels…",
            fr="Un ratio d’éclairage ~4:1 (clé vs fill) sur un visage paraît généralement…",
            answers=[
                (
                    "a",
                    "Fairly contrasty / dramatic compared with 2:1",
                    "Assez contrasté / dramatique par rapport à 2:1",
                ),
                ("b", "Completely flat like overcast noon fill", "Totalement plat comme un fill de midi couvert"),
                ("c", "Identical to butterfly with no shadows", "Identique au papillon sans aucune ombre"),
                ("d", "A white-balance setting, not a contrast idea", "Un réglage de balance des blancs, pas une idée de contraste"),
            ],
            correct=["a"],
            expl_en="Higher key-to-fill ratios deepen the shadow side; 2:1 is gentler, 8:1 more dramatic.",
            expl_fr="Plus le ratio clé/fill monte, plus le côté ombre s’assombrit ; 2:1 est plus doux, 8:1 plus dramatique.",
        ),
        Q(
            "pl-15",
            typ="single",
            difficulty="hard",
            en="Broad vs short lighting: short lighting typically…",
            fr="Broad vs short lighting : le short lighting typiquement…",
            answers=[
                (
                    "a",
                    "Lights the side of the face turned away from camera — often slimming",
                    "Éclaire le côté du visage tourné loin de la caméra — souvent amincissant",
                ),
                ("b", "Always lights only the ears from behind", "N’éclaire toujours que les oreilles depuis derrière"),
                ("c", "Means using only wide-angle lenses", "Signifie n’utiliser que des grands-angles"),
                ("d", "Is identical to flat on-camera flash", "Est identique au flash cobra plat sur l’appareil"),
            ],
            correct=["a"],
            expl_en="Short lighting puts more shadow toward camera — classic flattering pattern for many faces.",
            expl_fr="Le short lighting met plus d’ombre vers la caméra — schéma classique flatteur pour beaucoup de visages.",
        ),
        Q(
            "pl-16",
            typ="single",
            difficulty="hard",
            en="Backlit portrait: you want face detail AND a glowing rim. Sensible exposure approach?",
            fr="Portrait à contre-jour : tu veux le visage lisible ET un rim lumineux. Approche d’expo sensée ?",
            answers=[
                (
                    "a",
                    "Expose for the face (or add fill/flash), accept or shape the bright rim",
                    "Exposer pour le visage (ou ajouter fill/flash), accepter ou sculpter le rim clair",
                ),
                ("b", "Meter only the sky and crush the face to black always", "Mesurer seulement le ciel et écraser le visage au noir toujours"),
                ("c", "Disable all metering and guess ISO 25600", "Désactiver toute mesure et miser sur ISO 25600"),
                ("d", "Use the smallest aperture and slowest shutter possible indoors", "Utiliser la plus petite ouverture et le plus lent obturateur en intérieur"),
            ],
            correct=["a"],
            expl_en="Protect the face first; rim is a bonus you can fill against or embrace as highlight.",
            expl_fr="Protège d’abord le visage ; le rim est un bonus que tu combles ou que tu assumes en haute lumière.",
        ),
        Q(
            "pl-17",
            typ="single",
            difficulty="hard",
            en="Hard beauty dish vs large softbox close to the face — typical difference?",
            fr="Beauty dish dure vs grande softbox proche du visage — différence typique ?",
            answers=[
                (
                    "a",
                    "Beauty dish = punchier contrast/specular; big softbox = softer wrap",
                    "Beauty dish = contraste/spéculaire plus punchy ; grande softbox = enveloppe plus douce",
                ),
                ("b", "They are optically identical at any distance", "Elles sont optiquement identiques à toute distance"),
                ("c", "Softboxes always create harsher nose shadows", "Les softbox créent toujours des ombres de nez plus dures"),
                ("d", "Beauty dishes only work underwater", "Les beauty dishes ne marchent que sous l’eau"),
            ],
            correct=["a"],
            expl_en="Modifier size/distance and design change specular quality — not just “bright vs dark”.",
            expl_fr="Taille/distance et design du modificateur changent le spéculaire — pas seulement « clair vs sombre ».",
        ),
        Q(
            "pl-18",
            typ="multiple",
            difficulty="hard",
            en="Which habits help keep skin tones believable under mixed portrait light?",
            fr="Quelles habitudes aident à garder des tons chair crédibles sous lumière portrait mixte ?",
            answers=[
                (
                    "a",
                    "Set / gel lights toward a consistent white balance plan",
                    "Régler / gélatiner les lumières vers un plan de balance cohérent",
                ),
                (
                    "b",
                    "Check a grey card or known neutral when casts fight",
                    "Vérifier une charte grise ou un neutre connu quand les dominantes se battent",
                ),
                ("c", "Always max magenta and yellow “for warmth” blindly", "Toujours max magenta et jaune « pour la chaleur » à l’aveugle"),
                ("d", "Ignore the histogram because portraits don’t clip", "Ignorer l’histogramme car les portraits ne crament jamais"),
            ],
            correct=["a", "b"],
            expl_en="Mixed sources need a WB plan; references beat guessing saturation.",
            expl_fr="Les sources mixtes demandent un plan WB ; les références battent la saturation au feeling.",
        ),
        Q(
            "pl-19",
            typ="single",
            difficulty="easy",
            en="Environmental portrait usually means…",
            fr="Un portrait environnemental signifie surtout…",
            answers=[
                (
                    "a",
                    "Showing the person in a context that tells something about them",
                    "Montrer la personne dans un contexte qui en dit quelque chose",
                ),
                ("b", "Only studio seamless with zero background props", "Seulement un fond studio sans aucun accessoire"),
                ("c", "Macro of an eye and nothing else", "Une macro d’œil et rien d’autre"),
                ("d", "Aerial landscapes without people", "Des paysages aériens sans personnes"),
            ],
            correct=["a"],
            expl_en="Environment supports the story — workplace, home, street — not just a headshot crop.",
            expl_fr="L’environnement porte l’histoire — travail, maison, rue — pas seulement un crop tête.",
        ),
        Q(
            "pl-20",
            typ="single",
            difficulty="medium",
            en="Myth: “More lights always make a better portrait.” Better framing?",
            fr="Mythe : « Plus de lumières = forcément un meilleur portrait. » Meilleure nuance ?",
            answers=[
                (
                    "a",
                    "One well-placed key (plus optional fill) beats cluttered conflicting sources",
                    "Une clé bien placée (plus fill optionnel) bat des sources multiples qui se battent",
                ),
                ("b", "You must use at least five strobes for every headshot", "Il faut au moins cinq flashs pour chaque portrait"),
                ("c", "Natural light is illegal in studios", "La lumière naturelle est illégale en studio"),
                ("d", "Portrait light only exists inside Lightroom masks", "La lumière portrait n’existe que dans les masques Lightroom"),
            ],
            correct=["a"],
            expl_en="Intentional simple light reads; extra lights need a job or they muddy the face.",
            expl_fr="Une lumière simple et intentionnelle se lit ; chaque lumière en plus doit avoir un rôle.",
        ),
    ],
}


def download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as resp:
        dest.write_bytes(resp.read())


def to_avif(src: Path, dest: Path) -> None:
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(src),
        "-c:v",
        "libaom-av1",
        "-still-picture",
        "1",
        "-crf",
        "35",
        "-cpu-used",
        "6",
        str(dest),
    ]
    subprocess.run(cmd, check=True, capture_output=True)


def write_sources(data: dict) -> None:
    counts: dict[str, int] = {}
    for quiz in data["quizzes"]:
        for q in quiz["questions"]:
            u = q.get("imageUrl") or ""
            if u.startswith("/images/packs/"):
                fname = u.rsplit("/", 1)[-1]
                counts[fname] = counts.get(fname, 0) + 1
    rows = sorted(counts.items())
    on_disk = {p.name for p in OUT_DIR.glob("*.avif")}
    for fname in sorted(on_disk - set(counts)):
        rows.append((fname, 0))

    lines = [
        "# Unsplash mirrored quiz assets",
        "",
        "Local AVIF mirrors of Unsplash photos used by illustrated quiz questions.",
        "Purpose: same-origin `/images/` so the service worker can cache-first serve",
        "photo-reading offline (cross-origin Unsplash URLs are skipped by the SW).",
        "",
        "## License",
        "",
        "All files below are mirrored from [Unsplash](https://unsplash.com) and remain",
        "under the [Unsplash License](https://unsplash.com/license): free to use,",
        "including commercially; no permission required; attribution appreciated but",
        "not mandatory. Do **not** sell unaltered copies of the photos themselves as",
        "stock. Re-check Unsplash if redistributing outside this app.",
        "",
        "Original download params: `auto=format&fit=crop&w=960&q=80`, then AVIF encode",
        "(`libaom-av1`, CRF 35) to match `public-domain/` asset style.",
        "",
        "Dead-URL replacements (see `URL_REPLACEMENTS` in `scripts/mirror-unsplash-images.py`):",
        "`photo-1432405972618-c60b0225d3f8` → `photo-1518182170546-07661fd94144`.",
        "",
        "| File | Source photo id | Occurrences in questions.json |",
        "|---|---|---|",
    ]
    for fname, count in rows:
        pid = fname.removesuffix(".avif")
        lines.append(
            f"| `{fname}` | [`{pid}`](https://images.unsplash.com/{pid}) | {count} |"
        )
    lines.append("")
    lines.append("Refresh: `python3 scripts/mirror-unsplash-images.py`")
    lines.append("P5 enrich: `python3 scripts/p5-enrich-pack-images.py`")
    lines.append("P3 enrich: `python3 scripts/p3-content-enrichment.py`")
    lines.append("")
    SOURCES.write_text("\n".join(lines), encoding="utf-8")


def update_sw_image_urls() -> None:
    text = SW.read_text(encoding="utf-8")
    packs = sorted(p.name for p in OUT_DIR.glob("*.avif"))
    public = sorted(p.name for p in PUBLIC_DIR.glob("*.avif"))
    urls = [f"  '/images/public-domain/{n}'," for n in public] + [
        f"  '/images/packs/{n}'," for n in packs
    ]
    block = "const IMAGE_URLS = [\n" + "\n".join(urls) + "\n];"
    new_text, n = re.subn(
        r"const IMAGE_URLS = \[[\s\S]*?\];", block, text, count=1
    )
    if n != 1:
        raise SystemExit("Failed to rewrite IMAGE_URLS in sw.js")
    # Bump image cache so clients fetch new pack assets.
    if "quiz-pixfan-images-v3" in new_text:
        new_text = new_text.replace(
            "const IMAGE_CACHE_NAME = 'quiz-pixfan-images-v3';",
            "const IMAGE_CACHE_NAME = 'quiz-pixfan-images-v4';",
        )
    if "quiz-pixfan-v9" in new_text:
        new_text = new_text.replace(
            "const CACHE_NAME = 'quiz-pixfan-v9';",
            "const CACHE_NAME = 'quiz-pixfan-v10';",
        )
    SW.write_text(new_text, encoding="utf-8")


def apply_images(data: dict) -> tuple[int, int]:
    applied = 0
    skipped = 0
    for quiz in data["quizzes"]:
        pack = ASSIGNMENTS.get(quiz["id"])
        if not pack:
            continue
        for q in quiz["questions"]:
            m = pack.get(q["id"])
            if not m or q.get("imageUrl"):
                continue
            pid = m["photo_id"]
            if not (OUT_DIR / f"{pid}.avif").exists():
                skipped += 1
                print(f"SKIP {quiz['id']}/{q['id']}: missing {pid}.avif")
                continue
            q["imageUrl"] = f"/images/packs/{pid}.avif"
            q["imageAlt"] = dict(m["imageAlt"])
            q["imageCredit"] = dict(CREDIT)
            applied += 1
    return applied, skipped


def rebalance_history(data: dict) -> None:
    quiz = next(q for q in data["quizzes"] if q["id"] == "history-icons")
    quiz["difficulty"] = "medium"
    by_id = {q["id"]: q for q in quiz["questions"]}
    for qid in HIST_HARD_TO_MEDIUM:
        by_id[qid]["difficulty"] = "medium"
    for qid in HIST_MEDIUM_TO_EASY:
        by_id[qid]["difficulty"] = "easy"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    data = json.loads(DATA.read_text(encoding="utf-8"))
    quizzes = {q["id"]: q for q in data["quizzes"]}

    if "portrait-light" not in quizzes:
        data["quizzes"].append(PORTRAIT_LIGHT_QUIZ)
        quizzes["portrait-light"] = PORTRAIT_LIGHT_QUIZ
        print("added portrait-light quiz")
    else:
        print("portrait-light already present — keeping existing questions")

    rebalance_history(data)

    needed: set[str] = set()
    for pack in ASSIGNMENTS.values():
        for m in pack.values():
            needed.add(m["photo_id"])

    existing = {p.stem for p in OUT_DIR.glob("*.avif")}
    to_fetch = sorted(needed - existing)
    print(
        f"unique_needed={len(needed)} already_local={len(needed & existing)} "
        f"to_download={len(to_fetch)}"
    )

    tmp = ROOT / ".tmp-p3-images"
    tmp.mkdir(exist_ok=True)
    failed: list[str] = []
    downloaded = 0

    for i, pid in enumerate(to_fetch, 1):
        avif_path = OUT_DIR / f"{pid}.avif"
        jpg = tmp / f"{pid}.jpg"
        try:
            print(f"[{i}/{len(to_fetch)}] GET {pid} …", flush=True)
            download(U.format(id=pid), jpg)
            to_avif(jpg, avif_path)
            downloaded += 1
            print(f"         → {pid}.avif ({avif_path.stat().st_size // 1024} KiB)")
        except Exception as exc:  # noqa: BLE001
            failed.append(pid)
            print(f"         FAIL {pid}: {exc}")
            if avif_path.exists():
                avif_path.unlink()
        finally:
            if jpg.exists():
                jpg.unlink()

    applied, skipped = apply_images(data)

    DATA.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    write_sources(data)
    update_sw_image_urls()

    try:
        for p in tmp.iterdir():
            p.unlink()
        tmp.rmdir()
    except OSError:
        pass

    print("\nPack illustrated counts (targets):")
    for quiz in data["quizzes"]:
        if quiz["id"] in ASSIGNMENTS or quiz["id"] in {
            "exposure-basics",
            "genres",
            "history-icons",
            "photo-rights",
            "portrait-light",
        }:
            n = sum(1 for q in quiz["questions"] if q.get("imageUrl"))
            print(f"  {quiz['id']}: {n}/{len(quiz['questions'])}")

    hist = next(q for q in data["quizzes"] if q["id"] == "history-icons")
    from collections import Counter

    diffs = Counter(q.get("difficulty") for q in hist["questions"])
    print(f"\nhistory-icons difficulty: {dict(diffs)} quiz-level={hist['difficulty']}")
    print(
        f"\ndownloaded_new={downloaded} assigned={applied} "
        f"skipped={skipped} failed={failed}"
    )
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

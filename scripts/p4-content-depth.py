#!/usr/bin/env python3
"""Vague 1.17 P4.A–B: densify under-illustrated packs + lengthen short Pixfan packs.

- Illustration pass: retouching / composition / smartphone → ≥55–60% illustrated
- Extend lightroom-workflow + portrait-light: 20 → 26 questions
- Prefer existing local Unsplash AVIF mirrors; download only if missing
- Refresh SOURCES.md + sw.js IMAGE_URLS / image cache bump
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


# Prefer photo ids already mirrored under public/images/packs/.
ASSIGNMENTS: dict[str, dict[str, dict]] = {
    "retouching": {
        "edit-5": meta(
            "photo-1470071459604-3b5ec3a7fe05",
            "Misty forest texture — clarity / structure slider territory",
            "Texture de forêt brumeuse — terrain clarté / structure",
        ),
        "edit-7": meta(
            "photo-1500530855697-b586d89ba3ee",
            "Moody colored landscape — extreme HSL shift risk",
            "Paysage aux couleurs d’ambiance — risque de shifts HSL extrêmes",
        ),
        "edit-12": meta(
            "photo-1460925895917-afdab827c52f",
            "Laptop dashboard — first checks when opening a file to edit",
            "Tableau de bord — premiers contrôles à l’ouverture d’un fichier",
        ),
        "edit-14": meta(
            "photo-1506905925346-21bda4d32df4",
            "Mountain vista — classic vignette framing metaphor",
            "Vue de montagne — métaphore de vignettage classique",
        ),
        "edit-17": meta(
            "photo-1531746020798-e6953c6e8e04",
            "Close portrait skin texture — frequency separation territory",
            "Texture de peau en portrait serré — terrain séparation de fréquences",
        ),
        "edit-19": meta(
            "photo-1499750310107-5fef28a66643",
            "Laptop and coffee — soft-proof before print / client delivery",
            "Portable et café — soft proof avant print / livraison",
        ),
        "edit-23": meta(
            "photo-1454165804606-c3d57bc86b40",
            "Checklist documents — last checks before client send",
            "Documents checklist — dernières vérifs avant envoi client",
        ),
    },
    "composition": {
        "comp-7": meta(
            "photo-1449824913935-59a10b8d2000",
            "Symmetric urban square — symmetry’s calm pull",
            "Place urbaine symétrique — l’attrait calme de la symétrie",
        ),
        "comp-11": meta(
            "photo-1464822759023-fed622ff2c3b",
            "Mountain ridges as diagonal energy lines",
            "Crêtes de montagne comme lignes diagonales énergiques",
        ),
        "comp-13": meta(
            "photo-1500534314209-a25ddb2bd429",
            "Landscape ready for a thoughtful crop decision",
            "Paysage prêt pour une décision de recadrage réfléchie",
        ),
        "comp-15": meta(
            "photo-1534528741775-53994a69daeb",
            "Portrait with looking room / nose room ahead of the gaze",
            "Portrait avec espace de regard / nose room devant le regard",
        ),
        "comp-16": meta(
            "photo-1493246507139-91e8fad9978e",
            "Strong color contrast between land and sky",
            "Fort contraste de couleur entre terre et ciel",
        ),
        "comp-18": meta(
            "photo-1470252649378-9c29740c9fa8",
            "High-angle overlook compressing a landscape scene",
            "Vue plongeante compressant une scène de paysage",
        ),
        "comp-23": meta(
            "photo-1519741497674-611481863552",
            "Intentional street framing that elevates a snapshot",
            "Cadrage de rue intentionnel qui élève un instantané",
        ),
        "comp-25": meta(
            "photo-1501785888041-af3ef285b470",
            "Centered mountain subject — when centering works",
            "Sujet montagneux centré — quand le centrage fonctionne",
        ),
    },
    "smartphone": {
        "phone-8": meta(
            "photo-1511707171634-5f897ff02aa9",
            "Phone camera UI — RAW / Pro mode territory",
            "Interface caméra téléphone — terrain mode RAW / Pro",
        ),
        "phone-10": meta(
            "photo-1512499617640-c74ae3a79d37",
            "Ultra-wide phone perspective stretching a scene",
            "Perspective ultra grand-angle téléphone étirant une scène",
        ),
        "phone-13": meta(
            "photo-1512941937669-90a1b58e7e9c",
            "Phone held for a careful grid-aligned frame",
            "Téléphone tenu pour un cadrage soigné sur la grille",
        ),
        "phone-15": meta(
            "photo-1504674900247-0877df9cc836",
            "Close food detail — phone macro territory",
            "Détail food serré — terrain macro téléphone",
        ),
        "phone-19": meta(
            "photo-1419242902214-272b3f66ee7a",
            "Shooting toward bright light — phone sun / flare control",
            "Prise de vue face à une lumière vive — contrôle soleil / flare",
        ),
        "phone-22": meta(
            "photo-1556656793-08538906a9f8",
            "Tall phone screen — Stories / Reels 9:16 framing",
            "Écran téléphone vertical — cadrage Stories / Reels 9:16",
        ),
        "phone-23": meta(
            "photo-1514565131-fce0801e5785",
            "Night city lights — phone night-mode stability",
            "Lumières de ville la nuit — stabilité du mode nuit",
        ),
        "phone-25": meta(
            "photo-1544005313-94ddf0286df2",
            "Portrait with soft background — computational blur nuance",
            "Portrait au fond doux — nuance du flou computationnel",
        ),
    },
    "lightroom-workflow": {
        "lr-04": meta(
            "photo-1555949963-aa79dcee981c",
            "Colorful UI panels — virtual copies for alternate looks",
            "Panneaux UI colorés — copies virtuelles pour looks alternatifs",
        ),
        "lr-06": meta(
            "photo-1558655146-d09347e92766",
            "Design swatches — Screen vs Print export sharpening",
            "Nuanciers — netteté d’export Screen vs Print",
        ),
        "lr-11": meta(
            "photo-1526170375885-4d8ecf77b99f",
            "Prime lens — Lens Corrections / profile fixes",
            "Objectif fixe — corrections d’objectif / profils",
        ),
        "lr-13": meta(
            "photo-1500530855697-b586d89ba3ee",
            "Moody tones — Tone Curve vs Basic panel judgment",
            "Tons d’ambiance — jugement Courbe vs panneau Basic",
        ),
        "lr-21": meta(
            "photo-1486312338219-ce68d2c6f44d",
            "Hands on a laptop — catalog backup discipline",
            "Mains sur un portable — discipline de sauvegarde catalogue",
        ),
        "lr-24": meta(
            "photo-1498050108023-c5249f4df085",
            "Laptop coding desk — batch sync QA before delivery",
            "Bureau portable — QA après sync batch avant livraison",
        ),
    },
    "portrait-light": {
        "pl-04": meta(
            "photo-1507003211169-0a1dd7228f2d",
            "Male portrait with gentle fill lifting the shadow side",
            "Portrait masculin avec fill doux remontant le côté ombre",
        ),
        "pl-06": meta(
            "photo-1487412720507-e7ab37603c6f",
            "Beauty light high on axis — butterfly / Paramount vibe",
            "Lumière beauté haute sur l’axe — vibe papillon / Paramount",
        ),
        "pl-08": meta(
            "photo-1438761681033-6461ffad8d80",
            "Soft window-light portrait facing the window",
            "Portrait douce lumière de fenêtre face à la fenêtre",
        ),
        "pl-12": meta(
            "photo-1552374196-c4e7ffc6e126",
            "Dramatic split light carving half the face",
            "Lumière split dramatique sculptant une moitié du visage",
        ),
        "pl-21": meta(
            "photo-1517841905240-472988babdf9",
            "Golden-hour rim light wrapping a portrait subject",
            "Rim light golden hour enveloppant un sujet portrait",
        ),
        "pl-25": meta(
            "photo-1524504388940-b1c1722653e1",
            "Environmental window-light portrait for mixed-color habits",
            "Portrait environnemental fenêtre — habitudes lumière mixte",
        ),
    },
}


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


NEW_LIGHTROOM = [
    Q(
        "lr-21",
        typ="single",
        difficulty="medium",
        en="Healthy Lightroom Classic catalog hygiene usually includes…",
        fr="Une hygiène saine de catalogue Lightroom Classic inclut surtout…",
        answers=[
            (
                "a",
                "Regular catalog backups + knowing where the .lrcat lives",
                "Sauvegardes régulières du catalogue + savoir où vit le .lrcat",
            ),
            (
                "b",
                "Deleting the catalog after every export “to stay light”",
                "Supprimer le catalogue après chaque export « pour rester léger »",
            ),
            (
                "c",
                "Storing the only catalog copy on a USB stick you lose weekly",
                "Garder l’unique copie sur une clé USB perdue chaque semaine",
            ),
            (
                "d",
                "Never backing up because Smart Previews are a full archive",
                "Ne jamais sauvegarder car les Smart Previews sont une archive complète",
            ),
        ],
        correct=["a"],
        expl_en="Edits live in the catalog; backups are non-negotiable Pixfan hygiene.",
        expl_fr="Les edits vivent dans le catalogue ; les sauvegardes sont non négociables façon Pixfan.",
    ),
    Q(
        "lr-22",
        typ="single",
        difficulty="medium",
        en="Before a big Develop sync across similar frames, a smart Pixfan habit is…",
        fr="Avant une grosse sync Développement sur des vues similaires, une bonne habitude Pixfan est…",
        answers=[
            (
                "a",
                "Spot-check one hero, sync deliberately, then QA outliers (faces, dust, crops)",
                "Valider un hero, syncer exprès, puis QA les outliers (visages, poussière, crops)",
            ),
            (
                "b",
                "Sync everything blindly including healing spots from other faces",
                "Tout syncer à l’aveugle y compris les healing d’autres visages",
            ),
            (
                "c",
                "Disable previews so mistakes stay invisible longer",
                "Désactiver les previews pour cacher les erreurs plus longtemps",
            ),
            (
                "d",
                "Convert the whole shoot to JPEG before syncing",
                "Convertir tout le shooting en JPEG avant de syncer",
            ),
        ],
        correct=["a"],
        expl_en="Sync is a multiplier — good looks and bad mistakes both scale.",
        expl_fr="La sync multiplie — les beaux looks et les mauvaises erreurs aussi.",
    ),
    Q(
        "lr-23",
        typ="single",
        difficulty="hard",
        en="You need a B&W version without losing the color master. Clean approach?",
        fr="Tu veux une version N&B sans perdre le master couleur. Approche propre ?",
        answers=[
            (
                "a",
                "Virtual copy (or snapshot) for B&W; keep the color master intact",
                "Copie virtuelle (ou snapshot) pour le N&B ; garder le master couleur intact",
            ),
            (
                "b",
                "Export JPEG, reopen, desaturate, overwrite the RAW",
                "Exporter JPEG, rouvrir, désaturer, écraser le RAW",
            ),
            (
                "c",
                "Delete all color edits so only B&W remains forever",
                "Supprimer tous les edits couleur pour ne garder que le N&B",
            ),
            (
                "d",
                "Change the camera profile to monochrome in-camera only",
                "Changer seulement le profil monochrome dans l’appareil",
            ),
        ],
        correct=["a"],
        expl_en="Virtual copies keep non-destructive forks of the same master file.",
        expl_fr="Les copies virtuelles gardent des forks non destructifs du même master.",
    ),
    Q(
        "lr-24",
        typ="single",
        difficulty="medium",
        en="Client delivery from Lightroom — which export habit is most Pixfan-solid?",
        fr="Livraison client depuis Lightroom — quelle habitude d’export est la plus solide façon Pixfan ?",
        answers=[
            (
                "a",
                "Named presets per destination (web sRGB / print) + quick visual QA of exports",
                "Préréglages nommés par destination (web sRGB / print) + QA visuelle rapide des exports",
            ),
            (
                "b",
                "Always export ProPhoto JPEG at 300% size “for safety”",
                "Toujours exporter du JPEG ProPhoto à 300 % « par sécurité »",
            ),
            (
                "c",
                "Email the catalog file instead of rendered images",
                "Envoyer le fichier catalogue au lieu des images rendues",
            ),
            (
                "d",
                "Skip sharpening and color profile on every web export",
                "Sauter netteté et profil couleur sur chaque export web",
            ),
        ],
        correct=["a"],
        expl_en="Repeatable export presets + a last look beat one-off guessing.",
        expl_fr="Des presets d’export répétables + un dernier coup d’œil battent l’improvisation.",
    ),
    Q(
        "lr-25",
        typ="single",
        difficulty="hard",
        en="A luminance range mask is especially useful when you want to…",
        fr="Un masque de gamme luminance est surtout utile quand tu veux…",
        answers=[
            (
                "a",
                "Limit a local adjustment to bright or dark tonal regions",
                "Limiter un réglage local aux zones tonales claires ou sombres",
            ),
            (
                "b",
                "Replace the need for any white-balance control",
                "Remplacer tout contrôle de balance des blancs",
            ),
            (
                "c",
                "Automatically write IPTC copyright into every export",
                "Écrire automatiquement le copyright IPTC dans chaque export",
            ),
            (
                "d",
                "Force every sky to neon purple regardless of selection",
                "Forcer chaque ciel en violet néon sans sélection",
            ),
        ],
        correct=["a"],
        expl_en="Range masks refine where a local edit lands by tone or color.",
        expl_fr="Les masques de gamme précisent où un edit local s’applique (ton / couleur).",
    ),
    Q(
        "lr-26",
        typ="single",
        difficulty="hard",
        en="Myth: “More Clarity always makes a photo look more professional.” Better framing?",
        fr="Mythe : « Plus de Clarté = forcément plus pro. » Meilleure nuance ?",
        answers=[
            (
                "a",
                "Clarity is a midtone contrast tool — easy to crunch skin and haze for no gain",
                "La Clarté est un contraste de tons moyens — facile d’écraser peau et brume sans gain",
            ),
            (
                "b",
                "Clarity only affects the blue channel in print",
                "La Clarté n’affecte que le canal bleu à l’impression",
            ),
            (
                "c",
                "You must max Clarity on every landscape forever",
                "Il faut maxer la Clarté sur chaque paysage pour toujours",
            ),
            (
                "d",
                "Clarity replaces Lens Corrections completely",
                "La Clarté remplace totalement les Corrections d’objectif",
            ),
        ],
        correct=["a"],
        expl_en="Use Clarity with intent; faces and soft atmospheres often want restraint.",
        expl_fr="Utilise la Clarté avec intention ; visages et atmosphères douces veulent souvent de la retenue.",
    ),
]

NEW_PORTRAIT = [
    Q(
        "pl-21",
        typ="single",
        difficulty="medium",
        en="A hair / rim light behind the subject is mainly there to…",
        fr="Un hair / rim light derrière le sujet sert surtout à…",
        answers=[
            (
                "a",
                "Separate hair/shoulders from a dark background and add polish",
                "Détacher cheveux/épaules d’un fond sombre et ajouter du polish",
            ),
            (
                "b",
                "Replace the key light entirely",
                "Remplacer entièrement la lumière clé",
            ),
            (
                "c",
                "Force every portrait into flat beauty light",
                "Forcer chaque portrait en lumière beauté plate",
            ),
            (
                "d",
                "Only change white balance in the shadows",
                "Changer seulement la balance des blancs dans les ombres",
            ),
        ],
        correct=["a"],
        expl_en="Rim/hair lights carve separation; they rarely replace a proper key.",
        expl_fr="Rim/hair sculptent la séparation ; ils remplacent rarement une vraie clé.",
    ),
    Q(
        "pl-22",
        typ="single",
        difficulty="medium",
        en="Clamshell beauty lighting typically pairs…",
        fr="La lumière beauté « clamshell » associe typiquement…",
        answers=[
            (
                "a",
                "A soft key above + a weaker fill/reflector below the chin line",
                "Une clé douce au-dessus + un fill/réflecteur plus faible sous le menton",
            ),
            (
                "b",
                "Two hard rim lights with zero front light",
                "Deux rim durs sans aucune lumière frontale",
            ),
            (
                "c",
                "Only a bare speedlight on-camera pointed at the ceiling forever",
                "Seulement un speedlight nu sur l’appareil pointé plafond pour toujours",
            ),
            (
                "d",
                "A single red gel behind the subject as the only source",
                "Un seul gélatiné rouge derrière le sujet comme unique source",
            ),
        ],
        correct=["a"],
        expl_en="Clamshell wraps soft light for beauty/clean commercial faces.",
        expl_fr="Le clamshell enveloppe une lumière douce pour visages beauté / commercial clean.",
    ),
    Q(
        "pl-23",
        typ="single",
        difficulty="hard",
        en="Subject has deep-set eyes under a hat brim. First light fix?",
        fr="Sujet aux yeux enfoncés sous un bord de chapeau. Premier correctif lumière ?",
        answers=[
            (
                "a",
                "Raise fill / bounce / lower the key angle so eyes catch light",
                "Monter le fill / bounce / baisser l’angle de clé pour éclairer les yeux",
            ),
            (
                "b",
                "Only crush blacks harder so eye sockets disappear",
                "Seulement écraser encore plus les noirs pour faire disparaître les orbites",
            ),
            (
                "c",
                "Always shoot at f/22 facing noon sun",
                "Toujours shooter à f/22 face au soleil de midi",
            ),
            (
                "d",
                "Disable autofocus and hope for catchlights",
                "Désactiver l’AF et espérer des catchlights",
            ),
        ],
        correct=["a"],
        expl_en="Portrait craft prioritizes readable eyes — lift the sockets before styling drama.",
        expl_fr="Le craft portrait priorise des yeux lisibles — remonte les orbites avant le drama stylé.",
    ),
    Q(
        "pl-24",
        typ="single",
        difficulty="medium",
        en="Short lighting (vs broad) generally means…",
        fr="Le short lighting (vs broad) signifie généralement…",
        answers=[
            (
                "a",
                "Key lights the side of the face turned away from camera — often slimming",
                "La clé éclaire le côté du visage tourné loin de la caméra — souvent amincissant",
            ),
            (
                "b",
                "Key lights only the background seamless",
                "La clé n’éclaire que le fond cyclorama",
            ),
            (
                "c",
                "No key light is used at all",
                "Aucune lumière clé n’est utilisée",
            ),
            (
                "d",
                "The lens is always wider than 24 mm",
                "L’objectif est toujours plus grand-angle que 24 mm",
            ),
        ],
        correct=["a"],
        expl_en="Short lighting emphasizes the shadow side toward camera — a classic flattering pattern.",
        expl_fr="Le short lighting met l’ombre vers la caméra — un schéma classique flatteur.",
    ),
    Q(
        "pl-25",
        typ="single",
        difficulty="hard",
        en="Mixed window + tungsten practicals muddy skin. Best on-set habit?",
        fr="Fenêtre + practicals tungstène mélangés salissent la peau. Meilleure habitude plateau ?",
        answers=[
            (
                "a",
                "Commit to one dominant color temp (gel/practicals) or separate the sources",
                "Choisir une température dominante (gélatine/practicals) ou séparer les sources",
            ),
            (
                "b",
                "Always auto white-balance every frame and ignore the room lights",
                "Toujours en balance auto et ignorer les lumières de la pièce",
            ),
            (
                "c",
                "Push Clarity to +100 to “fix” color casts",
                "Monter la Clarté à +100 pour « réparer » les dominantes",
            ),
            (
                "d",
                "Convert to neon green so casts become a style forever",
                "Passer en vert néon pour transformer les dominantes en style",
            ),
        ],
        correct=["a"],
        expl_en="Mixed CCT fights skin; decide a dominant and support it.",
        expl_fr="Les CCT mélangés se battent sur la peau ; choisis une dominante et tiens-la.",
    ),
    Q(
        "pl-26",
        typ="single",
        difficulty="medium",
        en="Myth: “Softboxes always remove all shadows.” Better framing?",
        fr="Mythe : « Les softbox enlèvent toutes les ombres. » Meilleure nuance ?",
        answers=[
            (
                "a",
                "Soft light still has direction — size/distance change softness, not physics",
                "Une lumière douce a encore une direction — taille/distance changent la douceur, pas la physique",
            ),
            (
                "b",
                "Softboxes erase the need for any fill forever",
                "Les softbox éliminent tout besoin de fill pour toujours",
            ),
            (
                "c",
                "Softboxes only work outdoors at noon",
                "Les softbox ne marchent qu’en extérieur à midi",
            ),
            (
                "d",
                "Softboxes force every catchlight to disappear",
                "Les softbox forcent chaque catchlight à disparaître",
            ),
        ],
        correct=["a"],
        expl_en="Modifiers soften edges; they don’t delete directional shaping.",
        expl_fr="Les modificateurs adoucissent les bords ; ils n’effacent pas le modelé directionnel.",
    ),
]


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
    lines.append("P4 enrich: `python3 scripts/p4-content-depth.py`")
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
    if "quiz-pixfan-images-v4" in new_text:
        new_text = new_text.replace(
            "const IMAGE_CACHE_NAME = 'quiz-pixfan-images-v4';",
            "const IMAGE_CACHE_NAME = 'quiz-pixfan-images-v5';",
        )
    if "quiz-pixfan-v10" in new_text:
        new_text = new_text.replace(
            "const CACHE_NAME = 'quiz-pixfan-v10';",
            "const CACHE_NAME = 'quiz-pixfan-v11';",
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


def extend_pack(quiz: dict, new_qs: list[dict]) -> int:
    existing = {q["id"] for q in quiz["questions"]}
    added = 0
    for q in new_qs:
        if q["id"] in existing:
            continue
        quiz["questions"].append(q)
        added += 1
    return added


def shuffle_correct_not_first(answers: list[dict], correct: list[str]) -> list[dict]:
    """Light authoring bias fix: if single correct is first, rotate once."""
    if len(correct) != 1 or not answers:
        return answers
    if answers[0]["id"] != correct[0]:
        return answers
    return answers[1:] + answers[:1]


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    data = json.loads(DATA.read_text(encoding="utf-8"))
    quizzes = {q["id"]: q for q in data["quizzes"]}

    lr_added = extend_pack(quizzes["lightroom-workflow"], NEW_LIGHTROOM)
    pl_added = extend_pack(quizzes["portrait-light"], NEW_PORTRAIT)
    print(f"added lightroom questions={lr_added} portrait questions={pl_added}")

    # Mild correct-answer slot shuffle on newly appended singles.
    for quiz_id, new_qs in (
        ("lightroom-workflow", NEW_LIGHTROOM),
        ("portrait-light", NEW_PORTRAIT),
    ):
        by_id = {q["id"]: q for q in quizzes[quiz_id]["questions"]}
        for template in new_qs:
            q = by_id[template["id"]]
            q["answers"] = shuffle_correct_not_first(q["answers"], q["correctAnswers"])

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

    tmp = ROOT / ".tmp-p4-images"
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

    total_q = 0
    total_ill = 0
    print("\nPack illustrated counts:")
    for quiz in data["quizzes"]:
        n = len(quiz["questions"])
        ill = sum(1 for q in quiz["questions"] if q.get("imageUrl"))
        total_q += n
        total_ill += ill
        flag = ""
        if quiz["id"] in ASSIGNMENTS:
            pct = 100 * ill / n if n else 0
            flag = f"  ({pct:.0f}%)"
        print(f"  {quiz['id']}: {ill}/{n}{flag}")

    print(
        f"\nTOTAL quizzes={len(data['quizzes'])} Q={total_q} ill={total_ill} "
        f"({100 * total_ill / total_q:.1f}%)"
    )
    print(
        f"downloaded_new={downloaded} assigned={applied} "
        f"skipped={skipped} failed={failed}"
    )
    if failed:
        raise SystemExit(1)

    # Soft acceptance gates for P4.A/B
    targets = {
        "retouching": 0.55,
        "composition": 0.55,
        "smartphone": 0.55,
    }
    for qid, min_pct in targets.items():
        quiz = quizzes[qid]
        ill = sum(1 for q in quiz["questions"] if q.get("imageUrl"))
        pct = ill / len(quiz["questions"])
        if pct < min_pct:
            raise SystemExit(f"{qid} illustrated {pct:.0%} < {min_pct:.0%}")
    for qid in ("lightroom-workflow", "portrait-light"):
        if len(quizzes[qid]["questions"]) < 25:
            raise SystemExit(f"{qid} still short: {len(quizzes[qid]['questions'])}")


if __name__ == "__main__":
    main()

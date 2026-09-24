#!/usr/bin/env python3
"""Add marques-photo pack + mirror a few new Unsplash camera AVIFs."""

from __future__ import annotations

import json
import re
import subprocess
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public/data/questions.json"
OUT_DIR = ROOT / "public/images/packs"
SOURCES = OUT_DIR / "SOURCES.md"
SW = ROOT / "public/sw.js"
USER_AGENT = "QuizPixFanMirror/1.0 (+https://github.com/pixfan-stack/quiz-pixfan)"

CREDIT = {
    "en": "Unsplash — free to use (Unsplash License)",
    "fr": "Unsplash — libre d'utilisation (licence Unsplash)",
}

# Existing local AVIFs (camera / gear atmosphere) — reuse heavily.
IMG = {
    "classic": "/images/packs/photo-1516035069371-29a1b244cc32.avif",
    "vintage": "/images/packs/photo-1554048612-b6a482bc67e5.avif",
    "dslr": "/images/packs/photo-1502920917128-1aa500764cbd.avif",
    "camera2": "/images/packs/photo-1526170375885-4d8ecf77b99f.avif",
    "camera3": "/images/packs/photo-1542038784456-1ea8e935640e.avif",
    "camera4": "/images/packs/photo-1606983340126-99ab4feaa64a.avif",
    "lens": "/images/packs/photo-1492691527719-9d1e07e534b4.avif",
    "street": "/images/packs/photo-1449824913935-59a10b8d2000.avif",
    "film": "/images/packs/photo-1452421822248-d4c2b47f0c81.avif",
    "city": "/images/packs/photo-1514565131-fce0801e5785.avif",
    "desk": "/images/packs/photo-1452587925148-ce544e77e70d.avif",
    "phone": "/images/packs/photo-1511707171634-5f897ff02aa9.avif",
}

# New Unsplash photos to mirror (camera / gear).
NEW_PHOTOS = [
    ("photo-1495706083145-c4acd5d92955", "Black camera on a wooden surface", "Appareil noir sur surface en bois"),
    ("photo-1510127034890-ba27508e9f1c", "Photographer holding a camera outdoors", "Photographe tenant un appareil en extérieur"),
    ("photo-1452780216940-4d5ee110b6f1", "Vintage film camera close-up", "Gros plan d'appareil argentique vintage"),
    ("photo-1606983340282-1f0c7f0e0a0a", None, None),  # may 404 — skip if fails
]

# Safer known Unsplash camera IDs (verified used elsewhere or common):
NEW_PHOTOS = [
    ("photo-1495706083145-c4acd5d92955", "Black camera on wood", "Appareil noir sur bois"),
    ("photo-1452780216940-4d5ee110b6f1", "Vintage film camera", "Appareil argentique vintage"),
    ("photo-1471341971476-ae15ff5dd4ea", "Studio lighting and camera gear", "Éclairage studio et matériel photo"),
    ("photo-1617005082133-548ac5d3f345", "Modern mirrorless-style camera body", "Boîtier style hybride moderne"),
]


def download_avif(photo_id: str) -> str | None:
    dest = OUT_DIR / f"{photo_id}.avif"
    if dest.exists() and dest.stat().st_size > 1000:
        return f"/images/packs/{photo_id}.avif"
    url = f"https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=960&q=80"
    tmp = OUT_DIR / f"{photo_id}.tmp.jpg"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=60) as resp:
            tmp.write_bytes(resp.read())
        subprocess.run(
            [
                "ffmpeg", "-y", "-i", str(tmp),
                "-c:v", "libaom-av1", "-still-picture", "1",
                "-crf", "35", "-cpu-used", "6", str(dest),
            ],
            check=True,
            capture_output=True,
        )
        tmp.unlink(missing_ok=True)
        print(f"mirrored {photo_id}")
        return f"/images/packs/{photo_id}.avif"
    except Exception as e:
        print(f"skip {photo_id}: {e}")
        tmp.unlink(missing_ok=True)
        dest.unlink(missing_ok=True)
        return None


def q(
    id_: str,
    *,
    text_en: str,
    text_fr: str,
    answers: list[tuple[str, str, str]],
    correct: list[str],
    expl_en: str,
    expl_fr: str,
    difficulty: str,
    qtype: str = "single",
    image: str | None = None,
    alt_en: str = "Camera gear",
    alt_fr: str = "Matériel photo",
) -> dict:
    item: dict = {
        "id": id_,
        "type": qtype,
        "text": {"en": text_en, "fr": text_fr},
        "answers": [{"id": a, "text": {"en": en, "fr": fr}} for a, en, fr in answers],
        "correctAnswers": correct,
        "explanation": {"en": expl_en, "fr": expl_fr},
        "difficulty": difficulty,
    }
    if image:
        item["imageUrl"] = image
        item["imageAlt"] = {"en": alt_en, "fr": alt_fr}
        item["imageCredit"] = dict(CREDIT)
    return item


def build_quiz(extra_imgs: dict[str, str]) -> dict:
    e1 = extra_imgs.get("e1", IMG["classic"])
    e2 = extra_imgs.get("e2", IMG["vintage"])
    e3 = extra_imgs.get("e3", IMG["camera2"])
    e4 = extra_imgs.get("e4", IMG["dslr"])

    questions = [
        # Canon
        q(
            "marque-01",
            text_en="In which country was Canon founded in the 1930s?",
            text_fr="Dans quel pays Canon a-t-il été fondé dans les années 1930 ?",
            answers=[
                ("b", "Germany", "Allemagne"),
                ("a", "Japan", "Japon"),
                ("c", "United States", "États-Unis"),
                ("d", "France", "France"),
            ],
            correct=["a"],
            expl_en="Canon began in Tokyo in 1934 as Precision Optical Instruments Laboratory (later Canon).",
            expl_fr="Canon naît à Tokyo en 1934 sous le nom de Precision Optical Instruments Laboratory (devenu Canon).",
            difficulty="easy",
            image=e1,
            alt_en="Classic camera body",
            alt_fr="Boîtier photo classique",
        ),
        q(
            "marque-02",
            text_en="Canon’s first production 35mm rangefinder (mid-1930s) is commonly known as which model?",
            text_fr="Le premier télémétrique 35 mm de production Canon (milieu des années 1930) est souvent appelé quel modèle ?",
            answers=[
                ("c", "EOS-1", "EOS-1"),
                ("b", "PowerShot G1", "PowerShot G1"),
                ("a", "Hansa Canon", "Hansa Canon"),
                ("d", "IXUS 100", "IXUS 100"),
            ],
            correct=["a"],
            expl_en="After the Kwanon prototype, the Hansa Canon (1936) was the first widely sold Canon 35mm camera.",
            expl_fr="Après le prototype Kwanon, le Hansa Canon (1936) est le premier appareil Canon 35 mm largement commercialisé.",
            difficulty="hard",
            image=e2,
            alt_en="Vintage camera gear",
            alt_fr="Matériel photo vintage",
        ),
        q(
            "marque-03",
            text_en="What does Canon’s EOS system name stand for?",
            text_fr="Que signifie le nom du système Canon EOS ?",
            answers=[
                ("d", "Electronic Optical Sensor", "Electronic Optical Sensor"),
                ("a", "Electro-Optical System", "Electro-Optical System"),
                ("b", "European Order Specification", "European Order Specification"),
                ("c", "Exposure Only Setting", "Exposure Only Setting"),
            ],
            correct=["a"],
            expl_en="EOS = Electro-Optical System, launched in 1987 with autofocus EF lenses.",
            expl_fr="EOS = Electro-Optical System, lancé en 1987 avec les objectifs autofocus EF.",
            difficulty="medium",
            image=IMG["dslr"],
            alt_en="DSLR-style camera",
            alt_fr="Appareil type reflex",
        ),
        q(
            "marque-04",
            text_en="Canon’s EF lens mount (EOS era) is best known for introducing what at launch?",
            text_fr="La baïonnette Canon EF (ère EOS) est surtout connue pour avoir introduit quoi à son lancement ?",
            answers=[
                ("b", "Only screw-drive film advance", "Uniquement l’avancée pellicule à vis"),
                ("c", "Medium-format leaf shutters only", "Uniquement des obturateurs centraux moyen format"),
                ("a", "Fully electronic lens–body communication (no mechanical aperture lever)", "Communication objectif–boîtier entièrement électronique (sans levier mécanique d’ouverture)"),
                ("d", "Flash-only contacts with no focus motors", "Contacts flash uniquement, sans moteurs de mise au point"),
            ],
            correct=["a"],
            expl_en="EF dropped the mechanical aperture linkage; focusing motors live in the lens and talk to the body electronically.",
            expl_fr="EF abandonne la liaison mécanique d’ouverture ; les moteurs de MAP sont dans l’objectif et dialoguent électroniquement avec le boîtier.",
            difficulty="hard",
            image=IMG["lens"],
            alt_en="Camera lens detail",
            alt_fr="Détail d’objectif photo",
        ),
        # Nikon
        q(
            "marque-05",
            text_en="Nikon’s optical company roots go back to which year (Nippon Kogaku Kogyo)?",
            text_fr="Les racines optiques de Nikon remontent à quelle année (Nippon Kogaku Kogyo) ?",
            answers=[
                ("c", "1959", "1959"),
                ("b", "1987", "1987"),
                ("d", "2000", "2000"),
                ("a", "1917", "1917"),
            ],
            correct=["a"],
            expl_en="Nippon Kogaku Kogyo was founded in 1917; the Nikon brand name came later for cameras and lenses.",
            expl_fr="Nippon Kogaku Kogyo est fondée en 1917 ; la marque Nikon s’impose ensuite pour appareils et objectifs.",
            difficulty="medium",
            image=IMG["film"],
            alt_en="Historical documents and books",
            alt_fr="Documents et livres anciens",
        ),
        q(
            "marque-06",
            text_en="Which 1959 Nikon camera helped define the modern professional 35mm SLR system?",
            text_fr="Quel appareil Nikon de 1959 a contribué à définir le reflex 35 mm professionnel moderne ?",
            answers=[
                ("a", "Nikon F", "Nikon F"),
                ("b", "Nikon Coolpix P900", "Nikon Coolpix P900"),
                ("c", "Nikon 1 J1", "Nikon 1 J1"),
                ("d", "Nikon KeyMission 360", "Nikon KeyMission 360"),
            ],
            correct=["a"],
            expl_en="The Nikon F (1959) offered a modular professional SLR system with interchangeable finders and a durable F-mount.",
            expl_fr="Le Nikon F (1959) propose un système reflex professionnel modulaire, viseurs interchangeables et baïonnette F durable.",
            difficulty="easy",
            image=e3,
            alt_en="Camera on a surface",
            alt_fr="Appareil photo sur une surface",
        ),
        q(
            "marque-07",
            text_en="Nikon’s F-mount is notable in industry history mainly because…",
            text_fr="La baïonnette Nikon F est surtout remarquable dans l’histoire du matériel parce que…",
            answers=[
                ("d", "It only works with medium-format backs", "Elle ne fonctionne qu’avec des dos moyen format"),
                ("a", "It stayed the core SLR/DSLR mount for decades with broad backward compatibility", "Elle est restée la baïonnette reflex/DSLR centrale pendant des décennies, avec une large rétrocompatibilité"),
                ("b", "It was abandoned after one year", "Elle a été abandonnée après un an"),
                ("c", "It was exclusive to point-and-shoot film cameras", "Elle était réservée aux compacts argentiques"),
            ],
            correct=["a"],
            expl_en="Introduced with the Nikon F, the F-mount spanned film SLRs and DSLRs for generations (with caveats on newer AF types).",
            expl_fr="Lancée avec le Nikon F, la baïonnette F a traversé des générations de reflex argentiques puis numériques (avec nuances selon les AF).",
            difficulty="medium",
            image=IMG["camera3"],
            alt_en="Camera body close-up",
            alt_fr="Gros plan de boîtier",
        ),
        q(
            "marque-08",
            text_en="Before “Nikon”, many early lenses from the company were branded…",
            text_fr="Avant « Nikon », de nombreux objectifs anciens de la société étaient marqués…",
            answers=[
                ("b", "Rollei", "Rollei"),
                ("c", "Hasselblad only", "Hasselblad uniquement"),
                ("a", "Nikkor", "Nikkor"),
                ("d", "Contax G", "Contax G"),
            ],
            correct=["a"],
            expl_en="Nikkor was (and remains) the lens brand; “Nikon” became the camera brand name widely used after WWII.",
            expl_fr="Nikkor était (et reste) la marque d’objectifs ; « Nikon » s’impose comme nom d’appareils après la Seconde Guerre mondiale.",
            difficulty="medium",
            image=IMG["lens"],
            alt_en="Lens barrel",
            alt_fr="Fût d’objectif",
        ),
        # Leica
        q(
            "marque-09",
            text_en="Who is widely credited with inventing the compact 35mm Leica camera concept at Ernst Leitz?",
            text_fr="À qui attribue-t-on généralement le concept du Leica compact 35 mm chez Ernst Leitz ?",
            answers=[
                ("c", "George Eastman", "George Eastman"),
                ("a", "Oskar Barnack", "Oskar Barnack"),
                ("b", "Edwin Land", "Edwin Land"),
                ("d", "Steven Sasson", "Steven Sasson"),
            ],
            correct=["a"],
            expl_en="Oskar Barnack’s Ur-Leica led to the Leica I (1925), popularizing 35mm still photography.",
            expl_fr="L’Ur-Leica d’Oskar Barnack mène au Leica I (1925), qui popularise la photo fixe en 35 mm.",
            difficulty="easy",
            image=e2,
            alt_en="Vintage photography equipment",
            alt_fr="Équipement photo vintage",
        ),
        q(
            "marque-10",
            text_en="The first commercially produced Leica (Leica I / model A) reached the market around which year?",
            text_fr="Le premier Leica commercialisé (Leica I / modèle A) arrive sur le marché vers quelle année ?",
            answers=[
                ("d", "1969", "1969"),
                ("b", "1947", "1947"),
                ("c", "1987", "1987"),
                ("a", "1925", "1925"),
            ],
            correct=["a"],
            expl_en="Leica I was introduced at the 1925 Leipzig Spring Fair — a landmark for portable 35mm cameras.",
            expl_fr="Le Leica I est présenté à la foire de Leipzig au printemps 1925 — jalon des appareils 35 mm portables.",
            difficulty="easy",
            image=IMG["classic"],
            alt_en="Classic camera",
            alt_fr="Appareil classique",
        ),
        q(
            "marque-11",
            text_en="Leica’s M-mount rangefinder system was introduced in which decade?",
            text_fr="Le système télémétrique à baïonnette M de Leica apparaît dans quelle décennie ?",
            answers=[
                ("a", "1950s (Leica M3, 1954)", "Années 1950 (Leica M3, 1954)"),
                ("b", "1970s", "Années 1970"),
                ("c", "1990s", "Années 1990"),
                ("d", "2010s", "Années 2010"),
            ],
            correct=["a"],
            expl_en="The Leica M3 (1954) launched the M bayonet still central to Leica rangefinders.",
            expl_fr="Le Leica M3 (1954) lance la baïonnette M, toujours au cœur des télémétriques Leica.",
            difficulty="medium",
            image=IMG["street"],
            alt_en="City street scene — rangefinder culture",
            alt_fr="Scène de rue — culture télémétrique",
        ),
        q(
            "marque-12",
            text_en="Leica cameras historically have a strong association with which kind of photography?",
            text_fr="Les appareils Leica sont historiquement fortement associés à quel type de photographie ?",
            answers=[
                ("b", "Only underwater housings", "Uniquement les caissons sous-marins"),
                ("c", "Only large-format studio view cameras", "Uniquement les chambres grand format de studio"),
                ("a", "Quiet rangefinder street / reportage photography", "Photo de rue / reportage au télémétrique discret"),
                ("d", "Only smartphone computational HDR", "Uniquement le HDR computationnel smartphone"),
            ],
            correct=["a"],
            expl_en="Compact, quiet M rangefinders became icons of street and reportage work (e.g. many Magnum photographers).",
            expl_fr="Les télémétriques M, compacts et discrets, sont devenus des icônes de la rue et du reportage (ex. de nombreux photographes Magnum).",
            difficulty="easy",
            image=IMG["street"],
            alt_en="Urban street atmosphere",
            alt_fr="Atmosphère de rue urbaine",
        ),
        # Sony
        q(
            "marque-13",
            text_en="Sony’s company origins (Tokyo Tsushin Kogyo) date to which year?",
            text_fr="Les origines de Sony (Tokyo Tsushin Kogyo) remontent à quelle année ?",
            answers=[
                ("c", "1917", "1917"),
                ("a", "1946", "1946"),
                ("b", "1934", "1934"),
                ("d", "1925", "1925"),
            ],
            correct=["a"],
            expl_en="Tokyo Tsushin Kogyo was founded in 1946 and later renamed Sony — electronics first, cameras later.",
            expl_fr="Tokyo Tsushin Kogyo est fondée en 1946 puis renommée Sony — d’abord l’électronique, les appareils photo plus tard.",
            difficulty="medium",
            image=IMG["desk"],
            alt_en="Electronics and workspace",
            alt_fr="Électronique et espace de travail",
        ),
        q(
            "marque-14",
            text_en="Sony’s α (Alpha) interchangeable-lens cameras grew in part from which earlier camera lineage?",
            text_fr="Les hybrides / reflex Sony α (Alpha) s’appuient en partie sur quelle lignée d’appareils antérieure ?",
            answers=[
                ("d", "Only Polaroid instant cameras", "Uniquement les Polaroid instantanés"),
                ("b", "Only GoPro action cams", "Uniquement les caméras d’action GoPro"),
                ("a", "Minolta / Konica Minolta A-mount SLR heritage", "L’héritage reflex baïonnette A Minolta / Konica Minolta"),
                ("c", "Only Leica screw-mount film bodies", "Uniquement les boîtiers Leica à monture à vis"),
            ],
            correct=["a"],
            expl_en="Sony entered ILCs after taking over Konica Minolta’s camera business, continuing the A-mount line before E-mount mirrorless.",
            expl_fr="Sony entre sur les appareils à objectifs interchangeables après la reprise de l’activité photo Konica Minolta, poursuivant la baïonnette A avant les hybrides E.",
            difficulty="hard",
            image=e4,
            alt_en="Modern camera body",
            alt_fr="Boîtier moderne",
        ),
        q(
            "marque-15",
            text_en="Which 2013 Sony camera line is widely credited with popularizing full-frame mirrorless?",
            text_fr="Quelle gamme Sony de 2013 est largement créditée d’avoir popularisé l’hybride plein format ?",
            answers=[
                ("b", "Sony Cyber-shot DSC-RX0 only", "Sony Cyber-shot DSC-RX0 uniquement"),
                ("a", "Sony α7 (A7) series", "Série Sony α7 (A7)"),
                ("c", "Sony Mavica floppy-disk cameras", "Appareils Sony Mavica à disquette"),
                ("d", "Sony Handycam Hi8 only", "Sony Handycam Hi8 uniquement"),
            ],
            correct=["a"],
            expl_en="The 2013 α7 / α7R brought relatively compact full-frame mirrorless bodies to a wide audience.",
            expl_fr="Les α7 / α7R de 2013 ont démocratisé des boîtiers hybrides plein format relativement compacts.",
            difficulty="medium",
            image=IMG["camera4"],
            alt_en="Compact camera in hand context",
            alt_fr="Appareil compact en contexte",
        ),
        q(
            "marque-16",
            text_en="Sony’s mirrorless E-mount was first associated with which sensor format class?",
            text_fr="La baïonnette hybride E de Sony a d’abord été associée à quelle classe de format de capteur ?",
            answers=[
                ("c", "Only 8×10 large format", "Uniquement le grand format 8×10"),
                ("b", "Only APS-H film", "Uniquement le film APS-H"),
                ("a", "APS-C (NEX / α××00), later expanded to full-frame", "APS-C (NEX / α××00), puis étendue au plein format"),
                ("d", "Only Medium format 6×6", "Uniquement le moyen format 6×6"),
            ],
            correct=["a"],
            expl_en="E-mount launched on APS-C NEX cameras; full-frame α7 bodies later used the same mount family.",
            expl_fr="La baïonnette E naît sur les NEX APS-C ; les boîtiers plein format α7 reprennent ensuite la même famille de monture.",
            difficulty="hard",
            image=IMG["camera2"],
            alt_en="Interchangeable-lens camera",
            alt_fr="Appareil à objectifs interchangeables",
        ),
        # Fujifilm
        q(
            "marque-17",
            text_en="Fujifilm is historically best known first as a company for…",
            text_fr="Fujifilm est d’abord historiquement connue comme une entreprise de…",
            answers=[
                ("b", "Only smartphone chipsets", "Uniquement des chipsets smartphone"),
                ("a", "Photographic film and imaging materials", "Films photographiques et matériaux d’imagerie"),
                ("c", "Only car engines", "Uniquement des moteurs automobiles"),
                ("d", "Only typewriters", "Uniquement des machines à écrire"),
            ],
            correct=["a"],
            expl_en="Fuji Photo Film Co. built its name on film and imaging chemistry before digital X-series cameras.",
            expl_fr="Fuji Photo Film Co. s’est d’abord imposée par le film et la chimie d’imagerie, avant les hybrides série X.",
            difficulty="easy",
            image=IMG["film"],
            alt_en="Archival / film-era atmosphere",
            alt_fr="Atmosphère d’époque film / archives",
        ),
        q(
            "marque-18",
            text_en="Fujifilm’s modern X-series interchangeable cameras are especially associated with…",
            text_fr="Les hybrides modernes Fujifilm série X sont surtout associés à…",
            answers=[
                ("d", "Only medium-format film backs for Hasselblad", "Uniquement des dos film moyen format Hasselblad"),
                ("c", "Only underwater Nikonos housings", "Uniquement des caissons Nikonos"),
                ("a", "APS-C mirrorless bodies and distinctive film-simulation looks", "Boîtiers hybrides APS-C et rendus type simulations de films"),
                ("b", "Only 4×5 sheet-film holders", "Uniquement des châssis plan-film 4×5"),
            ],
            correct=["a"],
            expl_en="The X-Pro / X-T lines popularized APS-C mirrorless with JPEG film simulations rooted in Fuji’s film heritage.",
            expl_fr="Les X-Pro / X-T ont popularisé l’hybride APS-C avec des simulations de film JPEG héritées du passé argentique Fuji.",
            difficulty="medium",
            image=e3,
            alt_en="Camera ready to shoot",
            alt_fr="Appareil prêt à photographier",
        ),
        # Olympus
        q(
            "marque-19",
            text_en="Olympus’s classic OM-1 (1970s) is famous for being…",
            text_fr="Le classique Olympus OM-1 (années 1970) est célèbre pour être…",
            answers=[
                ("b", "The first digital medium-format back", "Le premier dos numérique moyen format"),
                ("a", "A compact, lightweight professional 35mm SLR system", "Un système reflex 35 mm professionnel compact et léger"),
                ("c", "A disposable single-use camera only", "Uniquement un appareil jetable"),
                ("d", "A cinema IMAX camera", "Une caméra cinéma IMAX"),
            ],
            correct=["a"],
            expl_en="The OM system (OM-1, 1972) shrank the pro SLR while keeping interchangeable lenses and accessories.",
            expl_fr="Le système OM (OM-1, 1972) miniaturise le reflex pro tout en gardant objectifs et accessoires interchangeables.",
            difficulty="medium",
            image=IMG["vintage"],
            alt_en="Vintage camera system vibe",
            alt_fr="Ambiance système photo vintage",
        ),
        q(
            "marque-20",
            text_en="Micro Four Thirds (used by Olympus and Panasonic) is primarily a standard for…",
            text_fr="Le Micro Four Thirds (utilisé par Olympus et Panasonic) est surtout une norme pour…",
            answers=[
                ("c", "Only flash sync cables", "Uniquement des câbles de synchro flash"),
                ("d", "Only darkroom enlarger lenses", "Uniquement des objectifs d’agrandisseur"),
                ("a", "Mirrorless cameras with a shared lens mount and Four Thirds-sized sensors", "Hybrides à baïonnette partagée et capteurs taille Four Thirds"),
                ("b", "Only 35mm film cassettes", "Uniquement des cartouches de film 35 mm"),
            ],
            correct=["a"],
            expl_en="m4/3 (announced 2008) lets Olympus and Panasonic share lenses on compact mirrorless bodies.",
            expl_fr="Le m4/3 (annoncé en 2008) permet à Olympus et Panasonic de partager des objectifs sur des hybrides compacts.",
            difficulty="medium",
            image=IMG["camera4"],
            alt_en="Compact interchangeable-lens camera",
            alt_fr="Hybride compact",
        ),
        # Cross-brand
        q(
            "marque-21",
            text_en="Which pairing correctly matches brand → well-known historic milestone?",
            text_fr="Quelle association marque → jalon historique est correcte ?",
            answers=[
                ("b", "Leica → first consumer CMOS smartphone (2007)", "Leica → premier smartphone CMOS grand public (2007)"),
                ("a", "Nikon F (1959) → modular pro 35mm SLR system", "Nikon F (1959) → système reflex 35 mm pro modulaire"),
                ("c", "Canon → invention of the daguerreotype (1839)", "Canon → invention du daguerréotype (1839)"),
                ("d", "Sony → Ur-Leica prototype (1913)", "Sony → prototype Ur-Leica (1913)"),
            ],
            correct=["a"],
            expl_en="Nikon F is the classic pro SLR system milestone; daguerreotype and Ur-Leica belong to earlier inventors, not those brands.",
            expl_fr="Le Nikon F est le jalon reflex pro classique ; daguerréotype et Ur-Leica appartiennent à d’autres inventeurs / époques.",
            difficulty="easy",
            image=IMG["classic"],
            alt_en="Classic camera silhouette",
            alt_fr="Silhouette d’appareil classique",
        ),
        q(
            "marque-22",
            text_en="Which brands were early leaders in 35mm rangefinder culture (pre-DSLRs)?",
            text_fr="Quelles marques furent des pionnières de la culture télémétrique 35 mm (avant les DSLR) ?",
            answers=[
                ("a", "Leica", "Leica"),
                ("b", "Canon (early rangefinders)", "Canon (premiers télémétriques)"),
                ("c", "Only GoPro", "Uniquement GoPro"),
                ("d", "Only DJI drones", "Uniquement les drones DJI"),
            ],
            correct=["a", "b"],
            qtype="multiple",
            expl_en="Leica defined the 35mm rangefinder; early Canon cameras were also rangefinders before Canon’s SLR success.",
            expl_fr="Leica définit le télémétrique 35 mm ; les premiers Canon étaient aussi des télémétriques avant le succès des reflex Canon.",
            difficulty="medium",
            image=e2,
            alt_en="Vintage rangefinder-era gear",
            alt_fr="Matériel d’époque télémétrique",
        ),
        q(
            "marque-23",
            text_en="In the 2010s mirrorless boom, which statement is historically accurate?",
            text_fr="Dans le boom des hybrides des années 2010, quelle affirmation est historiquement exacte ?",
            answers=[
                ("d", "Film SLRs were invented after mirrorless full-frame", "Les reflex argentiques ont été inventés après l’hybride plein format"),
                ("b", "No brand ever made APS-C mirrorless", "Aucune marque n’a jamais fait d’hybride APS-C"),
                ("a", "Sony popularized full-frame mirrorless with the α7 line while Fuji grew APS-C X-series and Olympus pushed Micro Four Thirds", "Sony popularise l’hybride plein format avec la série α7, Fuji développe les X APS-C et Olympus pousse le Micro Four Thirds"),
                ("c", "Only Leica sold mirrorless cameras in that decade", "Seul Leica vendait des hybrides dans cette décennie"),
            ],
            correct=["a"],
            expl_en="Different brands bet on different formats: Sony FF E-mount, Fuji APS-C X, Olympus/Panasonic m4/3 — all part of the mirrorless shift.",
            expl_fr="Chaque marque mise sur un format : Sony FF monture E, Fuji X APS-C, Olympus/Panasonic m4/3 — autant de voies de la transition hybride.",
            difficulty="hard",
            image=e4,
            alt_en="Contemporary camera body",
            alt_fr="Boîtier contemporain",
        ),
        q(
            "marque-24",
            text_en="“EOS”, “F-mount”, and “M-mount” are examples of what in brand history?",
            text_fr="« EOS », « baïonnette F » et « baïonnette M » sont des exemples de quoi dans l’histoire des marques ?",
            answers=[
                ("c", "Only social-media filters", "Uniquement des filtres de réseaux sociaux"),
                ("a", "Core camera systems / lens mounts that defined each brand’s ecosystem", "Systèmes / baïonnettes structurants qui définissent l’écosystème de chaque marque"),
                ("b", "Only battery chemistries", "Uniquement des chimies de batteries"),
                ("d", "Only printer paper sizes", "Uniquement des formats de papier imprimante"),
            ],
            correct=["a"],
            expl_en="Mount and system names (Canon EOS/EF, Nikon F, Leica M) are the long-lived platforms photographers build kits around.",
            expl_fr="Les noms de systèmes et baïonnettes (Canon EOS/EF, Nikon F, Leica M) sont les plateformes durables autour desquelles se construisent les kits.",
            difficulty="easy",
            image=IMG["lens"],
            alt_en="Lens mount / glass culture",
            alt_fr="Culture baïonnette / optique",
        ),
    ]

    return {
        "id": "marques-photo",
        "title": {
            "en": "Brand history",
            "fr": "Histoire des marques",
        },
        "description": {
            "en": "Canon, Nikon, Leica, Sony and friends — founding stories and iconic systems, Pixfan culture style.",
            "fr": "Canon, Nikon, Leica, Sony et consorts — fondations et systèmes iconiques, dans l’esprit culture Pixfan.",
        },
        "difficulty": "medium",
        "questions": questions,
    }


def append_sources(photo_ids: list[str]) -> None:
    if not SOURCES.exists() or not photo_ids:
        return
    text = SOURCES.read_text(encoding="utf-8")
    lines = []
    for pid in photo_ids:
        row = f"| `{pid}.avif` | [`{pid}`](https://images.unsplash.com/{pid}) | 1 |"
        if pid not in text:
            lines.append(row)
    if not lines:
        return
    # Insert before trailing refresh notes if present
    marker = "\nRefresh:"
    if marker in text:
        head, tail = text.split(marker, 1)
        # ensure table ends with newline
        head = head.rstrip() + "\n" + "\n".join(lines) + "\n\nRefresh:" + tail
        SOURCES.write_text(head, encoding="utf-8")
    else:
        SOURCES.write_text(text.rstrip() + "\n" + "\n".join(lines) + "\n", encoding="utf-8")


def update_sw(new_paths: list[str]) -> None:
    text = SW.read_text(encoding="utf-8")
    text = text.replace("quiz-pixfan-v11", "quiz-pixfan-v12")
    text = text.replace("quiz-pixfan-images-v5", "quiz-pixfan-images-v6")
    # Insert new IMAGE_URLS before closing ]; of IMAGE_URLS array — find last packs entry
    for path in new_paths:
        entry = f"  '{path}',\n"
        if path in text:
            continue
        # insert before the closing ]; that follows IMAGE_URLS
        m = re.search(r"(const IMAGE_URLS = \[[\s\S]*?)(\];)", text)
        if not m:
            raise SystemExit("IMAGE_URLS not found")
        block = m.group(1)
        if not block.rstrip().endswith(","):
            # last item may already have comma
            pass
        text = text[: m.start(1)] + block + entry + m.group(2) + text[m.end(2) :]
    SW.write_text(text, encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    extra: dict[str, str] = {}
    mirrored: list[str] = []
    keys = ["e1", "e2", "e3", "e4"]
    for key, (pid, _a, _b) in zip(keys, NEW_PHOTOS):
        path = download_avif(pid)
        if path:
            extra[key] = path
            mirrored.append(pid)

    data = json.loads(DATA.read_text(encoding="utf-8"))
    if any(q["id"] == "marques-photo" for q in data["quizzes"]):
        data["quizzes"] = [q for q in data["quizzes"] if q["id"] != "marques-photo"]
    quiz = build_quiz(extra)
    data["quizzes"].append(quiz)
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    ill = sum(1 for q in quiz["questions"] if q.get("imageUrl"))
    print(f"added marques-photo: {len(quiz['questions'])} Q, {ill} illustrated")

    new_urls = [f"/images/packs/{pid}.avif" for pid in mirrored]
    # Also ensure all imageUrls from quiz are in SW — collect unique packs paths
    used = sorted({q["imageUrl"] for q in quiz["questions"] if q.get("imageUrl")})
    update_sw(used)
    append_sources(mirrored)
    print("SW bumped; new mirrors:", mirrored)


if __name__ == "__main__":
    main()

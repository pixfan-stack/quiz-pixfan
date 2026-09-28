#!/usr/bin/env python3
"""Vague 1.18 P4 — add flash-studio pack (14th quiz), reuse local Unsplash AVIFs."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public/data/questions.json"
OUT_DIR = ROOT / "public/images/packs"
SW = ROOT / "public/sw.js"

CREDIT = {
    "en": "Unsplash — free to use (Unsplash License)",
    "fr": "Unsplash — libre d'utilisation (licence Unsplash)",
}

# Reuse local AVIFs (studio / portrait / gear atmosphere). No new mirrors → no IMAGE_CACHE bump.
IMG = {
    "studio": "/images/packs/photo-1471341971476-ae15ff5dd4ea.avif",
    "portrait_f": "/images/packs/photo-1487412720507-e7ab37603c6f.avif",
    "portrait_f2": "/images/packs/photo-1438761681033-6461ffad8d80.avif",
    "portrait_f3": "/images/packs/photo-1494790108377-be9c29b29330.avif",
    "portrait_m": "/images/packs/photo-1500648767791-00dcc994a43e.avif",
    "portrait_m2": "/images/packs/photo-1507003211169-0a1dd7228f2d.avif",
    "vintage": "/images/packs/photo-1554048612-b6a482bc67e5.avif",
    "classic": "/images/packs/photo-1516035069371-29a1b244cc32.avif",
    "camera": "/images/packs/photo-1542038784456-1ea8e935640e.avif",
    "camera2": "/images/packs/photo-1606983340126-99ab4feaa64a.avif",
    "desk": "/images/packs/photo-1452587925148-ce544e77e70d.avif",
    "lens": "/images/packs/photo-1492691527719-9d1e07e534b4.avif",
    "softlight": "/images/packs/photo-1470252649378-9c29740c9fa8.avif",
    "gear": "/images/packs/photo-1493863641943-9b68992a8d07.avif",
    "model": "/images/packs/photo-1552374196-c4e7ffc6e126.avif",
    "shoot": "/images/packs/photo-1510127034890-ba27508e9f1c.avif",
}


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
    alt_en: str = "Studio lighting setup",
    alt_fr: str = "Éclairage studio",
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


def build_quiz() -> dict:
    questions = [
        q(
            "flash-01",
            text_en="What does TTL flash metering primarily automate?",
            text_fr="Que automatise principalement la mesure flash TTL ?",
            answers=[
                ("b", "Only the camera’s ISO permanently", "Uniquement l’ISO du boîtier de façon permanente"),
                ("a", "Flash output for a target exposure through-the-lens", "La puissance du flash pour une exposition cible via la mesure TTL"),
                ("c", "Only the color of gels on continuous LEDs", "Uniquement la couleur des gélatines sur LED continues"),
                ("d", "Only the shutter’s first curtain permanently open", "Uniquement le premier rideau restant ouvert en permanence"),
            ],
            correct=["a"],
            expl_en="TTL (Through-The-Lens) meters the scene and sets flash power for a target exposure; you still choose sync, modifiers, and creative overrides.",
            expl_fr="Le TTL mesure la scène et règle la puissance du flash pour une exposition cible ; sync, modificateurs et corrections restent de votre côté.",
            difficulty="easy",
            image=IMG["studio"],
            alt_en="Studio lights and camera gear",
            alt_fr="Éclairages studio et matériel photo",
        ),
        q(
            "flash-02",
            text_en="X-sync (classic flash sync) is mainly limited by which camera setting?",
            text_fr="La synchro X (synchro flash classique) est surtout limitée par quel réglage ?",
            answers=[
                ("c", "Only microphone gain", "Uniquement le gain micro"),
                ("a", "Maximum shutter speed before the curtains leave a moving slit", "La vitesse d’obturation max avant que les rideaux ne laissent une fente mobile"),
                ("b", "Only the lens focus motor speed", "Uniquement la vitesse du moteur AF"),
                ("d", "Only the LCD brightness", "Uniquement la luminosité de l’écran"),
            ],
            correct=["a"],
            expl_en="Above X-sync, focal-plane shutters expose via a moving slit — a normal flash pulse would only light a band unless you use HSS/hypersync techniques.",
            expl_fr="Au-delà de la synchro X, l’obturateur à rideaux expose via une fente mobile — un flash court n’éclairerait qu’une bande sans HSS / techniques adaptées.",
            difficulty="medium",
            image=IMG["classic"],
            alt_en="Classic camera body",
            alt_fr="Boîtier photo classique",
        ),
        q(
            "flash-03",
            text_en="High-speed sync (HSS) is useful when you want to…",
            text_fr="La synchro haute vitesse (HSS) est utile quand vous voulez…",
            answers=[
                ("d", "Disable all ambient light forever", "Désactiver toute lumière ambiante pour toujours"),
                ("b", "Only shoot film with no shutter", "Uniquement tourner de l’argentique sans obturateur"),
                ("a", "Use flash with shutter speeds faster than X-sync (e.g. shallow DOF outdoors)", "Utiliser le flash à des vitesses plus rapides que la synchro X (ex. faible PdC en extérieur)"),
                ("c", "Only charge batteries faster", "Uniquement charger les batteries plus vite"),
            ],
            correct=["a"],
            expl_en="HSS pulses flash across the slit so you can freeze ambient with fast shutters while still adding flash fill — at the cost of effective power.",
            expl_fr="Le HSS pulse le flash pendant le passage de la fente : vitesses rapides + flash (fill extérieur), au prix d’une puissance utile réduite.",
            difficulty="medium",
            image=IMG["softlight"],
            alt_en="Soft outdoor light atmosphere",
            alt_fr="Ambiance de lumière douce en extérieur",
        ),
        q(
            "flash-04",
            text_en="Rear-curtain (2nd curtain) sync typically makes moving lights look like they…",
            text_fr="La synchro 2ᵉ rideau fait typiquement apparaître les lumières en mouvement comme si elles…",
            answers=[
                ("a", "Trail behind the subject’s motion", "Laissaient une traînée derrière le mouvement du sujet"),
                ("b", "Always appear only in front of the subject", "N’apparaissent toujours que devant le sujet"),
                ("c", "Delete all motion blur automatically", "Suppriment automatiquement tout flou de mouvement"),
                ("d", "Change Kelvin to 2000 K only", "Passent uniquement le Kelvin à 2000 K"),
            ],
            correct=["a"],
            expl_en="With rear curtain, ambient trails build first and the flash freezes the subject at the end — trails read as following the motion.",
            expl_fr="En 2ᵉ rideau, les traînées ambiantes se construisent d’abord et le flash fige le sujet à la fin — les traînées suivent le mouvement.",
            difficulty="medium",
        ),
        q(
            "flash-05",
            text_en="A guide number (GN) mainly helps you estimate…",
            text_fr="Un nombre-guide (NG) sert surtout à estimer…",
            answers=[
                ("c", "Only the weight of a softbox", "Uniquement le poids d’une softbox"),
                ("a", "Flash reach / power vs distance (and aperture) for a given ISO", "La portée / puissance du flash vs distance (et ouverture) pour un ISO donné"),
                ("b", "Only autofocus points available", "Uniquement le nombre de collimateurs AF"),
                ("d", "Only JPEG compression quality", "Uniquement la qualité de compression JPEG"),
            ],
            correct=["a"],
            expl_en="Guide numbers summarize flash output for exposure math (distance × aperture relationships at a reference ISO).",
            expl_fr="Le nombre-guide résume la puissance utile pour le calcul d’exposition (relations distance × ouverture à un ISO de référence).",
            difficulty="easy",
            image=IMG["camera"],
            alt_en="Camera ready for flash work",
            alt_fr="Appareil prêt pour le travail au flash",
        ),
        q(
            "flash-06",
            text_en="According to the inverse-square idea for a bare flash, doubling subject distance roughly…",
            text_fr="Selon l’idée du carré inverse pour un flash nu, doubler la distance au sujet…",
            answers=[
                ("b", "Doubles flash brightness", "Double la luminosité du flash"),
                ("a", "Cuts flash intensity to about one quarter (≈ −2 stops)", "Réduit l’intensité à environ un quart (≈ −2 IL)"),
                ("c", "Has no effect on flash exposure", "N’a aucun effet sur l’exposition flash"),
                ("d", "Always locks ISO to 100", "Verrouille toujours l’ISO à 100"),
            ],
            correct=["a"],
            expl_en="Intensity falls with distance squared — 2× distance ≈ ¼ light (about two stops). Modifiers and bounce change the real falloff.",
            expl_fr="L’intensité chute avec le carré de la distance — 2× distance ≈ ¼ de lumière (environ deux stops). Modificateurs et rebond changent le rendu réel.",
            difficulty="hard",
            image=IMG["gear"],
            alt_en="Photo gear on set",
            alt_fr="Matériel photo sur le plateau",
        ),
        q(
            "flash-07",
            text_en="Bounce flash off a white ceiling usually aims to…",
            text_fr="Faire rebondir le flash sur un plafond blanc vise surtout à…",
            answers=[
                ("d", "Increase red-eye on purpose", "Augmenter volontairement les yeux rouges"),
                ("a", "Soften and enlarge the effective light source", "Adoucir et agrandir la source effective"),
                ("b", "Make light harder than a bare flash", "Rendre la lumière plus dure qu’un flash nu"),
                ("c", "Only warm the scene to 2000 K", "Uniquement réchauffer la scène à 2000 K"),
            ],
            correct=["a"],
            expl_en="A large bounced source softens shadows versus on-camera bare flash; colored ceilings/walls tint the bounce.",
            expl_fr="Une grande source rebondie adoucit les ombres vs flash nu sur boîtier ; plafonds/murs colorés teintent le rebond.",
            difficulty="easy",
            image=IMG["desk"],
            alt_en="Indoor desk scene",
            alt_fr="Scène intérieure de bureau",
        ),
        q(
            "flash-08",
            text_en="Compared with a bare speedlight, a large softbox close to the subject typically…",
            text_fr="Par rapport à un speedlight nu, une grande softbox proche du sujet…",
            answers=[
                ("a", "Softens transitions and wraps light more gently", "Adoucit les transitions et enveloppe plus doucement"),
                ("b", "Always creates sharper, harder shadows", "Crée toujours des ombres plus dures et nettes"),
                ("c", "Removes the need for any exposure settings", "Supprime le besoin de tout réglage d’exposition"),
                ("d", "Only works with film cameras", "Ne fonctionne qu’avec des appareils argentiques"),
            ],
            correct=["a"],
            expl_en="Relative size of the source matters: large + close = softer wrap. Softboxes still cast shadows — they don’t erase darkness.",
            expl_fr="La taille relative de la source compte : grande + proche = enveloppement plus doux. Une softbox projette encore des ombres.",
            difficulty="easy",
            image=IMG["portrait_f"],
            alt_en="Portrait with soft studio-like light",
            alt_fr="Portrait en lumière douce type studio",
        ),
        q(
            "flash-09",
            text_en="An umbrella vs a softbox — a fair studio rule of thumb is…",
            text_fr="Parapluie vs softbox — une règle de pouce studio raisonnable est…",
            answers=[
                ("c", "Umbrellas only work underwater", "Les parapluies ne marchent que sous l’eau"),
                ("a", "Umbrellas are quick and spill more; softboxes constrain spill with a face", "Les parapluies sont rapides et « spillent » plus ; les softboxes limitent le spill avec une face"),
                ("b", "Softboxes always freeze motion better than umbrellas", "Les softboxes figent toujours mieux le mouvement que les parapluies"),
                ("d", "Neither can be used with strobes", "Aucun ne peut s’utiliser avec des flashes studio"),
            ],
            correct=["a"],
            expl_en="Umbrellas (esp. shoot-through) are fast and spill; softboxes give more directional control. Both can be soft if large enough.",
            expl_fr="Les parapluies (surtout shoot-through) sont rapides et spillent ; les softboxes contrôlent mieux la direction. Les deux adoucissent si assez grands.",
            difficulty="medium",
            image=IMG["studio"],
            alt_en="Studio lighting kit",
            alt_fr="Kit d’éclairage studio",
        ),
        q(
            "flash-10",
            text_en="A grid on a softbox or reflector mainly…",
            text_fr="Une grille sur softbox ou bol sert surtout à…",
            answers=[
                ("b", "Increase spill onto the background", "Augmenter le spill sur le fond"),
                ("a", "Tighten the beam and reduce spill", "Resserrer le faisceau et réduire le spill"),
                ("c", "Convert flash to continuous tungsten only", "Convertir le flash en tungstène continu uniquement"),
                ("d", "Disable radio triggers", "Désactiver les déclencheurs radio"),
            ],
            correct=["a"],
            expl_en="Grids control spill and keep light more directional — useful for hair lights, accents, and cleaner backgrounds.",
            expl_fr="Les grilles contrôlent le spill et rendent la lumière plus directive — utiles en hair light, accents et fonds plus propres.",
            difficulty="medium",
        ),
        q(
            "flash-11",
            text_en="In a classic three-point studio setup, the rim / hair light typically…",
            text_fr="Dans un classique trois points studio, le rim / hair light sert typiquement à…",
            answers=[
                ("a", "Separate the subject from the background with an edge highlight", "Séparer le sujet du fond avec un liseré de lumière"),
                ("b", "Replace the key light entirely", "Remplacer entièrement la clé"),
                ("c", "Only measure Kelvin of the wall paint", "Uniquement mesurer le Kelvin de la peinture murale"),
                ("d", "Only power the modeling lamp", "Uniquement alimenter la lampe pilote"),
            ],
            correct=["a"],
            expl_en="Key shapes, fill opens shadows, rim/hair separates edges — a readable three-point vocabulary for studio portraits.",
            expl_fr="La clé sculpte, le fill ouvre les ombres, le rim/hair sépare les contours — vocabulaire trois points du portrait studio.",
            difficulty="easy",
            image=IMG["portrait_m"],
            alt_en="Studio-style portrait lighting",
            alt_fr="Portrait en éclairage style studio",
        ),
        q(
            "flash-12",
            text_en="Which statements about key vs fill in studio work are true?",
            text_fr="Quelles affirmations sur clé vs fill en studio sont vraies ?",
            answers=[
                ("a", "Key is usually the stronger shaping light", "La clé est en général la lumière principale qui sculpte"),
                ("b", "Fill reduces shadow depth without becoming a second hard key", "Le fill réduit la profondeur d’ombre sans devenir une 2ᵉ clé dure"),
                ("c", "Fill must always be brighter than the key", "Le fill doit toujours être plus fort que la clé"),
                ("d", "Key lights only exist on smartphones", "Les clés n’existent que sur smartphone"),
            ],
            correct=["a", "b"],
            qtype="multiple",
            expl_en="Key defines direction and shape; fill is subordinate. If fill overpowers key, the lighting ratio collapses.",
            expl_fr="La clé définit direction et forme ; le fill reste subordonné. S’il dépasse la clé, le ratio s’effondre.",
            difficulty="medium",
            image=IMG["portrait_f2"],
            alt_en="Portrait face with controlled light",
            alt_fr="Visage en lumière contrôlée",
        ),
        q(
            "flash-13",
            text_en="Strobe modeling lights are mainly there to…",
            text_fr="Les lampes pilotes (modeling lights) des flashes studio servent surtout à…",
            answers=[
                ("c", "Replace the need for any flash pulse", "Remplacer tout besoin d’impulsion flash"),
                ("a", "Preview light direction and shadows before firing the flash", "Prévisualiser direction et ombres avant de déclencher le flash"),
                ("b", "Only charge the capacitor faster", "Uniquement charger le condensateur plus vite"),
                ("d", "Only warm the flash tube chemically", "Uniquement réchauffer chimiquement le tube flash"),
            ],
            correct=["a"],
            expl_en="Modeling lamps help you see placement and ratios; final exposure still depends on the flash pulse (and camera settings).",
            expl_fr="Les lampes pilotes aident à voir placement et ratios ; l’exposition finale dépend encore de l’impulsion flash (et des réglages boîtier).",
            difficulty="easy",
            image=IMG["model"],
            alt_en="Subject lit for a portrait session",
            alt_fr="Sujet éclairé pour une séance portrait",
        ),
        q(
            "flash-14",
            text_en="Radio triggers for off-camera flash are preferred over optical slaves when…",
            text_fr="Les déclencheurs radio pour flash déporté sont préférables aux esclaves optiques quand…",
            answers=[
                ("b", "You only shoot in pitch darkness with no walls", "Vous ne photographiez que dans le noir absolu sans murs"),
                ("a", "You need reliability around corners, bright ambient, or multi-group control", "Vous avez besoin de fiabilité derrière les angles, en ambiance claire, ou en multi-groupes"),
                ("c", "You want slower recycle times on purpose", "Vous voulez volontairement des recyclages plus lents"),
                ("d", "You refuse to set any channel", "Vous refusez de régler tout canal"),
            ],
            correct=["a"],
            expl_en="Optical slaves can miss in bright sun or around obstacles; radio packs are more robust for location and multi-light kits.",
            expl_fr="Les esclaves optiques ratent plus facilement au soleil ou derrière des obstacles ; la radio est plus robuste en extérieur et multi-flashs.",
            difficulty="medium",
            image=IMG["camera2"],
            alt_en="Camera body for off-camera flash work",
            alt_fr="Boîtier pour flash déporté",
        ),
        q(
            "flash-15",
            text_en="A CTO gel on a flash is commonly used to…",
            text_fr="Une gélatine CTO sur un flash sert souvent à…",
            answers=[
                ("a", "Warm the flash to better match tungsten / warm ambient", "Réchauffer le flash pour mieux coller au tungstène / ambiance chaude"),
                ("b", "Cool the flash toward shade blue only", "Refroidir le flash vers le bleu d’ombre uniquement"),
                ("c", "Increase guide number by 10 stops", "Augmenter le nombre-guide de 10 stops"),
                ("d", "Disable TTL forever", "Désactiver le TTL pour toujours"),
            ],
            correct=["a"],
            expl_en="CTO (Color Temperature Orange) warms daylight-balanced flash to mix with warmer practicals; CTB goes the other way.",
            expl_fr="La CTO (orange) réchauffe un flash « daylight » pour se mêler aux sources chaudes ; la CTB fait l’inverse.",
            difficulty="medium",
        ),
        q(
            "flash-16",
            text_en="To keep flash exposure while darkening a bright background with a speedlight (no HSS), a classic control is…",
            text_fr="Pour garder l’exposition flash tout en assombrissant un fond clair avec un speedlight (sans HSS), un classique est…",
            answers=[
                ("c", "Only raise ISO while opening the aperture wider forever", "Uniquement monter l’ISO en ouvrant toujours plus le diaphragme"),
                ("a", "Raise shutter speed toward X-sync (ambient drops; flash stays similar)", "Monter la vitesse vers la synchro X (l’ambiance baisse ; le flash reste similaire)"),
                ("b", "Only zoom the lens without changing exposure", "Uniquement zoomer l’objectif sans changer l’exposition"),
                ("d", "Turn off the flash and hope", "Éteindre le flash et espérer"),
            ],
            correct=["a"],
            expl_en="Below X-sync, shutter mainly gates ambient; aperture/ISO/power gate flash. Faster shutter (still ≤ sync) darkens ambient without starving flash the same way.",
            expl_fr="Sous la synchro X, la vitesse gère surtout l’ambiance ; ouverture/ISO/puissance gèrent le flash. Une vitesse plus rapide (≤ sync) assombrit l’ambiance sans « affamer » le flash de la même façon.",
            difficulty="hard",
            image=IMG["shoot"],
            alt_en="Photographer working with camera outdoors",
            alt_fr="Photographe travaillant avec un appareil en extérieur",
        ),
        q(
            "flash-17",
            text_en="Manual flash power (e.g. 1/1 → 1/2) typically changes output by about…",
            text_fr="La puissance flash manuelle (ex. 1/1 → 1/2) change typiquement la sortie d’environ…",
            answers=[
                ("b", "Ten stops", "Dix stops"),
                ("a", "One stop", "Un stop"),
                ("c", "No measurable difference", "Aucune différence mesurable"),
                ("d", "Exactly 0.1 EV only", "Exactement 0,1 IL uniquement"),
            ],
            correct=["a"],
            expl_en="Halving power is roughly −1 EV of flash exposure (all else equal). Fine control often uses 1/3-stop steps on modern units.",
            expl_fr="Diviser la puissance par deux ≈ −1 IL d’exposition flash (toutes choses égales). Les flashes modernes offrent souvent des 1/3 de stop.",
            difficulty="easy",
            image=IMG["vintage"],
            alt_en="Vintage camera and light culture",
            alt_fr="Culture appareil vintage et lumière",
        ),
        q(
            "flash-18",
            text_en="Freezing a splash or dancer with flash often relies on…",
            text_fr="Figer une éclaboussure ou un danseur au flash repose souvent sur…",
            answers=[
                ("d", "Only a 30-second exposure", "Uniquement une pose de 30 secondes"),
                ("a", "A short flash duration (often at lower power) as the effective shutter", "Une durée d’éclair courte (souvent à basse puissance) comme « obturateur » efficace"),
                ("b", "Only continuous LED modeling lights", "Uniquement des LED pilotes continues"),
                ("c", "Disabling all light modifiers", "Désactiver tous les modificateurs"),
            ],
            correct=["a"],
            expl_en="In dark ambient, flash duration — not the mechanical shutter — freezes action. Lower power often shortens duration on speedlights.",
            expl_fr="En ambiance sombre, c’est la durée d’éclair — pas l’obturateur mécanique — qui fige. Baisser la puissance raccourcit souvent la durée sur speedlight.",
            difficulty="hard",
            image=IMG["portrait_f3"],
            alt_en="Portrait with crisp flash-like catchlights",
            alt_fr="Portrait avec catchlights nets type flash",
        ),
        q(
            "flash-19",
            text_en="Red-eye with on-camera flash is mainly caused by…",
            text_fr="Les yeux rouges au flash sur boîtier sont surtout dus à…",
            answers=[
                ("a", "Flash near the lens axis lighting the retina", "Un flash proche de l’axe optique éclairant la rétine"),
                ("b", "Too much bounce on a white ceiling only", "Uniquement trop de rebond au plafond blanc"),
                ("c", "Using radio triggers outdoors only", "Uniquement l’usage de triggers radio en extérieur"),
                ("d", "Shooting exclusively in RAW", "Photographier exclusivement en RAW"),
            ],
            correct=["a"],
            expl_en="Axis-aligned flash reflects from the retina. Off-camera, bounce, or pre-flashes that close the pupil reduce red-eye.",
            expl_fr="Un flash dans l’axe se reflète sur la rétine. Flash déporté, rebond ou préflashs qui ferment la pupille réduisent l’effet.",
            difficulty="easy",
        ),
        q(
            "flash-20",
            text_en="A snoot on a studio light typically…",
            text_fr="Un snip / snoot sur une lumière studio…",
            answers=[
                ("c", "Turns the strobe into a softbox automatically", "Transforme automatiquement le flash en softbox"),
                ("a", "Creates a small, controlled pool of light (hair, accent, product hotspot)", "Crée un petit faisceau contrôlé (cheveux, accent, hotspot produit)"),
                ("b", "Widens the beam like a bare umbrella", "Élargit le faisceau comme un parapluie nu"),
                ("d", "Only cools the flash tube", "Uniquement refroidit le tube flash"),
            ],
            correct=["a"],
            expl_en="Snoots concentrate light into a tight circle — accents and product highlights, not broad soft key light.",
            expl_fr="Le snoot concentre la lumière en un cercle serré — accents et highlights produit, pas une clé large et douce.",
            difficulty="medium",
            image=IMG["lens"],
            alt_en="Optical gear detail",
            alt_fr="Détail de matériel optique",
        ),
        q(
            "flash-21",
            text_en="Which practices help consistent multi-light studio exposures?",
            text_fr="Quelles pratiques aident des expositions multi-flashs cohérentes en studio ?",
            answers=[
                ("a", "Meter or chimping ratios after placing key, then add fill/rim", "Mesurer / chimper les ratios après la clé, puis ajouter fill/rim"),
                ("b", "Keep ISO and aperture intentional while adjusting light powers", "Garder ISO et ouverture intentionnels tout en réglant les puissances"),
                ("c", "Change every light to TTL randomly each frame", "Passer chaque lumière en TTL au hasard à chaque vue"),
                ("d", "Ignore recycle times and fire as fast as possible always", "Ignorer les temps de recycle et déclencher toujours au plus vite"),
            ],
            correct=["a", "b"],
            qtype="multiple",
            expl_en="Build from the key, control ratios deliberately, and watch recycle — random TTL on every head fights consistency.",
            expl_fr="Construire depuis la clé, contrôler les ratios, surveiller le recycle — du TTL aléatoire sur chaque tête nuit à la cohérence.",
            difficulty="hard",
            image=IMG["portrait_m2"],
            alt_en="Portrait subject under controlled lights",
            alt_fr="Sujet portrait sous lumières contrôlées",
        ),
        q(
            "flash-22",
            text_en="Continuous LED panels vs studio strobes — a fair comparison is…",
            text_fr="Panneaux LED continus vs flashes studio — une comparaison juste est…",
            answers=[
                ("a", "LEDs are easy to preview; strobes usually win for freezing and overpowering sun", "Les LED se prévisualisent facilement ; les flashes gagnent souvent pour figer et dominer le soleil"),
                ("b", "Strobes cannot use modifiers", "Les flashes ne peuvent pas utiliser de modificateurs"),
                ("c", "LEDs always have shorter durations than speedlights at 1/128", "Les LED ont toujours des durées plus courtes qu’un speedlight à 1/128"),
                ("d", "Only LEDs work with softboxes", "Seules les LED fonctionnent avec des softboxes"),
            ],
            correct=["a"],
            expl_en="What-you-see-is-what-you-get favors continuous light; peak power and short pulse favor strobes for action and daylight overpower.",
            expl_fr="Le WYSIWYG favorise le continu ; puissance de crête et pulse court favorisent le flash pour l’action et dominer le jour.",
            difficulty="medium",
        ),
        q(
            "flash-23",
            text_en="Cross-light / clamshell beauty setups usually place fill…",
            text_fr="Les setups beauty cross-light / clamshell placent en général le fill…",
            answers=[
                ("b", "Only behind the background paper", "Uniquement derrière le papier de fond"),
                ("a", "Under the chin / below the key to open eye sockets and lift shadows", "Sous le menton / sous la clé pour ouvrir les orbites et relever les ombres"),
                ("c", "As a bare sun outside only", "Uniquement comme soleil nu à l’extérieur"),
                ("d", "On the floor pointing straight up at 1/1 always", "Au sol pointé vers le haut à 1/1 toujours"),
            ],
            correct=["a"],
            expl_en="Clamshell pairs a key above with a lower fill (reflector or soft source) for bright, even beauty light — still not shadow-free.",
            expl_fr="Le clamshell associe une clé haute et un fill bas (réflecteur ou source douce) pour une beauty lumineuse — pas sans ombres pour autant.",
            difficulty="hard",
            image=IMG["portrait_f"],
            alt_en="Beauty-style portrait lighting",
            alt_fr="Éclairage portrait style beauty",
        ),
        q(
            "flash-24",
            text_en="Myth: “If I use flash indoors, the background always goes black.” Best nuance?",
            text_fr="Mythe : « Au flash en intérieur, le fond devient forcément noir. » Meilleure nuance ?",
            answers=[
                ("c", "Flash always deletes ambient forever", "Le flash efface toujours l’ambiance pour toujours"),
                ("a", "You can balance ambient with slower shutter / higher ISO / wider aperture while flash lights the subject", "On peut équilibre l’ambiance (vitesse plus lente / ISO / ouverture) pendant que le flash éclaire le sujet"),
                ("b", "Only gelled flash can show any ambient", "Seul un flash gélatiné peut laisser voir de l’ambiance"),
                ("d", "Backgrounds are physically removed by photons", "Les fonds sont physiquement retirés par les photons"),
            ],
            correct=["a"],
            expl_en="Black backgrounds happen when ambient is starved (fast shutter, low ISO, stopped-down). Dragging the shutter (within blur tolerance) keeps room light in the mix.",
            expl_fr="Un fond noir apparaît quand l’ambiance est « affamée » (vitesse rapide, bas ISO, diaphragmé). Trainer l’obturateur (sans trop de flou) garde la pièce dans le mix.",
            difficulty="medium",
            image=IMG["desk"],
            alt_en="Indoor scene with available light",
            alt_fr="Scène intérieure en lumière disponible",
        ),
    ]

    return {
        "id": "flash-studio",
        "title": {
            "en": "Flash & studio",
            "fr": "Flash & studio",
        },
        "description": {
            "en": "Speedlights, strobes, sync, modifiers and three-point craft — Pixfan studio lighting path.",
            "fr": "Speedlights, flashes studio, sync, modificateurs et trois points — parcours éclairage studio Pixfan.",
        },
        "difficulty": "medium",
        "questions": questions,
    }


def ensure_sw_image_urls(paths: list[str]) -> None:
    text = SW.read_text(encoding="utf-8")
    for path in paths:
        if path in text:
            continue
        entry = f"  '{path}',\n"
        m = re.search(r"(const IMAGE_URLS = \[[\s\S]*?)(\];)", text)
        if not m:
            raise SystemExit("IMAGE_URLS not found")
        text = text[: m.start(1)] + m.group(1) + entry + m.group(2) + text[m.end(2) :]
    SW.write_text(text, encoding="utf-8")


def main() -> None:
    for path in IMG.values():
        local = ROOT / "public" / path.lstrip("/")
        if not local.exists():
            raise SystemExit(f"missing image: {local}")

    data = json.loads(DATA.read_text(encoding="utf-8"))
    data["quizzes"] = [q for q in data["quizzes"] if q["id"] != "flash-studio"]
    quiz = build_quiz()
    data["quizzes"].append(quiz)
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    ill = sum(1 for qq in quiz["questions"] if qq.get("imageUrl"))
    used = sorted({qq["imageUrl"] for qq in quiz["questions"] if qq.get("imageUrl")})
    ensure_sw_image_urls(used)
    print(f"added flash-studio: {len(quiz['questions'])} Q, {ill} illustrated ({100 * ill // len(quiz['questions'])}%)")
    print("images used:", len(used))


if __name__ == "__main__":
    main()

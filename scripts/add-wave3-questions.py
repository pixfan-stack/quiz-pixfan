#!/usr/bin/env python3
"""Wave 3: scenarios, myths, and hard questions outside history."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public/data/questions.json"

IMG = {
    "runner": "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=960&q=80",
    "waterfall": "https://images.unsplash.com/photo-1432405972618-c60b0225d3f8?auto=format&fit=crop&w=960&q=80",
    "portrait": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=960&q=80",
    "street": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=960&q=80",
    "phone": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=960&q=80",
    "cafe": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=960&q=80",
    "landscape": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=960&q=80",
    "wedding": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=960&q=80",
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
    image: str | None = None,
    alt_en: str | None = None,
    alt_fr: str | None = None,
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
    return q


NEW: dict[str, list[dict]] = {
    "exposure-basics": [
        Q(
            "exp-24",
            typ="single",
            difficulty="medium",
            en="Window portrait: bright outdoors, dark room. How do you keep both readable?",
            fr="Portrait à la fenêtre : extérieur très clair, pièce sombre. Comment garder les deux lisibles ?",
            answers=[
                ("a", "Expose for the room only and blow the window", "Exposer pour la pièce et cramer la fenêtre"),
                ("b", "Expose for the outdoor view and silhouette the subject", "Exposer pour le dehors et silhouetter le sujet"),
                (
                    "c",
                    "Expose for the subject’s face, then lift shadows / use fill if needed",
                    "Exposer pour le visage, puis remonter les ombres / fill si besoin",
                ),
                ("d", "Always shoot at f/22 and ISO 50", "Toujours shooter à f/22 et ISO 50"),
            ],
            correct=["c"],
            expl_en="Protect the face first. Recover room shadows later; a blown window is often acceptable.",
            expl_fr="Protège d’abord le visage. Remonte les ombres ensuite ; une fenêtre cramée est souvent acceptable.",
            image=IMG["portrait"],
            alt_en="Portrait near a bright window",
            alt_fr="Portrait près d’une fenêtre lumineuse",
        ),
        Q(
            "exp-25",
            typ="single",
            difficulty="easy",
            en="Myth: “Higher ISO always means a worse photo.” What’s the nuance?",
            fr="Mythe : « Plus d’ISO = forcément une moins bonne photo. » Quelle nuance ?",
            answers=[
                ("a", "True — never go above ISO 400", "Vrai — ne jamais dépasser ISO 400"),
                (
                    "b",
                    "Noise is often better than blur or underexposure; modern sensors handle high ISO well",
                    "Le bruit vaut mieux que le flou ou la sous-exposition ; les capteurs modernes gèrent bien les hauts ISO",
                ),
                ("c", "ISO only affects white balance", "L’ISO ne change que la balance des blancs"),
                ("d", "ISO is only for film cameras", "L’ISO n’existe que pour l’argentique"),
            ],
            correct=["b"],
            expl_en="A sharp, well-exposed high-ISO frame beats a clean but blurry one.",
            expl_fr="Un cliché net et bien exposé à haut ISO bat un fichier « propre » mais flou.",
        ),
        Q(
            "exp-26",
            typ="single",
            difficulty="hard",
            en="You’re at EV 0 on a reflective beach. Skin looks dark. Smartest next step?",
            fr="Tu es à EV 0 sur une plage réfléchissante. Les peaux paraissent sombres. Meilleur réflexe ?",
            answers=[
                ("a", "Dial +1 to +2 exposure compensation", "Passer à +1 / +2 IL de compensation"),
                ("b", "Close the aperture two stops", "Fermer le diaphragme de deux stops"),
                ("c", "Switch to tungsten white balance", "Passer en balance tungstène"),
                ("d", "Enable the self-timer only", "Activer seulement le retardateur"),
            ],
            correct=["a"],
            expl_en="Matrix metering underexposes bright scenes. Positive compensation restores midtones.",
            expl_fr="La mesure matricielle sous-expose les scènes claires. Une compensation positive restaure les tons moyens.",
            image=IMG["landscape"],
            alt_en="Bright outdoor landscape",
            alt_fr="Paysage extérieur lumineux",
        ),
        Q(
            "exp-27",
            typ="single",
            difficulty="hard",
            en="Flash + ambient: how do you keep the background from going black?",
            fr="Flash + ambiance : comment éviter un fond noir ?",
            answers=[
                ("a", "Only raise flash power; ignore shutter", "Monter seulement la puissance flash ; ignorer l’obturateur"),
                (
                    "b",
                    "Slow the shutter (within sync) to gather ambient, set flash for the subject",
                    "Ralentir l’obturateur (dans la synchro) pour l’ambiance, régler le flash pour le sujet",
                ),
                ("c", "Always use 1/8000 s with flash", "Toujours shooter à 1/8000 s au flash"),
                ("d", "Disable all ambient light meters", "Désactiver tous les posemètres ambiants"),
            ],
            correct=["b"],
            expl_en="Shutter mainly gates ambient; flash (and aperture/ISO) lights the subject.",
            expl_fr="L’obturateur gère surtout l’ambiance ; le flash (avec ouverture/ISO) éclaire le sujet.",
        ),
        Q(
            "exp-28",
            typ="single",
            difficulty="medium",
            en="Sports hallway: subject runs toward you. Best autofocus / shutter combo?",
            fr="Couloir de sport : le sujet court vers toi. Meilleure combo AF / obturateur ?",
            answers=[
                ("a", "Single AF + 1/60 s", "AF simple + 1/60 s"),
                ("b", "Continuous AF + fast shutter (e.g. 1/500 s+)", "AF continu + obturateur rapide (ex. 1/500 s+)"),
                ("c", "Manual focus at infinity + bulb", "Mise au point manuelle à l’infini + pose B"),
                ("d", "Face detect only at 2 s exposure", "Détection de visage seule en pose 2 s"),
            ],
            correct=["b"],
            expl_en="Tracking AF plus a shutter fast enough to freeze motion.",
            expl_fr="Un AF qui suit, plus un temps assez court pour figer.",
            image=IMG["runner"],
            alt_en="Runner in motion",
            alt_fr="Coureur en mouvement",
        ),
    ],
    "composition": [
        Q(
            "comp-24",
            typ="single",
            difficulty="medium",
            en="Crowded street: how do you isolate one subject without moving closer?",
            fr="Rue bondée : comment isoler un sujet sans te rapprocher ?",
            answers=[
                ("a", "Widen to 16 mm and include everyone", "Passer à 16 mm et tout inclure"),
                (
                    "b",
                    "Use a longer focal length and a shallow depth of field",
                    "Utiliser une focale plus longue et une faible profondeur de champ",
                ),
                ("c", "Always center the subject with flash", "Toujours centrer le sujet au flash"),
                ("d", "Shoot only vertical panoramas", "Ne shooter que des panoramas verticaux"),
            ],
            correct=["b"],
            expl_en="Compression + blur separates the subject from clutter.",
            expl_fr="La compression et le flou séparent le sujet du fouillis.",
            image=IMG["street"],
            alt_en="Busy city street",
            alt_fr="Rue de ville animée",
        ),
        Q(
            "comp-25",
            typ="single",
            difficulty="easy",
            en="Myth: “Never put the subject in the center.” When is centering fine?",
            fr="Mythe : « Ne jamais centrer le sujet. » Quand le centrage est-il pertinent ?",
            answers=[
                ("a", "Never — always use thirds", "Jamais — toujours les tiers"),
                (
                    "b",
                    "Symmetry, portraits with direct gaze, or strong graphic balance",
                    "Symétrie, portrait au regard frontal, ou équilibre graphique fort",
                ),
                ("c", "Only for screenshots of spreadsheets", "Uniquement pour des captures de tableurs"),
                ("d", "Only when shooting in RAW", "Uniquement en RAW"),
            ],
            correct=["b"],
            expl_en="Rules are tools. Centered frames can feel intentional and powerful.",
            expl_fr="Les règles sont des outils. Un cadrage centré peut être volontaire et fort.",
        ),
        Q(
            "comp-26",
            typ="single",
            difficulty="hard",
            en="You want leading lines into a tiny figure. Which framing mistake kills it?",
            fr="Tu veux des lignes directrices vers une petite silhouette. Quelle erreur casse l’effet ?",
            answers=[
                ("a", "Leaving breathing room at the vanishing point", "Laisser de l’air au point de fuite"),
                (
                    "b",
                    "Cropping so lines exit the frame before reaching the subject",
                    "Rogner pour que les lignes sortent du cadre avant d’atteindre le sujet",
                ),
                ("c", "Using a slightly lower camera angle", "Utiliser un angle un peu plus bas"),
                ("d", "Waiting for softer light", "Attendre une lumière plus douce"),
            ],
            correct=["b"],
            expl_en="Leading lines must still point at the subject inside the frame.",
            expl_fr="Les lignes doivent encore pointer vers le sujet dans le cadre.",
        ),
        Q(
            "comp-27",
            typ="single",
            difficulty="hard",
            en="Wedding toast: many faces. How do you keep hierarchy clear?",
            fr="Toast de mariage : beaucoup de visages. Comment garder une hiérarchie claire ?",
            answers=[
                ("a", "Focus on the speakers / couple and let others fall softer", "Net sur les intervenants / le couple, les autres plus doux"),
                ("b", "Focus on the farthest chandelier", "Net sur le chandelier le plus loin"),
                ("c", "Always use the widest aperture on the cake", "Toujours la plus grande ouverture sur le gâteau"),
                ("d", "Pan-blur every guest equally", "Flouter tous les invités pareil au filé"),
            ],
            correct=["a"],
            expl_en="Direct attention with focus and placement — not equal sharpness everywhere.",
            expl_fr="Dirige l’attention par la mise au point et le placement — pas une netteté égale partout.",
            image=IMG["wedding"],
            alt_en="Wedding celebration moment",
            alt_fr="Moment de célébration de mariage",
        ),
        Q(
            "comp-28",
            typ="single",
            difficulty="medium",
            en="Café table: cluttered foreground. Cleanest fix before shooting?",
            fr="Table de café : premier plan encombré. Correction la plus propre avant de shooter ?",
            answers=[
                ("a", "Raise ISO to 25600", "Monter l’ISO à 25600"),
                ("b", "Clear or rearrange objects, or change angle to simplify", "Ranger / déplacer, ou changer d’angle pour simplifier"),
                ("c", "Add more napkins for texture", "Ajouter des serviettes pour la texture"),
                ("d", "Shoot through a dirty glass for mood only", "Shooter à travers un verre sale pour l’ambiance seule"),
            ],
            correct=["b"],
            expl_en="Composition starts before the shutter — edit the scene.",
            expl_fr="La composition commence avant le déclenchement — édite la scène.",
            image=IMG["cafe"],
            alt_en="Cafe table scene",
            alt_fr="Scène de table de café",
        ),
    ],
    "genres": [
        Q(
            "gen-24",
            typ="single",
            difficulty="medium",
            en="Client wants “documentary wedding” coverage. What does that imply?",
            fr="Le client veut une couverture mariage « documentaire ». Qu’est-ce que ça implique ?",
            answers=[
                ("a", "Only posed studio lighting all day", "Uniquement de la lumière studio posée toute la journée"),
                (
                    "b",
                    "Observe and anticipate moments with minimal staging",
                    "Observer et anticiper les moments avec peu de mise en scène",
                ),
                ("c", "Only drone overheads of the venue", "Uniquement des vues drone du lieu"),
                ("d", "Only black-and-white film forever", "Uniquement du film N&B pour toujours"),
            ],
            correct=["b"],
            expl_en="Documentary prioritizes real moments over heavy direction.",
            expl_fr="Le documentaire privilégie les vrais moments plutôt que la direction lourde.",
            image=IMG["wedding"],
            alt_en="Candid wedding moment",
            alt_fr="Moment de mariage spontané",
        ),
        Q(
            "gen-25",
            typ="single",
            difficulty="easy",
            en="Myth: “Street photography must be confrontational.” Better framing?",
            fr="Mythe : « La street doit être conflictuelle. » Meilleure façon de voir ?",
            answers=[
                ("a", "True — always stop strangers aggressively", "Vrai — toujours intercepter les inconnus agressivement"),
                (
                    "b",
                    "Street can be quiet observation of public life, with ethics and local law in mind",
                    "La street peut être une observation discrète de la vie publique, dans le respect de l’éthique et du droit local",
                ),
                ("c", "Street only exists with fisheye lenses", "La street n’existe qu’au fisheye"),
                ("d", "Street means only photographing signs", "La street = photographier uniquement des panneaux"),
            ],
            correct=["b"],
            expl_en="Approaches vary; respect and legality matter more than aggression.",
            expl_fr="Les approches varient ; le respect et la légalité comptent plus que l’agressivité.",
            image=IMG["street"],
            alt_en="Urban street scene",
            alt_fr="Scène de rue urbaine",
        ),
        Q(
            "gen-26",
            typ="single",
            difficulty="hard",
            en="Wildlife: animal half-hidden in brush. Priority for a usable frame?",
            fr="Animal à moitié caché dans les broussailles. Priorité pour une image utilisable ?",
            answers=[
                ("a", "Blow highlights on the sky behind", "Cramer les hautes lumières du ciel derrière"),
                (
                    "b",
                    "Clear eye contact / catchlight and enough shutter to freeze micro-motion",
                    "Un regard / catchlight net et un obturateur assez rapide pour figer les micro-mouvements",
                ),
                ("c", "Always crop out the habitat", "Toujours rogner l’habitat"),
                ("d", "Use flash on nestlings at night without care", "Flasher les oisillons la nuit sans précaution"),
            ],
            correct=["b"],
            expl_en="Readable eyes and sharp moments beat a busy but soft frame.",
            expl_fr="Des yeux lisibles et un instant net battent un cadre chargé mais flou.",
        ),
        Q(
            "gen-27",
            typ="single",
            difficulty="hard",
            en="Product shot on white: edges look gray. Likely cause?",
            fr="Packshot sur fond blanc : les bords paraissent gris. Cause probable ?",
            answers=[
                ("a", "Too much separation light on the background", "Trop de lumière de séparation sur le fond"),
                (
                    "b",
                    "Background underexposed relative to the product — raise background lights",
                    "Fond sous-exposé par rapport au produit — remonter les lumières de fond",
                ),
                ("c", "Using RAW instead of JPEG", "Utiliser le RAW au lieu du JPEG"),
                ("d", "Lens too sharp", "Objectif trop piqué"),
            ],
            correct=["b"],
            expl_en="True seamless white needs the backdrop brighter than the subject edges.",
            expl_fr="Un vrai blanc seamless demande un fond plus clair que les bords du sujet.",
        ),
        Q(
            "gen-28",
            typ="single",
            difficulty="medium",
            en="Architecture interior: verticals lean. Fastest in-camera fix?",
            fr="Intérieur d’architecture : les verticales penchent. Correction la plus rapide à la prise ?",
            answers=[
                ("a", "Tilt the camera more aggressively", "Pencher encore plus l’appareil"),
                (
                    "b",
                    "Keep the sensor parallel to walls / use a shift lens or level carefully",
                    "Garder le capteur parallèle aux murs / shift ou niveau soigneux",
                ),
                ("c", "Always shoot from the floor looking up", "Toujours shooter du sol en contre-plongée"),
                ("d", "Use the smallest JPEG setting", "Utiliser le plus petit JPEG"),
            ],
            correct=["b"],
            expl_en="Parallel planes prevent keystoning; shift lenses help when you can’t back up.",
            expl_fr="Des plans parallèles évitent le keystone ; le shift aide quand on ne peut pas reculer.",
        ),
    ],
    "smartphone": [
        Q(
            "phone-24",
            typ="single",
            difficulty="medium",
            en="Night city: phone insists on ultra-wide. Why switch to 1×?",
            fr="Ville de nuit : le téléphone insiste sur l’ultra grand-angle. Pourquoi passer en 1× ?",
            answers=[
                ("a", "Ultra-wide always has the best sensor", "L’ultra grand-angle a toujours le meilleur capteur"),
                (
                    "b",
                    "The main camera usually gathers more light and cleaner detail",
                    "Le module principal recueille en général plus de lumière et plus de détail propre",
                ),
                ("c", "1× disables Night mode forever", "Le 1× désactive le mode Nuit pour toujours"),
                ("d", "Ultra-wide cannot focus outdoors", "L’ultra grand-angle ne fait pas le point dehors"),
            ],
            correct=["b"],
            expl_en="Primary sensors are often larger — better for low light than tiny ultra-wide chips.",
            expl_fr="Le capteur principal est souvent plus grand — meilleur en basse lumière que le mini ultra grand-angle.",
            image=IMG["phone"],
            alt_en="Smartphone photography at night",
            alt_fr="Photo smartphone de nuit",
        ),
        Q(
            "phone-25",
            typ="single",
            difficulty="easy",
            en="Myth: “Portrait mode blur is the same as a fast lens.” Nuance?",
            fr="Mythe : « Le flou Portrait mode = une optique lumineuse. » Nuance ?",
            answers=[
                ("a", "Identical optically in every case", "Identique optiquement dans tous les cas"),
                (
                    "b",
                    "Computational blur can look similar but may smear hair, glasses, or edges",
                    "Le flou calculé peut se ressembler mais peut bavurer cheveux, lunettes ou contours",
                ),
                ("c", "Portrait mode only works underwater", "Le mode Portrait ne marche que sous l’eau"),
                ("d", "Fast lenses cannot blur backgrounds", "Les optiques lumineuses ne floutent pas les fonds"),
            ],
            correct=["b"],
            expl_en="Simulation is useful — check edges before you trust it.",
            expl_fr="La simulation est utile — vérifie les contours avant de faire confiance.",
        ),
        Q(
            "phone-26",
            typ="single",
            difficulty="hard",
            en="You need printable detail of a distant sign. Best phone strategy?",
            fr="Tu as besoin de détail imprimable d’un panneau distant. Meilleure stratégie téléphone ?",
            answers=[
                ("a", "Digital zoom to 20× then crop again", "Zoom numérique ×20 puis recadrer encore"),
                (
                    "b",
                    "Use the optical / high-quality tele module if available, brace, and shoot a burst",
                    "Utiliser le télé optique / haute qualité s’il existe, se stabiliser, et shooter en rafale",
                ),
                ("c", "Only use the selfie camera", "Utiliser uniquement la caméra selfie"),
                ("d", "Turn off all stabilization and walk while shooting", "Couper toute stabilisation et marcher en shootant"),
            ],
            correct=["b"],
            expl_en="Optical reach + stability beats heavy digital zoom mush.",
            expl_fr="La portée optique + la stabilité battent un zoom numérique poussé.",
        ),
        Q(
            "phone-27",
            typ="single",
            difficulty="hard",
            en="Pro/RAW mode: highlights clip while the preview looked fine. Why?",
            fr="Mode Pro/RAW : les hautes lumières crament alors que l’aperçu semblait bon. Pourquoi ?",
            answers=[
                ("a", "RAW cannot record highlights ever", "Le RAW ne peut jamais enregistrer les hautes lumières"),
                (
                    "b",
                    "The screen often shows a processed preview; expose using the histogram / highlight warnings",
                    "L’écran montre souvent un aperçu traité ; expose avec l’histogramme / alertes hautes lumières",
                ),
                ("c", "Phones ignore ISO in Pro mode", "Les téléphones ignorent l’ISO en mode Pro"),
                ("d", "Only HEIC causes clipping", "Seul le HEIC provoque l’écrêtage"),
            ],
            correct=["b"],
            expl_en="Trust meters and histograms more than a brightened display preview.",
            expl_fr="Fais plus confiance aux mesures et à l’histogramme qu’à un aperçu éclairci.",
        ),
        Q(
            "phone-28",
            typ="single",
            difficulty="medium",
            en="You’re filming a quick reel while walking. Stabilization tip?",
            fr="Tu filmes un reel en marchant. Astuce de stabilisation ?",
            answers=[
                ("a", "Hold the phone at arm’s length fully extended", "Tenir le téléphone bras tendu au maximum"),
                (
                    "b",
                    "Tuck elbows in, walk heel-to-toe, and enable video stabilization / a mild crop mode",
                    "Coudes rentrés, marche talon-orteil, et activer la stab vidéo / un léger recadrage",
                ),
                ("c", "Disable all crop and run", "Désactiver tout recadrage et courir"),
                ("d", "Only shoot upside down", "Shooter uniquement à l’envers"),
            ],
            correct=["b"],
            expl_en="Body mechanics + digital stab beat a shaky outstretched arm.",
            expl_fr="La mécanique du corps + la stab numérique battent un bras tendu tremblant.",
            image=IMG["phone"],
            alt_en="Person filming with a phone",
            alt_fr="Personne filmant avec un téléphone",
        ),
    ],
}


def main() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    by_id = {q["id"]: q for q in data["quizzes"]}
    added = 0
    for quiz_id, questions in NEW.items():
        quiz = by_id[quiz_id]
        existing = {q["id"] for q in quiz["questions"]}
        for q in questions:
            if q["id"] in existing:
                continue
            quiz["questions"].append(q)
            added += 1
            existing.add(q["id"])
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    total = sum(len(q["questions"]) for q in data["quizzes"])
    print(f"Added {added} questions. Total now {total}.")


if __name__ == "__main__":
    main()

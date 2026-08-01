#!/usr/bin/env python3
"""Append playful bilingual questions to public/data/questions.json."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public/data/questions.json"

IMG = {
    "runner": "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=960&q=80",
    "waterfall": "https://images.unsplash.com/photo-1432405972618-c60b0225d3f8?auto=format&fit=crop&w=960&q=80",
    "portrait_sun": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=960&q=80",
    "city_night": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=960&q=80",
    "street": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=960&q=80",
    "phone": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=960&q=80",
    "cafe": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=960&q=80",
    "landscape": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=960&q=80",
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
            "exp-21",
            typ="single",
            difficulty="medium",
            en="Dark concert, dancers moving fast. What’s your first move?",
            fr="Concert sombre, danseurs rapides. Quel est ton premier réflexe ?",
            answers=[
                ("a", "Drop shutter to 1/30 s for more light", "Passer à 1/30 s pour gagner de la lumière"),
                ("b", "Open the aperture and raise ISO as needed", "Ouvrir le diaphragme et monter l’ISO au besoin"),
                ("c", "Close to f/16 for sharpness", "Fermer à f/16 pour la netteté"),
                ("d", "Enable long-exposure fireworks mode", "Activer le mode feux d’artifice longue pose"),
            ],
            correct=["b"],
            expl_en="You need light AND frozen motion. Open up, then lift ISO — don’t start by dragging shutter on dancers.",
            expl_fr="Il faut de la lumière ET figer le mouvement. Ouvre d’abord, puis monte l’ISO — ne commence pas par ralentir l’obturateur.",
            image=IMG["city_night"],
            alt_en="City lights at night",
            alt_fr="Lumières de ville la nuit",
        ),
        Q(
            "exp-22",
            typ="single",
            difficulty="easy",
            en="You want silky water on a waterfall. Which combo fits best?",
            fr="Tu veux une cascade « soyeuse ». Quelle combinaison colle le mieux ?",
            answers=[
                ("a", "1/2000 s + ISO 6400", "1/2000 s + ISO 6400"),
                ("b", "Slow shutter (e.g. 1/4–2 s), low ISO, smaller aperture or ND", "Obturateur lent (ex. 1/4–2 s), ISO bas, diaphragme fermé ou filtre ND"),
                ("c", "Flash only, no shutter change", "Flash seul, sans toucher à l’obturateur"),
                ("d", "f/1.2 wide open in bright sun with no ND", "f/1.2 grand ouvert en plein soleil sans ND"),
            ],
            correct=["b"],
            expl_en="Motion blur needs time. Slow the shutter; control exposure with ISO, aperture, or an ND filter.",
            expl_fr="Le flou de mouvement demande du temps. Ralentis l’obturateur ; gère l’expo avec ISO, diaphragme ou ND.",
            image=IMG["waterfall"],
            alt_en="Waterfall in a forest",
            alt_fr="Cascade dans une forêt",
        ),
        Q(
            "exp-23",
            typ="single",
            difficulty="medium",
            en="Myth or nuance: “Always shoot at ISO 100 for best quality.”",
            fr="Mythe ou nuance : « On doit toujours rester à ISO 100 pour la meilleure qualité. »",
            answers=[
                ("a", "True — any higher ISO ruins the file", "Vrai — monter l’ISO détruit toujours le fichier"),
                ("b", "Mostly a myth: a sharp higher-ISO frame beats a blurry ISO 100 one", "Surtout un mythe : une photo nette à ISO plus haut bat un flou à ISO 100"),
                ("c", "True only for smartphones", "Vrai seulement pour les smartphones"),
                ("d", "ISO doesn’t affect noise at all", "L’ISO n’influence jamais le bruit"),
            ],
            correct=["b"],
            expl_en="Use the lowest ISO that still lets you freeze motion and expose correctly. Blur is worse than mild noise.",
            expl_fr="Prends l’ISO le plus bas qui te laisse encore figer et exposer correctement. Le flou est pire qu’un peu de bruit.",
        ),
    ],
    "composition": [
        Q(
            "comp-21",
            typ="single",
            difficulty="easy",
            en="A runner fills the whole frame edge-to-edge with no breathing room. What’s the quickest composition fix?",
            fr="Un coureur colle aux bords du cadre, sans air. Quelle correction de cadrage est la plus rapide ?",
            answers=[
                ("a", "Add a little space in the direction of movement", "Laisser un peu d’espace dans le sens du mouvement"),
                ("b", "Always center the head on a grid intersection", "Toujours centrer la tête sur une intersection"),
                ("c", "Crop tighter until only one shoe remains", "Recadrer jusqu’à ne garder qu’une chaussure"),
                ("d", "Tilt 45° so the horizon becomes diagonal by force", "Incliner à 45° pour forcer une diagonale"),
            ],
            correct=["a"],
            expl_en="Active space (lead room) lets the subject “move into” the frame and feels less cramped.",
            expl_fr="L’espace actif (lead room) laisse le sujet « avancer » dans le cadre et évite l’effet étouffé.",
            image=IMG["runner"],
            alt_en="Runner in motion",
            alt_fr="Coureur en mouvement",
        ),
        Q(
            "comp-22",
            typ="single",
            difficulty="medium",
            en="You’re shooting a busy street. How do you make one person read as the hero?",
            fr="Rue bondée : comment faire d’une personne le héros de l’image ?",
            answers=[
                ("a", "Include every face equally so nobody feels left out", "Mettre tous les visages à égalité pour personne ne soit exclu"),
                ("b", "Isolate with light, focus, color contrast, or framing", "Isoler par la lumière, la MAP, le contraste de couleur ou le cadrage"),
                ("c", "Use the widest lens and stand as far as possible", "Prendre le plus grand-angle et s’éloigner au maximum"),
                ("d", "Turn on HDR and hope contrast sorts it out", "Activer le HDR et espérer que le contraste trie"),
            ],
            correct=["b"],
            expl_en="Heroes need separation: brighter light, sharper focus, complementary color, or a natural frame.",
            expl_fr="Un héros a besoin de séparation : lumière, netteté, couleur complémentaire ou cadre naturel.",
            image=IMG["street"],
            alt_en="Busy city street",
            alt_fr="Rue de ville animée",
        ),
        Q(
            "comp-23",
            typ="multiple",
            difficulty="easy",
            en="Which moves often make a snapshot feel more intentional?",
            fr="Quels gestes rendent souvent un cliché plus intentionnel ?",
            answers=[
                ("a", "Get closer / simplify the background", "Se rapprocher / simplifier l’arrière-plan"),
                ("b", "Level the horizon (unless you tilt on purpose)", "Remettre l’horizon droit (sauf inclinaison voulue)"),
                ("c", "Leave a distracting exit sign dead-center forever", "Garder un panneau de sortie pile au centre pour toujours"),
                ("d", "Wait half a second for a cleaner gesture", "Attendre une demi-seconde pour un geste plus propre"),
            ],
            correct=["a", "b", "d"],
            expl_en="Intention = choices. Closer, cleaner, level, and timed beats “spray and pray”.",
            expl_fr="L’intention, ce sont des choix. Plus près, plus propre, droit et bien cadencé battent le mode rafale aveugle.",
        ),
    ],
    "light-color": [
        Q(
            "light-21",
            typ="single",
            difficulty="medium",
            en="Harsh noon sun, portrait outdoors. Best first rescue?",
            fr="Soleil de midi cruel, portrait outdoor. Premier sauvetage ?",
            answers=[
                ("a", "Shoot into open shade or bounce/fill the face", "Passer à l’ombre ouverte ou déboucher le visage"),
                ("b", "Underexpose 3 stops and lift shadows later only", "Sous-exposer de 3 IL et ne rattraper qu’en post"),
                ("c", "Use a red gel on camera for “cinema”", "Mettre un gélatine rouge « cinéma » sur l’appareil"),
                ("d", "Raise ISO to 12800 in bright sun", "Monter à ISO 12800 en plein soleil"),
            ],
            correct=["a"],
            expl_en="Open shade or fill light softens raccoon eyes. Fighting hard sun with ISO alone won’t fix contrast.",
            expl_fr="Ombre ouverte ou lumière d’appoint adoucit les ombres dures. Monter l’ISO ne règle pas le contraste.",
            image=IMG["portrait_sun"],
            alt_en="Portrait in daylight",
            alt_fr="Portrait en lumière du jour",
        ),
        Q(
            "light-22",
            typ="single",
            difficulty="easy",
            en="Indoor tungsten + daylight from a window in the same frame. What often looks “wrong”?",
            fr="Tungstène indoor + fenêtre en lumière du jour dans le même cadre. Qu’est-ce qui cloche souvent ?",
            answers=[
                ("a", "Mixed white balance / color casts fighting each other", "Balances des blancs mixtes / dominantes qui se battent"),
                ("b", "The lens automatically becomes a fisheye", "L’objectif devient automatiquement un fisheye"),
                ("c", "ISO locks at 50 forever", "L’ISO se bloque à 50 pour toujours"),
                ("d", "Focus can only work on infinity", "La MAP ne fonctionne qu’à l’infini"),
            ],
            correct=["a"],
            expl_en="Two color temperatures in one shot create orange/blue fights. Pick a hero light or gel/correct one source.",
            expl_fr="Deux températures de couleur = guerre orange/bleu. Choisis une lumière dominante ou corrige/gélatine une source.",
        ),
        Q(
            "light-23",
            typ="single",
            difficulty="medium",
            en="“Golden hour is the only good light.” What’s the fairest take?",
            fr="« Seule la golden hour est une bonne lumière. » Quelle lecture est la plus juste ?",
            answers=[
                ("a", "True — avoid every other time of day", "Vrai — éviter toutes les autres heures"),
                ("b", "False: blue hour, overcast, and controlled artificial light can be fantastic", "Faux : blue hour, ciel couvert et lumière artificielle maîtrisée peuvent être superbes"),
                ("c", "True only for smartphones", "Vrai seulement pour les smartphones"),
                ("d", "True only in black and white", "Vrai seulement en noir et blanc"),
            ],
            correct=["b"],
            expl_en="Golden hour is lovely, not exclusive. Soft overcast is a portrait gift; night neon can sing.",
            expl_fr="La golden hour est délicieuse, pas exclusive. Le ciel couvert est un cadeau portrait ; le néon de nuit peut chanter.",
        ),
    ],
    "gear-lenses": [
        Q(
            "gear-21",
            typ="single",
            difficulty="easy",
            en="You want a flattering casual portrait with creamy background. First lens instinct?",
            fr="Portrait décontracté flatteur avec arrière-plan crémeux. Premier réflexe optique ?",
            answers=[
                ("a", "Ultra-wide 16 mm glued to the nose", "Ultra grand-angle 16 mm collé au nez"),
                ("b", "Short tele / classic portrait range (≈85 mm full-frame equivalent) with a wider aperture", "Petit télé / plage portrait (≈85 mm équiv. FF) avec une belle ouverture"),
                ("c", "Fish-eye for maximum cheek distortion", "Fisheye pour maximiser la déformation des joues"),
                ("d", "Kit lens at f/22 from across the street", "Kit à f/22 depuis l’autre trottoir"),
            ],
            correct=["b"],
            expl_en="Mild tele compression + wider aperture separates the subject without cartoon faces.",
            expl_fr="Une légère compression télé + grande ouverture détache le sujet sans déformer le visage.",
        ),
        Q(
            "gear-22",
            typ="single",
            difficulty="medium",
            en="Myth: “A 50 mm lens sees exactly like the human eye.”",
            fr="Mythe : « Un 50 mm voit exactement comme l’œil humain. »",
            answers=[
                ("a", "Literally true on every camera format", "Littéralement vrai sur tous les formats"),
                ("b", "A useful slogan, not physics — FOV depends on sensor size and viewing context", "Slogan utile, pas de la physique — le champ dépend du capteur et du contexte de visionnage"),
                ("c", "True only underwater", "Vrai seulement sous l’eau"),
                ("d", "True only at night", "Vrai seulement la nuit"),
            ],
            correct=["b"],
            expl_en="50 mm on full-frame feels “natural” to many, but eyes don’t crop a fixed rectangle like a camera.",
            expl_fr="Le 50 mm en plein format paraît « naturel » à beaucoup, mais l’œil ne cadre pas un rectangle fixe comme un appareil.",
        ),
        Q(
            "gear-23",
            typ="multiple",
            difficulty="easy",
            en="You’re packing light for travel landscapes. What’s actually useful?",
            fr="Sac léger, paysages en voyage. Qu’est-ce qui sert vraiment ?",
            answers=[
                ("a", "A stable way to support the camera (tripod/mini/beanbag)", "Un appui stable (trépied / mini / beanbag)"),
                ("b", "A cloth to clean the front element", "Un chiffon pour nettoyer la lentille frontale"),
                ("c", "Twelve unused flash triggers “just in case”", "Douze déclencheurs flash inutilisés « au cas où »"),
                ("d", "A polarizer or ND if you chase skies / long exposures", "Un polarisant ou ND si tu chasses ciels / poses longues"),
            ],
            correct=["a", "b", "d"],
            expl_en="Stability, cleanliness, and one filter beat a suitcase of “maybe someday” gadgets.",
            expl_fr="Stabilité, propreté et un filtre battent une valise de gadgets « un jour peut-être ».",
            image=IMG["landscape"],
            alt_en="Mountain landscape",
            alt_fr="Paysage de montagne",
        ),
    ],
    "history-icons": [
        Q(
            "hist-21",
            typ="single",
            difficulty="easy",
            en="“The decisive moment” is most closely tied to which idea?",
            fr="« L’instant décisif » renvoie surtout à quelle idée ?",
            answers=[
                ("a", "Waiting for peak gesture/geometry, then clicking once with intent", "Attendre le pic de geste/géométrie, puis déclencher avec intention"),
                ("b", "Shooting 2,000 frames and picking later in Lightroom only", "Shooter 2 000 vues et choisir seulement plus tard dans Lightroom"),
                ("c", "Always using flash outdoors at noon", "Toujours utiliser le flash outdoor à midi"),
                ("d", "Never looking through the viewfinder", "Ne jamais regarder dans le viseur"),
            ],
            correct=["a"],
            expl_en="Cartier-Bresson’s phrase is about timing and seeing — not spray-and-pray.",
            expl_fr="La formule de Cartier-Bresson parle de timing et de regard — pas de rafale aveugle.",
        ),
        Q(
            "hist-22",
            typ="single",
            difficulty="medium",
            en="Why do people still argue about Doisneau’s famous kiss photo?",
            fr="Pourquoi discute-t-on encore de la célèbre photo du baiser de Doisneau ?",
            answers=[
                ("a", "Because it was shot on a smartphone", "Parce qu’elle a été prise au smartphone"),
                ("b", "Because staging vs candid authenticity raises ethics and legend questions", "Parce que mise en scène vs spontanéité pose des questions d’éthique et de légende"),
                ("c", "Because it has no horizon line", "Parce qu’elle n’a pas de ligne d’horizon"),
                ("d", "Because ISO 100 was illegal in France then", "Parce que l’ISO 100 était illégal en France à l’époque"),
            ],
            correct=["b"],
            expl_en="The image is iconic — and a reminder that “documentary” photos can be directed.",
            expl_fr="L’image est iconique — et rappelle qu’une photo « documentaire » peut être dirigée.",
        ),
        Q(
            "hist-23",
            typ="single",
            difficulty="easy",
            en="Ansel Adams is especially associated with…",
            fr="Ansel Adams est surtout associé à…",
            answers=[
                ("a", "Party selfies with disposable cameras", "Selfies de soirée en jetable"),
                ("b", "Meticulous landscape craft, tonal control, and print mastery", "Un artisanat paysage méticuleux, le contrôle des tons et la maîtrise du tirage"),
                ("c", "Inventing autofocus", "L’invention de l’autofocus"),
                ("d", "Only shooting in automatic green mode", "Ne shooter qu’en mode vert automatique"),
            ],
            correct=["b"],
            expl_en="Adams = patient landscape seeing + obsessive control of tones from capture to print.",
            expl_fr="Adams = regard paysage patient + contrôle obsessionnel des tons, de la prise de vue au tirage.",
        ),
    ],
    "genres": [
        Q(
            "gen-21",
            typ="single",
            difficulty="easy",
            en="Street photography at its best usually feels like…",
            fr="La photo de rue réussie donne surtout l’impression de…",
            answers=[
                ("a", "A staged fashion set with three assistants", "Un shooting mode avec trois assistants"),
                ("b", "Catching a fleeting real-life geometry or gesture in public", "Saisir une géométrie ou un geste fugace dans l’espace public"),
                ("c", "Only photographing your own reflection forever", "Ne photographier que son reflet pour toujours"),
                ("d", "Macro of insects exclusively", "Uniquement de la macro d’insectes"),
            ],
            correct=["b"],
            expl_en="Street thrives on timing and public life — not on a full studio crew.",
            expl_fr="La rue vit du timing et de la vie publique — pas d’une équipe studio complète.",
            image=IMG["street"],
            alt_en="Urban street scene",
            alt_fr="Scène de rue urbaine",
        ),
        Q(
            "gen-22",
            typ="single",
            difficulty="medium",
            en="Night city photography without a tripod: what’s the honest trade-off?",
            fr="Photo de ville de nuit sans trépied : quel compromis honnête ?",
            answers=[
                ("a", "There is no trade-off; night is easy handheld at ISO 100", "Aucun compromis ; la nuit est facile à main levée à ISO 100"),
                ("b", "Higher ISO and/or wider aperture vs more noise or shallower focus", "ISO plus haut et/ou plus grande ouverture vs plus de bruit ou PDC plus courte"),
                ("c", "You must switch to a fish-eye", "Obligation de passer en fisheye"),
                ("d", "Only black-and-white is allowed after 10 p.m.", "Seul le noir et blanc est autorisé après 22 h"),
            ],
            correct=["b"],
            expl_en="No tripod means you buy shutter speed with ISO and aperture — and pay in noise or DOF.",
            expl_fr="Sans trépied, tu achètes de la vitesse avec ISO et ouverture — et tu paies en bruit ou PDC.",
            image=IMG["city_night"],
            alt_en="Night city skyline",
            alt_fr="Skyline de ville la nuit",
        ),
        Q(
            "gen-23",
            typ="multiple",
            difficulty="easy",
            en="Which habits help in candid portrait / lifestyle work?",
            fr="Quelles habitudes aident en portrait candide / lifestyle ?",
            answers=[
                ("a", "Talk less, watch for real micro-gestures", "Parler moins, guetter les micro-gestes vrais"),
                ("b", "Keep backgrounds simple when you can", "Garder des fonds simples quand c’est possible"),
                ("c", "Force a fake laugh for 40 frames straight", "Forcer un faux rire pendant 40 vues d’affilée"),
                ("d", "Use available window light before blasting flash", "Privilégier la fenêtre avant d’exploser le flash"),
            ],
            correct=["a", "b", "d"],
            expl_en="Real moments beat directed grinning marathons — light and background do half the work.",
            expl_fr="Les vrais moments battent le marathon de sourires forcés — lumière et fond font la moitié du travail.",
        ),
    ],
    "smartphone": [
        Q(
            "phone-21",
            typ="single",
            difficulty="medium",
            en="Portrait mode blurs a lamppost “glued” to your subject. Why?",
            fr="Le mode Portrait floute un lampadaire « collé » à ton sujet. Pourquoi ?",
            answers=[
                ("a", "The phone’s depth map mis-segments overlapping edges", "La carte de profondeur segmente mal les contours qui se chevauchent"),
                ("b", "Lampposts are always at infinity in EXIF", "Les lampadaires sont toujours à l’infini dans l’EXIF"),
                ("c", "ISO cannot exceed 200 near metal", "L’ISO ne peut pas dépasser 200 près du métal"),
                ("d", "The polarizer is stuck on", "Le polarisant est resté enclenché"),
            ],
            correct=["a"],
            expl_en="Computational bokeh is a guess. Overlapping edges confuse the depth mask — step aside or move the subject.",
            expl_fr="Le bokeh computationnel est une estimation. Les contours qui se chevauchent trompent le masque — décale-toi ou déplace le sujet.",
            image=IMG["phone"],
            alt_en="Smartphone photography",
            alt_fr="Photo au smartphone",
        ),
        Q(
            "phone-22",
            typ="single",
            difficulty="easy",
            en="For Instagram Stories / Reels (tall 9:16), where should key faces usually sit?",
            fr="Pour Stories / Reels Instagram (9:16 vertical), où placer surtout les visages importants ?",
            answers=[
                ("a", "Dead on the very top edge under the clock UI", "Pile sur le bord haut sous l’UI de l’horloge"),
                ("b", "In the safer middle band, away from UI chrome top and bottom", "Dans la bande centrale plus sûre, loin des UI haut/bas"),
                ("c", "Only in the extreme bottom-left corner forever", "Uniquement dans le coin bas-gauche extrême"),
                ("d", "Upside-down to fight the algorithm", "À l’envers pour tromper l’algo"),
            ],
            correct=["b"],
            expl_en="UI eats the top and bottom. Keep faces in the safe central zone.",
            expl_fr="L’interface mange le haut et le bas. Garde les visages dans la zone centrale sûre.",
        ),
        Q(
            "phone-23",
            typ="single",
            difficulty="easy",
            en="Night mode looks soft because you moved. What’s going on?",
            fr="Le mode Nuit est mou parce que tu as bougé. Que se passe-t-il ?",
            answers=[
                ("a", "The phone stacks several frames; motion breaks alignment", "Le téléphone empile plusieurs vues ; le mouvement casse l’alignement"),
                ("b", "Night mode disables the lens entirely", "Le mode Nuit désactive complètement l’objectif"),
                ("c", "The shutter is stuck at 1/8000 s", "L’obturateur est bloqué à 1/8000 s"),
                ("d", "GPS must be off for sharpness", "Le GPS doit être coupé pour la netteté"),
            ],
            correct=["a"],
            expl_en="Night mode is multi-frame computational photography. Hold still (or brace) while it works.",
            expl_fr="Le mode Nuit est de la photo computationnelle multi-vues. Reste stable le temps du calcul.",
        ),
    ],
    "photo-rights": [
        Q(
            "rights-21",
            typ="single",
            difficulty="medium",
            en="Busy café terrace in France/EU-ish public-private blur. Safest instinct before a commercial ad?",
            fr="Terrasse de café bondée (zone floue public/privé). Réflexe le plus sûr avant une pub commerciale ?",
            answers=[
                ("a", "Publish anything — cafés are always free-for-all", "Publier n’importe quoi — les cafés sont toujours libres de droits"),
                ("b", "Get releases / prefer unrecognizable crowds / ask counsel for commercial use", "Obtenir des autorisations / préférer foules non reconnaissables / se renseigner pour l’usage commercial"),
                ("c", "Just add a sticker emoji over one face", "Coller un emoji sur un seul visage suffit"),
                ("d", "Commercial use is identical to a private family album", "L’usage commercial = album de famille privé"),
            ],
            correct=["b"],
            expl_en="Editorial vs commercial and likeness rights vary — when money is involved, get permission or anonymize.",
            expl_fr="Éditorial vs commercial et droit à l’image varient — dès qu’il y a de l’argent, autorise ou anonymise.",
            image=IMG["cafe"],
            alt_en="Café terrace",
            alt_fr="Terrasse de café",
        ),
        Q(
            "rights-22",
            typ="single",
            difficulty="easy",
            en="A friend asks you to erase their ex from a wedding photo. What’s the ethical core?",
            fr="Un ami te demande d’effacer son/sa ex d’une photo de mariage. Quel est le fond éthique ?",
            answers=[
                ("a", "Always do it secretly and never tell the couple", "Toujours le faire en secret sans le dire aux mariés"),
                ("b", "Be transparent with stakeholders; editing history/people has social weight", "Être transparent avec les concernés ; retoucher l’histoire/les gens a un poids social"),
                ("c", "Refuse all edits forever, including dust spots", "Refuser toute retouche à vie, y compris les poussières"),
                ("d", "Only AI may decide who stays in group photos", "Seule l’IA décide qui reste sur les photos de groupe"),
            ],
            correct=["b"],
            expl_en="Technique is easy; consent and honesty with the people in (and owning) the story matter more.",
            expl_fr="La technique est facile ; le consentement et l’honnêteté envers ceux qui vivent (et portent) l’histoire comptent plus.",
        ),
        Q(
            "rights-23",
            typ="single",
            difficulty="medium",
            en="Someone posts an AI image as a “photograph they took” with no disclosure. Main issue?",
            fr="Quelqu’un publie une image IA comme « une photo qu’il a prise », sans le dire. Problème principal ?",
            answers=[
                ("a", "File size is usually too small", "Le poids du fichier est trop petit"),
                ("b", "Misrepresentation — viewers lose trust about authorship and reality", "Tromperie — le public perd confiance sur l’auteur et le réel"),
                ("c", "AI images cannot contain the color red", "Les images IA ne peuvent pas contenir de rouge"),
                ("d", "There is no issue if the prompt was poetic", "Aucun problème si le prompt était poétique"),
            ],
            correct=["b"],
            expl_en="AI can be art. Passing it off as a captured photograph without saying so breaks trust.",
            expl_fr="L’IA peut être de l’art. La faire passer pour une photo capturée sans le dire casse la confiance.",
        ),
    ],
    "retouching": [
        Q(
            "edit-21",
            typ="single",
            difficulty="easy",
            en="Myth: “RAW means you can fix anything later.”",
            fr="Mythe : « En RAW, on peut tout rattraper après. »",
            answers=[
                ("a", "True — focus, motion blur, and clipped spectra all come back perfectly", "Vrai — MAP, flou de bougé et hautes lumières cramées reviennent parfaitement"),
                ("b", "False — RAW helps exposure/color latitude, not miracles on blur or hard clipping", "Faux — le RAW aide sur la latitude expo/couleur, pas sur le flou ou l’écrêtage dur"),
                ("c", "True only for black-and-white", "Vrai seulement en noir et blanc"),
                ("d", "RAW disables the lens until export", "Le RAW désactive l’objectif jusqu’à l’export"),
            ],
            correct=["b"],
            expl_en="RAW is flexible, not magical. Get focus and shutter right in camera.",
            expl_fr="Le RAW est souple, pas magique. La MAP et l’obturateur se gagnent à la prise de vue.",
        ),
        Q(
            "edit-22",
            typ="single",
            difficulty="medium",
            en="Skin looks plastic after retouching. Likely cause?",
            fr="Peau plastique après retouche. Cause probable ?",
            answers=[
                ("a", "Too much frequency separation / smoothing / clarity extremes", "Trop de frequency separation / lissage / clarté extrême"),
                ("b", "Shooting at f/8 outdoors", "Avoir shooté à f/8 outdoor"),
                ("c", "Using a prime lens", "Avoir utilisé une focale fixe"),
                ("d", "Exporting sRGB for the web", "Exporter en sRGB pour le web"),
            ],
            correct=["a"],
            expl_en="Over-smoothing kills pores and texture. Pull back until skin still looks like skin.",
            expl_fr="Le sur-lissage tue les pores et la texture. Recule jusqu’à ce que la peau reste de la peau.",
            image=IMG["portrait_sun"],
            alt_en="Portrait close-up",
            alt_fr="Portrait en gros plan",
        ),
        Q(
            "edit-23",
            typ="multiple",
            difficulty="easy",
            en="Before sending photos to a client, smart last checks include…",
            fr="Avant d’envoyer des photos à un client, de bons derniers checks incluent…",
            answers=[
                ("a", "Spot dust / sensor spots on skies", "Chercher poussières / taches capteur dans les ciels"),
                ("b", "Confirm crop orientation and spelling on any text overlays", "Vérifier orientation du crop et orthographe des textes"),
                ("c", "Leave temporary rejection stickers on final files", "Laisser les stickers “reject” sur les fichiers finaux"),
                ("d", "Export the right size/color profile for the use case", "Exporter la bonne taille / profil colorimétrique selon l’usage"),
            ],
            correct=["a", "b", "d"],
            expl_en="Ship clean files matched to the destination — not your working rejects.",
            expl_fr="Livre des fichiers propres adaptés à la destination — pas tes rejects de travail.",
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

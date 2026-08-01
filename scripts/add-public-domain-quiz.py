#!/usr/bin/env python3
"""Insert / refresh the public-domain photography quiz in questions.json."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public/data/questions.json"
IMG = "/images/public-domain"


def L(en: str, fr: str) -> dict:
    return {"en": en, "fr": fr}


def Q(
    id: str,
    *,
    difficulty: str,
    en: str,
    fr: str,
    answers: list[tuple[str, str, str]],
    correct: list[str],
    expl_en: str,
    expl_fr: str,
    image: str,
    alt_en: str,
    alt_fr: str,
    credit_en: str,
    credit_fr: str,
    typ: str = "single",
) -> dict:
    return {
        "id": id,
        "type": typ,
        "difficulty": difficulty,
        "text": L(en, fr),
        "answers": [{"id": a, "text": L(en_a, fr_a)} for a, en_a, fr_a in answers],
        "correctAnswers": correct,
        "explanation": L(expl_en, expl_fr),
        "imageUrl": f"{IMG}/{image}",
        "imageAlt": L(alt_en, alt_fr),
        "imageCredit": L(credit_en, credit_fr),
    }


QUIZ = {
    "id": "public-domain",
    "title": L("Public domain gallery", "Galerie domaine public"),
    "description": L(
        "Read historic photographs that are free to reuse — pioneers, documentary icons, and FSA classics.",
        "Lisez des photographies historiques libres de droits — pionniers, icônes documentaires et classiques de la FSA.",
    ),
    "difficulty": "medium",
    "questions": [
        Q(
            "pd-01",
            difficulty="easy",
            en="This is often called the oldest surviving photograph. Who made it?",
            fr="On la présente souvent comme la plus ancienne photo conservée. Qui l’a réalisée ?",
            answers=[
                ("a", "Louis Daguerre", "Louis Daguerre"),
                ("b", "Nicéphore Niépce", "Nicéphore Niépce"),
                ("c", "William Henry Fox Talbot", "William Henry Fox Talbot"),
                ("d", "Eugène Atget", "Eugène Atget"),
            ],
            correct=["b"],
            expl_en="Niépce’s View from the Window at Le Gras (c. 1826–27) is the oldest known surviving photograph.",
            expl_fr="Le Point de vue du Gras de Niépce (vers 1826–27) est la plus ancienne photographie conservée connue.",
            image="niepce-le-gras.jpg",
            alt_en="Grainy rooftop view from a window, very early photograph",
            alt_fr="Vue granuleuse de toits depuis une fenêtre, photo très ancienne",
            credit_en="Nicéphore Niépce — public domain (Wikimedia Commons)",
            credit_fr="Nicéphore Niépce — domaine public (Wikimedia Commons)",
        ),
        Q(
            "pd-02",
            difficulty="medium",
            en="Daguerre’s Boulevard du Temple looks almost empty. Why do we still see a shoe-shine figure?",
            fr="Le Boulevard du Temple de Daguerre paraît presque vide. Pourquoi voit-on encore un cireur ?",
            answers=[
                ("a", "People were erased in the darkroom", "Les passants ont été gommés au tirage"),
                (
                    "b",
                    "The long exposure blurred moving crowds; only someone standing still registered",
                    "La pose longue a flouté la foule en mouvement ; seul quelqu’un d’immobile s’est inscrit",
                ),
                ("c", "Paris was closed that day for a royal parade", "Paris était fermé pour un défilé royal"),
                ("d", "Daguerre used flash to freeze everyone else", "Daguerre a utilisé un flash pour figer les autres"),
            ],
            correct=["b"],
            expl_en="Early daguerreotypes needed minutes of light. Moving people vanished; a still customer remained.",
            expl_fr="Les premiers daguerréotypes demandaient plusieurs minutes. Les passants en mouvement disparaissaient ; un client immobile restait.",
            image="daguerre-boulevard.jpg",
            alt_en="Paris boulevard with a tiny figure getting shoes shined",
            alt_fr="Boulevard parisien avec une petite silhouette chez le cireur",
            credit_en="Louis Daguerre — public domain (Wikimedia Commons)",
            credit_fr="Louis Daguerre — domaine public (Wikimedia Commons)",
        ),
        Q(
            "pd-03",
            difficulty="easy",
            en="Muybridge’s horse sequence famously settled which question?",
            fr="La séquence du cheval de Muybridge a tranché quelle question célèbre ?",
            answers=[
                ("a", "Whether horses dream in color", "Si les chevaux rêvent en couleurs"),
                (
                    "b",
                    "Whether all four hooves leave the ground at a gallop",
                    "Si les quatre sabots quittent le sol au galop",
                ),
                ("c", "Whether horses prefer left turns", "Si les chevaux préfèrent tourner à gauche"),
                ("d", "Whether film is faster than digital", "Si l’argentique est plus rapide que le numérique"),
            ],
            correct=["b"],
            expl_en="The Horse in Motion proved that a galloping horse is fully airborne for a moment.",
            expl_fr="The Horse in Motion a prouvé qu’un cheval au galop est un instant entièrement en l’air.",
            image="muybridge-horse.jpg",
            alt_en="Sequence of a horse and rider galloping",
            alt_fr="Séquence d’un cheval et son cavalier au galop",
            credit_en="Eadweard Muybridge — public domain (Wikimedia Commons)",
            credit_fr="Eadweard Muybridge — domaine public (Wikimedia Commons)",
        ),
        Q(
            "pd-04",
            difficulty="medium",
            en="What research tradition does Marey’s walking figure belong to?",
            fr="À quelle tradition de recherche rattacher la figure marchante de Marey ?",
            answers=[
                ("a", "Fashion editorial posing", "La pose de mode éditoriale"),
                (
                    "b",
                    "Chronophotography — studying motion through timed exposures",
                    "La chronophotographie — étudier le mouvement par poses cadencées",
                ),
                ("c", "Cubist collage", "Le collage cubiste"),
                ("d", "Infrared surveillance", "La surveillance infrarouge"),
            ],
            correct=["b"],
            expl_en="Marey’s chronophotography dissected movement for science — a cousin of cinema.",
            expl_fr="La chronophotographie de Marey découpe le mouvement pour la science — cousine du cinéma.",
            image="marey-motion.jpg",
            alt_en="Multiple overlapping exposures of a man walking",
            alt_fr="Multiples poses superposées d’un homme qui marche",
            credit_en="Étienne-Jules Marey — public domain (Wikimedia Commons)",
            credit_fr="Étienne-Jules Marey — domaine public (Wikimedia Commons)",
        ),
        Q(
            "pd-05",
            difficulty="medium",
            en="Le Gray’s seascape looks impossibly detailed in both sky and water. A likely technique?",
            fr="La marine de Le Gray paraît trop détaillée à la fois dans le ciel et l’eau. Technique probable ?",
            answers=[
                ("a", "Smartphone HDR from 1857", "HDR smartphone dès 1857"),
                (
                    "b",
                    "Combining negatives (or carefully timed exposures) for sky and sea",
                    "Combiner des négatifs (ou des poses adaptées) pour ciel et mer",
                ),
                ("c", "Painting clouds directly on the print only", "Peindre les nuages uniquement sur le tirage"),
                ("d", "Shooting underwater with a glass box", "Shooter sous l’eau dans une boîte de verre"),
            ],
            correct=["b"],
            expl_en="Le Gray was famous for matching a dramatic sky to a properly exposed sea — early compositing craft.",
            expl_fr="Le Gray était célèbre pour marier un ciel dramatique à une mer bien exposée — un assemblage précoce.",
            image="le-gray-sea.jpg",
            alt_en="Dramatic wave and cloudy sky seascape",
            alt_fr="Marine avec vague dramatique et ciel nuageux",
            credit_en="Gustave Le Gray — public domain (Wikimedia Commons)",
            credit_fr="Gustave Le Gray — domaine public (Wikimedia Commons)",
        ),
        Q(
            "pd-06",
            difficulty="easy",
            en="This studio portrait of Baudelaire is by which pioneering French photographer?",
            fr="Ce portrait studio de Baudelaire est de quel photographe français pionnier ?",
            answers=[
                ("a", "Henri Cartier-Bresson", "Henri Cartier-Bresson"),
                ("b", "Nadar", "Nadar"),
                ("c", "Robert Doisneau", "Robert Doisneau"),
                ("d", "Brassaï", "Brassaï"),
            ],
            correct=["b"],
            expl_en="Nadar photographed the literary and artistic elite of 19th-century Paris.",
            expl_fr="Nadar a photographié l’élite littéraire et artistique du Paris du XIXe siècle.",
            image="nadar-portrait.jpg",
            alt_en="Portrait of Charles Baudelaire",
            alt_fr="Portrait de Charles Baudelaire",
            credit_en="Nadar — public domain (Wikimedia Commons)",
            credit_fr="Nadar — domaine public (Wikimedia Commons)",
        ),
        Q(
            "pd-07",
            difficulty="medium",
            en="Cameron’s soft, atmospheric portraits are closest to which aesthetic?",
            fr="Les portraits doux et atmosphériques de Cameron se rapprochent de quelle esthétique ?",
            answers=[
                ("a", "Hard news flash photography", "La photo de presse au flash dur"),
                ("b", "Pictorialism — photography aspiring to painterly feeling", "Le pictorialisme — la photo qui vise l’émotion picturale"),
                ("c", "Satellite mapping", "La cartographie satellite"),
                ("d", "Product packshot lighting", "L’éclairage packshot produit"),
            ],
            correct=["b"],
            expl_en="Julia Margaret Cameron embraced soft focus and allegory — a bridge to pictorialism.",
            expl_fr="Julia Margaret Cameron assume le flou et l’allégorie — un pont vers le pictorialisme.",
            image="cameron-portrait.jpg",
            alt_en="Soft-focus portrait by Julia Margaret Cameron",
            alt_fr="Portrait en flou doux par Julia Margaret Cameron",
            credit_en="Julia Margaret Cameron — public domain (Wikimedia Commons)",
            credit_fr="Julia Margaret Cameron — domaine public (Wikimedia Commons)",
        ),
        Q(
            "pd-08",
            difficulty="easy",
            en="Atget’s shopfronts and streets mainly document what?",
            fr="Les vitrines et rues d’Atget documentent surtout quoi ?",
            answers=[
                ("a", "Hollywood movie sets", "Des décors de cinéma hollywoodiens"),
                ("b", "A vanishing everyday Paris", "Un Paris du quotidien en train de disparaître"),
                ("c", "Royal coronations only", "Uniquement des couronnements royaux"),
                ("d", "Abstract color fields", "Des champs de couleur abstraits"),
            ],
            correct=["b"],
            expl_en="Atget catalogued old Paris — trades, façades, empty streets — before modernization erased them.",
            expl_fr="Atget a inventorié le vieux Paris — métiers, façades, rues vides — avant que la modernisation ne l’efface.",
            image="atget-paris.jpg",
            alt_en="Paris shop windows on Avenue des Gobelins by Atget",
            alt_fr="Vitrines parisiennes avenue des Gobelins par Atget",
            credit_en="Eugène Atget — public domain (Wikimedia Commons)",
            credit_fr="Eugène Atget — domaine public (Wikimedia Commons)",
        ),
        Q(
            "pd-09",
            difficulty="medium",
            en="In Stieglitz’s The Steerage, what should you notice first as a reader of the frame?",
            fr="Dans The Steerage de Stieglitz, que lire d’abord dans le cadre ?",
            answers=[
                ("a", "Only the brand of the ship funnel", "Uniquement la marque de la cheminée"),
                (
                    "b",
                    "Strong geometry separating decks / social spaces",
                    "Une géométrie forte qui sépare ponts / espaces sociaux",
                ),
                ("c", "A neon logo in the corner", "Un logo néon dans le coin"),
                ("d", "Autofocus hunting squares", "Les carrés d’autofocus"),
            ],
            correct=["b"],
            expl_en="The photograph’s power is structural: diagonals, gangways, and class divided by the ship’s architecture.",
            expl_fr="La force de l’image est structurelle : diagonales, passerelles, et classes séparées par l’architecture du navire.",
            image="stieglitz-steerage.jpg",
            alt_en="Passengers on the lower and upper decks of a ship",
            alt_fr="Passagers sur les ponts inférieur et supérieur d’un navire",
            credit_en="Alfred Stieglitz — public domain (Wikimedia Commons)",
            credit_fr="Alfred Stieglitz — domaine public (Wikimedia Commons)",
        ),
        Q(
            "pd-10",
            difficulty="easy",
            en="Lewis Hine photographed child mill workers mainly to…",
            fr="Lewis Hine photographiait surtout les enfants des usines pour…",
            answers=[
                ("a", "Sell fashion lookbooks", "Vendre des lookbooks de mode"),
                ("b", "Document abuse and push social reform", "Documenter les abus et pousser des réformes sociales"),
                ("c", "Train AI models", "Entraîner des modèles d’IA"),
                ("d", "Promote longer factory shifts", "Promouvoir des journées d’usine plus longues"),
            ],
            correct=["b"],
            expl_en="Hine’s National Child Labor Committee work helped change public opinion and law.",
            expl_fr="Le travail de Hine pour le National Child Labor Committee a aidé à faire bouger l’opinion et la loi.",
            image="hine-spinner.jpg",
            alt_en="Young child laborer standing by mill machinery",
            alt_fr="Jeune enfant ouvrier près de machines d’usine",
            credit_en="Lewis Hine — public domain (Wikimedia Commons)",
            credit_fr="Lewis Hine — domaine public (Wikimedia Commons)",
        ),
        Q(
            "pd-11",
            difficulty="easy",
            en="Lange’s Migrant Mother (1936) was made for which U.S. program?",
            fr="Migrant Mother de Lange (1936) a été réalisée dans le cadre de quel programme américain ?",
            answers=[
                ("a", "NASA Apollo publicity", "La communication NASA Apollo"),
                ("b", "Farm Security Administration (FSA) documentation", "La documentation de la Farm Security Administration (FSA)"),
                ("c", "A private perfume campaign", "Une campagne de parfum privée"),
                ("d", "Magnum Photos founding charter", "La charte fondatrice de Magnum Photos"),
            ],
            correct=["b"],
            expl_en="FSA photographs are U.S. federal works — a cornerstone public-domain documentary corpus.",
            expl_fr="Les photos FSA sont des œuvres fédérales US — un corpus documentaire domaine public fondamental.",
            image="lange-migrant-mother.jpg",
            alt_en="Destitute mother with children during the Great Depression",
            alt_fr="Mère démunie avec ses enfants pendant la Grande Dépression",
            credit_en="Dorothea Lange / FSA — U.S. public domain (Wikimedia Commons)",
            credit_fr="Dorothea Lange / FSA — domaine public US (Wikimedia Commons)",
        ),
        Q(
            "pd-12",
            difficulty="medium",
            en="Walker Evans’s frontal sharecropper portraits (like Allie Mae Burroughs) emphasize…",
            fr="Les portraits frontaux de métayers de Walker Evans (comme Allie Mae Burroughs) insistent sur…",
            answers=[
                ("a", "Glamour softboxes and wind machines", "Softbox glamour et machines à vent"),
                (
                    "b",
                    "Direct, sober confrontation — dignity without sentimental posing",
                    "Une confrontation directe et sobre — dignité sans pose sentimentale",
                ),
                ("c", "Heavy Instagram skin smoothing", "Un lissage de peau type Instagram"),
                ("d", "Fish-eye humor", "L’humour fisheye"),
            ],
            correct=["b"],
            expl_en="Evans’s FSA/RA portraits feel almost typological: clear light, level gaze, minimal drama.",
            expl_fr="Les portraits FSA/RA d’Evans sont presque typologiques : lumière claire, regard à hauteur, drame minimal.",
            image="evans-allie-mae.jpg",
            alt_en="Close frontal portrait of Allie Mae Burroughs",
            alt_fr="Portrait frontal serré d’Allie Mae Burroughs",
            credit_en="Walker Evans / FSA — U.S. public domain (Wikimedia Commons)",
            credit_fr="Walker Evans / FSA — domaine public US (Wikimedia Commons)",
        ),
        Q(
            "pd-13",
            difficulty="easy",
            en="This Dust Bowl scene mainly communicates…",
            fr="Cette scène du Dust Bowl communique surtout…",
            answers=[
                ("a", "A beach vacation postcard", "Une carte postale de vacances à la plage"),
                ("b", "Environmental and social crisis through weather and bodies in space", "Une crise environnementale et sociale via le temps et les corps dans l’espace"),
                ("c", "A sports victory parade", "Un défilé de victoire sportive"),
                ("d", "A studio still-life of fruit", "Une nature morte de fruits en studio"),
            ],
            correct=["b"],
            expl_en="FSA photographers turned dust, wind, and displacement into readable public evidence.",
            expl_fr="Les photographes FSA ont transformé poussière, vent et exode en preuves lisibles pour le public.",
            image="dust-bowl-1936.jpg",
            alt_en="Figures walking through a severe dust storm",
            alt_fr="Silhouettes marchant dans une tempête de poussière",
            credit_en="U.S. government / Dust Bowl documentation — public domain (Wikimedia Commons)",
            credit_fr="Gouvernement US / documentation Dust Bowl — domaine public (Wikimedia Commons)",
        ),
        Q(
            "pd-14",
            difficulty="medium",
            en="Gordon Parks’s American Gothic (1942) quotes Grant Wood’s painting. What is the critical twist?",
            fr="American Gothic de Gordon Parks (1942) cite le tableau de Grant Wood. Quelle est la torsion critique ?",
            answers=[
                ("a", "It advertises farm equipment", "Cela publicise du matériel agricole"),
                (
                    "b",
                    "A Black cleaning woman with mop and broom stands in for the iconic farmer couple — race and labor in the capital",
                    "Une femme de ménage noire avec serpillière et balai remplace le couple de fermiers — race et travail dans la capitale",
                ),
                ("c", "It is a selfie on the Eiffel Tower", "C’est un selfie sur la tour Eiffel"),
                ("d", "It removes all tools from the frame", "Cela retire tous les outils du cadre"),
            ],
            correct=["b"],
            expl_en="Parks’s FSA/OWI image retools an American icon to confront segregation and service labor in Washington, D.C.",
            expl_fr="L’image FSA/OWI de Parks recycle une icône américaine pour confronter ségrégation et travail de service à Washington.",
            image="parks-american-gothic.jpg",
            alt_en="Woman with mop and broom before an American flag",
            alt_fr="Femme avec serpillière et balai devant un drapeau américain",
            credit_en="Gordon Parks / FSA-OWI — U.S. public domain (Wikimedia Commons)",
            credit_fr="Gordon Parks / FSA-OWI — domaine public US (Wikimedia Commons)",
        ),
        Q(
            "pd-15",
            difficulty="medium",
            en="Prokudin-Gorsky’s color portraits (like the Emir of Bukhara) were made how?",
            fr="Les portraits couleur de Prokudin-Gorsky (comme l’émir de Boukhara) étaient faits comment ?",
            answers=[
                ("a", "With a modern CMOS phone sensor", "Avec un capteur CMOS de téléphone moderne"),
                (
                    "b",
                    "Three black-and-white exposures through color filters, later combined",
                    "Trois poses noir et blanc à travers des filtres couleur, recombinées ensuite",
                ),
                ("c", "By hand-painting every print only", "En peignant à la main chaque tirage uniquement"),
                ("d", "With Kodachrome mass-produced in 1911 shops", "Avec du Kodachrome en vente libre dès 1911"),
            ],
            correct=["b"],
            expl_en="His three-color separation process yields startling early color of the Russian Empire — now widely public domain via LoC scans.",
            expl_fr="Son procédé trichrome donne des couleurs précoces saisissantes de l’Empire russe — largement en domaine public via les scans LoC.",
            image="prokudin-color.jpg",
            alt_en="Color portrait of the Emir of Bukhara in ornate robes",
            alt_fr="Portrait en couleurs de l’émir de Boukhara en costume orné",
            credit_en="Sergey Prokudin-Gorsky — public domain (Library of Congress / Wikimedia Commons)",
            credit_fr="Sergueï Prokoudine-Gorski — domaine public (Library of Congress / Wikimedia Commons)",
        ),
    ],
}


def main() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    quizzes = data["quizzes"]
    quizzes = [q for q in quizzes if q.get("id") != "public-domain"]
    # Place after history-icons for a natural catalog flow
    insert_at = next(
        (i for i, q in enumerate(quizzes) if q["id"] == "history-icons"), len(quizzes) - 1
    ) + 1
    quizzes.insert(insert_at, QUIZ)
    data["quizzes"] = quizzes
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Quiz public-domain: {len(QUIZ['questions'])} questions. Catalog size: {len(quizzes)}.")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Vague 1.19 P2: densify photo-rights illus + optional short-pack stretch.

- photo-rights: raise illustrated share to ≥60% (prefer existing local Unsplash AVIFs)
- Stretch public-domain / gear-lenses / history-icons by +3 Q each (no 16th pack)
- Refresh SOURCES.md occurrence table; no new AVIF downloads expected
"""

from __future__ import annotations

import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public/data/questions.json"
OUT_DIR = ROOT / "public/images/packs"
SOURCES = OUT_DIR / "SOURCES.md"

CREDIT = {
    "en": "Unsplash — free to use (Unsplash License)",
    "fr": "Unsplash — libre d'utilisation (licence Unsplash)",
}

PD_CREDIT = {
    "lange-migrant-mother.avif": {
        "en": "Dorothea Lange — public domain (U.S. federal / Library of Congress)",
        "fr": "Dorothea Lange — domaine public (fédéral US / Library of Congress)",
    },
    "niepce-le-gras.avif": {
        "en": "Nicéphore Niépce — public domain (Wikimedia Commons)",
        "fr": "Nicéphore Niépce — domaine public (Wikimedia Commons)",
    },
    "muybridge-horse.avif": {
        "en": "Eadweard Muybridge — public domain (Wikimedia Commons)",
        "fr": "Eadweard Muybridge — domaine public (Wikimedia Commons)",
    },
}


def meta(photo_id: str, alt_en: str, alt_fr: str) -> dict:
    return {
        "photo_id": photo_id,
        "imageAlt": {"en": alt_en, "fr": alt_fr},
    }


# Prefer already-mirrored packs/ AVIFs — thematic fit for rights pedagogy.
RIGHTS_ASSIGNMENTS: dict[str, dict] = {
    "rights-8": meta(
        "photo-1521791136064-7986c2920216",
        "Handshake over papers — work-for-hire and client contracts",
        "Poignée de main sur des documents — commande et contrats client",
    ),
    "rights-13": meta(
        "photo-1438761681033-6461ffad8d80",
        "Recognizable private person — dignity and consent before publish",
        "Personne privée reconnaissable — dignité et consentement avant publication",
    ),
    "rights-22": meta(
        "photo-1519741497674-611481863552",
        "Wedding celebration — editing people out has social weight",
        "Célébration de mariage — effacer des personnes a un poids social",
    ),
}


def Q(
    qid: str,
    *,
    typ: str,
    difficulty: str,
    en: str,
    fr: str,
    answers: list[tuple[str, str, str]],
    correct: list[str],
    expl_en: str,
    expl_fr: str,
    image_url: str | None = None,
    alt_en: str | None = None,
    alt_fr: str | None = None,
    credit: dict | None = None,
) -> dict:
    item: dict = {
        "id": qid,
        "type": typ,
        "difficulty": difficulty,
        "text": {"en": en, "fr": fr},
        "answers": [
            {"id": aid, "text": {"en": a_en, "fr": a_fr}} for aid, a_en, a_fr in answers
        ],
        "correctAnswers": correct,
        "explanation": {"en": expl_en, "fr": expl_fr},
    }
    if image_url:
        item["imageUrl"] = image_url
        item["imageAlt"] = {"en": alt_en or "", "fr": alt_fr or ""}
        item["imageCredit"] = dict(credit or CREDIT)
    return item


NEW_PUBLIC_DOMAIN = [
    Q(
        "pd-22",
        typ="single",
        difficulty="medium",
        en="Many FSA / U.S. federal agency photographs are often reusable because…",
        fr="Beaucoup de photos FSA / d’agences fédérales US sont souvent réutilisables parce que…",
        answers=[
            (
                "a",
                "U.S. federal government works are generally not protected by copyright",
                "Les œuvres du gouvernement fédéral US ne sont en général pas protégées par le copyright",
            ),
            (
                "b",
                "Every black-and-white photo older than 10 years is free worldwide",
                "Toute photo N&B de plus de 10 ans est libre partout dans le monde",
            ),
            (
                "c",
                "Instagram always waives rights on historical images",
                "Instagram renonce toujours aux droits sur les images historiques",
            ),
            (
                "d",
                "Only museum gift shops can use them",
                "Seules les boutiques de musées peuvent les utiliser",
            ),
        ],
        correct=["a"],
        expl_en="U.S. federal works are a classic public-domain corpus — still verify the exact file and any later overlays.",
        expl_fr="Les œuvres fédérales US forment un corpus domaine public classique — vérifie quand même le fichier exact et d’éventuelles couches ultérieures.",
        image_url="/images/public-domain/lange-migrant-mother.avif",
        alt_en="Migrant Mother — FSA documentary photograph",
        alt_fr="Migrant Mother — photographie documentaire FSA",
        credit=PD_CREDIT["lange-migrant-mother.avif"],
    ),
    Q(
        "pd-23",
        typ="single",
        difficulty="easy",
        en="Niépce’s View from the Window at Le Gras (c. 1826–27) is usually treated as public domain because…",
        fr="Le Point de vue du Gras de Niépce (v. 1826–27) est en général traité comme domaine public parce que…",
        answers=[
            (
                "a",
                "Copyright terms for that era’s author have long expired",
                "Les délais de protection pour l’auteur de cette époque sont largement expirés",
            ),
            (
                "b",
                "Only RAW files can enter the public domain",
                "Seuls les fichiers RAW entrent dans le domaine public",
            ),
            (
                "c",
                "Any photo of a window is automatically free",
                "Toute photo de fenêtre est automatiquement libre",
            ),
            (
                "d",
                "UNESCO owns exclusive worldwide rights forever",
                "L’UNESCO détient l’exclusivité mondiale à perpétuité",
            ),
        ],
        correct=["a"],
        expl_en="Very old works typically sit in the public domain after long copyright terms — confirm the specific reproduction you use.",
        expl_fr="Les œuvres très anciennes tombent en domaine public après de longs délais — confirme la reproduction précise que tu utilises.",
        image_url="/images/public-domain/niepce-le-gras.avif",
        alt_en="Earliest surviving camera photograph — View from the Window at Le Gras",
        alt_fr="Plus ancienne photo d’appareil conservée — Point de vue du Gras",
        credit=PD_CREDIT["niepce-le-gras.avif"],
    ),
    Q(
        "pd-24",
        typ="single",
        difficulty="hard",
        en="You want to print a public-domain Muybridge plate in a commercial book. Safest habit?",
        fr="Tu veux imprimer une planche Muybridge domaine public dans un livre commercial. Réflexe le plus sûr ?",
        answers=[
            (
                "a",
                "Confirm the scan/source is actually PD (not a modern museum photo with fresh rights)",
                "Vérifier que le scan/source est bien DP (pas une photo musée moderne encore protégée)",
            ),
            (
                "b",
                "Assume Google Images thumbnails prove zero rights forever",
                "Croire que les miniatures Google Images prouvent zéro droit pour toujours",
            ),
            (
                "c",
                "Never credit historical authors once PD",
                "Ne jamais créditer les auteurs historiques une fois en DP",
            ),
            (
                "d",
                "Only publish if you recreate the horse with AI first",
                "Ne publier que si tu recrées d’abord le cheval en IA",
            ),
        ],
        correct=["a"],
        expl_en="The underlying work can be PD while a particular photograph of a print still carries rights — check provenance.",
        expl_fr="L’œuvre sous-jacente peut être DP alors qu’une photo moderne du tirage reste protégée — vérifie la provenance.",
        image_url="/images/public-domain/muybridge-horse.avif",
        alt_en="Muybridge horse locomotion sequence plate",
        alt_fr="Planche de locomotion du cheval de Muybridge",
        credit=PD_CREDIT["muybridge-horse.avif"],
    ),
]

NEW_GEAR = [
    Q(
        "gear-24",
        typ="single",
        difficulty="medium",
        en="You need tack-sharp landscapes on a windy ridgeline. Best first gear instinct?",
        fr="Paysages ultra nets sur une crête venteuse. Premier réflexe matériel ?",
        answers=[
            (
                "a",
                "Stable support + shield the camera from gusts; don’t trust handheld miracles",
                "Appui stable + abriter l’appareil du vent ; ne pas compter sur le miracle à main levée",
            ),
            (
                "b",
                "Only raise ISO to five digits and hope",
                "Seulement monter l’ISO à cinq chiffres et espérer",
            ),
            (
                "c",
                "Always remove the lens hood in wind",
                "Toujours retirer le pare-soleil par grand vent",
            ),
            (
                "d",
                "Disable IBIS and walk while shooting long exposures",
                "Désactiver l’IBIS et marcher pendant les poses longues",
            ),
        ],
        correct=["a"],
        expl_en="Wind shake ruins sharpness faster than most people expect — brace, weight, and shelter the rig.",
        expl_fr="Le vent ruine la netteté plus vite qu’on croit — cale, leste et abrite le setup.",
        image_url="/images/packs/photo-1464822759023-fed622ff2c3b.avif",
        alt_en="Mountain ridge landscape — wind and stability matter",
        alt_fr="Crête de montagne — le vent et la stabilité comptent",
    ),
    Q(
        "gear-25",
        typ="single",
        difficulty="easy",
        en="A “nifty fifty” (≈50 mm full-frame equivalent) is popular mainly because…",
        fr="Le « nifty fifty » (≈50 mm équiv. plein format) est populaire surtout parce que…",
        answers=[
            (
                "a",
                "It’s a versatile normal FOV, often bright and relatively affordable",
                "C’est un champ « normal » polyvalent, souvent lumineux et assez abordable",
            ),
            (
                "b",
                "It always equals a telescope for wildlife",
                "Il égale toujours une longue-vue pour l’animalier",
            ),
            (
                "c",
                "It disables autofocus by design",
                "Il désactive l’autofocus par conception",
            ),
            (
                "d",
                "It only works underwater",
                "Il ne fonctionne que sous l’eau",
            ),
        ],
        correct=["a"],
        expl_en="A fast-ish normal prime teaches seeing without ultra-wide distortion or heavy tele reach.",
        expl_fr="Une focale fixe « normale » un peu lumineuse enseigne le regard sans déformation ultra grand-angle ni portée télé.",
        image_url="/images/packs/photo-1516035069371-29a1b244cc32.avif",
        alt_en="Camera with prime lens — classic normal focal length",
        alt_fr="Appareil avec focale fixe — focale normale classique",
    ),
    Q(
        "gear-26",
        typ="multiple",
        difficulty="medium",
        en="Before a paid event, sensible lens / body checks include…",
        fr="Avant un événement payé, de bons checks optique / boîtier incluent…",
        answers=[
            (
                "a",
                "Clean front elements and confirm cards/batteries",
                "Nettoyer les lentilles frontales et vérifier cartes / batteries",
            ),
            (
                "b",
                "Test AF and a quick exposure on the actual bodies you’ll use",
                "Tester l’AF et une expo rapide sur les boîtiers réellement utilisés",
            ),
            (
                "c",
                "Arrive with zero spare glass and one nearly empty card",
                "Arriver sans optique de secours et une carte presque pleine",
            ),
            (
                "d",
                "Pack a backup body or a known fallback phone workflow",
                "Prévoir un boîtier de secours ou un plan B téléphone connu",
            ),
        ],
        correct=["a", "b", "d"],
        expl_en="Paid work fails on logistics more often than on exotic glass — clean, test, redundancies.",
        expl_fr="Le travail payé échoue plus souvent sur la logistique que sur l’optique exotique — propre, testé, redondant.",
        image_url="/images/packs/photo-1554048612-b6a482bc67e5.avif",
        alt_en="Camera body close-up — pre-event gear checks",
        alt_fr="Gros plan de boîtier — checks matériel avant événement",
    ),
]

NEW_HISTORY = [
    Q(
        "hist-24",
        typ="single",
        difficulty="medium",
        en="Kodak’s Brownie (1900) mattered culturally mainly because it…",
        fr="Le Brownie Kodak (1900) a compté culturellement surtout parce qu’il…",
        answers=[
            (
                "a",
                "Made snapshot photography cheap and accessible to amateurs",
                "A rendu la photo « snapshot » bon marché et accessible aux amateurs",
            ),
            (
                "b",
                "Invented digital sensors overnight",
                "A inventé les capteurs numériques du jour au lendemain",
            ),
            (
                "c",
                "Banned all professional studios",
                "A interdit tous les studios professionnels",
            ),
            (
                "d",
                "Only printed cyanotypes forever",
                "N’a imprimé que des cyanotypes pour toujours",
            ),
        ],
        correct=["a"],
        expl_en="The Brownie wave democratized everyday picture-making — a social shift as much as a tech one.",
        expl_fr="La vague Brownie a démocratisé la photo du quotidien — un basculement social autant que technique.",
        image_url="/images/packs/photo-1554048612-b6a482bc67e5.avif",
        alt_en="Vintage camera — democratization of amateur photography",
        alt_fr="Appareil vintage — démocratisation de la photo amateur",
    ),
    Q(
        "hist-25",
        typ="single",
        difficulty="easy",
        en="Magnum Photos (founded 1947) is best remembered as…",
        fr="Magnum Photos (fondée en 1947) est surtout retenue comme…",
        answers=[
            (
                "a",
                "A cooperative agency where photographers kept rights and editorial voice",
                "Une coopérative où les photographes gardaient droits et voix éditoriale",
            ),
            (
                "b",
                "A camera brand that only sold disposable flash cubes",
                "Une marque d’appareils qui ne vendait que des cubes flash jetables",
            ),
            (
                "c",
                "A film emulsion factory in Rochester only",
                "Une usine d’émulsion uniquement à Rochester",
            ),
            (
                "d",
                "A smartphone filter pack from 2015",
                "Un pack de filtres smartphone de 2015",
            ),
        ],
        correct=["a"],
        expl_en="Magnum’s model centered photographer authorship and ownership — landmark for reportage culture.",
        expl_fr="Le modèle Magnum place l’auteur et la propriété côté photographe — jalon de la culture reportage.",
        image_url="/images/packs/photo-1449824913935-59a10b8d2000.avif",
        alt_en="Street scene — reportage and agency culture",
        alt_fr="Scène de rue — culture reportage et agences",
    ),
    Q(
        "hist-26",
        typ="single",
        difficulty="hard",
        en="When people say digital “killed” film overnight in the 2000s, the fairest nuance is…",
        fr="Quand on dit que le numérique a « tué » l’argentique du jour au lendemain dans les années 2000, la nuance juste est…",
        answers=[
            (
                "a",
                "Adoption was gradual — workflows, cost, and culture shifted over years, not one week",
                "L’adoption a été progressive — workflows, coûts et culture ont basculé sur des années, pas en une semaine",
            ),
            (
                "b",
                "Film ceased to exist physically in 2001 worldwide",
                "L’argentique a cessé d’exister physiquement en 2001 dans le monde entier",
            ),
            (
                "c",
                "Only disposable cameras survived after JPEG was invented",
                "Seuls les appareils jetables ont survécu après l’invention du JPEG",
            ),
            (
                "d",
                "Digital never reached professional newsrooms",
                "Le numérique n’a jamais atteint les rédactions pro",
            ),
        ],
        correct=["a"],
        expl_en="Digital disrupted film markets, but the transition was staggered across genres and budgets.",
        expl_fr="Le numérique a bouleversé les marchés argentiques, mais la transition a été échelonnée selon genres et budgets.",
        image_url="/images/packs/photo-1510127034890-ba27508e9f1c.avif",
        alt_en="Handheld camera outdoors — film-to-digital transition era",
        alt_fr="Appareil à main levée outdoor — ère de transition argentique → numérique",
    ),
]


def shuffle_answer_order(q: dict, rng: random.Random) -> None:
    if q.get("type") != "single":
        return
    answers = list(q["answers"])
    rng.shuffle(answers)
    q["answers"] = answers


def apply_rights_images(data: dict) -> int:
    applied = 0
    for quiz in data["quizzes"]:
        if quiz["id"] != "photo-rights":
            continue
        for q in quiz["questions"]:
            m = RIGHTS_ASSIGNMENTS.get(q["id"])
            if not m or q.get("imageUrl"):
                continue
            pid = m["photo_id"]
            path = OUT_DIR / f"{pid}.avif"
            if not path.exists():
                raise SystemExit(f"missing local AVIF for {q['id']}: {pid}")
            q["imageUrl"] = f"/images/packs/{pid}.avif"
            q["imageAlt"] = dict(m["imageAlt"])
            q["imageCredit"] = dict(CREDIT)
            applied += 1
    return applied


def append_new(data: dict, quiz_id: str, new_qs: list[dict], rng: random.Random) -> int:
    quiz = next(q for q in data["quizzes"] if q["id"] == quiz_id)
    existing = {q["id"] for q in quiz["questions"]}
    added = 0
    for q in new_qs:
        if q["id"] in existing:
            continue
        shuffle_answer_order(q, rng)
        quiz["questions"].append(q)
        added += 1
    return added


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
    lines.append("Vague 1.18 P3: `python3 scripts/vague-118-p3-illus.py`")
    lines.append("Vague 1.19 P2: `python3 scripts/vague-119-p2-content.py`")
    lines.append("")
    SOURCES.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    rng = random.Random(11902)
    data = json.loads(DATA.read_text(encoding="utf-8"))

    rights_applied = apply_rights_images(data)
    added_pd = append_new(data, "public-domain", NEW_PUBLIC_DOMAIN, rng)
    added_gear = append_new(data, "gear-lenses", NEW_GEAR, rng)
    added_hist = append_new(data, "history-icons", NEW_HISTORY, rng)

    DATA.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    write_sources(data)

    rights = next(q for q in data["quizzes"] if q["id"] == "photo-rights")
    r_ill = sum(1 for q in rights["questions"] if q.get("imageUrl"))
    r_n = len(rights["questions"])
    r_pct = r_ill / r_n

    total_q = sum(len(q["questions"]) for q in data["quizzes"])
    total_ill = sum(
        1 for quiz in data["quizzes"] for q in quiz["questions"] if q.get("imageUrl")
    )

    print(f"photo-rights illus: {r_ill}/{r_n} ({100 * r_pct:.1f}%)  applied={rights_applied}")
    print(f"added public-domain={added_pd} gear-lenses={added_gear} history-icons={added_hist}")
    print(f"TOTAL Q={total_q} illus={total_ill} ({100 * total_ill / total_q:.1f}%)")

    if r_pct < 0.60:
        raise SystemExit(f"photo-rights illustrated {r_pct:.0%} < 60%")

    for qid, min_n in (
        ("public-domain", 24),
        ("gear-lenses", 26),
        ("history-icons", 26),
    ):
        quiz = next(q for q in data["quizzes"] if q["id"] == qid)
        if len(quiz["questions"]) < min_n:
            raise SystemExit(f"{qid} length {len(quiz['questions'])} < {min_n}")

    print("P2 content acceptance OK")


if __name__ == "__main__":
    main()

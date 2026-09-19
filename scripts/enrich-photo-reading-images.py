#!/usr/bin/env python3
"""P1.3: enrich composition / light-color / smartphone with illustrated questions.

Adds Unsplash images (existing app pattern) with FR/EN alts + licence credits
so the photo-reading pool is less skewed toward public-domain history shots.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public/data/questions.json"

U = "https://images.unsplash.com/{id}?auto=format&fit=crop&w=960&q=80"

CREDIT = {
    "en": "Unsplash — free to use (Unsplash License)",
    "fr": "Unsplash — libre d'utilisation (licence Unsplash)",
}


def img(photo_id: str, alt_en: str, alt_fr: str) -> dict:
    return {
        "imageUrl": U.format(id=photo_id),
        "imageAlt": {"en": alt_en, "fr": alt_fr},
        "imageCredit": dict(CREDIT),
    }


# Target ~12 illustrated questions per quiz (plan: 8–12 each).
ENRICH: dict[str, dict[str, dict]] = {
    "composition": {
        # was 9 → 12
        "comp-5": img(
            "photo-1464822759023-fed622ff2c3b",
            "Mountain range with a clear horizon line",
            "Chaîne de montagnes avec une ligne d’horizon nette",
        ),
        "comp-6": img(
            "photo-1441974231531-c6227db76b6e",
            "Forest path curving through trees",
            "Sentier forestier en courbe entre les arbres",
        ),
        "comp-9": img(
            "photo-1493863641943-9b68992a8d07",
            "Subject framed by a doorway arch",
            "Sujet cadré par l’arche d’une porte",
        ),
    },
    "light-color": {
        # was 5 → 12
        "light-5": img(
            "photo-1495616811223-4d98c6e9c869",
            "Warm sunset light over water",
            "Lumière chaude de coucher de soleil sur l’eau",
        ),
        "light-6": img(
            "photo-1418065460487-3e41a6c84dc5",
            "Soft overcast light on a misty landscape",
            "Lumière douce de ciel couvert sur un paysage brumeux",
        ),
        "light-8": img(
            "photo-1542038784456-1ea8e935640e",
            "Studio lighting gear and camera",
            "Matériel d’éclairage studio et appareil photo",
        ),
        "light-11": img(
            "photo-1492691527719-9d1e07e534b4",
            "Outdoor portrait in directional daylight",
            "Portrait en extérieur sous lumière directionnelle",
        ),
        "light-14": img(
            "photo-1501594907352-04cda38ebc29",
            "Twilight blue sky over mountains",
            "Ciel bleu d’heure bleue au-dessus des montagnes",
        ),
        "light-18": img(
            "photo-1502082553048-f009c37129b9",
            "Dramatic side-lit portrait silhouette",
            "Portrait en silhouette à éclairage latéral dramatique",
        ),
        "light-20": img(
            "photo-1470252649378-9c29740c9fa8",
            "High-contrast sunrise through trees",
            "Lever de soleil à fort contraste à travers les arbres",
        ),
    },
    "smartphone": {
        # was 7 → 12
        "phone-5": img(
            "photo-1598327105666-5b89351aff97",
            "Smartphone camera close-up",
            "Gros plan sur l’appareil photo d’un smartphone",
        ),
        "phone-6": img(
            "photo-1526170375885-4d8ecf77b99f",
            "Camera lens with shallow depth of field",
            "Objectif photo avec faible profondeur de champ",
        ),
        "phone-7": img(
            "photo-1500534314209-a25ddb2bd429",
            "Bright sky and dark foreground landscape",
            "Paysage avec ciel lumineux et premier plan sombre",
        ),
        "phone-9": img(
            "photo-1580910051074-3eb694886505",
            "Hands holding a smartphone steady",
            "Mains tenant un smartphone bien stable",
        ),
        "phone-11": img(
            "photo-1611162616305-c69b3fa7fbe0",
            "Person photographing outdoors with a phone",
            "Personne photographiant en extérieur avec un téléphone",
        ),
    },
}


def main() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    added = 0
    credited = 0

    for quiz in data["quizzes"]:
        enrich = ENRICH.get(quiz["id"])
        if not enrich:
            continue
        for q in quiz["questions"]:
            patch = enrich.get(q["id"])
            if patch and not q.get("imageUrl"):
                q.update(patch)
                added += 1
            elif q.get("imageUrl") and not q.get("imageCredit"):
                # Backfill licence line on existing Unsplash illustrations in these quizzes.
                if "unsplash.com" in q["imageUrl"]:
                    q["imageCredit"] = dict(CREDIT)
                    credited += 1
                if q.get("imageAlt") and not q["imageAlt"].get("en"):
                    pass  # keep existing alts

    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Summary counts
    for quiz in data["quizzes"]:
        if quiz["id"] not in ENRICH:
            continue
        n = sum(1 for q in quiz["questions"] if q.get("imageUrl"))
        print(f"{quiz['id']}: {n} illustrated")
    print(f"added={added} credited={credited}")


if __name__ == "__main__":
    main()

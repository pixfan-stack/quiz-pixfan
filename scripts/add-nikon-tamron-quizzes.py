#!/usr/bin/env python3
"""Vague 1.106 / QP-294 — merge Nikon + Tamron histoire packs (FR/EN/ES/DE)."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public/data/questions.json"
SRC = Path(
    "/Users/antonybarroux/Library/Application Support/Cursor/"
    "AgentStores/cursor_agent_stores/bc-455ad4b3-e601-4ac5-b49b-537e341638d1/"
    "files/internal/quiz-nikon-tamron"
)

PACKS = (
    {
        "id": "nikon-histoire",
        "prefix": "nikon",
        "stem": "quiz_nikon_histoire",
        "difficulty": "medium",
        "title": {
            "fr": "Histoire de Nikon",
            "en": "Nikon history",
            "es": "Historia de Nikon",
            "de": "Nikon-Geschichte",
        },
        "description": {
            "fr": "Nippon Kogaku, monture F, boîtiers iconiques et optiques NIKKOR — 67 questions culture photo.",
            "en": "Nippon Kogaku, F-mount, iconic bodies and NIKKOR optics — 67 culture questions.",
            "es": "Nippon Kogaku, montura F, cuerpos icónicos y ópticas NIKKOR — 67 preguntas de cultura.",
            "de": "Nippon Kogaku, F-Bajonett, ikonische Gehäuse und NIKKOR-Optiken — 67 Kulturfragen.",
        },
    },
    {
        "id": "tamron-histoire",
        "prefix": "tamron",
        "stem": "quiz_tamron_histoire",
        "difficulty": "medium",
        "title": {
            "fr": "Histoire de Tamron",
            "en": "Tamron history",
            "es": "Historia de Tamron",
            "de": "Tamron-Geschichte",
        },
        "description": {
            "fr": "Taishin Kōki, T-Mount, Adaptall et zooms Tamron — 25 questions sur l’opticien indépendant.",
            "en": "Taishin Kōki, T-Mount, Adaptall and Tamron zooms — 25 questions on the independent optic brand.",
            "es": "Taishin Kōki, T-Mount, Adaptall y zooms Tamron — 25 preguntas sobre el óptico independiente.",
            "de": "Taishin Kōki, T-Mount, Adaptall und Tamron-Zooms — 25 Fragen zur unabhängigen Optikmarke.",
        },
    },
)

LANG_SUFFIX = {"fr": "", "en": ".en", "es": ".es", "de": ".de"}
DIFF_CYCLE = ("easy", "medium", "medium", "hard", "medium")


def load_locale(stem: str, lang: str) -> dict:
    path = SRC / f"{stem}{LANG_SUFFIX[lang]}.json"
    return json.loads(path.read_text(encoding="utf-8"))


def difficulty_for(index: int) -> str:
    return DIFF_CYCLE[index % len(DIFF_CYCLE)]


def convert_question(
    fr: dict, en: dict, es: dict, de: dict, *, prefix: str, index: int
) -> dict:
    qid = f"{prefix}-{index:02d}"
    correct = fr["answer"].lower()
    answers = []
    for choice_fr, choice_en, choice_es, choice_de in zip(
        fr["choices"], en["choices"], es["choices"], de["choices"]
    ):
        assert choice_fr["key"] == choice_en["key"] == choice_es["key"] == choice_de["key"]
        answers.append(
            {
                "id": choice_fr["key"].lower(),
                "text": {
                    "fr": choice_fr["text"],
                    "en": choice_en["text"],
                    "es": choice_es["text"],
                    "de": choice_de["text"],
                },
            }
        )
    # Rotate so the correct choice is not always in the same display slot.
    rotate = (index * 3) % len(answers)
    answers = answers[rotate:] + answers[:rotate]
    return {
        "id": qid,
        "type": "single",
        "text": {
            "fr": fr["question"],
            "en": en["question"],
            "es": es["question"],
            "de": de["question"],
        },
        "answers": answers,
        "correctAnswers": [correct],
        "explanation": {
            "fr": fr["explanation"],
            "en": en["explanation"],
            "es": es["explanation"],
            "de": de["explanation"],
        },
        "difficulty": difficulty_for(index - 1),
    }


def build_pack(meta: dict) -> dict:
    locales = {lang: load_locale(meta["stem"], lang) for lang in LANG_SUFFIX}
    n = len(locales["fr"]["questions"])
    for lang, pack in locales.items():
        if len(pack["questions"]) != n:
            raise SystemExit(
                f"{meta['id']}: {lang} has {len(pack['questions'])} Q, expected {n}"
            )
    questions = []
    for i in range(n):
        fr = locales["fr"]["questions"][i]
        en = locales["en"]["questions"][i]
        es = locales["es"]["questions"][i]
        de = locales["de"]["questions"][i]
        if not (
            fr["answer"] == en["answer"] == es["answer"] == de["answer"]
        ):
            raise SystemExit(f"{meta['id']} Q{i+1}: answer key mismatch across locales")
        questions.append(
            convert_question(
                fr, en, es, de, prefix=meta["prefix"], index=i + 1
            )
        )
    return {
        "id": meta["id"],
        "title": meta["title"],
        "description": meta["description"],
        "difficulty": meta["difficulty"],
        "questions": questions,
    }


def patch_sitemap(pack_ids: list[str]) -> None:
    sitemap = ROOT / "public/sitemap.xml"
    text = sitemap.read_text(encoding="utf-8")
    lastmod = "2026-11-16"
    for pack_id in pack_ids:
        loc = f"https://quiz.pixfan.fr/s/{pack_id}"
        if loc in text:
            continue
        block = (
            f"  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <lastmod>{lastmod}</lastmod>\n"
            f"  </url>\n"
        )
        # Insert after marques-photo / before flash-studio if present, else before </urlset>
        anchor = "https://quiz.pixfan.fr/s/lexique-image-fixe"
        idx = text.find(anchor)
        if idx == -1:
            text = text.replace("</urlset>", block + "</urlset>")
        else:
            # find end of that url block
            end = text.find("</url>", idx) + len("</url>\n")
            text = text[:end] + block + text[end:]
    sitemap.write_text(text, encoding="utf-8")


def main() -> None:
    if not SRC.is_dir():
        raise SystemExit(f"missing sources: {SRC}")
    data = json.loads(DATA.read_text(encoding="utf-8"))
    existing = {q["id"] for q in data["quizzes"]}
    added = []
    for meta in PACKS:
        if meta["id"] in existing:
            print(f"skip existing {meta['id']}")
            continue
        pack = build_pack(meta)
        data["quizzes"].append(pack)
        added.append(meta["id"])
        print(f"added {meta['id']} · {len(pack['questions'])} Q")
    DATA.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    if added:
        patch_sitemap(added)
    total = sum(len(q["questions"]) for q in data["quizzes"])
    hard = sum(
        1
        for q in data["quizzes"]
        for x in q["questions"]
        if x.get("difficulty") == "hard"
    )
    print(
        f"catalog {len(data['quizzes'])} quizzes · {total} Q · hard {hard} ({hard/total:.3f})"
    )


if __name__ == "__main__":
    main()

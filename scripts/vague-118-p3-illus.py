#!/usr/bin/env python3
"""Vague 1.18 P3.1: illustration pass #2 for under-illustrated packs.

Raise exposure-basics / genres / light-color / gear-lenses to ≥55% illustrated
(ideal ~60%). Prefer existing local Unsplash AVIF mirrors; download only if missing.
Refresh SOURCES.md + sw.js IMAGE_URLS (bump image cache only when new AVIFs land).
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
    "exposure-basics": {
        "exp-5": meta(
            "photo-1464822759023-fed622ff2c3b",
            "Mountain ridges with deep focus — stopping down for more depth of field",
            "Crêtes de montagne nettes — fermer le diaphragme pour plus de profondeur de champ",
        ),
        "exp-7": meta(
            "photo-1500530855697-b586d89ba3ee",
            "Moody dark landscape — underexposure crushed shadows",
            "Paysage sombre d’ambiance — sous-exposition qui écrase les ombres",
        ),
        "exp-11": meta(
            "photo-1493246507139-91e8fad9978e",
            "Bright daylight vista — ND filter territory for longer exposures",
            "Vue en plein jour — terrain filtre ND pour allonger l’exposition",
        ),
        "exp-18": meta(
            "photo-1495616811223-4d98c6e9c869",
            "Bright reflective water at sunset — exposure compensation judgment",
            "Eau réfléchissante au coucher de soleil — jugement de compensation d’exposition",
        ),
        "exp-19": meta(
            "photo-1470252649378-9c29740c9fa8",
            "High-contrast sunrise through trees — classic bracketing scene",
            "Lever de soleil à fort contraste à travers les arbres — scène de bracketing classique",
        ),
    },
    "genres": {
        "gen-7": meta(
            "photo-1552674605-db6ffd4facb5",
            "Athlete in motion — sports photography timing and shutter craft",
            "Athlète en mouvement — timing et vitesse d’obturation en photo sport",
        ),
        "gen-11": meta(
            "photo-1515886657613-9f3515b0c78f",
            "Styled fashion pose — editorial fashion photography focus",
            "Pose mode stylisée — focus photo de mode éditoriale",
        ),
        "gen-12": meta(
            "photo-1452421822248-d4c2b47f0c81",
            "Built environment lines — architectural photography geometry",
            "Lignes du bâti — géométrie de la photo d’architecture",
        ),
        "gen-19": meta(
            "photo-1500534314209-a25ddb2bd429",
            "Elevated landscape overlook — drone / aerial photography viewpoint",
            "Vue surélevée sur un paysage — point de vue drone / aérien",
        ),
        "gen-28": meta(
            "photo-1514565131-fce0801e5785",
            "Tall city verticals at night — architecture interior/exterior lean control",
            "Verticales urbaines la nuit — contrôle des fuyantes en architecture",
        ),
    },
    "light-color": {
        "light-9": meta(
            "photo-1499750310107-5fef28a66643",
            "Laptop on a desk — color grading in post territory",
            "Portable sur un bureau — terrain étalonnage / color grading en post",
        ),
        "light-22": meta(
            "photo-1554118811-1e0d58224f24",
            "Warm indoor cafe light mixed with cooler ambience — mixed WB challenge",
            "Lumière chaude de café mixée à une ambiance plus froide — défi balance des blancs",
        ),
    },
    "gear-lenses": {
        "gear-7": meta(
            "photo-1510127034890-ba27508e9f1c",
            "Handheld camera outdoors — image stabilization vs shutter speed",
            "Appareil tenu à main levée — stabilisation vs vitesse d’obturation",
        ),
        "gear-11": meta(
            "photo-1554048612-b6a482bc67e5",
            "Modern camera body close-up — mirrorless vs DSLR ergonomics",
            "Boîtier moderne en gros plan — ergonomie mirrorless vs reflex",
        ),
    },
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
    lines.append("P4 enrich: `python3 scripts/p4-content-depth.py`")
    lines.append("Vague 1.18 P3: `python3 scripts/vague-118-p3-illus.py`")
    lines.append("")
    SOURCES.write_text("\n".join(lines), encoding="utf-8")


def update_sw_image_urls(*, bump_image_cache: bool) -> None:
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
    if bump_image_cache and "quiz-pixfan-images-v6" in new_text:
        new_text = new_text.replace(
            "const IMAGE_CACHE_NAME = 'quiz-pixfan-images-v6';",
            "const IMAGE_CACHE_NAME = 'quiz-pixfan-images-v7';",
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


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    data = json.loads(DATA.read_text(encoding="utf-8"))
    quizzes = {q["id"]: q for q in data["quizzes"]}

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

    tmp = ROOT / ".tmp-vague118-p3-images"
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
    update_sw_image_urls(bump_image_cache=downloaded > 0)

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

    targets = {
        "exposure-basics": 0.55,
        "genres": 0.55,
        "light-color": 0.55,
        "gear-lenses": 0.55,
    }
    for qid, min_pct in targets.items():
        quiz = quizzes[qid]
        ill = sum(1 for q in quiz["questions"] if q.get("imageUrl"))
        pct = ill / len(quiz["questions"])
        if pct < min_pct:
            raise SystemExit(f"{qid} illustrated {pct:.0%} < {min_pct:.0%}")

    print("P3.1 acceptance OK (≥55% on four packs)")


if __name__ == "__main__":
    main()

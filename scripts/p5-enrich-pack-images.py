#!/usr/bin/env python3
"""P5-B: enrich image-poor packs with local Unsplash AVIF mirrors.

Downloads ~10–12 new Unsplash photos, converts to AVIF (same pipeline as
mirror-unsplash-images.py), assigns them + reuses existing /images/packs/
assets so technical packs reach ~8–10 illustrated questions.
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


# Assignments: question id → photo (download if missing on disk).
ASSIGNMENTS: dict[str, dict[str, dict]] = {
    "lightroom-workflow": {
        "lr-01": meta(
            "photo-1517694712202-14dd9538aa97",
            "Laptop open on a desk for a catalog / Develop session",
            "Ordinateur portable ouvert — session catalogue / Développement",
        ),
        "lr-02": meta(
            "photo-1555949963-aa79dcee981c",
            "Colorful UI panels suggesting non-destructive edit recipes",
            "Panneaux UI colorés évoquant des recettes non destructives",
        ),
        "lr-03": meta(
            "photo-1460925895917-afdab827c52f",
            "Laptop dashboard — first Develop checks after import",
            "Tableau de bord — premiers contrôles Développement après import",
        ),
        "lr-05": meta(
            "photo-1454165804606-c3d57bc86b40",
            "Notebook and documents — collections vs disk folders",
            "Carnet et documents — collections vs dossiers sur le disque",
        ),
        "lr-07": meta(
            "photo-1558655146-d09347e92766",
            "Design tools and swatches — profiles vs presets",
            "Outils de design et nuanciers — profils vs préréglages",
        ),
        "lr-08": meta(
            "photo-1498050108023-c5249f4df085",
            "Laptop on a desk — syncing a shared Develop look",
            "Portable sur un bureau — synchroniser un look Développement",
        ),
        "lr-12": meta(
            "photo-1555949963-ff9fe0c870eb",
            "Ordered workspace — client delivery QA checklist vibe",
            "Espace de travail ordonné — QA avant livraison client",
        ),
        "lr-15": meta(
            "photo-1419242902214-272b3f66ee7a",
            "Night sky with stars — denoise before sharpening",
            "Ciel nocturne étoilé — débruitage avant netteté",
        ),
        "lr-16": meta(
            "photo-1500530855697-b586d89ba3ee",
            "Moody colored landscape — Color Grading atmosphere",
            "Paysage aux couleurs d’ambiance — Color Grading",
        ),
        "lr-18": meta(
            "photo-1486312338219-ce68d2c6f44d",
            "Hands on a laptop — healthy long-term catalog habits",
            "Mains sur un portable — bonnes habitudes de catalogue",
        ),
    },
    "retouching": {
        "edit-3": meta(
            "photo-1516035069371-29a1b244cc32",
            "Camera body — white balance starts at capture",
            "Boîtier photo — la balance des blancs commence à la prise de vue",
        ),
        "edit-4": meta(
            "photo-1515378791036-0648a3ef77b2",
            "Typing on a laptop — non-destructive editing habits",
            "Frappe sur un portable — habitudes de retouche non destructive",
        ),
        "edit-6": meta(
            "photo-1500534314209-a25ddb2bd429",
            "Landscape scene ready for a thoughtful crop",
            "Paysage prêt pour un recadrage réfléchi",
        ),
        "edit-8": meta(
            "photo-1472214103451-9374bd1c798e",
            "Detailed landscape texture for output sharpening",
            "Texture de paysage détaillée pour la netteté de sortie",
        ),
        "edit-9": meta(
            "photo-1506905925346-21bda4d32df4",
            "Mountain light and shadow — dodge and burn metaphor",
            "Lumière et ombre en montagne — métaphore dodge & burn",
        ),
        "edit-11": meta(
            "photo-1556656793-08538906a9f8",
            "Smartphone screen — sRGB delivery for the web",
            "Écran de smartphone — livraison sRGB pour le web",
        ),
        "edit-15": meta(
            "photo-1492691527719-9d1e07e534b4",
            "Outdoor portrait for ethical skin retouch judgment",
            "Portrait en extérieur pour juger une retouche peau éthique",
        ),
        "edit-16": meta(
            "photo-1611162616305-c69b3fa7fbe0",
            "Social app icon — export sizing for Instagram",
            "Icône d’app sociale — export pour Instagram",
        ),
        "edit-18": meta(
            "photo-1561070791-2526d30994b5",
            "Bold graphic design — signs of over-processing",
            "Design graphique saturé — signes de sur-traitement",
        ),
        "edit-20": meta(
            "photo-1499750310107-5fef28a66643",
            "Laptop and coffee — final checks before client delivery",
            "Portable et café — dernières vérifs avant livraison",
        ),
    },
    "gear-lenses": {
        "gear-5": meta(
            "photo-1452587925148-ce544e77e70d",
            "Camera with filter thread — circular polarizer territory",
            "Appareil avec pas de filtre — terrain du polarisant circulaire",
        ),
        "gear-7": meta(
            "photo-1493863641943-9b68992a8d07",
            "Photographer at work — image stabilization in real use",
            "Photographe au travail — stabilisation en situation réelle",
        ),
        "gear-8": meta(
            "photo-1534528741775-53994a69daeb",
            "Portrait subject — short-tele portrait lens territory",
            "Sujet en portrait — courtes focales portrait",
        ),
        "gear-10": meta(
            "photo-1510127034890-ba27508e9f1c",
            "Camera body detail hinting at megapixels",
            "Détail de boîtier évoquant les mégapixels",
        ),
        "gear-15": meta(
            "photo-1526170375885-4d8ecf77b99f",
            "Prime lens with shallow depth of field",
            "Objectif fixe avec faible profondeur de champ",
        ),
        "gear-17": meta(
            "photo-1501785888041-af3ef285b470",
            "Mountain vista — tripod-friendly landscape scene",
            "Vue de montagne — scène paysage idéale au trépied",
        ),
        "gear-19": meta(
            "photo-1554048612-b6a482bc67e5",
            "Classic camera — fast lens / low-light shooting",
            "Appareil classique — optique lumineuse / basse lumière",
        ),
        "gear-21": meta(
            "photo-1542038784456-1ea8e935640e",
            "Studio lights and camera — flattering portrait setup",
            "Éclairages studio et appareil — setup portrait flatteur",
        ),
        "gear-11": meta(
            "photo-1531297484001-80022131f5a1",
            "Modern laptop/tech — mirrorless vs DSLR compactness vibe",
            "Tech moderne — compacité façon hybride vs reflex",
        ),
        "gear-20": meta(
            "photo-1464822759023-fed622ff2c3b",
            "Mountain range — landscape accessories in the field",
            "Chaîne de montagnes — accessoires paysage sur le terrain",
        ),
    },
    "history-icons": {
        "hist-5": meta(
            "photo-1554048612-b6a482bc67e5",
            "Vintage camera — icons of photographic history",
            "Appareil vintage — icônes de l’histoire photo",
        ),
        "hist-15": meta(
            "photo-1611162616305-c69b3fa7fbe0",
            "Social media icon — Instagram’s impact on photography",
            "Icône de réseau social — impact d’Instagram sur la photo",
        ),
        "hist-21": meta(
            "photo-1449824913935-59a10b8d2000",
            "Street scene — decisive-moment street photography",
            "Scène de rue — photo street du moment décisif",
        ),
        "hist-23": meta(
            "photo-1469474968028-56623f02e42e",
            "Dramatic landscape — Adams-style tonal drama",
            "Paysage dramatique — contraste tonal façon Adams",
        ),
    },
    "photo-rights": {
        "rights-4": meta(
            "photo-1534528741775-53994a69daeb",
            "Recognizable face — model-release territory",
            "Visage reconnaissable — terrain du model release",
        ),
        "rights-5": meta(
            "photo-1556656793-08538906a9f8",
            "Phone screen — don’t steal Instagram photos",
            "Écran de téléphone — ne volez pas les photos Instagram",
        ),
        "rights-11": meta(
            "photo-1450101499163-c8848c66ca85",
            "Contract papers — check stock licenses before client work",
            "Documents contractuels — vérifier les licences stock",
        ),
        "rights-14": meta(
            "photo-1521791136064-7986c2920216",
            "Handshake — credit lines and professional agreements",
            "Poignée de main — crédits et accords professionnels",
        ),
        "rights-17": meta(
            "photo-1454165804606-c3d57bc86b40",
            "Documents on a desk — credit lines and usage notes",
            "Documents sur un bureau — crédits et mentions d’usage",
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
    if "quiz-pixfan-v8" in new_text:
        new_text = new_text.replace(
            "const CACHE_NAME = 'quiz-pixfan-v8';",
            "const CACHE_NAME = 'quiz-pixfan-v9';",
        )
    if "quiz-pixfan-images-v2" in new_text:
        new_text = new_text.replace(
            "const IMAGE_CACHE_NAME = 'quiz-pixfan-images-v2';",
            "const IMAGE_CACHE_NAME = 'quiz-pixfan-images-v3';",
        )
    SW.write_text(new_text, encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    data = json.loads(DATA.read_text(encoding="utf-8"))

    needed: set[str] = set()
    for pack in ASSIGNMENTS.values():
        for m in pack.values():
            needed.add(m["photo_id"])

    existing = {p.stem for p in OUT_DIR.glob("*.avif")}
    to_fetch = sorted(needed - existing)
    print(f"unique_needed={len(needed)} already_local={len(needed & existing)} to_download={len(to_fetch)}")

    tmp = ROOT / ".tmp-p5-images"
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

    print("\nPack illustrated counts:")
    for quiz in data["quizzes"]:
        if quiz["id"] in ASSIGNMENTS:
            n = sum(1 for q in quiz["questions"] if q.get("imageUrl"))
            print(f"  {quiz['id']}: {n}/{len(quiz['questions'])}")

    print(
        f"\ndownloaded_new={downloaded} assigned={applied} "
        f"skipped={skipped} failed={failed}"
    )
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

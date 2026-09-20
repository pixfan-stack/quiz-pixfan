#!/usr/bin/env python3
"""P2: mirror Unsplash quiz illustrations into public/images/packs/ as AVIF.

Downloads each unique Unsplash URL referenced by questions.json, converts to
AVIF (same format as public-domain assets), rewrites imageUrl to same-origin
paths so the SW cache-first /images/ strategy can serve photo-reading offline.

Also backfills missing imageCredit lines with the Unsplash License note.
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
SOURCES = OUT_DIR / "SOURCES.md"
USER_AGENT = "QuizPixFanMirror/1.0 (+https://github.com/pixfan-stack/quiz-pixfan)"

CREDIT = {
    "en": "Unsplash — free to use (Unsplash License)",
    "fr": "Unsplash — libre d'utilisation (licence Unsplash)",
}

PHOTO_RE = re.compile(r"/(photo-[a-z0-9-]+)(?:\?|$)", re.I)

# Dead / removed Unsplash IDs → working replacements (same visual theme).
URL_REPLACEMENTS: dict[str, str] = {
    # Removed waterfall; keep long-exposure cascade theme for exp-22 / lr-20
    "https://images.unsplash.com/photo-1432405972618-c60b0225d3f8?auto=format&fit=crop&w=960&q=80":
    "https://images.unsplash.com/photo-1518182170546-07661fd94144?auto=format&fit=crop&w=960&q=80",
}


def photo_id(url: str) -> str | None:
    m = PHOTO_RE.search(url)
    return m.group(1) if m else None


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


def write_sources(rows: list[tuple[str, str, int]]) -> None:
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
        "Dead-URL replacements (see `URL_REPLACEMENTS` in the refresh script):",
        "`photo-1432405972618-c60b0225d3f8` → `photo-1518182170546-07661fd94144`.",
        "",
        "| File | Source photo id | Occurrences in questions.json |",
        "|---|---|---|",
    ]
    for fname, pid, count in sorted(rows):
        lines.append(
            f"| `{fname}` | [`{pid}`](https://images.unsplash.com/{pid}) | {count} |"
        )
    lines.append("")
    lines.append("Refresh: `python3 scripts/mirror-unsplash-images.py`")
    lines.append("")
    SOURCES.write_text("\n".join(lines), encoding="utf-8")


def collect_pack_rows(data: dict) -> list[tuple[str, str, int]]:
    """Build SOURCES rows from local /images/packs/ references (idempotent)."""
    counts: dict[str, int] = {}
    for quiz in data["quizzes"]:
        for q in quiz["questions"]:
            u = q.get("imageUrl") or ""
            if u.startswith("/images/packs/"):
                fname = u.rsplit("/", 1)[-1]
                counts[fname] = counts.get(fname, 0) + 1
    rows: list[tuple[str, str, int]] = []
    for fname, count in counts.items():
        pid = fname.removesuffix(".avif").removesuffix(".webp").removesuffix(".jpg")
        rows.append((fname, pid, count))
    # Also list orphan files on disk
    on_disk = {p.name for p in OUT_DIR.glob("*.avif")}
    for fname in sorted(on_disk - set(counts)):
        pid = fname.removesuffix(".avif")
        rows.append((fname, pid, 0))
    return rows


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    data = json.loads(DATA.read_text(encoding="utf-8"))

    # Apply known dead-URL replacements before mirroring
    for quiz in data["quizzes"]:
        for q in quiz["questions"]:
            u = q.get("imageUrl")
            if u in URL_REPLACEMENTS:
                q["imageUrl"] = URL_REPLACEMENTS[u]

    # Collect unique Unsplash URLs + occurrence counts
    url_counts: dict[str, int] = {}
    for quiz in data["quizzes"]:
        for q in quiz["questions"]:
            u = q.get("imageUrl")
            if u and "unsplash.com" in u:
                url_counts[u] = url_counts.get(u, 0) + 1

    if not url_counts:
        # Already mirrored — still refresh SOURCES + report status.
        write_sources(collect_pack_rows(data))
        still_cross = 0
        local_n = 0
        for quiz in data["quizzes"]:
            for q in quiz["questions"]:
                u = q.get("imageUrl")
                if not u:
                    continue
                if u.startswith("http"):
                    still_cross += 1
                else:
                    local_n += 1
        print(
            "No Unsplash URLs left to download. "
            f"local_illustrated={local_n} remaining_cross_origin={still_cross} "
            f"pack_files={len(list(OUT_DIR.glob('*.avif')))}"
        )
        return

    tmp = ROOT / ".tmp-unsplash-mirror"
    tmp.mkdir(exist_ok=True)

    mirrored: dict[str, str] = {}  # original url -> local path
    failed: list[str] = []

    for i, (url, count) in enumerate(sorted(url_counts.items()), 1):
        pid = photo_id(url)
        if not pid:
            failed.append(url)
            print(f"[{i}/{len(url_counts)}] SKIP (bad id): {url}")
            continue
        avif_name = f"{pid}.avif"
        avif_path = OUT_DIR / avif_name
        local = f"/images/packs/{avif_name}"

        if avif_path.exists() and avif_path.stat().st_size > 0:
            print(f"[{i}/{len(url_counts)}] EXISTS {avif_name}")
        else:
            jpg = tmp / f"{pid}.jpg"
            try:
                print(f"[{i}/{len(url_counts)}] GET {pid} …", flush=True)
                download(url, jpg)
                to_avif(jpg, avif_path)
                print(f"         → {avif_name} ({avif_path.stat().st_size // 1024} KiB)")
            except Exception as exc:  # noqa: BLE001 — report and continue
                failed.append(url)
                print(f"         FAIL {pid}: {exc}")
                if avif_path.exists():
                    avif_path.unlink()
                continue
            finally:
                if jpg.exists():
                    jpg.unlink()

        mirrored[url] = local

    rewritten = 0
    credited = 0
    for quiz in data["quizzes"]:
        for q in quiz["questions"]:
            u = q.get("imageUrl")
            if not u:
                continue
            if u in mirrored:
                q["imageUrl"] = mirrored[u]
                rewritten += 1
            if q.get("imageUrl", "").startswith("/images/packs/") and not q.get(
                "imageCredit"
            ):
                q["imageCredit"] = dict(CREDIT)
                credited += 1

    DATA.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    write_sources(collect_pack_rows(data))

    # Cleanup tmp
    try:
        tmp.rmdir()
    except OSError:
        pass

    still_cross = 0
    local_n = 0
    for quiz in data["quizzes"]:
        for q in quiz["questions"]:
            u = q.get("imageUrl")
            if not u:
                continue
            if u.startswith("http"):
                still_cross += 1
            else:
                local_n += 1

    print(
        f"mirrored_unique={len(mirrored)} rewritten={rewritten} "
        f"credited={credited} failed={len(failed)} "
        f"local_illustrated={local_n} remaining_cross_origin={still_cross}"
    )
    if failed:
        print("FAILED:")
        for u in failed:
            print(" ", u)


if __name__ == "__main__":
    main()

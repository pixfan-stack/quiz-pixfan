#!/usr/bin/env python3
"""Deprecated Chrome path — use scripts/p4-og-theme-cards.mjs (@resvg/resvg-js).

Kept as a pointer so older docs that mention the .py name still resolve.
"""

from __future__ import annotations

import sys


def main() -> None:
    print(
        "Use: node scripts/p4-og-theme-cards.mjs\n"
        "(requires devDependency @resvg/resvg-js)",
        file=sys.stderr,
    )
    raise SystemExit(2)


if __name__ == "__main__":
    main()

# Unsplash mirrored quiz assets

Local AVIF mirrors of Unsplash photos used by illustrated quiz questions.
Purpose: same-origin `/images/` so the service worker can cache-first serve
photo-reading offline (cross-origin Unsplash URLs are skipped by the SW).

## License

All files below are mirrored from [Unsplash](https://unsplash.com) and remain
under the [Unsplash License](https://unsplash.com/license): free to use,
including commercially; no permission required; attribution appreciated but
not mandatory. Do **not** sell unaltered copies of the photos themselves as
stock. Re-check Unsplash if redistributing outside this app.

Original download params: `auto=format&fit=crop&w=960&q=80`, then AVIF encode
(`libaom-av1`, CRF 35) to match `public-domain/` asset style.

Dead-URL replacements (see `URL_REPLACEMENTS` in the refresh script):
`photo-1432405972618-c60b0225d3f8` → `photo-1518182170546-07661fd94144`.

| File | Source photo id | Occurrences in questions.json |
|---|---|---|
| `photo-1418065460487-3e41a6c84dc5.avif` | [`photo-1418065460487-3e41a6c84dc5`](https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5) | 1 |
| `photo-1419242902214-272b3f66ee7a.avif` | [`photo-1419242902214-272b3f66ee7a`](https://images.unsplash.com/photo-1419242902214-272b3f66ee7a) | 1 |
| `photo-1441974231531-c6227db76b6e.avif` | [`photo-1441974231531-c6227db76b6e`](https://images.unsplash.com/photo-1441974231531-c6227db76b6e) | 2 |
| `photo-1449824913935-59a10b8d2000.avif` | [`photo-1449824913935-59a10b8d2000`](https://images.unsplash.com/photo-1449824913935-59a10b8d2000) | 6 |
| `photo-1450101499163-c8848c66ca85.avif` | [`photo-1450101499163-c8848c66ca85`](https://images.unsplash.com/photo-1450101499163-c8848c66ca85) | 1 |
| `photo-1452421822248-d4c2b47f0c81.avif` | [`photo-1452421822248-d4c2b47f0c81`](https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81) | 1 |
| `photo-1452587925148-ce544e77e70d.avif` | [`photo-1452587925148-ce544e77e70d`](https://images.unsplash.com/photo-1452587925148-ce544e77e70d) | 1 |
| `photo-1464822759023-fed622ff2c3b.avif` | [`photo-1464822759023-fed622ff2c3b`](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b) | 1 |
| `photo-1469474968028-56623f02e42e.avif` | [`photo-1469474968028-56623f02e42e`](https://images.unsplash.com/photo-1469474968028-56623f02e42e) | 2 |
| `photo-1470071459604-3b5ec3a7fe05.avif` | [`photo-1470071459604-3b5ec3a7fe05`](https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05) | 2 |
| `photo-1470252649378-9c29740c9fa8.avif` | [`photo-1470252649378-9c29740c9fa8`](https://images.unsplash.com/photo-1470252649378-9c29740c9fa8) | 1 |
| `photo-1472214103451-9374bd1c798e.avif` | [`photo-1472214103451-9374bd1c798e`](https://images.unsplash.com/photo-1472214103451-9374bd1c798e) | 1 |
| `photo-1486312338219-ce68d2c6f44d.avif` | [`photo-1486312338219-ce68d2c6f44d`](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d) | 1 |
| `photo-1492691527719-9d1e07e534b4.avif` | [`photo-1492691527719-9d1e07e534b4`](https://images.unsplash.com/photo-1492691527719-9d1e07e534b4) | 1 |
| `photo-1493246507139-91e8fad9978e.avif` | [`photo-1493246507139-91e8fad9978e`](https://images.unsplash.com/photo-1493246507139-91e8fad9978e) | 1 |
| `photo-1493863641943-9b68992a8d07.avif` | [`photo-1493863641943-9b68992a8d07`](https://images.unsplash.com/photo-1493863641943-9b68992a8d07) | 1 |
| `photo-1495616811223-4d98c6e9c869.avif` | [`photo-1495616811223-4d98c6e9c869`](https://images.unsplash.com/photo-1495616811223-4d98c6e9c869) | 1 |
| `photo-1498050108023-c5249f4df085.avif` | [`photo-1498050108023-c5249f4df085`](https://images.unsplash.com/photo-1498050108023-c5249f4df085) | 1 |
| `photo-1500530855697-b586d89ba3ee.avif` | [`photo-1500530855697-b586d89ba3ee`](https://images.unsplash.com/photo-1500530855697-b586d89ba3ee) | 1 |
| `photo-1500534314209-a25ddb2bd429.avif` | [`photo-1500534314209-a25ddb2bd429`](https://images.unsplash.com/photo-1500534314209-a25ddb2bd429) | 2 |
| `photo-1501594907352-04cda38ebc29.avif` | [`photo-1501594907352-04cda38ebc29`](https://images.unsplash.com/photo-1501594907352-04cda38ebc29) | 1 |
| `photo-1501785888041-af3ef285b470.avif` | [`photo-1501785888041-af3ef285b470`](https://images.unsplash.com/photo-1501785888041-af3ef285b470) | 3 |
| `photo-1502082553048-f009c37129b9.avif` | [`photo-1502082553048-f009c37129b9`](https://images.unsplash.com/photo-1502082553048-f009c37129b9) | 1 |
| `photo-1502920917128-1aa500764cbd.avif` | [`photo-1502920917128-1aa500764cbd`](https://images.unsplash.com/photo-1502920917128-1aa500764cbd) | 2 |
| `photo-1506905925346-21bda4d32df4.avif` | [`photo-1506905925346-21bda4d32df4`](https://images.unsplash.com/photo-1506905925346-21bda4d32df4) | 2 |
| `photo-1510127034890-ba27508e9f1c.avif` | [`photo-1510127034890-ba27508e9f1c`](https://images.unsplash.com/photo-1510127034890-ba27508e9f1c) | 1 |
| `photo-1511707171634-5f897ff02aa9.avif` | [`photo-1511707171634-5f897ff02aa9`](https://images.unsplash.com/photo-1511707171634-5f897ff02aa9) | 1 |
| `photo-1512499617640-c74ae3a79d37.avif` | [`photo-1512499617640-c74ae3a79d37`](https://images.unsplash.com/photo-1512499617640-c74ae3a79d37) | 1 |
| `photo-1512941937669-90a1b58e7e9c.avif` | [`photo-1512941937669-90a1b58e7e9c`](https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c) | 5 |
| `photo-1514565131-fce0801e5785.avif` | [`photo-1514565131-fce0801e5785`](https://images.unsplash.com/photo-1514565131-fce0801e5785) | 1 |
| `photo-1516035069371-29a1b244cc32.avif` | [`photo-1516035069371-29a1b244cc32`](https://images.unsplash.com/photo-1516035069371-29a1b244cc32) | 3 |
| `photo-1518182170546-07661fd94144.avif` | [`photo-1518182170546-07661fd94144`](https://images.unsplash.com/photo-1518182170546-07661fd94144) | 2 |
| `photo-1519501025264-65ba15a82390.avif` | [`photo-1519501025264-65ba15a82390`](https://images.unsplash.com/photo-1519501025264-65ba15a82390) | 2 |
| `photo-1519741497674-611481863552.avif` | [`photo-1519741497674-611481863552`](https://images.unsplash.com/photo-1519741497674-611481863552) | 2 |
| `photo-1521791136064-7986c2920216.avif` | [`photo-1521791136064-7986c2920216`](https://images.unsplash.com/photo-1521791136064-7986c2920216) | 1 |
| `photo-1526170375885-4d8ecf77b99f.avif` | [`photo-1526170375885-4d8ecf77b99f`](https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f) | 1 |
| `photo-1534528741775-53994a69daeb.avif` | [`photo-1534528741775-53994a69daeb`](https://images.unsplash.com/photo-1534528741775-53994a69daeb) | 4 |
| `photo-1542038784456-1ea8e935640e.avif` | [`photo-1542038784456-1ea8e935640e`](https://images.unsplash.com/photo-1542038784456-1ea8e935640e) | 2 |
| `photo-1550745165-9bc0b252726f.avif` | [`photo-1550745165-9bc0b252726f`](https://images.unsplash.com/photo-1550745165-9bc0b252726f) | 1 |
| `photo-1552674605-db6ffd4facb5.avif` | [`photo-1552674605-db6ffd4facb5`](https://images.unsplash.com/photo-1552674605-db6ffd4facb5) | 2 |
| `photo-1554048612-b6a482bc67e5.avif` | [`photo-1554048612-b6a482bc67e5`](https://images.unsplash.com/photo-1554048612-b6a482bc67e5) | 1 |
| `photo-1554118811-1e0d58224f24.avif` | [`photo-1554118811-1e0d58224f24`](https://images.unsplash.com/photo-1554118811-1e0d58224f24) | 2 |
| `photo-1556656793-08538906a9f8.avif` | [`photo-1556656793-08538906a9f8`](https://images.unsplash.com/photo-1556656793-08538906a9f8) | 1 |
| `photo-1580910051074-3eb694886505.avif` | [`photo-1580910051074-3eb694886505`](https://images.unsplash.com/photo-1580910051074-3eb694886505) | 1 |
| `photo-1598327105666-5b89351aff97.avif` | [`photo-1598327105666-5b89351aff97`](https://images.unsplash.com/photo-1598327105666-5b89351aff97) | 1 |
| `photo-1606983340126-99ab4feaa64a.avif` | [`photo-1606983340126-99ab4feaa64a`](https://images.unsplash.com/photo-1606983340126-99ab4feaa64a) | 1 |
| `photo-1611162616305-c69b3fa7fbe0.avif` | [`photo-1611162616305-c69b3fa7fbe0`](https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0) | 1 |
| `photo-1618005182384-a83a8bd57fbe.avif` | [`photo-1618005182384-a83a8bd57fbe`](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe) | 1 |

Refresh: `python3 scripts/mirror-unsplash-images.py`

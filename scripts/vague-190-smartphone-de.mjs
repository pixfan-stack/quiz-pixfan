#!/usr/bin/env node
/**
 * Vague 1.90 — add LocalizedString.de for pack smartphone (230 LS).
 * Idempotent: overwrites de with the canonical scolaire DE copy.
 * Vocab aligns with guides/photo-smartphone article.de
 * (Licht / HDR / Pro-Modus / Nachtmodus / Frontblitz / AE-AF-Sperre)
 * and sharePreview LABELS.de « Smartphone » + guide CTA « Smartphone-Quiz starten ».
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'smartphone');
if (!pack) throw new Error('smartphone not found');

const unsplash = 'Unsplash — freie Nutzung (Unsplash-Lizenz)';
const unsplashShort = 'Foto: Unsplash';

const de = {
  title: 'Smartphone-Fotografie',
  description:
    'Nachtmodus, Computational Photography, Bildaufbau und Retusche am Handy.',
  questions: {
    'phone-1': {
      text: 'Worauf beruht „Computational Photography“ vor allem?',
      answers: {
        b: 'Nur auf größerem optischen Zoom',
        a: 'Auf Software, die mehrere Belichtungen / Einzelbilder kombiniert',
        c: 'Auf dem Abschalten des Autofokus',
        d: 'Auf Aufnahmen ausschließlich in Schwarzweiß',
      },
      explanation:
        'Handys stapeln Einzelbilder, richten sie aus und rekonstruieren Detail / Dynamikumfang mit Algorithmen.',
      imageAlt: 'Smartphone auf einem Schreibtisch',
      imageCredit: unsplash,
    },
    'phone-2': {
      text: 'Warum kann der Nachtmodus unscharf wirken, wenn du das Handy bewegst?',
      answers: {
        d: 'Der Blitz feuert durchgehend',
        b: 'Der Nachtmodus deaktiviert die Bildstabilisierung',
        a: 'Er nutzt eine lange Mehrbild-Aufnahme, die Stabilität braucht',
        c: 'ISO ist auf 50 gesperrt',
      },
      explanation:
        'Der Nachtmodus fusioniert mehrere Einzelbilder über die Zeit; Bewegung dazwischen weicht das Ergebnis auf.',
      imageAlt: 'Handykamera bei Nacht',
      imageCredit: unsplash,
    },
    'phone-3': {
      text: 'Tippen zum Fokussieren setzt bei den meisten Handykameras meist auch…',
      answers: {
        b: 'Den Weißabgleich auf Leuchtstoff',
        c: 'Den optischen Zoom auf 10×',
        d: 'Die Verschlusszeit auf 1/8000 s',
        a: 'Die Belichtung für diesen Bereich',
      },
      explanation:
        'AE/AF-Sperre per Tipp misst und fokussiert typischerweise dort, wo du tippst.',
      imageAlt: 'Person hält ein Smartphone',
      imageCredit: unsplash,
    },
    'phone-4': {
      text: 'Welche Gewohnheiten verbessern Handyfotos in der Regel?',
      answers: {
        d: 'Natürliches Licht bevorzugen, wenn möglich',
        b: 'Mit beiden Händen halten / abstützen',
        a: 'Das Objektiv reinigen',
        c: 'Immer maximalen Digitalzoom nutzen',
      },
      explanation:
        'Saubere Optik, Stabilität und gutes Licht schlagen extremen Digitalzoom.',
      imageAlt: 'Oberfläche der Smartphone-Kamera',
      imageCredit: unsplash,
    },
    'phone-5': {
      text: 'Digitalzoom macht vor allem…',
      answers: {
        d: 'Immer die Schärfe besser',
        a: 'Einen Bildausschnitt (oft mit Qualitätsverlust)',
        c: 'Den Sensor größer',
        b: 'Glas-Elemente wie bei einem SLR-Objektiv bewegen',
      },
      explanation:
        'Echter optischer Zoom ändert die Vergrößerung mit Optik; Digitalzoom schneidet zu / skaliert hoch.',
      imageAlt: 'Nahaufnahme einer Smartphone-Kamera',
      imageCredit: unsplash,
    },
    'phone-6': {
      text: 'Porträt- / „Bokeh“-Modus am Handy erzeugt Unschärfe typischerweise durch…',
      answers: {
        b: 'Immer eine mechanische Blende auf f/1.0 öffnen',
        a: 'Tiefenschätzung + Software-Unschärfe',
        d: 'Erzwungene JPEG-Kompression',
        c: 'Erhitzen des Sensors',
      },
      explanation:
        'Dualkameras / LiDAR / ML segmentieren das Motiv und simulieren geringe Schärfentiefe.',
      imageAlt: 'Kameraobjektiv mit geringer Schärfentiefe',
      imageCredit: unsplash,
    },
    'phone-7': {
      text: 'HDR am Handy ist am nützlichsten, wenn…',
      answers: {
        c: 'Du mehr Bewegungsunschärfe willst',
        a: 'Der Szenenkontrast sehr hoch ist (heller Himmel + dunkler Boden)',
        b: 'Du eine einfarbig graue Wand im Schatten fotografierst',
        d: 'ISO bei 25600 bleiben muss',
      },
      explanation:
        'HDR fusioniert Belichtungen, um Detail in Lichtern und Schatten zu erhalten.',
      imageAlt: 'Landschaft mit hellem Himmel und dunklem Vordergrund',
      imageCredit: unsplash,
    },
    'phone-8': {
      text: 'RAW / Pro-Modus am Handy gibt dir vor allem…',
      answers: {
        b: 'Kleinere Dateien als HEIC/JPEG',
        c: 'Automatische Instagram-Filter',
        a: 'Mehr Flexibilität beim Bearbeiten (Belichtung, WB, Detail)',
        d: 'Garantiert schärferen Autofokus',
      },
      explanation:
        'RAW behält mehr lineare Daten vor der aggressiven Handy-Verarbeitung.',
      imageAlt: 'Handykamera-UI — RAW- / Pro-Modus-Bereich',
      imageCredit: unsplash,
    },
    'phone-9': {
      text: 'Was hilft gegen Verwacklungsunschärfe am Handy?',
      answers: {
        d: 'Maximaler Digitalzoom beim Gehen',
        c: 'Ein kleines Stativ oder Anlehnen an eine Wand',
        a: 'Optische / elektronische Stabilisierung',
        b: 'Kürzere Verschlusszeit (mehr Licht oder höheres ISO)',
      },
      explanation:
        'Stabilisierung, kürzere Belichtungen und Abstützen helfen; Gehen + Zoom schadet.',
      imageAlt: 'Hände halten ein Smartphone ruhig',
      imageCredit: unsplash,
    },
    'phone-10': {
      text: 'Ultraweitwinkel-Objektive am Handy zeigen oft…',
      answers: {
        b: 'Gar keine Perspektivänderung',
        a: 'Stärkere Randverzerrung / gedehnte Ecken',
        d: 'Zwangshaften Blitzeinsatz',
        c: 'Immer weniger Rauschen als die Hauptkamera',
      },
      explanation:
        'Kurze Brennweiten übertreiben die Perspektive; Ränder können verzogen wirken.',
      imageAlt: 'Ultraweitwinkel-Perspektive des Handys dehnt eine Szene',
      imageCredit: unsplash,
    },
    'phone-11': {
      text: 'Für flacheres, gleichmäßigeres Licht auf einem Gesicht im Freien bevorzugst du…',
      answers: {
        c: 'Direkten Blitz als einziges Licht mittags',
        b: 'Hartes Mittagslicht von oben',
        d: 'Gegen eine helle Fensterfläche ohne Belichtungskompensation',
        a: 'Offenen Schatten oder bedeckten Himmel',
      },
      explanation:
        'Weiches, diffuses Licht reduziert harte Schatten im Gesicht.',
      imageAlt: 'Person fotografiert im Freien mit dem Handy',
      imageCredit: unsplash,
    },
    'phone-12': {
      text: 'Live Photos / Bewegungsfotos versteht man am besten als…',
      answers: {
        a: 'Einen kurzen Videoclip um das Standbild herum',
        c: 'Immer ein RAW-DNG',
        b: 'Nur ein Standbild mit mehr Megapixeln',
        d: 'Einen Panorama-Stich',
      },
      explanation:
        'Sie erfassen Momente vor/nach dem Auslösen als Bewegung.',
    },
    'phone-13': {
      text: 'Gitterlinien (Drittelregel) in der Handykamera helfen dir…',
      answers: {
        d: 'Den Nachtmodus zu erzwingen',
        b: 'Die Megapixel zu erhöhen',
        c: 'Den Autofokus abzuschalten',
        a: 'Zu komponieren und Horizonte gerade zu halten',
      },
      explanation:
        'Overlays führen den Bildausschnitt, ohne die Belichtungstechnik zu ändern.',
      imageAlt: 'Handy gehalten für einen sorgfältigen, gitterausgerichteten Rahmen',
      imageCredit: unsplash,
    },
    'phone-14': {
      text: 'Bevor du ein Handyfoto weit teilst, solltest du bedenken…',
      answers: {
        a: 'Ob Standort-Metadaten entfernt werden sollten',
        d: 'Zuschnitt / Exportgröße für die Plattform zu prüfen',
        c: 'Immer nur das unbearbeitete RAW hochzuladen',
        b: 'Ob Gesichter / Privatsphäre Zustimmung brauchen',
      },
      explanation:
        'Privatsphäre und plattformfertige Exporte zählen; reines RAW-Teilen ist selten nötig.',
    },
    'phone-15': {
      text: 'Der Makromodus am Handy funktioniert meist am besten, wenn…',
      answers: {
        b: 'Du 20 Meter entfernt stehst',
        d: 'Du nur nachts ohne Licht fotografierst',
        c: 'Du jeglichen Fokus abschaltest',
        a: 'Du nah rangehst und ruhig hältst (die Schärfentiefe ist winzig)',
      },
      explanation:
        'Nahfokus bedeutet geringe Schärfentiefe; Stabilität und Licht helfen.',
      imageAlt: 'Nahdetail von Essen — Handy-Makro-Gebiet',
      imageCredit: unsplash,
    },
    'phone-16': {
      text: 'Ein häufiger Nachteil starker Schärfung / Rauschreduktion im Handy ist…',
      answers: {
        c: 'Besserer optischer Zoom',
        b: 'Größere Sensoren',
        d: 'Pflicht-RAW-Ausgabe',
        a: 'Plastisch wirkende Haut / verwischtes Feindetail',
      },
      explanation:
        'Aggressive Verarbeitung kann Textur auslöschen und auf kleinen Displays trotzdem „sauber“ wirken.',
    },
    'phone-17': {
      text: 'Beim Video am Handy hilft AE/AF-Sperre, wenn…',
      answers: {
        d: 'Du das Mikrofon abschaltest',
        a: 'Die Helligkeit sonst beim Schwenken pumpen würde',
        b: 'Du willst, dass das Handy jedes Bild zufällig neu fokussiert',
        c: 'Du nur Standbilder machst',
      },
      explanation:
        'Die Sperre stoppt kontinuierliche Messung und Fokusjagd während eines Schwenks.',
    },
    'phone-18': {
      text: 'Nützliche Retusche-Schritte am Handy vor dem Veröffentlichen sind…',
      answers: {
        c: 'Sättigung immer auf Maximum',
        d: 'Ergebnis möglichst auf kalibriertem oder neutralem Display prüfen',
        a: 'Zuschneiden / begradigen',
        b: 'Bescheidene Belichtungs- und Kontrastanpassungen',
      },
      explanation:
        'Dezente Edits und ein sinnvoller Zuschnitt schlagen extreme Filter.',
    },
    'phone-19': {
      text: 'Gegenlicht mit dem Handy braucht oft…',
      answers: {
        b: 'Die Kamera-App auszuschalten',
        d: 'Weißabgleich nur auf Kunstlicht',
        a: 'Belichtungskompensation / HDR / Objektiv vor Flare schützen',
        c: 'Zwanghaften Digitalzoom 10×',
      },
      explanation:
        'Gegenlicht-Szenen brennen Lichter aus; HDR und sorgfältige Belichtung helfen.',
      imageAlt: 'Aufnahme gegen helles Licht — Sonnen- / Flare-Kontrolle am Handy',
      imageCredit: unsplash,
    },
    'phone-20': {
      text: 'Im Vergleich zu einer Kamera mit großem Sensor sind Handysensoren klein, daher bei wenig Licht…',
      answers: {
        b: 'Immer besser als Vollformat ohne Software',
        d: 'Nie Stabilisierung nutzen',
        a: 'Oft stärker auf Mehrbild-Stacking und hohe-ISO-Verarbeitung angewiesen',
        c: 'Keine Farbe aufzeichnen können',
      },
      explanation:
        'Kleine Fotosites sammeln weniger Licht; computergestütztes Stacking gleicht das aus.',
    },
    'phone-21': {
      text: 'Der Porträtmodus unscharf macht einen Laternenpfahl „festgeklebt“ am Motiv. Warum?',
      answers: {
        a: 'Die Tiefenkarte des Handys segmentiert überlappende Kanten falsch',
        c: 'ISO darf in der Nähe von Metall 200 nicht überschreiten',
        b: 'Laternenpfähle stehen im EXIF immer auf Unendlich',
        d: 'Der Polfilter klemmt',
      },
      explanation:
        'Computational Bokeh ist eine Schätzung. Überlappende Kanten verwirren die Tiefenmaske — zur Seite treten oder das Motiv bewegen.',
      imageAlt: 'Smartphone-Fotografie',
      imageCredit: unsplash,
    },
    'phone-22': {
      text: 'Für Instagram Stories / Reels (hoch 9:16) gehören Schlüsselgesichter meist wohin?',
      answers: {
        a: 'Genau an den oberen Rand unter der Uhr-UI',
        b: 'In den sichereren Mittelstreifen, weg vom UI-Chrome oben und unten',
        c: 'Für immer nur in die extreme untere linke Ecke',
        d: 'Kopfüber, um den Algorithmus zu bekämpfen',
      },
      explanation:
        'Die UI frisst oben und unten. Gesichter in der sicheren Mittelzone halten.',
      imageAlt: 'Hoher Handybildschirm — Stories- / Reels-Framing 9:16',
      imageCredit: unsplash,
    },
    'phone-23': {
      text: 'Der Nachtmodus wirkt weich, weil du dich bewegt hast. Was passiert?',
      answers: {
        d: 'GPS muss für Schärfe aus sein',
        a: 'Das Handy stapelt mehrere Einzelbilder; Bewegung bricht die Ausrichtung',
        c: 'Der Verschluss hängt bei 1/8000 s',
        b: 'Der Nachtmodus schaltet das Objektiv komplett ab',
      },
      explanation:
        'Nachtmodus ist Mehrbild-Computational Photography. Stillhalten (oder abstützen), während er arbeitet.',
      imageAlt: 'Stadtlichter bei Nacht — Stabilität im Handy-Nachtmodus',
      imageCredit: unsplash,
    },
    'phone-24': {
      text: 'Stadt bei Nacht: das Handy beharrt auf Ultraweitwinkel. Warum auf 1× wechseln?',
      answers: {
        a: 'Ultraweitwinkel hat immer den besten Sensor',
        b: 'Die Hauptkamera sammelt meist mehr Licht und saubereres Detail',
        c: '1× deaktiviert den Nachtmodus für immer',
        d: 'Ultraweitwinkel kann draußen nicht fokussieren',
      },
      explanation:
        'Hauptsensoren sind oft größer — besser bei wenig Licht als winzige Ultraweitwinkel-Chips.',
      imageAlt: 'Smartphone-Fotografie bei Nacht',
      imageCredit: unsplash,
    },
    'phone-25': {
      text: 'Mythos: „Porträtmodus-Unschärfe ist wie ein lichtstarkes Objektiv.“ Nuance?',
      answers: {
        a: 'Optisch in jedem Fall identisch',
        b: 'Computational Unschärfe kann ähnlich wirken, aber Haare, Brillen oder Kanten verwischen',
        c: 'Porträtmodus funktioniert nur unter Wasser',
        d: 'Lichtstarke Objektive können Hintergründe nicht unscharf machen',
      },
      explanation:
        'Die Simulation ist nützlich — Kanten prüfen, bevor du ihr vertraust.',
      imageAlt: 'Porträt mit weichem Hintergrund — Nuance der Computational Unschärfe',
      imageCredit: unsplash,
    },
    'phone-26': {
      text: 'Du brauchst druckbares Detail eines entfernten Schildes. Beste Handy-Strategie?',
      answers: {
        a: 'Digitalzoom auf 20× und dann nochmals zuschneiden',
        b: 'Optisches / hochwertiges Tele-Modul nutzen falls vorhanden, abstützen und eine Serie schießen',
        c: 'Nur die Selfie-Kamera nutzen',
        d: 'Alle Stabilisierung aus und während des Gehens auslösen',
      },
      explanation:
        'Optische Reichweite + Stabilität schlagen Matsch von aggressivem Digitalzoom.',
    },
    'phone-27': {
      text: 'Pro/RAW-Modus: Lichter clippen, obwohl die Vorschau gut aussah. Warum?',
      answers: {
        a: 'RAW kann Lichter nie aufzeichnen',
        b: 'Der Bildschirm zeigt oft eine verarbeitete Vorschau; belichte mit Histogramm / Lichterwarnungen',
        c: 'Handys ignorieren ISO im Pro-Modus',
        d: 'Nur HEIC verursacht Clipping',
      },
      explanation:
        'Vertraue Messern und Histogrammen mehr als einer aufgehellten Display-Vorschau.',
    },
    'phone-28': {
      text: 'Du filmst einen schnellen Reel beim Gehen. Stabilisierungs-Tipp?',
      answers: {
        a: 'Handy mit vollständig ausgestrecktem Arm halten',
        b: 'Ellbogen anlegen, Ferse-Zehe gehen und Videostabilisierung / milden Crop-Modus aktivieren',
        c: 'Jeden Crop deaktivieren und rennen',
        d: 'Nur kopfüber filmen',
      },
      explanation:
        'Körpermechanik + digitale Stabilisierung schlagen einen wackeligen ausgestreckten Arm.',
      imageAlt: 'Person filmt mit einem Handy',
      imageCredit: unsplash,
    },
    'phone-29': {
      text: 'Nachtmodus stapelt Einzelbilder. Motiv läuft mitten in der Aufnahme. Sauberste Strategie?',
      answers: {
        a: 'Stillhalten lassen, Handy abstützen oder auf schnelleren Pro-/Verschlussmodus wechseln',
        b: 'Handy stärker schütteln, um Bewegung zu „mitteln“',
        d: 'Nachtmodus friert Bewegung immer ein — ignorieren',
        c: 'Immer HDR+Blitz zusammen erzwingen',
      },
      explanation:
        'Mehrbild-Nachtmodi hassen Bewegung. Stillstand oder eine schnellere Einzelbelichtung schlagen Geisterbilder.',
      imageAlt: 'Smartphone bereit zum Auslösen',
      imageCredit: unsplashShort,
    },
    'phone-30': {
      text: 'Ultraweitwinkel-Selfie in einem kleinen Raum verzerrt die Ränder. Klügste optische Wahl?',
      answers: {
        a: 'Bei Ultraweitwinkel bleiben und später zuschneiden — Verzerrung ist gratis',
        c: 'Nur Digitalzoom 10× repariert Gesichter',
        d: 'Beauty-Modus als einzige Lösung einschalten',
        b: 'Zurücktreten und Haupt- (oder 2×-)Objektiv nutzen; Gesichter von Extremrändern fernhalten',
      },
      explanation:
        'Ultraweitwinkel-Dehnung ist Geometrie, kein Hautproblem. Hauptlinse und Distanz bevorzugen.',
    },
    'phone-31': {
      text: 'Welche Gewohnheiten reduzieren den computational „überkochen“-Look moderner Handys?',
      answers: {
        a: 'Bei gutem Licht fotografieren, damit das Handy weniger aggressiv stapelt',
        b: 'RAW/Pro bevorzugen, wenn du natürlichere Tonalität willst',
        c: 'Immer max. HDR + max. Schärfung + max. Kontrast',
        d: 'Sanft editieren; schwere Filter nicht auf bereits verarbeitete JPEGs stapeln',
      },
      explanation:
        'Handys backen Ton und Detail bereits ein. Sauberer starten, dann leicht editieren.',
    },
  },
};

function setDe(ls, value) {
  if (!ls || typeof ls !== 'object') throw new Error('bad LS');
  if (typeof value !== 'string' || !value.trim()) throw new Error('empty de');
  if (value === ls.en) throw new Error(`de must differ from en: ${value.slice(0, 40)}`);
  ls.de = value;
}

setDe(pack.title, de.title);
setDe(pack.description, de.description);

let count = 2;
for (const q of pack.questions) {
  const t = de.questions[q.id];
  if (!t) throw new Error(`missing translation for ${q.id}`);
  setDe(q.text, t.text);
  setDe(q.explanation, t.explanation);
  count += 2;
  if (q.imageAlt) {
    if (!t.imageAlt) throw new Error(`missing imageAlt for ${q.id}`);
    setDe(q.imageAlt, t.imageAlt);
    count += 1;
  }
  if (q.imageCredit) {
    if (!t.imageCredit) throw new Error(`missing imageCredit for ${q.id}`);
    setDe(q.imageCredit, t.imageCredit);
    count += 1;
  }
  for (const a of q.answers) {
    const av = t.answers[a.id];
    if (!av) throw new Error(`missing answer ${q.id}.${a.id}`);
    setDe(a.text, av);
    count += 1;
  }
}

if (count !== 230) throw new Error(`expected 230 LS, got ${count}`);

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`OK: wrote ${count} LocalizedString.de on smartphone`);

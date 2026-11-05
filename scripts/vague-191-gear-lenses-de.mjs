#!/usr/bin/env node
/**
 * Vague 1.91 — add LocalizedString.de for pack gear-lenses (192 LS).
 * Idempotent: overwrites de with the canonical non-scolaire DE copy.
 * Vocab aligns with guides/materiel-photo article.de
 * (Vollformat / APS-C · Brennweite · Festbrennweite · Polfilter · Stabilisierung · Crop)
 * and sharePreview LABELS.de « Ausrüstung & Objektive » + guide CTA « Ausrüstungs- & Objektiv-Quiz starten ».
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'gear-lenses');
if (!pack) throw new Error('gear-lenses not found');

const unsplash = 'Unsplash — freie Nutzung (Unsplash-Lizenz)';

const de = {
  title: 'Ausrüstung & Objektive',
  description:
    'Brennweiten, Sensorformate und Werkzeuge, die Ihren Look prägen.',
  questions: {
    'gear-1': {
      text: 'Am Vollformat nennt man ein 50-mm-Objektiv oft „normal“, weil es…',
      answers: {
        d: 'Nur für Makro von Insekten geeignet ist',
        c: 'Nur in Schwarzweiß fotografieren kann',
        b: 'Immer die größtmögliche Blendenöffnung hat',
        a: 'Ein natürliches Sichtfeld annähert, nah an der menschlichen Wahrnehmung',
      },
      explanation:
        'Etwa 40–58 mm am Vollformat gelten als „normal“: weder stark weitwinklig noch tele. Am APS-C übernimmt oft ein ~35 mm eine ähnliche Rolle.',
      imageAlt: 'Fotoobjektive aufgereiht auf einem Schreibtisch',
      imageCredit: unsplash,
    },
    'gear-2': {
      text: 'Welche Objektive sind am Vollformat typischerweise Weitwinkel?',
      answers: {
        b: '16 mm (Weitwinkel)',
        a: '24 mm (Weitwinkel)',
        d: '35 mm (Standard-Weitwinkel)',
        c: '200 mm (Teleobjektiv)',
      },
      explanation:
        'Weitwinkel liegt ungefähr unter ~35–40 mm am Vollformat. 200 mm ist ein Tele: verdichtet die Perspektive und verengt das Feld.',
      imageAlt: 'Kameragehäuse und Objektiv',
      imageCredit: unsplash,
    },
    'gear-3': {
      text: 'Was ist der Hauptvorteil einer Festbrennweite (Prime)?',
      answers: {
        a: 'Oft lichtstärker (größere maximale Blende), leichter und optisch einfacher',
        b: 'Kann von 10 mm bis 600 mm zoomen',
        d: 'Funktioniert nur unter Wasser',
        c: 'Muss nie scharfstellen',
      },
      explanation:
        'Festbrennweiten tauschen Zoom-Flexibilität gegen optische Qualität, Größe/Gewicht und große Blenden (z. B. f/1.4–f/1.8) — ideal bei wenig Licht und zur Motivisolierung.',
      imageAlt: 'Nahaufnahme einer klassischen Kamera',
      imageCredit: unsplash,
    },
    'gear-4': {
      text: 'Ein APS-C-Sensor ist kleiner als Vollformat. Das bedeutet meist…',
      answers: {
        c: 'Dass ISO nicht mehr existiert',
        a: 'Einen Crop-Faktor (~1,5× oder 1,6×): das effektive Sichtfeld ist bei gleicher Brennweite enger',
        d: 'Dass Fotos immer quadratisch sind',
        b: 'Dass die Kamera keine Objektive nutzen kann',
      },
      explanation:
        'Ein 50 mm am APS-C verhält sich ungefähr wie ein 75–80-mm-Feld am Vollformat. Schärfentiefe und Rauschen ändern sich ebenfalls.',
      imageAlt: 'Fotograf mit Kamera',
      imageCredit: unsplash,
    },
    'gear-5': {
      text: 'Wobei hilft ein zirkularer Polfilter (CPL)?',
      answers: {
        d: 'Den Kamerakku zu laden',
        a: 'Reflexionen auf Glas/Wasser zu reduzieren und blauen Himmel zu vertiefen',
        b: 'Nur künstliche Bokeh-Formen hinzuzufügen',
        c: 'Ein Objektiv überflüssig zu machen',
      },
      explanation:
        'Polfilter schneiden polarisiertes Licht: weniger Glanz auf nichtmetallischen Flächen, reichere Himmel und Blätter. Der Effekt hängt vom Winkel zur Sonne ab.',
      imageAlt: 'Kamera mit Filtergewinde — Gebiet des zirkularen Polfilters',
      imageCredit: unsplash,
    },
    'gear-6': {
      text: 'Womit entspricht die Sensorgröße „Vollformat“?',
      answers: {
        a: 'Dem 35-mm-Filmformat (36×24 mm)',
        b: 'Mittelformatfilm',
        c: 'Sofortbildfilm',
        d: 'Einem Smartphone-Sensor',
      },
      explanation:
        'Vollformat bezeichnet Sensoren mit den Abmessungen des 35-mm-Films (36×24 mm), dem klassischen Standard der professionellen Fotografie.',
    },
    'gear-7': {
      text: 'Wobei hilft „Bildstabilisierung“ vor allem?',
      answers: {
        d: 'Die Brennweite zu ändern',
        a: 'Verwacklungsunschärfe bei längeren Verschlusszeiten zu reduzieren',
        c: 'Die Sensorauflösung zu erhöhen',
        b: 'Die Autofokus-Geschwindigkeit zu verbessern',
      },
      explanation:
        'IS/OSS/VR gleicht kleine Kamerabewegungen aus und ermöglicht schärfere Bilder bei Verschlusszeiten, die 2–5 Blendenstufen länger sind als üblich.',
      imageAlt: 'Kamera aus der Hand im Freien — Stabilisierung vs. Verschlusszeit',
      imageCredit: unsplash,
    },
    'gear-8': {
      text: 'Welche Objektivtypen eignen sich am besten für Porträts?',
      answers: {
        d: '14 mm (Ultraweitwinkel)',
        c: '135 mm (kurzes Tele)',
        a: '85 mm (klassisches Porträtobjektiv)',
        b: '50 mm (lichtstarke Normale)',
      },
      explanation:
        'Kurze Teleobjektive (50–135 mm) verdichten Züge schmeichelnd und geben Arbeitsabstand. Ultraweitwinkel (14 mm) verzieht Gesichter.',
      imageAlt: 'Porträtmotiv — Gebiet kurzer Tele-Porträtobjektive',
      imageCredit: unsplash,
    },
    'gear-9': {
      text: 'Wofür wird ein „Tilt-Shift“-Objektiv genutzt?',
      answers: {
        b: 'Für Unterwasserfotos',
        a: 'Zur Korrektur von Perspektivverzerrung und Steuerung der Fokusebene',
        c: 'Zum Heranzoomen entfernter Motive',
        d: 'Zum automatischen Verfolgen bewegter Motive',
      },
      explanation:
        'Tilt-Shift erlaubt Perspektivkorrektur (Architektur) und kreative Fokussteuerung (Miniatur-Effekt) durch Objektivbewegungen.',
    },
    'gear-10': {
      text: 'Was misst ein „Megapixel“?',
      answers: {
        b: 'Die Lichtstärke des Objektivs',
        c: 'Das Kameragewicht',
        a: 'Die Bildauflösung (eine Million Pixel)',
        d: 'Die Akkulaufzeit',
      },
      explanation:
        'Ein Megapixel entspricht einer Million Pixel. Mehr Megapixel bedeuten höhere Auflösung und größere Abzüge, aber nicht zwingend bessere Bildqualität.',
      imageAlt: 'Detail eines Kameragehäuses, das an Megapixel erinnert',
      imageCredit: unsplash,
    },
    'gear-11': {
      text: 'Welche Vorteile haben spiegellose Kameras gegenüber DSLRs?',
      answers: {
        d: 'Immer längere Akkulaufzeit',
        c: 'Besseres Erlebnis mit elektronischem Sucher',
        b: 'Schnellerer Autofokus mit Augenverfolgung',
        a: 'In der Regel kompakter und leichter',
      },
      explanation:
        'Spiegellose Kameras punkten bei Größe, AF-Innovation und EVF-Funktionen. DSLRs führen oft noch bei der Akkulaufzeit.',
      imageAlt: 'Nahaufnahme eines modernen Gehäuses — Ergonomie spiegellos vs. DSLR',
      imageCredit: unsplash,
    },
    'gear-12': {
      text: 'Wie wird der Modus „Blendenpriorität“ auf den meisten Kameras angegeben?',
      answers: {
        c: 'P (Programm)',
        b: 'M (Manuell)',
        d: 'S oder Tv (Zeitpriorität)',
        a: 'A (Nikon, Sony) oder Av (Canon)',
      },
      explanation:
        'A/Av steht für Blendenpriorität. M ist Manuell, P ist Programm, S/Tv ist Zeitpriorität.',
    },
    'gear-13': {
      text: 'Wogegen schützt die „Wetterversiegelung“ einer Kamera?',
      answers: {
        c: 'Kameradiebstahl',
        a: 'Eindringen von Staub und Feuchtigkeit',
        b: 'Nur extreme Hitze',
        d: 'Digitale Korruption',
      },
      explanation:
        'Wetterversiegelung nutzt Dichtungen und Verschlüsse zum Schutz vor Regen, Staub und Spritzern in schwierigen Umgebungen.',
    },
    'gear-14': {
      text: 'Welche Faktoren bestimmen außer der Blende die Schärfentiefe?',
      answers: {
        d: 'Die Geschwindigkeit der Speicherkarte',
        c: 'Die Sensorgröße',
        a: 'Die Brennweite',
        b: 'Der Abstand zum Motiv',
      },
      explanation:
        'Die Schärfentiefe steuern Blende, Brennweite, Motivabstand und Sensorgröße. Die Kartengeschwindigkeit betrifft Serienbilder, nicht die Optik.',
    },
    'gear-15': {
      text: 'Was ist eine „Festbrennweite“ (Prime)?',
      answers: {
        d: 'Ein Objektiv für den Unterwassereinsatz',
        c: 'Ein wasserdichtes Objektiv',
        a: 'Ein Objektiv mit fester Brennweite, das nicht zoomen kann',
        b: 'Ein Objektiv mit Bildstabilisierung',
      },
      explanation:
        'Festbrennweiten haben eine einzige Brennweite (z. B. 50 mm) und bieten oft bessere Optik, größere Blenden und kleinere Bauweise als Zooms.',
      imageAlt: 'Festbrennweite mit geringer Schärfentiefe',
      imageCredit: unsplash,
    },
    'gear-16': {
      text: 'Was ist der „Objektivbajonett“ (Mount)?',
      answers: {
        b: 'Das Reinigungssystem des Objektivs',
        a: 'Die Verbindungsschnittstelle zwischen Objektiv und Kameragehäuse',
        c: 'Eine Art Objektivfilter',
        d: 'Die Befestigung des Kameragurts',
      },
      explanation:
        'Bajonette (EF, F, E, L usw.) definieren die mechanische und elektronische Kompatibilität zwischen Objektiven und Gehäusen.',
    },
    'gear-17': {
      text: 'Welche Vorteile hat die Nutzung eines Stativs?',
      answers: {
        b: 'Lange Belichtungen ermöglichen',
        a: 'Kamerverwackeln für scharfe Bilder eliminieren',
        c: 'Konsistenten Bildausschnitt bei Panoramen sichern',
        d: 'Die Autofokus-Geschwindigkeit erhöhen',
      },
      explanation:
        'Stative geben Stabilität für Schärfe, lange Belichtungen und präzise Komposition. Sie beeinflussen die Autofokus-Leistung nicht.',
      imageAlt: 'Bergpanorama — Landschaftsszene ideal fürs Stativ',
      imageCredit: unsplash,
    },
    'gear-18': {
      text: 'Was ist der „Crop-Faktor“?',
      answers: {
        d: 'Eine Technik zur Objektivreinigung',
        a: 'Der Multiplikator, der die Vollformat-Brennweite in ein äquivalentes Sichtfeld auf kleineren Sensoren umrechnet',
        b: 'Die Menge an Bild, die in der Nachbearbeitung zugeschnitten wird',
        c: 'Die Auflösungsreduktion der Kamera',
      },
      explanation:
        'APS-C-Sensoren haben typischerweise einen Faktor ~1,5× (Nikon/Sony) oder 1,6× (Canon); ein 50 mm wirkt dann wie 75–80 mm.',
    },
    'gear-19': {
      text: 'Was ist ein „lichtstarkes Objektiv“ (fast lens)?',
      answers: {
        b: 'Ein Objektiv, das schnell scharfstellt',
        c: 'Ein leichtes Objektiv',
        d: 'Ein Objektiv mit schnellem AF-Motor',
        a: 'Ein Objektiv mit großer maximaler Blende (z. B. f/1.4, f/1.8)',
      },
      explanation:
        '„Lichtstark“ meint große Blenden, die mehr Licht lassen, kürzere Verschlusszeiten ermöglichen und bei wenig Licht besser performen.',
      imageAlt: 'Klassische Kamera — lichtstarke Optik / Aufnahmen bei wenig Licht',
      imageCredit: unsplash,
    },
    'gear-20': {
      text: 'Welche Zubehörteile sind für die Landschaftsfotografie essenziell?',
      answers: {
        d: 'Makroobjektiv',
        b: 'Polfilter',
        a: 'Stativ',
        c: 'ND-Filter (Neutraldichte)',
      },
      explanation:
        'Das Stativ ermöglicht scharfe Langzeitbelichtungen, der CPL verbessert Himmel/Reflexionen, ND erlaubt tagsüber lange Zeiten. Makro ist für Nahaufnahmen.',
    },
    'gear-21': {
      text: 'Du willst ein schmeichelhaftes Casual-Porträt mit cremigem Hintergrund. Erster optischer Instinkt?',
      answers: {
        b: 'Kurzes Tele / klassischer Porträtbereich (≈85 mm Vollformat-Äquivalent) mit offenerer Blende',
        a: 'Ultraweitwinkel 16 mm direkt vor der Nase',
        d: 'Kit bei f/22 von der gegenüberliegenden Straßenseite',
        c: 'Fischauge für maximale Wangenverzerrung',
      },
      explanation:
        'Milde Tele-Kompression + offene Blende trennt das Motiv ohne Cartoon-Gesichter.',
      imageAlt: 'Studiolichter und Kamera — schmeichelhaftes Porträt-Setup',
      imageCredit: unsplash,
    },
    'gear-22': {
      text: 'Mythos: „Ein 50-mm-Objektiv sieht genau wie das menschliche Auge.“',
      answers: {
        a: 'Wörtlich wahr auf jedem Kamerformat',
        d: 'Nur nachts wahr',
        b: 'Ein nützlicher Slogan, keine Physik: das Sichtfeld hängt von Sensorgröße und Betrachtungskontext ab',
        c: 'Nur unter Wasser wahr',
      },
      explanation:
        '50 mm am Vollformat wirkt für viele „natürlich“, aber das Auge schneidet kein festes Rechteck wie eine Kamera.',
    },
    'gear-23': {
      text: 'Leichtes Gepäck für Reise-Landschaften. Was ist wirklich nützlich?',
      answers: {
        b: 'Ein Tuch zum Reinigen der Frontlinse',
        c: 'Zwölf ungenutzte Blitzauslöser „für alle Fälle“',
        d: 'Ein Pol- oder ND-Filter, wenn du Himmel / Langzeitbelichtungen jagst',
        a: 'Eine stabile Möglichkeit, die Kamera abzustützen (Stativ / Mini / Beanbag)',
      },
      explanation:
        'Stabilität, Reinigung und ein Filter schlagen einen Koffer voller „irgendwann vielleicht“-Gadgets.',
      imageAlt: 'Berglandschaft',
      imageCredit: unsplash,
    },
    'gear-24': {
      text: 'Du brauchst knackscharfe Landschaften auf einem windigen Grat. Bester erster Ausrüstungs-Instinkt?',
      answers: {
        d: 'IBIS ausschalten und während langer Belichtungen gehen',
        a: 'Stabile Auflage + Kamera vor Böen schützen; nicht auf Wunder aus der Hand vertrauen',
        b: 'ISO nur fünfstellig hochdrehen und hoffen',
        c: 'Bei Wind immer die Streulichtblende abnehmen',
      },
      explanation:
        'Windverwacklung ruinierte Schärfe schneller als die meisten denken: abstützen, beschweren und das Setup schützen.',
      imageAlt: 'Berggrat-Landschaft — Wind und Stabilität zählen',
      imageCredit: unsplash,
    },
    'gear-25': {
      text: 'Ein „Nifty Fifty“ (≈50 mm Vollformat-Äquivalent) ist vor allem beliebt, weil…',
      answers: {
        b: 'Es immer einem Teleskop für Wildtiere entspricht',
        c: 'Es den Autofokus konstruktionsbedingt deaktiviert',
        a: 'Es ein vielseitiges normales Sichtfeld ist, oft lichtstark und relativ erschwinglich',
        d: 'Es nur unter Wasser funktioniert',
      },
      explanation:
        'Eine einigermaßen lichtstarke Normal-Festbrennweite lehrt Sehen ohne Ultraweitwinkel-Verzerrung und ohne schweres Tele-Reichweite.',
      imageAlt: 'Kamera mit Festbrennweite — klassische Normalbrennweite',
      imageCredit: unsplash,
    },
    'gear-26': {
      text: 'Vor einem bezahlten Event gehören zu sinnvollen Objektiv-/Gehäuse-Checks…',
      answers: {
        a: 'Frontlinsen reinigen und Karten / Akkus bestätigen',
        b: 'AF und eine schnelle Belichtung an den Gehäusen testen, die du wirklich nutzt',
        c: 'Ohne Ersatzoptik und mit einer fast leeren Karte ankommen',
        d: 'Ein Backup-Gehäuse oder einen bekannten Handy-Notfall-Workflow mitnehmen',
      },
      explanation:
        'Bezahlte Arbeit scheitert öfter an Logistik als an exotischem Glas: sauber, getestet, mit Redundanzen.',
      imageAlt: 'Nahaufnahme eines Kameragehäuses — Ausrüstungschecks vor dem Event',
      imageCredit: unsplash,
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

if (count !== 192) throw new Error(`expected 192 LS, got ${count}`);

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`OK: wrote ${count} LocalizedString.de on gear-lenses`);

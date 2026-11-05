#!/usr/bin/env node
/**
 * Vague 1.93 — add LocalizedString.de for pack marques-photo (194 LS).
 * Idempotent: overwrites de with the canonical non-scolaire DE copy.
 * Vocab aligns with guides/histoire-photo article.de
 * (Markengeschichte · Kameras · Leica · Nikon · Canon · Sony · Hasselblad ·
 * Geschichte · Industrie · Meilensteine · Systeme) and sharePreview LABELS.de
 * « Markengeschichte » + guide CTA « Markengeschichte-Quiz ».
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'marques-photo');
if (!pack) throw new Error('marques-photo not found');

const unsplash = 'Unsplash — freie Nutzung (Unsplash-Lizenz)';

const de = {
  title: 'Markengeschichte',
  description:
    'Canon, Nikon, Leica, Sony und Co. — Gründungsgeschichten und ikonische Systeme, im Pixfan-Kulturstil.',
  questions: {
    'marque-01': {
      text: 'In welchem Land wurde Canon in den 1930er-Jahren gegründet?',
      answers: {
        b: 'Deutschland',
        a: 'Japan (Tokio)',
        c: 'Vereinigte Staaten',
        d: 'Frankreich',
      },
      explanation:
        'Canon begann 1934 in Tokio als Precision Optical Instruments Laboratory (später Canon).',
      imageAlt: 'Klassisches Kameragehäuse',
      imageCredit: unsplash,
    },
    'marque-02': {
      text: 'Canons erste Serien-Messsucherkamera 35 mm (Mitte der 1930er) ist allgemein bekannt als…',
      answers: {
        c: 'EOS-1 (Profi-Spiegelreflex)',
        b: 'PowerShot G1 (Kompaktkamera)',
        a: 'Hansa Canon (1936)',
        d: 'IXUS 100 (digitale Kompakte)',
      },
      explanation:
        'Nach dem Kwanon-Prototyp war die Hansa Canon (1936) die erste weit verkaufte Canon-35-mm-Kamera.',
      imageAlt: 'Vintage-Fotogerät',
      imageCredit: unsplash,
    },
    'marque-03': {
      text: 'Wofür steht die Abkürzung EOS des Canon-Systems?',
      answers: {
        d: 'Electronic Optical Sensor (elektronischer optischer Sensor)',
        a: 'Electro-Optical System (elektrooptisches System)',
        b: 'European Order Specification (europäische Bestellspezifikation)',
        c: 'Exposure Only Setting (nur Belichtungseinstellung)',
      },
      explanation:
        'EOS = Electro-Optical System, 1987 eingeführt mit Autofokus-Objektiven der EF-Serie.',
      imageAlt: 'Kamera im DSLR-Stil',
      imageCredit: unsplash,
    },
    'marque-04': {
      text: 'Canons EF-Bajonett (EOS-Ära) zeichnete sich beim Start vor allem dadurch aus, dass…',
      answers: {
        b: 'Nur Schneckenantrieb für den Filmtransport',
        c: 'Ausschließlich Blattverschlüsse im Mittelformat',
        a: 'Vollständig elektronische Objektiv–Gehäuse-Kommunikation (ohne mechanischen Blendenhebel)',
        d: 'Nur Blitzkontakte, ohne Fokusmotoren',
      },
      explanation:
        'EF entfiel die mechanische Blendenkupplung; Fokusmotoren sitzen im Objektiv und sprechen elektronisch mit dem Gehäuse.',
      imageAlt: 'Detail eines Objektivs',
      imageCredit: unsplash,
    },
    'marque-05': {
      text: 'Die optischen Wurzeln von Nikon reichen bis in welches Jahr zurück (Nippon Kogaku Kogyo)?',
      answers: {
        c: 'Jahr 1959',
        b: 'Jahr 1987',
        d: 'Jahr 2000',
        a: 'Jahr 1917',
      },
      explanation:
        'Nippon Kogaku Kogyo wurde 1917 gegründet; der Markenname Nikon kam später für Kameras und Objektive.',
      imageAlt: 'Historische Dokumente und Bücher',
      imageCredit: unsplash,
    },
    'marque-06': {
      text: 'Welche Nikon-Kamera von 1959 half, das moderne professionelle 35-mm-Spiegelreflexsystem zu definieren?',
      answers: {
        a: 'Nikon F (SLR-System 1959)',
        b: 'Nikon Coolpix P900 (Bridge)',
        c: 'Nikon 1 J1 (Mirrorless 1)',
        d: 'Nikon KeyMission 360 (360°-Action)',
      },
      explanation:
        'Die Nikon F (1959) bot ein modulares Profi-SLR-System mit Wechselvisieren und einem langlebigen F-Bajonett.',
      imageAlt: 'Kamera auf einer Oberfläche',
      imageCredit: unsplash,
    },
    'marque-07': {
      text: 'Nikons F-Bajonett ist in der Industriegeschichte vor allem bemerkenswert, weil…',
      answers: {
        d: 'Es nur mit Mittelformat-Rückteilen funktioniert',
        a: 'Es jahrzehntelang der Kern von SLR/DSLR blieb, mit breiter Abwärtskompatibilität',
        b: 'Es nach einem Jahr aufgegeben wurde',
        c: 'Es nur für Kompaktfilmkameras gedacht war',
      },
      explanation:
        'Mit der Nikon F eingeführt, begleitete das F-Bajonett Generationen von Film-SLRs und DSLRs (mit Nuancen bei neueren AF-Typen).',
      imageAlt: 'Nahaufnahme eines Kameragehäuses',
      imageCredit: unsplash,
    },
    'marque-08': {
      text: 'Vor „Nikon“ wurden viele frühe Objektive der Firma vermarktet als…',
      answers: {
        b: 'Rollei (andere Marke)',
        c: 'Nur Hasselblad',
        a: 'Nikkor (Objektivmarke)',
        d: 'Contax G (anderes System)',
      },
      explanation:
        'Nikkor war (und ist) die Objektivmarke; „Nikon“ setzte sich nach dem Zweiten Weltkrieg als Kameraname durch.',
      imageAlt: 'Objektivtubus',
      imageCredit: unsplash,
    },
    'marque-09': {
      text: 'Wem wird das Konzept der kompakten Leica 35 mm bei Ernst Leitz üblicherweise zugeschrieben?',
      answers: {
        c: 'George Eastman (Kodak)',
        a: 'Oskar Barnack (Leitz / Ur-Leica)',
        b: 'Edwin Land (Polaroid)',
        d: 'Steven Sasson (Kodak digital)',
      },
      explanation:
        'Oskar Barnacks Ur-Leica führte zur Leica I (1925) und popularisierte die 35-mm-Fotografie.',
      imageAlt: 'Vintage-Fotogerät',
      imageCredit: unsplash,
    },
    'marque-10': {
      text: 'Die erste kommerziell produzierte Leica (Leica I / Modell A) kam auf den Markt um…',
      answers: {
        d: 'Jahr 1969',
        b: 'Jahr 1947',
        c: 'Jahr 1987',
        a: 'Jahr 1925',
      },
      explanation:
        'Die Leica I wurde auf der Leipziger Frühjahrsmesse 1925 vorgestellt — ein Meilenstein für tragbare 35-mm-Kameras.',
      imageAlt: 'Klassische Kamera',
      imageCredit: unsplash,
    },
    'marque-11': {
      text: 'In welchem Jahrzehnt wurde das Leica-M-Messsuchersystem eingeführt?',
      answers: {
        a: '1950er (Leica M3, 1954)',
        b: '1970er',
        c: '1990er',
        d: '2010er',
      },
      explanation:
        'Die Leica M3 (1954) startete das M-Bajonett, das bis heute zentral für Leica-Messsucher ist.',
      imageAlt: 'Stadtstraße — Messsucherkultur',
      imageCredit: unsplash,
    },
    'marque-12': {
      text: 'Leica-Kameras werden historisch vor allem mit welcher Art von Fotografie verbunden?',
      answers: {
        b: 'Nur Unterwassergehäuse',
        c: 'Nur Großformat-Studio-Laufbodenkameras',
        a: 'Leise Messsucher-Straßen- / Reportagefotografie',
        d: 'Nur Smartphone-Computational-HDR',
      },
      explanation:
        'Kompakte, leise M-Messsucher wurden Ikonen von Straße und Reportage (z. B. viele Magnum-Fotografen).',
      imageAlt: 'Urbane Straßenatmosphäre',
      imageCredit: unsplash,
    },
    'marque-13': {
      text: 'Die Ursprünge von Sony (Tokyo Tsushin Kogyo) datieren auf welches Jahr?',
      answers: {
        c: 'Jahr 1917',
        a: 'Jahr 1946',
        b: 'Jahr 1934',
        d: 'Jahr 1925',
      },
      explanation:
        'Tokyo Tsushin Kogyo wurde 1946 gegründet und später in Sony umbenannt — zuerst Elektronik, dann Kameras.',
      imageAlt: 'Elektronik und Arbeitsplatz',
      imageCredit: unsplash,
    },
    'marque-14': {
      text: 'Sonys α-(Alpha-)Wechselobjektivkameras wuchsen teilweise aus welcher früheren Kameratradition?',
      answers: {
        d: 'Nur Polaroid-Sofortbildkameras',
        b: 'Nur GoPro-Actionkameras',
        a: 'Minolta- / Konica-Minolta-A-Mount-SLR-Erbe',
        c: 'Nur Leica-Schraubgewinde-Filmgehäuse',
      },
      explanation:
        'Sony stieg in ILCs ein, nachdem es das Kamerageschäft von Konica Minolta übernahm, und führte die A-Mount-Linie weiter, bevor E-Mount-Mirrorless kam.',
      imageAlt: 'Modernes Kameragehäuse',
      imageCredit: unsplash,
    },
    'marque-15': {
      text: 'Welche Sony-Linie von 2013 gilt weithin als Popularisierer der Vollformat-Mirrorless?',
      answers: {
        b: 'Nur Sony Cyber-shot DSC-RX0',
        a: 'Sony-α7-(A7-)Serie',
        c: 'Sony-Mavica-Diskettenkameras',
        d: 'Nur Sony Handycam Hi8',
      },
      explanation:
        'Die α7 / α7R von 2013 brachten relativ kompakte Vollformat-Mirrorless-Gehäuse zu einem breiten Publikum.',
      imageAlt: 'Kompakte Kamera im Handkontext',
      imageCredit: unsplash,
    },
    'marque-16': {
      text: 'Sonys Mirrorless-E-Mount war zuerst mit welcher Sensorformatklasse verbunden?',
      answers: {
        c: 'Nur Großformat 8×10',
        b: 'Nur APS-H-Film',
        a: 'APS-C (NEX / α××00), später auf Vollformat erweitert',
        d: 'Nur Mittelformat 6×6',
      },
      explanation:
        'Der E-Mount startete auf APS-C-NEX-Kameras; Vollformat-α7-Gehäuse nutzten später dieselbe Mount-Familie.',
      imageAlt: 'Wechselobjektivkamera',
      imageCredit: unsplash,
    },
    'marque-17': {
      text: 'Fujifilm ist historisch zuerst bekannt als Unternehmen für…',
      answers: {
        b: 'Nur Smartphone-Chipsätze',
        a: 'Fotografischen Film und Bildmaterialien',
        c: 'Nur Automotoren',
        d: 'Nur Schreibmaschinen',
      },
      explanation:
        'Fuji Photo Film Co. baute seinen Namen auf Film und Bildchemie auf, bevor die digitalen X-Serien-Kameras kamen.',
      imageAlt: 'Archiv- / Filmzeitalter-Atmosphäre',
      imageCredit: unsplash,
    },
    'marque-18': {
      text: 'Fujifilms moderne X-Serien-Wechselobjektivkameras werden besonders assoziiert mit…',
      answers: {
        d: 'Nur Mittelformat-Filmrückteilen für Hasselblad',
        c: 'Nur Unterwasser-Nikonos-Gehäusen',
        a: 'APS-C-Mirrorless-Gehäusen und markanten Filmsimulations-Looks',
        b: 'Nur 4×5-Planfilmhaltern',
      },
      explanation:
        'Die Linien X-Pro / X-T popularisierten APS-C-Mirrorless mit JPEG-Filmsimulationen aus Fujis Filmerbe.',
      imageAlt: 'Aufnahmebereite Kamera',
      imageCredit: unsplash,
    },
    'marque-19': {
      text: 'Die klassische Olympus OM-1 (1970er) ist berühmt dafür…',
      answers: {
        b: 'Das erste digitale Mittelformat-Rückteil zu sein',
        a: 'Ein kompaktes, leichtes professionelles 35-mm-SLR-System zu sein',
        c: 'Nur eine Einwegkamera zu sein',
        d: 'Eine IMAX-Filmkamera zu sein',
      },
      explanation:
        'Das OM-System (OM-1, 1972) verkleinerte die Profi-SLR, ohne auf Wechselobjektive und Zubehör zu verzichten.',
      imageAlt: 'Vintage-Kamerasystem-Ambiente',
      imageCredit: unsplash,
    },
    'marque-20': {
      text: 'Micro Four Thirds (von Olympus und Panasonic genutzt) ist vor allem ein Standard für…',
      answers: {
        c: 'Nur Blitzsynchronkabel',
        d: 'Nur Vergrößerungsobjektive für die Dunkelkammer',
        a: 'Mirrorless-Kameras mit gemeinsamem Objektivbajonett und Four-Thirds-Sensoren',
        b: 'Nur 35-mm-Filmpatronen',
      },
      explanation:
        'm4/3 (angekündigt 2008) lässt Olympus und Panasonic Objektive auf kompakten Mirrorless-Gehäusen teilen.',
      imageAlt: 'Kompakte Wechselobjektivkamera',
      imageCredit: unsplash,
    },
    'marque-21': {
      text: 'Welche Zuordnung Marke → bekanntes historisches Meilenstein ist korrekt?',
      answers: {
        b: 'Leica → erstes Consumer-CMOS-Smartphone (2007)',
        a: 'Nikon F (1959) → modulares Profi-35-mm-SLR-System',
        c: 'Canon → Erfindung der Daguerreotypie (1839)',
        d: 'Sony → Ur-Leica-Prototyp (1913)',
      },
      explanation:
        'Die Nikon F ist der klassische Profi-SLR-System-Meilenstein; Daguerreotypie und Ur-Leica gehören zu früheren Erfindern, nicht zu diesen Marken.',
      imageAlt: 'Klassische Kamerasilhouette',
      imageCredit: unsplash,
    },
    'marque-22': {
      text: 'Welche Marken waren frühe Vorreiter der 35-mm-Messsucherkultur (vor den DSLRs)?',
      answers: {
        a: 'Leica (35-mm-Messsucher)',
        b: 'Canon (frühe Messsucher)',
        c: 'Nur GoPro',
        d: 'Nur DJI-Drohnen',
      },
      explanation:
        'Leica definierte den 35-mm-Messsucher; frühe Canon-Kameras waren ebenfalls Messsucher, bevor Canons SLR-Erfolg kam.',
      imageAlt: 'Vintage-Messsucher-Ära-Gerät',
      imageCredit: unsplash,
    },
    'marque-23': {
      text: 'Im Mirrorless-Boom der 2010er — welche Aussage ist historisch zutreffend?',
      answers: {
        d: 'Film-SLRs wurden nach der Vollformat-Mirrorless erfunden',
        b: 'Keine Marke baute jemals APS-C-Mirrorless',
        a: 'Sony popularisierte Vollformat-Mirrorless mit der α7-Linie, während Fuji bei APS-C X-Serie wuchs und Olympus Micro Four Thirds vorantrieb',
        c: 'Nur Leica verkaufte in diesem Jahrzehnt Mirrorless-Kameras',
      },
      explanation:
        'Jede Marke setzte auf ein anderes Format: Sony FF E-Mount, Fuji APS-C X, Olympus/Panasonic m4/3 — alles Teil des Mirrorless-Wandels.',
      imageAlt: 'Zeitgenössisches Kameragehäuse',
      imageCredit: unsplash,
    },
    'marque-24': {
      text: '„EOS“, „F-Bajonett“ und „M-Bajonett“ sind Beispiele wofür in der Markengeschichte?',
      answers: {
        c: 'Nur Social-Media-Filter',
        a: 'Zentrale Kamerasysteme / Objektivbajonette, die das Ökosystem jeder Marke definierten',
        b: 'Nur Batteriechemien',
        d: 'Nur Druckerpapierformate',
      },
      explanation:
        'Mount- und Systemnamen (Canon EOS/EF, Nikon F, Leica M) sind die langlebigen Plattformen, um die Fotografen ihre Ausrüstung aufbauen.',
      imageAlt: 'Bajonett- / Optikglas-Kultur',
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

if (count !== 194) throw new Error(`expected 194 LS, got ${count}`);

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`OK: wrote ${count} LocalizedString.de on marques-photo`);

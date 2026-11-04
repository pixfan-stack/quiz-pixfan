#!/usr/bin/env node
/**
 * Vague 1.89 — add LocalizedString.de for pack composition (230 LS).
 * Idempotent: overwrites de with the canonical scolaire DE copy.
 * Vocab aligns with guides/composition-photo article.de
 * (Drittelregel / Führungslinien / Bildausschnitt / Blickpunkt / goldene Spirale)
 * and sharePreview LABELS.de « Komposition » + hub scolaires « Quiz Komposition ».
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'composition');
if (!pack) throw new Error('composition not found');

const unsplash = 'Unsplash — freie Nutzung (Unsplash-Lizenz)';
const unsplashPhoto = 'Foto: Unsplash';

const de = {
  title: 'Komposition & Bildausschnitt',
  description:
    'Regeln, Balance und visuelle Erzählung — wie starke Bilder im Rahmen gebaut werden.',
  questions: {
    'comp-1': {
      text: 'Die „Drittelregel“ empfiehlt, das Hauptmotiv zu platzieren…',
      answers: {
        c: 'Nur in der unteren rechten Ecke',
        b: 'Entlang imaginärer Linien, die den Rahmen in Drittel teilen, oder an ihren Schnittpunkten',
        d: 'Außerhalb des Rahmens',
        a: 'Immer genau in der Mitte',
      },
      explanation:
        'Den Rahmen in ein 3×3-Raster teilen und Schlüsselelemente auf Linien oder Schnittpunkte setzen schafft oft eine dynamischere Balance als eine tote Mittelposition.',
      imageAlt: 'Landschaft eingerahmt von Bergkämmen',
      imageCredit: unsplash,
    },
    'comp-2': {
      text: 'Welche Techniken können den Blick des Betrachters durch ein Foto führen?',
      answers: {
        a: 'Führungslinien',
        b: 'Ein schwerer Zufallsschnitt ohne Motiv',
        c: 'Rahmen im Rahmen (Türen, Bögen…)',
        d: 'Starker Kontrast zwischen Motiv und Hintergrund',
      },
      explanation:
        'Führungslinien, natürliche Rahmen und Kontrast unterstützen Hierarchie und Blickführung. Ein Schnitt ohne klares Motiv schwächt das Bild oft.',
      imageAlt: 'Nebelige Waldlandschaft',
      imageCredit: unsplash,
    },
    'comp-3': {
      text: 'Was ist „Negativraum“ in der Fotografie?',
      answers: {
        d: 'Ein Filter, der Farben umkehrt',
        c: 'Der freie Speicherplatz auf der Speicherkarte',
        a: 'Leere oder einfache Flächen, die dem Motiv Luft zum Atmen geben',
        b: 'Pixel, die immer reines Schwarz sind',
      },
      explanation:
        'Negativraum ist der freigeräumte Bereich um das Motiv. Gut eingesetzt betont er es und kann Ruhe oder Spannung erzeugen.',
      imageAlt: 'Bergseelandschaft',
      imageCredit: unsplash,
    },
    'comp-4': {
      text: 'Aus niedrigem Winkel (Froschperspektive) wirkt das Motiv meist…',
      answers: {
        a: 'Imposanter oder mächtiger',
        d: 'Genau wie auf Augenhöhe',
        b: 'Kleiner und schwächer',
        c: 'Immer komplett unscharf',
      },
      explanation:
        'Niedrige Winkel übertreiben Höhe und Präsenz. Hohe Winkel (Vogelperspektive) bewirken oft das Gegenteil.',
      imageAlt: 'Grüne Hügellandschaft',
      imageCredit: unsplash,
    },
    'comp-5': {
      text: 'In einer Landschaft betont ein Horizont im unteren Drittel meist…',
      answers: {
        a: 'Den Himmel',
        c: 'Die Akkulaufzeit der Kamera',
        b: 'Nur den Vordergrund / den Boden, nie den Himmel',
        d: 'Nichts — die Horizontposition spielt keine Rolle',
      },
      explanation:
        'Ein tiefer Horizont lässt dem Himmel mehr Rahmen (dramatische Wolken, Farbe). Ein hoher Horizont begünstigt Land oder Vordergrund.',
      imageAlt: 'Gebirgskette mit klarer Horizontlinie',
      imageCredit: unsplash,
    },
    'comp-6': {
      text: 'Was ist die „S-Kurve“ in der Komposition?',
      answers: {
        a: 'Eine Kompositionstechnik, die S-förmige Linien nutzt, um den Blick durch das Bild zu führen',
        c: 'Die Erdkrümmung, sichtbar in Weitwinkelaufnahmen',
        d: 'Ein Filtereffekt in der Nachbearbeitung',
        b: 'Eine Krümmung im Kameraobjektiv',
      },
      explanation:
        'S-Kurven erzeugen einen natürlichen Fluss durch das Bild und führen den Blick vom Vordergrund in den Hintergrund.',
      imageAlt: 'Waldpfad, der sich zwischen den Bäumen schlängelt',
      imageCredit: unsplash,
    },
    'comp-7': {
      text: 'Wie wirkt Symmetrie in der Fotografie auf den Betrachter?',
      answers: {
        a: 'Sie erzeugt ein Gefühl von Balance, Formalität und Harmonie',
        d: 'Sie hat keinen Einfluss auf die Wahrnehmung',
        c: 'Sie lässt das Bild chaotisch wirken',
        b: 'Sie verwirrt den Betrachter immer',
      },
      explanation:
        'Symmetrie vermittelt Ordnung, Stabilität und Schönheit. Sie ist stark in Architektur, Spiegelungen und formellen Porträts.',
      imageAlt: 'Symmetrischer Stadtplatz — der ruhige Zug der Symmetrie',
      imageCredit: unsplash,
    },
    'comp-8': {
      text: 'Welche Elemente tragen zum visuellen Gewicht in einer Komposition bei?',
      answers: {
        c: 'Die Position im Rahmen (unten / schwer wirkt schwerer)',
        a: 'Lebendige Farben und Bereiche mit hohem Kontrast',
        d: 'Die ISO-Einstellung',
        b: 'Gesichter und Augen',
      },
      explanation:
        'Visuelles Gewicht hängt von Farbintensität, Kontrast, menschlichem Interesse (Gesichter) und Platzierung ab. ISO ist technisch, nicht kompositorisch.',
    },
    'comp-9': {
      text: 'Was ist die Komposition „Rahmen im Rahmen“?',
      answers: {
        b: 'Mehrere Fotos machen und sie physisch einrahmen',
        a: 'Natürliche oder architektonische Elemente nutzen, um einen Rand um das Hauptmotiv zu schaffen',
        c: 'Einen Fotorahmen als Hauptmotiv verwenden',
        d: 'Fotos mit digitalen Rahmen bearbeiten',
      },
      explanation:
        'Diese Technik fügt Tiefe hinzu, lenkt die Aufmerksamkeit und kann Kontext liefern. Beispiele: Fenster, Türen, Äste.',
      imageAlt: 'Motiv eingerahmt durch einen Türbogen',
      imageCredit: unsplash,
    },
    'comp-10': {
      text: 'Warum gilt die „goldene Spirale“ als dynamischer als die Drittelregel?',
      answers: {
        d: 'Sie funktioniert nur mit Weitwinkelobjektiven',
        b: 'Sie ist mathematisch unmöglich umzusetzen',
        a: 'Sie erzeugt einen fließenden, organischen Pfad, der den Blick natürlich nach innen zieht',
        c: 'Sie erfordert Spezialobjektive',
      },
      explanation:
        'Basierend auf der Fibonacci-Folge erzeugt die goldene Spirale eine natürlichere, fließendere Komposition, die den Blick über mehrere Brennpunkte führt.',
    },
    'comp-11': {
      text: 'Welche Wirkung haben diagonale Linien in der Komposition?',
      answers: {
        a: 'Ein Gefühl von Bewegung und Dynamik erzeugen',
        b: 'Spannung oder Unruhe hinzufügen',
        c: 'Den Blick durch den Rahmen führen',
        d: 'Das Bild statisch und ruhig wirken lassen',
      },
      explanation:
        'Diagonalen bringen Energie und Richtung — anders als Horizontale (Ruhe) oder Vertikale (Stabilität). Sie sind stark für Action und Drama.',
      imageAlt: 'Bergkämme als diagonale Energielinien',
      imageCredit: unsplash,
    },
    'comp-12': {
      text: 'Was ist „visuelle Spannung“ in der Fotografie?',
      answers: {
        a: 'Das dynamische Zusammenspiel gegensätzlicher Elemente, das den Betrachter fesselt',
        d: 'Wenn das Motiv unwohl wirkt',
        b: 'Wenn die Kamera während der Belichtung wackelt',
        c: 'Zu viele Farben in einem einzigen Bild verwenden',
      },
      explanation:
        'Visuelle Spannung entsteht aus Ungleichgewicht, Kontrast oder unerwarteten Elementen: sie erzeugt Neugier und hält die Aufmerksamkeit.',
    },
    'comp-13': {
      text: 'Wie beeinflusst der Bildausschnitt (Crop) die Komposition?',
      answers: {
        b: 'Er reduziert nur die Bildqualität',
        d: 'Er funktioniert nur bei Digitalfotos',
        c: 'Er hat keinen Einfluss auf das Endbild',
        a: 'Er kann die ursprüngliche Komposition stärken oder schwächen, indem er Rahmen und Betonung ändert',
      },
      explanation:
        'Der Bildausschnitt ist ein mächtiges Kompositionswerkzeug: er entfernt Ablenkungen, ändert die Perspektive und lenkt die Aufmerksamkeit um.',
      imageAlt: 'Landschaft bereit für eine bewusste Ausschnittentscheidung',
      imageCredit: unsplash,
    },
    'comp-14': {
      text: 'Welche Kompositionstechniken funktionieren gut in der minimalistischen Fotografie?',
      answers: {
        c: 'Begrenzte Farbpalette',
        b: 'Klare Linien und geometrische Formen',
        d: 'Gesättigte, überladene Hintergründe',
        a: 'Negativraum',
      },
      explanation:
        'Minimalismus lebt von Einfachheit: Negativraum, klare Geometrie und zurückhaltende Farben. Unordnung widerspricht dem Stil.',
    },
    'comp-15': {
      text: 'Was ist „Blickraum“ oder „Nose Room“ in der Komposition?',
      answers: {
        d: 'Der Bereich um die Objektivfassung',
        c: 'Der Raum hinter dem Motiv',
        a: 'Der Raum vor einem Motiv, das in eine Richtung blickt oder sich bewegt',
        b: 'Platz für die Kameranase',
      },
      explanation:
        'Dem Motiv Raum in Blick- oder Bewegungsrichtung zu geben vermeidet das Gefühl des Erstickens und wirkt natürlicher und ausgewogener.',
      imageAlt: 'Porträt mit Blickraum / Nose Room vor dem Blick',
      imageCredit: unsplash,
    },
    'comp-16': {
      text: 'Wie beeinflusst Farbkontrast die Komposition?',
      answers: {
        d: 'Er lässt Bilder unscharf wirken',
        c: 'Er beeinflusst nur die Belichtung',
        b: 'Er hat keinen Effekt auf die Komposition',
        a: 'Er zieht die Aufmerksamkeit auf bestimmte Bereiche und erzeugt visuelles Interesse',
      },
      explanation:
        'Komplementärfarben oder starke Kontraste schaffen Brennpunkte und führen den Blick mit bewusstem Design.',
      imageAlt: 'Starker Farbkontrast zwischen Erde und Himmel',
      imageCredit: unsplash,
    },
    'comp-17': {
      text: 'Welche Aspekte lassen eine Komposition „ausgewogen“ wirken?',
      answers: {
        c: 'Gleiche Mengen von Hell und Dunkel',
        a: 'Die Verteilung des visuellen Gewichts im Rahmen',
        d: 'Die ISO-Einstellung der Kamera',
        b: 'Symmetrie oder asymmetrische Balance',
      },
      explanation:
        'Balance meint die Verteilung des visuellen Gewichts, nicht wörtliche Symmetrie. Asymmetrische Balance kann dynamischer wirken und dennoch harmonisch sein.',
    },
    'comp-18': {
      text: 'Welche Wirkung hat das Fotografieren aus einem hohen Winkel?',
      answers: {
        b: 'Das Motiv wirkt mächtiger',
        c: 'Es erzeugt immer Verzerrung',
        d: 'Es hat keinen psychologischen Effekt',
        a: 'Das Motiv wirkt kleiner, verwundbarer oder Teil einer größeren Szene',
      },
      explanation:
        'Hohe Winkel (nach unten schauen) können die Präsenz des Motivs verringern, Kontext zeigen oder eine Vogelperspektive erzeugen.',
      imageAlt: 'Hoher Aussichtspunkt, der eine Landschaftsszene verdichtet',
      imageCredit: unsplash,
    },
    'comp-19': {
      text: 'Was ist „Musterbruch“ in der Komposition?',
      answers: {
        b: 'Muster in der Nachbearbeitung zerstören',
        d: 'Alle Muster vermeiden',
        c: 'Nur zufällige Elemente verwenden',
        a: 'Ein sich wiederholendes Muster mit einem kontrastierenden Element brechen, um einen Brennpunkt zu schaffen',
      },
      explanation:
        'Muster erzeugen Rhythmus; eines zu brechen zieht sofort die Aufmerksamkeit und erzeugt einen starken Brennpunkt.',
    },
    'comp-20': {
      text: 'Welche Kompositionsregeln kann man absichtlich mit kreativem Effekt brechen?',
      answers: {
        b: 'Horizonte waagerecht halten',
        a: 'Die Drittelregel',
        d: 'Alle oben genannten',
        c: 'Ausgewogene Kompositionen',
      },
      explanation:
        'Regeln sind Leitlinien, keine Gesetze. Sie absichtlich zu brechen kann Spannung, Unruhe oder einzigartige künstlerische Aussagen erzeugen.',
    },
    'comp-21': {
      text: 'Ein Läufer füllt den Rahmen Rand zu Rand ohne Luft. Was ist die schnellste kompositorische Korrektur?',
      answers: {
        c: 'Noch enger schneiden, bis nur noch ein Schuh übrig ist',
        d: 'Um 45° neigen, um einen Diagonalhorizont zu erzwingen',
        a: 'Etwas Raum in Bewegungsrichtung hinzufügen',
        b: 'Den Kopf immer auf einen Raster-Schnittpunkt zentrieren',
      },
      explanation:
        'Aktiver Raum (Lead Room) lässt das Motiv „in den Rahmen eintreten“ und wirkt weniger erstickt.',
      imageAlt: 'Läufer in Bewegung',
      imageCredit: unsplash,
    },
    'comp-22': {
      text: 'Du fotografierst eine belebte Straße. Wie lässt du eine Person als Heldin lesen?',
      answers: {
        c: 'Das weitwinkligste Objektiv nutzen und dich möglichst weit entfernen',
        a: 'Alle Gesichter gleichmäßig einbeziehen, damit sich niemand ausgeschlossen fühlt',
        d: 'HDR aktivieren und hoffen, dass der Kontrast es löst',
        b: 'Mit Licht, Fokus, Farbkontrast oder Bildausschnitt isolieren',
      },
      explanation:
        'Helden brauchen Trennung: helleres Licht, schärferer Fokus, Komplementärfarbe oder ein natürlicher Rahmen.',
      imageAlt: 'Belebte Stadtstraße',
      imageCredit: unsplash,
    },
    'comp-23': {
      text: 'Welche Gesten lassen einen Schnappschuss meist absichtlicher wirken?',
      answers: {
        d: 'Eine halbe Sekunde auf eine klarere Geste warten',
        b: 'Den Horizont ausrichten (außer du neigst absichtlich)',
        c: 'Für immer ein ablenkendes Exit-Schild tot in der Mitte lassen',
        a: 'Näher herangehen / den Hintergrund vereinfachen',
      },
      explanation:
        'Absicht = Entscheidungen. Näher, klarer, waagerecht und im richtigen Moment schlägt „abschießen und beten“.',
      imageAlt: 'Absichtlicher Straßenausschnitt, der einen Schnappschuss hebt',
      imageCredit: unsplash,
    },
    'comp-24': {
      text: 'Überfüllte Straße: Wie isolierst du ein Motiv, ohne näher zu gehen?',
      answers: {
        a: 'Auf 16 mm öffnen und alle einbeziehen',
        b: 'Eine längere Brennweite und geringe Schärfentiefe nutzen',
        c: 'Das Motiv immer mit Blitz zentrieren',
        d: 'Nur vertikale Panoramen schießen',
      },
      explanation:
        'Kompression + Unschärfe trennen das Motiv vom Chaos.',
      imageAlt: 'Belebte Stadtstraße',
      imageCredit: unsplash,
    },
    'comp-25': {
      text: 'Mythos: „Stelle das Motiv nie in die Mitte.“ Wann ist Zentrieren in Ordnung?',
      answers: {
        a: 'Nie — immer die Drittel nutzen',
        b: 'Symmetrie, Porträts mit direktem Blick oder starke grafische Balance',
        c: 'Nur für Screenshots von Tabellenkalkulationen',
        d: 'Nur beim Schießen in RAW',
      },
      explanation:
        'Regeln sind Werkzeuge. Zentrierte Rahmen können absichtlich und stark wirken.',
      imageAlt: 'Zentriertes Bergmotiv — wann Zentrieren funktioniert',
      imageCredit: unsplash,
    },
    'comp-26': {
      text: 'Du willst Führungslinien zu einer winzigen Figur. Welcher Bildausschnitt-Fehler tötet das?',
      answers: {
        a: 'Luft am Fluchtpunkt lassen',
        b: 'So schneiden, dass die Linien den Rahmen verlassen, bevor sie das Motiv erreichen',
        c: 'Einen etwas niedrigeren Kamerawinkel nutzen',
        d: 'Auf weicheres Licht warten',
      },
      explanation:
        'Führungslinien müssen weiterhin auf das Motiv innerhalb des Rahmens zeigen.',
    },
    'comp-27': {
      text: 'Hochzeitstoast: viele Gesichter. Wie hältst du die Hierarchie klar?',
      answers: {
        a: 'Auf die Redner / das Paar fokussieren und den Rest weicher fallen lassen',
        b: 'Auf die entfernteste Lampe fokussieren',
        c: 'Immer die größte Blende auf die Torte setzen',
        d: 'Schwenken und alle Gäste gleichmäßig unscharf machen',
      },
      explanation:
        'Lenke die Aufmerksamkeit mit Fokus und Platzierung — nicht mit gleicher Schärfe überall.',
      imageAlt: 'Hochzeitsfeier-Moment',
      imageCredit: unsplash,
    },
    'comp-28': {
      text: 'Café-Tisch: überladener Vordergrund. Die sauberste Korrektur vor dem Auslösen?',
      answers: {
        a: 'ISO auf 25600 erhöhen',
        b: 'Objekte entfernen oder umordnen, oder den Winkel ändern, um zu vereinfachen',
        c: 'Mehr Servietten für Textur hinzufügen',
        d: 'Nur durch schmutziges Glas schießen für Ambiente',
      },
      explanation:
        'Komposition beginnt vor dem Verschluss — editiere die Szene.',
      imageAlt: 'Café-Tischszene',
      imageCredit: unsplash,
    },
    'comp-29': {
      text: 'Stadt-Ecke, starke Führungslinien zu einem gesättigten Hintergrund. Das Motiv ist auf mittlerer Höhe. Beste Korrektur ohne dich zu entfernen?',
      answers: {
        c: 'Nur Maximal-Tele — Komposition spielt keine Rolle',
        a: 'Immer zentrieren und hoffen, dass Symmetrie es rettet',
        d: 'Eine starke In-Kamera-Vignette als einzige Lösung hinzufügen',
        b: 'Seitlich verschieben / Höhe ändern, damit die Linien auf ein klares Motiv zeigen, dann bewusst schneiden',
      },
      explanation:
        'Führungslinien sind Werkzeuge: ziele damit. Kleine seitliche/Höhenbewegungen schlagen oft Zoom am Spot.',
      imageAlt: 'Stadtstraße mit starken Perspektivlinien',
      imageCredit: unsplashPhoto,
    },
    'comp-30': {
      text: 'Umweltporträt: Gesicht scharf, aber eine helle Tür dahinter konkurriert. Beste kompositorische Entscheidung?',
      answers: {
        c: 'Das Gesicht beschneiden, um die Tür zu behalten',
        b: 'Die helle Form immer zentriert lassen',
        a: 'Neu komponieren, damit die helle Form das Gesicht stützt (nicht rivalisiert) — oder auf weicheres Licht warten',
        d: 'Die größte Blende nutzen und den Hintergrund komplett ignorieren',
      },
      explanation:
        'Helligkeit zieht den Blick. Platziere oder time sie so, dass sie das Motiv rahmt statt dagegen zu kämpfen.',
    },
    'comp-31': {
      text: 'Wann ist das Brechen der Drittelregel oft stärker als sie zu befolgen?',
      answers: {
        a: 'Bewusste Symmetrie / Spiegelungsaufnahmen',
        b: 'Minimalistische Motive, die Schwerkraft genau in der Mitte brauchen',
        c: 'Jeder Schnappschuss — Regeln helfen Anfängern nie',
        d: 'Muster und Architektur, wo die Mitte die Struktur betont',
      },
      explanation:
        'Regeln lenken die Aufmerksamkeit; ein absichtliches Zentrum/Symmetrie kann klarer sein. Zufälliges Zentrieren ist nicht dasselbe wie gestaltetes Zentrieren.',
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
console.log(`OK: wrote ${count} LocalizedString.de on composition`);

#!/usr/bin/env node
/**
 * Vague 1.86 — add LocalizedString.de for pack public-domain (194 LS).
 * Idempotent: overwrites de with the canonical scolaire DE copy.
 * Aligns with sharePreview LABELS.de « Gemeinfreie Galerie » /
 * hub histoire DE cite + dailyChallenge history bias.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'public-domain');
if (!pack) throw new Error('public-domain not found');

const pdCredit = (name) => `${name} — gemeinfrei (Wikimedia Commons)`;
const pdCreditUs = (name) => `${name} — gemeinfrei US (Wikimedia Commons)`;
const pdCreditLoc = (name) =>
  `${name} — gemeinfrei (Library of Congress / Wikimedia Commons)`;
const pdCreditMet = (name) =>
  `${name} — gemeinfrei (Wikimedia Commons / Met)`;
const pdCreditNga = (name) =>
  `${name} — gemeinfrei (Wikimedia Commons / NGA)`;
const pdCreditFed = (name) =>
  `${name} — gemeinfrei (federal US / Library of Congress)`;
const pdCreditDust = (name) =>
  `${name} — gemeinfrei (Wikimedia Commons)`;

const de = {
  title: 'Gemeinfreie Galerie',
  description:
    'Lies historische Fotografien, die frei nachnutzbar sind — Pioniere, dokumentarische Ikonen und FSA-Klassiker.',
  questions: {
    'pd-01': {
      text: 'Sie gilt oft als die älteste erhaltene Fotografie. Wer hat sie gemacht?',
      answers: {
        b: 'Nicéphore Niépce (Heliographie)',
        c: 'William Henry Fox Talbot (Kalotypie)',
        d: 'Eugène Atget (altes Paris-Handwerk)',
        a: 'Louis Daguerre (Daguerreotypie)',
      },
      explanation:
        'Niépces Blick aus dem Fenster in Le Gras (Point de vue du Gras, ca. 1826–27) ist die älteste bekannte erhaltene Fotografie.',
      imageAlt: 'Körnige Dachlandschaft aus einem Fenster — sehr frühe Fotografie',
      imageCredit: pdCredit('Nicéphore Niépce'),
    },
    'pd-02': {
      text: 'Daguerres Boulevard du Temple wirkt fast leer. Warum sieht man trotzdem einen Schuhputzer?',
      answers: {
        d: 'Daguerre nutzte Blitz, um alle anderen einzufrieren',
        a: 'Passanten wurden in der Dunkelkammer wegradiert',
        c: 'Paris war an dem Tag wegen einer königlichen Parade geschlossen',
        b: 'Die lange Belichtung verwischte bewegte Mengen; nur jemand Stillstehendes blieb sichtbar',
      },
      explanation:
        'Frühe Daguerreotypien brauchten Minuten Licht. Bewegte Passanten verschwanden; ein stiller Kunde blieb.',
      imageAlt: 'Pariser Boulevard mit winziger Figur beim Schuhputzen',
      imageCredit: pdCredit('Louis Daguerre'),
    },
    'pd-03': {
      text: 'Muybridges Pferdesequenz klärte berühmt welche Frage?',
      answers: {
        d: 'Ob Film schneller ist als Digital',
        a: 'Ob Pferde in Farbe träumen',
        b: 'Ob alle vier Hufe im Galopp den Boden verlassen',
        c: 'Ob Pferde Linkskurven bevorzugen',
      },
      explanation:
        'The Horse in Motion bewies, dass ein galoppierendes Pferd einen Moment völlig in der Luft ist.',
      imageAlt: 'Sequenz eines galoppierenden Pferdes mit Reiter',
      imageCredit: pdCredit('Eadweard Muybridge'),
    },
    'pd-04': {
      text: 'Zu welcher Forschungstradition gehört Mareys gehende Figur?',
      answers: {
        d: 'Infrarot-Überwachung',
        c: 'Kubistische Collage',
        a: 'Mode-Editorial-Posing',
        b: 'Chronofotografie — Bewegung mit getakteten Belichtungen studieren',
      },
      explanation:
        'Mareys Chronofotografie zerlegt Bewegung für die Wissenschaft — eine Cousine des Films.',
      imageAlt: 'Mehrfach überlagerte Belichtungen eines gehenden Mannes',
      imageCredit: pdCredit('Étienne-Jules Marey'),
    },
    'pd-05': {
      text: 'Le Grays Seestück wirkt unmöglich detailliert in Himmel und Wasser. Wahrscheinliche Technik?',
      answers: {
        a: 'Smartphone-HDR schon 1857',
        d: 'Unterwasseraufnahme mit Glaskasten',
        b: 'Negative (oder passende Belichtungen) für Himmel und Meer kombinieren',
        c: 'Wolken nur auf dem Abzug bemalen',
      },
      explanation:
        'Le Gray war berühmt dafür, dramatischen Himmel und gut belichtetes Meer zu verbinden — frühes Compositing-Handwerk.',
      imageAlt: 'Dramatische Welle und bewölkter Himmel — Seestück',
      imageCredit: pdCredit('Gustave Le Gray'),
    },
    'pd-06': {
      text: 'Dieses Studio-Porträt Baudelaires stammt von welchem französischen Pionier?',
      answers: {
        b: 'Nadar (Pariser Porträts des 19. Jh.)',
        d: 'Brassaï (nächtliches Paris)',
        a: 'Henri Cartier-Bresson (entscheidender Moment)',
        c: 'Robert Doisneau (humanistische Straße)',
      },
      explanation:
        'Nadar fotografierte die literarische und künstlerische Elite des Paris des 19. Jahrhunderts.',
      imageAlt: 'Porträt von Charles Baudelaire',
      imageCredit: pdCredit('Nadar'),
    },
    'pd-07': {
      text: 'Camerons weiche, atmosphärische Porträts stehen welcher Ästhetik am nächsten?',
      answers: {
        a: 'Harte Pressefotografie mit Blitz',
        b: 'Piktorialismus — Fotografie, die malerisches Empfinden sucht',
        d: 'Produkt-Packshot-Licht',
        c: 'Satellitenkartierung',
      },
      explanation:
        'Julia Margaret Cameron setzte auf Weichzeichnung und Allegorie — eine Brücke zum Piktorialismus.',
      imageAlt: 'Weichgezeichnetes Porträt von Julia Margaret Cameron',
      imageCredit: pdCredit('Julia Margaret Cameron'),
    },
    'pd-08': {
      text: 'Atgets Schaufenster und Straßen dokumentieren vor allem…',
      answers: {
        b: 'Ein verschwindendes alltägliches Paris',
        a: 'Hollywood-Filmsets',
        c: 'Nur königliche Krönungen',
        d: 'Abstrakte Farbfelder',
      },
      explanation:
        'Atget inventarisierte das alte Paris — Handwerke, Fassaden, leere Straßen — bevor die Modernisierung es tilgte.',
      imageAlt: 'Pariser Schaufenster an der Avenue des Gobelins von Atget',
      imageCredit: pdCredit('Eugène Atget'),
    },
    'pd-09': {
      text: 'In Stieglitz’ The Steerage: was zuerst im Bild lesen?',
      answers: {
        c: 'Ein Neon-Logo in der Ecke',
        d: 'Autofokus-Suchquadrate',
        b: 'Starke Geometrie, die Decks / soziale Räume trennt',
        a: 'Nur die Marke des Schiffsschornsteins',
      },
      explanation:
        'Die Kraft des Bildes ist strukturell: Diagonalen, Laufstege und Klassen, getrennt durch die Architektur des Schiffs.',
      imageAlt: 'Passagiere auf Unter- und Oberdeck eines Schiffes',
      imageCredit: pdCredit('Alfred Stieglitz'),
    },
    'pd-10': {
      text: 'Lewis Hine fotografierte vor allem Fabrikkinder, um…',
      answers: {
        d: 'Längere Fabrikschichten zu bewerben',
        b: 'Missbrauch zu dokumentieren und soziale Reformen voranzutreiben',
        c: 'KI-Modelle zu trainieren',
        a: 'Mode-Lookbooks zu verkaufen',
      },
      explanation:
        'Hines Arbeit für das National Child Labor Committee half, Meinung und Gesetz zu bewegen.',
      imageAlt: 'Junges Fabrikkind neben Mühlenmaschinen',
      imageCredit: pdCredit('Lewis Hine'),
    },
    'pd-11': {
      text: 'Langes Migrant Mother (1936) entstand im Rahmen welches US-Programms?',
      answers: {
        c: 'Einer privaten Parfümkampagne',
        d: 'Der Gründungscharta von Magnum Photos',
        b: 'Der Dokumentation der Farm Security Administration (FSA)',
        a: 'Der NASA-Apollo-Öffentlichkeitsarbeit',
      },
      explanation:
        'FSA-Fotos sind US-Bundeswerke — ein zentrales gemeinfreies dokumentarisches Korpus.',
      imageAlt: 'Verarmte Mutter mit Kindern in der Great Depression',
      imageCredit: pdCreditUs('Dorothea Lange / FSA'),
    },
    'pd-12': {
      text: 'Walker Evans’ frontale Sharecropper-Porträts (wie Allie Mae Burroughs) betonen…',
      answers: {
        b: 'Direkte, nüchterne Konfrontation — Würde ohne sentimentale Pose',
        c: 'Starkes Instagram-Hautglätten',
        a: 'Glamour-Softboxen und Windmaschinen',
        d: 'Fischaugen-Humor',
      },
      explanation:
        'Evans’ FSA/RA-Porträts wirken fast typologisch: klares Licht, Blick auf Augenhöhe, minimales Drama.',
      imageAlt: 'Enges frontales Porträt von Allie Mae Burroughs',
      imageCredit: pdCreditUs('Walker Evans / FSA'),
    },
    'pd-13': {
      text: 'Diese Dust-Bowl-Szene kommuniziert vor allem…',
      answers: {
        d: 'Ein Studio-Stillleben mit Obst',
        c: 'Eine Sport-Siegesparade',
        b: 'Umwelt- und Sozialkrise durch Wetter und Körper im Raum',
        a: 'Eine Strand-Urlaubspostkarte',
      },
      explanation:
        'FSA-Fotografen machten Staub, Wind und Exodus zu lesbaren öffentlichen Beweisen.',
      imageAlt: 'Silhouetten, die durch einen schweren Sandsturm gehen',
      imageCredit: pdCreditDust(
        'US-Regierung / Dust-Bowl-Dokumentation'
      ),
    },
    'pd-14': {
      text: 'Gordon Parks’ American Gothic (1942) zitiert Grant Woods Gemälde. Was ist die kritische Wendung?',
      answers: {
        c: 'Es ist ein Selfie am Eiffelturm',
        d: 'Es entfernt alle Werkzeuge aus dem Bild',
        a: 'Es bewirbt Landmaschinen',
        b: 'Eine schwarze Reinigungskraft mit Mopp und Besen ersetzt das Bauernpaar — Rasse und Arbeit in der Hauptstadt',
      },
      explanation:
        'Parks’ FSA/OWI-Bild nutzt eine US-Ikone, um Segregation und Dienstarbeit in Washington zu konfrontieren.',
      imageAlt: 'Frau mit Mopp und Besen vor einer US-Flagge',
      imageCredit: pdCreditUs('Gordon Parks / FSA-OWI'),
    },
    'pd-15': {
      text: 'Prokudin-Gorskys Farbporträts (wie der Emir von Buchara) entstanden wie?',
      answers: {
        a: 'Mit modernem CMOS-Handysensor',
        c: 'Nur durch Handkolorierung jedes Abzugs',
        d: 'Mit Kodachrome frei im Handel schon 1911',
        b: 'Drei Schwarzweiß-Belichtungen durch Farbfilter, später rekombiniert',
      },
      explanation:
        'Sein Dreifarbenverfahren liefert frappierende frühe Farben des Russischen Reichs — weitgehend gemeinfrei über LoC-Scans.',
      imageAlt: 'Farbporträt des Emirs von Buchara in ornamentalem Gewand',
      imageCredit: pdCreditLoc('Sergej Prokudin-Gorski'),
    },
    'pd-16': {
      text: 'Talbots The Open Door (1844) half zu zeigen, welchen Vorteil sein Verfahren gegenüber der Daguerreotypie hatte?',
      answers: {
        d: 'Gar kein Licht mehr nötig',
        c: 'Eingebauter Autofokus',
        b: 'Ein Papiernegativ, das mehrere Positivabzüge erlaubte',
        a: 'Sofortfarbe ohne Filter',
      },
      explanation:
        'Der Negativ–Positiv-Workflow der Kalotypie ist der Vorfahre des klassischen Silberdrucks.',
      imageAlt: 'Offene Tür mit Besen — frühe Kalotypie von Talbot',
      imageCredit: pdCreditMet('William Henry Fox Talbot'),
    },
    'pd-17': {
      text: 'Dieses berühmte Lincoln-Porträt von 1860 wird welchem US-Studio zugeordnet?',
      answers: {
        b: 'Dem Studio von Mathew Brady',
        a: 'Magnum Photos Paris (Kooperative)',
        d: 'Instagram Studios Chicago (soziales Netzwerk)',
        c: 'Ansel Adams’ Yosemite-Dunkelkammer',
      },
      explanation:
        'Bradys Studio (und seine Operatoren) formten die politische Bildwelt des Bürgerkriegs — Porträt als Kampagne.',
      imageAlt: 'Studio-Porträt von Abraham Lincoln, 1860',
      imageCredit: pdCredit('Studio Mathew Brady'),
    },
    'pd-18': {
      text: 'Riis’ Bandit’s Roost nutzt Fotografie vor allem, um…',
      answers: {
        c: 'Ballettchoreografie zu lehren',
        b: 'Elend in den Mietskasernen zu zeigen und urbane Reformen voranzutreiben',
        a: 'Luxus-Immobilienbroschüren zu verkaufen',
        d: 'Nur Zigarrenmarken zu bewerben',
      },
      explanation:
        'How the Other Half Lives mischt blitzbeleuchtete Gassen mit Anklage — früher sozialdokumentarischer Schock.',
      imageAlt: 'Enge New Yorker Gasse voller Menschen — Bandit’s Roost',
      imageCredit: pdCredit('Jacob Riis'),
    },
    'pd-19': {
      text: 'Käsebiers Blessed Art Thou Among Women wirkt malerisch. Das rückt sie vor allem an…',
      answers: {
        d: 'Sport-Freeze-Strobes',
        b: 'Den Piktorialismus — weicher Ton, Allegorie und emotionale Atmosphäre',
        a: 'Hartes Produktkatalog-Licht',
        c: 'Luftbild-Kartierungen',
      },
      explanation:
        'Gertrude Käsebier war eine führende Piktorialistin — Fotografie, die poetisch-malerisches Empfinden sucht.',
      imageAlt: 'Mutter und Kind in einer weichen piktorialistischen Türszene',
      imageCredit: pdCreditNga('Gertrude Käsebier'),
    },
    'pd-20': {
      text: 'Blossfeldts Pflanzen-Nahaufnahmen laden ein, Natur zu sehen als…',
      answers: {
        d: 'Ein Blatt Sportteam-Logos',
        b: 'Architektur und Design — Form, Rhythmus und Struktur',
        a: 'Nur eine Gartenbau-Preisliste',
        c: 'Ein Set Wetter-Icons',
      },
      explanation:
        'Urformen der Kunst behandelt botanische Details wie modernistische Bausteine.',
      imageAlt: 'Vergrößerte botanische Stängelfotografie von Karl Blossfeldt',
      imageCredit: pdCredit('Karl Blossfeldt'),
    },
    'pd-21': {
      text: 'In Johnstons Selbstporträt als „New Woman“ (1896): was in der Pose lesen?',
      answers: {
        b: 'Eine inszenierte Unabhängigkeitsbehauptung — Fahrrad, Bier, Zigarette und lockere Haltung',
        c: 'Eine Seite aus dem Militärdrill-Handbuch',
        d: 'Eine Stummfilm-Titelskarte',
        a: 'Nur einen zufälligen Garderobenzufall',
      },
      explanation:
        'Frances Benjamin Johnston spielt mit Requisiten und Haltung, um moderne Weiblichkeit zu karikieren / zu beanspruchen.',
      imageAlt:
        'Frau lässig sitzend mit Fahrrad und Zigarette — Selbstporträt 1896',
      imageCredit: pdCreditLoc('Frances Benjamin Johnston'),
    },
    'pd-22': {
      text: 'Viele FSA- / US-Bundesfotos sind oft nachnutzbar, weil…',
      answers: {
        a: 'Werke der US-Bundesregierung in der Regel nicht urheberrechtlich geschützt sind',
        b: 'Jedes S/W-Foto älter als 10 Jahre weltweit frei ist',
        c: 'Instagram immer Rechte an historischen Bildern aufgibt',
        d: 'Nur Museumsshops sie nutzen dürfen',
      },
      explanation:
        'US-Bundeswerke bilden ein klassisches gemeinfreies Korpus — prüfe trotzdem die genaue Datei und spätere Schichten.',
      imageAlt: 'Migrant Mother — dokumentarische FSA-Fotografie',
      imageCredit: pdCreditFed('Dorothea Lange'),
    },
    'pd-23': {
      text: 'Niépces Blick aus dem Fenster in Le Gras (ca. 1826–27) gilt meist als gemeinfrei, weil…',
      answers: {
        a: 'Die Schutzfristen für Autoren jener Zeit längst abgelaufen sind',
        c: 'Jedes Fensterfoto automatisch frei ist',
        d: 'Die UNESCO weltweite Exklusivrechte auf ewig besitzt',
        b: 'Nur RAW-Dateien gemeinfrei werden können',
      },
      explanation:
        'Sehr alte Werke fallen nach langen Fristen in die Gemeinfreiheit — bestätige die konkrete Reproduktion, die du nutzt.',
      imageAlt:
        'Älteste erhaltene Kamerafotografie — Point de vue du Gras',
      imageCredit: pdCredit('Nicéphore Niépce'),
    },
    'pd-24': {
      text: 'Du willst eine gemeinfreie Muybridge-Tafel in einem kommerziellen Buch drucken. Sicherste Gewohnheit?',
      answers: {
        b: 'Glauben, Google-Images-Miniaturen beweisen für immer Null Rechte',
        d: 'Nur veröffentlichen, wenn du das Pferd zuerst mit KI nachbaust',
        a: 'Prüfen, dass Scan/Quelle wirklich gemeinfrei ist (kein modernes Museumfoto mit frischen Rechten)',
        c: 'Historische Autoren nie nennen, sobald etwas gemeinfrei ist',
      },
      explanation:
        'Das zugrunde liegende Werk kann gemeinfrei sein, während ein modernes Foto des Abzugs noch geschützt ist — Herkunft prüfen.',
      imageAlt: 'Muybridge-Pferde-Lokomotionsplatte',
      imageCredit: pdCredit('Eadweard Muybridge'),
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
console.log(`OK: wrote ${count} LocalizedString.de on public-domain`);

#!/usr/bin/env node
/**
 * Vague 1.82 — add LocalizedString.de for pack flash-studio (184 LS).
 * Idempotent: overwrites de with the canonical scolaire DE copy.
 * Aligns with hub CTA « Quiz Blitz & Studio »
 * and guide lumiere-photo article.de « Blitz- & Studio-Quiz ».
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'flash-studio');
if (!pack) throw new Error('flash-studio not found');

const unsplashCredit = 'Unsplash — freie Nutzung (Unsplash-Lizenz)';

const de = {
  title: 'Blitz & Studio',
  description:
    'Speedlights, Studio-Blitzanlagen, Sync, Modifier und Drei-Punkt-Technik — Pixfan-Studio-Lichtparcours.',
  questions: {
    'flash-01': {
      text: 'Was automatisiert die TTL-Blitzmessung vor allem?',
      answers: {
        b: 'Nur den ISO der Kamera dauerhaft',
        a: 'Die Blitzleistung für eine Zielbelichtung durch das Objektiv',
        c: 'Nur die Farbe der Gele bei Dauerlicht-LEDs',
        d: 'Nur dass der erste Verschluss dauerhaft offen bleibt',
      },
      explanation:
        'TTL (Through-The-Lens) misst die Szene und stellt die Blitzleistung auf eine Zielbelichtung ein; Sync, Modifier und kreative Korrekturen wählst du weiterhin selbst.',
      imageAlt: 'Studiolichter und Fotografie-Ausrüstung',
      imageCredit: unsplashCredit,
    },
    'flash-02': {
      text: 'Die X-Sync (klassische Blitzsynchronisation) wird vor allem durch welche Kameraeinstellung begrenzt?',
      answers: {
        c: 'Nur die Mikrofonverstärkung',
        a: 'Die maximale Verschlusszeit, bevor die Vorhänge einen wandernden Schlitz bilden',
        b: 'Nur die Fokusmotor-Geschwindigkeit des Objektivs',
        d: 'Nur die Helligkeit des LCD-Displays',
      },
      explanation:
        'Oberhalb der X-Sync belichten Schlitzverschlüsse über einen wandernden Spalt: ein normaler Blitzimpuls würde nur einen Streifen belichten — außer du nutzt HSS oder andere Techniken.',
      imageAlt: 'Klassisches Kameragehäuse',
      imageCredit: unsplashCredit,
    },
    'flash-03': {
      text: 'High-Speed-Sync (HSS) ist nützlich, wenn du…',
      answers: {
        d: 'Dauerhaft alles Umgebungslicht ausschalten willst',
        b: 'Nur Film ohne Verschluss belichten willst',
        a: 'Blitz mit Zeiten schneller als die X-Sync nutzen willst (z. B. geringe Schärfentiefe im Freien)',
        c: 'Nur die Akkus schneller laden willst',
      },
      explanation:
        'HSS pulst den Blitz über den Schlitz hinweg, damit schnelle Verschlusszeiten das Ambient einfrieren und trotzdem Blitzfüllung möglich bleibt — auf Kosten der effektiven Leistung.',
      imageAlt: 'Weiches Außenlicht-Ambiente',
      imageCredit: unsplashCredit,
    },
    'flash-04': {
      text: 'Zweiter-Vorhang-Sync lässt bewegte Lichter typischerweise…',
      answers: {
        a: 'Einen Schweif hinter der Motivbewegung hinterlassen',
        b: 'Immer nur vor dem Motiv erscheinen',
        c: 'Automatisch jede Bewegungsunschärfe entfernen',
        d: 'Kelvin nur auf 2000 K ändern',
      },
      explanation:
        'Beim zweiten Vorhang bauen sich Ambient-Schweife zuerst auf; der Blitz friert das Motiv am Ende ein — die Schweife lesen sich als dem Bewegungsweg folgend.',
    },
    'flash-05': {
      text: 'Eine Leitzahl (LZ / Guide Number) dient vor allem dazu, … zu schätzen',
      answers: {
        c: 'Nur das Gewicht einer Softbox',
        a: 'Reichweite / Blitzleistung gegenüber Distanz (und Blende) bei gegebenem ISO',
        b: 'Nur die verfügbaren Autofokus-Punkte',
        d: 'Nur die JPEG-Kompressionsqualität',
      },
      explanation:
        'Leitzahlen fassen die Blitzleistung für Belichtungsrechnung zusammen (Distanz × Blende bei einem Referenz-ISO).',
      imageAlt: 'Kamera bereit für Blitzarbeit',
      imageCredit: unsplashCredit,
    },
    'flash-06': {
      text: 'Nach der Idee des Abstandsquadrats bei nacktem Blitz: Distanz zum Motiv verdoppeln…',
      answers: {
        b: 'Verdoppelt die Blitzhelligkeit',
        a: 'Reduziert die Blitzintensität auf etwa ein Viertel (≈ −2 Blenden)',
        c: 'Hat keinen Effekt auf die Blitzbelichtung',
        d: 'Sperrt ISO immer auf 100',
      },
      explanation:
        'Die Intensität fällt mit dem Quadrat der Distanz: 2× Distanz ≈ ¼ Licht (etwa zwei Blenden). Modifier und Bounce ändern den realen Abfall.',
      imageAlt: 'Fotografie-Ausrüstung am Set',
      imageCredit: unsplashCredit,
    },
    'flash-07': {
      text: 'Blitz an eine weiße Decke zu bouncen zielt meist darauf…',
      answers: {
        d: 'Rote Augen absichtlich zu verstärken',
        a: 'Die effektive Lichtquelle zu vergrößern und weicher zu machen',
        b: 'Das Licht härter zu machen als nackter Blitz',
        c: 'Die Szene nur auf 2000 K zu wärmen',
      },
      explanation:
        'Eine große, gebouncte Quelle weicht Schatten gegenüber On-Camera-Nacktblitz ab; farbige Decken oder Wände färben den Bounce ein.',
      imageAlt: 'Innenraum-Schreibtischszene',
      imageCredit: unsplashCredit,
    },
    'flash-08': {
      text: 'Verglichen mit einem nackten Speedlight weicht eine große Softbox nah am Motiv typischerweise…',
      answers: {
        a: 'Übergänge ab und umhüllt das Licht sanfter',
        b: 'Immer schärfere, härtere Schatten erzeugen',
        c: 'Jede Belichtungseinstellung überflüssig machen',
        d: 'Nur mit Filmkameras funktionieren',
      },
      explanation:
        'Die relative Quellengröße zählt: groß + nah = weichere Umhüllung. Softboxes werfen weiterhin Schatten — sie löschen Dunkelheit nicht.',
      imageAlt: 'Porträt mit weichem Studio-ähnlichem Licht',
      imageCredit: unsplashCredit,
    },
    'flash-09': {
      text: 'Schirm gegen Softbox — eine vernünftige Studio-Faustregel ist…',
      answers: {
        c: 'Schirme funktionieren nur unter Wasser',
        a: 'Schirme sind schnell und streuen mehr; Softboxes begrenzen Streulicht mit einer Fläche',
        b: 'Softboxes frieren Bewegung immer besser ein als Schirme',
        d: 'Keines davon lässt sich mit Studio-Blitzanlagen nutzen',
      },
      explanation:
        'Schirme (besonders Shoot-through) sind schnell und streuen; Softboxes geben mehr Richtkontrolle. Beide können weich sein, wenn sie groß genug sind.',
      imageAlt: 'Studio-Licht-Kit',
      imageCredit: unsplashCredit,
    },
    'flash-10': {
      text: 'Ein Wabenraster an Softbox oder Reflektor dient vor allem dazu…',
      answers: {
        b: 'Das Streulicht auf den Hintergrund zu erhöhen',
        a: 'Den Strahl zu verengen und Streulicht zu reduzieren',
        c: 'Den Blitz nur in Wolfram-Dauerlicht umzuwandeln',
        d: 'Funkauslöser zu deaktivieren',
      },
      explanation:
        'Raster steuern Streulicht und halten das Licht gerichteter — nützlich für Haarlicht, Akzente und sauberere Hintergründe.',
    },
    'flash-11': {
      text: 'Im klassischen Drei-Punkt-Studio trennt das Kanten-/Haarlicht typischerweise…',
      answers: {
        a: 'Das Motiv vom Hintergrund mit einem Rand-Highlight',
        b: 'Die Schlüssellicht-Rolle komplett ersetzen',
        c: 'Nur das Kelvin der Wandfarbe messen',
        d: 'Nur die Einstelllampe speisen',
      },
      explanation:
        'Key formt, Fill öffnet Schatten, Rim/Haarlicht trennt Konturen — lesbares Drei-Punkt-Vokabular für Studio-Porträts.',
      imageAlt: 'Porträt mit Studio-ähnlicher Beleuchtung',
      imageCredit: unsplashCredit,
    },
    'flash-12': {
      text: 'Welche Aussagen zu Key vs. Fill im Studio sind richtig?',
      answers: {
        a: 'Das Key ist meist das stärkste formgebende Licht',
        b: 'Fill reduziert Schattentiefe, ohne zu einem zweiten harten Key zu werden',
        c: 'Fill muss immer heller sein als das Key',
        d: 'Key-Lichter gibt es nur bei Smartphones',
      },
      explanation:
        'Key definiert Richtung und Form; Fill ist untergeordnet. Übertrifft Fill das Key, bricht das Beleuchtungsverhältnis zusammen.',
      imageAlt: 'Porträtgesicht mit kontrolliertem Licht',
      imageCredit: unsplashCredit,
    },
    'flash-13': {
      text: 'Einstelllampen (Modeling Lights) an Studio-Blitzanlagen dienen vor allem dazu…',
      answers: {
        c: 'Jeden Bedarf an Blitzimpuls zu ersetzen',
        a: 'Lichtrichtung und Schatten vor dem Auslösen vorzuschauen',
        b: 'Nur den Kondensator schneller zu laden',
        d: 'Nur die Blitzröhre chemisch zu erwärmen',
      },
      explanation:
        'Einstelllampen helfen bei Platzierung und Verhältnissen; die finale Belichtung hängt weiter am Blitzimpuls (und an den Kameraeinstellungen).',
      imageAlt: 'Motiv beleuchtet für eine Porträtsession',
      imageCredit: unsplashCredit,
    },
    'flash-14': {
      text: 'Funkauslöser für Off-Camera-Blitz werden optischen Slave-Einheiten vorgezogen, wenn…',
      answers: {
        b: 'Du nur in völliger Dunkelheit ohne Wände fotografierst',
        a: 'Du Zuverlässigkeit hinter Ecken, bei hellem Ambient oder Multi-Gruppen-Steuerung brauchst',
        c: 'Du absichtlich langsamere Recyclingzeiten willst',
        d: 'Du dich weigerst, irgendeinen Kanal einzustellen',
      },
      explanation:
        'Optische Slaves können bei greller Sonne oder hinter Hindernissen versagen; Funksysteme sind robuster on location und in Multi-Licht-Kits.',
      imageAlt: 'Kameragehäuse für Off-Camera-Blitz',
      imageCredit: unsplashCredit,
    },
    'flash-15': {
      text: 'Ein CTO-Gel auf dem Blitz wird üblicherweise genutzt, um…',
      answers: {
        a: 'Den Blitz zu wärmen, damit er besser zu Wolfram / warmem Ambient passt',
        b: 'Den Blitz nur Richtung Schattenblau zu kühlen',
        c: 'Die Leitzahl um 10 Blenden zu erhöhen',
        d: 'TTL für immer zu deaktivieren',
      },
      explanation:
        'CTO (Color Temperature Orange) wärmt einen tageslichtbalancierten Blitz, um ihn mit wärmeren Praktiken zu mischen; CTB geht in die Gegenrichtung.',
    },
    'flash-16': {
      text: 'Um die Blitzbelichtung zu halten und gleichzeitig einen hellen Hintergrund mit Speedlight abzudunkeln (ohne HSS), ist eine klassische Steuerung…',
      answers: {
        c: 'Nur ISO zu erhöhen und die Blende immer weiter zu öffnen',
        a: 'Die Verschlusszeit Richtung X-Sync zu erhöhen (senkt Ambient; Blitz bleibt ähnlich)',
        b: 'Nur ins Objektiv zu zoomen ohne Belichtung zu ändern',
        d: 'Den Blitz auszuschalten und zu warten',
      },
      explanation:
        'Unterhalb der X-Sync steuert der Verschluss vor allem Ambient; Blende/ISO/Leistung steuern den Blitz. Eine schnellere Zeit (noch ≤ Sync) verdunkelt Ambient, ohne den Blitz genauso zu „töten“.',
      imageAlt: 'Fotograf arbeitet mit Kamera im Freien',
      imageCredit: unsplashCredit,
    },
    'flash-17': {
      text: 'Manuelle Blitzleistung (z. B. 1/1 → 1/2) ändert die Ausgabe typischerweise um etwa…',
      answers: {
        b: 'Zehn Blenden',
        a: 'Eine Blende',
        c: 'Keinen messbaren Unterschied',
        d: 'Genau nur 0,1 EV',
      },
      explanation:
        'Halbieren der Leistung ist ungefähr −1 EV Blitzbelichtung (sonst gleich). Feineinstellung nutzt oft 1/3-Stufen an modernen Geräten.',
      imageAlt: 'Vintage-Kamera-Kultur und Licht',
      imageCredit: unsplashCredit,
    },
    'flash-18': {
      text: 'Einen Spritzer oder einen Tänzer mit Blitz einzufrieren hängt meist ab von…',
      answers: {
        d: 'Nur einer 30-Sekunden-Belichtung',
        a: 'Kurzer Blitzdauer (oft bei geringerer Leistung) als effektivem Verschluss',
        b: 'Nur Dauerlicht-LED-Einstelllampen',
        c: 'Alle Lichtmodifier zu deaktivieren',
      },
      explanation:
        'Bei dunklem Ambient friert die Blitzdauer — nicht der mechanische Verschluss — die Aktion ein. Geringere Leistung verkürzt bei Speedlights oft die Dauer.',
      imageAlt: 'Porträt mit scharfen Blitz-Catchlights',
      imageCredit: unsplashCredit,
    },
    'flash-19': {
      text: 'Rote Augen mit On-Camera-Blitz entstehen vor allem durch…',
      answers: {
        a: 'Einen Blitz nah an der Objektivachse, der die Netzhaut beleuchtet',
        b: 'Nur zu viel Bounce an eine weiße Decke',
        c: 'Nur Funkauslöser im Freien',
        d: 'Ausschließlich in RAW zu fotografieren',
      },
      explanation:
        'Achsnaher Blitz reflektiert von der Netzhaut. Off-Camera, Bounce oder Vorblitze, die die Pupille schließen, reduzieren Rote Augen.',
    },
    'flash-20': {
      text: 'Ein Snoot an einem Studio-Licht erzeugt typischerweise…',
      answers: {
        c: 'Automatisch Softbox-Licht aus dem Blitz',
        a: 'Einen kleinen, kontrollierten Lichtfleck (Haar, Akzent, Produkt-Hotspot)',
        b: 'Einen breiten Strahl wie ein nackter Schirm',
        d: 'Nur Kühlung der Blitzröhre',
      },
      explanation:
        'Snoots bündeln Licht in einen engen Kreis: Akzente und Produkt-Highlights, kein breites weiches Key.',
      imageAlt: 'Detail optischer Ausrüstung',
      imageCredit: unsplashCredit,
    },
    'flash-21': {
      text: 'Welche Praktiken helfen zu kohärenten Multi-Licht-Belichtungen im Studio?',
      answers: {
        a: 'Nach dem Setzen des Keys Verhältnisse messen oder chimpen, dann Fill/Rim hinzufügen',
        b: 'ISO und Blende bewusst halten, während du die Leistungen justierst',
        c: 'Jede Leuchte bei jedem Frame zufällig auf TTL stellen',
        d: 'Recyclingzeiten ignorieren und immer so schnell wie möglich auslösen',
      },
      explanation:
        'Baue vom Key aus, steuere Verhältnisse absichtlich und achte auf Recycling: zufälliges TTL an jedem Kopf kämpft gegen Kohärenz.',
      imageAlt: 'Porträtmotiv unter kontrollierten Lichtern',
      imageCredit: unsplashCredit,
    },
    'flash-22': {
      text: 'Dauerlicht-LED-Panels vs. Studio-Blitzanlagen — ein fairer Vergleich ist…',
      answers: {
        a: 'LEDs sind leicht vorzuschauen; Blitze gewinnen oft beim Einfrieren und beim Dominieren von Sonne',
        b: 'Blitze können keine Modifier nutzen',
        c: 'LEDs haben immer kürzere Dauern als ein Speedlight bei 1/128',
        d: 'Nur LEDs funktionieren mit Softboxes',
      },
      explanation:
        'What-you-see-is-what-you-get begünstigt Dauerlicht; Spitzenleistung und kurzer Impuls begünstigen Blitze bei Action und zum Dominieren von Tageslicht.',
    },
    'flash-23': {
      text: 'Beauty-Setups mit Kreuzlicht / Clamshell platzieren das Fill typischerweise…',
      answers: {
        b: 'Nur hinter dem Hintergrundpapier',
        a: 'Unter dem Kinn / unter dem Key, um Augenhöhlen zu öffnen und Schatten anzuheben',
        c: 'Nur als nackte Sonne im Freien',
        d: 'Am Boden immer 1/1 nach oben gerichtet',
      },
      explanation:
        'Clamshell kombiniert Key oben mit Fill unten (Reflektor oder weiche Quelle) für helles, ebenes Beauty-Licht — immer noch nicht schattenfrei.',
      imageAlt: 'Beauty-Stil-Porträtbeleuchtung',
      imageCredit: unsplashCredit,
    },
    'flash-24': {
      text: 'Mythos: „Mit Blitz im Innenraum wird der Hintergrund immer schwarz.“ Bessere Nuance?',
      answers: {
        c: 'Blitz löscht Ambient für immer aus',
        a: 'Du kannst Ambient mit längerer Verschlusszeit / höherem ISO / offenerer Blende balancieren, während der Blitz das Motiv belichtet',
        b: 'Nur ein gelierter Blitz kann etwas Ambient zeigen',
        d: 'Hintergründe werden physisch von Photonen entfernt',
      },
      explanation:
        'Schwarze Hintergründe entstehen, wenn Ambient „ertränkt“ wird (schneller Verschluss, niedriger ISO, geschlossene Blende). Den Verschluss ziehen (innerhalb der Unschärfe-Toleranz) hält Raumlicht in der Mischung.',
      imageAlt: 'Innenraumszenen mit vorhandenem Licht',
      imageCredit: unsplashCredit,
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

if (count !== 184) throw new Error(`expected 184 LS, got ${count}`);

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`OK: wrote ${count} LocalizedString.de on flash-studio`);

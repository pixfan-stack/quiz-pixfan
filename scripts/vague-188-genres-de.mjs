#!/usr/bin/env node
/**
 * Vague 1.88 — add LocalizedString.de for pack genres (226 LS).
 * Idempotent: overwrites de with the canonical scolaire DE copy.
 * Vocab aligns with guides/genres-photo article.de
 * (Porträt / Straße / Landschaft / Makro / Dokumentarfotografie) and
 * sharePreview LABELS.de « Fotogenres » + hub scolaires « Quiz Genres ».
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'genres');
if (!pack) throw new Error('genres not found');

const unsplash = 'Unsplash — freie Nutzung (Unsplash-Lizenz)';
const unsplashPhoto = 'Foto: Unsplash';

const de = {
  title: 'Fotogenres',
  description:
    'Porträt, Street, Landschaft, Makro… erkenne das Handwerk hinter jedem Stil.',
  questions: {
    'gen-1': {
      text: 'Straßenfotografie zeichnet sich vor allem aus durch…',
      answers: {
        d: 'Fotos ausschließlich nachts mit Blitz',
        a: 'Ungestellte Szenen des öffentlichen Lebens, oft ohne Pose',
        b: 'Nur Studiohintergründe mit Stadtskyline',
        c: 'Pflichtmäßigen Einsatz von Drohnen',
      },
      explanation:
        'Street-Fotografie fängt ungestellte öffentliche Momente ein — Geste, Ironie, Geometrie — meist mit vorhandenem Licht und diskreter Ausrüstung.',
      imageAlt: 'Porträtfotografie-Session',
      imageCredit: unsplash,
    },
    'gen-2': {
      text: 'Welche Praktiken sind in der Porträtfotografie üblich?',
      answers: {
        a: 'Licht im Gesicht steuern (Hauptlicht / Aufhellung / Gegenlicht)',
        c: 'Immer die kleinste Blende ohne Absicht nutzen',
        b: 'Ausdruck, Pose und Verbindung zum Motiv beachten',
        d: 'Hintergrund und Schärfentiefe wählen, um die Person freizustellen',
      },
      explanation:
        'Ein gutes Porträt balanciert Licht, Ausdruck und Freistellung vom Hintergrund. Die Blende ist eine kreative Wahl, keine feste Regel.',
      imageAlt: 'Straßenfotografie-Szene',
      imageCredit: unsplash,
    },
    'gen-3': {
      text: 'Makrofotografie dreht sich vor allem um…',
      answers: {
        c: 'Videobildraten über 1000 fps',
        b: 'Nur ganze Städte aus dem Weltraum fotografieren',
        d: 'Nur mit einem 600-mm-Objektiv aus großer Distanz schießen',
        a: 'Extreme Nahaufnahmen kleiner Motive bei starker Vergrößerung',
      },
      explanation:
        'Echte Makro erreicht oft ~1:1 (Motiv lebensgroß auf dem Sensor): Insekten, Texturen, Details. Focus Stacking ist häufig.',
      imageAlt: 'Sonnenlicht zwischen den Bäumen',
      imageCredit: unsplash,
    },
    'gen-4': {
      text: 'In der Landschaftsfotografie ist ein häufiger Grund für ein Stativ…',
      answers: {
        a: 'Die Kamera bei langen Belichtungen oder präzisem Bildausschnitt stabil zu halten',
        b: 'Die Megapixel des Sensors zu erhöhen',
        d: 'Den Bedarf an einem Objektiv zu ersetzen',
        c: 'Die Himmelsfarbe automatisch zu ändern',
      },
      explanation:
        'Ein Stativ ermöglicht scharfe Langzeitbelichtungen (Wasser, wenig Licht, ND-Filter) und sorgfältige Mehrfachaufnahmen (Bracketing, Panoramen).',
      imageAlt: 'Wüstenlandschaft',
      imageCredit: unsplash,
    },
    'gen-5': {
      text: 'Welche Herausforderungen sind typisch für die Tierfotografie?',
      answers: {
        c: 'Wildtiere und Lebensräume respektieren (Ethik / Distanz)',
        a: 'Lange Brennweiten und Motivdistanz',
        d: 'Pflicht-Softboxen im Studio an jedem Tier',
        b: 'Schnelle Verschlusszeiten für Tierbewegung',
      },
      explanation:
        'Tierfotografie mischt Tele-Reichweite, Timing, Geduld und Ethik. Studio-Softboxen sind nicht der Feldstandard.',
      imageAlt: 'Wildtier-Motiv im natürlichen Lebensraum',
      imageCredit: unsplash,
    },
    'gen-6': {
      text: 'Was definiert „Fine-Art-Fotografie“?',
      answers: {
        c: 'Fotos mit teurer Ausrüstung',
        b: 'Nur Schwarzweißfotos',
        d: 'Kommerzielle Werbebilder',
        a: 'Fotografie, die die Vision oder das Konzept des Künstlers ausdrückt',
      },
      explanation:
        'Fine-Art-Fotografie stellt kreativen Ausdruck über Dokumentation und wird oft in Galerien und Museen gezeigt.',
    },
    'gen-7': {
      text: 'Was sind die Schlüsselherausforderungen der Sportfotografie?',
      answers: {
        d: 'Nur natürliches Licht nutzen',
        b: 'Höhepunkte vorausahnen',
        a: 'Schnelle Verschlusszeiten, um Aktion einzufrieren',
        c: 'Mit wechselndem Licht arbeiten (innen/außen)',
      },
      explanation:
        'Sportfotografie verlangt technisches Können, Antizipation und Anpassung an wechselnde Bedingungen.',
      imageAlt:
        'Athlet in Bewegung — Timing und Verschluss in der Sportfotografie',
      imageCredit: unsplash,
    },
    'gen-8': {
      text: 'Was ist „Food Styling“ in der Food-Fotografie?',
      answers: {
        b: 'Das Essen vor dem Shooting kochen',
        d: 'Rezepte erstellen',
        a: 'Essen für die Kamera anrichten und optisch aufwerten',
        c: 'Restaurants kritisieren',
      },
      explanation:
        'Food Stylisten nutzen Techniken wie Glyzerin für Dampf, Zahnstocher für Struktur und Licht, damit Essen appetitlich wirkt.',
      imageAlt: 'Gestylter Essteller bereit für ein Food-Foto-Setup',
      imageCredit: unsplash,
    },
    'gen-9': {
      text: 'Was macht „Dokumentarfotografie“ anders als andere Genres?',
      answers: {
        b: 'Sie nutzt immer Schwarzweiß',
        a: 'Sie will Ereignisse und soziale Realitäten wahrheitsgetreu festhalten',
        c: 'Sie ist ausschließlich studio-basiert',
        d: 'Sie fokussiert nur auf Landschaften',
      },
      explanation:
        'Dokumentarfotografie wirkt als visueller Journalismus und erzählt reale Geschichten mit ethischer Verantwortung gegenüber den Motiven.',
    },
    'gen-10': {
      text: 'Welche Ausrüstung wird in der Astrofotografie häufig genutzt?',
      answers: {
        b: 'Sternen-Tracker (Star Tracker)',
        c: 'Weitwinkel- oder Astro-Objektive',
        a: 'Stativ',
        d: 'Makroobjektiv',
      },
      explanation:
        'Astrofotografie braucht Stabilität (Stativ), Nachführung für lange Belichtungen und lichtstarke Weitwinkel. Makro ist für Nahaufnahmen.',
      imageAlt: 'Sternenhimmel für Astrofotografie',
      imageCredit: unsplash,
    },
    'gen-11': {
      text: 'Worauf konzentriert sich „Modefotografie“ vor allem?',
      answers: {
        a: 'Kleidung, Accessoires und Stil zu zeigen',
        d: 'Modenschauen zu dokumentieren',
        b: 'Modegeschichte zu dokumentieren',
        c: 'Nur Stofftexturen zu fotografieren',
      },
      explanation:
        'Modefotografie verkauft Lifestyle und Aspiration und verbindet Kleidungspräsentation mit künstlerischer Vision.',
      imageAlt: 'Gestylte Modepose — Fokus editorialer Modefotografie',
      imageCredit: unsplash,
    },
    'gen-12': {
      text: 'Was sind Merkmale der „Architekturfotografie“?',
      answers: {
        c: 'Fokus auf Symmetrie und Geometrie',
        a: 'Betonung von Linien, Formen und Volumen',
        d: 'Immer nachts aufgenommen',
        b: 'Oft Tilt-Shift zur Perspektivsteuerung',
      },
      explanation:
        'Architekturfotografie feiert Design durch sorgfältige Komposition, Perspektivkorrektur und Beleuchtung.',
      imageAlt: 'Linien der gebauten Umwelt — Geometrie der Architekturfotografie',
      imageCredit: unsplash,
    },
    'gen-13': {
      text: 'Was ist „konzeptuelle Fotografie“?',
      answers: {
        b: 'Fotos mit konzeptuellen Objektiven',
        c: 'Abstrakte Kamerabewegungen',
        a: 'Fotografie, die eine Idee oder Botschaft über ästhetischen Reiz stellt',
        d: 'Fotografie ohne Kamera',
      },
      explanation:
        'Konzeptuelle Fotografie priorisiert Ideen — oft mit gestellten Szenen, Symbolik oder Manipulation, um Botschaften zu transportieren.',
    },
    'gen-14': {
      text: 'Worum geht es in der Ethik-Debatte der „Straßenfotografie“?',
      answers: {
        b: 'Kameramarken-Vorlieben',
        d: 'Bildbearbeitungstechniken',
        c: 'Objektivwahl',
        a: 'Privatsphäre vs. Meinungsfreiheit im öffentlichen Raum',
      },
      explanation:
        'Fotografen balancieren das Dokumentieren des öffentlichen Lebens mit dem Respekt vor Privatsphäre und Würde der Menschen.',
    },
    'gen-15': {
      text: 'Was definiert „Luftfahrtfotografie“?',
      answers: {
        c: 'Braucht oft Teleobjektive',
        b: 'Erfordert schnelle Verschlusszeiten',
        a: 'Flugzeuge im Flug oder am Boden fotografieren',
        d: 'Nur aus Flugzeugen aufgenommen',
      },
      explanation:
        'Luftfahrtfotografie hält Flugzeuge fest und verlangt Tempo, Reichweite und oft spezialisierte Orte wie Flugplätze.',
    },
    'gen-16': {
      text: 'Was ist das Hauptziel der „Produktfotografie“?',
      answers: {
        c: 'Abstrakte Kunst schaffen',
        b: 'Fertigungsprozesse dokumentieren',
        a: 'Produkte attraktiv für kommerzielle Zwecke zeigen',
        d: 'Fabrikgebäude fotografieren',
      },
      explanation:
        'Produktfotografie treibt Verkäufe an, indem Artikel im besten Licht präsentiert und Merkmale sowie Qualität betont werden.',
    },
    'gen-17': {
      text: 'Was ist die besondere Herausforderung der „Unterwasserfotografie“?',
      answers: {
        b: 'Fische schwimmen immer weg',
        c: 'Kameras sinken von allein',
        a: 'Wasser absorbiert Licht und führt mit der Tiefe zu Farbverlust',
        d: 'Wasserdichte Gehäuse verzerren alle Bilder',
      },
      explanation:
        'Rote Wellenlängen werden unter Wasser zuerst absorbiert; Blitze oder Weißabgleich helfen, natürliche Farben wiederherzustellen.',
    },
    'gen-18': {
      text: 'Welche Fähigkeiten zählen in der Eventfotografie?',
      answers: {
        d: 'Nur Blitz nutzen',
        c: 'Diskretion und Professionalität',
        a: 'Schlüsselmomente vorausahnen',
        b: 'In wechselnden Lichtbedingungen arbeiten',
      },
      explanation:
        'Eventfotografen müssen anpassungsfähig, diskret und geübt darin sein, spontane Momente einzufangen.',
    },
    'gen-19': {
      text: 'Was revolutioniert die „Drohnenfotografie“?',
      answers: {
        d: 'Studio-Porträts',
        a: 'Luftperspektiven, die früher Helikopter brauchten',
        c: 'Makrofotografie',
        b: 'Unterwasserfotografie',
      },
      explanation:
        'Drohnen demokratisierten die Luftbildfotografie und ermöglichen einzigartige Perspektiven für Immobilien, Landschaft und Events.',
      imageAlt:
        'Erhöhter Landschaftsausblick — Drohnen- / Luftbild-Blickwinkel',
      imageCredit: unsplash,
    },
    'gen-20': {
      text: 'Was unterscheidet „Nachtfotografie“ von der Tagesarbeit?',
      answers: {
        c: 'Oft höheres ISO nötig',
        d: 'Funktioniert nur in Städten',
        b: 'Arbeitet mit künstlichen Lichtquellen',
        a: 'Braucht längere Belichtungen und Stative',
      },
      explanation:
        'Nachtfotografie verlangt andere Techniken: Stabilität, Lichtmanagement und Rauschkontrolle.',
      imageAlt: 'Nächtliche Stadtskyline — Kompromisse der Nachtfotografie',
      imageCredit: unsplash,
    },
    'gen-21': {
      text: 'Gute Straßenfotografie fühlt sich meist an wie…',
      answers: {
        c: 'Nur ewig das eigene Spiegelbild fotografieren',
        d: 'Ausschließlich Makro von Insekten',
        a: 'Ein gestelltes Mode-Set mit drei Assistenten',
        b: 'Eine flüchtige echte Geometrie oder Geste im öffentlichen Raum einfangen',
      },
      explanation:
        'Street lebt von Timing und öffentlichem Leben — nicht von einem vollen Studio-Team.',
      imageAlt: 'Urbane Straßenszene',
      imageCredit: unsplash,
    },
    'gen-22': {
      text: 'Stadt bei Nacht ohne Stativ: Was ist der ehrliche Kompromiss?',
      answers: {
        c: 'Du musst auf Fischauge wechseln',
        d: 'Nach 22 Uhr ist nur Schwarzweiß erlaubt',
        b: 'Höheres ISO und/oder offenere Blende gegen mehr Rauschen oder geringere Schärfentiefe',
        a: 'Es gibt keinen Kompromiss; nachts ist Freihändig bei ISO 100 leicht',
      },
      explanation:
        'Ohne Stativ kaufst du Verschlusszeit mit ISO und Blende — und zahlst mit Rauschen oder Schärfentiefe.',
      imageAlt: 'Nächtliche Stadtskyline',
      imageCredit: unsplash,
    },
    'gen-23': {
      text: 'Welche Gewohnheiten helfen bei candidem Porträt / Lifestyle?',
      answers: {
        a: 'Weniger reden, echte Mikrogesten beobachten',
        d: 'Vorhandenes Fensterlicht nutzen, bevor der Blitz knallt',
        b: 'Hintergründe möglichst einfach halten',
        c: '40 Bilder lang ein falsches Lachen erzwingen',
      },
      explanation:
        'Echte Momente schlagen dirigierte Grins-Marathons — Licht und Hintergrund machen die halbe Arbeit.',
    },
    'gen-24': {
      text: 'Der Kunde will „dokumentarische“ Hochzeitsabdeckung. Was bedeutet das?',
      answers: {
        a: 'Nur gestelltes Studio-Licht den ganzen Tag',
        b: 'Beobachten und Momente mit minimaler Inszenierung vorausahnen',
        c: 'Nur Drohnen-Aufsichten vom Veranstaltungsort',
        d: 'Nur Schwarzweißfilm für immer',
      },
      explanation:
        'Dokumentarisch priorisiert echte Momente gegenüber starker Regie.',
      imageAlt: 'Candid-Hochzeitsmoment',
      imageCredit: unsplash,
    },
    'gen-25': {
      text: 'Mythos: „Street muss konfrontativ sein.“ Bessere Einordnung?',
      answers: {
        a: 'Stimmt — Fremde immer aggressiv stoppen',
        b: 'Street kann ruhige Beobachtung des öffentlichen Lebens sein, mit Ethik und lokalem Recht im Blick',
        c: 'Street existiert nur mit Fischaugenobjektiven',
        d: 'Street heißt nur Schilder fotografieren',
      },
      explanation:
        'Ansätze variieren; Respekt und Rechtmäßigkeit zählen mehr als Aggression.',
      imageAlt: 'Urbane Straßenszene',
      imageCredit: unsplash,
    },
    'gen-26': {
      text: 'Tierfotografie: Tier halb versteckt im Gestrüpp. Priorität für ein brauchbares Bild?',
      answers: {
        a: 'Himmelshighlights im Hintergrund ausbrennen',
        b: 'Klarer Blickkontakt / Catchlight und genug Verschluss, um Mikrobewegung einzufrieren',
        c: 'Den Lebensraum immer wegschneiden',
        d: 'Nachts Blitz auf Nestlinge ohne Rücksicht',
      },
      explanation:
        'Lesbare Augen und scharfe Momente schlagen einen belebten, aber weichen Rahmen.',
    },
    'gen-27': {
      text: 'Packshot auf Weiß: Kanten wirken grau. Wahrscheinliche Ursache?',
      answers: {
        a: 'Zu viel Trennlicht auf dem Hintergrund',
        b: 'Hintergrund unterbelichtet relativ zum Produkt — Hintergrundlichter anheben',
        c: 'RAW statt JPEG nutzen',
        d: 'Objektiv zu scharf',
      },
      explanation:
        'Echtes nahtloses Weiß braucht den Hintergrund heller als die Motivkanten.',
    },
    'gen-28': {
      text: 'Architektur-Innenraum: Vertikalen kippen. Schnellste Korrektur an der Kamera?',
      answers: {
        a: 'Die Kamera aggressiver neigen',
        b: 'Sensor parallel zu den Wänden halten / Shift-Objektiv nutzen oder sorgfältig ausrichten',
        c: 'Immer vom Boden nach oben schießen',
        d: 'Die kleinste JPEG-Einstellung nutzen',
      },
      explanation:
        'Parallele Ebenen verhindern Keystoning; Shift-Objektive helfen, wenn man nicht zurücktreten kann.',
      imageAlt:
        'Hohe Stadtvertikalen bei Nacht — Neigungskontrolle Architektur innen/außen',
      imageCredit: unsplash,
    },
    'gen-29': {
      text: 'Dokumentarische Street in Frankreich: candid Geste ohne Inszenierung. Beste ethische + handwerkliche Haltung?',
      answers: {
        b: 'Fremde immer konfrontieren und für die „Wahrheit“ posieren lassen',
        a: 'Vorausahnen, untertauchen, Würde achten; wissen, wann identifizierbare private Momente nicht veröffentlicht werden',
        d: 'Nur vom Dach mit 600 mm schießen — nie in die Szene gehen',
        c: 'Jedes Gesicht unabhängig vom Kontext veröffentlichen',
      },
      explanation:
        'Street-Handwerk ist Antizipation und Präsenz; Ethik ist Würde und Kontext — besonders beim Veröffentlichen.',
      imageAlt: 'Belebte urbane Straßenszene für Candid-Fotografie',
      imageCredit: unsplashPhoto,
    },
    'gen-30': {
      text: 'Porträt bei natürlichem Licht draußen mittags. Hartes Zenit-Sonnenlicht. Beste genre-bewusste Korrektur?',
      answers: {
        a: 'Offener Schatten / Diffusor / Aufhellung; Catchlights ohne Waschbären-Augen',
        c: 'Drei Stufen unterbelichten und Haut platt machen',
        b: 'Nur Kamera-Blitz steil nach oben erzwingen',
        d: 'Immer auf die Blaue Stunde warten — Mittag ist für immer unbrauchbar',
      },
      explanation:
        'Das Genre Porträt priorisiert schmeichelhaftes Gesichtslight. Mittagssonne weichzeichnen oder aufhellen — nicht nur ertragen.',
      imageAlt: 'Weiches Porträt bei natürlichem Licht',
      imageCredit: unsplashPhoto,
    },
    'gen-31': {
      text: 'Welche Hinweise helfen, editoriale Mode von dokumentarischem Porträt zu unterscheiden?',
      answers: {
        a: 'Styling, Art Direction und kontrollierte Orte in der Mode',
        b: 'Beobachtendes Licht und weniger gestellte Gesten im Dokumentarischen',
        c: 'Beide Genres nutzen immer dieselben Blitz-Setups',
        d: 'Absicht: einen Look verkaufen vs. ein Leben/eine Situation beschreiben',
      },
      explanation:
        'Genres handeln von Absicht und Kontrollgrad, nicht nur von Kameras.',
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

if (count !== 226) throw new Error(`expected 226 LS, got ${count}`);

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`OK: wrote ${count} LocalizedString.de on genres`);

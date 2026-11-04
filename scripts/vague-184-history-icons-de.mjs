#!/usr/bin/env node
/**
 * Vague 1.84 — add LocalizedString.de for pack history-icons (192 LS).
 * Idempotent: overwrites de with the canonical scolaire DE copy.
 * Aligns with guide histoire-photo article.de « Geschichte & Ikonen »
 * and CTA « Geschichte- & Ikonen-Quiz starten ».
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'history-icons');
if (!pack) throw new Error('history-icons not found');

const unsplashCredit = 'Unsplash — freie Nutzung (Unsplash-Lizenz)';

const de = {
  title: 'Geschichte & Ikonen',
  description:
    'Von den ersten Fotografien bis zu den Legenden, die unseren Blick geformt haben.',
  questions: {
    'hist-1': {
      text: 'Wem wird allgemein die älteste erhaltene Fotografie zugeschrieben (Heliographie, 1820er)?',
      answers: {
        b: 'Ansel Adams (Landschaft)',
        c: 'Steve Jobs (Informatiker)',
        a: 'Nicéphore Niépce (Heliographie)',
        d: 'Nur Henri Cartier-Bresson',
      },
      explanation:
        'Niépces Blick aus dem Fenster in Le Gras (ca. 1826–27) ist die älteste bekannte erhaltene Fotografie. Daguerre popularisierte danach die Daguerreotypie.',
      imageAlt: 'Klassische Kamera',
      imageCredit: unsplashCredit,
    },
    'hist-2': {
      text: 'Henri Cartier-Bresson wird vor allem mit welcher Idee verbunden?',
      answers: {
        c: 'Nur Studio-Modelicht',
        b: 'Der Erfindung digitaler Sensoren',
        a: 'Dem „entscheidenden Moment“ in Straßen- / Reportagefotografie',
        d: 'Ausschließlich Unterwasserfauna',
      },
      explanation:
        'Cartier-Bresson formulierte den entscheidenden Moment: den Höhepunkt von Aktion und Geometrie in einem einzigen, perfekt getimten Bild festzuhalten.',
      imageAlt: 'Vintage-Fotografieausrüstung',
      imageCredit: unsplashCredit,
    },
    'hist-3': {
      text: 'Welche Fotografen sind für Schwarzweiß-Landschaft oder Dokumentararbeit berühmt?',
      answers: {
        d: 'Sebastião Salgado (Reportage)',
        b: 'Dorothea Lange (Dokumentar)',
        a: 'Ansel Adams (Landschaften)',
        c: 'Nur Smartphone-UI-Designer',
      },
      explanation:
        'Adams (Landschaften, Zone System), Lange (Dokumentar der Großen Depression) und Salgado (epische SW-Reportage) sind Pfeiler des Mediums.',
      imageAlt: 'Alte Bücher und Papiere',
      imageCredit: unsplashCredit,
    },
    'hist-4': {
      text: 'Welche Agentur gründete Cartier-Bresson 1947 mit anderen legendären Fotografen mit?',
      answers: {
        d: 'Nur einen Leica-Markenladen',
        b: 'die NASA',
        a: 'Magnum Photos (Kooperative)',
        c: 'Instagram (soziales Netzwerk)',
      },
      explanation:
        'Magnum Photos (1947) wurde von Cartier-Bresson, Robert Capa, George Rodger und David „Chim“ Seymour mitgegründet — eine Kooperative im Besitz der Fotografen.',
      imageAlt: 'Vintage-Fotoalben',
      imageCredit: unsplashCredit,
    },
    'hist-5': {
      text: 'Annie Leibovitz ist vor allem bekannt für…',
      answers: {
        c: 'Nur Architekturpläne',
        d: 'Sport-Foto-Finish-Systeme',
        a: 'Ikonische Celebrity- und Kulturporträts',
        b: 'Die Erfindung des ersten digitalen Kamerasensors',
      },
      explanation:
        'Leibovitz’ Arbeit für Rolling Stone, Vanity Fair und darüber hinaus prägte das moderne Celebrity-Porträt — stark inszeniert und filmisch.',
      imageAlt: 'Vintage-Kamera — Ikonen der Fotogeschichte',
      imageCredit: unsplashCredit,
    },
    'hist-6': {
      text: 'Die Daguerreotypie (popularisiert durch Louis Daguerre) war…',
      answers: {
        d: 'Ein RAW-Dateiformat von 2010',
        a: 'Ein frühes fotografisches Verfahren mit einem Unikat auf versilberter Platte',
        b: 'Eine Art moderner Zoom',
        c: 'Ein soziales Netzwerk für Fotografen',
      },
      explanation:
        'Öffentlich angekündigt 1839, erzeugte die Daguerreotypie ein detailliertes Unikatpositiv auf versilberter Kupferplatte — Meilenstein der populären Fotografie.',
      imageAlt: 'Vintage-Kamera, die frühe fotografische Verfahren evoziert',
      imageCredit: unsplashCredit,
    },
    'hist-7': {
      text: 'Wer erfand die Kodak Brownie-Kamera?',
      answers: {
        a: 'George Eastman / die Firma Kodak',
        c: 'Louis Daguerre (Daguerreotypie)',
        b: 'Ansel Adams (Landschaft)',
        d: 'Henri Cartier-Bresson (Reportage)',
      },
      explanation:
        '1900 eingeführt, machte die Brownie Fotografie für Kinder und Amateure zugänglich — zum Preis von 1 Dollar.',
      imageAlt: 'Klassisches Kameragehäuse — demokratisierte Snapshot-Kultur',
      imageCredit: unsplashCredit,
    },
    'hist-8': {
      text: 'Wer erfand die erste Digitalkamera?',
      answers: {
        a: 'Steven Sasson bei Kodak 1975',
        b: 'Steve Jobs bei Apple',
        c: 'die NASA für Weltraumfotografie',
        d: 'Canon in Japan (Kamerahersteller)',
      },
      explanation:
        'Steven Sassons Kodak-Prototyp wog etwa 3,6 kg, brauchte 23 Sekunden für ein Bild und speicherte auf Kassette.',
    },
    'hist-9': {
      text: 'Welche Fotografen dokumentierten die Große Depression?',
      answers: {
        d: 'Richard Avedon (Mode/Porträt)',
        b: 'Walker Evans (Dokumentar)',
        c: 'Arthur Rothstein (FSA)',
        a: 'Dorothea Lange (FSA)',
      },
      explanation:
        'Lange („Migrant Mother“), Evans und Rothstein fotografierten Armut der Depressionszeit für die Farm Security Administration.',
      imageAlt: 'Dokumentarische Landschaftsstimmung — Tradition der Krisenfotografie',
      imageCredit: unsplashCredit,
    },
    'hist-10': {
      text: 'Welche Bedeutung hat die Ausstellung „The Family of Man“?',
      answers: {
        b: 'Sie führte die Digitalfotografie ein',
        c: 'Sie war die erste Modenschau',
        a: 'Sie war die meistbesuchte Fotoausstellung der Geschichte',
        d: 'Sie zeigte nur Landschaftsfotografie',
      },
      explanation:
        'Kuratiert von Edward Steichen 1955, reiste sie weltweit und erreichte 9 Millionen Besucher — Feier universeller menschlicher Erfahrungen.',
    },
    'hist-11': {
      text: 'Wer förderte Fotografie als Kunst mit der Gruppe Photo-Secession?',
      answers: {
        b: 'Pablo Picasso (Maler)',
        a: 'Alfred Stieglitz (Photo-Secession)',
        d: 'Thomas Edison (Erfinder)',
        c: 'Walt Disney (Animation)',
      },
      explanation:
        'Stieglitz förderte Fotografie als Bildende Kunst über seine Galerie „291“ und Publikationen wie Camera Work.',
    },
    'hist-12': {
      text: 'Welche ikonischen Kriegsfotos prägten die öffentliche Meinung?',
      answers: {
        b: 'Migrant Mother — Dorothea Lange',
        d: 'Earthrise — William Anders (Apollo 8)',
        c: 'Tank Man — unbekannter Fotograf (Tiananmen)',
        a: 'Napalm Girl — Nick Ut (Vietnamkrieg)',
      },
      explanation:
        'Napalm Girl und Tank Man wirkten direkt auf Kriegswahrnehmung und Politik. Migrant Mother beeinflusste die Depressionshilfe; Earthrise das Umweltbewusstsein.',
    },
    'hist-13': {
      text: 'Wer entwickelte das Zone System?',
      answers: {
        c: 'Steve Jobs und Steve Wozniak',
        b: 'Henry Leibovitz und Annie Adams',
        d: 'Cartier-Bresson und Capa (Reportage)',
        a: 'Ansel Adams und Fred Archer (Zone System)',
      },
      explanation:
        'Das Zone System teilt Tonwerte in 11 Zonen (0-Schwarz bis X-Weiß) und gibt präzise Kontrolle über Belichtung und Entwicklung.',
      imageAlt: 'Dramatische Tonlandschaft — Terrain des Zone Systems',
      imageCredit: unsplashCredit,
    },
    'hist-14': {
      text: 'Wer gilt als Vater der modernen Fotografie?',
      answers: {
        b: 'Leonardo da Vinci (Künstler)',
        c: 'Albert Einstein (Physiker)',
        d: 'Thomas Edison (Erfinder)',
        a: 'Alfred Stieglitz oder Eugène Atget (umstritten)',
      },
      explanation:
        'Stieglitz erhob Fotografie zur Kunst; Atget dokumentierte Paris. Beide prägten die Entwicklung der modernen Fotografie stark.',
    },
    'hist-15': {
      text: 'Welchen Einfluss hatte Instagram auf die Fotografie?',
      answers: {
        d: 'Es machte Kameras überflüssig',
        b: 'Es popularisierte quadratische Formate',
        c: 'Es machte Filter und Ästhetik mainstream',
        a: 'Es demokratisierte Fotografie und Teilen',
      },
      explanation:
        'Instagram verwandelte Fotografie in eine soziale Bildsprache. Smartphones ersetzten Dedicated Cameras für Gelegenheitsnutzer.',
      imageAlt: 'Social-Media-Ikone — Einfluss von Instagram auf die Fotografie',
      imageCredit: unsplashCredit,
    },
    'hist-16': {
      text: 'Wer fotografierte den Kuss am „V-J Day in Times Square“?',
      answers: {
        a: 'Alfred Eisenstaedt (Life)',
        c: 'Henri Cartier-Bresson (Magnum)',
        b: 'Annie Leibovitz (Porträt)',
        d: 'Robert Capa (Krieg)',
      },
      explanation:
        '1945 in Life veröffentlicht, symbolisiert dieses ikonische Bild Erleichterung und Freude am Ende des Zweiten Weltkriegs — die Identitäten der Personen bleiben unbekannt.',
      imageAlt: 'Belebter Stadtplatz — ikonische Momente des Fotojournalismus',
      imageCredit: unsplashCredit,
    },
    'hist-17': {
      text: 'Was war die erste Fotografie eines menschlichen Gesichts?',
      answers: {
        c: 'Niépces Fensterblick',
        d: 'Ansel Adams’ Selbstporträt',
        a: 'Selbstporträt von Robert Cornelius (1839)',
        b: 'Porträt von Louis Daguerre',
      },
      explanation:
        'Robert Cornelius’ Daguerreotypie von 1839 gilt als erstes amerikanisches Selbstporträt und erste Fotografie einer Person.',
    },
    'hist-18': {
      text: 'Welche Fotografen werden mit dem Color Revival der 1970er–80er verbunden?',
      answers: {
        b: 'William Eggleston (Farbe)',
        d: 'Ansel Adams (SW-Landschaften)',
        c: 'Stephen Shore (Farbe)',
        a: 'Saul Leiter (Farbe)',
      },
      explanation:
        'Diese Künstler erhoben Farbfotografie vom Kommerz zur Bildenden Kunst. Egglestons MoMA-Ausstellung 1976 war wegweisend.',
    },
    'hist-19': {
      text: 'Welche Bedeutung hat die „Photographic History Collection“ des Smithsonian?',
      answers: {
        d: 'Fokus auf Modefotografie',
        b: 'Das erste Digitalarchiv',
        c: 'Eine reine Porträtsammlung',
        a: 'Eine der größten Sammlungen der Welt zur Bewahrung fotografischen Erbes',
      },
      explanation:
        'Das Smithsonian bewahrt über 1,4 Millionen Fotografien der gesamten Mediengeschichte — von Daguerreotypien bis Digital.',
    },
    'hist-20': {
      text: 'Welche technischen Fortschritte trieben die Evolution der Fotografie voran?',
      answers: {
        d: 'Dampfbetriebene Verschlüsse im 18. Jahrhundert',
        c: 'Bildverarbeitungssoftware',
        a: 'Digitale Sensoren',
        b: 'Autofokussysteme',
      },
      explanation:
        'Sensoren, Autofokus und Software verwandelten Aufnahme und Workflow. Dampfverschlüsse im 18. Jh. sind Fiktion — Fotografie beginnt im 19. Jahrhundert.',
    },
    'hist-21': {
      text: 'Der „entscheidende Moment“ ist vor allem mit welcher Idee verbunden?',
      answers: {
        a: 'Auf den Höhepunkt von Geste/Geometrie warten und einmal bewusst auslösen',
        b: '2000 Frames schießen und später nur in Lightroom wählen',
        d: 'Niemals durch den Sucher schauen',
        c: 'Immer Blitz mittags im Freien nutzen',
      },
      explanation:
        'Cartier-Bressons Phrase meint Timing und Sehen — nicht blindes Dauerfeuer.',
      imageAlt: 'Straßenszene — Streetfotografie des entscheidenden Moments',
      imageCredit: unsplashCredit,
    },
    'hist-22': {
      text: 'Warum streitet man noch über Doisneaus berühmtes Kussfoto?',
      answers: {
        b: 'Weil Inszenierung vs. Spontanität Ethik- und Legendenfragen aufwirft',
        c: 'Weil es keine Horizontlinie hat',
        a: 'Weil es mit einem Smartphone aufgenommen wurde',
        d: 'Weil ISO 100 damals in Frankreich illegal war',
      },
      explanation:
        'Das Bild ist ikonisch — und erinnert daran, dass ein „dokumentarisches“ Foto auch geführt sein kann.',
      imageAlt: 'Pariser Straßenatmosphäre — Debatten Inszenierung vs. Candid',
      imageCredit: unsplashCredit,
    },
    'hist-23': {
      text: 'Ansel Adams wird besonders verbunden mit…',
      answers: {
        b: 'Sorgfältigem Landschaftshandwerk, Tonkontrolle und Print-Meisterschaft',
        a: 'Party-Selfies mit Einwegkameras',
        c: 'Der Erfindung des Autofokus',
        d: 'Nur im grünen Automatikmodus zu fotografieren',
      },
      explanation:
        'Adams = geduldiges Landschaftssehen + obsessives Tonwert-Handwerk von der Aufnahme bis zum Print.',
      imageAlt: 'Dramatische Landschaft — Adams-artiger Tonkontrast',
      imageCredit: unsplashCredit,
    },
    'hist-24': {
      text: 'Kodaks Brownie (1900) war kulturell vor allem wichtig, weil sie…',
      answers: {
        b: 'Über Nacht Digitalsensoren erfand',
        d: 'Für immer nur Cyanotypien druckte',
        c: 'Alle professionellen Studios verbot',
        a: 'Snapshot-Fotografie billig und für Amateure zugänglich machte',
      },
      explanation:
        'Die Brownie-Welle demokratisierte Alltagfotografie — ein sozialer ebenso wie technischer Wandel.',
      imageAlt: 'Vintage-Kamera — Demokratisierung der Amateurfotografie',
      imageCredit: unsplashCredit,
    },
    'hist-25': {
      text: 'Magnum Photos (gegründet 1947) wird vor allem erinnert als…',
      answers: {
        a: 'Eine Kooperative, in der Fotografen Rechte und redaktionelle Stimme behielten',
        c: 'Eine Emulsionsfabrik nur in Rochester',
        d: 'Ein Smartphone-Filterpaket von 2015',
        b: 'Eine Kameramarke, die nur Einweg-Blitzwürfel verkaufte',
      },
      explanation:
        'Das Magnum-Modell stellt Autorschaft und Eigentum des Fotografen in den Mittelpunkt — Meilenstein der Reportagekultur.',
      imageAlt: 'Straßenszene — Reportage- und Agenturkultur',
      imageCredit: unsplashCredit,
    },
    'hist-26': {
      text: 'Wenn man sagt, Digital habe Analog in den 2000ern „über Nacht getötet“, lautet die faire Nuance…',
      answers: {
        c: 'Nur Einwegkameras überlebten nach Erfindung des JPEG',
        a: 'Die Übernahme war schrittweise — Workflows, Kosten und Kultur änderten sich über Jahre, nicht in einer Woche',
        b: 'Analog existierte physisch ab 2001 weltweit nicht mehr',
        d: 'Digital erreichte nie professionelle Redaktionen',
      },
      explanation:
        'Digital erschütterte Analogmärkte, aber der Übergang verlief gestaffelt nach Genres und Budgets.',
      imageAlt: 'Handheld-Kamera im Freien — Übergangsepoche Analog → Digital',
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

if (count !== 192) throw new Error(`expected 192 LS, got ${count}`);

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`OK: wrote ${count} LocalizedString.de on history-icons`);

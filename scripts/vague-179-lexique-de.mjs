#!/usr/bin/env node
/**
 * Vague 1.79 — add LocalizedString.de for pack lexique-image-fixe (74 LS).
 * Idempotent: overwrites de with the canonical toe-hold copy.
 * Aligns with scolaires hub DE CTA « Lexikon Standbild ».
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'lexique-image-fixe');
if (!pack) throw new Error('lexique-image-fixe not found');

const de = {
  title: 'Lexikon Standbild',
  description:
    'Bildausschnitt, Standpunkt, Einstellungsgröße, Index/Ikone — originales Vokabular für die Oberstufe Kunst (keine urheberrechtlich geschützten Werke).',
  questions: {
    'lex-01': {
      text: 'In der Fotografie meint „Bildausschnitt“ vor allem…',
      answers: {
        a: 'Zu wählen, was ins Bild kommt und was draußen bleibt',
        b: 'Nur einen Holzrahmen zu kaufen',
        c: 'Immer mit 1/1000 s zu fotografieren',
        d: 'Nur in Schwarzweiß zu drucken',
      },
      explanation:
        'Der Bildausschnitt entscheidet über Ein-/Ausschluss: Ränder, Zuschnitt und das, worauf der Blick gelenkt wird.',
    },
    'lex-02': {
      text: 'Ein tiefer Kamerastandpunkt mit Blick nach oben heißt oft…',
      answers: {
        a: 'Eine Froschperspektive (contre-plongée)',
        b: 'Eine Vogelperspektive (plongée)',
        c: 'Nur ein Dutch Angle',
        d: 'Eine Makroaufnahme',
      },
      explanation:
        'Froschperspektive = Kamera unten, Blick nach oben (oft monumental). Vogelperspektive = Kamera oben, Blick nach unten.',
    },
    'lex-03': {
      text: 'Eine Großaufnahme (gros plan) zeigt typischerweise…',
      answers: {
        a: 'Ein Gesicht oder Detail, das den Rahmen weitgehend füllt',
        b: 'Nur die Skyline einer ganzen Stadt',
        c: 'Nur die Füße des Fotografen',
        d: 'Immer eine Gruppe von zwanzig Personen',
      },
      explanation:
        'Die Einstellungsgröße (Weit → Großaufnahme) beschreibt, wie viel vom Motiv den Rahmen füllt.',
    },
    'lex-04': {
      text: 'In der Bildanalyse verweist ein „Index“ (Indiz) oft auf…',
      answers: {
        a: 'Eine kausale oder physische Spur (Rauch → Feuer; Fußabdruck → Anwesenheit)',
        b: 'Ein rein willkürliches Logo ohne Bezug zur Realität',
        c: 'Nur den Kameramarkennamen',
        d: 'Einen rechtlichen Copyright-Hinweis',
      },
      explanation:
        'Indexikalische Zeichen behalten eine reale Verbindung zu dem, was sie anzeigen — nützliches Vokabular, um Fotos als Spuren zu lesen.',
    },
    'lex-05': {
      text: 'Eine „Ikone“ im semiotischen Sinn…',
      answers: {
        a: 'Ähnelt dem, was sie darstellt (Ähnlichkeit / Analogie)',
        b: 'Ist immer nur ein religiöses Gemälde',
        c: 'Bedeutet, dass die Datei verschlüsselt ist',
        d: 'Beweist automatisch das Urheberrecht',
      },
      explanation:
        'Ikonische Relation = Ähnlichkeit. Unterschiedlich vom Index (Spur) und vom Symbol (Konvention).',
    },
    'lex-06': {
      text: 'Der „Standpunkt“ in einem Standbild meint…',
      answers: {
        a: 'Wo die Kamera (oder das implizite Auge) relativ zur Szene steht',
        b: 'Nur die politische Meinung des Fotografen',
        c: 'Die Marke des Fotopapiers',
        d: 'Die Like-Zahl in sozialen Medien',
      },
      explanation:
        'Standpunkt = räumliche Position und Winkel, die strukturieren, was man sieht und welche Wirkung entsteht.',
    },
    'lex-07': {
      text: 'Was ist das „Off“ (hors-champ) in einer Fotografie?',
      answers: {
        a: 'Was der Rahmen als existent nahelegt, ohne es zu zeigen',
        b: 'Nur Pixel außerhalb der JPEG-Datei',
        c: 'Eine obligatorische Wasserzeichen-Zone',
        d: 'Nur das EXIF-GPS-Feld',
      },
      explanation:
        'Das Off ist das, was der Bildausschnitt jenseits der Ränder andeutet — Schlüsselbegriff zum Lesen des Standbilds.',
    },
    'lex-08': {
      text: 'Geringe Schärfentiefe bedeutet in der Regel…',
      answers: {
        a: 'Eine dünne scharfe Ebene; der Hintergrund oft weich',
        b: 'Alles von nah bis fern gleich scharf',
        c: 'Das Bild hat überhaupt keinen Fokus',
        d: 'Das Foto muss schwarzweiß sein',
      },
      explanation:
        'Kurze Schärfentiefe isoliert das Motiv; große Schärfentiefe hält mehr der Szene scharf.',
    },
    'lex-09': {
      text: 'Ein überbelichtetes Standbild ist typischerweise…',
      answers: {
        a: 'Zu hell; Lichter können zu reinem Weiß ausbrennen',
        b: 'Insgesamt zu dunkel',
        c: 'Immer schärfer als eine korrekte Belichtung',
        d: 'Bei Digitalkameras unmöglich',
      },
      explanation:
        'Überbelichtung = zu viel Licht aufgezeichnet; Unterbelichtung = zu wenig.',
    },
    'lex-10': {
      text: 'Die Praxis des „Standbilds“ im Kunstunterricht umfasst typischerweise…',
      answers: {
        a: 'Fotografie und andere nicht bewegte Bilder (vs. Bewegtbild)',
        b: 'Nur Live-Theater',
        c: 'Nur 3D-Videospiele',
        d: 'Nur Audio-Podcasts',
      },
      explanation:
        'Das Curriculum-Vokabular stellt Standbild (Foto usw.) dem Bewegtbild (Video, Animation) gegenüber.',
    },
    'lex-11': {
      text: 'Welche Entscheidungen gehören zur Arbeit an Bildausschnitt / Standpunkt?',
      answers: {
        a: 'Wo man steht und wie hoch die Kamera ist',
        b: 'Was man an den Rändern ein- oder ausschließt',
        c: 'Das WLAN-Passwort der Schule',
        d: 'Ob der Horizont absichtlich gerade oder geneigt ist',
      },
      explanation:
        'Position, Zuschnitt und Horizontwinkel sind Entscheidungen von Bildausschnitt / Standpunkt — keine Netzwerkeinstellungen.',
    },
    'lex-12': {
      text: 'Warum vermeiden, ein urheberrechtlich geschütztes Werk des „programme limitatif“ mit einer Reproduktion zu quizzen?',
      answers: {
        a: 'Urheberrechtsrisiko + Pflegeaufwand, wenn die offizielle Liste wechselt — externe éduscol-Links bevorzugen',
        b: 'Weil man in der Klasse nicht über Fotografie sprechen darf',
        c: 'Weil Oberstufenschüler keinen Browser nutzen dürfen',
        d: 'Weil Vokabelfragen illegal sind',
      },
      explanation:
        'Quiz PixFan behält originales Lexikon-Material und verweist extern auf offizielle Listen — nie eingebettete Bilder des limitativen Korpus.',
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
  for (const a of q.answers) {
    const av = t.answers[a.id];
    if (!av) throw new Error(`missing answer ${q.id}.${a.id}`);
    setDe(a.text, av);
    count += 1;
  }
}

if (count !== 74) throw new Error(`expected 74 LS, got ${count}`);

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`OK: wrote ${count} LocalizedString.de on lexique-image-fixe`);

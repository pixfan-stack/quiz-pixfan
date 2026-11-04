#!/usr/bin/env node
/**
 * Vague 1.87 — add LocalizedString.de for pack exposure-basics (226 LS).
 * Idempotent: overwrites de with the canonical scolaire DE copy.
 * Vocab aligns with guides/triangle-exposition article.de
 * (Blende / Verschlusszeit / ISO / Belichtungsdreieck) and sharePreview
 * Belichtungsgrundlagen chip.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'exposure-basics');
if (!pack) throw new Error('exposure-basics not found');

const unsplash = 'Unsplash — freie Nutzung (Unsplash-Lizenz)';
const unsplashPhoto = 'Foto: Unsplash';

const de = {
  title: 'Belichtungsdreieck',
  description:
    'Meistere Blende, Verschlusszeit und ISO — die drei Säulen jeder Aufnahme.',
  questions: {
    'exp-1': {
      text: 'Was bewirkt vor allem eine größere Blendenöffnung (z. B. f/1.8 gegenüber f/11)?',
      answers: {
        c: 'Verlangsamt automatisch den Verschluss',
        d: 'Beseitigt digitales Rauschen',
        b: 'Macht das Bild überall schärfer',
        a: 'Lässt mehr Licht herein und verringert die Schärfentiefe',
      },
      explanation:
        'Eine offenere Blende (kleinere f-Zahl) lässt mehr Licht herein und erzeugt geringere Schärfentiefe — klassisch für Porträts mit unscharfem Hintergrund.',
      imageAlt: 'Vintage-Kamera auf einem Holztisch',
      imageCredit: unsplash,
    },
    'exp-2': {
      text: 'Du willst einen Sprinter mitten im Schritt einfrieren. Welche Verschlusszeit passt am besten?',
      answers: {
        d: '2 Sekunden (sehr langsam)',
        a: '1/30 Sekunde',
        b: '1/60 Sekunde',
        c: '1/1000 Sekunde (sehr schnell)',
      },
      explanation:
        'Schnelle Aktion braucht eine kurze Belichtungszeit (hohe Verschlusszeit), etwa 1/1000 s oder mehr, um Bewegung einzufrieren.',
      imageAlt: 'Räder und Einstellungen einer Kamera',
      imageCredit: unsplash,
    },
    'exp-3': {
      text: 'Welche Einstellungen gehören zum klassischen Belichtungsdreieck?',
      answers: {
        c: 'Verschlusszeit',
        b: 'Weißabgleich',
        d: 'ISO (Empfindlichkeit)',
        a: 'Blende',
      },
      explanation:
        'Das Belichtungsdreieck fasst Blende, Verschlusszeit und ISO zusammen. Der Weißabgleich steuert die Farbtemperatur, nicht die Belichtung.',
      imageAlt: 'Kamera in den Händen im Freien',
      imageCredit: unsplash,
    },
    'exp-4': {
      text: 'ISO erhöhen hilft vor allem dabei…',
      answers: {
        b: 'den optischen Zoom zu steigern',
        d: 'den Autofokus zu deaktivieren',
        a: 'bei wenig Licht zu fotografieren (auf Kosten von mehr Rauschen)',
        c: 'immer eine geringere Schärfentiefe zu bekommen',
      },
      explanation:
        'Hohes ISO verstärkt das Sensorsignal für korrekte Belichtung bei wenig Licht, erhöht aber oft das Rauschen.',
      imageAlt: 'Detail von Fotografie-Ausrüstung',
      imageCredit: unsplash,
    },
    'exp-5': {
      text: 'Was bedeutet „Abblenden“ von f/2.8 auf f/5.6?',
      answers: {
        b: 'Die Blende wird größer; mehr Licht',
        a: 'Die Blende wird kleiner; etwa 2 Blendenstufen weniger Licht',
        d: 'Das Objektiv zoomt heraus',
        c: 'ISO verdoppelt sich zweimal',
      },
      explanation:
        'Jede volle Blendenstufe halbiert das Licht. Von f/2.8 → f/4 → f/5.6 sind zwei Stufen weniger Licht und mehr Schärfentiefe.',
      imageAlt:
        'Scharfe Bergkämme — abblenden für mehr Schärfentiefe',
      imageCredit: unsplash,
    },
    'exp-6': {
      text: 'Für einen seidigen Wasserfall-Effekt nutzen Fotografen oft…',
      answers: {
        a: 'eine lange Belichtung (und oft Stativ / ND-Filter)',
        c: 'Blitz auf voller Leistung',
        d: 'f/1.2 bei jeder Aufnahme',
        b: 'nur das höchstmögliche ISO',
      },
      explanation:
        'Lange Belichtungen verwischen bewegtes Wasser zu einem seidigen Look. Ein Stativ (und ND-Filter bei Tageslicht) hält den Rest scharf.',
      imageAlt:
        'Seidiger Wasserfall bei Langzeitbelichtung — Terrain des langsamen Verschlusses',
      imageCredit: unsplash,
    },
    'exp-7': {
      text: 'Was passiert, wenn du ein Bild stark unterbelichtest?',
      answers: {
        d: 'Die Schärfentiefe nimmt zu',
        a: 'Dunkle Bereiche verlieren Detail und können zu reinem Schwarz werden',
        c: 'Die Farben werden gesättigter',
        b: 'Das Bild wird überbelichtet',
      },
      explanation:
        'Unterbelichtung heißt: zu wenig Licht am Sensor — Schatten verlieren Detail und können zu reinem Schwarz abschneiden.',
      imageAlt:
        'Dunkle Stimmungslandschaft — Unterbelichtung, die Schatten platt drückt',
      imageCredit: unsplash,
    },
    'exp-8': {
      text: 'Wozu dienen Messmodi (Matrix, Spot, mittenbetont)?',
      answers: {
        c: 'Um den Weißabgleich zu ändern',
        b: 'Um die Autofokus-Punkte einzustellen',
        a: 'Um festzulegen, wie die Kamera Licht für die Belichtung misst',
        d: 'Um die Bildauflösung zu wählen',
      },
      explanation:
        'Messmodi sagen der Kamera, wie sie Licht bewertet: Matrix sieht das ganze Bild, Spot eine minimale Zone, mittenbetont priorisiert die Mitte.',
    },
    'exp-9': {
      text: 'Welche Szenarien profitieren vom manuellen Belichtungsmodus?',
      answers: {
        d: 'Nur bei vollem Sonnenschein',
        b: 'Astrofotografie und Langzeitbelichtungen',
        a: 'Studiofotografie mit kontrolliertem Licht',
        c: 'Konsistente Sequenzen (z. B. Panoramen)',
      },
      explanation:
        'Manuell gibt volle Kontrolle, wenn Licht stabil oder vorhersehbar ist — die Kamera ändert Einstellungen nicht zwischen den Aufnahmen.',
    },
    'exp-10': {
      text: 'Was bedeutet ETTR in der Belichtungstechnik?',
      answers: {
        c: 'Verbesserte Dreifach-Technik-Auflösung (falsches Akronym)',
        a: 'Expose To The Right (nach rechts belichten)',
        b: 'Elektronische Zeit-Transferrate (falsch)',
        d: 'Externe Auslöse-Timing-Referenz (falsch)',
      },
      explanation:
        'ETTR heißt: so hell wie möglich belichten ohne Lichter zu clippen — maximaler Schattendetail und weniger Rauschen beim Entwickeln.',
    },
    'exp-11': {
      text: 'Wie wirkt ein Neutraldichtefilter (ND) auf die Belichtung?',
      answers: {
        b: 'Er vergrößert die Blendenöffnung',
        d: 'Er erhöht ISO automatisch',
        c: 'Er ändert die Farbtemperatur',
        a: 'Er dämpft alle Wellenlängen gleichmäßig und ermöglicht längere Belichtungen',
      },
      explanation:
        'ND-Filter wirken wie Sonnenbrillen fürs Objektiv: sie reduzieren Licht gleichmäßig und erlauben lange Verschlusszeiten auch bei viel Licht.',
      imageAlt:
        'Tageslichtblick — Terrain des ND-Filters für längere Belichtung',
      imageCredit: unsplash,
    },
    'exp-12': {
      text: 'Was ist die Reziprozitätsregel in der Fotografie?',
      answers: {
        a: 'Die Verschlusszeit sollte mindestens 1/Brennweite sein, um Verwacklung zu vermeiden',
        d: 'Die Sensorgröße bestimmt die Maximalauflösung',
        b: 'ISO muss sich verdoppeln, wenn man eine Blendenstufe öffnet',
        c: 'Blende und Verschlusszeit sind umgekehrt proportional',
      },
      explanation:
        'Die Reziprozitätsregel hilft gegen Verwacklung: nutze eine Zeit ≥ 1/Brennweite (z. B. 1/50 s für 50 mm Vollformat).',
    },
    'exp-13': {
      text: 'Welche Faktoren beeinflussen die Schärfentiefe eines Fotos?',
      answers: {
        d: 'Die ISO-Einstellung',
        c: 'Die Brennweite',
        b: 'Der Abstand zum Motiv',
        a: 'Die Blendengröße',
      },
      explanation:
        'Schärfentiefe steuern Blende, Motivabstand und Brennweite. ISO beeinflusst Empfindlichkeit und Rauschen, nicht die Schärfentiefe.',
      imageAlt:
        'Fotograf mit geringer Schärfentiefe hinter dem Motiv',
      imageCredit: unsplash,
    },
    'exp-14': {
      text: 'Was ist der „Reziprozitätsfehler“ in der Analogfotografie?',
      answers: {
        a: 'Wenn sehr lange oder sehr kurze Belichtungen Korrektur brauchen, weil Film nicht linear reagiert',
        d: 'Wenn mehrere Blitze gleichzeitig genutzt werden',
        b: 'Wenn die Reziprozitätsregel bei Digitalkameras nicht mehr gilt',
        c: 'Wenn ISO nicht zur Beleuchtung passt',
      },
      explanation:
        'Reziprozitätsfehler tritt bei sehr langen oder sehr kurzen Belichtungen auf: die Filmreaktion ist nicht proportional zu Licht × Zeit — man muss kompensieren.',
    },
    'exp-15': {
      text: 'Was priorisiert die „Lichtermessung“?',
      answers: {
        c: 'Sich auf die dunkelsten Bildteile zu konzentrieren',
        a: 'Detail in hellen Zonen zu schützen, auch wenn Schatten dunkler werden',
        b: 'Das ganze Bild gleichmäßig zu belichten',
        d: 'Blitz und Umgebungslicht gleich zu balancieren',
      },
      explanation:
        'Lichtermessung schützt helle Zonen vor Clipping (Ausbrennen) — oft schwerer im Entwickeln zu retten als Schattendetail.',
    },
    'exp-16': {
      text: 'Welcher Belichtungsmodus lässt dich die Blende setzen, während die Kamera die Zeit wählt?',
      answers: {
        d: 'Vollmanuell (M)',
        b: 'Zeitautomatik (S oder Tv)',
        c: 'Programmautomatik (P)',
        a: 'Blendenautomatik (A oder Av)',
      },
      explanation:
        'Blendenautomatik lässt dich die Schärfentiefe steuern, während die Kamera die passende Verschlusszeit berechnet.',
    },
    'exp-17': {
      text: 'Welche Auswirkungen hat höheres ISO auf die Bildqualität?',
      answers: {
        b: 'Reduzierter Dynamikumfang',
        d: 'Mehr Schärfe',
        c: 'Möglicher Verlust an Farbdetail',
        a: 'Mehr Rauschen / Körnung',
      },
      explanation:
        'Höheres ISO verstärkt Signal und Rauschen, reduziert den Dynamikumfang und kann die Farbtreue treffen. Die Schärfe verbessert sich nicht.',
      imageAlt: 'Stadtlichter bei Nacht — Kompromisse bei hohem ISO',
      imageCredit: unsplash,
    },
    'exp-18': {
      text: 'Wozu dient die „Belichtungskompensation“?',
      answers: {
        c: 'Um die Autofokus-Empfindlichkeit einzustellen',
        b: 'Um die Farbbalance zu ändern',
        a: 'Um die automatische Belichtungsberechnung der Kamera manuell zu übersteuern',
        d: 'Um das Seitenverhältnis zu ändern',
      },
      explanation:
        'Belichtungskompensation verschiebt die Messung zu helleren (+) oder dunkleren (−) Aufnahmen — nützlich bei High-Key- oder Low-Key-Szenen.',
      imageAlt:
        'Glitzerndes Wasser bei Sonnenuntergang — Urteil über Belichtungskompensation',
      imageCredit: unsplash,
    },
    'exp-19': {
      text: 'Warum würde ein Fotograf Bracketing nutzen?',
      answers: {
        d: 'Um die Brennweite des Objektivs zu ändern',
        c: 'Um das Bild automatisch zu schärfen',
        b: 'Um die Serienbildrate der Kamera zu erhöhen',
        a: 'Um mehrere Belichtungen auf verschiedenen Niveaus zu sichern (HDR oder Sicherheit)',
      },
      explanation:
        'Bracketing macht mehrere Aufnahmen mit unterschiedlicher Belichtung: mindestens eine ist oft optimal und erlaubt HDR-Fusion oder Sicherheitsnetz.',
      imageAlt:
        'Kontrastreicher Sonnenaufgang zwischen Bäumen — klassische Bracketing-Szene',
      imageCredit: unsplash,
    },
    'exp-20': {
      text: 'Welche Situationen verlangen oft eine leichte Überbelichtung?',
      answers: {
        a: 'Gegen einen hellen Hintergrund (Motive im Gegenlicht)',
        b: 'Schneeszenen, damit Schnee nicht grau wirkt',
        c: 'Fotografie weißer Blumen',
        d: 'Nachtstadtlandschaften mit vielen Lichtern',
      },
      explanation:
        'Kameras neigen dazu, sehr helle Szenen unterzubelichten. Etwas Überbelichtung hält Weiß weiß und verhindert ungewollte Silhouetten.',
    },
    'exp-21': {
      text: 'Dunkles Konzert, schnelle Tänzer. Was ist dein erster Reflex?',
      answers: {
        a: 'Verschluss auf 1/30 s verlangsamen, um Licht zu gewinnen',
        b: 'Blende öffnen und ISO bei Bedarf erhöhen',
        c: 'Auf f/16 schließen wegen Schärfe',
        d: 'Feuerwerks-Langzeitbelichtungsmodus aktivieren',
      },
      explanation:
        'Du brauchst Licht UND eingefrorene Bewegung. Öffne zuerst, dann ISO — beginne nicht damit, den Verschluss über die Tänzer zu schleifen.',
      imageAlt: 'Stadtlichter bei Nacht',
      imageCredit: unsplash,
    },
    'exp-22': {
      text: 'Du willst seidiges Wasser an einem Wasserfall. Welche Kombination passt am besten?',
      answers: {
        d: 'f/1.2 voll geöffnet bei Sonnenschein ohne ND',
        c: 'Nur Blitz, Verschluss unangetastet',
        a: '1/2000 s + ISO 6400 (sehr schnell / hoch)',
        b: 'Langsamer Verschluss (z. B. 1/4–2 s), niedriges ISO, abgeblendet oder ND',
      },
      explanation:
        'Bewegungsunschärfe braucht Zeit. Verlangsame den Verschluss; steuere die Belichtung mit ISO, Blende oder ND-Filter.',
      imageAlt: 'Wasserfall im Wald',
      imageCredit: unsplash,
    },
    'exp-23': {
      text: 'Mythos oder Nuance: „Immer bei ISO 100 schießen für beste Qualität.“',
      answers: {
        d: 'ISO beeinflusst Rauschen überhaupt nicht',
        b: 'Vor allem Mythos: ein scharfes Bild bei höherem ISO schlägt ein verwackeltes bei ISO 100',
        a: 'Wahr — jedes höhere ISO ruiniert die Datei',
        c: 'Nur bei Smartphones wahr',
      },
      explanation:
        'Nutze das niedrigste ISO, das Bewegung noch einfriert und korrekt belichtet. Verwacklung ist schlimmer als etwas Rauschen.',
    },
    'exp-24': {
      text: 'Porträt am Fenster: draußen sehr hell, Raum dunkel. Wie hältst du beides lesbar?',
      answers: {
        a: 'Nur für den Raum belichten und das Fenster ausbrennen',
        b: 'Für draußen belichten und das Motiv silhouettieren',
        c: 'Für das Gesicht belichten, dann Schatten / Aufhellung bei Bedarf heben',
        d: 'Immer bei f/22 und ISO 50 schießen',
      },
      explanation:
        'Schütze zuerst das Gesicht. Hebe danach Raumschatten; ein ausgebranntes Fenster ist oft akzeptabel.',
      imageAlt: 'Porträt nahe einem hellen Fenster',
      imageCredit: unsplash,
    },
    'exp-25': {
      text: 'Mythos: „Mehr ISO = immer schlechteres Foto.“ Was ist die Nuance?',
      answers: {
        a: 'Wahr — nie über ISO 400 gehen',
        b: 'Rauschen ist meist besser als Verwacklung oder Unterbelichtung; moderne Sensoren vertragen hohes ISO gut',
        c: 'ISO beeinflusst nur den Weißabgleich',
        d: 'ISO gibt es nur bei Filmkameras',
      },
      explanation:
        'Ein scharfes, gut belichtetes Bild bei hohem ISO schlägt ein „sauberes“, aber verwackeltes.',
      imageAlt: 'Nachthimmel — Rauschen versus Verwacklung beim ISO-Anheben',
      imageCredit: unsplash,
    },
    'exp-26': {
      text: 'Du bist bei EV 0 an einem reflektierenden Strand. Hauttöne wirken dunkel. Was ist der klügste nächste Schritt?',
      answers: {
        a: 'Auf +1 / +2 EV Belichtungskompensation gehen',
        b: 'Zwei Blendenstufen abblenden',
        c: 'Auf Wolfram-Weißabgleich wechseln',
        d: 'Nur den Selbstauslöser aktivieren',
      },
      explanation:
        'Matrixmessung unterbelichtet helle Szenen. Positive Kompensation stellt Mitteltöne wieder her.',
      imageAlt: 'Helle Außenlandschaft',
      imageCredit: unsplash,
    },
    'exp-27': {
      text: 'Blitz + Ambient: wie verhinderst du einen schwarzen Hintergrund?',
      answers: {
        a: 'Nur Blitzleistung erhöhen; Verschluss ignorieren',
        b: 'Verschluss verlangsamen (innerhalb der Sync) für Ambient; Blitz fürs Motiv justieren',
        c: 'Immer bei 1/8000 s mit Blitz schießen',
        d: 'Alle Ambient-Belichtungsmesser deaktivieren',
      },
      explanation:
        'Der Verschluss steuert vor allem Ambient; der Blitz (mit Blende/ISO) beleuchtet das Motiv.',
    },
    'exp-28': {
      text: 'Sportflur: das Motiv läuft auf dich zu. Beste AF-/Verschluss-Kombi?',
      answers: {
        a: 'Einzel-AF + 1/60 s',
        b: 'Kontinuierlicher AF + schneller Verschluss (z. B. 1/500 s+)',
        c: 'Manuell auf Unendlich + Bulb',
        d: 'Nur Gesichtserkennung mit 2 s Belichtung',
      },
      explanation:
        'Ein AF, der folgt, plus eine Zeit, die kurz genug ist, um Bewegung einzufrieren.',
      imageAlt: 'Läufer in Bewegung',
      imageCredit: unsplash,
    },
    'exp-29': {
      text: 'Konzertgraben, bewegtes Motiv, Scheinwerfer. Du willst einfrieren UND lesbare Schwarztöne. Priorität?',
      answers: {
        b: 'Schnell genug zum Einfrieren, Blende öffnen, ISO nur bei Bedarf erhöhen',
        c: 'f/16 für maximale Schärfentiefe immer',
        a: 'ISO minimal, langsamer Verschluss, und hoffen',
        d: 'Nur Blitz — Bühnenlicht funktioniert nie',
      },
      explanation:
        'Zuerst einfrieren (Zeit), dann Licht sammeln (Blende), dann ISO. Schwarztöne schützt eine disziplinierte Belichtung, nicht blinde Unterbelichtung.',
      imageAlt:
        'Stadtlichter bei Nacht, die Low-Light-Fotografie evozieren',
      imageCredit: unsplashPhoto,
    },
    'exp-30': {
      text: 'Du misst ein Gegenlicht-Porträt bei −1 EV „für Drama“. Haut wird matschig und rauschig beim Anheben. Fehler?',
      answers: {
        c: 'Nur JPEG handhabt Gegenlicht',
        b: 'ISO war für Drama zu niedrig',
        a: 'Du hast das Gesicht unterbelichtet; Anheben verstärkt Rauschen — belichte für Haut, akzeptiere helleren Hintergrund',
        d: '−1 EV verbessert immer die Hauttextur',
      },
      explanation:
        'Ein Lichtrand ist okay; Gesichtstöne plattdrücken nicht. Belichte für das Motiv, das zählt.',
    },
    'exp-31': {
      text: 'Welche Paare halten ungefähr dieselbe Belichtung (gleiches EV), wenn sonst nichts ändert?',
      answers: {
        a: '1/250 s bei f/2.8 ↔ 1/125 s bei f/4',
        b: 'ISO 400 bei 1/100 ↔ ISO 800 bei 1/200',
        c: 'f/8 bei ISO 100 ↔ f/4 bei ISO 100 (gleiche Zeit)',
        d: '1/60 s bei f/5.6 ↔ 1/30 s bei f/8',
      },
      explanation:
        'Eine Blendenstufe + eine Zeitstufe (oder +1 ISO / −1 Zeit) gleichen sich aus. Zwei Stufen öffnen ohne Zeitänderung = +2 EV.',
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
console.log(`OK: wrote ${count} LocalizedString.de on exposure-basics`);

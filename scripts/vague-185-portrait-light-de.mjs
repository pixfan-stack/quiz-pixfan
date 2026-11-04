#!/usr/bin/env node
/**
 * Vague 1.85 — add LocalizedString.de for pack portrait-light (194 LS).
 * Idempotent: overwrites de with the canonical scolaire DE copy.
 * Aligns with hub scolaires article.de « Porträt & Licht » /
 * sharePreview LABELS.de « Porträt & Licht » and Lycée start CTA.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'portrait-light');
if (!pack) throw new Error('portrait-light not found');

const unsplashCredit = 'Unsplash — freie Nutzung (Unsplash-Lizenz)';

const de = {
  title: 'Porträt & Licht (Pixfan-Pfad)',
  description:
    'Schlüssel, Fill, Fensterlicht und schmeichelndes Gesichtslich — das Porträt-Handwerk, das Pixfan vor der schweren Retusche lehrt.',
  questions: {
    'pl-01': {
      text: 'Bei einem klassischen Ein-Licht-Porträt heißt das Hauptlicht, das das Gesicht formt…',
      answers: {
        a: 'Schlüssellicht (Key light)',
        b: 'Nur Haarlicht (Hair light)',
        c: 'Hintergrund-Gel',
        d: 'Catchlight-Gel',
      },
      explanation:
        'Das Schlüssel setzt Richtung und Kontrast im Gesicht; Fill und Akzente kommen danach.',
      imageAlt: 'Enge Porträtaufnahme mit weichem gerichteten Licht im Gesicht',
      imageCredit: unsplashCredit,
    },
    'pl-02': {
      text: 'Rembrandt-Licht erkennt man an…',
      answers: {
        a: 'Einem Lichttriangle auf der Schattenwange unter dem Auge',
        b: 'Absolut flachem Licht ohne Nasenschatten',
        c: 'Nur einem Rim light von hinten',
        d: 'Rot/Cyan-Split-Gel auf beiden Wangen',
      },
      explanation:
        'Ein Schlüssel ≈45° oben und seitlich erzeugt das klassische Dreieck auf der Wange.',
      imageAlt: 'Seitlich beleuchtetes Gesicht — Rembrandt- / Loop-Terrain',
      imageCredit: unsplashCredit,
    },
    'pl-03': {
      text: 'Hartes Mittagssonnenlicht für ein schmeichelndes Porträt — erste Rettung?',
      answers: {
        a: 'Offener Schatten, Diffusor oder Bounce-Fill — den Schlag von oben weichzeichnen',
        b: 'Immer zwei Blenden unterbelichten und Haut plattquetschen',
        c: 'Nur bei f/22 frontal gegen die Sonne schießen',
        d: 'Weißabgleich für immer deaktivieren',
      },
      explanation:
        'Porträt-Handwerk priorisiert schmeichelndes Gesichtslich; kämpfe nicht ungeschützt gegen hartes Zenitlicht.',
      imageAlt: 'Warmes Außenporträt im schmeichelnden offenen Schatten',
      imageCredit: unsplashCredit,
    },
    'pl-04': {
      text: 'Was macht Fill-Licht in einem Porträt vor allem?',
      answers: {
        a: 'Den Kontrast der Schattenseite anheben, ohne zu einem zweiten harten Schlüssel zu werden',
        b: 'Die Notwendigkeit eines Schlüssellichts ersetzen',
        c: 'Nur den Hintergrund-Zyklorama beleuchten',
        d: 'Bewegung wie ein Ultrakurzzeit-Blitz einfrieren',
      },
      explanation:
        'Fill steuert die Schattentiefe; das Schlüssel behält die Richtung.',
      imageAlt: 'Männliches Porträt mit weichem Fill, das die Schattenseite anhebt',
      imageCredit: unsplashCredit,
    },
    'pl-05': {
      text: 'Ein klassischer Reflex für schmeichelnde Vollformat-Porträtbrennweiten ist oft…',
      answers: {
        a: 'Kurzes Tele (~70–105 mm) mit moderater Arbeitsdistanz',
        b: 'Ultraweitwinkel auf Armlänge für jeden Kopf',
        c: 'Fisheye für Business-Headshots',
        d: 'Nur 14 mm für Beauty-Arbeit',
      },
      explanation:
        'Kurze Teles komprimieren sanft und halten Gesichtsproportionen bei höflicher Distanz natürlich.',
      imageAlt: 'Porträt-Look mit kurzem Tele und komprimiertem Hintergrund',
      imageCredit: unsplashCredit,
    },
    'pl-06': {
      text: 'Schmetterlingslicht (Paramount) setzt das Schlüssel…',
      answers: {
        a: 'Hoch und zentriert, mit kleinem Schatten unter der Nase',
        b: 'Tief vom Boden für Horror-Schatten',
        c: 'Direkt nur hinter dem Motiv',
        d: 'Als zwei harte, gegenüberliegende Rim lights ohne Frontlicht',
      },
      explanation:
        'Das Beauty- / Old-Hollywood-Schlüssel sitzt hoch auf der Achse für den Schmetterlingsschatten unter der Nase.',
      imageAlt: 'Hohes Beauty-Licht auf Achse — Schmetterling- / Paramount-Vibe',
      imageCredit: unsplashCredit,
    },
    'pl-07': {
      text: 'Catchlights in den Augen zeigen vor allem…',
      answers: {
        a: 'Wo Schlüssel (und Fill) relativ zum Motiv standen',
        b: 'Den exakten ISO der Kamera',
        c: 'Ob das Objektiv Festbrennweite oder Zoom ist',
        d: 'Dass das Foto immer KI-generiert ist',
      },
      explanation:
        'Lies die Spiegelungen im Auge, um Position und Größe der Quelle zu rekonstruieren.',
      imageAlt: 'Sichtbare Catchlights in den Augen unter weichem Schlüssel',
      imageCredit: unsplashCredit,
    },
    'pl-08': {
      text: 'Fensterlicht-Porträt: Motiv zur Fensterseite. Der weichste Look kommt meist von…',
      answers: {
        a: 'Einem großen Nordfenster / bedecktem Himmel als Softbox',
        b: 'Nur harten Sonnenflecken durch Jalousien',
        c: 'Einem winzigen Spot vom anderen Raumende',
        d: 'Immer komplett mit dem Rücken zum Fenster',
      },
      explanation:
        'Eine große, weiche, diffuse Quelle umhüllt das Gesicht; hartes Sonnenlicht durch Glas ist ein anderes Werkzeug.',
      imageAlt: 'Weiches Fensterlicht-Porträt mit Blick zum Fenster',
      imageCredit: unsplashCredit,
    },
    'pl-09': {
      text: 'Golden-Hour-Außenporträts funktionieren oft, weil…',
      answers: {
        a: 'Tiefes warmes Licht weicher und gerichteter ist als hartes Mittagslicht',
        b: 'ISO für immer auf 50 gesperrt sein muss',
        c: 'Weißabgleich als Konzept verschwindet',
        d: 'Dann nur Silhouetten möglich sind',
      },
      explanation:
        'Winkel + Wärme + lange Schatten modellieren, ohne gegen Zenitlicht zu kämpfen.',
      imageAlt: 'Außenporträt mit Golden-Hour-Akzentlicht',
      imageCredit: unsplashCredit,
    },
    'pl-10': {
      text: 'Welche Entscheidungen weichen ein hartes Schlüssel auf dem Gesicht typischerweise auf?',
      answers: {
        a: 'Größerer Modifier / Diffusor näher am Motiv',
        b: 'Eine nackte Birne weiter weg und kleiner im Bild',
        c: 'Bounce oder Reflektor als sanftes Fill hinzufügen',
        d: 'Immer Clarity auf +100 in der Kamera',
      },
      explanation:
        'Größere/nähere Quellen umhüllen; Fill hebt Schatten. Eine ferne nackte Birne härtet.',
    },
    'pl-11': {
      text: 'Beauty-Licht „Clamshell“ kombiniert typischerweise…',
      answers: {
        a: 'Ein Schlüssel von oben und ein Fill/Reflektor unter dem Kinn',
        b: 'Nur zwei Rim lights und eine schwarze Flagge über dem Gesicht',
        c: 'Eine einzelne Kerze auf Bodenhöhe',
        d: 'Kreuzpolarisierten Blitz durch ein Mikroskop',
      },
      explanation:
        'Schlüssel oben + Fill unten öffnet die Augenhöhlen und weicht unter dem Kinn ab.',
      imageAlt: 'Weiches Beauty-Licht, das das Gesicht gleichmäßig umhüllt',
      imageCredit: unsplashCredit,
    },
    'pl-12': {
      text: 'Split-Licht im Gesicht bedeutet…',
      answers: {
        a: 'Eine Gesichtshälfte im Schlüssel, die andere im Wesentlichen im Schatten',
        b: 'Identische Loop-Schatten auf beiden Wangen',
        c: 'Nur Haarlicht ohne Frontbelichtung',
        d: 'RGB-Dauerlicht, das jede Sekunde wechselt',
      },
      explanation:
        'Ein Schlüssel bei ~90° erzeugt ein dramatisches Halbgesicht — nützlich, nicht der Standard-Schmeichler.',
      imageAlt: 'Dramatisches Split-Licht, das eine Gesichtshälfte formt',
      imageCredit: unsplashCredit,
    },
    'pl-13': {
      text: 'Du willst cremige Hintergrundtrennung im Porträt ohne nach draußen zu gehen. Erster Reflex?',
      answers: {
        a: 'Offenere Blende + mehr Motiv-Hintergrund-Abstand + längere Brennweite',
        b: 'f/16 und Motiv 10 cm am Hintergrund',
        c: 'ISO hochdrehen, bis Rauschen den Hintergrund verwischt',
        d: 'Immer den Pop-up-Blitz ohne Bounce nutzen',
      },
      explanation:
        'Schärfentiefe = Optik + Geometrie — Blende, Distanzen und Brennweite arbeiten zusammen.',
      imageAlt: 'Fashion-Porträt mit kontrolliertem Kontrast',
      imageCredit: unsplashCredit,
    },
    'pl-14': {
      text: 'Ein Lichtverhältnis ~4:1 (Schlüssel vs Fill) im Gesicht wirkt meist…',
      answers: {
        a: 'Ziemlich kontrastreich / dramatisch gegenüber 2:1',
        b: 'Völlig flach wie bewölktes Mittags-Fill',
        c: 'Identisch mit Schmetterling ohne Schatten',
        d: 'Eine Weißabgleich-Einstellung, keine Kontrastidee',
      },
      explanation:
        'Je höher das Schlüssel/Fill-Verhältnis, desto dunkler die Schattenseite; 2:1 ist weicher, 8:1 dramatischer.',
    },
    'pl-15': {
      text: 'Broad vs Short Lighting: Short Lighting…',
      answers: {
        a: 'Beleuchtet die vom Kameraweg gedrehte Gesichtshälfte — oft schlanker wirkend',
        b: 'Beleuchtet immer nur die Ohren von hinten',
        c: 'Bedeutet nur Weitwinkelobjektive',
        d: 'Ist identisch mit flachem Blitz auf der Kamera',
      },
      explanation:
        'Short Lighting legt mehr Schatten zur Kamera — klassisches schmeichelndes Schema für viele Gesichter.',
      imageAlt: 'Männliches Porträt mit klarem Schlüssel und weichem Fill',
      imageCredit: unsplashCredit,
    },
    'pl-16': {
      text: 'Gegenlicht-Porträt: Gesicht lesbar UND heller Rim. Sinnvoller Belichtungsansatz?',
      answers: {
        a: 'Für das Gesicht belichten (oder Fill/Blitz hinzufügen), den hellen Rim akzeptieren oder formen',
        b: 'Nur den Himmel messen und das Gesicht immer schwarz quetschen',
        c: 'Jede Messung ausschalten und auf ISO 25600 tippen',
        d: 'Kleinste Blende und langsamsten Verschluss indoor',
      },
      explanation:
        'Schütze zuerst das Gesicht; der Rim ist Bonus, den du füllen oder als Highlight annehmen kannst.',
    },
    'pl-17': {
      text: 'Harte Beauty Dish vs große Softbox nah am Gesicht — typischer Unterschied?',
      answers: {
        a: 'Beauty Dish = punchiger Kontrast/Spekular; große Softbox = weichere Umhüllung',
        b: 'Optisch identisch bei jeder Distanz',
        c: 'Softboxen erzeugen immer härtere Nasenschatten',
        d: 'Beauty Dishes funktionieren nur unter Wasser',
      },
      explanation:
        'Größe/Distanz und Modifier-Design ändern das Spekulare — nicht nur „hell vs dunkel“.',
      imageAlt: 'Ganzkörper-Fashion-Porträt — Lichtzeichnung der Silhouette',
      imageCredit: unsplashCredit,
    },
    'pl-18': {
      text: 'Welche Gewohnheiten halten Hauttöne unter gemischtem Porträtlicht glaubwürdig?',
      answers: {
        a: 'Lichter gelieren / auf einen kohärenten WB-Plan setzen',
        b: 'Graukarte oder bekanntes Neutral prüfen, wenn Dominanten streiten',
        c: 'Immer Max Magenta und Gelb „für Wärme“ blind',
        d: 'Histogramm ignorieren, weil Porträts nie ausbrennen',
      },
      explanation:
        'Gemischte Quellen brauchen einen WB-Plan; Referenzen schlagen Sättigung nach Gefühl.',
    },
    'pl-19': {
      text: 'Ein environmentales Porträt bedeutet vor allem…',
      answers: {
        a: 'Die Person in einem Kontext zeigen, der etwas über sie sagt',
        b: 'Nur Studio-Hintergrund ohne Requisiten',
        c: 'Eine Makro vom Auge und sonst nichts',
        d: 'Luftlandschaften ohne Menschen',
      },
      explanation:
        'Die Umgebung trägt die Geschichte — Arbeit, Zuhause, Straße — nicht nur ein Kopfzuschnitt.',
      imageAlt: 'Environmentales Porträt mit Fensterlicht von kameraseitig links',
      imageCredit: unsplashCredit,
    },
    'pl-20': {
      text: 'Mythos: „Mehr Lichter = immer ein besseres Porträt.“ Bessere Nuance?',
      answers: {
        a: 'Ein gut gesetztes Schlüssel (plus optionales Fill) schlägt viele streitende Quellen',
        b: 'Mindestens fünf Blitze für jedes Porträt',
        c: 'Tageslicht ist im Studio illegal',
        d: 'Porträtlicht existiert nur in Lightroom-Masken',
      },
      explanation:
        'Einfaches, absichtliches Licht liest sich; jedes Extra-Licht braucht eine Rolle oder verschmutzt das Gesicht.',
      imageAlt: 'Dramatisches Porträt mit härterem Seitenlicht und tiefen Schatten',
      imageCredit: unsplashCredit,
    },
    'pl-21': {
      text: 'Ein Haar- / Rim-Licht hinter dem Motiv dient vor allem dazu…',
      answers: {
        b: 'Das Schlüssellicht komplett zu ersetzen',
        c: 'Jedes Porträt in flaches Beauty-Licht zu zwingen',
        d: 'Nur den Weißabgleich in den Schatten zu ändern',
        a: 'Haare/Schultern von dunklem Hintergrund zu trennen und Polish zu geben',
      },
      explanation:
        'Rim/Haar formen die Trennung; sie ersetzen selten ein echtes Schlüssel.',
      imageAlt: 'Golden-Hour-Rim light umhüllt ein Porträtmotiv',
      imageCredit: unsplashCredit,
    },
    'pl-22': {
      text: 'Beauty-Licht „Clamshell“ verbindet typischerweise…',
      answers: {
        b: 'Zwei harte Rim lights ohne Frontlicht',
        c: 'Nur einen nackten Speedlight auf Kamera für immer zur Decke',
        d: 'Ein einzelnes rotes Gel hinter dem Motiv als einzige Quelle',
        a: 'Ein weiches Schlüssel oben + schwächeres Fill/Reflektor unter der Kinnlinie',
      },
      explanation:
        'Clamshell umhüllt weiches Licht für saubere Beauty-/Commercial-Gesichter.',
    },
    'pl-23': {
      text: 'Motiv mit tiefliegenden Augen unter Hutkrempe. Erste Lichtkorrektur?',
      answers: {
        b: 'Nur Schwarze härter quetschen, bis Augenhöhlen verschwinden',
        c: 'Immer bei f/22 frontal gegen Mittagssonne',
        d: 'AF ausschalten und auf Catchlights hoffen',
        a: 'Fill / Bounce anheben / Schlüsselwinkel senken, damit Augen Licht fangen',
      },
      explanation:
        'Porträt-Handwerk priorisiert lesbare Augen — hebe die Augenhöhlen vor stilisiertem Drama.',
    },
    'pl-24': {
      text: 'Short Lighting (vs Broad) bedeutet in der Regel…',
      answers: {
        b: 'Das Schlüssel beleuchtet nur den Hintergrund-Zyklorama',
        c: 'Es wird gar kein Schlüssel verwendet',
        d: 'Das Objektiv ist immer weiter als 24 mm',
        a: 'Das Schlüssel beleuchtet die vom Kameraweg gedrehte Gesichtshälfte — oft schlanker wirkend',
      },
      explanation:
        'Short Lighting legt den Schatten zur Kamera — klassisches schmeichelndes Schema.',
    },
    'pl-25': {
      text: 'Fenster + Wolfram-Practicals gemischt verschmutzen die Haut. Bessere Set-Gewohnheit?',
      answers: {
        b: 'Immer Auto-WB und Raumlichter ignorieren',
        c: 'Clarity auf +100, um Dominanten zu „fixen“',
        d: 'Auf Neongrün umschalten, damit Dominanten Stil werden',
        a: 'Eine dominante Temperatur wählen (Gel/Practicals) oder Quellen trennen',
      },
      explanation:
        'Gemischte CCTs streiten auf der Haut; wähle eine Dominante und halte sie.',
      imageAlt: 'Environmentales Fensterporträt — Gewohnheiten bei Mischlicht',
      imageCredit: unsplashCredit,
    },
    'pl-26': {
      text: 'Mythos: „Softboxen entfernen alle Schatten.“ Bessere Nuance?',
      answers: {
        b: 'Softboxen beseitigen für immer jeden Fill-Bedarf',
        c: 'Softboxen funktionieren nur outdoor mittags',
        d: 'Softboxen zwingen jedes Catchlight zum Verschwinden',
        a: 'Weiches Licht hat weiter Richtung — Größe/Distanz ändern Weichheit, nicht Physik',
      },
      explanation:
        'Modifier weichen Kanten; sie löschen kein gerichtetes Modeling.',
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
console.log(`OK: wrote ${count} LocalizedString.de on portrait-light`);

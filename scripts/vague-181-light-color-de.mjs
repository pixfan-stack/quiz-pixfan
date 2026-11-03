#!/usr/bin/env node
/**
 * Vague 1.81 — add LocalizedString.de for pack light-color (182 LS).
 * Idempotent: overwrites de with the canonical scolaire DE copy.
 * Aligns with hub C4 Licht CTA « Quiz Licht & Farbe »
 * and guide lumiere-photo article.de « Licht- & Farb-Quiz ».
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'light-color');
if (!pack) throw new Error('light-color not found');

const unsplashCredit =
  'Unsplash — freie Nutzung (Unsplash-Lizenz)';
const unsplashPhoto = 'Foto: Unsplash';

const de = {
  title: 'Licht & Farbe',
  description:
    'Lichtqualität, Weißabgleich, goldene Stunde und die Stimmung deiner Bilder.',
  questions: {
    'light-1': {
      text: 'Was ist die „goldene Stunde“ (Golden Hour)?',
      answers: {
        a: 'Die Stunde direkt nach Sonnenaufgang oder vor Sonnenuntergang, mit weichem warmem Licht',
        c: 'Jeder Moment, in dem du einen goldenen Reflektor nutzt',
        b: 'Der Mittag, wenn die Sonne am höchsten steht',
        d: 'Die erste Stunde nach dem Kamerakauf',
      },
      explanation:
        'Nahe Sonnenaufgang und -untergang steht die Sonne tief: das Licht ist wärmer, weicher und gerichteter — schmeichelhaft für Porträts und Landschaften.',
      imageAlt: 'Goldene-Stunden-Licht über einer Stadtsilhouette',
      imageCredit: unsplashCredit,
    },
    'light-2': {
      text: 'Hartes Licht (z. B. Mittagssonne, nackter Blitz) erzeugt typischerweise…',
      answers: {
        d: 'Automatische Schwarzweiß-Umwandlung',
        b: 'Fast keine Schatten',
        c: 'Nur Pastellfarben',
        a: 'Scharfe, klar begrenzte Schatten und hohen Kontrast',
      },
      explanation:
        'Eine kleine oder weit entfernte Lichtquelle relativ zum Motiv erzeugt hartes Licht. Weiches Licht (bedeckter Himmel, Softbox) umhüllt und weicht Schatten ab.',
      imageAlt: 'Sonnenlicht durch Bäume',
      imageCredit: unsplashCredit,
    },
    'light-3': {
      text: 'In welchen Lichtsituationen muss man den Weißabgleich oft anpassen?',
      answers: {
        c: 'Mischlicht (Tageslicht + künstlich)',
        b: 'Offener Schatten unter blauem Himmel',
        d: 'Nur wenn der Objektivdeckel drauf ist',
        a: 'Kunstlicht / warme Innenlampen (Wolfram)',
      },
      explanation:
        'Jede Lichtquelle hat eine andere Farbtemperatur. Ein korrekter Weißabgleich hält Neutrale neutral und Hauttöne natürlich.',
      imageAlt: 'Nachthimmel mit Sternen',
      imageCredit: unsplashCredit,
    },
    'light-4': {
      text: '„Gegenlicht“ bedeutet, dass das Hauptlicht…',
      answers: {
        b: 'Nur von unterhalb der Kamera kommt',
        a: 'Hinter dem Motiv steht und zur Kamera zeigt',
        c: 'Komplett ausgeschaltet ist',
        d: 'Immer aus derselben Richtung wie das Objektiv kommt',
      },
      explanation:
        'Gegenlicht kann Silhouetten, Rim-Light (leuchtende Ränder) oder träumerischen Dunst erzeugen — stark für Stimmung und Trennung vom Hintergrund.',
      imageAlt: 'Nebliges Morgenlicht',
      imageCredit: unsplashCredit,
    },
    'light-5': {
      text: 'Die Farbtemperatur wird gemessen in…',
      answers: {
        b: 'Megapixel (MP)',
        d: 'Dezibel (dB)',
        a: 'Grad Kelvin (K)',
        c: 'Nur in Blendenstufen (f-Stops)',
      },
      explanation:
        'Die Farbtemperatur nutzt die Kelvin-Skala (z. B. ~5600 K Tageslicht, ~3200 K Kunstlicht). Kameras und Editoren nutzen diese Werte für den Weißabgleich.',
      imageAlt: 'Warmes Sonnenuntergangslicht über Wasser',
      imageCredit: unsplashCredit,
    },
    'light-6': {
      text: 'Was ist „diffuses Licht“?',
      answers: {
        c: 'Licht, das ständig die Farbe wechselt',
        b: 'Licht, das nur von oben kommt',
        d: 'Licht, das nur von LEDs erzeugt wird',
        a: 'Licht, das in viele Richtungen gestreut wird und weiche Schatten erzeugt',
      },
      explanation:
        'Diffuses Licht kommt von einer großen Quelle oder ist gestreut (Wolken, Softboxes), minimiert harte Schatten und senkt den Kontrast.',
      imageAlt: 'Weiches bedecktes Licht auf einer nebligen Landschaft',
      imageCredit: unsplashCredit,
    },
    'light-7': {
      text: 'Was ist „chromatische Aberration“?',
      answers: {
        b: 'Wenn Farben beim Drucken mit der Zeit wechseln',
        a: 'Farbfransen an kontrastreichen Kanten durch Objektivbegrenzungen',
        c: 'Eine Kameraeinstellung für leuchtende Farben',
        d: 'Die Fähigkeit, Infrarotlicht zu sehen',
      },
      explanation:
        'Unterschiedliche Wellenlängen fokussieren an verschiedenen Punkten und erzeugen violette/grüne Fransen. Qualitätsobjektive und Nachbearbeitung können sie reduzieren.',
    },
    'light-8': {
      text: 'Welche Werkzeuge helfen, die Lichtrichtung zu steuern?',
      answers: {
        b: 'Flags (Abschirmungen) und Barn Doors (Flügel)',
        a: 'Reflektoren',
        c: 'Diffusoren und Softboxes',
        d: 'Speicherkarten',
      },
      explanation:
        'Reflektoren werfen Licht zurück, Flags blockieren es, Diffusoren/Softboxes streuen es. Speicherkarten speichern Daten, steuern aber kein Licht.',
      imageAlt: 'Studiobeleuchtung und Kamera',
      imageCredit: unsplashCredit,
    },
    'light-9': {
      text: 'Was ist „Color Grading“ in der Postproduktion?',
      answers: {
        c: 'Die Brennweite des Objektivs ändern',
        d: 'Die Verschlusszeit anpassen',
        b: 'Die Megapixelzahl der Kamera erhöhen',
        a: 'Farben kreativ anpassen, um Stimmung und Stil festzulegen',
      },
      explanation:
        'Color Grading formt den visuellen Ton und die Emotion eines Bildes oder Films — über eine einfache Weißabgleichskorrektur hinaus.',
      imageAlt: 'Laptop auf einem Schreibtisch — Terrain des Color Gradings in der Post',
      imageCredit: unsplashCredit,
    },
    'light-10': {
      text: 'Was ist „Flash Freeze“ in der Fotografie?',
      answers: {
        a: 'Eine sehr kurze Blitzdauer nutzen, um Bewegung einzufrieren — auch bei längerer Verschlusszeit',
        b: 'Objekte mit Eis einfrieren',
        c: 'Fotos bei Temperaturen unter null machen',
        d: 'Eine Art Langzeitbelichtungstechnik',
      },
      explanation:
        'Die Blitzdauer kann 1/1000 s oder kürzer sein und friert Bewegung unabhängig von der Kameraverschlusszeit ein.',
    },
    'light-11': {
      text: 'In welchen Szenarien hilft ein Reflektor?',
      answers: {
        c: 'Licht für weichere Beleuchtung umlenken',
        a: 'Schatten im Gesicht eines Motivs im Freien aufhellen',
        b: 'Catchlights (Augenlichter) in Porträts setzen',
        d: 'Den ISO der Kamera erhöhen',
      },
      explanation:
        'Reflektoren lenken vorhandenes Licht um, füllen Schatten, setzen Glanz in den Augen oder weichen hartes Licht ab — ohne Extra-Equipment.',
      imageAlt: 'Outdoor-Porträt bei gerichtetem Tageslicht',
      imageCredit: unsplashCredit,
    },
    'light-12': {
      text: 'Womit wird oft ein „Magenta-/Grün-Stich“ assoziiert?',
      answers: {
        a: 'Falscher Weißabgleich unter Leuchtstoffröhren',
        c: 'Schwarzweißfilm',
        b: 'Sonnenlicht in der goldenen Stunde',
        d: 'Überhitzung des Digitalsensors',
      },
      explanation:
        'Leuchtstofflicht hat oft ungleichmäßige Spektren und erzeugt Grün- oder Magentastiche. Custom-Weißabgleich oder Presets korrigieren das.',
    },
    'light-13': {
      text: 'Was ist „Light Painting“?',
      answers: {
        b: 'Wände mit bunten Lampen streichen',
        c: 'Objektive mit Farbe überstreichen',
        a: 'Bilder erzeugen, indem man Lichtquellen während langer Belichtungen bewegt',
        d: 'Ein digitaler Filtereffekt',
      },
      explanation:
        'Light Painting nutzt lange Belichtungen in der Dunkelheit, um mit Taschenlampen, LEDs oder Feuer zu „zeichnen“.',
    },
    'light-14': {
      text: 'Welche Merkmale hat die Fotografie in der „blauen Stunde“?',
      answers: {
        c: 'Künstliche Lichter heben sich vom blauen Hintergrund ab',
        d: 'Erfordert Mittagssonne',
        a: 'Tiefblaue Töne am Himmel',
        b: 'Tritt kurz vor Sonnenaufgang oder nach Sonnenuntergang ein',
      },
      explanation:
        'Die blaue Stunde bietet magische, ruhige Qualität mit kühlen Tönen und dem Kontrast zwischen natürlichem Blau und warmen Kunstlichtern.',
      imageAlt: 'Tiefblauer Dämmerungshimmel über Bergen',
      imageCredit: unsplashCredit,
    },
    'light-15': {
      text: 'Was ist „HDR“ in der Fotografie?',
      answers: {
        b: 'High Definition Resolution: ein Sensortyp',
        a: 'High Dynamic Range: mehrere Belichtungen kombinieren für Detail in Schatten und Lichtern',
        c: 'Horizontal Directional Reflection: eine Objektiveigenschaft',
        d: 'Hybrid Digital Recording: ein Videoformat',
      },
      explanation:
        'HDR fusioniert Belichtungsreihen (Bracketing), um Detail über extreme Lichtspannen zu erhalten, die eine Einzelaufnahme nicht abdeckt.',
    },
    'light-16': {
      text: 'Was erzeugt typischerweise eine Farbtemperatur unter 3200 K?',
      answers: {
        d: 'Nur Schwarzweiß',
        b: 'Kühle Blautöne',
        c: 'Reines weißes Licht',
        a: 'Warme Orange-Rot-Töne (wie Kerzenlicht)',
      },
      explanation:
        'Niedrige Kelvin-Werte (<3200 K) sind warm/orange (Kerze, Kunstlicht); hohe Werte (>5600 K) sind kühl/blau (Schatten, bedeckt).',
    },
    'light-17': {
      text: 'Welche Faktoren beeinflussen die Stimmung, die Licht erzeugt?',
      answers: {
        b: 'Die Farbtemperatur',
        a: 'Die Lichtrichtung',
        d: 'Die Kameramarke',
        c: 'Härte oder Weichheit',
      },
      explanation:
        'Richtung, Temperatur und Qualität des Lichts prägen den emotionalen Eindruck stark. Die Kameramarke beeinflusst die Stimmung nicht direkt.',
    },
    'light-18': {
      text: 'Was ist „Rembrandt-Licht“ im Porträt?',
      answers: {
        b: 'Gleichmäßige Frontalbeleuchtung',
        c: 'Licht, das nur von unten kommt',
        a: 'Ein Muster, das ein kleines Lichtdreieck auf der beschatteten Wange erzeugt',
        d: 'Keine Schatten im Gesicht',
      },
      explanation:
        'Inspiriert von Rembrandts Gemälden erzeugt dieses klassische Porträtlicht einen dramatischen, dimensionalen Effekt mit dem charakteristischen Lichtdreieck.',
      imageAlt: 'Dramatische seitlich beleuchtete Porträtsilhouette',
      imageCredit: unsplashCredit,
    },
    'light-19': {
      text: 'Was ist der „Lichtabfall“ (Light Falloff)?',
      answers: {
        d: 'Eine Kamerafunktion für wenig Licht',
        c: 'Die Lichtmenge, die durchs Objektiv eintritt',
        b: 'Wenn Licht mit der Zeit die Farbe wechselt',
        a: 'Die Abnahme der Lichtintensität mit wachsender Entfernung zur Quelle',
      },
      explanation:
        'Licht folgt dem Abstandsgesetz (Inverse-Square): doppelte Distanz → Intensität auf 1/4. Lichtabfall verstehen ist zentral fürs Lichtsetzen.',
    },
    'light-20': {
      text: 'Welche Techniken helfen bei Szenen mit hohem Kontrast?',
      answers: {
        a: 'Aufhellblitz oder Reflektoren nutzen',
        d: 'ISO dramatisch erhöhen',
        b: 'HDR-Fusion',
        c: 'Verlaufene Neutraldichtefilter (GND)',
      },
      explanation:
        'Diese Techniken gleichen extreme Lichtunterschiede aus. ISO hochdrehen addiert Rauschen, ohne den Kontrast zu lösen.',
      imageAlt: 'Hochkontrast-Sonnenaufgang durch Bäume',
      imageCredit: unsplashCredit,
    },
    'light-21': {
      text: 'Harte Mittagssonne, Outdoor-Porträt. Beste erste Rettung?',
      answers: {
        a: 'In offenen Schatten gehen oder Gesicht aufhellen/reflektieren',
        c: 'Einen Rotgel auf die Kamera setzen „für Kino“',
        b: '3 Blenden unterbelichten und später nur Schatten anheben',
        d: 'ISO bei vollem Sonnenlicht auf 12800 erhöhen',
      },
      explanation:
        'Offener Schatten oder Aufhelllicht weicht „Waschbärenaugen“ ab. Gegen hartes Sonnenlicht nur mit ISO zu kämpfen löst den Kontrast nicht.',
      imageAlt: 'Porträt bei Tageslicht',
      imageCredit: unsplashCredit,
    },
    'light-22': {
      text: 'Innen Kunstlicht + Tageslicht aus dem Fenster im selben Bild. Was wirkt oft „falsch“?',
      answers: {
        c: 'ISO bleibt für immer bei 50 gesperrt',
        b: 'Das Objektiv wird automatisch zum Fisheye',
        d: 'Fokus funktioniert nur auf Unendlich',
        a: 'Gemischter Weißabgleich / konkurrierende Farbstiche',
      },
      explanation:
        'Zwei Farbtemperaturen in einer Aufnahme erzeugen Orange-/Blau-Kämpfe. Wähle ein Hauptlicht oder gelifie/korrigiere eine Quelle.',
      imageAlt:
        'Warmes Café-Innenlicht gemischt mit kühlerer Umgebung — Misch-WB-Herausforderung',
      imageCredit: unsplashCredit,
    },
    'light-23': {
      text: '„Die goldene Stunde ist das einzige gute Licht.“ Welche Einschätzung ist am fairsten?',
      answers: {
        c: 'Stimmt nur für Smartphones',
        d: 'Stimmt nur in Schwarzweiß',
        a: 'Stimmt — meide jede andere Tageszeit',
        b: 'Falsch: blaue Stunde, bedeckter Himmel und kontrolliertes Kunstlicht können fantastisch sein',
      },
      explanation:
        'Die goldene Stunde ist wunderschön, aber nicht exklusiv. Weiches bedecktes Licht ist ein Porträt-Geschenk; Neon bei Nacht kann ebenfalls singen.',
    },
    'light-24': {
      text: 'Gegenlicht in der goldenen Stunde durch Bäume: Gesichter unterbelichtet, Blätter leuchten. Beste Belichtungsstrategie?',
      answers: {
        c: 'Kunstlicht-WB setzen, um die Belichtung zu „reparieren“',
        b: 'Immer nur auf das hellste Blatt belichten',
        a: 'Auf Gesichter messen/belichten (Spot oder Kompensation), helleres Laub akzeptieren oder aufhellen',
        d: 'EV −3 „für Stimmung“ auf jedes Gesicht sperren',
      },
      explanation:
        'Entscheide, was Detail behalten muss. Gesichter gewinnen meist; das Leuchten kann Rim-Light sein, nicht das Messziel.',
      imageAlt: 'Sonnenlicht, das durch das Blätterdach des Waldes fällt',
      imageCredit: unsplashPhoto,
    },
    'light-25': {
      text: 'Mischlicht (Natrium-Straßenlaterne + LED-Laden). Welche Taktiken halten Haut glaubwürdig?',
      answers: {
        a: 'Eine dominante Quelle wählen und darauf den Weißabgleich setzen',
        b: 'Blitz gelifizieren, um Ambientlicht beim Aufhellen anzugleichen',
        c: 'Sekundäre Stiche lokal im Raw korrigieren',
        d: 'Auto-WB + starkes Teal/Orange-Grade als einziger Plan',
      },
      explanation:
        'Wähle einen Haupt-Weißpunkt, passe Zusatzlicht an und korrigiere dann lokal. Ein globales Fantasy-Grade repariert Mischstiche selten.',
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

if (count !== 182) throw new Error(`expected 182 LS, got ${count}`);

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`OK: wrote ${count} LocalizedString.de on light-color`);

#!/usr/bin/env node
/**
 * Vague 1.83 — add LocalizedString.de for pack retouching (190 LS).
 * Idempotent: overwrites de with the canonical scolaire DE copy.
 * Aligns with hub CTA « Quiz Retusche »
 * and guide retouche-lightroom article.de « Retusche-Quiz ».
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'retouching');
if (!pack) throw new Error('retouching not found');

const unsplashCredit = 'Unsplash — freie Nutzung (Unsplash-Lizenz)';

const de = {
  title: 'Retusche & Entwicklung',
  description:
    'RAW, Histogramme, Tonalität, Schärfe und ethische Retusche — Pixfan-Retusche-Parcours.',
  questions: {
    'edit-1': {
      text: 'Ein nach rechts abgeschnittenes Histogramm bedeutet meist…',
      answers: {
        c: 'Dass das Objektiv schmutzig ist',
        b: 'Nur perfekte Mitteltöne',
        a: 'Ausgebrannte Lichter / verlorenes Detail in den Highlights',
        d: 'Dass der ISO immer auf 100 steht',
      },
      explanation:
        'Rechts-Clipping zeigt reines Weiß mit kaum noch rettbarem Detail — Belichtungskorrektur und Kurven helfen nur begrenzt.',
      imageAlt: 'Abstrakte Farbverläufe',
      imageCredit: unsplashCredit,
    },
    'edit-2': {
      text: 'RAW statt JPEG zu entwickeln hilft vor allem, weil…',
      answers: {
        b: 'RAW-Dateien immer kleiner sind',
        a: 'Mehr Ton- und Farbdaten vor starker Bearbeitung erhalten bleiben',
        c: 'JPEG keine Farben zeigen kann',
        d: 'RAW die Bildkomposition deaktiviert',
      },
      explanation:
        'RAW behält Sensordaten; JPEG bäckt Kontrast, Schärfe und Kompression fest — weniger Spielraum für Tonalität.',
      imageAlt: 'Retusche-Arbeitsplatz mit Bildschirmen',
      imageCredit: unsplashCredit,
    },
    'edit-3': {
      text: 'Die Weißabgleich-Korrektur stellt vor allem… ein',
      answers: {
        b: 'Die Brennweite',
        d: 'Den Auslöserzähler',
        a: 'Farbtemperatur / Farbstich der Szene',
        c: 'Die Autofokus-Punkte',
      },
      explanation:
        'Der Weißabgleich entfernt unerwünschte Farbstiche der Lichtquellen — Basis vor Kurven und Masken.',
      imageAlt: 'Kameragehäuse — Weißabgleich beginnt bei der Aufnahme',
      imageCredit: unsplashCredit,
    },
    'edit-4': {
      text: 'Übliche nicht-destruktive Retusche-Praktiken umfassen…',
      answers: {
        c: 'Das einzige Original mit einem winzigen JPEG überschreiben',
        a: 'Einstellungsebenen / Sidecars nutzen',
        d: 'Kopien für Web/Druck exportieren',
        b: 'Das originale RAW/Master behalten',
      },
      explanation:
        'Nie das Master zerstören; mit reversiblen Edits und Exporten arbeiten — das ist nicht-destruktives Arbeiten.',
      imageAlt: 'Tippen am Laptop — nicht-destruktive Retusche-Gewohnheiten',
      imageCredit: unsplashCredit,
    },
    'edit-5': {
      text: 'Klarheit- / Struktur-Regler beeinflussen vor allem…',
      answers: {
        d: 'Nur die GPS-Höhe',
        b: 'Die Akkuladegeschwindigkeit',
        a: 'Lokalen Mitteltonkontrast / Textur-Relief',
        c: 'Die Objektiv-Firmware',
      },
      explanation:
        'Sie betonen Mittelfrequenz-Kontrast; Überdosierung wirkt knusprig und unnatürlich.',
      imageAlt: 'Neblige Waldtextur — Terrain für Klarheit / Struktur',
      imageCredit: unsplashCredit,
    },
    'edit-6': {
      text: 'Ein Foto zuzuschneiden…',
      answers: {
        d: 'Macht Belichtung überflüssig',
        b: 'Erhöht nachträglich den optischen Zoom',
        a: 'Ändert den Bildausschnitt und kann die Komposition verbessern',
        c: 'Fügt immer Megapixel hinzu',
      },
      explanation:
        'Zuschneiden ist ein Kompositionswerkzeug; starke Crops senken die Auflösung für den Export.',
      imageAlt: 'Landschaftsszene bereit für einen durchdachten Crop',
      imageCredit: unsplashCredit,
    },
    'edit-7': {
      text: 'Beim Color Grading ist ein häufiges Risiko extremer HSL-Verschiebungen…',
      answers: {
        c: 'Schnellerer Autofokus',
        b: 'Größere Sensoren',
        a: 'Unnatürliche Hauttöne und Banding',
        d: 'Pflicht zum Löschen des RAW',
      },
      explanation:
        'Haut liegt in subtilen Orange-/Gelbbereichen — zu starkes Schieben wirkt künstlich.',
      imageAlt: 'Stimmungsvolle Farblandschaft — Risiko extremer HSL',
      imageCredit: unsplashCredit,
    },
    'edit-8': {
      text: 'Schärfe sollte man am besten…',
      answers: {
        a: 'Mit Blick auf die Ausgabe anwenden (Bildschirm vs. Druck)',
        b: 'Nach der Haupt-Rauschreduktion, wenn nötig',
        d: 'Bei 100 %-Zoom prüfen',
        c: 'Auf jeder Ebene dauerhaft auf Maximum setzen',
      },
      explanation:
        'Ausgabe-Schärfe hängt vom Medium ab; bei 1:1 prüfen, um Halos zu vermeiden.',
      imageAlt: 'Detaillierte Landschaftstextur für Ausgabe-Schärfe',
      imageCredit: unsplashCredit,
    },
    'edit-9': {
      text: 'Dodge and Burn bedeutet traditionell…',
      answers: {
        b: 'Kameramarken zu wechseln',
        d: 'Histogramme zu deaktivieren',
        c: 'Automatisch nach TIFF zu konvertieren',
        a: 'Lokal aufzuhellen / abzudunkeln, um den Blick zu führen',
      },
      explanation:
        'Klassische Labortechnik, digital mit weichen Pinseln und Masken — Tonalität lokal steuern.',
      imageAlt: 'Berglicht und Schatten — Metapher für Dodge and Burn',
      imageCredit: unsplashCredit,
    },
    'edit-10': {
      text: 'Reparatur- / inhaltssensitive Tools eignen sich für Staub, sind ethisch heikel wenn…',
      answers: {
        b: 'Sie einen Sensorfleck am Himmel entfernen',
        c: 'Sie den Horizont leicht begradigen',
        d: 'Sie nach sRGB exportieren',
        a: 'Sie Körper verändern oder Fakten einer Nachrichten-Szene manipulieren',
      },
      explanation:
        'Dokumentarische / journalistische Ethik begrenzt manipulative Retusche von Personen und Ereignissen.',
    },
    'edit-11': {
      text: 'sRGB wird üblicherweise genutzt für…',
      answers: {
        a: 'Web und allgemeine Bildschirm-Freigabe',
        b: 'Nur Kinokameras',
        c: 'Das Messen von Blendenlamellen',
        d: 'Das Benennen von Ebenen',
      },
      explanation:
        'sRGB ist der sichere Default für Online-Anzeige; Druck kann breitere Farbräume mit Profilen nutzen.',
      imageAlt: 'Smartphone-Bildschirm — sRGB-Ausgabe fürs Web',
      imageCredit: unsplashCredit,
    },
    'edit-12': {
      text: 'Sinnvolle erste Checks beim Öffnen einer Datei zur Retusche…',
      answers: {
        b: 'Weißabgleich',
        a: 'Belichtung / Histogramm',
        d: 'Kompositions- / Crop-Bedarf',
        c: 'Sofort immer das gesamte EXIF löschen',
      },
      explanation:
        'Zuerst globale Belichtungskorrektur / Weißabgleich und Bildausschnitt — dann Mikro-Retusche.',
      imageAlt: 'Laptop-Dashboard — erste Checks beim Öffnen einer Datei',
      imageCredit: unsplashCredit,
    },
    'edit-13': {
      text: 'Posterisation / Banding in Himmeln entsteht oft wenn…',
      answers: {
        d: 'Du Gitterlinien aktivierst',
        c: 'Du an einem sonnigen Tag nur bei f/8 fotografierst',
        b: 'Du draußen ein Stativ nutzt',
        a: 'Starke Verläufe auf 8-Bit-Export oder aggressive Rauschreduktion treffen',
      },
      explanation:
        'Sanfte Töne brauchen Bit-Tiefe und behutsame Verarbeitung; subtiler Grain kann helfen.',
    },
    'edit-14': {
      text: 'Ein Vignetten-Effekt…',
      answers: {
        a: 'Dunkelt (oder hellt) die Ränder ab, um die Aufmerksamkeit zu bündeln',
        c: 'Konvertiert nur nach CMYK',
        b: 'Ändert Autofokus-Motoren',
        d: 'Entfernt das Copyright',
      },
      explanation:
        'Dezente Vignetten führen den Blick; starke wirken schnell veraltet.',
      imageAlt: 'Bergpanorama — klassische Vignetten-Metapher',
      imageCredit: unsplashCredit,
    },
    'edit-15': {
      text: 'Bei ethischer Porträt-Retusche für allgemeine Kunden…',
      answers: {
        d: 'Erwartungen vor der Lieferung besprechen',
        b: 'Natürliche Hauttextur erhalten',
        c: 'Extreme Körperformung ohne Einwilligung',
        a: 'Temporäre Unebenheiten bereinigen, wenn vereinbart',
      },
      explanation:
        'Einwilligung und Natürlichkeit schlagen starke Beauty-Filter — außer explizit gewünscht.',
      imageAlt: 'Outdoor-Porträt zur Beurteilung ethischer Haut-Retusche',
      imageCredit: unsplashCredit,
    },
    'edit-16': {
      text: 'Export für Instagram bedeutet meist…',
      answers: {
        a: 'Ein JPEG/HEIC mit vernünftiger Auflösung in sRGB',
        d: 'ProRes-RAW-Datei',
        c: 'Nur DNG',
        b: 'Immer ein 2-GB-16-Bit-TIFF',
      },
      explanation:
        'Soziale Plattformen komprimieren nach — übergroße Master verschwenden Zeit beim Export.',
      imageAlt: 'Social-App-Icon — Exportgröße für Instagram',
      imageCredit: unsplashCredit,
    },
    'edit-17': {
      text: 'Frequenztrennung dient vor allem dazu…',
      answers: {
        d: 'Die hyperfokale Distanz zu messen',
        a: 'Textur von Farbe/Ton für fortgeschrittene Hautarbeit zu trennen',
        c: 'Akkus schneller zu laden',
        b: 'Nur Landschaften zu focus-stacken',
      },
      explanation:
        'Fortgeschrittene Technik — leicht übertrieben und Haut wird plastisch.',
      imageAlt: 'Hauttextur in Nahaufnahme — Terrain der Frequenztrennung',
      imageCredit: unsplashCredit,
    },
    'edit-18': {
      text: 'Zeichen von Überbearbeitung sind…',
      answers: {
        c: 'Natürliche Farbübergänge',
        a: 'Halos an Kanten',
        b: 'Knuspriges Rauschen / plastische Haut',
        d: 'HDR-Glow mit grauen, flachen Mitteltönen',
      },
      explanation:
        'Wenn die Bearbeitung selbst zum Motiv wird, zurücknehmen.',
      imageAlt: 'Kühnes Grafikdesign — Zeichen von Überbearbeitung',
      imageCredit: unsplashCredit,
    },
    'edit-19': {
      text: 'Eine Soft Proof im Retusche-Programm hilft dir…',
      answers: {
        b: 'Megapixel zu erhöhen',
        c: 'Im Dunkeln zu fokussieren',
        a: 'Vorausschauend zu sehen, wie Farben im Ziel-Druckprofil wirken',
        d: 'Automatisch Objektivdeckel zu entfernen',
      },
      explanation:
        'Soft Proof simuliert Gamut/Papier vor dem Tintenverbrauch — vor dem finalen Export prüfen.',
      imageAlt: 'Laptop und Kaffee — Soft Proof vor Druck / Kundenlieferung',
      imageCredit: unsplashCredit,
    },
    'edit-20': {
      text: 'Der beste letzte Schritt vor der Kundenlieferung ist oft…',
      answers: {
        a: 'Ein frischer Blick auf einem anderen Display + konsistente Namen/Export',
        c: 'Zufällige Wasserzeichen auf Gesichtern',
        b: 'Backups löschen',
        d: 'Jeden Regler auf Maximum',
      },
      explanation:
        'Abstand und Konsistenz finden mehr Fehler als noch mehr Effekte.',
    },
    'edit-21': {
      text: 'Mythos: „Im RAW lässt sich später alles retten.“',
      answers: {
        b: 'Falsch — RAW hilft bei Belichtungs-/Farblatitüde, nicht bei Unschärfe oder hartem Clipping',
        c: 'Nur bei Schwarzweiß wahr',
        a: 'Wahr — Fokus, Bewegungsunschärfe und geclippte Spektren kommen perfekt zurück',
        d: 'RAW deaktiviert das Objektiv bis zum Export',
      },
      explanation:
        'RAW ist flexibel, nicht magisch. Fokus und Verschlusszeit gewinnst du in der Kamera.',
    },
    'edit-22': {
      text: 'Haut wirkt nach der Retusche plastisch. Wahrscheinliche Ursache?',
      answers: {
        a: 'Zu viel Frequenztrennung / Glättung / extreme Klarheit',
        b: 'Bei f/8 im Freien fotografieren',
        c: 'Ein Festbrennweiten-Objektiv nutzen',
        d: 'sRGB fürs Web exportieren',
      },
      explanation:
        'Überglättung tötet Poren und Textur. Zurücknehmen, bis Haut noch wie Haut aussieht.',
      imageAlt: 'Porträt-Nahaufnahme',
      imageCredit: unsplashCredit,
    },
    'edit-23': {
      text: 'Vor dem Senden an den Kunden gehören zu guten letzten Checks…',
      answers: {
        a: 'Staub / Sensorflecken am Himmel suchen',
        d: 'Größe und Farbprofil passend zum Einsatz exportieren',
        b: 'Crop-Ausrichtung und Schreibweise bei Text-Overlays prüfen',
        c: 'Temporäre Reject-Sticker auf Finaldateien lassen',
      },
      explanation:
        'Saubere, zielpassende Dateien liefern — nicht deine Arbeits-Rejects.',
      imageAlt: 'Checklisten-Dokumente — letzte Checks vor dem Kundenversand',
      imageCredit: unsplashCredit,
    },
    'edit-24': {
      text: 'Kunde will „sauberere Haut“, aber natürliche Textur für eine Lifestyle-Marke. Riskanter Pipeline?',
      answers: {
        a: 'Globale starke Weichzeichner / plastische Glätter über das ganze Gesicht',
        b: 'Nur Staub heilen, dann sanfte Frequenztrennung oder maskierte Texturarbeit',
        c: 'Jede temporäre Unebenheit für immer lassen — Haut nie anfassen',
        d: 'Klarheit +100 auf Poren für „mehr Realismus“',
      },
      explanation:
        'Globale Glätter töten Poren und Markenvertrauen. Gezielte Maske hält Textur.',
    },
    'edit-25': {
      text: 'Du machst Soft Proof mit einem Mattpapier-Profil und Rottöne wirken dumpf. Richtige Lesart?',
      answers: {
        c: 'Immer vor dem Druck-Soft-Proof nach sRGB konvertieren',
        a: 'Außerhalb des Gamuts / Papiergrenzen — mit aktiver Soft Proof korrigieren, nicht dem Screen-Pop hinterherjagen',
        d: 'Mattpapier braucht beim Export immer +2 Belichtung',
        b: 'Der Monitor ist kaputt — Papierprofile ignorieren',
      },
      explanation:
        'Soft Proof zeigt druckbare Farbe. Mit aktiver Prüfung korrigieren, nicht einem ungeprüften Display vertrauen.',
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

if (count !== 190) throw new Error(`expected 190 LS, got ${count}`);

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`OK: wrote ${count} LocalizedString.de on retouching`);

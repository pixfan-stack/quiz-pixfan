#!/usr/bin/env node
/**
 * Vague 1.92 — add LocalizedString.de for pack lightroom-workflow (194 LS).
 * Idempotent: overwrites de with the canonical non-scolaire DE copy.
 * Vocab aligns with guides/retouche-lightroom article.de
 * (Katalog · Entwickeln · Vorgaben · Masken · Gradationskurve · HSL · Export · Pixfan-Pfad)
 * and sharePreview LABELS.de « Lightroom-Workflow » + guide CTA « Lightroom-Workflow-Quiz ».
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'lightroom-workflow');
if (!pack) throw new Error('lightroom-workflow not found');

const unsplash = 'Unsplash — freie Nutzung (Unsplash-Lizenz)';
const unsplashPhoto = 'Foto: Unsplash';

const de = {
  title: 'Lightroom-Workflow (Pixfan-Pfad)',
  description:
    'Katalog, Entwickeln, Masken und saubere Exporte — der Retusche-Pfad, den Pixfan für Lightroom Classic lehrt.',
  questions: {
    'lr-01': {
      text: 'In Lightroom Classic (Hauptpfad, den Pixfan lehrt) werden Fotos vor allem verwaltet über…',
      answers: {
        b: 'Tägliches Umbenennen der Dateien auf dem Schreibtisch',
        c: 'Löschen des Katalogs nach jedem Export',
        a: 'Einen Katalog, der auf die Dateien verweist (plus Ordner/Sammlungen)',
        d: 'Bearbeiten ausschließlich im Papierkorb',
      },
      explanation:
        'Classic ist katalogzentriert: die Datenbank speichert die Retusche, während die Dateien dort bleiben, wo Sie sie ablegen. Diese Katalogdisziplin ist die Basis eines sauberen Pixfan-Workflows.',
      imageAlt: 'Offenes Laptop auf einem Schreibtisch für eine Katalog-/Entwickeln-Session',
      imageCredit: unsplash,
    },
    'lr-02': {
      text: 'Eine nicht-destruktive Entwickeln-Retusche in Lightroom bedeutet…',
      answers: {
        a: 'Dass die Pixel der Originaldatei sofort überschrieben werden',
        b: 'Dass Anpassungen als Anweisungen gespeichert werden, bis exportiert / extern gespeichert wird',
        c: 'Dass man im Leben nur einmal rückgängig machen darf',
        d: 'Dass JPEG verpflichtend ist, um zerstörungsfrei zu arbeiten',
      },
      explanation:
        'Lightroom speichert ein Rezept, keine abgeflachte Datei. Der Export (oder die externe Bearbeitung) materialisiert die Pixel — behalten Sie Master so lange wie möglich nicht-destruktiv.',
      imageAlt: 'Farbenfrohe UI-Panels, die nicht-destruktive Bearbeitungsrezepte evozieren',
      imageCredit: unsplash,
    },
    'lr-03': {
      text: 'Ein sinnvoller erster Entwickeln-Check nach dem Import (Pixfan-Habit) ist meist…',
      answers: {
        b: 'Zufällig freistellen ohne Horizont oder Absicht zu prüfen',
        a: 'Maximale Klarheit + Enthazen, bevor man die Belichtung anschaut',
        d: 'Sofort 100 Vollauflösungs-Kopien exportieren',
        c: 'Histogramm / Clipping prüfen, Weißabgleich setzen und dann den globalen Ton',
      },
      explanation:
        'Daten lesen, Farbstich neutralisieren, globale Belichtungsgeschichte setzen — danach lokale Arbeit. Sofort zu schweren lokalen Masken zu springen kostet oft Zeit.',
      imageAlt: 'Laptop-Panel — erste Entwickeln-Checks nach dem Import',
      imageCredit: unsplash,
    },
    'lr-04': {
      text: 'Virtuelle Kopien sind nützlich, weil…',
      answers: {
        b: 'Sie alternative Looks ohne zusätzliche Master-Dateien erlauben',
        c: 'Sie Backups überflüssig machen',
        a: 'Sie jedes Mal komplette RAW-Dateien auf der Festplatte duplizieren',
        d: 'Sie nur bei Video funktionieren',
      },
      explanation:
        'Virtuelle Kopien sind alternative Rezepte, die auf dieselbe Datei zeigen.',
      imageAlt: 'Farbenfrohe UI-Panels — virtuelle Kopien für alternative Looks',
      imageCredit: unsplash,
    },
    'lr-05': {
      text: 'Sammlungen (gegenüber Ordnern) dienen vor allem dazu…',
      answers: {
        a: 'Auswahlen/Serien zu organisieren, ohne Dateien auf der Festplatte zu verschieben',
        b: 'Jede Datei physisch in einen einzigen Ordner umzulegen',
        d: 'Die Kamera-Firmware zu ändern',
        c: 'Abgelehnte Fotos automatisch zu löschen',
      },
      explanation:
        'Ordner = Speicherort auf der Festplatte. Sammlungen = redaktionelle Gruppierung.',
      imageAlt: 'Notizbuch und Dokumente — Sammlungen gegenüber Festplattenordnern',
      imageCredit: unsplash,
    },
    'lr-06': {
      text: 'Export-Schärfung „Bildschirm“ gegenüber „Druck“ unterscheidet sich vor allem, weil…',
      answers: {
        c: 'Sie immer identisch sind',
        d: 'Druckschärfung Metadaten löscht',
        a: 'Druck meist mehr Schärfung braucht wegen Betrachtungsabstand / Tintendiffusion',
        b: 'Bildschirm-Schärfung nur in CMYK funktioniert',
      },
      explanation:
        'Ausgabeschärfung passt sich dem Medium an. Übernehmen Sie Druckeinstellungen nicht blind für Instagram oder eine Kunden-Webgalerie.',
      imageAlt: 'Design-Farbmuster — Export-Schärfung Bildschirm gegenüber Druck',
      imageCredit: unsplash,
    },
    'lr-07': {
      text: 'Profile gegenüber Vorgaben in modernem Lightroom — richtige Aussage?',
      answers: {
        a: 'Profile remappen die Farb-/Tongrundlage; Vorgaben wenden einen Stapel Schieberegler an',
        b: 'Vorgaben ersetzen Profile für immer',
        d: 'Sie sind dieselbe Schaltfläche',
        c: 'Profile ändern nur Dateinamen',
      },
      explanation:
        'Starten Sie mit einem sinnvollen Profil, dann feinabstimmen mit Vorgaben/Reglern — stapeln Sie nicht blind widersprüchliche Looks.',
      imageAlt: 'Design-Werkzeuge und Farbmuster — Profile gegenüber Vorgaben',
      imageCredit: unsplash,
    },
    'lr-08': {
      text: 'Entwickeln-Einstellungen über eine Burst-Serie synchronisieren / einfügen ist klug, wenn…',
      answers: {
        d: 'Nur für JPEG, nie RAW',
        a: 'Licht und Absicht konsistent sind; Ausreißer danach lokal nachziehen',
        c: 'Sie einzigartige Fleckenkorrekturen auf jedem Gesicht überschreiben wollen',
        b: 'Jedes Bild völlig anderen WB und Zuschnitt braucht — trotzdem alles gleich synchronisieren',
      },
      explanation:
        'Bündeln Sie den gemeinsamen Look; synchronisieren Sie nicht blind stark lokale Korrekturen.',
      imageAlt: 'Laptop auf einem Schreibtisch — gemeinsamer Entwickeln-Look wird synchronisiert',
      imageCredit: unsplash,
    },
    'lr-09': {
      text: 'Maskieren (Motiv / Himmel / Pinsel) schlägt einen globalen Schieberegler, wenn…',
      answers: {
        d: 'Globale Belichtung in Lightroom verboten ist',
        b: 'Sie immer identische Änderungen auf jedem Pixel wollen',
        a: 'Sie unterschiedliche Behandlung in unterschiedlichen Regionen brauchen',
        c: 'Masken nur bei Handy-Exporten funktionieren',
      },
      explanation:
        'Global setzt die Basis; Masken verfeinern die Geschichte ohne den Rest zu zerstören — die übliche Pixfan-Reihenfolge: global → lokal.',
      imageAlt: 'Laptop auf einem Schreibtisch, der einen digitalen Bearbeitungsworkflow andeutet',
      imageCredit: unsplashPhoto,
    },
    'lr-10': {
      text: 'Smart Previews helfen am meisten, wenn Sie…',
      answers: {
        c: 'Druckfertige TIFFs im Katalog eingebettet brauchen',
        a: 'Fern von den Originaldateien bearbeiten (Reise/Laptop) mit leichteren Proxys',
        b: 'Master dauerhaft und sicher löschen wollen',
        d: 'Bereits nur JPEG fotografieren',
      },
      explanation:
        'Smart Previews sind portable Platzhalter. Synchronisieren Sie zurück, wenn die Originale wieder verbunden sind.',
    },
    'lr-11': {
      text: 'Objektivkorrekturen / Profilkorrekturen aktivieren beheben vor allem…',
      answers: {
        b: 'Fokus, der zwei Meter daneben lag',
        a: 'Verzeichnung, Vignettierung und oft chromatische Aberration bekannter Objektive',
        c: 'Urheberrechtsstreitigkeiten',
        d: 'Den Batterieverbrauch der Kamera',
      },
      explanation:
        'Optische Profile korrigieren bekannte Objektiv-Eigenheiten — keine kreativen Fokusfehler.',
      imageAlt: 'Festbrennweite — Objektivkorrekturen / Profileinstellungen',
      imageCredit: unsplash,
    },
    'lr-12': {
      text: 'Vor der Kundenübergabe aus Lightroom enthält ein smarter letzter Pixfan-Pass…',
      answers: {
        c: 'Immer alle Copyright-Metadaten entfernen',
        b: 'Einmal auf 72 px Breite für alles exportieren',
        d: '10 zufällige Vorgaben stapeln',
        a: 'Zuschnitte, Staub, Hautethik, Softproof bei Druck und korrekte Exportgröße/Farbraum prüfen',
      },
      explanation:
        'Übergabe ist Handwerk + Professionalität: technisches QA (Flecken, Zuschnitte, WB) und das passende Ausgaberezept für den Brief.',
      imageAlt: 'Aufgeräumter Arbeitsplatz — QA-Checklisten-Vibe für Kundenübergabe',
      imageCredit: unsplash,
    },
    'lr-13': {
      text: 'Gradationskurve gegenüber Basiseinstellungen — wann die Kurve bevorzugen?',
      answers: {
        d: 'Nie — Kurven sind veraltet',
        c: 'Nur um Groß-/Kleinschreibung des Dateinamens zu ändern',
        b: 'Immer statt überhaupt Belichtung zu setzen',
        a: 'Für präzise Kontrastformung / Kanalkurven nach solider Basis-Belichtung',
      },
      explanation:
        'Die Basis bringt Sie nah heran; Kurven verfeinern Kontrast und Farbe mit feinerer Kontrolle.',
      imageAlt: 'Atmosphärische Töne — Urteil Gradationskurve gegenüber Basiseinstellungen',
      imageCredit: unsplash,
    },
    'lr-14': {
      text: 'Bereichsmasken (Luminanz/Farbe) verfeinern eine Auswahl…',
      answers: {
        a: 'Indem sie die Maske auf ähnliche Helligkeits- oder Farbtonbereiche begrenzen',
        b: 'Indem sie den Katalog automatisch löschen',
        d: 'Indem sie RAW an Ort und Stelle in TIFF umwandeln',
        c: 'Indem sie die Verschlusszeit an der Kamera ändern',
      },
      explanation:
        'Nach einer breiten Maske halten Bereichsgrenzen die Anpassungen auf den Tönen/Farben, die Sie meinen.',
    },
    'lr-15': {
      text: 'KI-Denoise gegenüber Schärfen: beste Denkreihenfolge?',
      answers: {
        a: 'Zuerst Rauschen bereinigen (besonders bei hoher ISO), dann vorsichtig für die Ausgabe schärfen',
        b: 'Zuerst aggressiv schärfen, um „Detail aus Rauschen zu erzeugen“',
        d: 'Denoise erst nach dem Social-Upload',
        c: 'Porträts nie entrauschen',
      },
      explanation:
        'Rauschen zu schärfen erzeugt Körnung. Stabilisieren Sie die Datei, dann schärfen Sie für das Medium.',
      imageAlt: 'Nachthimmel mit Sternen — Denoise vor dem Schärfen',
      imageCredit: unsplash,
    },
    'lr-16': {
      text: 'Color-Grading-Räder gegenüber HSL — wann ist Grading das bessere Werkzeug?',
      answers: {
        a: 'Beim Formen der Stimmung über Schatten/Mitteltöne/Lichter wie ein filmischer Grade',
        b: 'Nur beim Korrigieren einer einzelnen falschen Weißabgleich-Messung',
        d: 'Beim Umbenennen von Ordnern',
        c: 'Beim Entfernen von Staubflecken',
      },
      explanation:
        'HSL zielt auf konkrete Farbtöne; Grading malt Atmosphäre über Tonregionen.',
      imageAlt: 'Atmosphärische farbige Landschaft — Color-Grading-Atmosphäre',
      imageCredit: unsplash,
    },
    'lr-17': {
      text: 'Softproof zeigt Clipping-Warnungen für ein Druckprofil. Beste Reaktion?',
      answers: {
        b: 'Ignorieren und trotzdem den Bildschirm-Look drucken',
        a: 'Mit aktivem Softproof (Absicht/Rendering) nachziehen, bis kritische Farben halten',
        c: 'Nach sRGB konvertieren und denselben sRGB erneut softproofen',
        d: 'Dynamik +100, um den Gamut zu „erzwingen“',
      },
      explanation:
        'Softproof ist die Probe. Bearbeiten Sie für das Papier, nicht für das leuchtende Display.',
    },
    'lr-18': {
      text: 'Welche Praktiken halten einen Lightroom-Katalog langfristig gesund?',
      answers: {
        a: 'Regelmäßige Katalog-Backups + verifizierte Festplatten-Backups der Originale',
        b: 'Die einzige Katalogkopie auf einem ausfallenden USB-Stick speichern',
        c: 'Ordner konsistent innerhalb von Lightroom verschieben, damit Links nicht brechen',
        d: 'Gelegentlich Katalog optimieren / Integritätswarnungen nicht ignorieren',
      },
      explanation:
        'Katalog + Master brauchen beide Backups. Verschieben Sie Dateien über Lightroom; pflegen Sie die Datenbank.',
      imageAlt: 'Hände auf einem Laptop — gesunde langfristige Kataloggewohnheiten',
      imageCredit: unsplash,
    },
    'lr-19': {
      text: 'Sie haben einen Look batch-synchronisiert und sehen, dass ein Gesicht einen Heilungsfleck von Staub eines anderen Bildes hat. Ursache?',
      answers: {
        b: 'Lightroom erfindet Flecken immer per KI',
        c: 'Export-Schärfung erzeugt Heilungsflecken',
        d: 'Virtuelle Kopien deaktivieren Fleckenwerkzeuge',
        a: 'Fleckenentfernung / lokale Korrekturen waren in der Sync dabei — stark lokale Werkzeuge beim Batchen abwählen',
      },
      explanation:
        'Sync-Checkboxen zählen. Teilen Sie WB/Ton; behalten Sie Heilung pro Bild einzigartig.',
    },
    'lr-20': {
      text: 'Kunde braucht sRGB-Web + Adobe-RGB-Druck aus einem Master. Sauberer Pixfan-Workflow?',
      answers: {
        d: 'Nach Graustufen konvertieren, um „Farbmanagement zu vereinfachen“',
        a: 'Master in weitem Arbeitsfarbraum fertigstellen, Druck softproofen, dann getrennte Exporte mit korrekten Profilen/Größen',
        c: 'Die .lrcat-Datei als Lieferobjekt mailen',
        b: 'Einmal nach sRGB exportieren und das für Druck hochskalieren',
      },
      explanation:
        'Ein Entwickeln-Master, mehrere zweckmäßige Exporte — nie von einem gequetschten Web-JPEG drucken. Dieser Habit „ein Master → viele Ausgaben“ ist zentraler Pixfan-Rat.',
      imageAlt: 'Langzeitbelichtungs-Wasserfall, der sorgfältige Verarbeitung von Lichtern und Bewegung andeutet',
      imageCredit: unsplashPhoto,
    },
    'lr-21': {
      text: 'Gesunde Lightroom-Classic-Kataloghygiene umfasst meist…',
      answers: {
        b: 'Den Katalog nach jedem Export löschen, „um leicht zu bleiben“',
        c: 'Die einzige Katalogkopie auf einem USB speichern, den Sie wöchentlich verlieren',
        d: 'Nie backuppen, weil Smart Previews ein vollständiges Archiv sind',
        a: 'Regelmäßige Katalog-Backups + wissen, wo die .lrcat liegt',
      },
      explanation:
        'Retuschen leben im Katalog; Backups sind nicht verhandelbare Pixfan-Hygiene.',
      imageAlt: 'Hände auf einem Laptop — Disziplin beim Katalog-Backup',
      imageCredit: unsplash,
    },
    'lr-22': {
      text: 'Vor einer großen Entwickeln-Sync über ähnliche Bilder ist ein smarter Pixfan-Habit…',
      answers: {
        b: 'Alles blind synchronisieren inklusive Heilungsflecken anderer Gesichter',
        c: 'Vorschauen deaktivieren, damit Fehler länger unsichtbar bleiben',
        d: 'Die ganze Session vor dem Sync nach JPEG konvertieren',
        a: 'Einen Helden prüfen, bewusst synchronisieren und dann Ausreißer QA (Gesichter, Staub, Zuschnitte)',
      },
      explanation:
        'Sync ist ein Multiplikator — gute Looks und schlechte Fehler skalieren beide.',
    },
    'lr-23': {
      text: 'Sie brauchen eine S/W-Version ohne den Farb-Master zu verlieren. Sauberer Ansatz?',
      answers: {
        b: 'JPEG exportieren, neu öffnen, entsättigen und das RAW überschreiben',
        c: 'Alle Farbretuschen löschen, damit für immer nur S/W bleibt',
        d: 'Das Kameraprofil nur in der Kamera auf Monochrom stellen',
        a: 'Virtuelle Kopie (oder Momentaufnahme) für S/W; Farb-Master intakt lassen',
      },
      explanation:
        'Virtuelle Kopien halten nicht-destruktive Abzweigungen derselben Masterdatei.',
    },
    'lr-24': {
      text: 'Kundenübergabe aus Lightroom — welcher Export-Habit ist am solidesten im Pixfan-Stil?',
      answers: {
        b: 'Immer ProPhoto-JPEG bei 300 % Größe „zur Sicherheit“ exportieren',
        c: 'Die Katalogdatei statt gerenderter Bilder mailen',
        d: 'Schärfung und Farbprofil bei jedem Web-Export weglassen',
        a: 'Benannte Vorgaben pro Ziel (Web sRGB / Druck) + kurzes visuelles QA der Exporte',
      },
      explanation:
        'Wiederholbare Export-Vorgaben + ein letzter Blick schlagen jedes Mal Improvisieren.',
      imageAlt: 'Laptop-Schreibtisch — Batch-Sync-QA vor der Übergabe',
      imageCredit: unsplash,
    },
    'lr-25': {
      text: 'Eine Luminanz-Bereichsmaske ist besonders nützlich, wenn Sie…',
      answers: {
        b: 'Jede Weißabgleich-Steuerung ersetzen wollen',
        c: 'Automatisch IPTC-Copyright in jeden Export schreiben wollen',
        d: 'Jeden Himmel unabhängig von der Auswahl neonlila zwingen wollen',
        a: 'Eine lokale Anpassung auf helle oder dunkle Tonregionen begrenzen wollen',
      },
      explanation:
        'Bereichsmasken verfeinern, wo eine lokale Retusche nach Ton oder Farbe landet.',
    },
    'lr-26': {
      text: 'Mythos: „Mehr Klarheit macht ein Foto immer professioneller.“ Besserer Rahmen?',
      answers: {
        b: 'Klarheit betrifft im Druck nur den Blaukanal',
        c: 'Sie müssen Klarheit bei jeder Landschaft für immer maximieren',
        d: 'Klarheit ersetzt Objektivkorrekturen vollständig',
        a: 'Klarheit ist ein Mittelton-Kontrastwerkzeug — leicht Haut und Dunst zu zerquetschen ohne Gewinn',
      },
      explanation:
        'Nutzen Sie Klarheit mit Absicht; Gesichter und weiche Atmosphären wollen oft Zurückhaltung.',
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
console.log(`OK: wrote ${count} LocalizedString.de on lightroom-workflow`);

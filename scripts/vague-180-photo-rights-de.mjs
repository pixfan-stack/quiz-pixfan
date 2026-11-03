#!/usr/bin/env node
/**
 * Vague 1.80 — add LocalizedString.de for pack photo-rights (180 LS).
 * Idempotent: overwrites de with the canonical scolaire DE copy.
 * Aligns with hub EMI DE CTA « Bildrecht » / « Quiz Foto-Rechte »
 * and guide droits article.de « Foto-Rechte & Ethik ».
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'photo-rights');
if (!pack) throw new Error('photo-rights not found');

const unsplashCredit =
  'Unsplash — freie Nutzung (Unsplash-Lizenz)';

const de = {
  title: 'Foto-Rechte & Ethik',
  description:
    'Urheberrecht, Model Release, Privatsphäre und verantwortungsvolles Teilen.',
  questions: {
    'rights-1': {
      text: 'In den meisten Ländern wem gehört standardmäßig das Urheberrecht an einem Foto?',
      answers: {
        b: 'Jedem, der es in sozialen Medien liked',
        a: 'Dem Fotografen, der es geschaffen hat',
        c: 'Dem Kamerahersteller',
        d: 'Dem abgebildeten Motiv, automatisch und immer',
      },
      explanation:
        'Das Urheberrecht steht in der Regel dem Urheber (dem Fotografen) zu — außer bei Abtretung per Vertrag oder Werk im Auftrag/Arbeitsverhältnis.',
      imageAlt: 'Vertrag und Stift auf einem Schreibtisch',
      imageCredit: unsplashCredit,
    },
    'rights-2': {
      text: '„Alle Rechte vorbehalten“ bedeutet in der Regel…',
      answers: {
        a: 'Weiterverwendung braucht Erlaubnis, sofern keine Ausnahme greift',
        b: 'Jeder darf das Foto frei verkaufen',
        d: 'Nur die Nutzung auf Papier ist verboten',
        c: 'Das Foto ist gemeinfrei',
      },
      explanation:
        'Es zeigt, dass der Urheber die Kontrolle behält; Lizenz prüfen oder vor kommerzieller/neuveröffentlichender Nutzung fragen.',
      imageAlt: 'Handschlag über einer Vereinbarung',
      imageCredit: unsplashCredit,
    },
    'rights-3': {
      text: 'Eine Creative-Commons-Lizenz „BY-NC“ erlaubt typischerweise…',
      answers: {
        d: 'Den Lizenzhinweis immer zu entfernen',
        a: 'Nichtkommerzielle Weiterverwendung mit Namensnennung des Autors',
        c: 'Zu behaupten, man habe das Foto selbst gemacht',
        b: 'Kommerzielle Werbung ohne Attribution',
      },
      explanation:
        'BY = Namensnennung; NC = nichtkommerziell. Immer den genauen CC-Lizenztext lesen.',
      imageAlt: 'Lizenzunterlagen — Creative-Commons-Wahl zählt',
      imageCredit: unsplashCredit,
    },
    'rights-4': {
      text: 'Wann kann eine Model Release (Model-Freigabe) nötig sein?',
      answers: {
        c: 'Ein Porträt in einer Markenkampagne zu verwenden',
        b: 'Straßenabzüge ohne erkennbare Gesichter zu verkaufen',
        a: 'Kommerzielle Werbung mit einer erkennbaren Person',
        d: 'Aktuelle Berichterstattung in vielen Rechtsordnungen (oft andere Regeln)',
      },
      explanation:
        'Kommerzielle/werbliche Nutzung des Abbilds braucht oft Zustimmung; redaktionelle Nutzung folgt je nach Land anderen Regeln.',
      imageAlt: 'Erkennbares Gesicht — Terrain der Model Release',
      imageCredit: unsplashCredit,
    },
    'rights-5': {
      text: 'Jemand anderes Instagram-Foto speichern und als eigenes neu posten ist…',
      answers: {
        a: 'In der Regel Urheberrechtsverletzung / unlauter',
        b: 'Immer legal, weil es online war',
        d: 'Nur falsch, wenn das Foto farbig ist',
        c: 'Überall als Fair Use vorgeschrieben',
      },
      explanation:
        'Online-Veröffentlichung verzichtet nicht aufs Urheberrecht. Bloße Credit-Zeile reicht oft nicht ohne Erlaubnis.',
      imageAlt: 'Handybildschirm — keine Instagram-Fotos stehlen',
      imageCredit: unsplashCredit,
    },
    'rights-6': {
      text: 'Ein Gebäude von der öffentlichen Straße zu fotografieren ist oft möglich, aber…',
      answers: {
        d: 'Nur Drohnen sind legal',
        b: 'Man muss dem Architekten immer Gebühren zahlen',
        c: 'Gebäudefotos sind nirgendwo urheberrechtlich geschützt',
        a: 'Kommerzielle Nutzung markanter Architektur / Marken kann weiter eingeschränkt sein',
      },
      explanation:
        'Panoramafreiheit und Marken-/Eigentumsregeln unterscheiden sich stark je nach Land.',
      imageAlt:
        'Öffentliche Straße und Gebäude — freier zu fotografieren, nicht immer zu verkaufen',
      imageCredit: unsplashCredit,
    },
    'rights-7': {
      text: 'Ethische Praktiken beim Fotografieren von Menschen umfassen…',
      answers: {
        a: 'Würde und Kontext respektieren',
        b: 'Vor aufdringlichen Nahaufnahmen nach Möglichkeit fragen',
        c: 'Demütigende Bilder für Klicks zu veröffentlichen',
        d: 'Vorsichtig mit Bildern von Minderjährigen umzugehen',
      },
      explanation:
        'Rechtmäßigkeit ist nicht der einzige Maßstab: Respekt und Einwilligung zählen — besonders bei Kindern.',
      imageAlt: 'Erkennbare Person — Würde und Einwilligungsgewohnheiten',
      imageCredit: unsplashCredit,
    },
    'rights-8': {
      text: 'Ein Foto im Arbeits-/Auftragsverhältnis bedeutet oft…',
      answers: {
        d: 'Es gilt nur Creative Commons',
        a: 'Rechte können laut Vertrag und lokalem Recht dem Arbeitgeber/Kunden gehören',
        b: 'Der Praktikant behält immer die weltweite Exklusivität',
        c: 'Das Urheberrecht verschwindet',
      },
      explanation:
        'Arbeits- und Auftragsverträge übertragen oft die Verwertungsrechte — lesen, bevor man Eigentum unterstellt.',
      imageAlt:
        'Handschlag über Papieren — Werk im Auftrag und Kundenverträge',
      imageCredit: unsplashCredit,
    },
    'rights-9': {
      text: 'GPS-Standort in den Metadaten einzubetten kann…',
      answers: {
        c: 'Das Urheberrecht löschen',
        a: 'Private Orte preisgeben (Wohnung, Schule der Kinder usw.)',
        d: 'Virale Reichweite garantieren',
        b: 'Die Verschlusszeit automatisch erhöhen',
      },
      explanation:
        'EXIF-Standort vor öffentlichem Teilen entfernen oder prüfen, wenn Privatsphäre zählt.',
    },
    'rights-10': {
      text: 'Fair Use / kurze Zitatausnahmen…',
      answers: {
        d: 'Gelten nur für Videos',
        a: 'Sind begrenzt, kontextgebunden und kein Freifahrtschein für jedes Foto',
        c: 'Existieren in jedem Land identisch',
        b: 'Erlauben unbegrenzte kommerzielle Weiterverwendung jedes Bildes',
      },
      explanation:
        'Ausnahmen unterscheiden sich je nach Rechtsordnung und Zweck (Kritik, Information, Bildung…).',
    },
    'rights-11': {
      text: 'Bevor du ein Stockfoto für einen Kunden nutzt, prüfe…',
      answers: {
        a: 'Den Lizenztyp (redaktionell vs. kommerziell)',
        b: 'Nutzungsgrenzen und Attributionspflichten',
        c: 'Ob Model-/Property-Releases deine Nutzung abdecken',
        d: 'Dass die Datei am Bildschirm genau 300 DPI hat',
      },
      explanation:
        'Stock-Lizenzen sind vertraglich: redaktionelle Bilder oft nicht für Werbung tauglich.',
      imageAlt: 'Vertragsunterlagen — Stock-Lizenzen vor Kundenarbeit prüfen',
      imageCredit: unsplashCredit,
    },
    'rights-12': {
      text: 'KI-Modelle, die auf gescrapten Fotos trainiert wurden, werfen vor allem Fragen zu…',
      answers: {
        c: 'Nur ISO-Rauschen',
        a: 'Einwilligung, Urheberrecht und Transparenz der Trainingsdaten',
        b: 'Nur Akkulaufzeit',
        d: 'Dem Durchmesser des Stativgewindes',
      },
      explanation:
        'Rechtliche und ethische Debatten zu Trainingsdaten, Opt-out und Ähnlichkeit dauern an.',
      imageAlt: 'Abstrakte KI-Bildwelt — Debatten um gescraptes Training',
      imageCredit: unsplashCredit,
    },
    'rights-13': {
      text: 'Ein erkennbares Foto einer Privatperson in peinlichem Kontext ohne Einwilligung zu veröffentlichen ist…',
      answers: {
        a: 'Oft rechtlich und ethisch riskant (Privatsphäre / Persönlichkeitsrechte)',
        d: 'Nur ein Farbprofil-Problem',
        c: 'Für Nachrichten Pflicht',
        b: 'Immer in Ordnung, wenn öffentlich aufgenommen',
      },
      explanation:
        'Öffentlicher Ort ≠ Recht, Würde zu verletzen; Bild- und Privatrechte variieren.',
      imageAlt:
        'Erkennbare Privatperson — Würde und Einwilligung vor Veröffentlichung',
      imageCredit: unsplashCredit,
    },
    'rights-14': {
      text: 'Wasserzeichen (Watermarks)…',
      answers: {
        b: 'Sind nötig, damit Urheberrecht entsteht',
        c: 'Machen RAW-Dateien kleiner',
        d: 'Übertragen das Eigentum an Instagram',
        a: 'Können Gelegenheitsdiebstahl abschrecken, ersetzen aber keine Rechte',
      },
      explanation:
        'Urheberrecht besteht ohne Wasserzeichen; es ist vor allem ein praktischer Schutz.',
      imageAlt: 'Handschlag — Credits und professionelle Vereinbarungen',
      imageCredit: unsplashCredit,
    },
    'rights-15': {
      text: 'Gute Gewohnheiten vor der Fotoübergabe an einen Kunden…',
      answers: {
        a: 'Nutzungsrechte schriftlich klären',
        b: 'Bei Bedarf Exklusivität / Dauer / Territorien vereinbaren',
        d: 'Ein Archiv der gelieferten Auswahl behalten',
        c: 'Annehmen, ein mündlicher Chat gelte als weltweite, unbefristete Abtretung',
      },
      explanation:
        'Klarer Vertrag verhindert Streit; archivieren, was geliefert wurde.',
      imageAlt: 'Handschlag — klare Liefervereinbarungen mit Kunden',
      imageCredit: unsplashCredit,
    },
    'rights-16': {
      text: 'Ein Museum, das Flash/Fotos innen verbietet, betrifft vor allem…',
      answers: {
        a: 'Hausordnung, Konservierung und manchmal Rechte Dritter',
        b: 'Internationale ISO-Standards für JPEG',
        c: 'Pflicht-Creative-Commons',
        d: 'Gesetze zur Sensorgröße',
      },
      explanation:
        'Eigentümer können Zugangsbedingungen setzen; Werke können zusätzlich geschützt sein.',
    },
    'rights-17': {
      text: 'Bildnachweise („Foto: Jane Doe“)…',
      answers: {
        a: 'Respektieren das Urheberpersönlichkeitsrecht / die Attribution, gewähren allein aber kein Weiterverwendungsrecht',
        b: 'Verkaufen automatisch die Exklusivität an das Magazin',
        d: 'Sind in der EU illegal',
        c: 'Löschen die EXIF-Daten',
      },
      explanation:
        'Attribution ist gute Praxis; die Lizenz steuert die Weiterverwendung.',
      imageAlt: 'Dokumente auf einem Schreibtisch — Credits und Nutzungshinweise',
      imageCredit: unsplashCredit,
    },
    'rights-18': {
      text: 'Wenn du einen zweiten Fotografen engagierst, solltest du…',
      answers: {
        a: 'Per Vertrag klären, wer die Bilder besitzt / nutzen darf',
        b: 'Nie über Rechte sprechen',
        d: 'Nur mit Likes bezahlen',
        c: 'Annehmen, Social-Media-Posts übertrügen das Eigentum',
      },
      explanation:
        'Zusammenarbeit braucht von Anfang an klare IP-Bedingungen.',
    },
    'rights-19': {
      text: 'Riskante Nutzungen ohne Freigabe umfassen oft…',
      answers: {
        d: 'Merchandising (T-Shirts, Poster zum Verkauf)',
        b: 'Den Eindruck zu erwecken, eine Celebrity endorse eine Marke',
        a: 'Produktverpackung und bezahlte Anzeigen',
        c: 'Privates Familienalbum zu Hause gedruckt',
      },
      explanation:
        'Kommerzielle Verwertung und Endorsement-Anschein brauchen passende Releases/Lizenzen.',
    },
    'rights-20': {
      text: 'Der sicherste Kurz-Tipp vor der Weiterverwendung eines online gefundenen Bildes…',
      answers: {
        b: 'Wenn Google Bilder es zeigt, ist es gratis',
        d: 'Schwarzweiß-Umwandlung hebt das Urheberrecht auf',
        a: 'Gehe von Schutz aus, prüfe die Lizenz, oder erstelle/beauftrage dein eigenes',
        c: '10 % Zuschneiden macht es legal',
      },
      explanation:
        'Der Mythos „10 %-Zuschnitt“ hebt kein Urheberrecht auf. Lizenzieren oder selbst schaffen.',
    },
    'rights-21': {
      text: 'Volle Café-Terrasse (unscharfe Zone öffentlich/privat). Sicherster Reflex vor einer kommerziellen Anzeige?',
      answers: {
        d: 'Kommerzielle Nutzung ist identisch mit einem privaten Familienalbum',
        b: 'Freigaben holen / unkenntliche Mengen bevorzugen / bei kommerzieller Nutzung nachfragen',
        a: 'Alles veröffentlichen — Cafés sind immer frei nutzbar',
        c: 'Ein Emoji über ein einziges Gesicht reicht',
      },
      explanation:
        'Redaktionell vs. kommerziell und Recht am eigenen Bild variieren: wenn Geld im Spiel ist, freigeben oder anonymisieren.',
      imageAlt: 'Café-Terrasse',
      imageCredit: unsplashCredit,
    },
    'rights-22': {
      text: 'Ein Freund bittet dich, den/die Ex aus einem Hochzeitsfoto zu löschen. Was ist der ethische Kern?',
      answers: {
        b: 'Transparent mit den Beteiligten sein; Geschichte/Personen zu retuschieren hat soziales Gewicht',
        a: 'Immer heimlich tun und dem Brautpaar nichts sagen',
        d: 'Nur die KI entscheidet, wer auf Gruppenfotos bleibt',
        c: 'Jede Retusche für immer ablehnen, auch Staubflecken',
      },
      explanation:
        'Technik ist leicht; Einwilligung und Ehrlichkeit gegenüber denen, die die Geschichte leben (und tragen), zählen mehr.',
      imageAlt: 'Hochzeitsfeier — Personen herauszuretschieren hat soziales Gewicht',
      imageCredit: unsplashCredit,
    },
    'rights-23': {
      text: 'Jemand postet ein KI-Bild als „ein Foto, das er gemacht hat“, ohne es zu sagen. Hauptproblem?',
      answers: {
        b: 'Täuschung — das Publikum verliert Vertrauen in Autor und Realität',
        c: 'KI-Bilder können keine rote Farbe enthalten',
        d: 'Kein Problem, wenn der Prompt poetisch war',
        a: 'Die Dateigröße ist meist zu klein',
      },
      explanation:
        'KI kann Kunst sein. Es als aufgenommenes Foto auszugeben, ohne es zu sagen, zerstört Vertrauen.',
      imageAlt: 'Roboter-/KI-Metapher — synthetische Bilder ehrlich kennzeichnen',
      imageCredit: unsplashCredit,
    },
    'rights-24': {
      text: 'Du fotografierst einen Straßenmusiker an einem öffentlichen französischen Ort für einen redaktionellen Blog. Vorsichtiger Reflex?',
      answers: {
        d: 'Ein Logo wegzuschneiden löscht immer alle Rechte',
        c: 'Nur Celebrities brauchen Vorsicht',
        b: 'Öffentlicher Ort = unbegrenzte kommerzielle Nutzung für immer',
        a: 'Öffentlicher Ort hilft, aber erkennbare Personen + kommerzielle/sensible Nutzung können weiter Zustimmung brauchen — im Zweifel fragen oder Gesicht nicht veröffentlichen',
      },
      explanation:
        'Öffentlicher Raum ≠ Blankoscheck. Kontext, Zweck und Würde zählen — besonders bei monetarisierter oder sensibler Veröffentlichung.',
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

if (count !== 180) throw new Error(`expected 180 LS, got ${count}`);

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`OK: wrote ${count} LocalizedString.de on photo-rights`);

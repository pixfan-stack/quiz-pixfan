#!/usr/bin/env node
/**
 * Vague 1.44 — add LocalizedString.es for pack lexique-image-fixe (74 LS).
 * Idempotent: skips fields that already have non-empty es.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'lexique-image-fixe');
if (!pack) throw new Error('lexique-image-fixe not found');

const es = {
  title: 'Léxico de imagen fija',
  description:
    'Encuadre, punto de vista, escala de plano, índice/icono — vocabulario original para bachillerato de artes (sin obras con derechos).',
  questions: {
    'lex-01': {
      text: 'En fotografía, el «encuadre» designa sobre todo…',
      answers: {
        a: 'Elegir qué entra en la imagen y qué queda fuera',
        b: 'Solo comprar un marco de madera',
        c: 'Fotografiar siempre a 1/1000 s',
        d: 'Imprimir solo en blanco y negro',
      },
      explanation:
        'El encuadre decide inclusión/exclusión: bordes, recorte y lo que se invita a mirar.',
    },
    'lex-02': {
      text: 'Un punto de vista de cámara bajo mirando hacia arriba se llama a menudo…',
      answers: {
        a: 'Un contrapicado (contre-plongée)',
        b: 'Un picado (plongée)',
        c: 'Solo un ángulo holandés',
        d: 'Un plano macro',
      },
      explanation:
        'Contrapicado = cámara abajo, mirada hacia arriba (a menudo monumental). Picado = cámara arriba, mirada hacia abajo.',
    },
    'lex-03': {
      text: 'Un primer plano (gros plan) muestra típicamente…',
      answers: {
        a: 'Un rostro o un detalle que llena casi todo el cuadro',
        b: 'Solo el skyline de una ciudad entera',
        c: 'Solo los pies del fotógrafo',
        d: 'Siempre un grupo de veinte personas',
      },
      explanation:
        'La escala de plano (plano general → primer plano) describe cuánto del sujeto ocupa el cuadro.',
    },
    'lex-04': {
      text: 'En análisis de imagen, un «índice» (indice) remite a menudo a…',
      answers: {
        a: 'Una huella causal o física (humo → fuego; pisada → presencia)',
        b: 'Un logo puramente arbitrario sin vínculo con lo real',
        c: 'Solo el nombre de la marca de la cámara',
        d: 'Un aviso legal de copyright',
      },
      explanation:
        'Los signos indexicales conservan un vínculo real con lo que indican; vocabulario útil para leer la foto como huella.',
    },
    'lex-05': {
      text: 'Un «icono» en sentido semiótico…',
      answers: {
        a: 'Se parece a lo que representa (semejanza / analogía)',
        b: 'Es siempre solo una pintura religiosa',
        c: 'Significa que el archivo está cifrado',
        d: 'Prueba automáticamente el derecho de autor',
      },
      explanation:
        'Relación icónica = semejanza. Distinta del índice (huella) y del símbolo (convención).',
    },
    'lex-06': {
      text: 'El «punto de vista» en una imagen fija designa…',
      answers: {
        a: 'Dónde se coloca la cámara (o el ojo implícito) respecto a la escena',
        b: 'Solo la opinión política del fotógrafo',
        c: 'La marca del papel de impresión',
        d: 'El número de likes en redes',
      },
      explanation:
        'Punto de vista = posición y ángulo que estructuran lo que se ve y el efecto producido.',
    },
    'lex-07': {
      text: '¿Qué es el «fuera de campo» (hors-champ) en una fotografía?',
      answers: {
        a: 'Lo que el cuadro sugiere que existe sin mostrarlo',
        b: 'Solo píxeles fuera del archivo JPEG',
        c: 'Una zona de marca de agua obligatoria',
        d: 'Solo el campo GPS EXIF',
      },
      explanation:
        'El fuera de campo es lo que el encuadre implica más allá de los bordes — noción clave para leer la imagen fija.',
    },
    'lex-08': {
      text: 'Una poca profundidad de campo significa en general…',
      answers: {
        a: 'Un plano nítido estrecho; el fondo a menudo suave',
        b: 'Todo está nítido del primero al último plano',
        c: 'La imagen no tiene ningún enfoque',
        d: 'La foto debe ser en blanco y negro',
      },
      explanation:
        'Una PdC corta aísla el sujeto; una PdC larga mantiene más nitidez en la escena.',
    },
    'lex-09': {
      text: 'Una imagen fija sobreexpuesta es en general…',
      answers: {
        a: 'Demasiado clara; las altas luces pueden «quemarse» en blanco puro',
        b: 'Globalmente demasiado oscura',
        c: 'Siempre más nítida que una exposición correcta',
        d: 'Imposible en cámaras digitales',
      },
      explanation:
        'Sobreexposición = demasiada luz registrada; subexposición = demasiado poca.',
    },
    'lex-10': {
      text: 'La práctica de la «imagen fija» en artes plásticas incluye típicamente…',
      answers: {
        a: 'La fotografía y otras imágenes no animadas (vs imagen animada)',
        b: 'Solo el espectáculo en vivo',
        c: 'Solo los videojuegos 3D',
        d: 'Solo los podcasts de audio',
      },
      explanation:
        'El vocabulario curricular contrapone imagen fija (foto, etc.) e imagen animada (vídeo, animación).',
    },
    'lex-11': {
      text: '¿Qué elecciones pertenecen al trabajo de encuadre / punto de vista?',
      answers: {
        a: 'Dónde te colocas y a qué altura está la cámara',
        b: 'Qué incluyes o excluyes en los bordes',
        c: 'La contraseña Wi‑Fi del centro',
        d: 'Si el horizonte está recto o inclinado a propósito',
      },
      explanation:
        'Posición, recorte y ángulo del horizonte son decisiones de encuadre / punto de vista — no ajustes de red.',
    },
    'lex-12': {
      text: '¿Por qué evitar evaluar una obra del «programme limitatif» con una reproducción?',
      answers: {
        a: 'Riesgo de derechos + mantenimiento si cambia la lista oficial — preferir enlaces éduscol externos',
        b: 'Porque no se puede hablar de fotografía en clase',
        c: 'Porque el alumnado de bachillerato no puede usar un navegador',
        d: 'Porque las preguntas de vocabulario son ilegales',
      },
      explanation:
        'Quiz PixFan conserva un léxico original y remite a las listas oficiales en externo — nunca incrusta imágenes del corpus limitativo.',
    },
  },
};

function setEs(ls, value) {
  if (!ls || typeof ls !== 'object') throw new Error('bad LS');
  if (typeof value !== 'string' || !value.trim()) throw new Error('empty es');
  ls.es = value;
}

setEs(pack.title, es.title);
setEs(pack.description, es.description);

let count = 2;
for (const q of pack.questions) {
  const t = es.questions[q.id];
  if (!t) throw new Error(`missing translation for ${q.id}`);
  setEs(q.text, t.text);
  setEs(q.explanation, t.explanation);
  count += 2;
  for (const a of q.answers) {
    const av = t.answers[a.id];
    if (!av) throw new Error(`missing answer ${q.id}.${a.id}`);
    setEs(a.text, av);
    count += 1;
  }
}

if (count !== 74) throw new Error(`expected 74 LS, got ${count}`);

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`OK: wrote ${count} LocalizedString.es on lexique-image-fixe`);

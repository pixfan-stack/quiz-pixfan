#!/usr/bin/env node
/**
 * Vague 1.46 — add LocalizedString.es for pack light-color (182 LS).
 * Idempotent: skips fields that already have non-empty es.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'light-color');
if (!pack) throw new Error('light-color not found');

const unsplashCredit = 'Unsplash — uso libre (licencia Unsplash)';
const unsplashPhoto = 'Foto: Unsplash';

const es = {
  title: 'Luz y color',
  description:
    'Calidad de la luz, balance de blancos, hora dorada y el ambiente de tus imágenes.',
  questions: {
    'light-1': {
      text: '¿Qué es la « hora dorada » (golden hour)?',
      answers: {
        a: 'La hora justo después del amanecer o antes del atardecer, con luz suave y cálida',
        c: 'Cualquier momento en que uses un reflector dorado',
        b: 'El mediodía, cuando el sol está más alto',
        d: 'La primera hora después de comprar una cámara',
      },
      explanation:
        'Cerca del amanecer y del atardecer el sol está bajo: la luz es más cálida, suave y direccional — favorecedora para retratos y paisajes.',
      imageAlt: 'Luz de hora dorada sobre el horizonte de una ciudad',
      imageCredit: unsplashCredit,
    },
    'light-2': {
      text: 'La luz dura (p. ej. sol del mediodía, flash directo) suele crear…',
      answers: {
        d: 'Conversión automática a blanco y negro',
        b: 'Casi ninguna sombra',
        c: 'Solo colores pastel',
        a: 'Sombras nítidas y bien definidas, y alto contraste',
      },
      explanation:
        'Una fuente pequeña o lejana respecto al sujeto produce luz dura. La luz suave (cielo nublado, softbox) envuelve y suaviza las sombras.',
      imageAlt: 'Luz solar a través de los árboles',
      imageCredit: unsplashCredit,
    },
    'light-3': {
      text: '¿En qué situaciones de iluminación suele hacer falta ajustar el balance de blancos?',
      answers: {
        c: 'Luz mixta (día + artificial)',
        b: 'Sombra abierta bajo un cielo azul',
        d: 'Solo cuando la tapa del objetivo está puesta',
        a: 'Tungsteno / bombillas cálidas de interior',
      },
      explanation:
        'Cada fuente de luz tiene una temperatura de color distinta. Un balance correcto mantiene los neutros neutros y los tonos de piel naturales.',
      imageAlt: 'Cielo nocturno con estrellas',
      imageCredit: unsplashCredit,
    },
    'light-4': {
      text: '« Contraluz » significa que la luz principal está…',
      answers: {
        b: 'Solo desde debajo de la cámara',
        a: 'Detrás del sujeto, hacia la cámara',
        c: 'Completamente apagada',
        d: 'Siempre desde la misma dirección que el objetivo',
      },
      explanation:
        'El contraluz puede crear siluetas, luz de contorno (bordes luminosos) o una bruma soñadora — potente para el ambiente y la separación del fondo.',
      imageAlt: 'Luz de mañana brumosa',
      imageCredit: unsplashCredit,
    },
    'light-5': {
      text: 'La temperatura de color se mide en…',
      answers: {
        b: 'Megapíxeles (MP)',
        d: 'Decibelios (dB)',
        a: 'grados Kelvin (K)',
        c: 'Solo en pasos de diafragma (f-stops)',
      },
      explanation:
        'La temperatura de color usa la escala Kelvin (p. ej. ~5600 K luz de día, ~3200 K tungsteno). Cámaras y editores usan estos valores para el balance de blancos.',
      imageAlt: 'Luz cálida de atardecer sobre el agua',
      imageCredit: unsplashCredit,
    },
    'light-6': {
      text: '¿Qué es la « luz difusa »?',
      answers: {
        c: 'Luz que cambia de color constantemente',
        b: 'Luz que solo llega desde arriba',
        d: 'Luz producida solo por LEDs',
        a: 'Luz dispersada en muchas direcciones, que crea sombras suaves',
      },
      explanation:
        'La luz difusa proviene de una fuente grande o está dispersada (nubes, softboxes), minimizando sombras duras y reduciendo el contraste.',
      imageAlt: 'Luz suave de cielo nublado en un paisaje brumoso',
      imageCredit: unsplashCredit,
    },
    'light-7': {
      text: '¿Qué es la « aberración cromática »?',
      answers: {
        b: 'Cuando los colores cambian con el tiempo en la impresión',
        a: 'Franjas de color alrededor de bordes de alto contraste por limitaciones del objetivo',
        c: 'Un ajuste de cámara para colores vivos',
        d: 'La capacidad de ver luz infrarroja',
      },
      explanation:
        'Las distintas longitudes de onda enfocan en puntos diferentes, provocando franjas púrpura/verde. Objetivos de calidad y el postproceso pueden reducirlas.',
    },
    'light-8': {
      text: '¿Qué herramientas ayudan a controlar la dirección de la luz?',
      answers: {
        b: 'Banderas (flags) y ventanas (barn doors)',
        a: 'Reflectores',
        c: 'Difusores y softboxes',
        d: 'Tarjetas de memoria',
      },
      explanation:
        'Los reflectores rebotan la luz, las banderas la bloquean, los difusores/softboxes la dispersan. Las tarjetas de memoria guardan datos, no controlan la luz.',
      imageAlt: 'Equipo de iluminación de estudio y cámara',
      imageCredit: unsplashCredit,
    },
    'light-9': {
      text: '¿Qué es el « color grading » en postproducción?',
      answers: {
        c: 'Cambiar la distancia focal del objetivo',
        d: 'Ajustar la velocidad de obturación',
        b: 'Aumentar los megapíxeles de la cámara',
        a: 'Ajustar los colores de forma creativa para fijar ambiente y estilo',
      },
      explanation:
        'El color grading da forma al tono visual y a la emoción de una imagen o película, más allá de una simple corrección de balance de blancos.',
      imageAlt: 'Portátil en un escritorio — territorio del color grading en post',
      imageCredit: unsplashCredit,
    },
    'light-10': {
      text: '¿Qué es el « flash freeze » en fotografía?',
      answers: {
        a: 'Usar una duración de flash muy corta para congelar el movimiento aunque el obturador sea más lento',
        b: 'Congelar objetos con hielo',
        c: 'Hacer fotos a temperaturas bajo cero',
        d: 'Un tipo de técnica de obturador lento',
      },
      explanation:
        'La duración del flash puede ser de 1/1000 s o más rápida, congelando el movimiento con independencia del obturador de la cámara.',
    },
    'light-11': {
      text: '¿En qué escenarios ayuda usar un reflector?',
      answers: {
        c: 'Rebotar luz para una iluminación más suave',
        a: 'Rellenar sombras en el rostro de un sujeto al aire libre',
        b: 'Añadir brillos (catchlights) en los ojos en retratos',
        d: 'Subir el ISO de la cámara',
      },
      explanation:
        'Los reflectores redirigen la luz existente para rellenar sombras, añadir brillo en los ojos o suavizar una iluminación dura sin equipo extra.',
      imageAlt: 'Retrato al aire libre con luz diurna direccional',
      imageCredit: unsplashCredit,
    },
    'light-12': {
      text: '¿Con qué se asocia a menudo un « dominante magenta/verde »?',
      answers: {
        a: 'Balance de blancos incorrecto bajo fluorescentes',
        c: 'Película en blanco y negro',
        b: 'Luz solar en la hora dorada',
        d: 'Sobrecalentamiento del sensor digital',
      },
      explanation:
        'Los fluorescentes suelen tener espectros irregulares que provocan dominantes verdes o magenta. Un balance personalizado o presets lo corrigen.',
    },
    'light-13': {
      text: '¿Qué es el « light painting »?',
      answers: {
        b: 'Pintar paredes con luces de colores',
        c: 'Usar pintura para cubrir los objetivos',
        a: 'Crear imágenes moviendo fuentes de luz durante exposiciones largas',
        d: 'Un efecto de filtro digital',
      },
      explanation:
        'El light painting usa exposiciones largas en la oscuridad para « dibujar » con linternas, LEDs o fuego.',
    },
    'light-14': {
      text: '¿Cuáles son las características de la fotografía en la « hora azul »?',
      answers: {
        c: 'Las luces artificiales destacan sobre el fondo azul',
        d: 'Requiere sol del mediodía',
        a: 'Tonos azul profundos en el cielo',
        b: 'Ocurre justo antes del amanecer o después del atardecer',
      },
      explanation:
        'La hora azul ofrece una calidad mágica y serena, con tonos fríos y el contraste entre el azul natural y las luces artificiales cálidas.',
      imageAlt: 'Cielo azul crepuscular sobre montañas',
      imageCredit: unsplashCredit,
    },
    'light-15': {
      text: '¿Qué es el « HDR » en fotografía?',
      answers: {
        b: 'High Definition Resolution: un tipo de sensor',
        a: 'High Dynamic Range: combinar varias exposiciones para detalle en sombras y altas luces',
        c: 'Horizontal Directional Reflection: una propiedad del objetivo',
        d: 'Hybrid Digital Recording: un formato de vídeo',
      },
      explanation:
        'El HDR fusiona exposiciones en bracketing para conservar detalle en rangos de luz extremos que una sola toma no cubre.',
    },
    'light-16': {
      text: '¿Qué produce típicamente una temperatura de color por debajo de 3200 K?',
      answers: {
        d: 'Solo blanco y negro',
        b: 'Tonos azul fríos',
        c: 'Luz blanca pura',
        a: 'Tonos cálidos naranja-rojo (como la luz de vela)',
      },
      explanation:
        'Valores Kelvin bajos (<3200 K) son cálidos/naranja (vela, tungsteno); valores altos (>5600 K) son fríos/azul (sombra, nublado).',
    },
    'light-17': {
      text: '¿Qué factores influyen en el ambiente creado por la luz?',
      answers: {
        b: 'La temperatura de color',
        a: 'La dirección de la luz',
        d: 'La marca de la cámara',
        c: 'La dureza o suavidad',
      },
      explanation:
        'Dirección, temperatura y calidad de la luz afectan mucho el impacto emocional. La marca de la cámara no influye directamente en el ambiente.',
    },
    'light-18': {
      text: '¿Qué es la « iluminación Rembrandt » en el retrato?',
      answers: {
        b: 'Iluminación uniforme frontal',
        c: 'Luz que solo llega desde abajo',
        a: 'Un patrón que crea un pequeño triángulo de luz en la mejilla en sombra',
        d: 'Ninguna sombra en el rostro',
      },
      explanation:
        'Inspirada en los cuadros de Rembrandt, esta iluminación clásica de retrato crea un efecto dramático y dimensional con un triángulo de luz característico.',
      imageAlt: 'Silueta de retrato con luz lateral dramática',
      imageCredit: unsplashCredit,
    },
    'light-19': {
      text: '¿Qué es la « caída de la luz » (light falloff)?',
      answers: {
        d: 'Una función de cámara para poca luz',
        c: 'La cantidad de luz que entra por el objetivo',
        b: 'Cuando la luz cambia de color con el tiempo',
        a: 'La disminución de la intensidad de la luz al aumentar la distancia a la fuente',
      },
      explanation:
        'La luz sigue la ley del inverso del cuadrado: duplicar la distancia reduce la intensidad a 1/4. Entender la caída es clave para diseñar la iluminación.',
    },
    'light-20': {
      text: '¿Qué técnicas ayudan a gestionar escenas de alto contraste?',
      answers: {
        a: 'Usar flash de relleno o reflectores',
        d: 'Subir el ISO de forma drástica',
        b: 'Fusión HDR',
        c: 'Filtros de densidad neutra graduados',
      },
      explanation:
        'Estas técnicas equilibran diferencias extremas de luz. Subir el ISO añade ruido sin resolver el contraste.',
      imageAlt: 'Amanecer de alto contraste a través de los árboles',
      imageCredit: unsplashCredit,
    },
    'light-21': {
      text: 'Sol duro del mediodía, retrato al aire libre. ¿Mejor primer rescate?',
      answers: {
        a: 'Disparar en sombra abierta o rebotar/rellenar el rostro',
        c: 'Poner un gel rojo en la cámara « para cine »',
        b: 'Subexponer 3 pasos y levantar solo las sombras después',
        d: 'Subir el ISO a 12800 a pleno sol',
      },
      explanation:
        'La sombra abierta o la luz de relleno suavizan las « ojos de mapache ». Luchar contra el sol duro solo con el ISO no arregla el contraste.',
      imageAlt: 'Retrato a la luz del día',
      imageCredit: unsplashCredit,
    },
    'light-22': {
      text: 'Tungsteno de interior + luz de día por la ventana en el mismo encuadre. ¿Qué suele verse « mal »?',
      answers: {
        c: 'El ISO se bloquea en 50 para siempre',
        b: 'El objetivo se convierte automáticamente en ojo de pez',
        d: 'El enfoque solo funciona en infinito',
        a: 'Balances de blancos mezclados / dominantes de color en conflicto',
      },
      explanation:
        'Dos temperaturas de color en una toma crean luchas naranja/azul. Elige una luz protagonista o gelifica/corrige una de las fuentes.',
      imageAlt:
        'Luz cálida de café interior mezclada con ambiente más frío — reto de WB mixto',
      imageCredit: unsplashCredit,
    },
    'light-23': {
      text: '« La hora dorada es la única buena luz. » ¿Cuál es la lectura más justa?',
      answers: {
        c: 'Cierto solo para smartphones',
        d: 'Cierto solo en blanco y negro',
        a: 'Cierto — evita cualquier otra hora del día',
        b: 'Falso: la hora azul, el nublado y la luz artificial controlada pueden ser fantásticos',
      },
      explanation:
        'La hora dorada es preciosa, no exclusiva. El nublado suave es un regalo para el retrato; el neón nocturno también puede brillar.',
    },
    'light-24': {
      text: 'Contraluz de hora dorada entre árboles: rostros subexpuestos, hojas brillan. ¿Mejor estrategia de medición?',
      answers: {
        c: 'Poner WB tungsteno para arreglar la exposición',
        b: 'Exponer siempre solo por la hoja más brillante',
        a: 'Medir / exponer por los rostros (spot o compensación), aceptar follaje más claro o añadir relleno',
        d: 'Bloquear EV −3 « de ambiente » en cada rostro',
      },
      explanation:
        'Decide qué debe conservar detalle. Los rostros suelen ganar; el brillo puede ser un contorno, no el objetivo del fotómetro.',
      imageAlt: 'Luz solar filtrándose por el dosel del bosque',
      imageCredit: unsplashPhoto,
    },
    'light-25': {
      text: 'Luz mixta (sodio de calle + LED de tienda). ¿Qué tácticas mantienen la piel creíble?',
      answers: {
        a: 'Elegir una fuente dominante y hacer el balance de blancos para ella',
        b: 'Gelificar el flash para igualar el ambiente al añadir luz',
        c: 'Corregir en local en raw las dominantes secundarias',
        d: 'Auto WB + un grade teal/naranja fuerte como único plan',
      },
      explanation:
        'Elige un punto blanco protagonista, iguala la luz añadida y luego corrige en local. Un grade fantasioso global rara vez arregla dominantes mixtas.',
    },
  },
};

function setEs(ls, value) {
  if (!ls || typeof ls !== 'object') return 0;
  if (ls.es && String(ls.es).trim()) return 0;
  if (!value || !String(value).trim()) {
    throw new Error(`Missing es for: ${JSON.stringify(ls)}`);
  }
  ls.es = value;
  return 1;
}

let added = 0;
added += setEs(pack.title, es.title);
added += setEs(pack.description, es.description);

for (const q of pack.questions) {
  const t = es.questions[q.id];
  if (!t) throw new Error(`No translation for ${q.id}`);
  added += setEs(q.text, t.text);
  if (q.explanation) added += setEs(q.explanation, t.explanation);
  if (q.imageAlt) added += setEs(q.imageAlt, t.imageAlt);
  if (q.imageCredit) added += setEs(q.imageCredit, t.imageCredit);
  for (const a of q.answers) {
    const av = t.answers[a.id];
    if (!av) throw new Error(`No answer es for ${q.id}/${a.id}`);
    added += setEs(a.text, av);
  }
}

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`light-color: added ${added} LocalizedString.es fields`);

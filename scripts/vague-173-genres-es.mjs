#!/usr/bin/env node
/**
 * Vague 1.73 — add LocalizedString.es for pack genres (226 LS).
 * Idempotent: skips fields that already have non-empty es.
 * Vocab aligns with guides/genres-photo article.es (retrato / calle / paisaje / macro).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'genres');
if (!pack) throw new Error('genres not found');

const unsplash = 'Unsplash — uso libre (licencia Unsplash)';

const es = {
  title: 'Géneros fotográficos',
  description:
    'Retrato, street, paisaje, macro… reconoce el oficio detrás de cada estilo.',
  questions: {
    'gen-1': {
      text: 'La fotografía de calle se caracteriza sobre todo por…',
      answers: {
        d: 'Fotos tomadas exclusivamente de noche con flash',
        a: 'Escenas candidas de la vida pública, a menudo sin pose',
        b: 'Solo fondos de estudio con skyline de ciudad',
        c: 'Uso obligatorio de drones',
      },
      explanation:
        'La foto de calle captura momentos públicos no ensayados — gesto, ironía, geometría — normalmente con luz disponible y equipo discreto.',
      imageAlt: 'Sesión de fotografía de retrato',
      imageCredit: unsplash,
    },
    'gen-2': {
      text: '¿Qué prácticas son habituales en la fotografía de retrato?',
      answers: {
        a: 'Controlar la luz en el rostro (principal / relleno / contraluz)',
        c: 'Usar siempre la apertura más pequeña posible sin intención',
        b: 'Cuidar expresión, pose y vínculo con el sujeto',
        d: 'Elegir fondo y profundidad de campo para aislar a la persona',
      },
      explanation:
        'Un buen retrato equilibra luz, expresión y separación del fondo. La apertura es una elección creativa, no una regla fija.',
      imageAlt: 'Escena de fotografía de calle',
      imageCredit: unsplash,
    },
    'gen-3': {
      text: 'La fotografía macro se centra principalmente en…',
      answers: {
        c: 'Cadencias de vídeo por encima de 1000 fps',
        b: 'Fotografiar solo ciudades enteras desde el espacio',
        d: 'Disparar solo con un objetivo de 600 mm a distancia',
        a: 'Primeros planos extremos de sujetos pequeños a gran aumento',
      },
      explanation:
        'La macro verdadera suele alcanzar ~1:1 (sujeto a tamaño real en el sensor): insectos, texturas, detalles. El focus stacking es frecuente.',
      imageAlt: 'Luz del sol entre los árboles',
      imageCredit: unsplash,
    },
    'gen-4': {
      text: 'En fotografía de paisaje, una razón habitual para usar trípode es…',
      answers: {
        a: 'Mantener la cámara estable en exposiciones largas o un encuadre preciso',
        b: 'Aumentar los megapíxeles del sensor',
        d: 'Sustituir la necesidad de un objetivo',
        c: 'Cambiar automáticamente el color del cielo',
      },
      explanation:
        'El trípode permite exposiciones largas nítidas (agua, poca luz, filtros ND) y técnicas multi-toma cuidadosas (brackets, panorámicas).',
      imageAlt: 'Paisaje desértico',
      imageCredit: unsplash,
    },
    'gen-5': {
      text: '¿Qué retos son típicos de la fotografía de fauna?',
      answers: {
        c: 'Respetar la fauna y los hábitats (ética / distancia)',
        a: 'Focales largas y distancia al sujeto',
        d: 'Softboxes de estudio obligatorias en cada animal',
        b: 'Velocidades rápidas para el movimiento animal',
      },
      explanation:
        'La fauna combina alcance tele, timing, paciencia y ética. Los softboxes de estudio no son el estándar de campo.',
      imageAlt: 'Sujeto de fauna en hábitat natural',
      imageCredit: unsplash,
    },
    'gen-6': {
      text: '¿Qué define la «fotografía de arte» (fine art)?',
      answers: {
        c: 'Fotos hechas con equipo caro',
        b: 'Solo fotos en blanco y negro',
        d: 'Imágenes publicitarias comerciales',
        a: 'Fotografía creada para expresar la visión o el concepto del artista',
      },
      explanation:
        'La fotografía de arte prioriza la expresión creativa frente a la documentación, a menudo expuesta en galerías y museos.',
    },
    'gen-7': {
      text: '¿Cuáles son los retos clave de la fotografía deportiva?',
      answers: {
        d: 'Usar solo luz natural',
        b: 'Anticipar los momentos cumbre',
        a: 'Velocidades rápidas para congelar la acción',
        c: 'Trabajar con iluminación variable (interior/exterior)',
      },
      explanation:
        'La foto deportiva exige destreza técnica, anticipación y adaptación a condiciones cambiantes.',
      imageAlt:
        'Atleta en movimiento — timing y obturador en fotografía deportiva',
      imageCredit: unsplash,
    },
    'gen-8': {
      text: '¿Qué es el «food styling» en la fotografía gastronómica?',
      answers: {
        b: 'Cocinar la comida antes de fotografiar',
        d: 'Crear recetas',
        a: 'Disponer y realzar el aspecto de la comida para la cámara',
        c: 'Criticar restaurantes',
      },
      explanation:
        'Los food stylists usan técnicas como glicerina para el vapor, palillos para la estructura e iluminación para que la comida resulte apetitosa.',
      imageAlt: 'Plato estilizado listo para un set de foto gastronómica',
      imageCredit: unsplash,
    },
    'gen-9': {
      text: '¿Qué hace distinta a la «fotografía documental» de otros géneros?',
      answers: {
        b: 'Siempre usa blanco y negro',
        a: 'Busca registrar con verdad acontecimientos y realidades sociales',
        c: 'Es exclusivamente de estudio',
        d: 'Se centra solo en paisajes',
      },
      explanation:
        'La fotografía documental actúa como periodismo visual, contando historias reales con responsabilidad ética hacia los sujetos.',
    },
    'gen-10': {
      text: '¿Qué equipo se usa habitualmente en astrofotografía?',
      answers: {
        b: 'Seguidor estelar (star tracker)',
        c: 'Objetivos gran angular o astro',
        a: 'Trípode',
        d: 'Objetivo macro',
      },
      explanation:
        'La astrofotografía necesita estabilidad (trípode), seguimiento para exposiciones largas y gran angulares luminosos. La macro es para primeros planos.',
      imageAlt: 'Cielo estrellado para astrofotografía',
      imageCredit: unsplash,
    },
    'gen-11': {
      text: '¿En qué se centra principalmente la «fotografía de moda»?',
      answers: {
        a: 'Mostrar ropa, accesorios y estilo',
        d: 'Registrar desfiles',
        b: 'Documentar la historia de la moda',
        c: 'Fotografiar solo texturas de tela',
      },
      explanation:
        'La foto de moda vende estilo de vida y aspiración, combinando la presentación de la ropa con una visión artística.',
      imageAlt: 'Pose de moda estilizada — foco de fotografía editorial de moda',
      imageCredit: unsplash,
    },
    'gen-12': {
      text: '¿Cuáles son las características de la «fotografía arquitectónica»?',
      answers: {
        c: 'Se centra en la simetría y la geometría',
        a: 'Énfasis en líneas, formas y volúmenes',
        d: 'Siempre se toma de noche',
        b: 'A menudo usa tilt-shift para controlar la perspectiva',
      },
      explanation:
        'La fotografía arquitectónica celebra el diseño mediante composición cuidadosa, corrección de perspectiva e iluminación.',
      imageAlt: 'Líneas del entorno construido — geometría de foto arquitectónica',
      imageCredit: unsplash,
    },
    'gen-13': {
      text: '¿Qué es la «fotografía conceptual»?',
      answers: {
        b: 'Fotos hechas con objetivos conceptuales',
        c: 'Movimientos abstractos de cámara',
        a: 'Fotografía que comunica una idea o mensaje por encima del atractivo estético',
        d: 'Fotografía sin cámara',
      },
      explanation:
        'La fotografía conceptual prioriza las ideas, a menudo con escenas escenificadas, simbolismo o manipulación para transmitir mensajes.',
    },
    'gen-14': {
      text: '¿De qué trata el debate ético de la «fotografía de calle»?',
      answers: {
        b: 'Preferencias de marca de cámara',
        d: 'Técnicas de revelado',
        c: 'Elección de objetivo',
        a: 'Derechos de privacidad vs. libertad de expresión en espacios públicos',
      },
      explanation:
        'Los fotógrafos equilibran documentar la vida pública con respetar la privacidad y la dignidad de las personas.',
    },
    'gen-15': {
      text: '¿Qué define la «fotografía aeronáutica»?',
      answers: {
        c: 'A menudo necesita teleobjetivos',
        b: 'Requiere velocidades rápidas',
        a: 'Fotografiar aeronaves en vuelo o en tierra',
        d: 'Solo se toma desde aviones',
      },
      explanation:
        'La foto aeronáutica captura aviones y exige velocidad, alcance y a menudo ubicaciones especializadas como aeródromos.',
    },
    'gen-16': {
      text: '¿Cuál es el objetivo principal de la «fotografía de producto»?',
      answers: {
        c: 'Crear arte abstracto',
        b: 'Documentar procesos de fabricación',
        a: 'Mostrar productos de forma atractiva con fines comerciales',
        d: 'Fotografiar edificios de fábrica',
      },
      explanation:
        'La foto de producto impulsa las ventas presentando los artículos bajo su mejor luz, destacando rasgos y calidad.',
    },
    'gen-17': {
      text: '¿Cuál es el reto único de la «fotografía submarina»?',
      answers: {
        b: 'Los peces siempre se escapan',
        c: 'Las cámaras se hunden solas',
        a: 'El agua absorbe la luz y provoca pérdida de color con la profundidad',
        d: 'Las carcasas estancas distorsionan todas las imágenes',
      },
      explanation:
        'Las longitudes de onda rojas se absorben primero bajo el agua; hacen falta flashes o ajustes de balance de blancos para recuperar colores naturales.',
    },
    'gen-18': {
      text: '¿Qué habilidades importan en la fotografía de eventos?',
      answers: {
        d: 'Usar solo flash',
        c: 'Discreción y profesionalidad',
        a: 'Anticipar los momentos clave',
        b: 'Trabajar en condiciones de luz variadas',
      },
      explanation:
        'Los fotógrafos de eventos deben ser adaptables, discretos y hábiles capturando momentos espontáneos.',
    },
    'gen-19': {
      text: '¿Qué está revolucionando la «fotografía con drone»?',
      answers: {
        d: 'El retrato de estudio',
        a: 'Perspectivas aéreas que antes exigían helicópteros',
        c: 'La fotografía macro',
        b: 'La fotografía submarina',
      },
      explanation:
        'Los drones democratizaron la foto aérea, permitiendo perspectivas únicas para inmobiliaria, paisaje y cobertura de eventos.',
      imageAlt:
        'Mirador elevado de paisaje — punto de vista drone / foto aérea',
      imageCredit: unsplash,
    },
    'gen-20': {
      text: '¿Qué distingue la «fotografía nocturna» del trabajo diurno?',
      answers: {
        c: 'A menudo hace falta un ISO más alto',
        d: 'Solo funciona en ciudades',
        b: 'Trata con fuentes de luz artificial',
        a: 'Requiere exposiciones más largas y trípodes',
      },
      explanation:
        'La foto nocturna exige técnicas distintas: estabilidad, gestión de la luz y control del ruido.',
      imageAlt: 'Skyline nocturno de ciudad — compromisos de la foto nocturna',
      imageCredit: unsplash,
    },
    'gen-21': {
      text: 'La foto de calle en su mejor momento suele sentirse como…',
      answers: {
        c: 'Fotografiar solo tu propio reflejo para siempre',
        d: 'Macro de insectos exclusivamente',
        a: 'Un set de moda escenificado con tres asistentes',
        b: 'Capturar una geometría o gesto fugaz de la vida real en público',
      },
      explanation:
        'La street vive del timing y de la vida pública — no de un equipo completo de estudio.',
      imageAlt: 'Escena urbana de calle',
      imageCredit: unsplash,
    },
    'gen-22': {
      text: 'Foto de ciudad de noche sin trípode: ¿cuál es el compromiso honesto?',
      answers: {
        c: 'Debes pasar a un ojo de pez',
        d: 'Solo se permite blanco y negro después de las 22 h',
        b: 'ISO más alto y/o apertura más abierta frente a más ruido o menos profundidad de campo',
        a: 'No hay compromiso; de noche es fácil a pulso a ISO 100',
      },
      explanation:
        'Sin trípode compras velocidad de obturación con ISO y apertura — y pagas en ruido o PDC.',
      imageAlt: 'Skyline nocturno de ciudad',
      imageCredit: unsplash,
    },
    'gen-23': {
      text: '¿Qué hábitos ayudan en el retrato candido / lifestyle?',
      answers: {
        a: 'Hablar menos, observar microgestos reales',
        d: 'Usar la luz de ventana disponible antes de disparar flash a tope',
        b: 'Mantener fondos simples cuando puedas',
        c: 'Forzar una risa fingida durante 40 fotogramas seguidos',
      },
      explanation:
        'Los momentos reales ganan a las maratones de sonrisas dirigidas — la luz y el fondo hacen la mitad del trabajo.',
    },
    'gen-24': {
      text: 'El cliente quiere cobertura de boda «documental». ¿Qué implica?',
      answers: {
        a: 'Solo iluminación de estudio posada todo el día',
        b: 'Observar y anticipar momentos con puesta en escena mínima',
        c: 'Solo planos cenitales con drone del lugar',
        d: 'Solo película en blanco y negro para siempre',
      },
      explanation:
        'Lo documental prioriza los momentos reales frente a una dirección intensa.',
      imageAlt: 'Momento candido de boda',
      imageCredit: unsplash,
    },
    'gen-25': {
      text: 'Mito: «La street debe ser conflictiva.» ¿Mejor encuadre?',
      answers: {
        a: 'Cierto — siempre hay que parar a desconocidos con agresividad',
        b: 'La street puede ser observación tranquila de la vida pública, con ética y ley local en mente',
        c: 'La street solo existe con ojos de pez',
        d: 'Street significa fotografiar solo señales',
      },
      explanation:
        'Los enfoques varían; el respeto y la legalidad importan más que la agresividad.',
      imageAlt: 'Escena urbana de calle',
      imageCredit: unsplash,
    },
    'gen-26': {
      text: 'Fauna: animal a medio ocultar en la maleza. ¿Prioridad para un fotograma usable?',
      answers: {
        a: 'Quemar las luces del cielo de fondo',
        b: 'Contacto visual / catchlight claro y obturador suficiente para congelar el micromovimiento',
        c: 'Recortar siempre el hábitat',
        d: 'Usar flash en polluelos de noche sin cuidado',
      },
      explanation:
        'Ojos legibles y momentos nítidos ganan a un encuadre ajetreado pero blando.',
    },
    'gen-27': {
      text: 'Packshot sobre blanco: los bordes parecen grises. ¿Causa probable?',
      answers: {
        a: 'Demasiada luz de separación en el fondo',
        b: 'Fondo subexpuesto respecto al producto — sube las luces del fondo',
        c: 'Usar RAW en vez de JPEG',
        d: 'Objetivo demasiado nítido',
      },
      explanation:
        'Un blanco continuo verdadero necesita el fondo más brillante que los bordes del sujeto.',
    },
    'gen-28': {
      text: 'Interior de arquitectura: las verticales se inclinan. ¿Corrección más rápida en cámara?',
      answers: {
        a: 'Inclinar la cámara con más agresividad',
        b: 'Mantener el sensor paralelo a las paredes / usar un objetivo shift o nivelar con cuidado',
        c: 'Disparar siempre desde el suelo mirando hacia arriba',
        d: 'Usar el ajuste JPEG más pequeño',
      },
      explanation:
        'Los planos paralelos evitan el keystoning; los objetivos shift ayudan cuando no puedes retroceder.',
      imageAlt:
        'Verticales altas de ciudad de noche — control de inclinación arquitectura int/ext',
      imageCredit: unsplash,
    },
    'gen-29': {
      text: 'Street documental en Francia: quieres un gesto candido sin puesta en escena. ¿Mejor enfoque ético + técnico?',
      answers: {
        b: 'Siempre confrontar y posar a desconocidos por la «verdad»',
        a: 'Anticipar, mimetizarse, respetar la dignidad; saber cuándo no publicar momentos privados identificables',
        d: 'Disparar solo desde un tejado con un 600 mm — nunca entrar en la escena',
        c: 'Publicar cada cara sin importar el contexto',
      },
      explanation:
        'El oficio de street es anticipación y presencia; la ética es dignidad y contexto — sobre todo al publicar.',
      imageAlt: 'Calle urbana concurrida para fotografía candida',
      imageCredit: unsplash,
    },
    'gen-30': {
      text: 'Retrato a luz natural al aire libre a mediodía. Sol cenital duro. ¿Mejor corrección «de género»?',
      answers: {
        a: 'Sombra abierta / difusor / relleno; mantener catchlights sin ojos de mapache',
        c: 'Subexponer tres pasos y aplastar la piel',
        b: 'Forzar flash de cámara apuntando solo hacia arriba',
        d: 'Esperar siempre la hora azul — el mediodía es inutilizable para siempre',
      },
      explanation:
        'El género retrato prioriza una luz de rostro favorecedora. Suaviza o rellena el sol de mediodía; no te limites a sufrirlo.',
      imageAlt: 'Retrato suave a luz natural',
      imageCredit: unsplash,
    },
    'gen-31': {
      text: '¿Qué indicios ayudan a distinguir moda editorial de retrato documental?',
      answers: {
        a: 'Estilismo, dirección artística y localizaciones controladas en moda',
        b: 'Iluminación observacional y gestos menos escenificados en documental',
        c: 'Ambos géneros usan siempre los mismos sets de flash',
        d: 'Intención: vender un look vs. describir una vida/situación',
      },
      explanation:
        'Los géneros tratan de intención y nivel de control, no solo de cámaras.',
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
console.log(`genres: added ${added} LocalizedString.es fields`);

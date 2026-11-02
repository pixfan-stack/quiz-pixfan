#!/usr/bin/env node
/**
 * Vague 1.76 — add LocalizedString.es for pack gear-lenses (192 LS).
 * Idempotent: skips fields that already have non-empty es.
 * Vocab aligns with guides/materiel-photo article.es
 * (sensor · focal · full-frame / APS-C · primes · filtros · estabilización · crop).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'gear-lenses');
if (!pack) throw new Error('gear-lenses not found');

const unsplash = 'Unsplash — uso libre (licencia Unsplash)';

const es = {
  title: 'Material y objetivos',
  description:
    'Focales, formatos de sensor y herramientas que dan forma a tu look.',
  questions: {
    'gear-1': {
      text: 'En full-frame, un objetivo de 50 mm suele llamarse «normal» porque…',
      answers: {
        d: 'Solo sirve para macro de insectos',
        c: 'Solo puede disparar en blanco y negro',
        b: 'Siempre tiene la apertura más abierta posible',
        a: 'Aproxima un campo de visión natural, cercano a la visión humana',
      },
      explanation:
        'Alrededor de 40–58 mm en full-frame se considera «normal»: ni gran angular marcado ni teleobjetivo. En APS-C, un ~35 mm suele desempeñar un papel similar.',
      imageAlt: 'Objetivos fotográficos alineados sobre un escritorio',
      imageCredit: unsplash,
    },
    'gear-2': {
      text: '¿Qué objetivos son típicamente gran angular en full-frame?',
      answers: {
        b: '16 mm (gran angular)',
        a: '24 mm (gran angular)',
        d: '35 mm (angular estándar)',
        c: '200 mm (teleobjetivo)',
      },
      explanation:
        'El gran angular se sitúa más o menos por debajo de ~35–40 mm en full-frame. Un 200 mm es un teleobjetivo: comprime la perspectiva y estrecha el campo.',
      imageAlt: 'Cuerpo de cámara y objetivo',
      imageCredit: unsplash,
    },
    'gear-3': {
      text: '¿Cuál es la principal ventaja de un objetivo fijo (prime)?',
      answers: {
        a: 'Suele ser más luminoso (mayor apertura máxima), más ligero y ópticamente más simple',
        b: 'Puede hacer zoom de 10 mm a 600 mm',
        d: 'Solo funciona bajo el agua',
        c: 'Nunca necesita enfocar',
      },
      explanation:
        'Los primes cambian la flexibilidad del zoom por calidad óptica, tamaño/peso y grandes aperturas (p. ej. f/1.4–f/1.8): ideales con poca luz y para aislar al sujeto.',
      imageAlt: 'Primer plano de una cámara clásica',
      imageCredit: unsplash,
    },
    'gear-4': {
      text: 'Un sensor APS-C es más pequeño que el full-frame. Eso suele implicar…',
      answers: {
        c: 'Que el ISO deja de existir',
        a: 'Un factor de recorte (~1,5× o 1,6×): el campo de visión efectivo es más estrecho con la misma focal',
        d: 'Que las fotos son siempre cuadradas',
        b: 'Que la cámara no puede usar ningún objetivo',
      },
      explanation:
        'Un 50 mm en APS-C se comporta más o menos como un campo de 75–80 mm en full-frame. La profundidad de campo y el ruido también cambian.',
      imageAlt: 'Fotógrafo con cámara',
      imageCredit: unsplash,
    },
    'gear-5': {
      text: '¿Para qué ayuda un filtro polarizador circular (CPL)?',
      answers: {
        d: 'A cargar la batería de la cámara',
        a: 'A reducir reflejos en cristal/agua y a intensificar los cielos azules',
        b: 'Solo a añadir formas de bokeh artificial',
        c: 'A sustituir la necesidad de un objetivo',
      },
      explanation:
        'Los polarizadores cortan la luz polarizada: menos brillos en superficies no metálicas, cielos y follaje más ricos. El efecto depende del ángulo respecto al sol.',
      imageAlt: 'Cámara con rosca de filtro — terreno del polarizador circular',
      imageCredit: unsplash,
    },
    'gear-6': {
      text: '¿A qué equivale el tamaño de sensor «full-frame»?',
      answers: {
        a: 'Al fotograma de película 35 mm (36×24 mm)',
        b: 'A la película de formato medio',
        c: 'A la película de cámara instantánea',
        d: 'Al sensor de un smartphone',
      },
      explanation:
        'Full-frame se refiere a sensores que coinciden con las dimensiones de la película 35 mm (36×24 mm), el estándar tradicional de la fotografía profesional.',
    },
    'gear-7': {
      text: '¿Para qué ayuda principalmente la «estabilización de imagen»?',
      answers: {
        d: 'A cambiar la distancia focal',
        a: 'A reducir el desenfoque por temblor de la cámara a velocidades de obturación más lentas',
        c: 'A aumentar la resolución del sensor',
        b: 'A mejorar la velocidad del autofoco',
      },
      explanation:
        'IS/OSS/VR compensa pequeños movimientos de la cámara y permite imágenes más nítidas a velocidades 2–5 pasos más lentas de lo habitual.',
      imageAlt: 'Cámara a pulso al aire libre — estabilización frente a obturación',
      imageCredit: unsplash,
    },
    'gear-8': {
      text: '¿Qué tipos de objetivos encajan mejor con el retrato?',
      answers: {
        d: '14 mm (ultra gran angular)',
        c: '135 mm (tele corto)',
        a: '85 mm (retrato clásico)',
        b: '50 mm (normal luminoso)',
      },
      explanation:
        'Los teleobjetivos cortos (50–135 mm) comprimen los rasgos de forma favorecedora y dan distancia de trabajo. El ultra gran angular (14 mm) deforma las caras.',
      imageAlt: 'Sujeto en retrato — territorio de tele corto para retrato',
      imageCredit: unsplash,
    },
    'gear-9': {
      text: '¿Para qué se usa un objetivo «tilt-shift»?',
      answers: {
        b: 'Para hacer fotos bajo el agua',
        a: 'Para corregir la distorsión de perspectiva y controlar el plano de enfoque',
        c: 'Para acercar sujetos lejanos con zoom',
        d: 'Para seguir automáticamente sujetos en movimiento',
      },
      explanation:
        'Los tilt-shift permiten corregir la perspectiva (arquitectura) y controlar el foco de forma creativa (efecto miniatura) mediante movimientos del objetivo.',
    },
    'gear-10': {
      text: '¿Qué mide un «megapíxel»?',
      answers: {
        b: 'La luminosidad del objetivo',
        c: 'El peso de la cámara',
        a: 'La resolución de la imagen (un millón de píxeles)',
        d: 'La autonomía de la batería',
      },
      explanation:
        'Un megapíxel equivale a un millón de píxeles. Más megapíxeles implican más resolución e impresiones más grandes, pero no necesariamente mejor calidad de imagen.',
      imageAlt: 'Detalle de cuerpo de cámara que evoca los megapíxeles',
      imageCredit: unsplash,
    },
    'gear-11': {
      text: '¿Cuáles son las ventajas de las cámaras mirrorless frente a las réflex?',
      answers: {
        d: 'Siempre una autonomía de batería más larga',
        c: 'Una mejor experiencia de visor electrónico',
        b: 'Un autofoco más rápido con seguimiento ocular',
        a: 'En general más compactas y ligeras',
      },
      explanation:
        'Las mirrorless destacan por tamaño, innovación de AF y funciones del EVF. Las réflex suelen seguir liderando en autonomía.',
      imageAlt: 'Primer plano de cuerpo moderno — ergonomía mirrorless frente a réflex',
      imageCredit: unsplash,
    },
    'gear-12': {
      text: '¿Cómo se indica el modo «prioridad a la apertura» en la mayoría de cámaras?',
      answers: {
        c: 'P (programa)',
        b: 'M (manual)',
        d: 'S o Tv (prioridad obturador)',
        a: 'A (Nikon, Sony) o Av (Canon)',
      },
      explanation:
        'A/Av significa prioridad a la apertura. M es Manual, P es Programa, S/Tv es prioridad a la obturación.',
    },
    'gear-13': {
      text: '¿Contra qué protege el «sellado climático» de una cámara?',
      answers: {
        c: 'El robo de la cámara',
        a: 'La entrada de polvo y humedad',
        b: 'Solo el calor extremo',
        d: 'La corrupción digital',
      },
      explanation:
        'El sellado climático usa juntas y cierres para proteger frente a lluvia, polvo y salpicaduras en entornos difíciles.',
    },
    'gear-14': {
      text: 'Además de la apertura, ¿qué factores determinan la profundidad de campo?',
      answers: {
        d: 'La velocidad de la tarjeta de memoria',
        c: 'El tamaño del sensor',
        a: 'La distancia focal',
        b: 'La distancia al sujeto',
      },
      explanation:
        'La PdC la controlan la apertura, la focal, la distancia al sujeto y el tamaño del sensor. La velocidad de la tarjeta afecta al ráfaga, no a la óptica.',
    },
    'gear-15': {
      text: '¿Qué es un «objetivo fijo» (prime)?',
      answers: {
        d: 'Un objetivo para uso submarino',
        c: 'Un objetivo impermeable',
        a: 'Un objetivo de focal fija que no puede hacer zoom',
        b: 'Un objetivo con estabilización de imagen',
      },
      explanation:
        'Los primes tienen una sola focal (p. ej. 50 mm) y ofrecen mejor óptica, aperturas más abiertas y menor tamaño que los zooms.',
      imageAlt: 'Objetivo fijo con poca profundidad de campo',
      imageCredit: unsplash,
    },
    'gear-16': {
      text: '¿Qué es la «montura» de un objetivo?',
      answers: {
        b: 'El sistema de limpieza del objetivo',
        a: 'La interfaz de conexión entre el objetivo y el cuerpo de la cámara',
        c: 'Un tipo de filtro para el objetivo',
        d: 'El anclaje de la correa de la cámara',
      },
      explanation:
        'Las monturas (EF, F, E, L, etc.) definen la compatibilidad mecánica y electrónica entre objetivos y cuerpos.',
    },
    'gear-17': {
      text: '¿Cuáles son los beneficios de usar un trípode?',
      answers: {
        b: 'Permitir exposiciones largas',
        a: 'Eliminar el temblor de la cámara para imágenes nítidas',
        c: 'Garantizar un encuadre coherente en panorámicas',
        d: 'Aumentar la velocidad del autofoco',
      },
      explanation:
        'Los trípodes dan estabilidad para nitidez, exposiciones largas y composición precisa. No afectan al rendimiento del autofoco.',
      imageAlt: 'Vista de montaña — escena de paisaje ideal para trípode',
      imageCredit: unsplash,
    },
    'gear-18': {
      text: '¿Qué es el «factor de recorte» (crop factor)?',
      answers: {
        d: 'Una técnica de limpieza de objetivos',
        a: 'El multiplicador que convierte la focal full-frame en un campo equivalente en sensores más pequeños',
        b: 'La cantidad de imagen recortada en postproducción',
        c: 'La reducción de resolución de la cámara',
      },
      explanation:
        'Los sensores APS-C suelen tener un factor de ~1,5× (Nikon/Sony) o 1,6× (Canon), haciendo que un 50 mm se comporte como 75–80 mm.',
    },
    'gear-19': {
      text: '¿Qué es un «objetivo luminoso» (fast lens)?',
      answers: {
        b: 'Un objetivo que enfoca rápido',
        c: 'Un objetivo ligero',
        d: 'Un objetivo con motor de autofoco rápido',
        a: 'Un objetivo con una apertura máxima grande (p. ej. f/1.4, f/1.8)',
      },
      explanation:
        '«Luminoso» se refiere a aperturas grandes que dejan entrar más luz, permiten obturaciones más rápidas y mejoran el rendimiento con poca luz.',
      imageAlt: 'Cámara clásica — óptica luminosa / disparo con poca luz',
      imageCredit: unsplash,
    },
    'gear-20': {
      text: '¿Qué accesorios son esenciales para la fotografía de paisaje?',
      answers: {
        d: 'Objetivo macro',
        b: 'Filtro polarizador',
        a: 'Trípode',
        c: 'Filtros ND (densidad neutra)',
      },
      explanation:
        'El trípode permite exposiciones largas nítidas, el CPL mejora cielos/reflejos y los ND permiten obturaciones lentas de día. El macro es para primeros planos.',
    },
    'gear-21': {
      text: 'Quieres un retrato informal favorecedor con fondo cremoso. ¿Primer instinto óptico?',
      answers: {
        b: 'Tele corto / rango clásico de retrato (≈85 mm equiv. full-frame) con una apertura más abierta',
        a: 'Ultra gran angular 16 mm pegado a la nariz',
        d: 'Kit a f/22 desde la acera de enfrente',
        c: 'Ojo de pez para maximizar la deformación de las mejillas',
      },
      explanation:
        'Una ligera compresión tele + apertura abierta separa al sujeto sin caras de dibujo animado.',
      imageAlt: 'Luces de estudio y cámara — setup de retrato favorecedor',
      imageCredit: unsplash,
    },
    'gear-22': {
      text: 'Mito: «Un objetivo de 50 mm ve exactamente como el ojo humano.»',
      answers: {
        a: 'Literalmente cierto en todos los formatos de cámara',
        d: 'Cierto solo de noche',
        b: 'Un eslogan útil, no física: el campo depende del tamaño del sensor y del contexto de visionado',
        c: 'Cierto solo bajo el agua',
      },
      explanation:
        'El 50 mm en full-frame resulta «natural» para muchos, pero el ojo no recorta un rectángulo fijo como una cámara.',
    },
    'gear-23': {
      text: 'Equipaje ligero para paisajes de viaje. ¿Qué resulta realmente útil?',
      answers: {
        b: 'Un paño para limpiar el elemento frontal',
        c: 'Doce disparadores de flash sin usar «por si acaso»',
        d: 'Un polarizador o ND si persigues cielos / exposiciones largas',
        a: 'Una forma estable de apoyar la cámara (trípode / mini / beanbag)',
      },
      explanation:
        'Estabilidad, limpieza y un filtro ganan a una maleta de gadgets «algún día quizá».',
      imageAlt: 'Paisaje de montaña',
      imageCredit: unsplash,
    },
    'gear-24': {
      text: 'Necesitas paisajes ultra nítidos en una cresta ventosa. ¿Mejor primer instinto de material?',
      answers: {
        d: 'Desactivar el IBIS y caminar mientras disparas exposiciones largas',
        a: 'Apoyo estable + proteger la cámara de las rachas; no confíes en milagros a pulso',
        b: 'Solo subir el ISO a cinco cifras y esperar',
        c: 'Quitar siempre el parasol con viento',
      },
      explanation:
        'El temblor por viento arruina la nitidez antes de lo que cree la mayoría: asegúrate, lastra y abriga el equipo.',
      imageAlt: 'Paisaje de cresta montañosa — el viento y la estabilidad importan',
      imageCredit: unsplash,
    },
    'gear-25': {
      text: 'Un «nifty fifty» (≈50 mm equiv. full-frame) es popular sobre todo porque…',
      answers: {
        b: 'Siempre equivale a un telescopio para fauna',
        c: 'Desactiva el autofoco por diseño',
        a: 'Es un campo normal versátil, a menudo luminoso y relativamente asequible',
        d: 'Solo funciona bajo el agua',
      },
      explanation:
        'Un prime normal algo luminoso enseña a mirar sin la distorsión del ultra gran angular ni el alcance de un tele pesado.',
      imageAlt: 'Cámara con objetivo fijo — focal normal clásica',
      imageCredit: unsplash,
    },
    'gear-26': {
      text: 'Antes de un evento de pago, unos chequeos sensatos de objetivo / cuerpo incluyen…',
      answers: {
        a: 'Limpiar los elementos frontales y confirmar tarjetas / baterías',
        b: 'Probar el AF y una exposición rápida en los cuerpos que realmente usarás',
        c: 'Llegar sin óptica de repuesto y con una tarjeta casi vacía',
        d: 'Llevar un cuerpo de respaldo o un flujo conocido de móvil de emergencia',
      },
      explanation:
        'El trabajo de pago falla más por logística que por cristal exótico: limpio, probado, con redundancias.',
      imageAlt: 'Primer plano de cuerpo de cámara — chequeos de material antes del evento',
      imageCredit: unsplash,
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
console.log(`gear-lenses: added ${added} LocalizedString.es fields`);

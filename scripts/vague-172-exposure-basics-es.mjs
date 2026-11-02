#!/usr/bin/env node
/**
 * Vague 1.72 — add LocalizedString.es for pack exposure-basics (226 LS).
 * Idempotent: skips fields that already have non-empty es.
 * Vocab aligns with guides/triangle-exposition article.es (apertura / velocidad / ISO).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'exposure-basics');
if (!pack) throw new Error('exposure-basics not found');

const unsplash = 'Unsplash — uso libre (licencia Unsplash)';

const es = {
  title: 'Triángulo de exposición',
  description:
    'Domina apertura, velocidad de obturación e ISO — los tres pilares de cada foto.',
  questions: {
    'exp-1': {
      text: '¿Qué hace principalmente una apertura mayor (p. ej. f/1.8 frente a f/11)?',
      answers: {
        c: 'Ralentiza automáticamente el obturador',
        d: 'Elimina el ruido digital',
        b: 'Hace la imagen más nítida en todas partes',
        a: 'Deja entrar más luz y reduce la profundidad de campo',
      },
      explanation:
        'Una apertura más abierta (número f más bajo) admite más luz y produce una profundidad de campo más superficial — clásico en retratos con fondo desenfocado.',
      imageAlt: 'Cámara vintage sobre una mesa de madera',
      imageCredit: unsplash,
    },
    'exp-2': {
      text: 'Quieres congelar a un sprinter a media zancada. ¿Qué velocidad de obturación conviene más?',
      answers: {
        d: '2 segundos (muy lenta)',
        a: '1/30 de segundo',
        b: '1/60 de segundo',
        c: '1/1000 de segundo (muy rápida)',
      },
      explanation:
        'La acción rápida necesita un tiempo de exposición corto (velocidad alta), como 1/1000 s o más, para congelar el movimiento.',
      imageAlt: 'Ruedas y ajustes de una cámara',
      imageCredit: unsplash,
    },
    'exp-3': {
      text: '¿Qué ajustes forman parte del triángulo de exposición clásico?',
      answers: {
        c: 'Velocidad de obturación',
        b: 'Balance de blancos',
        d: 'ISO (sensibilidad)',
        a: 'Apertura',
      },
      explanation:
        'El triángulo de exposición agrupa apertura, velocidad e ISO. El balance de blancos controla la temperatura de color, no la exposición.',
      imageAlt: 'Cámara en las manos al aire libre',
      imageCredit: unsplash,
    },
    'exp-4': {
      text: 'Subir el ISO sirve sobre todo para…',
      answers: {
        b: 'Aumentar el zoom óptico',
        d: 'Desactivar el autofoco',
        a: 'Fotografiar con poca luz (a costa de más ruido)',
        c: 'Obtener siempre una profundidad de campo más superficial',
      },
      explanation:
        'Un ISO alto amplifica la señal del sensor para exponer bien con poca luz, pero suele aumentar el ruido.',
      imageAlt: 'Detalle de equipo fotográfico',
      imageCredit: unsplash,
    },
    'exp-5': {
      text: '¿Qué significa «cerrar» de f/2.8 a f/5.6?',
      answers: {
        b: 'La apertura se agranda; más luz',
        a: 'La apertura se reduce; unos 2 pasos menos de luz',
        d: 'El objetivo aleja el zoom',
        c: 'El ISO se duplica dos veces',
      },
      explanation:
        'Cada paso completo divide la luz por dos. De f/2.8 → f/4 → f/5.6 son dos pasos menos de luz y más profundidad de campo.',
      imageAlt:
        'Crestas de montaña nítidas — cerrar el diafragma para más profundidad de campo',
      imageCredit: unsplash,
    },
    'exp-6': {
      text: 'Para un efecto de cascada sedosa, los fotógrafos suelen usar…',
      answers: {
        a: 'Una velocidad lenta (y a menudo trípode / filtro ND)',
        c: 'El flash a máxima potencia',
        d: 'f/1.2 en cada toma',
        b: 'Solo el ISO más alto posible',
      },
      explanation:
        'Las exposiciones largas difuminan el agua en movimiento con un aspecto sedoso. Un trípode (y filtros ND a plena luz) mantienen el resto nítido.',
      imageAlt:
        'Cascada sedosa en exposición larga — terreno del obturador lento',
      imageCredit: unsplash,
    },
    'exp-7': {
      text: '¿Qué ocurre cuando subexpones mucho una imagen?',
      answers: {
        d: 'Aumenta la profundidad de campo',
        a: 'Las zonas oscuras pierden detalle y pueden volverse negro puro',
        c: 'Los colores se saturan más',
        b: 'La imagen queda sobreexpuesta',
      },
      explanation:
        'La subexposición significa que llega poca luz al sensor: se pierde detalle en las sombras y puede haber recorte hacia el negro puro.',
      imageAlt:
        'Paisaje oscuro de ambiente — subexposición que aplasta las sombras',
      imageCredit: unsplash,
    },
    'exp-8': {
      text: '¿Para qué sirven los modos de medición (matricial, puntual, ponderada al centro)?',
      answers: {
        c: 'Para cambiar el balance de blancos',
        b: 'Para ajustar los puntos de autofoco',
        a: 'Para decidir cómo mide la cámara la luz de la exposición',
        d: 'Para elegir la resolución de la imagen',
      },
      explanation:
        'Los modos de medición indican cómo evaluar la luz: matricial mira todo el encuadre, puntual una zona mínima, ponderada al centro prioriza el centro.',
    },
    'exp-9': {
      text: '¿Qué escenarios se benefician del modo de exposición manual?',
      answers: {
        d: 'Solo a pleno sol',
        b: 'Astrofotografía y exposiciones largas',
        a: 'Fotografía de estudio con luz controlada',
        c: 'Secuencias coherentes (p. ej. panorámicas)',
      },
      explanation:
        'El modo manual da control total cuando la luz es estable o previsible, evitando que la cámara cambie ajustes entre tomas.',
    },
    'exp-10': {
      text: '¿Qué significa ETTR en técnica de exposición?',
      answers: {
        c: 'Resolución Técnica Triple Mejorada (falso acrónimo)',
        a: 'Expose To The Right (exponer a la derecha)',
        b: 'Tasa de Transferencia Electrónica de Tiempo (falso)',
        d: 'Referencia Externa de Temporización de Disparo (falso)',
      },
      explanation:
        'ETTR significa exponer lo más claro posible sin recortar altas luces, maximizando detalle en sombras y reduciendo ruido en el revelado.',
    },
    'exp-11': {
      text: '¿Cómo afecta un filtro de densidad neutra (ND) a la exposición?',
      answers: {
        b: 'Aumenta el tamaño de la apertura',
        d: 'Sube el ISO automáticamente',
        c: 'Cambia la temperatura de color',
        a: 'Reduce por igual todas las longitudes de onda, permitiendo exposiciones más largas',
      },
      explanation:
        'Los filtros ND actúan como gafas de sol del objetivo: reducen la luz de forma uniforme y permiten obturadores lentos incluso con mucha luz.',
      imageAlt:
        'Vista a plena luz del día — terreno del filtro ND para alargar la exposición',
      imageCredit: unsplash,
    },
    'exp-12': {
      text: '¿Qué es la regla de reciprocidad en fotografía?',
      answers: {
        a: 'La velocidad debe ser al menos 1/distancia focal para evitar trepidación',
        d: 'El tamaño del sensor determina la resolución máxima',
        b: 'El ISO debe duplicarse al abrir un paso de apertura',
        c: 'Apertura y velocidad de obturación son inversamente proporcionales',
      },
      explanation:
        'La regla de reciprocidad ayuda a evitar la trepidación: usa una velocidad ≥ 1/focal (p. ej. 1/50 s para un 50 mm en formato completo).',
    },
    'exp-13': {
      text: '¿Qué factores afectan a la profundidad de campo en una foto?',
      answers: {
        d: 'El ajuste de ISO',
        c: 'La distancia focal',
        b: 'La distancia al sujeto',
        a: 'El tamaño de la apertura',
      },
      explanation:
        'La profundidad de campo la controlan la apertura, la distancia al sujeto y la focal. El ISO afecta a la sensibilidad y al ruido, no a la profundidad de campo.',
      imageAlt:
        'Fotógrafo con poca profundidad de campo detrás del sujeto',
      imageCredit: unsplash,
    },
    'exp-14': {
      text: '¿Qué es el «fallo de reciprocidad» en fotografía analógica?',
      answers: {
        a: 'Cuando exposiciones muy largas o muy cortas requieren ajuste porque la película no responde de forma lineal',
        d: 'Cuando se usan varios flashes a la vez',
        b: 'Cuando la regla de reciprocidad deja de valer en cámaras digitales',
        c: 'Cuando el ISO no coincide con la iluminación',
      },
      explanation:
        'El fallo de reciprocidad aparece en exposiciones muy largas o muy cortas, donde la respuesta de la película no es proporcional a luz × tiempo y hace falta compensar.',
    },
    'exp-15': {
      text: '¿Qué prioriza la «medición de altas luces»?',
      answers: {
        c: 'Centrarse en las partes más oscuras de la escena',
        a: 'Preservar detalle en zonas claras, aunque las sombras se oscurezcan',
        b: 'Exponer de forma uniforme toda la imagen',
        d: 'Equilibrar por igual flash y luz ambiente',
      },
      explanation:
        'La medición de altas luces protege las zonas claras del recorte (quemado), a menudo más difícil de recuperar en revelado que el detalle de sombras.',
    },
    'exp-16': {
      text: '¿Qué modo de exposición te deja fijar la apertura mientras la cámara elige la velocidad?',
      answers: {
        d: 'Manual completo (M)',
        b: 'Prioridad a la velocidad (S o Tv)',
        c: 'Modo programa (P)',
        a: 'Prioridad a la apertura (A o Av)',
      },
      explanation:
        'La prioridad a la apertura te deja controlar la profundidad de campo mientras la cámara calcula la velocidad correcta.',
    },
    'exp-17': {
      text: '¿Qué efectos tiene subir el ISO sobre la calidad de imagen?',
      answers: {
        b: 'Rango dinámico reducido',
        d: 'Mayor nitidez',
        c: 'Posible pérdida de detalle de color',
        a: 'Más ruido / granulación',
      },
      explanation:
        'Un ISO más alto amplifica la señal y también el ruido, reduce el rango dinámico y puede afectar a la fidelidad del color. La nitidez no mejora.',
      imageAlt: 'Luces de ciudad de noche — compromisos del ISO alto',
      imageCredit: unsplash,
    },
    'exp-18': {
      text: '¿Para qué sirve la «compensación de exposición»?',
      answers: {
        c: 'Para ajustar la sensibilidad del autofoco',
        b: 'Para cambiar el equilibrio de color',
        a: 'Para anular a mano el cálculo automático de exposición de la cámara',
        d: 'Para modificar la relación de aspecto',
      },
      explanation:
        'La compensación de exposición sesga la medición hacia exposiciones más claras (+) u oscuras (−), útil en escenas high-key o low-key.',
      imageAlt:
        'Agua brillante al atardecer — criterio de compensación de exposición',
      imageCredit: unsplash,
    },
    'exp-19': {
      text: '¿Por qué un fotógrafo usaría bracketing?',
      answers: {
        d: 'Para cambiar la distancia focal del objetivo',
        c: 'Para enfocar automáticamente la imagen',
        b: 'Para aumentar la cadencia de disparo de la cámara',
        a: 'Para capturar varias exposiciones a distintos niveles (HDR o seguridad)',
      },
      explanation:
        'El bracketing hace varias tomas a distintas exposiciones: al menos una suele ser óptima y permite fusión HDR o red de seguridad.',
      imageAlt:
        'Amanecer de alto contraste entre árboles — escena clásica de bracketing',
      imageCredit: unsplash,
    },
    'exp-20': {
      text: '¿Qué situaciones suelen pedir una ligera sobreexposición?',
      answers: {
        a: 'Disparar contra un fondo brillante (sujetos a contraluz)',
        b: 'Escenas de nieve para evitar una nieve grisácea',
        c: 'Fotografía de flores blancas',
        d: 'Paisajes urbanos nocturnos con muchas luces',
      },
      explanation:
        'Las cámaras tienden a subexponer escenas muy claras. Sobreexponer un poco mantiene los blancos blancos y evita siluetas involuntarias.',
    },
    'exp-21': {
      text: 'Concierto oscuro, bailarines rápidos. ¿Cuál es tu primer reflejo?',
      answers: {
        a: 'Bajar el obturador a 1/30 s para ganar luz',
        b: 'Abrir el diafragma y subir el ISO si hace falta',
        c: 'Cerrar a f/16 por nitidez',
        d: 'Activar el modo fuegos artificiales de exposición larga',
      },
      explanation:
        'Necesitas luz Y congelar el movimiento. Abre primero, luego sube el ISO — no empieces arrastrando el obturador sobre los bailarines.',
      imageAlt: 'Luces de ciudad de noche',
      imageCredit: unsplash,
    },
    'exp-22': {
      text: 'Quieres agua sedosa en una cascada. ¿Qué combinación encaja mejor?',
      answers: {
        d: 'f/1.2 a plena apertura a pleno sol sin ND',
        c: 'Solo flash, sin tocar el obturador',
        a: '1/2000 s + ISO 6400 (muy rápido / alto)',
        b: 'Obturador lento (p. ej. 1/4–2 s), ISO bajo, diafragma cerrado o ND',
      },
      explanation:
        'El desenfoque de movimiento necesita tiempo. Ralentiza el obturador; controla la exposición con ISO, apertura o un filtro ND.',
      imageAlt: 'Cascada en un bosque',
      imageCredit: unsplash,
    },
    'exp-23': {
      text: 'Mito o matiz: «Hay que disparar siempre a ISO 100 para la mejor calidad.»',
      answers: {
        d: 'El ISO no afecta en absoluto al ruido',
        b: 'Sobre todo un mito: un fotograma nítido a ISO más alto gana a uno borroso a ISO 100',
        a: 'Cierto — cualquier ISO más alto arruina el archivo',
        c: 'Cierto solo en smartphones',
      },
      explanation:
        'Usa el ISO más bajo que aún te permita congelar el movimiento y exponer bien. El desenfoque es peor que un poco de ruido.',
    },
    'exp-24': {
      text: 'Retrato junto a la ventana: exterior muy claro, habitación oscura. ¿Cómo mantienes ambos legibles?',
      answers: {
        a: 'Exponer solo para la habitación y quemar la ventana',
        b: 'Exponer para el exterior y siluetear al sujeto',
        c: 'Exponer para el rostro, luego levantar sombras / relleno si hace falta',
        d: 'Disparar siempre a f/22 e ISO 50',
      },
      explanation:
        'Protege primero el rostro. Recupera luego las sombras de la habitación; una ventana quemada suele ser aceptable.',
      imageAlt: 'Retrato cerca de una ventana luminosa',
      imageCredit: unsplash,
    },
    'exp-25': {
      text: 'Mito: «Más ISO = siempre peor foto.» ¿Cuál es el matiz?',
      answers: {
        a: 'Cierto — nunca pases de ISO 400',
        b: 'El ruido suele ser mejor que el desenfoque o la subexposición; los sensores modernos aguantan bien ISO alto',
        c: 'El ISO solo afecta al balance de blancos',
        d: 'El ISO solo existe en cámaras de película',
      },
      explanation:
        'Un fotograma nítido y bien expuesto a ISO alto gana a uno «limpio» pero borroso.',
      imageAlt: 'Cielo nocturno — ruido frente a desenfoque al subir el ISO',
      imageCredit: unsplash,
    },
    'exp-26': {
      text: 'Estás en EV 0 en una playa reflectante. Las pieles se ven oscuras. ¿Cuál es el siguiente paso más inteligente?',
      answers: {
        a: 'Pasar a +1 / +2 EV de compensación de exposición',
        b: 'Cerrar el diafragma dos pasos',
        c: 'Cambiar al balance de blancos tungsteno',
        d: 'Activar solo el temporizador',
      },
      explanation:
        'La medición matricial subexpone escenas claras. Una compensación positiva restaura los tonos medios.',
      imageAlt: 'Paisaje exterior luminoso',
      imageCredit: unsplash,
    },
    'exp-27': {
      text: 'Flash + ambiente: ¿cómo evitas que el fondo se vuelva negro?',
      answers: {
        a: 'Subir solo la potencia del flash; ignorar el obturador',
        b: 'Ralentizar el obturador (dentro de la sincronización) para recoger ambiente; ajustar el flash para el sujeto',
        c: 'Disparar siempre a 1/8000 s con flash',
        d: 'Desactivar todos los exposímetros de luz ambiente',
      },
      explanation:
        'El obturador regula sobre todo la ambiente; el flash (con apertura/ISO) ilumina al sujeto.',
    },
    'exp-28': {
      text: 'Pasillo deportivo: el sujeto corre hacia ti. ¿Mejor combo AF / obturador?',
      answers: {
        a: 'AF simple + 1/60 s',
        b: 'AF continuo + obturador rápido (p. ej. 1/500 s+)',
        c: 'Enfoque manual a infinito + bulb',
        d: 'Solo detección de rostros con 2 s de exposición',
      },
      explanation:
        'Un AF que sigue, más un tiempo lo bastante corto para congelar el movimiento.',
      imageAlt: 'Corredor en movimiento',
      imageCredit: unsplash,
    },
    'exp-29': {
      text: 'Foso de concierto, sujeto en movimiento, focos. Quieres congelar Y negros legibles. ¿Prioridad?',
      answers: {
        b: 'Velocidad bastante rápida para congelar, abrir apertura, subir ISO solo si hace falta',
        c: 'f/16 para máxima profundidad siempre',
        a: 'ISO mínimo, obturador lento, y a ver qué pasa',
        d: 'Solo flash — la luz de escenario nunca funciona',
      },
      explanation:
        'Congela primero (velocidad), recoge luz (apertura), luego ISO. Los negros se protegen con una exposición disciplinada, no con una subexposición a ciegas.',
      imageAlt:
        'Luces de ciudad de noche que evocan la foto con poca luz',
      imageCredit: 'Foto: Unsplash',
    },
    'exp-30': {
      text: 'Mides un retrato a contraluz a −1 EV «por el drama». La piel queda fangosa y ruidosa al levantarla. ¿Error?',
      answers: {
        c: 'Solo el JPEG gestiona el contraluz',
        b: 'El ISO era demasiado bajo para el drama',
        a: 'Subexposiste el rostro; levantarlo después amplifica el ruido — expón para la piel, acepta un fondo más claro',
        d: '−1 EV siempre mejora la textura de la piel',
      },
      explanation:
        'Un borde luminoso está bien; aplastar los tonos del rostro, no. Expón para el sujeto que te importa.',
    },
    'exp-31': {
      text: '¿Qué pares mantienen aproximadamente la misma exposición (mismo EV) si nada más cambia?',
      answers: {
        a: '1/250 s a f/2.8 ↔ 1/125 s a f/4',
        b: 'ISO 400 a 1/100 ↔ ISO 800 a 1/200',
        c: 'f/8 a ISO 100 ↔ f/4 a ISO 100 (misma velocidad)',
        d: '1/60 s a f/5.6 ↔ 1/30 s a f/8',
      },
      explanation:
        'Un paso de apertura + un paso de velocidad (o +1 ISO / −1 velocidad) se equilibran. Abrir dos pasos sin cambiar la velocidad = +2 EV.',
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
console.log(`exposure-basics: added ${added} LocalizedString.es fields`);

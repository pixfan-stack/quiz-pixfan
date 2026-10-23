#!/usr/bin/env node
/**
 * Vague 1.47 — add LocalizedString.es for pack flash-studio (184 LS).
 * Idempotent: skips fields that already have non-empty es.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'flash-studio');
if (!pack) throw new Error('flash-studio not found');

const unsplashCredit = 'Unsplash — uso libre (licencia Unsplash)';

const es = {
  title: 'Flash y estudio',
  description:
    'Speedlights, flashes de estudio, sincronización, modificadores y técnica de tres puntos — recorrido de iluminación de estudio Pixfan.',
  questions: {
    'flash-01': {
      text: '¿Qué automatiza principalmente la medición flash TTL?',
      answers: {
        b: 'Solo el ISO de la cámara de forma permanente',
        a: 'La potencia del flash para una exposición objetivo a través del objetivo',
        c: 'Solo el color de las gelatinas en LED continuos',
        d: 'Solo que el primer obturador quede abierto permanentemente',
      },
      explanation:
        'El TTL (Through-The-Lens) mide la escena y ajusta la potencia del flash para una exposición objetivo; tú sigues eligiendo sincronización, modificadores y correcciones creativas.',
      imageAlt: 'Luces de estudio y equipo fotográfico',
      imageCredit: unsplashCredit,
    },
    'flash-02': {
      text: 'La sincronización X (sincronización flash clásica) está limitada sobre todo por qué ajuste de cámara?',
      answers: {
        c: 'Solo la ganancia del micrófono',
        a: 'La velocidad máxima de obturación antes de que las cortinillas dejen una ranura móvil',
        b: 'Solo la velocidad del motor de enfoque del objetivo',
        d: 'Solo el brillo de la pantalla LCD',
      },
      explanation:
        'Por encima de la sincronización X, los obturadores de plano focal exponen mediante una ranura móvil: un pulso de flash normal solo iluminaría una banda, salvo que uses HSS u otras técnicas.',
      imageAlt: 'Cuerpo de cámara clásico',
      imageCredit: unsplashCredit,
    },
    'flash-03': {
      text: 'La sincronización de alta velocidad (HSS) es útil cuando quieres…',
      answers: {
        d: 'Desactivar toda la luz ambiente para siempre',
        b: 'Solo disparar película sin obturador',
        a: 'Usar flash con velocidades más rápidas que la sincronización X (p. ej. poca profundidad de campo en exterior)',
        c: 'Solo cargar las baterías más rápido',
      },
      explanation:
        'El HSS pulsa el flash a lo largo de la ranura para congelar el ambiente con obturadores rápidos y seguir añadiendo relleno de flash — a costa de potencia efectiva.',
      imageAlt: 'Ambiente de luz suave en exterior',
      imageCredit: unsplashCredit,
    },
    'flash-04': {
      text: 'La sincronización de segunda cortinilla suele hacer que las luces en movimiento parezcan…',
      answers: {
        a: 'Dejar una estela detrás del movimiento del sujeto',
        b: 'Aparecer siempre solo delante del sujeto',
        c: 'Eliminar automáticamente todo el desenfoque de movimiento',
        d: 'Cambiar el Kelvin solo a 2000 K',
      },
      explanation:
        'Con segunda cortinilla, primero se construyen las estelas del ambiente y el flash congela al sujeto al final: las estelas se leen como siguiendo el movimiento.',
    },
    'flash-05': {
      text: 'Un número guía (NG) sirve sobre todo para estimar…',
      answers: {
        c: 'Solo el peso de una softbox',
        a: 'El alcance / potencia del flash frente a la distancia (y apertura) para un ISO dado',
        b: 'Solo los puntos de autofoco disponibles',
        d: 'Solo la calidad de compresión JPEG',
      },
      explanation:
        'Los números guía resumen la potencia del flash para el cálculo de exposición (relaciones distancia × apertura a un ISO de referencia).',
      imageAlt: 'Cámara lista para trabajar con flash',
      imageCredit: unsplashCredit,
    },
    'flash-06': {
      text: 'Según la idea del cuadrado inverso para un flash desnudo, duplicar la distancia al sujeto…',
      answers: {
        b: 'Duplica el brillo del flash',
        a: 'Reduce la intensidad del flash a aproximadamente un cuarto (≈ −2 pasos)',
        c: 'No tiene ningún efecto sobre la exposición del flash',
        d: 'Bloquea siempre el ISO en 100',
      },
      explanation:
        'La intensidad cae con el cuadrado de la distancia: 2× distancia ≈ ¼ de luz (unos dos pasos). Los modificadores y el rebote cambian la caída real.',
      imageAlt: 'Equipo fotográfico en el set',
      imageCredit: unsplashCredit,
    },
    'flash-07': {
      text: 'Rebotar el flash en un techo blanco suele buscar…',
      answers: {
        d: 'Aumentar a propósito los ojos rojos',
        a: 'Suavizar y agrandar la fuente de luz efectiva',
        b: 'Hacer la luz más dura que un flash desnudo',
        c: 'Solo calentar la escena a 2000 K',
      },
      explanation:
        'Una fuente grande rebotada suaviza las sombras frente al flash desnudo en cámara; techos o paredes de color tiñen el rebote.',
      imageAlt: 'Escena de escritorio en interior',
      imageCredit: unsplashCredit,
    },
    'flash-08': {
      text: 'Comparada con un speedlight desnudo, una softbox grande cerca del sujeto suele…',
      answers: {
        a: 'Suavizar las transiciones y envolver la luz con más gentileza',
        b: 'Crear siempre sombras más nítidas y duras',
        c: 'Eliminar la necesidad de cualquier ajuste de exposición',
        d: 'Funcionar solo con cámaras de película',
      },
      explanation:
        'Importa el tamaño relativo de la fuente: grande + cerca = envoltura más suave. Las softboxes siguen proyectando sombras: no borran la oscuridad.',
      imageAlt: 'Retrato con luz suave tipo estudio',
      imageCredit: unsplashCredit,
    },
    'flash-09': {
      text: 'Paraguas frente a softbox — una regla de estudio razonable es…',
      answers: {
        c: 'Los paraguas solo funcionan bajo el agua',
        a: 'Los paraguas son rápidos y derraman más luz; las softboxes limitan el derrame con una cara',
        b: 'Las softboxes siempre congelan el movimiento mejor que los paraguas',
        d: 'Ninguno se puede usar con flashes de estudio',
      },
      explanation:
        'Los paraguas (sobre todo shoot-through) son rápidos y derraman; las softboxes dan más control direccional. Ambos pueden ser suaves si son lo bastante grandes.',
      imageAlt: 'Kit de iluminación de estudio',
      imageCredit: unsplashCredit,
    },
    'flash-10': {
      text: 'Una rejilla en una softbox o reflector sirve principalmente a…',
      answers: {
        b: 'Aumentar el derrame sobre el fondo',
        a: 'Estrechar el haz y reducir el derrame',
        c: 'Convertir el flash solo en tungsteno continuo',
        d: 'Desactivar los disparadores de radio',
      },
      explanation:
        'Las rejillas controlan el derrame y mantienen la luz más direccional: útiles para luces de pelo, acentos y fondos más limpios.',
    },
    'flash-11': {
      text: 'En un clásico de tres puntos de estudio, la luz de borde / de pelo suele…',
      answers: {
        a: 'Separar al sujeto del fondo con un resalte en el borde',
        b: 'Sustituir por completo la luz clave',
        c: 'Solo medir el Kelvin de la pintura de la pared',
        d: 'Solo alimentar la lámpara piloto',
      },
      explanation:
        'La clave esculpe, el relleno abre sombras, el borde/pelo separa los contornos: vocabulario legible de tres puntos para retrato de estudio.',
      imageAlt: 'Retrato con iluminación estilo estudio',
      imageCredit: unsplashCredit,
    },
    'flash-12': {
      text: '¿Cuáles afirmaciones sobre clave frente a relleno en estudio son ciertas?',
      answers: {
        a: 'La clave suele ser la luz más fuerte que da forma',
        b: 'El relleno reduce la profundidad de sombra sin convertirse en una segunda clave dura',
        c: 'El relleno debe ser siempre más brillante que la clave',
        d: 'Las luces clave solo existen en smartphones',
      },
      explanation:
        'La clave define dirección y forma; el relleno es subordinado. Si el relleno supera a la clave, el ratio de iluminación se derrumba.',
      imageAlt: 'Rostro de retrato con luz controlada',
      imageCredit: unsplashCredit,
    },
    'flash-13': {
      text: 'Las lámparas piloto (modeling lights) de los flashes de estudio sirven sobre todo a…',
      answers: {
        c: 'Sustituir cualquier necesidad de pulso de flash',
        a: 'Previsualizar la dirección de la luz y las sombras antes de disparar el flash',
        b: 'Solo cargar el condensador más rápido',
        d: 'Solo calentar químicamente el tubo del flash',
      },
      explanation:
        'Las lámparas piloto ayudan a ver colocación y ratios; la exposición final sigue dependiendo del pulso de flash (y de los ajustes de cámara).',
      imageAlt: 'Sujeto iluminado para una sesión de retrato',
      imageCredit: unsplashCredit,
    },
    'flash-14': {
      text: 'Los disparadores de radio para flash fuera de cámara se prefieren a los esclavos ópticos cuando…',
      answers: {
        b: 'Solo disparas en oscuridad total sin paredes',
        a: 'Necesitas fiabilidad tras esquinas, con ambiente brillante o control multi-grupo',
        c: 'Quieres a propósito tiempos de reciclaje más lentos',
        d: 'Te niegas a configurar cualquier canal',
      },
      explanation:
        'Los esclavos ópticos pueden fallar con sol fuerte o detrás de obstáculos; los packs de radio son más robustos en localización y kits multi-luz.',
      imageAlt: 'Cuerpo de cámara para flash fuera de cámara',
      imageCredit: unsplashCredit,
    },
    'flash-15': {
      text: 'Una gelatina CTO en un flash se usa habitualmente para…',
      answers: {
        a: 'Calentar el flash para igualarlo mejor al tungsteno / ambiente cálido',
        b: 'Enfriar el flash solo hacia el azul de sombra',
        c: 'Aumentar el número guía en 10 pasos',
        d: 'Desactivar el TTL para siempre',
      },
      explanation:
        'La CTO (Color Temperature Orange) calienta un flash equilibrado a luz de día para mezclarlo con prácticos más cálidos; la CTB va en la otra dirección.',
    },
    'flash-16': {
      text: 'Para mantener la exposición del flash mientras oscureces un fondo brillante con un speedlight (sin HSS), un control clásico es…',
      answers: {
        c: 'Solo subir el ISO abriendo siempre más el diafragma',
        a: 'Subir la velocidad de obturación hacia la sincronización X (baja el ambiente; el flash se mantiene similar)',
        b: 'Solo hacer zoom en el objetivo sin cambiar la exposición',
        d: 'Apagar el flash y esperar',
      },
      explanation:
        'Por debajo de la sincronización X, el obturador regula sobre todo el ambiente; apertura/ISO/potencia regulan el flash. Una velocidad más rápida (aún ≤ sync) oscurece el ambiente sin «matar» el flash de la misma forma.',
      imageAlt: 'Fotógrafo trabajando con cámara en exterior',
      imageCredit: unsplashCredit,
    },
    'flash-17': {
      text: 'La potencia manual del flash (p. ej. 1/1 → 1/2) suele cambiar la salida en unos…',
      answers: {
        b: 'Diez pasos',
        a: 'Un paso',
        c: 'Ninguna diferencia medible',
        d: 'Exactamente 0,1 EV solo',
      },
      explanation:
        'Reducir a la mitad la potencia es aproximadamente −1 EV de exposición de flash (si todo lo demás es igual). El control fino suele usar pasos de 1/3 en unidades modernas.',
      imageAlt: 'Cultura de cámara vintage y luz',
      imageCredit: unsplashCredit,
    },
    'flash-18': {
      text: 'Congelar una salpicadura o un bailarín con flash suele depender de…',
      answers: {
        d: 'Solo una exposición de 30 segundos',
        a: 'Una duración de flash corta (a menudo a menor potencia) como obturador efectivo',
        b: 'Solo lámparas piloto LED continuas',
        c: 'Desactivar todos los modificadores de luz',
      },
      explanation:
        'Con ambiente oscuro, la duración del flash — no el obturador mecánico — congela la acción. Menor potencia suele acortar la duración en speedlights.',
      imageAlt: 'Retrato con catchlights nítidos tipo flash',
      imageCredit: unsplashCredit,
    },
    'flash-19': {
      text: 'Los ojos rojos con flash en cámara se deben principalmente a…',
      answers: {
        a: 'Un flash cerca del eje del objetivo que ilumina la retina',
        b: 'Solo demasiado rebote en un techo blanco',
        c: 'Solo usar disparadores de radio en exterior',
        d: 'Disparar exclusivamente en RAW',
      },
      explanation:
        'El flash alineado con el eje se refleja en la retina. Fuera de cámara, rebote o preflashs que cierran la pupila reducen los ojos rojos.',
    },
    'flash-20': {
      text: 'Un snoot en una luz de estudio suele…',
      answers: {
        c: 'Convertir automáticamente el flash en softbox',
        a: 'Crear un pequeño charco de luz controlado (pelo, acento, hotspot de producto)',
        b: 'Ensanchar el haz como un paraguas desnudo',
        d: 'Solo enfriar el tubo del flash',
      },
      explanation:
        'Los snoots concentran la luz en un círculo cerrado: acentos y highlights de producto, no una clave amplia y suave.',
      imageAlt: 'Detalle de equipo óptico',
      imageCredit: unsplashCredit,
    },
    'flash-21': {
      text: '¿Qué prácticas ayudan a exposiciones multi-luz coherentes en estudio?',
      answers: {
        a: 'Medir o chimpár ratios tras colocar la clave, luego añadir relleno/borde',
        b: 'Mantener ISO y apertura intencionados mientras ajustas las potencias',
        c: 'Cambiar cada luz a TTL al azar en cada fotograma',
        d: 'Ignorar los tiempos de reciclaje y disparar siempre lo más rápido posible',
      },
      explanation:
        'Construye desde la clave, controla los ratios a propósito y vigila el reciclaje: TTL aleatorio en cada cabeza pelea contra la coherencia.',
      imageAlt: 'Sujeto de retrato bajo luces controladas',
      imageCredit: unsplashCredit,
    },
    'flash-22': {
      text: 'Paneles LED continuos frente a flashes de estudio — una comparación justa es…',
      answers: {
        a: 'Los LED son fáciles de previsualizar; los flashes suelen ganar para congelar y dominar el sol',
        b: 'Los flashes no pueden usar modificadores',
        c: 'Los LED siempre tienen duraciones más cortas que un speedlight a 1/128',
        d: 'Solo los LED funcionan con softboxes',
      },
      explanation:
        'Lo que ves es lo que obtienes favorece la luz continua; la potencia de pico y el pulso corto favorecen los flashes para acción y dominar la luz de día.',
    },
    'flash-23': {
      text: 'Los setups beauty de luz cruzada / clamshell suelen colocar el relleno…',
      answers: {
        b: 'Solo detrás del papel de fondo',
        a: 'Bajo la barbilla / debajo de la clave para abrir las órbitas y levantar las sombras',
        c: 'Solo como sol desnudo en exterior',
        d: 'En el suelo apuntando siempre hacia arriba a 1/1',
      },
      explanation:
        'El clamshell combina una clave arriba con un relleno bajo (reflector o fuente suave) para una beauty luminosa y pareja — aún no libre de sombras.',
      imageAlt: 'Iluminación de retrato estilo beauty',
      imageCredit: unsplashCredit,
    },
    'flash-24': {
      text: 'Mito: «Si uso flash en interior, el fondo siempre se pone negro.» ¿Mejor matiz?',
      answers: {
        c: 'El flash siempre borra el ambiente para siempre',
        a: 'Puedes equilibrar el ambiente con obturador más lento / ISO más alto / apertura más abierta mientras el flash ilumina al sujeto',
        b: 'Solo un flash gelatinizado puede mostrar algo de ambiente',
        d: 'Los fondos los eliminan físicamente los fotones',
      },
      explanation:
        'Los fondos negros aparecen cuando se «ahoga» el ambiente (obturador rápido, ISO bajo, diafragma cerrado). Arrastrar el obturador (dentro de la tolerancia al desenfoque) mantiene la luz de la habitación en la mezcla.',
      imageAlt: 'Escena de interior con luz disponible',
      imageCredit: unsplashCredit,
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
console.log(`flash-studio: added ${added} LocalizedString.es fields`);

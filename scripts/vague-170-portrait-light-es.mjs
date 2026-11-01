#!/usr/bin/env node
/**
 * Vague 1.70 — add LocalizedString.es for pack portrait-light (194 LS).
 * Idempotent: skips fields that already have non-empty es.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'portrait-light');
if (!pack) throw new Error('portrait-light not found');

const unsplashCredit = 'Unsplash — uso libre (licencia Unsplash)';

const es = {
  title: 'Retrato y luz (recorrido Pixfan)',
  description:
    'Clave, relleno, luz de ventana y luz favorecedora en el rostro — el oficio del retrato que Pixfan enseña antes del retoque pesado.',
  questions: {
    'pl-01': {
      text: 'En un retrato clásico con una sola luz, la luz principal que modela el rostro se llama…',
      answers: {
        a: 'Luz clave (key light)',
        b: 'Solo luz de pelo (hair light)',
        c: 'Gelatina de fondo',
        d: 'Gelatina catchlight',
      },
      explanation:
        'La clave fija la dirección y el contraste en el rostro; el relleno y los acentos vienen después.',
      imageAlt: 'Retrato cerrado con luz direccional suave en el rostro',
      imageCredit: unsplashCredit,
    },
    'pl-02': {
      text: 'La luz Rembrandt se reconoce por…',
      answers: {
        a: 'Un triángulo de luz en la mejilla en sombra bajo el ojo',
        b: 'Luz plana uniforme sin ninguna sombra de nariz',
        c: 'Solo un rim light desde detrás',
        d: 'Un split gel rojo/cian en ambas mejillas',
      },
      explanation:
        'Una clave ≈45° arriba y de lado crea el triángulo clásico en la mejilla.',
      imageAlt: 'Rostro iluminado de lado — terreno Rembrandt / loop',
      imageCredit: unsplashCredit,
    },
    'pl-03': {
      text: 'Sol de mediodía duro para un retrato favorecedor — ¿primer rescate?',
      answers: {
        a: 'Sombra abierta, difusor o relleno en bounce — suavizar el golpe desde arriba',
        b: 'Subexponer siempre dos pasos y aplastar la piel',
        c: 'Disparar solo a f/22 de frente al sol',
        d: 'Desactivar el balance de blancos para siempre',
      },
      explanation:
        'El oficio del retrato prioriza una luz favorecedora en el rostro; no luches a pecho descubierto contra el sol cenital duro.',
      imageAlt: 'Retrato exterior cálido en sombra abierta favorecedora',
      imageCredit: unsplashCredit,
    },
    'pl-04': {
      text: '¿Qué hace sobre todo la luz de relleno (fill) en un retrato?',
      answers: {
        a: 'Subir el contraste del lado en sombra sin convertirse en una segunda clave dura',
        b: 'Sustituir la necesidad de una luz clave',
        c: 'Iluminar solo el fondo ciclorama',
        d: 'Congelar el movimiento como un flash ultrarrápido',
      },
      explanation:
        'El relleno controla la profundidad de las sombras; la clave conserva la dirección.',
      imageAlt: 'Retrato masculino con relleno suave que levanta el lado en sombra',
      imageCredit: unsplashCredit,
    },
    'pl-05': {
      text: 'Un reflejo habitual de focal favorecedora en retrato full-frame suele ser…',
      answers: {
        a: 'Tele corto (~70–105 mm) con una distancia de trabajo moderada',
        b: 'Ultra gran angular a brazo tendido para cada cabeza',
        c: 'Ojo de pez para retratos corporativos',
        d: 'Solo 14 mm para trabajo de belleza',
      },
      explanation:
        'Los teles cortos comprimen con suavidad y mantienen proporciones faciales naturales a una distancia educada.',
      imageAlt: 'Look de retrato con tele corto y fondo comprimido',
      imageCredit: unsplashCredit,
    },
    'pl-06': {
      text: 'La luz mariposa (Paramount) coloca la clave…',
      answers: {
        a: 'Alta y centrada, proyectando una pequeña sombra bajo la nariz',
        b: 'Baja desde el suelo para sombras de terror',
        c: 'Directamente detrás del sujeto solamente',
        d: 'Como dos rim duros opuestos sin luz frontal',
      },
      explanation:
        'La clave belleza / viejo Hollywood se sitúa alta en el eje para la sombra mariposa bajo la nariz.',
      imageAlt: 'Luz belleza alta en el eje — vibe mariposa / Paramount',
      imageCredit: unsplashCredit,
    },
    'pl-07': {
      text: 'Los catchlights en los ojos indican sobre todo…',
      answers: {
        a: 'Dónde estaban la clave (y el relleno) respecto al sujeto',
        b: 'El ISO exacto que usó la cámara',
        c: 'Si el objetivo es fijo o zoom',
        d: 'Que la foto siempre está generada por IA',
      },
      explanation:
        'Lee los reflejos en el ojo para reconstruir la posición y el tamaño de la fuente.',
      imageAlt: 'Catchlights visibles en los ojos bajo una clave suave',
      imageCredit: unsplashCredit,
    },
    'pl-08': {
      text: 'Retrato a la ventana: el sujeto de cara a la ventana. El look más suave suele venir de…',
      answers: {
        a: 'Una ventana grande al norte / cielo cubierto que actúa como softbox',
        b: 'Solo manchas de sol duro a través de persianas',
        c: 'Un spot diminuto desde el otro extremo de la habitación',
        d: 'Girar siempre la espalda por completo a la ventana',
      },
      explanation:
        'Una fuente grande, suave y difusa envuelve el rostro; el sol duro a través del cristal es otra herramienta.',
      imageAlt: 'Retrato suave con luz de ventana de cara a la ventana',
      imageCredit: unsplashCredit,
    },
    'pl-09': {
      text: 'Los retratos en golden hour suelen funcionar porque…',
      answers: {
        a: 'La luz baja y cálida es más suave y direccional que el sol duro del mediodía',
        b: 'El ISO debe quedar bloqueado en 50 para siempre',
        c: 'El balance de blancos desaparece como concepto',
        d: 'Solo se pueden disparar siluetas en ese momento',
      },
      explanation:
        'El ángulo + el calor + las sombras largas modelan sin combatir el sol cenital.',
      imageAlt: 'Retrato exterior con luz de acento golden hour',
      imageCredit: unsplashCredit,
    },
    'pl-10': {
      text: '¿Qué elecciones suelen suavizar una clave dura sobre un rostro?',
      answers: {
        a: 'Modificador más grande / difusor más cerca del sujeto',
        b: 'Alejar una bombilla desnuda para hacerla más pequeña en el encuadre',
        c: 'Añadir bounce o un reflector como relleno suave',
        d: 'Subir siempre Clarity a +100 en la cámara',
      },
      explanation:
        'Fuentes más grandes/cercanas envuelven; el relleno levanta las sombras. Una bombilla desnuda lejana endurece.',
    },
    'pl-11': {
      text: 'La luz belleza «clamshell» combina típicamente…',
      answers: {
        a: 'Una clave desde arriba y un relleno/reflector bajo la barbilla',
        b: 'Solo dos rim lights y una bandera negra sobre el rostro',
        c: 'Una sola vela a ras de suelo',
        d: 'Un flash polarizado cruzado a través de un microscopio',
      },
      explanation:
        'Clave de arriba + relleno de abajo abre las órbitas y suaviza bajo la barbilla.',
      imageAlt: 'Luz belleza suave envolviendo el rostro de forma uniforme',
      imageCredit: unsplashCredit,
    },
    'pl-12': {
      text: 'La luz split en un rostro significa…',
      answers: {
        a: 'Mitad del rostro en clave, la otra esencialmente en sombra',
        b: 'Sombras loop idénticas en ambas mejillas',
        c: 'Solo luz de pelo sin exposición frontal',
        d: 'LED RGB que ciclan cada segundo',
      },
      explanation:
        'Una clave a ~90° crea un medio rostro dramático — útil, no el favorecedor por defecto.',
      imageAlt: 'Luz split dramática que esculpe la mitad del rostro',
      imageCredit: unsplashCredit,
    },
    'pl-13': {
      text: 'Quieres un fondo cremoso en retrato sin salir. ¿Primer reflejo?',
      answers: {
        a: 'Apertura más abierta + más distancia sujeto–fondo + focal más larga',
        b: 'f/16 y pegar el sujeto a 10 cm del fondo',
        c: 'Subir el ISO hasta que el ruido difumine el fondo',
        d: 'Usar siempre el flash pop-up sin bounce',
      },
      explanation:
        'La profundidad de campo = óptica + geometría — apertura, distancias y focal trabajan juntas.',
      imageAlt: 'Retrato fashion con contraste controlado',
      imageCredit: unsplashCredit,
    },
    'pl-14': {
      text: 'Un ratio de iluminación ~4:1 (clave vs relleno) en un rostro suele sentirse…',
      answers: {
        a: 'Bastante contrastado / dramático frente a 2:1',
        b: 'Totalmente plano como un relleno de mediodía nublado',
        c: 'Idéntico a la mariposa sin ninguna sombra',
        d: 'Un ajuste de balance de blancos, no una idea de contraste',
      },
      explanation:
        'Cuanto más sube el ratio clave/relleno, más se oscurece el lado en sombra; 2:1 es más suave, 8:1 más dramático.',
    },
    'pl-15': {
      text: 'Broad vs short lighting: el short lighting típicamente…',
      answers: {
        a: 'Ilumina el lado del rostro girado lejos de la cámara — a menudo adelgaza',
        b: 'Solo ilumina siempre las orejas desde detrás',
        c: 'Significa usar solo objetivos gran angular',
        d: 'Es idéntico al flash cobra plano sobre la cámara',
      },
      explanation:
        'El short lighting pone más sombra hacia la cámara — esquema clásico favorecedor para muchos rostros.',
      imageAlt: 'Retrato masculino con clave limpia y relleno suave',
      imageCredit: unsplashCredit,
    },
    'pl-16': {
      text: 'Retrato a contraluz: quieres el rostro legible Y un rim brillante. ¿Enfoque de exposición sensato?',
      answers: {
        a: 'Exponer para el rostro (o añadir relleno/flash), aceptar o esculpir el rim claro',
        b: 'Medir solo el cielo y aplastar siempre el rostro a negro',
        c: 'Desactivar toda medición y apostar por ISO 25600',
        d: 'Usar la apertura más pequeña y el obturador más lento en interior',
      },
      explanation:
        'Protege primero el rostro; el rim es un bonus que puedes rellenar o asumir como alta luz.',
    },
    'pl-17': {
      text: 'Beauty dish dura vs gran softbox cerca del rostro — ¿diferencia típica?',
      answers: {
        a: 'Beauty dish = contraste/especular más punchy; gran softbox = envoltura más suave',
        b: 'Son ópticamente idénticas a cualquier distancia',
        c: 'Las softbox siempre crean sombras de nariz más duras',
        d: 'Las beauty dishes solo funcionan bajo el agua',
      },
      explanation:
        'Tamaño/distancia y diseño del modificador cambian lo especular — no solo «claro vs oscuro».',
      imageAlt: 'Retrato fashion de cuerpo entero — dibujo de luz en la silueta',
      imageCredit: unsplashCredit,
    },
    'pl-18': {
      text: '¿Qué hábitos ayudan a mantener tonos de piel creíbles bajo luz de retrato mixta?',
      answers: {
        a: 'Ajustar / gelatinar las luces hacia un plan de balance coherente',
        b: 'Comprobar una carta gris o un neutro conocido cuando las dominantes se pelean',
        c: 'Siempre max magenta y amarillo «para el calor» a ciegas',
        d: 'Ignorar el histograma porque los retratos nunca se queman',
      },
      explanation:
        'Las fuentes mixtas exigen un plan de WB; las referencias ganan a la saturación a ojo.',
    },
    'pl-19': {
      text: 'Un retrato ambiental significa sobre todo…',
      answers: {
        a: 'Mostrar a la persona en un contexto que diga algo de ella',
        b: 'Solo un fondo de estudio sin ningún accesorio',
        c: 'Una macro de ojo y nada más',
        d: 'Paisajes aéreos sin personas',
      },
      explanation:
        'El entorno sostiene la historia — trabajo, casa, calle — no solo un recorte de cabeza.',
      imageAlt: 'Retrato ambiental con luz de ventana desde la izquierda de cámara',
      imageCredit: unsplashCredit,
    },
    'pl-20': {
      text: 'Mito: «Más luces = siempre un mejor retrato.» ¿Mejor matiz?',
      answers: {
        a: 'Una clave bien colocada (más relleno opcional) gana a fuentes múltiples que se pelean',
        b: 'Hay que usar al menos cinco flashes para cada retrato',
        c: 'La luz natural es ilegal en estudio',
        d: 'La luz de retrato solo existe dentro de las máscaras de Lightroom',
      },
      explanation:
        'Una luz simple e intencional se lee; cada luz de más necesita un rol o ensucia el rostro.',
      imageAlt: 'Retrato dramático con luz lateral más dura y sombras profundas',
      imageCredit: unsplashCredit,
    },
    'pl-21': {
      text: 'Una luz de pelo / rim detrás del sujeto sirve sobre todo a…',
      answers: {
        b: 'Sustituir por completo la luz clave',
        c: 'Forzar cada retrato a luz belleza plana',
        d: 'Cambiar solo el balance de blancos en las sombras',
        a: 'Separar pelo/hombros de un fondo oscuro y añadir polish',
      },
      explanation:
        'Rim/pelo esculpen la separación; rara vez sustituyen una clave de verdad.',
      imageAlt: 'Rim light golden hour envolviendo a un sujeto de retrato',
      imageCredit: unsplashCredit,
    },
    'pl-22': {
      text: 'La luz belleza «clamshell» asocia típicamente…',
      answers: {
        b: 'Dos rim duros sin ninguna luz frontal',
        c: 'Solo un speedlight desnudo en cámara apuntando al techo para siempre',
        d: 'Una sola gelatina roja detrás del sujeto como única fuente',
        a: 'Una clave suave arriba + un relleno/reflector más débil bajo la línea de la barbilla',
      },
      explanation:
        'El clamshell envuelve luz suave para rostros belleza / comercial limpio.',
    },
    'pl-23': {
      text: 'Sujeto con ojos hundidos bajo el ala de un sombrero. ¿Primer correctivo de luz?',
      answers: {
        b: 'Solo aplastar más los negros para que desaparezcan las órbitas',
        c: 'Disparar siempre a f/22 de frente al sol de mediodía',
        d: 'Desactivar el AF y esperar catchlights',
        a: 'Subir el relleno / bounce / bajar el ángulo de clave para que los ojos capten luz',
      },
      explanation:
        'El oficio del retrato prioriza ojos legibles — levanta las órbitas antes del drama estilizado.',
    },
    'pl-24': {
      text: 'El short lighting (vs broad) significa generalmente…',
      answers: {
        b: 'La clave solo ilumina el fondo ciclorama',
        c: 'No se usa ninguna luz clave',
        d: 'El objetivo es siempre más gran angular que 24 mm',
        a: 'La clave ilumina el lado del rostro girado lejos de la cámara — a menudo adelgaza',
      },
      explanation:
        'El short lighting pone la sombra hacia la cámara — un esquema clásico favorecedor.',
    },
    'pl-25': {
      text: 'Ventana + practicals de tungsteno mezclados ensucian la piel. ¿Mejor hábito en set?',
      answers: {
        b: 'Siempre balance automático e ignorar las luces de la habitación',
        c: 'Subir Claridad a +100 para «arreglar» las dominantes',
        d: 'Pasar a verde neón para convertir las dominantes en estilo',
        a: 'Elegir una temperatura dominante (gelatina/practicals) o separar las fuentes',
      },
      explanation:
        'Los CCT mezclados pelean en la piel; elige una dominante y manténla.',
      imageAlt: 'Retrato ambiental con ventana — hábitos de luz mixta',
      imageCredit: unsplashCredit,
    },
    'pl-26': {
      text: 'Mito: «Las softbox eliminan todas las sombras.» ¿Mejor matiz?',
      answers: {
        b: 'Las softbox eliminan cualquier necesidad de relleno para siempre',
        c: 'Las softbox solo funcionan al aire libre al mediodía',
        d: 'Las softbox obligan a que desaparezca cada catchlight',
        a: 'La luz suave sigue teniendo dirección — tamaño/distancia cambian la suavidad, no la física',
      },
      explanation:
        'Los modificadores suavizan los bordes; no borran el modelado direccional.',
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
console.log(`portrait-light: added ${added} LocalizedString.es fields`);

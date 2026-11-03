#!/usr/bin/env node
/**
 * Vague 1.78 — add LocalizedString.es for pack marques-photo (194 LS).
 * Idempotent: skips fields that already have non-empty es.
 * Vocab aligns with guides/histoire-photo article.es
 * (marcas · cámaras · Leica · Nikon · Canon · Sony · Hasselblad · historia · industria · hitos · sistemas).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'marques-photo');
if (!pack) throw new Error('marques-photo not found');

const unsplash = 'Unsplash — uso libre (licencia Unsplash)';

const es = {
  title: 'Historia de las marcas',
  description:
    'Canon, Nikon, Leica, Sony y compañía — orígenes y sistemas icónicos, al estilo cultura Pixfan.',
  questions: {
    'marque-01': {
      text: '¿En qué país se fundó Canon en los años 1930?',
      answers: {
        b: 'Alemania',
        a: 'Japón',
        c: 'Estados Unidos',
        d: 'Francia',
      },
      explanation:
        'Canon nació en Tokio en 1934 como Precision Optical Instruments Laboratory (luego Canon).',
      imageAlt: 'Cuerpo de cámara clásico',
      imageCredit: unsplash,
    },
    'marque-02': {
      text: 'El primer telemetro 35 mm de producción de Canon (mediados de los años 1930) se conoce habitualmente como…',
      answers: {
        c: 'EOS-1 (réflex profesional)',
        b: 'PowerShot G1 (compacta)',
        a: 'Hansa Canon (1936)',
        d: 'IXUS 100 (compacta digital)',
      },
      explanation:
        'Tras el prototipo Kwanon, la Hansa Canon (1936) fue la primera cámara Canon 35 mm vendida a gran escala.',
      imageAlt: 'Equipo fotográfico vintage',
      imageCredit: unsplash,
    },
    'marque-03': {
      text: '¿Qué significan las siglas EOS del sistema Canon?',
      answers: {
        d: 'Electronic Optical Sensor (sensor óptico electrónico)',
        a: 'Electro-Optical System (sistema electroóptico)',
        b: 'European Order Specification (especificación de pedido europea)',
        c: 'Exposure Only Setting (ajuste solo de exposición)',
      },
      explanation:
        'EOS = Electro-Optical System, lanzado en 1987 con objetivos EF de autofoco.',
      imageAlt: 'Cámara estilo réflex digital',
      imageCredit: unsplash,
    },
    'marque-04': {
      text: 'La montura EF de Canon (era EOS) destaca en el lanzamiento por introducir…',
      answers: {
        b: 'Solo avance de película por tornillo',
        c: 'Únicamente obturadores de láminas de formato medio',
        a: 'Comunicación totalmente electrónica objetivo–cuerpo (sin palanca mecánica de diafragma)',
        d: 'Contactos solo de flash, sin motores de enfoque',
      },
      explanation:
        'EF eliminó el acoplamiento mecánico de diafragma; los motores de enfoque viven en el objetivo y hablan electrónicamente con el cuerpo.',
      imageAlt: 'Detalle de un objetivo',
      imageCredit: unsplash,
    },
    'marque-05': {
      text: 'Las raíces ópticas de Nikon se remontan a qué año (Nippon Kogaku Kogyo)?',
      answers: {
        c: 'año 1959',
        b: 'año 1987',
        d: 'año 2000',
        a: 'año 1917',
      },
      explanation:
        'Nippon Kogaku Kogyo se fundó en 1917; el nombre de marca Nikon llegó después para cámaras y objetivos.',
      imageAlt: 'Documentos históricos y libros',
      imageCredit: unsplash,
    },
    'marque-06': {
      text: '¿Qué cámara Nikon de 1959 ayudó a definir el sistema réflex 35 mm profesional moderno?',
      answers: {
        a: 'Nikon F (sistema SLR 1959)',
        b: 'Nikon Coolpix P900 (bridge)',
        c: 'Nikon 1 J1 (mirrorless 1)',
        d: 'Nikon KeyMission 360 (acción 360°)',
      },
      explanation:
        'La Nikon F (1959) ofrecía un sistema SLR profesional modular, con visores intercambiables y una montura F durable.',
      imageAlt: 'Cámara sobre una superficie',
      imageCredit: unsplash,
    },
    'marque-07': {
      text: 'La montura F de Nikon es notable en la historia de la industria sobre todo porque…',
      answers: {
        d: 'Solo funciona con respaldos de formato medio',
        a: 'Siguió siendo el núcleo SLR/DSLR durante décadas, con amplia compatibilidad hacia atrás',
        b: 'Se abandonó al cabo de un año',
        c: 'Era exclusiva de cámaras de carrete compactas',
      },
      explanation:
        'Introducida con la Nikon F, la montura F acompañó generaciones de SLR de película y DSLR (con matices en tipos AF más nuevos).',
      imageAlt: 'Primer plano de un cuerpo de cámara',
      imageCredit: unsplash,
    },
    'marque-08': {
      text: 'Antes de «Nikon», muchos objetivos tempranos de la compañía se comercializaban como…',
      answers: {
        b: 'Rollei (otra marca)',
        c: 'Solo Hasselblad',
        a: 'Nikkor (marca de objetivos)',
        d: 'Contax G (sistema distinto)',
      },
      explanation:
        'Nikkor era (y sigue siendo) la marca de objetivos; «Nikon» se consolidó como nombre de cámaras tras la Segunda Guerra Mundial.',
      imageAlt: 'Barril de un objetivo',
      imageCredit: unsplash,
    },
    'marque-09': {
      text: '¿A quién se atribuye habitualmente el concepto de la Leica 35 mm compacta en Ernst Leitz?',
      answers: {
        c: 'George Eastman (Kodak)',
        a: 'Oskar Barnack (Leitz / Ur-Leica)',
        b: 'Edwin Land (Polaroid)',
        d: 'Steven Sasson (Kodak digital)',
      },
      explanation:
        'La Ur-Leica de Oskar Barnack desembocó en la Leica I (1925), popularizando la fotografía fija en 35 mm.',
      imageAlt: 'Equipo fotográfico vintage',
      imageCredit: unsplash,
    },
    'marque-10': {
      text: 'La primera Leica de producción comercial (Leica I / modelo A) llegó al mercado hacia…',
      answers: {
        d: 'año 1969',
        b: 'año 1947',
        c: 'año 1987',
        a: 'año 1925',
      },
      explanation:
        'La Leica I se presentó en la Feria de Primavera de Leipzig de 1925 — un hito para las cámaras 35 mm portátiles.',
      imageAlt: 'Cámara clásica',
      imageCredit: unsplash,
    },
    'marque-11': {
      text: 'El sistema telemetro de montura M de Leica se introdujo en qué década?',
      answers: {
        a: 'Años 1950 (Leica M3, 1954)',
        b: 'Años 1970',
        c: 'Años 1990',
        d: 'Años 2010',
      },
      explanation:
        'La Leica M3 (1954) lanzó la bayoneta M, aún central en los telemetros Leica.',
      imageAlt: 'Escena urbana — cultura telemetro',
      imageCredit: unsplash,
    },
    'marque-12': {
      text: 'Las cámaras Leica se asocian históricamente sobre todo a qué tipo de fotografía?',
      answers: {
        b: 'Solo carcasas subacuáticas',
        c: 'Solo cámaras de estudio de gran formato',
        a: 'Calle / reportaje silencioso con telemetro',
        d: 'Solo HDR computacional de smartphone',
      },
      explanation:
        'Los telemetros M compactos y silenciosos se convirtieron en iconos de la calle y el reportaje (p. ej. muchos fotógrafos Magnum).',
      imageAlt: 'Atmósfera de calle urbana',
      imageCredit: unsplash,
    },
    'marque-13': {
      text: 'Los orígenes de Sony (Tokyo Tsushin Kogyo) datan de qué año?',
      answers: {
        c: 'año 1917',
        a: 'año 1946',
        b: 'año 1934',
        d: 'año 1925',
      },
      explanation:
        'Tokyo Tsushin Kogyo se fundó en 1946 y más tarde se renombró Sony — primero electrónica, después cámaras.',
      imageAlt: 'Electrónica y espacio de trabajo',
      imageCredit: unsplash,
    },
    'marque-14': {
      text: 'Las cámaras intercambiables α (Alpha) de Sony crecieron en parte a partir de qué linaje?',
      answers: {
        d: 'Solo cámaras instantáneas Polaroid',
        b: 'Solo cámaras de acción GoPro',
        a: 'Herencia SLR de montura A de Minolta / Konica Minolta',
        c: 'Solo cuerpos de película con rosca Leica',
      },
      explanation:
        'Sony entró en las ILC tras hacerse con el negocio de cámaras de Konica Minolta, continuando la línea de montura A antes del mirrorless E-mount.',
      imageAlt: 'Cuerpo de cámara moderno',
      imageCredit: unsplash,
    },
    'marque-15': {
      text: '¿Qué línea Sony de 2013 se acredita ampliamente por popularizar el mirrorless full-frame?',
      answers: {
        b: 'Solo Sony Cyber-shot DSC-RX0',
        a: 'Serie Sony α7 (A7)',
        c: 'Cámaras Sony Mavica de disquete',
        d: 'Solo Sony Handycam Hi8',
      },
      explanation:
        'Las α7 / α7R de 2013 llevaron cuerpos mirrorless full-frame relativamente compactos a un público amplio.',
      imageAlt: 'Cámara compacta en contexto de mano',
      imageCredit: unsplash,
    },
    'marque-16': {
      text: 'La montura E mirrorless de Sony se asoció primero a qué clase de formato de sensor?',
      answers: {
        c: 'Solo gran formato 8×10',
        b: 'Solo película APS-H',
        a: 'APS-C (NEX / α××00), luego ampliada a full-frame',
        d: 'Solo formato medio 6×6',
      },
      explanation:
        'La montura E nació en cámaras NEX APS-C; los cuerpos full-frame α7 usaron después la misma familia de montura.',
      imageAlt: 'Cámara de objetivos intercambiables',
      imageCredit: unsplash,
    },
    'marque-17': {
      text: 'Fujifilm es históricamente más conocida primero como empresa de…',
      answers: {
        b: 'Solo chipsets para smartphones',
        a: 'Película fotográfica y materiales de imagen',
        c: 'Solo motores de coche',
        d: 'Solo máquinas de escribir',
      },
      explanation:
        'Fuji Photo Film Co. consolidó su nombre en película y química de imagen antes de las cámaras digitales serie X.',
      imageAlt: 'Atmósfera de archivo / era de la película',
      imageCredit: unsplash,
    },
    'marque-18': {
      text: 'Las cámaras intercambiables modernas serie X de Fujifilm se asocian especialmente a…',
      answers: {
        d: 'Solo respaldos de película de formato medio para Hasselblad',
        c: 'Solo carcasas subacuáticas Nikonos',
        a: 'Cuerpos mirrorless APS-C y looks distintivos de simulación de película',
        b: 'Solo portaplanos de película 4×5',
      },
      explanation:
        'Las líneas X-Pro / X-T popularizaron el mirrorless APS-C con simulaciones JPEG ancladas en la herencia fílmica de Fuji.',
      imageAlt: 'Cámara lista para disparar',
      imageCredit: unsplash,
    },
    'marque-19': {
      text: 'La clásica Olympus OM-1 (años 1970) es famosa por ser…',
      answers: {
        b: 'El primer respaldo digital de formato medio',
        a: 'Un sistema SLR 35 mm profesional compacto y ligero',
        c: 'Solo una cámara desechable de un solo uso',
        d: 'Una cámara de cine IMAX',
      },
      explanation:
        'El sistema OM (OM-1, 1972) redujo el tamaño de la SLR profesional sin renunciar a objetivos y accesorios intercambiables.',
      imageAlt: 'Ambiente de sistema de cámara vintage',
      imageCredit: unsplash,
    },
    'marque-20': {
      text: 'Micro Four Thirds (usado por Olympus y Panasonic) es sobre todo un estándar para…',
      answers: {
        c: 'Solo cables de sincronización de flash',
        d: 'Solo objetivos de ampliadora de cuarto oscuro',
        a: 'Cámaras mirrorless con montura compartida y sensores tamaño Four Thirds',
        b: 'Solo cartuchos de película 35 mm',
      },
      explanation:
        'm4/3 (anunciado en 2008) permite a Olympus y Panasonic compartir objetivos en cuerpos mirrorless compactos.',
      imageAlt: 'Cámara compacta de objetivos intercambiables',
      imageCredit: unsplash,
    },
    'marque-21': {
      text: '¿Qué emparejamiento marca → hito histórico conocido es correcto?',
      answers: {
        b: 'Leica → primer smartphone CMOS de consumo (2007)',
        a: 'Nikon F (1959) → sistema SLR 35 mm profesional modular',
        c: 'Canon → invención del daguerrotipo (1839)',
        d: 'Sony → prototipo Ur-Leica (1913)',
      },
      explanation:
        'La Nikon F es el hito clásico del sistema SLR profesional; el daguerrotipo y la Ur-Leica pertenecen a inventores anteriores, no a esas marcas.',
      imageAlt: 'Silueta de cámara clásica',
      imageCredit: unsplash,
    },
    'marque-22': {
      text: '¿Qué marcas fueron líderes tempranos de la cultura telemetro 35 mm (antes de las DSLR)?',
      answers: {
        a: 'Leica (telemetros 35 mm)',
        b: 'Canon (primeros telemetros)',
        c: 'Solo GoPro',
        d: 'Solo drones DJI',
      },
      explanation:
        'Leica definió el telemetro 35 mm; las primeras cámaras Canon también fueron telemetros antes del éxito SLR de Canon.',
      imageAlt: 'Equipo de la era telemetro vintage',
      imageCredit: unsplash,
    },
    'marque-23': {
      text: 'En el auge mirrorless de los años 2010, ¿qué afirmación es históricamente exacta?',
      answers: {
        d: 'Las SLR de película se inventaron después del mirrorless full-frame',
        b: 'Ninguna marca fabricó nunca mirrorless APS-C',
        a: 'Sony popularizó el mirrorless full-frame con la línea α7, mientras Fuji crecía en APS-C serie X y Olympus impulsaba Micro Four Thirds',
        c: 'Solo Leica vendió cámaras mirrorless en esa década',
      },
      explanation:
        'Cada marca apostó por un formato distinto: Sony FF E-mount, Fuji APS-C X, Olympus/Panasonic m4/3 — todo parte del giro mirrorless.',
      imageAlt: 'Cuerpo de cámara contemporáneo',
      imageCredit: unsplash,
    },
    'marque-24': {
      text: '«EOS», «montura F» y «montura M» son ejemplos de qué en la historia de las marcas?',
      answers: {
        c: 'Solo filtros de redes sociales',
        a: 'Sistemas de cámara / monturas de objetivo centrales que definieron el ecosistema de cada marca',
        b: 'Solo químicas de batería',
        d: 'Solo tamaños de papel de impresora',
      },
      explanation:
        'Los nombres de montura y sistema (Canon EOS/EF, Nikon F, Leica M) son las plataformas longevas sobre las que los fotógrafos construyen su equipo.',
      imageAlt: 'Cultura de montura / cristal óptico',
      imageCredit: unsplash,
    },
  },
};

function setEs(ls, value, { force = false } = {}) {
  if (!ls || typeof ls !== 'object') return 0;
  if (!force && ls.es && String(ls.es).trim()) return 0;
  if (!value || !String(value).trim()) {
    throw new Error(`Missing es for: ${JSON.stringify(ls)}`);
  }
  if (force && ls.es === value) return 0;
  ls.es = value;
  return 1;
}

const FORCE = process.argv.includes('--force');

const opts = { force: FORCE };
let added = 0;
added += setEs(pack.title, es.title, opts);
added += setEs(pack.description, es.description, opts);

for (const q of pack.questions) {
  const t = es.questions[q.id];
  if (!t) throw new Error(`No translation for ${q.id}`);
  added += setEs(q.text, t.text, opts);
  if (q.explanation) added += setEs(q.explanation, t.explanation, opts);
  if (q.imageAlt) added += setEs(q.imageAlt, t.imageAlt, opts);
  if (q.imageCredit) added += setEs(q.imageCredit, t.imageCredit, opts);
  for (const a of q.answers) {
    const av = t.answers[a.id];
    if (!av) throw new Error(`No answer es for ${q.id}/${a.id}`);
    added += setEs(a.text, av, opts);
  }
}

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`marques-photo: added ${added} LocalizedString.es fields`);

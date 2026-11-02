#!/usr/bin/env node
/**
 * Vague 1.75 — add LocalizedString.es for pack smartphone (230 LS).
 * Idempotent: skips fields that already have non-empty es.
 * Vocab aligns with guides/photo-smartphone article.es
 * (luz · HDR · modo pro / AE-AF lock · zoom digital · flash frontal · retoque).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'smartphone');
if (!pack) throw new Error('smartphone not found');

const unsplash = 'Unsplash — uso libre (licencia Unsplash)';
const unsplashShort = 'Foto: Unsplash';

const es = {
  title: 'Foto con smartphone',
  description:
    'Modo noche, fotografía computacional, composición y retoque en el móvil.',
  questions: {
    'phone-1': {
      text: '¿En qué se basa principalmente la «fotografía computacional»?',
      answers: {
        b: 'Solo en un zoom óptico más grande',
        a: 'En software que combina varias exposiciones / fotogramas',
        c: 'En desactivar el autofoco',
        d: 'En disparar exclusivamente en blanco y negro',
      },
      explanation:
        'Los móviles apilan fotogramas, los alinean y reconstruyen detalle / rango dinámico con algoritmos.',
      imageAlt: 'Smartphone sobre un escritorio',
      imageCredit: unsplash,
    },
    'phone-2': {
      text: '¿Por qué el modo noche puede salir borroso si mueves el teléfono?',
      answers: {
        d: 'El flash dispara de forma continua',
        b: 'El modo noche desactiva la estabilización de imagen',
        a: 'Usa una captura larga de varios fotogramas que necesita estabilidad',
        c: 'El ISO queda bloqueado en 50',
      },
      explanation:
        'El modo noche fusiona varios fotogramas a lo largo del tiempo; el movimiento entre fotogramas suaviza el resultado.',
      imageAlt: 'Cámara del teléfono de noche',
      imageCredit: unsplash,
    },
    'phone-3': {
      text: 'Tocar para enfocar en la mayoría de cámaras de móvil también suele fijar…',
      answers: {
        b: 'El balance de blancos a fluorescente',
        c: 'El zoom óptico a 10×',
        d: 'La velocidad de obturación a 1/8000 s',
        a: 'La exposición de esa zona',
      },
      explanation:
        'El bloqueo AE/AF al tocar suele medir y enfocar donde tocas.',
      imageAlt: 'Persona sosteniendo un smartphone',
      imageCredit: unsplash,
    },
    'phone-4': {
      text: '¿Qué hábitos suelen mejorar las fotos con el móvil?',
      answers: {
        d: 'Preferir luz natural cuando sea posible',
        b: 'Sujetar con las dos manos / apoyarte',
        a: 'Limpiar el objetivo',
        c: 'Usar siempre el zoom digital al máximo',
      },
      explanation:
        'Óptica limpia, estabilidad y buena luz vencen al zoom digital extremo.',
      imageAlt: 'Interfaz de la cámara del smartphone',
      imageCredit: unsplash,
    },
    'phone-5': {
      text: 'El zoom digital principalmente…',
      answers: {
        d: 'Siempre mejora la nitidez',
        a: 'Recorta la imagen (a menudo perdiendo calidad)',
        c: 'Aumenta el tamaño del sensor',
        b: 'Mueve elementos de cristal como un objetivo de réflex',
      },
      explanation:
        'El zoom óptico verdadero cambia la ampliación con óptica; el zoom digital recorta / remuestrea.',
      imageAlt: 'Primer plano de la cámara de un smartphone',
      imageCredit: unsplash,
    },
    'phone-6': {
      text: 'El modo retrato / «bokeh» en móviles suele crear el desenfoque mediante…',
      answers: {
        b: 'Abrir siempre un diafragma mecánico a f/1.0',
        a: 'Estimación de profundidad + desenfoque por software',
        d: 'Forzar la compresión JPEG',
        c: 'Calentar el sensor',
      },
      explanation:
        'Cámaras duales / LiDAR / ML segmentan el sujeto y simulan una profundidad de campo reducida.',
      imageAlt: 'Objetivo de cámara con poca profundidad de campo',
      imageCredit: unsplash,
    },
    'phone-7': {
      text: 'El HDR en un móvil es más útil cuando…',
      answers: {
        c: 'Quieres más desenfoque de movimiento',
        a: 'El contraste de la escena es muy alto (cielo brillante + suelo oscuro)',
        b: 'Disparas una pared gris uniforme a la sombra',
        d: 'El ISO debe quedarse en 25600',
      },
      explanation:
        'El HDR fusiona exposiciones para conservar detalle en luces y sombras.',
      imageAlt: 'Paisaje con cielo brillante y primer plano oscuro',
      imageCredit: unsplash,
    },
    'phone-8': {
      text: 'Disparar en RAW / modo Pro en un móvil te da sobre todo…',
      answers: {
        b: 'Archivos más pequeños que HEIC/JPEG',
        c: 'Filtros automáticos de Instagram',
        a: 'Más flexibilidad al editar (exposición, WB, detalle)',
        d: 'Autofoco garantizado más nítido',
      },
      explanation:
        'El RAW conserva más datos lineales antes del procesado agresivo del móvil.',
      imageAlt: 'UI de la cámara del móvil — territorio modo RAW / Pro',
      imageCredit: unsplash,
    },
    'phone-9': {
      text: '¿Qué ayuda a reducir el desenfoque por temblor en un móvil?',
      answers: {
        d: 'Zoom digital al máximo mientras caminas',
        c: 'Un trípode pequeño o apoyarte en una pared',
        a: 'Estabilización óptica / electrónica',
        b: 'Obturación más rápida (más luz o ISO más alto)',
      },
      explanation:
        'Estabilización, exposiciones más cortas y apoyo ayudan; caminar + zoom perjudica.',
      imageAlt: 'Manos sujetando un smartphone con firmeza',
      imageCredit: unsplash,
    },
    'phone-10': {
      text: 'Los objetivos ultra gran angular del móvil suelen mostrar…',
      answers: {
        b: 'Ningún cambio de perspectiva',
        a: 'Más distorsión en los bordes / esquinas estiradas',
        d: 'Uso obligatorio del flash',
        c: 'Siempre menos ruido que la cámara principal',
      },
      explanation:
        'Las focales cortas exageran la perspectiva; los bordes pueden verse deformados.',
      imageAlt: 'Perspectiva ultra gran angular del móvil estirando una escena',
      imageCredit: unsplash,
    },
    'phone-11': {
      text: 'Para una luz más plana y uniforme en un rostro al aire libre, prefieres…',
      answers: {
        c: 'Flash directo como única luz al mediodía',
        b: 'Sol duro de mediodía desde arriba',
        d: 'Disparar contra una ventana brillante sin compensación de exposición',
        a: 'Sombra abierta o cielo nublado',
      },
      explanation:
        'La luz suave y difusa reduce las sombras duras en los rostros.',
      imageAlt: 'Persona fotografiando al aire libre con un móvil',
      imageCredit: unsplash,
    },
    'phone-12': {
      text: 'Las Live Photos / fotos en movimiento se entienden mejor como…',
      answers: {
        a: 'Un clip de vídeo corto alrededor del fotograma fijo',
        c: 'Siempre un RAW DNG',
        b: 'Solo una foto fija con más megapíxeles',
        d: 'Un cosido panorámico',
      },
      explanation:
        'Capturan instantes antes/después de pulsar el obturador como movimiento.',
    },
    'phone-13': {
      text: 'Las líneas de cuadrícula (regla de tercios) en la cámara del móvil te ayudan a…',
      answers: {
        d: 'Forzar el modo noche',
        b: 'Aumentar los megapíxeles',
        c: 'Desactivar el autofoco',
        a: 'Componer y mantener los horizontes nivelados',
      },
      explanation:
        'Las superposiciones guían el encuadre sin cambiar la tecnología de exposición.',
      imageAlt: 'Móvil sujetado para un encuadre cuidadoso alineado a la cuadrícula',
      imageCredit: unsplash,
    },
    'phone-14': {
      text: 'Antes de compartir ampliamente una foto del móvil, conviene considerar…',
      answers: {
        a: 'Si conviene eliminar los metadatos de ubicación',
        d: 'Revisar el recorte / tamaño de exportación para la plataforma',
        c: 'Subir siempre solo el RAW sin editar',
        b: 'Si rostros / privacidad necesitan consentimiento',
      },
      explanation:
        'La privacidad y las exportaciones listas para la plataforma importan; compartir solo RAW rara vez es necesario.',
    },
    'phone-15': {
      text: 'El modo macro en móviles suele funcionar mejor cuando…',
      answers: {
        b: 'Estás a 20 metros de distancia',
        d: 'Solo disparas de noche sin luz',
        c: 'Desactivas todo el foco',
        a: 'Te acercas y sujetas con firmeza (la DOF es minúscula)',
      },
      explanation:
        'El foco cercano implica poca profundidad de campo; la estabilidad y la luz ayudan.',
      imageAlt: 'Detalle cercano de comida — territorio macro del móvil',
      imageCredit: unsplash,
    },
    'phone-16': {
      text: 'Un inconveniente habitual del afilado / reducción de ruido agresivos en el móvil es…',
      answers: {
        c: 'Mejor zoom óptico',
        b: 'Sensores más grandes',
        d: 'Salida RAW obligatoria',
        a: 'Piel con aspecto plástico / detalle fino emborronado',
      },
      explanation:
        'El procesado agresivo puede borrar textura mientras se ve «limpio» en pantallas pequeñas.',
    },
    'phone-17': {
      text: 'En vídeo con el móvil, bloquear exposición/AF (bloqueo AE/AF) ayuda cuando…',
      answers: {
        d: 'Desactivas el micrófono',
        a: 'El brillo bombearía al mover el encuadre',
        b: 'Quieres que el móvil reenfoque cada fotograma al azar',
        c: 'Solo disparas fotos fijas',
      },
      explanation:
        'El bloqueo detiene la medición continua y la caza de foco durante un paneo.',
    },
    'phone-18': {
      text: 'Pasos útiles de retoque en el móvil antes de publicar incluyen…',
      answers: {
        c: 'Subir siempre la saturación al máximo',
        d: 'Revisar el resultado en una pantalla calibrada o neutra si es posible',
        a: 'Recortar / enderezar',
        b: 'Ajustes modestos de exposición y contraste',
      },
      explanation:
        'Ediciones sutiles y un recorte sensato ganan a los filtros extremos.',
    },
    'phone-19': {
      text: 'Disparar a contraluz con el móvil suele necesitar…',
      answers: {
        b: 'Apagar la app de la cámara',
        d: 'Fijar el balance de blancos solo a tungsteno',
        a: 'Compensación de exposición / HDR / proteger el objetivo del flare',
        c: 'Zoom digital 10× obligatorio',
      },
      explanation:
        'Las escenas a contraluz queman las luces; el HDR y una exposición cuidadosa ayudan.',
      imageAlt: 'Disparo hacia luz brillante — control de sol / flare en el móvil',
      imageCredit: unsplash,
    },
    'phone-20': {
      text: 'Comparados con una cámara de sensor grande, los sensores del móvil son pequeños, así que con poca luz…',
      answers: {
        b: 'Siempre superan al full-frame sin software',
        d: 'Nunca usan estabilización',
        a: 'Suelen depender más del apilado multi-fotograma y del procesado a ISO alto',
        c: 'No pueden registrar color',
      },
      explanation:
        'Los fotositios pequeños recogen menos luz; el apilado computacional lo compensa.',
    },
    'phone-21': {
      text: 'El modo retrato desenfoca una farola «pegada» a tu sujeto. ¿Por qué?',
      answers: {
        a: 'El mapa de profundidad del móvil segmenta mal los bordes solapados',
        c: 'El ISO no puede superar 200 cerca del metal',
        b: 'Las farolas están siempre al infinito en el EXIF',
        d: 'El polarizador está atascado',
      },
      explanation:
        'El bokeh computacional es una estimación. Los bordes solapados confunden la máscara de profundidad: apártate o mueve al sujeto.',
      imageAlt: 'Fotografía con smartphone',
      imageCredit: unsplash,
    },
    'phone-22': {
      text: 'Para Instagram Stories / Reels (vertical 9:16), ¿dónde suelen ir mejor los rostros clave?',
      answers: {
        a: 'Justo en el borde superior bajo el reloj de la UI',
        b: 'En la franja central más segura, lejos del cromo de UI arriba y abajo',
        c: 'Solo en la esquina inferior izquierda para siempre',
        d: 'Al revés para pelear con el algoritmo',
      },
      explanation:
        'La UI se come arriba y abajo. Mantén los rostros en la zona central segura.',
      imageAlt: 'Pantalla vertical del móvil — encuadre Stories / Reels 9:16',
      imageCredit: unsplash,
    },
    'phone-23': {
      text: 'El modo noche se ve suave porque te moviste. ¿Qué pasa?',
      answers: {
        d: 'El GPS debe estar apagado para la nitidez',
        a: 'El móvil apila varios fotogramas; el movimiento rompe la alineación',
        c: 'El obturador está atascado a 1/8000 s',
        b: 'El modo noche desactiva el objetivo por completo',
      },
      explanation:
        'El modo noche es fotografía computacional multi-fotograma. Quédate quieto (o apóyate) mientras trabaja.',
      imageAlt: 'Luces de ciudad de noche — estabilidad del modo noche del móvil',
      imageCredit: unsplash,
    },
    'phone-24': {
      text: 'Ciudad de noche: el móvil insiste en ultra gran angular. ¿Por qué pasar a 1×?',
      answers: {
        a: 'El ultra gran angular siempre tiene el mejor sensor',
        b: 'La cámara principal suele recoger más luz y detalle más limpio',
        c: '1× desactiva el modo noche para siempre',
        d: 'El ultra gran angular no puede enfocar al aire libre',
      },
      explanation:
        'Los sensores principales suelen ser más grandes: mejores con poca luz que los chips minúsculos del ultra gran angular.',
      imageAlt: 'Fotografía con smartphone de noche',
      imageCredit: unsplash,
    },
    'phone-25': {
      text: 'Mito: «el desenfoque del modo retrato es igual que un objetivo luminoso». ¿Matiz?',
      answers: {
        a: 'Idéntico ópticamente en todos los casos',
        b: 'El desenfoque computacional puede parecerse, pero puede emborronar pelo, gafas o bordes',
        c: 'El modo retrato solo funciona bajo el agua',
        d: 'Los objetivos luminosos no pueden desenfocar fondos',
      },
      explanation:
        'La simulación es útil: revisa los bordes antes de confiar en ella.',
      imageAlt: 'Retrato con fondo suave — matiz del desenfoque computacional',
      imageCredit: unsplash,
    },
    'phone-26': {
      text: 'Necesitas detalle imprimible de un cartel lejano. ¿Mejor estrategia con el móvil?',
      answers: {
        a: 'Zoom digital a 20× y luego recortar otra vez',
        b: 'Usar el módulo tele óptico / de alta calidad si existe, apoyarte y disparar una ráfaga',
        c: 'Usar solo la cámara selfie',
        d: 'Apagar toda estabilización y caminar mientras disparas',
      },
      explanation:
        'Alcance óptico + estabilidad vencen a la papilla del zoom digital agresivo.',
    },
    'phone-27': {
      text: 'Modo Pro/RAW: las luces se queman aunque la vista previa se veía bien. ¿Por qué?',
      answers: {
        a: 'El RAW no puede registrar luces nunca',
        b: 'La pantalla suele mostrar una vista previa procesada; expón con el histograma / avisos de luces',
        c: 'Los móviles ignoran el ISO en modo Pro',
        d: 'Solo el HEIC provoca el recorte',
      },
      explanation:
        'Confía más en medidores e histogramas que en una vista previa aclarada de la pantalla.',
    },
    'phone-28': {
      text: 'Estás grabando un reel rápido mientras caminas. ¿Consejo de estabilización?',
      answers: {
        a: 'Sujetar el móvil a brazo completamente extendido',
        b: 'Codos pegados, caminar talón-punta y activar estabilización de vídeo / un modo de recorte suave',
        c: 'Desactivar todo recorte y correr',
        d: 'Solo grabar al revés',
      },
      explanation:
        'Mecánica corporal + estabilización digital ganan a un brazo tembloroso extendido.',
      imageAlt: 'Persona grabando con un móvil',
      imageCredit: unsplash,
    },
    'phone-29': {
      text: 'El modo noche apila fotogramas. El sujeto camina a mitad de la captura. ¿Estrategia más limpia?',
      answers: {
        a: 'Pedirle que se quede quieto, apoyar el móvil, o pasar a un modo Pro/obturación más rápida',
        b: 'Agitar más el móvil para «promediar» el movimiento',
        d: 'El modo noche siempre congela el movimiento — ignóralo',
        c: 'Forzar siempre HDR+flash juntos',
      },
      explanation:
        'Los modos noche multi-fotograma odian el movimiento. Quietud o una exposición única más rápida vencen a los fantasmas.',
      imageAlt: 'Smartphone listo para disparar',
      imageCredit: unsplashShort,
    },
    'phone-30': {
      text: 'Un selfie ultra gran angular en una habitación pequeña deforma los bordes. ¿Elección óptica más inteligente?',
      answers: {
        a: 'Quedarte en ultra gran angular y recortar después — la distorsión es gratis',
        c: 'Solo el zoom digital 10× arregla los rostros',
        d: 'Activar el modo belleza como único arreglo',
        b: 'Retroceder y usar el objetivo principal (o 2×); alejar los rostros de los bordes extremos',
      },
      explanation:
        'El estiramiento ultra gran angular es geometría, no un problema de piel. Prefiere el objetivo principal y la distancia.',
    },
    'phone-31': {
      text: '¿Qué hábitos reducen el aspecto computacional «sobreprocesado» en los móviles modernos?',
      answers: {
        a: 'Disparar con buena luz para que el móvil apile con menos agresividad',
        b: 'Preferir RAW/Pro cuando quieras una tonalidad más natural',
        c: 'Máximo HDR + máximo afilado + máximo contraste siempre',
        d: 'Edición suave; evitar apilar filtros pesados sobre JPEG ya procesados',
      },
      explanation:
        'Los móviles ya cuecen tono y detalle. Empieza más limpio y luego edita con suavidad.',
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
console.log(`smartphone: added ${added} LocalizedString.es fields`);

#!/usr/bin/env node
/**
 * Vague 1.77 — add LocalizedString.es for pack lightroom-workflow (194 LS).
 * Idempotent: skips fields that already have non-empty es.
 * Vocab aligns with guides/retouche-lightroom article.es
 * (catálogo · revelado · presets · máscaras · curva · HSL · exportación · flujo Pixfan).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'lightroom-workflow');
if (!pack) throw new Error('lightroom-workflow not found');

const unsplash = 'Unsplash — uso libre (licencia Unsplash)';
const unsplashPhoto = 'Foto: Unsplash';

const es = {
  title: 'Flujo Lightroom (ruta Pixfan)',
  description:
    'Catálogo, Revelado, máscaras y exportaciones limpias — el recorrido de retoque que Pixfan enseña para Lightroom Classic.',
  questions: {
    'lr-01': {
      text: 'En Lightroom Classic (ruta principal que enseña Pixfan), las fotos se gestionan sobre todo mediante…',
      answers: {
        b: 'Solo renombrar los archivos en el Escritorio cada día',
        c: 'Borrar el catálogo después de cada exportación',
        a: 'Un catálogo que referencia los archivos (más carpetas/colecciones)',
        d: 'Editar únicamente dentro de la Papelera',
      },
      explanation:
        'Classic está centrado en el catálogo: la base sigue los retoques mientras los archivos permanecen donde los guardas. Esa disciplina de catálogo es la base de un flujo limpio al estilo Pixfan.',
      imageAlt: 'Portátil abierto en un escritorio para una sesión de catálogo / Revelado',
      imageCredit: unsplash,
    },
    'lr-02': {
      text: 'Un retoque de Revelado no destructivo en Lightroom significa…',
      answers: {
        a: 'Que los píxeles del archivo original se reescriben al instante',
        b: 'Que los ajustes se guardan como instrucciones hasta exportar / guardar fuera',
        c: 'Que solo puedes deshacer una vez en la vida',
        d: 'Que el JPEG es obligatorio para trabajar sin destruir',
      },
      explanation:
        'Lightroom guarda una receta, no un archivo aplanado. La exportación (o la edición externa) es cuando se materializan los píxeles — mantén los masters no destructivos todo el tiempo que puedas.',
      imageAlt: 'Paneles de UI coloridos que evocan recetas de edición no destructivas',
      imageCredit: unsplash,
    },
    'lr-03': {
      text: 'Un primer chequeo sensato de Revelado tras la importación (hábito Pixfan) suele ser…',
      answers: {
        b: 'Recortar al azar sin mirar el horizonte ni la intención',
        a: 'Máxima Claridad + Deshazear antes de mirar la exposición',
        d: 'Exportar 100 copias a resolución completa de inmediato',
        c: 'Revisar histograma / recortes, fijar el balance de blancos y luego el tono global',
      },
      explanation:
        'Mira los datos, neutraliza la dominante, fija la historia de exposición global — después el trabajo local. Saltar directo a máscaras locales pesadas suele hacer perder tiempo.',
      imageAlt: 'Panel de portátil — primeros chequeos de Revelado tras importar',
      imageCredit: unsplash,
    },
    'lr-04': {
      text: 'Las copias virtuales son útiles porque…',
      answers: {
        b: 'Permiten probar looks alternativos sin archivos master extra',
        c: 'Sustituyen la necesidad de copias de seguridad',
        a: 'Duplican archivos RAW completos en disco cada vez',
        d: 'Solo funcionan con vídeo',
      },
      explanation:
        'Las copias virtuales son recetas alternativas que apuntan al mismo archivo.',
      imageAlt: 'Paneles de UI coloridos — copias virtuales para looks alternativos',
      imageCredit: unsplash,
    },
    'lr-05': {
      text: 'Las colecciones (frente a las carpetas) sirven sobre todo para…',
      answers: {
        a: 'Organizar selecciones/series sin mover archivos en disco',
        b: 'Reubicar físicamente cada archivo en una sola carpeta',
        d: 'Cambiar el firmware de la cámara',
        c: 'Borrar automáticamente las fotos rechazadas',
      },
      explanation:
        'Carpetas = ubicación en disco. Colecciones = agrupación editorial.',
      imageAlt: 'Cuaderno y documentos — colecciones frente a carpetas en disco',
      imageCredit: unsplash,
    },
    'lr-06': {
      text: 'La nitidez de exportación «Pantalla» frente a «Impresión» difiere sobre todo porque…',
      answers: {
        c: 'Son siempre idénticas',
        d: 'La nitidez de impresión borra los metadatos',
        a: 'La impresión suele necesitar más nitidez por la distancia de visión / difusión de la tinta',
        b: 'La nitidez de pantalla solo funciona en CMYK',
      },
      explanation:
        'La nitidez de salida se adapta al medio. No reutilices a ciegas los ajustes de impresión para Instagram o una galería web de cliente.',
      imageAlt: 'Muestras de diseño — nitidez de exportación Pantalla frente a Impresión',
      imageCredit: unsplash,
    },
    'lr-07': {
      text: 'Perfiles frente a presets en Lightroom moderno — ¿afirmación correcta?',
      answers: {
        a: 'Los perfiles remapean la base de color/tono; los presets aplican un conjunto de deslizadores',
        b: 'Los presets sustituyen para siempre la necesidad de perfiles',
        d: 'Son el mismo botón',
        c: 'Los perfiles solo cambian los nombres de archivo',
      },
      explanation:
        'Empieza con un perfil sensato, luego afina con presets/deslizadores — no apiles looks conflictivos a ciegas.',
      imageAlt: 'Herramientas de diseño y muestras — perfiles frente a presets',
      imageCredit: unsplash,
    },
    'lr-08': {
      text: 'Sincronizar / pegar ajustes de Revelado en una ráfaga es inteligente cuando…',
      answers: {
        d: 'Solo para JPEG, nunca RAW',
        a: 'La luz y la intención son coherentes; luego se afinan los outliers en local',
        c: 'Quieres sobrescribir retoques de manchas únicos en cada cara',
        b: 'Cada fotograma tiene WB y recorte totalmente distintos — sincroniza todo igual',
      },
      explanation:
        'Agrupa el look compartido; no sincronices a ciegas correcciones muy locales.',
      imageAlt: 'Portátil en un escritorio — sincronizando un look de Revelado compartido',
      imageCredit: unsplash,
    },
    'lr-09': {
      text: 'Enmascarar (sujeto / cielo / pincel) gana a un deslizador global cuando…',
      answers: {
        d: 'La Exposición global está prohibida en Lightroom',
        b: 'Quieres cambios idénticos en cada píxel siempre',
        a: 'Necesitas un tratamiento distinto en regiones distintas',
        c: 'Las máscaras solo funcionan en exportaciones de móvil',
      },
      explanation:
        'Lo global fija la base; las máscaras afinan la historia sin romper el resto — el orden habitual Pixfan: global → local.',
      imageAlt: 'Portátil en un escritorio que sugiere un flujo de edición digital',
      imageCredit: unsplashPhoto,
    },
    'lr-10': {
      text: 'Las Smart Previews ayudan más cuando…',
      answers: {
        c: 'Necesitas un TIFF listo para imprimir incrustado en el catálogo',
        a: 'Editas lejos de los archivos originales (viaje/portátil) con proxies más ligeros',
        b: 'Quieres borrar los masters de forma permanente y segura',
        d: 'Ya disparas solo en JPEG',
      },
      explanation:
        'Las Smart Previews son sustitutos portátiles. Sincroniza de vuelta cuando los originales se reconectan.',
    },
    'lr-11': {
      text: 'Correcciones de objetivo / Activar correcciones de perfil arreglan sobre todo…',
      answers: {
        b: 'El foco fallado por dos metros',
        a: 'Distorsión, viñeteado y a menudo aberración cromática de objetivos conocidos',
        c: 'Disputas de titularidad de copyright',
        d: 'El consumo de batería de la cámara',
      },
      explanation:
        'Los perfiles ópticos corrigen rarezas conocidas del objetivo — no errores creativos de enfoque.',
      imageAlt: 'Objetivo fijo — Correcciones de objetivo / ajustes de perfil',
      imageCredit: unsplash,
    },
    'lr-12': {
      text: 'Antes de la entrega al cliente desde Lightroom, un último pase inteligente al estilo Pixfan incluye…',
      answers: {
        c: 'Quitar siempre todos los metadatos de copyright',
        b: 'Exportar una sola vez a 72 px de ancho para todo',
        d: 'Aplicar 10 presets aleatorios apilados',
        a: 'Revisar recortes, polvo, ética de piel, soft-proof si imprimes, y el tamaño/espacio de color correctos de exportación',
      },
      explanation:
        'La entrega es oficio + profesionalidad: QA técnico (manchas, recortes, WB) y la receta de salida adecuada al brief.',
      imageAlt: 'Espacio de trabajo ordenado — vibe de checklist QA de entrega al cliente',
      imageCredit: unsplash,
    },
    'lr-13': {
      text: 'Curva de tonos frente a panel Básico — ¿cuándo preferir la curva?',
      answers: {
        d: 'Nunca — las curvas están obsoletas',
        c: 'Solo para cambiar mayúsculas/minúsculas del nombre de archivo',
        b: 'Siempre en lugar de fijar Exposición en absoluto',
        a: 'Para dar forma precisa al contraste / curvas por canal tras una exposición Básica sólida',
      },
      explanation:
        'Lo Básico te acerca; las curvas afinan contraste y color con un control más fino.',
      imageAlt: 'Tonos atmosféricos — juicio Curva de tonos frente a panel Básico',
      imageCredit: unsplash,
    },
    'lr-14': {
      text: 'Las máscaras de rango (luminancia/color) afinan una selección…',
      answers: {
        a: 'Limitando la máscara a rangos similares de brillo o tono',
        b: 'Borrando el catálogo automáticamente',
        d: 'Convirtiendo RAW a TIFF in situ',
        c: 'Cambiando la velocidad de obturación en la cámara',
      },
      explanation:
        'Tras una máscara amplia, los límites de rango mantienen los ajustes en los tonos/colores que buscas.',
    },
    'lr-15': {
      text: 'Denoise IA frente a nitidez: ¿mejor orden de pensamiento?',
      answers: {
        a: 'Limpiar el ruido primero (sobre todo a ISO alto), luego nítidar con cuidado para la salida',
        b: 'Nítidar a lo bestia primero para «crear» detalle a partir del ruido',
        d: 'Denoise solo después de subir a redes',
        c: 'Nunca aplicar denoise a retratos',
      },
      explanation:
        'Nítidar el ruido crea granulosidad. Estabiliza el archivo, luego nítida según el medio.',
      imageAlt: 'Cielo nocturno con estrellas — denoise antes de la nitidez',
      imageCredit: unsplash,
    },
    'lr-16': {
      text: 'Ruedas de Color Grading frente a HSL — ¿cuándo es Grading la mejor herramienta?',
      answers: {
        a: 'Al dar forma al mood en sombras/medios/altas luces como un grade cinematográfico',
        b: 'Solo al corregir una lectura errónea de balance de blancos',
        d: 'Al renombrar carpetas',
        c: 'Al quitar manchas de polvo',
      },
      explanation:
        'HSL apunta a tonos concretos; Grading pinta atmósfera a través de regiones tonales.',
      imageAlt: 'Paisaje de color atmosférico — atmósfera Color Grading',
      imageCredit: unsplash,
    },
    'lr-17': {
      text: 'El soft proof muestra avisos de recorte en un perfil de impresión. ¿Mejor respuesta?',
      answers: {
        b: 'Ignorar e imprimir igual el look de pantalla',
        a: 'Ajustar con soft proof activo (intento/renderizado) hasta que los colores críticos se mantengan',
        c: 'Convertir a sRGB y luego soft-proof ese mismo sRGB otra vez',
        d: 'Subir Vibrance +100 para «forzar» el gamut',
      },
      explanation:
        'El soft proof es el ensayo. Edita para el papel, no para la pantalla brillante.',
    },
    'lr-18': {
      text: '¿Qué prácticas mantienen un catálogo de Lightroom sano a largo plazo?',
      answers: {
        a: 'Copias de seguridad regulares del catálogo + backups verificados en disco de los originales',
        b: 'Guardar la única copia del catálogo en un USB que falla',
        c: 'Mover carpetas de forma coherente dentro de Lightroom para que no se rompan los enlaces',
        d: 'Optimizar el catálogo de vez en cuando / no ignorar avisos de integridad',
      },
      explanation:
        'Catálogo + masters necesitan backup. Mueve archivos a través de Lightroom; mantén la base de datos.',
      imageAlt: 'Manos sobre un portátil — hábitos de catálogo sanos a largo plazo',
      imageCredit: unsplash,
    },
    'lr-19': {
      text: 'Sincronizaste un look en lote y ves que una cara tiene una mancha clonada del polvo de otro fotograma. ¿Causa?',
      answers: {
        b: 'Lightroom siempre inventa manchas con IA',
        c: 'La nitidez de exportación crea manchas de corrección',
        d: 'Las copias virtuales desactivan las herramientas de manchas',
        a: 'La eliminación de manchas / ajustes locales se incluyeron en la sincronización — desmarca herramientas muy locales al hacer lotes',
      },
      explanation:
        'Las casillas de sincronización importan. Comparte WB/tono; mantén la corrección de manchas única por fotograma.',
    },
    'lr-20': {
      text: 'El cliente necesita web sRGB + impresión Adobe RGB desde un solo master. ¿Flujo limpio al estilo Pixfan?',
      answers: {
        d: 'Convertir a escala de grises para «simplificar la gestión de color»',
        a: 'Terminar el master en un espacio de trabajo amplio, soft-proof de impresión, luego exportaciones separadas con perfiles/tamaños correctos',
        c: 'Enviar el archivo .lrcat como entregable',
        b: 'Exportar una vez a sRGB y ampliar eso para imprimir',
      },
      explanation:
        'Un master de Revelado, varias exportaciones con propósito — nunca imprimas desde un JPEG web aplastado. Ese hábito «un master → muchas salidas» es consejo central Pixfan.',
      imageAlt: 'Cascada de larga exposición que sugiere un procesado cuidadoso de luces y movimiento',
      imageCredit: unsplashPhoto,
    },
    'lr-21': {
      text: 'Una higiene sana del catálogo Lightroom Classic suele incluir…',
      answers: {
        b: 'Borrar el catálogo después de cada exportación «para ir ligero»',
        c: 'Guardar la única copia del catálogo en un USB que pierdes cada semana',
        d: 'Nunca hacer backup porque las Smart Previews son un archivo completo',
        a: 'Copias de seguridad regulares del catálogo + saber dónde vive el .lrcat',
      },
      explanation:
        'Los retoques viven en el catálogo; los backups son higiene Pixfan no negociable.',
      imageAlt: 'Manos sobre un portátil — disciplina de backup del catálogo',
      imageCredit: unsplash,
    },
    'lr-22': {
      text: 'Antes de una gran sincronización de Revelado entre fotogramas similares, un hábito Pixfan inteligente es…',
      answers: {
        b: 'Sincronizar todo a ciegas incluyendo manchas de otras caras',
        c: 'Desactivar las vistas previas para que los errores sigan invisibles más tiempo',
        d: 'Convertir toda la sesión a JPEG antes de sincronizar',
        a: 'Revisar un héroe, sincronizar a propósito y luego QA de outliers (caras, polvo, recortes)',
      },
      explanation:
        'La sincronización es un multiplicador — escalan los buenos looks y los malos errores.',
    },
    'lr-23': {
      text: 'Necesitas una versión B&N sin perder el master en color. ¿Enfoque limpio?',
      answers: {
        b: 'Exportar JPEG, reabrir, desaturar y sobrescribir el RAW',
        c: 'Borrar todos los retoques de color para que solo quede B&N para siempre',
        d: 'Cambiar el perfil de cámara a monocromo solo en la cámara',
        a: 'Copia virtual (o instantánea) para B&N; mantener intacto el master en color',
      },
      explanation:
        'Las copias virtuales mantienen bifurcaciones no destructivas del mismo archivo master.',
    },
    'lr-24': {
      text: 'Entrega al cliente desde Lightroom — ¿qué hábito de exportación es más sólido al estilo Pixfan?',
      answers: {
        b: 'Exportar siempre JPEG ProPhoto al 300 % «por seguridad»',
        c: 'Enviar el archivo de catálogo en lugar de las imágenes renderizadas',
        d: 'Omitir nitidez y perfil de color en cada exportación web',
        a: 'Presets con nombre por destino (web sRGB / impresión) + QA visual rápida de las exportaciones',
      },
      explanation:
        'Presets de exportación repetibles + una última mirada ganan a improvisar cada vez.',
      imageAlt: 'Escritorio de portátil — QA de sincronización por lotes antes de la entrega',
      imageCredit: unsplash,
    },
    'lr-25': {
      text: 'Una máscara de rango de luminancia es especialmente útil cuando quieres…',
      answers: {
        b: 'Sustituir cualquier control de balance de blancos',
        c: 'Escribir automáticamente el copyright IPTC en cada exportación',
        d: 'Forzar todos los cielos a un púrpura neón sin importar la selección',
        a: 'Limitar un ajuste local a regiones tonales claras u oscuras',
      },
      explanation:
        'Las máscaras de rango afinan dónde aterriza un retoque local por tono o color.',
    },
    'lr-26': {
      text: 'Mito: «Más Claridad siempre hace que una foto parezca más profesional.» ¿Mejor marco?',
      answers: {
        b: 'La Claridad solo afecta al canal azul en impresión',
        c: 'Debes maximizar Claridad en cada paisaje para siempre',
        d: 'La Claridad sustituye por completo las Correcciones de objetivo',
        a: 'La Claridad es una herramienta de contraste de medios tonos — fácil de aplastar piel y bruma sin ganar nada',
      },
      explanation:
        'Usa la Claridad con intención; caras y atmósferas suaves suelen pedir contención.',
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
console.log(`lightroom-workflow: added ${added} LocalizedString.es fields`);

#!/usr/bin/env node
/**
 * Vague 1.48 — add LocalizedString.es for pack retouching (190 LS).
 * Idempotent: skips fields that already have non-empty es.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'retouching');
if (!pack) throw new Error('retouching not found');

const unsplashCredit = 'Unsplash — uso libre (licencia Unsplash)';

const es = {
  title: 'Retoque y revelado',
  description:
    'RAW, histogramas, color, nitidez y ediciones éticas.',
  questions: {
    'edit-1': {
      text: 'Un histograma recortado a la derecha suele significar…',
      answers: {
        c: 'Que el objetivo está sucio',
        b: 'Solo tonos medios perfectos',
        a: 'Altas luces quemadas / detalle perdido',
        d: 'Que el ISO está siempre en 100',
      },
      explanation:
        'El recorte a la derecha indica blanco puro con poco detalle recuperable.',
      imageAlt: 'Degradados de color abstractos',
      imageCredit: unsplashCredit,
    },
    'edit-2': {
      text: 'Revelar RAW en lugar de JPEG ayuda sobre todo porque…',
      answers: {
        b: 'Los archivos RAW siempre son más pequeños',
        a: 'Quedan más datos tonales/de color antes de un procesado fuerte',
        c: 'El JPEG no puede mostrar colores',
        d: 'El RAW desactiva la composición',
      },
      explanation:
        'El RAW conserva datos del sensor; el JPEG fija contraste, nitidez y compresión.',
      imageAlt: 'Espacio de retoque con pantallas',
      imageCredit: unsplashCredit,
    },
    'edit-3': {
      text: 'La corrección de balance de blancos ajusta principalmente…',
      answers: {
        b: 'La distancia focal',
        d: 'El contador de obturaciones',
        a: 'La temperatura de color / el tinte de la escena',
        c: 'Los puntos de autofoco',
      },
      explanation:
        'El BB elimina dominantes de color no deseadas de las fuentes de luz.',
      imageAlt: 'Cuerpo de cámara — el balance de blancos empieza en la captura',
      imageCredit: unsplashCredit,
    },
    'edit-4': {
      text: 'Prácticas habituales de retoque no destructivo incluyen…',
      answers: {
        c: 'Sobreescribir el único original con un JPEG diminuto',
        a: 'Usar capas de ajuste / sidecars',
        d: 'Exportar copias para web/impresión',
        b: 'Conservar el RAW/máster original',
      },
      explanation:
        'Nunca destruyas el máster; trabaja con ediciones reversibles y exportaciones.',
      imageAlt: 'Escribir en un portátil — hábitos de retoque no destructivo',
      imageCredit: unsplashCredit,
    },
    'edit-5': {
      text: 'Los deslizadores de claridad / estructura afectan sobre todo…',
      answers: {
        d: 'Solo la altitud GPS',
        b: 'La velocidad de carga de la batería',
        a: 'El contraste local de tonos medios / el relieve de texturas',
        c: 'El firmware del objetivo',
      },
      explanation:
        'Enfatizan el contraste de medias frecuencias; abusar da un aspecto crujiente.',
      imageAlt: 'Textura de bosque brumoso — terreno claridad / estructura',
      imageCredit: unsplashCredit,
    },
    'edit-6': {
      text: 'Recortar una foto…',
      answers: {
        d: 'Elimina la necesidad de exposición',
        b: 'Aumenta retrospectivamente el zoom óptico',
        a: 'Cambia el encuadre y puede mejorar la composición',
        c: 'Siempre añade megapíxeles',
      },
      explanation:
        'El recorte es una herramienta de composición; un recorte fuerte reduce la resolución.',
      imageAlt: 'Paisaje listo para un recorte reflexivo',
      imageCredit: unsplashCredit,
    },
    'edit-7': {
      text: 'En etalonaje, un riesgo frecuente de empujar demasiado los HSL es…',
      answers: {
        c: 'Un autofoco más rápido',
        b: 'Sensores más grandes',
        a: 'Tonos de piel artificiales y banding',
        d: 'Borrar el RAW de forma obligatoria',
      },
      explanation:
        'La piel vive en rangos sutiles naranja/amarillo: empujar demasiado se ve falso.',
      imageAlt: 'Paisaje de colores intensos — riesgo de HSL extremo',
      imageCredit: unsplashCredit,
    },
    'edit-8': {
      text: 'La nitidez se aplica mejor…',
      answers: {
        a: 'Pensando en la salida (pantalla vs impresión)',
        b: 'Después de la reducción de ruido principal cuando haga falta',
        d: 'Comprobada al 100 % de zoom',
        c: 'Al máximo en todas las capas para siempre',
      },
      explanation:
        'La nitidez de salida cambia según el medio; revisa a 1:1 para evitar halos.',
      imageAlt: 'Textura de paisaje detallada para nitidez de salida',
      imageCredit: unsplashCredit,
    },
    'edit-9': {
      text: 'El dodge and burn tradicionalmente…',
      answers: {
        b: 'Cambia de marca de cámara',
        d: 'Desactiva los histogramas',
        c: 'Convierte a TIFF automáticamente',
        a: 'Aclara / oscurece zonas locales para guiar la mirada',
      },
      explanation:
        'Técnica clásica de laboratorio, ahora digital con pinceles/máscaras suaves.',
      imageAlt: 'Luz y sombra en montaña — metáfora de dodge and burn',
      imageCredit: unsplashCredit,
    },
    'edit-10': {
      text: 'Las herramientas de sanar / content-aware son ideales para polvo, pero éticamente delicadas cuando…',
      answers: {
        b: 'Eliminan una mancha de sensor en el cielo',
        c: 'Enderezan ligeramente el horizonte',
        d: 'Exportan sRGB',
        a: 'Cambian el cuerpo de una persona o los hechos de una escena informativa',
      },
      explanation:
        'La ética documental/periodística limita el retoque manipulador de sujetos y hechos.',
    },
    'edit-11': {
      text: 'sRGB se usa habitualmente para…',
      answers: {
        a: 'Web y compartición general en pantalla',
        b: 'Solo cámaras de cine',
        c: 'Medir las láminas del diafragma',
        d: 'Nombrar capas',
      },
      explanation:
        'sRGB es el valor seguro por defecto para ver online; la impresión puede usar espacios más amplios con perfiles.',
      imageAlt: 'Pantalla de smartphone — entrega sRGB para la web',
      imageCredit: unsplashCredit,
    },
    'edit-12': {
      text: 'Primeras comprobaciones útiles al abrir un archivo para editar…',
      answers: {
        b: 'Balance de blancos',
        a: 'Exposición / histograma',
        d: 'Necesidades de composición / recorte',
        c: 'Borrar siempre todo el EXIF de inmediato',
      },
      explanation:
        'Empieza por exposición/BB globales y encuadre antes del micro-retoque.',
      imageAlt: 'Panel en portátil — primeras comprobaciones al abrir un archivo',
      imageCredit: unsplashCredit,
    },
    'edit-13': {
      text: 'La posterización / banding en cielos suele aparecer cuando…',
      answers: {
        d: 'Activas las líneas de rejilla',
        c: 'Disparas solo a f/8 en un día soleado',
        b: 'Usas trípode en exterior',
        a: 'Gradientes fuertes chocan con exportaciones de 8 bits o reducción de ruido agresiva',
      },
      explanation:
        'Los tonos suaves necesitan profundidad de bits y un procesado cuidadoso; añade grano sutil si hace falta.',
    },
    'edit-14': {
      text: 'Un efecto de viñeta…',
      answers: {
        a: 'Oscurece (o aclara) los bordes para centrar la atención',
        c: 'Convierte solo a CMYK',
        b: 'Cambia los motores de autofoco',
        d: 'Elimina el copyright',
      },
      explanation:
        'Las viñetas sutiles guían la mirada; las fuertes envejecen rápido.',
      imageAlt: 'Vista de montaña — metáfora clásica de viñeta',
      imageCredit: unsplashCredit,
    },
    'edit-15': {
      text: 'Al retocar retratos de forma ética para clientes generales…',
      answers: {
        d: 'Hablar de expectativas antes de la entrega',
        b: 'Mantener la textura natural de la piel',
        c: 'Remodelar el cuerpo de forma extrema sin consentimiento',
        a: 'Limpiar imperfecciones temporales si está acordado',
      },
      explanation:
        'El consentimiento y el naturalismo vencen a los filtros beauty fuertes salvo petición.',
      imageAlt: 'Retrato outdoor para juzgar un retoque de piel ético',
      imageCredit: unsplashCredit,
    },
    'edit-16': {
      text: 'Exportar para Instagram suele significar…',
      answers: {
        a: 'Un JPEG/HEIC de resolución razonable en sRGB',
        d: 'Archivo ProRes RAW',
        c: 'Solo DNG',
        b: 'Siempre un TIFF de 16 bits de 2 GB',
      },
      explanation:
        'Las redes recomprimen: másteres enormes pierden tiempo.',
      imageAlt: 'Icono de app social — tamaño de exportación para Instagram',
      imageCredit: unsplashCredit,
    },
    'edit-17': {
      text: 'La separación de frecuencias se usa sobre todo para…',
      answers: {
        d: 'Medir la distancia hiperfocal',
        a: 'Separar textura de color/tono para trabajo avanzado de piel',
        c: 'Cargar las baterías más rápido',
        b: 'Solo apilar enfoques en paisajes',
      },
      explanation:
        'Técnica avanzada: fácil pasarse y plastificar la piel.',
      imageAlt: 'Textura de piel en primer plano — terreno de frequency separation',
      imageCredit: unsplashCredit,
    },
    'edit-18': {
      text: 'Señales de sobreprocesado incluyen…',
      answers: {
        c: 'Transiciones de color naturales',
        a: 'Halos alrededor de los bordes',
        b: 'Ruido crujiente / piel plástica',
        d: 'Brillo HDR con tonos medios grises y planos',
      },
      explanation:
        'Si la edición es el sujeto, bájala.',
      imageAlt: 'Diseño gráfico intenso — signos de sobreprocesado',
      imageCredit: unsplashCredit,
    },
    'edit-19': {
      text: 'Una soft proof en el software de edición te ayuda a…',
      answers: {
        b: 'Aumentar los megapíxeles',
        c: 'Hacer autofoco en la oscuridad',
        a: 'Previsualizar cómo se verán los colores en un perfil de impresión objetivo',
        d: 'Quitar automáticamente los tapones del objetivo',
      },
      explanation:
        'La soft proof simula el gamut/papel antes de malgastar tinta.',
      imageAlt: 'Portátil y café — soft proof antes de imprimir / entregar al cliente',
      imageCredit: unsplashCredit,
    },
    'edit-20': {
      text: 'El mejor paso final antes de entregar a un cliente suele ser…',
      answers: {
        a: 'Una revisión en frío en otra pantalla + nombres/exportación coherentes',
        c: 'Añadir marcas de agua aleatorias en las caras',
        b: 'Borrar las copias de seguridad',
        d: 'Poner todos los deslizadores al máximo',
      },
      explanation:
        'La distancia y la coherencia pillan más errores que más efectos.',
    },
    'edit-21': {
      text: 'Mito: «En RAW se puede arreglar todo después.»',
      answers: {
        b: 'Falso — el RAW ayuda en latitud de exposición/color, no hace milagros con desenfoque o recorte duro',
        c: 'Verdadero solo en blanco y negro',
        a: 'Verdadero — el enfoque, el motion blur y los espectros recortados vuelven perfectos',
        d: 'El RAW desactiva el objetivo hasta la exportación',
      },
      explanation:
        'El RAW es flexible, no mágico. Enfoque y obturador se ganan en cámara.',
    },
    'edit-22': {
      text: 'La piel se ve plástica tras el retoque. ¿Causa probable?',
      answers: {
        a: 'Demasiada frequency separation / suavizado / claridad extrema',
        b: 'Disparar a f/8 en exterior',
        c: 'Usar un objetivo fijo',
        d: 'Exportar sRGB para la web',
      },
      explanation:
        'El sobre-suavizado mata poros y textura. Baja hasta que la piel siga pareciendo piel.',
      imageAlt: 'Retrato en primer plano',
      imageCredit: unsplashCredit,
    },
    'edit-23': {
      text: 'Antes de enviar fotos a un cliente, buenas últimas comprobaciones incluyen…',
      answers: {
        a: 'Buscar polvo / manchas de sensor en cielos',
        d: 'Exportar el tamaño/perfil de color correcto para el uso',
        b: 'Confirmar orientación del recorte y ortografía de textos',
        c: 'Dejar stickers temporales de rechazo en los archivos finales',
      },
      explanation:
        'Entrega archivos limpios adaptados al destino — no tus rejects de trabajo.',
      imageAlt: 'Documentos checklist — últimas comprobaciones antes del envío',
      imageCredit: unsplashCredit,
    },
    'edit-24': {
      text: 'El cliente quiere piel «más limpia» pero textura natural para una marca lifestyle. ¿Pipeline arriesgado?',
      answers: {
        a: 'Desenfoque global / suavizadores plásticos en toda la cara',
        b: 'Sanar solo polvo, luego trabajo de textura suave o enmascarado',
        c: 'Dejar cada imperfección temporal para siempre — no tocar la piel',
        d: 'Clarity +100 en los poros para «más realismo»',
      },
      explanation:
        'Los suavizadores globales matan poros y la confianza de marca. Una limpieza local mantiene la textura.',
    },
    'edit-25': {
      text: 'Haces soft proof con un perfil de papel mate y los rojos se ven apagados. ¿Interpretación correcta?',
      answers: {
        c: 'Siempre convertir a sRGB antes del soft proof de impresión',
        a: 'Fuera de gamut / límites del papel — ajusta con la prueba activa, no persigas el pop de pantalla',
        d: 'El papel mate siempre necesita +2 de exposición al exportar',
        b: 'El monitor está roto — ignora los perfiles de papel',
      },
      explanation:
        'La soft proof muestra el color imprimible. Corrige con la prueba, no confíes en una pantalla sin probar.',
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
console.log(`retouching: added ${added} LocalizedString.es fields`);

#!/usr/bin/env node
/**
 * Vague 1.45 — add LocalizedString.es for pack photo-rights (180 LS).
 * Idempotent: skips fields that already have non-empty es.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'photo-rights');
if (!pack) throw new Error('photo-rights not found');

const unsplashCredit =
  'Unsplash — uso libre (licencia Unsplash)';

const es = {
  title: 'Derechos y ética',
  description:
    'Derechos de autor, autorizaciones de modelo, privacidad y compartición responsable.',
  questions: {
    'rights-1': {
      text: 'En la mayoría de los países, ¿quién posee por defecto el derecho de autor de una foto?',
      answers: {
        b: 'Cualquiera que la marque con «me gusta» en redes',
        a: 'El fotógrafo que la creó',
        c: 'El fabricante de la cámara',
        d: 'El sujeto fotografiado, automática y siempre',
      },
      explanation:
        'El derecho de autor suele corresponder al autor (el fotógrafo), salvo cesión por contrato o obra por encargo/salario.',
      imageAlt: 'Contrato y bolígrafo sobre un escritorio',
      imageCredit: unsplashCredit,
    },
    'rights-2': {
      text: '«Todos los derechos reservados» significa en general…',
      answers: {
        a: 'La reutilización requiere autorización, salvo excepción',
        b: 'Cualquiera puede vender la foto libremente',
        d: 'Solo está prohibido el uso en papel',
        c: 'La foto está en el dominio público',
      },
      explanation:
        'Indica que el autor conserva el control; comprueba la licencia o pide permiso antes de un uso comercial/republicación.',
      imageAlt: 'Apretón de manos sobre un acuerdo',
      imageCredit: unsplashCredit,
    },
    'rights-3': {
      text: 'Una licencia Creative Commons «BY-NC» autoriza típicamente…',
      answers: {
        d: 'Quitar siempre la mención de licencia',
        a: 'La reutilización no comercial con crédito al autor',
        c: 'Pretender que tú tomaste la foto',
        b: 'Publicidad comercial sin atribución',
      },
      explanation:
        'BY = atribución; NC = no comercial. Lee siempre el texto exacto de la licencia CC.',
      imageAlt: 'Documentos de licencia — las opciones Creative Commons importan',
      imageCredit: unsplashCredit,
    },
    'rights-4': {
      text: '¿Cuándo puede hacer falta una autorización de modelo (model release)?',
      answers: {
        c: 'Usar un retrato en una campaña de marca',
        b: 'Vender copias de una calle sin rostros identificables',
        a: 'Publicidad comercial con una persona reconocible',
        d: 'Reportaje de actualidad en muchas jurisdicciones (reglas a menudo distintas)',
      },
      explanation:
        'El uso comercial/promocional de la imagen de una persona suele exigir consentimiento; el editorial sigue otras reglas según el país.',
      imageAlt: 'Rostro reconocible — terreno del model release',
      imageCredit: unsplashCredit,
    },
    'rights-5': {
      text: 'Guardar la foto de Instagram de alguien y republicarla como propia es…',
      answers: {
        a: 'En general una infracción de derechos de autor / deshonesto',
        b: 'Siempre legal porque estaba en línea',
        d: 'Incorrecto solo si la foto es a color',
        c: 'Obligatorio por fair use en todas partes',
      },
      explanation:
        'Publicar en línea no renuncia al derecho de autor. Un crédito solo no basta siempre sin autorización.',
      imageAlt: 'Pantalla de teléfono — no robes fotos de Instagram',
      imageCredit: unsplashCredit,
    },
    'rights-6': {
      text: 'Fotografiar un edificio desde la vía pública a menudo es posible, pero…',
      answers: {
        d: 'Solo los drones son legales',
        b: 'Siempre debes pagar derechos al arquitecto',
        c: 'Las fotos de edificios nunca están protegidas en ningún sitio',
        a: 'El uso comercial de una arquitectura / marca distintiva puede seguir limitado',
      },
      explanation:
        'La libertad de panorama y las reglas de marca/propiedad varían mucho según el país.',
      imageAlt:
        'Calle y edificios públicos — más libres de fotografiar, no siempre de vender',
      imageCredit: unsplashCredit,
    },
    'rights-7': {
      text: 'Prácticas éticas al fotografiar personas incluyen…',
      answers: {
        a: 'Respetar la dignidad y el contexto',
        b: 'Pedir antes de primeros planos intrusivos si es posible',
        c: 'Publicar imágenes humillantes por el clic',
        d: 'Ser prudente con la imagen de menores',
      },
      explanation:
        'La legalidad no es el único criterio: respeto y consentimiento importan, sobre todo con menores.',
      imageAlt: 'Persona reconocible — dignidad y hábitos de consentimiento',
      imageCredit: unsplashCredit,
    },
    'rights-8': {
      text: 'Una foto hecha en el marco laboral / por encargo suele significar…',
      answers: {
        d: 'Solo aplica Creative Commons',
        a: 'Los derechos pueden pertenecer al empleador/cliente según contrato y derecho local',
        b: 'El becario conserva siempre la exclusividad mundial',
        c: 'El derecho de autor desaparece',
      },
      explanation:
        'Los contratos laborales o de cesión suelen transferir derechos patrimoniales: léelos antes de presumir la propiedad.',
      imageAlt:
        'Apretón de manos sobre papeles — obra por encargo y contratos de cliente',
      imageCredit: unsplashCredit,
    },
    'rights-9': {
      text: 'Integrar la localización GPS en los metadatos puede…',
      answers: {
        c: 'Eliminar el derecho de autor',
        a: 'Revelar lugares privados (domicilio, colegio de los hijos, etc.)',
        d: 'Garantizar viralidad',
        b: 'Aumentar automáticamente la velocidad de obturación',
      },
      explanation:
        'Quita o revisa la localización EXIF antes de un compartido público si importa la privacidad.',
    },
    'rights-10': {
      text: 'El fair use / el derecho de cita breve…',
      answers: {
        d: 'Solo se aplican a vídeos',
        a: 'Son limitados, ligados al contexto, y no un pase libre para cualquier foto',
        c: 'Existen idénticos en todos los países',
        b: 'Permiten la reutilización comercial ilimitada de cualquier imagen',
      },
      explanation:
        'Las excepciones varían según el país y el fin (crítica, información, educación…).',
    },
    'rights-11': {
      text: 'Antes de usar una foto de stock para un cliente, comprueba…',
      answers: {
        a: 'El tipo de licencia (editorial vs comercial)',
        b: 'Los límites de uso y las obligaciones de atribución',
        c: 'Si las releases de modelo/propiedad cubren tu uso',
        d: 'Que el archivo tenga exactamente 300 DPI en pantalla',
      },
      explanation:
        'Las licencias de stock son contractuales: lo editorial a menudo no vale para publicidad.',
      imageAlt: 'Papeles contractuales — revisa las licencias de stock antes del trabajo',
      imageCredit: unsplashCredit,
    },
    'rights-12': {
      text: 'Los modelos de IA entrenados con fotos raspeadas plantean sobre todo cuestiones de…',
      answers: {
        c: 'Solo el ruido ISO',
        a: 'Consentimiento, derecho de autor y transparencia de los datos de entrenamiento',
        b: 'Solo la autonomía de la batería',
        d: 'El diámetro de la rosca del trípode',
      },
      explanation:
        'Los debates jurídicos y éticos continúan sobre datos de entrenamiento, opt-out y semejanza.',
      imageAlt: 'Imagen abstracta de IA — debates sobre el entrenamiento raspeado',
      imageCredit: unsplashCredit,
    },
    'rights-13': {
      text: 'Publicar la foto reconocible de una persona privada en un contexto embarazoso sin consentimiento es…',
      answers: {
        a: 'A menudo arriesgado jurídica y éticamente (privacidad / derechos de la personalidad)',
        d: 'Solo un problema de perfil de color',
        c: 'Obligatorio para la actualidad',
        b: 'Siempre correcto si se tomó en público',
      },
      explanation:
        'Lugar público ≠ derecho a dañar la dignidad; los derechos de imagen/privacidad varían.',
      imageAlt:
        'Persona privada reconocible — dignidad y consentimiento antes de publicar',
      imageCredit: unsplashCredit,
    },
    'rights-14': {
      text: 'Las marcas de agua (watermarks)…',
      answers: {
        b: 'Son obligatorias para que exista el derecho de autor',
        c: 'Hacen más pequeños los archivos RAW',
        d: 'Transfieren la propiedad a Instagram',
        a: 'Pueden disuadir el robo ocasional pero no sustituyen los derechos',
      },
      explanation:
        'El derecho de autor existe sin marca de agua; es sobre todo una protección práctica.',
      imageAlt: 'Apretón de manos — créditos y acuerdos profesionales',
      imageCredit: unsplashCredit,
    },
    'rights-15': {
      text: 'Buenas costumbres antes de entregar fotos a un cliente…',
      answers: {
        a: 'Aclarar los derechos de uso por escrito',
        b: 'Acordar exclusividad / duración / territorios si hace falta',
        d: 'Conservar un archivo de las selecciones entregadas',
        c: 'Suponer que un chat oral vale como cesión mundial perpetua',
      },
      explanation:
        'Un contrato claro evita litigios; archiva lo que se entregó.',
      imageAlt: 'Apretón de manos — acuerdos de entrega claros con los clientes',
      imageCredit: unsplashCredit,
    },
    'rights-16': {
      text: 'Un museo que prohíbe flash/fotos en el interior responde sobre todo a…',
      answers: {
        a: 'El reglamento del lugar, la conservación y a veces derechos de terceros',
        b: 'Normas ISO internacionales del JPEG',
        c: 'Creative Commons obligatorio',
        d: 'Leyes sobre el tamaño del sensor',
      },
      explanation:
        'El propietario puede fijar condiciones de acceso; las obras también pueden estar protegidas.',
    },
    'rights-17': {
      text: 'Los créditos fotográficos («Foto: Jane Doe»)…',
      answers: {
        a: 'Respetan el derecho moral / la atribución pero no conceden solos un derecho de reutilización',
        b: 'Venden automáticamente la exclusividad a la revista',
        d: 'Son ilegales en la UE',
        c: 'Eliminan el EXIF',
      },
      explanation:
        'La atribución es buena práctica; la licencia controla la reutilización.',
      imageAlt: 'Documentos sobre un escritorio — créditos y menciones de uso',
      imageCredit: unsplashCredit,
    },
    'rights-18': {
      text: 'Si contratas a un segundo fotógrafo, deberías…',
      answers: {
        a: 'Definir por contrato quién posee / puede usar las imágenes',
        b: 'Nunca hablar de derechos',
        d: 'Pagar solo con «me gusta»',
        c: 'Suponer que las publicaciones en redes transfieren la propiedad',
      },
      explanation:
        'Las colaboraciones necesitan términos de PI claros desde el principio.',
    },
    'rights-19': {
      text: 'Usos arriesgados sin autorización incluyen a menudo…',
      answers: {
        d: 'Merchandising (camisetas, pósters a la venta)',
        b: 'Dar a entender que una celebridad avala una marca',
        a: 'Envases de producto y anuncios de pago',
        c: 'Álbum familiar impreso en casa',
      },
      explanation:
        'La explotación comercial y la apariencia de endorsement exigen releases/licencias.',
    },
    'rights-20': {
      text: 'El consejo más seguro antes de reutilizar una imagen encontrada en línea…',
      answers: {
        b: 'Si Google Imágenes la muestra, es gratis',
        d: 'Pasarla a B/N anula el derecho de autor',
        a: 'Asume que está protegida, comprueba la licencia, o crea/encarga la tuya',
        c: 'Recortar un 10 % la hace legal',
      },
      explanation:
        'El mito del «recorte del 10 %» no anula el derecho de autor. Licencia o creación.',
    },
    'rights-21': {
      text: 'Terraza de café llena (zona difusa público/privado). ¿Reflejo más seguro antes de un anuncio comercial?',
      answers: {
        d: 'El uso comercial es idéntico a un álbum familiar privado',
        b: 'Obtener autorizaciones / preferir multitudes no reconocibles / consultar para uso comercial',
        a: 'Publicar cualquier cosa — los cafés siempre son de libre uso',
        c: 'Bastar con un emoji sobre una sola cara',
      },
      explanation:
        'Editorial vs comercial y derecho a la imagen varían: cuando hay dinero, autoriza o anonimiza.',
      imageAlt: 'Terraza de café',
      imageCredit: unsplashCredit,
    },
    'rights-22': {
      text: 'Un amigo te pide borrar a su ex de una foto de boda. ¿Cuál es el núcleo ético?',
      answers: {
        b: 'Ser transparente con los implicados; retocar la historia/las personas tiene peso social',
        a: 'Hacerlo siempre en secreto sin decírselo a los novios',
        d: 'Solo la IA decide quién permanece en las fotos de grupo',
        c: 'Rechazar cualquier retoque para siempre, incluidas las motas de polvo',
      },
      explanation:
        'La técnica es fácil; el consentimiento y la honestidad con quienes viven (y portan) la historia importan más.',
      imageAlt: 'Celebración de boda — borrar personas tiene peso social',
      imageCredit: unsplashCredit,
    },
    'rights-23': {
      text: 'Alguien publica una imagen IA como «una foto que tomó», sin decirlo. ¿Problema principal?',
      answers: {
        b: 'Engaño — el público pierde confianza sobre el autor y lo real',
        c: 'Las imágenes IA no pueden contener el color rojo',
        d: 'Ningún problema si el prompt era poético',
        a: 'El peso del archivo suele ser demasiado pequeño',
      },
      explanation:
        'La IA puede ser arte. Hacerla pasar por una foto capturada sin decirlo rompe la confianza.',
      imageAlt: 'Metáfora robot / IA — divulga con honestidad las imágenes sintéticas',
      imageCredit: unsplashCredit,
    },
    'rights-24': {
      text: 'Fotografías a un músico callejero en un lugar público francés para un blog editorial. ¿Reflejo prudente?',
      answers: {
        d: 'Recortar un logo borra siempre todos los derechos',
        c: 'Solo las celebridades exigen prudencia',
        b: 'Lugar público = uso comercial ilimitado para siempre',
        a: 'El lugar público ayuda, pero personas identificables + uso comercial/sensible pueden exigir acuerdo — en duda, pregunta o no publiques el rostro',
      },
      explanation:
        'Espacio público ≠ cheque en blanco. Contexto, finalidad y dignidad importan — sobre todo en una publicación monetizada o sensible.',
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
console.log(`photo-rights: added ${added} LocalizedString.es fields`);

#!/usr/bin/env node
/**
 * Vague 1.49 — add LocalizedString.es for pack history-icons (192 LS).
 * Idempotent: skips fields that already have non-empty es.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'history-icons');
if (!pack) throw new Error('history-icons not found');

const unsplashCredit = 'Unsplash — uso libre (licencia Unsplash)';

const es = {
  title: 'Historia y fotógrafos icónicos',
  description:
    'Desde las primeras fotografías hasta las leyendas que moldearon nuestra mirada.',
  questions: {
    'hist-1': {
      text: '¿A quién se atribuye generalmente la fotografía más antigua conservada (heliografía, años 1820)?',
      answers: {
        b: 'Ansel Adams (paisajista)',
        c: 'Steve Jobs (informático)',
        a: 'Nicéphore Niépce (heliografía)',
        d: 'Solo Henri Cartier-Bresson',
      },
      explanation:
        'La Vista desde la ventana en Le Gras de Nicéphore Niépce (c. 1826–27) es la fotografía conservada más antigua conocida. Daguerre popularizó después el daguerrotipo.',
      imageAlt: 'Cámara clásica',
      imageCredit: unsplashCredit,
    },
    'hist-2': {
      text: '¿Henri Cartier-Bresson se asocia sobre todo a qué idea?',
      answers: {
        c: 'Solo la iluminación de moda en estudio',
        b: 'La invención de los sensores digitales',
        a: 'El «momento decisivo» en foto de calle / reportaje',
        d: 'Solo la fauna submarina',
      },
      explanation:
        'Cartier-Bresson formalizó el momento decisivo: captar el pico de la acción y la geometría en un solo fotograma perfectamente cronometrado.',
      imageAlt: 'Equipo fotográfico vintage',
      imageCredit: unsplashCredit,
    },
    'hist-3': {
      text: '¿Qué fotógrafos son famosos por paisajes o documentales en blanco y negro?',
      answers: {
        d: 'Sebastião Salgado (reportaje)',
        b: 'Dorothea Lange (documental)',
        a: 'Ansel Adams (paisajes)',
        c: 'Solo diseñadores de interfaces de smartphone',
      },
      explanation:
        'Adams (paisajes, Sistema de Zonas), Lange (documental de la Gran Depresión) y Salgado (reportaje B/N épico) son pilares del medio.',
      imageAlt: 'Libros y papeles antiguos',
      imageCredit: unsplashCredit,
    },
    'hist-4': {
      text: '¿Qué agencia cofundó Cartier-Bresson en 1947 con otros fotógrafos legendarios?',
      answers: {
        d: 'Solo una tienda de la marca Leica',
        b: 'la NASA',
        a: 'Magnum Photos (cooperativa)',
        c: 'Instagram (red social)',
      },
      explanation:
        'Magnum Photos (1947) fue cofundada por Cartier-Bresson, Robert Capa, George Rodger y David «Chim» Seymour — una cooperativa propiedad de los fotógrafos.',
      imageAlt: 'Álbumes fotográficos vintage',
      imageCredit: unsplashCredit,
    },
    'hist-5': {
      text: 'Annie Leibovitz es conocida sobre todo por…',
      answers: {
        c: 'Solo planos de arquitectura',
        d: 'Sistemas de foto-finish deportivos',
        a: 'Retratos icónicos de celebridades y figuras culturales',
        b: 'Inventar el primer sensor de cámara digital',
      },
      explanation:
        'El trabajo de Leibovitz para Rolling Stone, Vanity Fair y más allá definió el retrato moderno de celebridades, muy escenificado.',
      imageAlt: 'Cámara vintage — iconos de la historia fotográfica',
      imageCredit: unsplashCredit,
    },
    'hist-6': {
      text: 'El daguerrotipo (popularizado por Louis Daguerre) era…',
      answers: {
        d: 'Un formato de archivo RAW de 2010',
        a: 'Un proceso fotográfico temprano que producía una imagen única sobre placa plateada',
        b: 'Un tipo de zoom moderno',
        c: 'Una red social para fotógrafos',
      },
      explanation:
        'Anunciado públicamente en 1839, el daguerrotipo creaba un positivo único y detallado sobre placa de cobre plateada — un hito para la fotografía popular.',
      imageAlt: 'Cámara vintage que evoca los primeros procesos fotográficos',
      imageCredit: unsplashCredit,
    },
    'hist-7': {
      text: '¿Quién inventó la cámara Kodak Brownie?',
      answers: {
        a: 'George Eastman / la empresa Kodak',
        c: 'Louis Daguerre (daguerrotipo)',
        b: 'Ansel Adams (paisajista)',
        d: 'Henri Cartier-Bresson (reportaje)',
      },
      explanation:
        'Lanzado en 1900, el Brownie hizo la fotografía accesible a niños y aficionados con su precio de 1$.',
      imageAlt: 'Cuerpo de cámara clásico — cultura del snapshot democratizado',
      imageCredit: unsplashCredit,
    },
    'hist-8': {
      text: '¿Quién inventó la primera cámara digital?',
      answers: {
        a: 'Steven Sasson en Kodak en 1975',
        b: 'Steve Jobs en Apple',
        c: 'la NASA para fotografía espacial',
        d: 'Canon en Japón',
      },
      explanation:
        'El prototipo Kodak de Steven Sasson pesaba unos 3,6 kg, tardaba 23 segundos en capturar una imagen y grababa en cassette.',
    },
    'hist-9': {
      text: '¿Qué fotógrafos documentaron la Gran Depresión?',
      answers: {
        d: 'Richard Avedon (moda/retrato)',
        b: 'Walker Evans (documental)',
        c: 'Arthur Rothstein (FSA)',
        a: 'Dorothea Lange (FSA)',
      },
      explanation:
        'Lange («Madre migrante»), Evans y Rothstein fotografaron la pobreza de la era de la Depresión para la Farm Security Administration.',
      imageAlt: 'Ambiente de paisaje documental — tradición fotográfica de la crisis',
      imageCredit: unsplashCredit,
    },
    'hist-10': {
      text: '¿Cuál es la importancia de la exposición «The Family of Man»?',
      answers: {
        b: 'Introdujo la fotografía digital',
        c: 'Fue el primer desfile de moda',
        a: 'Fue la exposición fotográfica más visitada de la historia',
        d: 'Mostraba solo fotografía de paisaje',
      },
      explanation:
        'Comisariada por Edward Steichen en 1955, viajó por el mundo alcanzando 9 millones de visitantes, celebrando experiencias humanas universales.',
    },
    'hist-11': {
      text: '¿Quién impulsó la fotografía como arte con el grupo Photo-Secession?',
      answers: {
        b: 'Pablo Picasso (pintor)',
        a: 'Alfred Stieglitz (Photo-Secession)',
        d: 'Thomas Edison (inventor)',
        c: 'Walt Disney (animación)',
      },
      explanation:
        'Stieglitz promovió la fotografía como bellas artes a través de su galería «291» y publicaciones como Camera Work.',
    },
    'hist-12': {
      text: '¿Qué fotografías de guerra icónicas moldearon la opinión pública?',
      answers: {
        b: 'Madre migrante (Dorothea Lange)',
        d: 'Salida de la Tierra (William Anders, Apolo 8)',
        c: 'Hombre del tanque (fotógrafo desconocido, Tiananmén)',
        a: 'Niña del napalm (Nick Ut, guerra de Vietnam)',
      },
      explanation:
        'Niña del napalm y Hombre del tanque tuvieron impacto directo en la percepción de la guerra y las políticas. Madre migrante afectó la respuesta a la Depresión; Salida de la Tierra, la conciencia ambiental.',
    },
    'hist-13': {
      text: '¿Quién desarrolló el Sistema de Zonas?',
      answers: {
        c: 'Steve Jobs y Steve Wozniak',
        b: 'Henry Leibovitz y Annie Adams',
        d: 'Cartier-Bresson y Capa (reportaje)',
        a: 'Ansel Adams y Fred Archer (Sistema de Zonas)',
      },
      explanation:
        'El Sistema de Zonas divide los valores tonales en 11 zonas (0-negro a X-blanco), dando a los fotógrafos un control preciso de la exposición y el revelado.',
      imageAlt: 'Paisaje de tonos dramáticos — territorio del Sistema de Zonas',
      imageCredit: unsplashCredit,
    },
    'hist-14': {
      text: '¿Quién se considera el padre de la fotografía moderna?',
      answers: {
        b: 'Leonardo da Vinci (artista)',
        c: 'Albert Einstein (físico)',
        d: 'Thomas Edison (inventor)',
        a: 'Alfred Stieglitz o Eugène Atget (en debate)',
      },
      explanation:
        'Stieglitz elevó la fotografía al rango de arte; Atget documentó París. Ambos influyeron mucho en la evolución de la fotografía moderna.',
    },
    'hist-15': {
      text: '¿Qué impacto tuvo Instagram en la fotografía?',
      answers: {
        d: 'Eliminó la necesidad de cámaras',
        b: 'Popularizó las imágenes en formato cuadrado',
        c: 'Hizo mainstream los filtros y la estética',
        a: 'Democratizó la fotografía y el compartir',
      },
      explanation:
        'Instagram transformó la fotografía en un lenguaje visual y social. Los smartphones sustituyeron las cámaras dedicadas para usuarios ocasionales.',
      imageAlt: 'Icono de red social — impacto de Instagram en la fotografía',
      imageCredit: unsplashCredit,
    },
    'hist-16': {
      text: '¿Quién capturó el beso del «Día de la Victoria sobre Japón en Times Square»?',
      answers: {
        a: 'Alfred Eisenstaedt (Life)',
        c: 'Henri Cartier-Bresson (Magnum)',
        b: 'Annie Leibovitz (retrato)',
        d: 'Robert Capa (guerra)',
      },
      explanation:
        'Publicada en Life en 1945, esta imagen icónica simboliza el alivio y la alegría al final de la Segunda Guerra Mundial, aunque las identidades de los sujetos siguen desconocidas.',
      imageAlt: 'Plaza urbana abarrotada — momentos icónicos del fotoperiodismo',
      imageCredit: unsplashCredit,
    },
    'hist-17': {
      text: '¿Cuál fue la primera fotografía de un rostro humano?',
      answers: {
        c: 'La vista de la ventana de Niépce',
        d: 'El autorretrato de Ansel Adams',
        a: 'Autorretrato de Robert Cornelius (1839)',
        b: 'Retrato de Louis Daguerre',
      },
      explanation:
        'El daguerrotipo de Robert Cornelius de 1839 se considera el primer autorretrato estadounidense y la primera fotografía de una persona.',
    },
    'hist-18': {
      text: '¿Qué fotógrafos se asocian al Renacimiento del color en los años 1970-80?',
      answers: {
        b: 'William Eggleston (color)',
        d: 'Ansel Adams (B/N paisajes)',
        c: 'Stephen Shore (color)',
        a: 'Saul Leiter (color)',
      },
      explanation:
        'Estos artistas elevaron la fotografía en color de lo comercial a las bellas artes. La exposición de Eggleston en el MoMA en 1976 fue pivotal.',
    },
    'hist-19': {
      text: '¿Cuál es la importancia de la «Photographic History Collection» del Smithsonian?',
      answers: {
        d: 'Centrada en fotografía de moda',
        b: 'El primer archivo digital',
        c: 'Una colección solo de retratos',
        a: 'Una de las mayores colecciones del mundo que preserva el patrimonio fotográfico',
      },
      explanation:
        'El Smithsonian conserva más de 1,4 millones de fotografías que cubren toda la historia del medio, desde daguerrotipos hasta digital.',
    },
    'hist-20': {
      text: '¿Qué avances tecnológicos impulsaron la evolución de la fotografía?',
      answers: {
        d: 'Obturadores a vapor en el siglo XVIII',
        c: 'Software de procesamiento de imagen',
        a: 'Sensores digitales',
        b: 'Sistemas de autofoco',
      },
      explanation:
        'Sensores, autofoco y software transformaron la captura y el flujo de trabajo. Los obturadores a vapor en el XVIII son ficción — la foto nace en el siglo XIX.',
    },
    'hist-21': {
      text: '¿«El momento decisivo» se vincula sobre todo a qué idea?',
      answers: {
        a: 'Esperar el pico de gesto/geometría y disparar una vez con intención',
        b: 'Disparar 2000 fotogramas y elegir después solo en Lightroom',
        d: 'Nunca mirar por el visor',
        c: 'Usar siempre el flash al aire libre al mediodía',
      },
      explanation:
        'La frase de Cartier-Bresson habla de timing y de mirada — no de ráfaga a ciegas.',
      imageAlt: 'Escena de calle — fotografía street del momento decisivo',
      imageCredit: unsplashCredit,
    },
    'hist-22': {
      text: '¿Por qué se discute aún la famosa foto del beso de Doisneau?',
      answers: {
        b: 'Porque puesta en escena vs espontaneidad plantea ética y leyenda',
        c: 'Porque no tiene línea de horizonte',
        a: 'Porque se tomó con un smartphone',
        d: 'Porque el ISO 100 era ilegal en Francia entonces',
      },
      explanation:
        'La imagen es icónica — y recuerda que una foto «documental» puede estar dirigida.',
      imageAlt: 'Ambiente de calle parisina — debates puesta en escena vs candid',
      imageCredit: unsplashCredit,
    },
    'hist-23': {
      text: 'Ansel Adams se asocia especialmente a…',
      answers: {
        b: 'Artesanía paisajística meticulosa, control tonal y dominio de la copia',
        a: 'Selfies de fiesta con cámaras desechables',
        c: 'Inventar el autofoco',
        d: 'Disparar solo en modo verde automático',
      },
      explanation:
        'Adams = mirada paisajística paciente + control obsesivo de los tonos, de la captura a la copia.',
      imageAlt: 'Paisaje dramático — contraste tonal al estilo Adams',
      imageCredit: unsplashCredit,
    },
    'hist-24': {
      text: 'El Brownie Kodak (1900) importó culturalmente sobre todo porque…',
      answers: {
        b: 'Inventó los sensores digitales de la noche a la mañana',
        d: 'Solo imprimió cianotipos para siempre',
        c: 'Prohibió todos los estudios profesionales',
        a: 'Hizo la foto «snapshot» barata y accesible a aficionados',
      },
      explanation:
        'La ola Brownie democratizó la foto cotidiana — un cambio social tanto como técnico.',
      imageAlt: 'Cámara vintage — democratización de la fotografía amateur',
      imageCredit: unsplashCredit,
    },
    'hist-25': {
      text: 'Magnum Photos (fundada en 1947) se recuerda sobre todo como…',
      answers: {
        a: 'Una cooperativa donde los fotógrafos conservaban derechos y voz editorial',
        c: 'Una fábrica de emulsión solo en Rochester',
        d: 'Un pack de filtros para smartphone de 2015',
        b: 'Una marca de cámaras que solo vendía cubos flash desechables',
      },
      explanation:
        'El modelo Magnum centra la autoría y la propiedad en el fotógrafo — hito de la cultura del reportaje.',
      imageAlt: 'Escena de calle — cultura del reportaje y las agencias',
      imageCredit: unsplashCredit,
    },
    'hist-26': {
      text: 'Cuando se dice que lo digital «mató» el analógico de la noche a la mañana en los 2000, el matiz justo es…',
      answers: {
        c: 'Solo sobrevivieron las cámaras desechables tras inventarse el JPEG',
        a: 'La adopción fue gradual — flujos, costes y cultura cambiaron en años, no en una semana',
        b: 'El analógico dejó de existir físicamente en 2001 en todo el mundo',
        d: 'Lo digital nunca llegó a las redacciones profesionales',
      },
      explanation:
        'Lo digital trastocó los mercados analógicos, pero la transición fue escalonada según géneros y presupuestos.',
      imageAlt: 'Cámara en mano al aire libre — era de transición analógico → digital',
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
console.log(`history-icons: added ${added} LocalizedString.es fields`);

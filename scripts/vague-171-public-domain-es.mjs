#!/usr/bin/env node
/**
 * Vague 1.71 — add LocalizedString.es for pack public-domain (194 LS).
 * Idempotent: skips fields that already have non-empty es.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'public-domain');
if (!pack) throw new Error('public-domain not found');

const pdCredit = (name) => `${name} — dominio público (Wikimedia Commons)`;
const pdCreditUs = (name) => `${name} — dominio público US (Wikimedia Commons)`;
const pdCreditLoc = (name) =>
  `${name} — dominio público (Library of Congress / Wikimedia Commons)`;
const pdCreditMet = (name) =>
  `${name} — dominio público (Wikimedia Commons / Met)`;
const pdCreditNga = (name) =>
  `${name} — dominio público (Wikimedia Commons / NGA)`;
const pdCreditFed = (name) =>
  `${name} — dominio público (federal US / Library of Congress)`;
const pdCreditDust = (name) =>
  `${name} — dominio público (Wikimedia Commons)`;

const es = {
  title: 'Galería de dominio público',
  description:
    'Lee fotografías históricas libres de derechos — pioneros, iconos documentales y clásicos de la FSA.',
  questions: {
    'pd-01': {
      text: 'A menudo se presenta como la fotografía más antigua conservada. ¿Quién la realizó?',
      answers: {
        b: 'Nicéphore Niépce (heliografía)',
        c: 'William Henry Fox Talbot (calotipo)',
        d: 'Eugène Atget (viejos oficios de París)',
        a: 'Louis Daguerre (daguerrotipo)',
      },
      explanation:
        'El Point de vue du Gras de Niépce (hacia 1826–27) es la fotografía conservada más antigua conocida.',
      imageAlt: 'Vista granulada de tejados desde una ventana, foto muy antigua',
      imageCredit: pdCredit('Nicéphore Niépce'),
    },
    'pd-02': {
      text: 'El Boulevard du Temple de Daguerre parece casi vacío. ¿Por qué aún se ve a un limpiabotas?',
      answers: {
        d: 'Daguerre usó un flash para congelar a los demás',
        a: 'Los peatones se borraron en el revelado',
        c: 'París estaba cerrado aquel día por un desfile real',
        b: 'La exposición larga difuminó a la muchedumbre en movimiento; solo alguien inmóvil quedó registrado',
      },
      explanation:
        'Los primeros daguerrotipos pedían varios minutos de luz. Los peatones en movimiento desaparecían; un cliente quieto permanecía.',
      imageAlt: 'Boulevard parisino con una pequeña silueta en el limpiabotas',
      imageCredit: pdCredit('Louis Daguerre'),
    },
    'pd-03': {
      text: 'La secuencia del caballo de Muybridge resolvió ¿qué pregunta célebre?',
      answers: {
        d: 'Si la película química es más rápida que lo digital',
        a: 'Si los caballos sueñan en color',
        b: 'Si las cuatro pezuñas dejan el suelo al galope',
        c: 'Si los caballos prefieren girar a la izquierda',
      },
      explanation:
        'The Horse in Motion demostró que un caballo al galope queda un instante enteramente en el aire.',
      imageAlt: 'Secuencia de un caballo y su jinete al galope',
      imageCredit: pdCredit('Eadweard Muybridge'),
    },
    'pd-04': {
      text: '¿A qué tradición de investigación pertenece la figura caminante de Marey?',
      answers: {
        d: 'La vigilancia por infrarrojos',
        c: 'El collage cubista',
        a: 'La pose de moda editorial',
        b: 'La cronofotografía — estudiar el movimiento con exposiciones cadenciadas',
      },
      explanation:
        'La cronofotografía de Marey disecciona el movimiento para la ciencia — prima hermana del cine.',
      imageAlt: 'Múltiples exposiciones superpuestas de un hombre que camina',
      imageCredit: pdCredit('Étienne-Jules Marey'),
    },
    'pd-05': {
      text: 'La marina de Le Gray parece demasiado detallada a la vez en el cielo y en el agua. ¿Técnica probable?',
      answers: {
        a: 'HDR de smartphone ya en 1857',
        d: 'Disparar bajo el agua en una caja de cristal',
        b: 'Combinar negativos (o exposiciones adaptadas) para cielo y mar',
        c: 'Pintar las nubes únicamente sobre la copia',
      },
      explanation:
        'Le Gray era célebre por casar un cielo dramático con un mar bien expuesto — un ensamblaje precoz.',
      imageAlt: 'Marina con ola dramática y cielo nublado',
      imageCredit: pdCredit('Gustave Le Gray'),
    },
    'pd-06': {
      text: 'Este retrato de estudio de Baudelaire es de ¿qué fotógrafo francés pionero?',
      answers: {
        b: 'Nadar (retratos parisinos del XIX)',
        d: 'Brassaï (París nocturno)',
        a: 'Henri Cartier-Bresson (momento decisivo)',
        c: 'Robert Doisneau (calle humanista)',
      },
      explanation:
        'Nadar fotografió a la élite literaria y artística del París del siglo XIX.',
      imageAlt: 'Retrato de Charles Baudelaire',
      imageCredit: pdCredit('Nadar'),
    },
    'pd-07': {
      text: 'Los retratos suaves y atmosféricos de Cameron se acercan a ¿qué estética?',
      answers: {
        a: 'La foto de prensa con flash duro',
        b: 'El pictorialismo — la foto que busca la emoción pictórica',
        d: 'La iluminación packshot de producto',
        c: 'La cartografía por satélite',
      },
      explanation:
        'Julia Margaret Cameron asume el desenfoque y la alegoría — un puente hacia el pictorialismo.',
      imageAlt: 'Retrato con desenfoque suave de Julia Margaret Cameron',
      imageCredit: pdCredit('Julia Margaret Cameron'),
    },
    'pd-08': {
      text: 'Los escaparates y calles de Atget documentan sobre todo…',
      answers: {
        b: 'Un París cotidiano que está desapareciendo',
        a: 'Decorados de cine hollywoodiense',
        c: 'Solo coronaciones reales',
        d: 'Campos de color abstractos',
      },
      explanation:
        'Atget inventarió el viejo París — oficios, fachadas, calles vacías — antes de que la modernización lo borrara.',
      imageAlt: 'Escaparates parisinos en la avenida des Gobelins por Atget',
      imageCredit: pdCredit('Eugène Atget'),
    },
    'pd-09': {
      text: 'En The Steerage de Stieglitz, ¿qué leer primero en el encuadre?',
      answers: {
        c: 'Un logo de neón en la esquina',
        d: 'Los cuadrados de autofoco',
        b: 'Una geometría fuerte que separa cubiertas / espacios sociales',
        a: 'Solo la marca de la chimenea del barco',
      },
      explanation:
        'La fuerza de la imagen es estructural: diagonales, pasarelas y clases separadas por la arquitectura del buque.',
      imageAlt: 'Pasajeros en las cubiertas inferior y superior de un barco',
      imageCredit: pdCredit('Alfred Stieglitz'),
    },
    'pd-10': {
      text: 'Lewis Hine fotografió sobre todo a los niños de las fábricas para…',
      answers: {
        d: 'Promover jornadas de fábrica más largas',
        b: 'Documentar abusos e impulsar reformas sociales',
        c: 'Entrenar modelos de IA',
        a: 'Vender lookbooks de moda',
      },
      explanation:
        'El trabajo de Hine para el National Child Labor Committee ayudó a mover la opinión y la ley.',
      imageAlt: 'Niño obrero joven junto a maquinaria de fábrica',
      imageCredit: pdCredit('Lewis Hine'),
    },
    'pd-11': {
      text: 'Migrant Mother de Lange (1936) se realizó en el marco de ¿qué programa estadounidense?',
      answers: {
        c: 'Una campaña privada de perfume',
        d: 'La carta fundacional de Magnum Photos',
        b: 'La documentación de la Farm Security Administration (FSA)',
        a: 'La comunicación de la NASA Apollo',
      },
      explanation:
        'Las fotos FSA son obras federales estadounidenses — un corpus documental de dominio público fundamental.',
      imageAlt: 'Madre indigente con sus hijos durante la Gran Depresión',
      imageCredit: pdCreditUs('Dorothea Lange / FSA'),
    },
    'pd-12': {
      text: 'Los retratos frontales de aparceros de Walker Evans (como Allie Mae Burroughs) insisten en…',
      answers: {
        b: 'Una confrontación directa y sobria — dignidad sin pose sentimental',
        c: 'Un alisado de piel tipo Instagram',
        a: 'Softboxes de glamour y máquinas de viento',
        d: 'El humor ojo de pez',
      },
      explanation:
        'Los retratos FSA/RA de Evans son casi tipológicos: luz clara, mirada a la altura, drama mínimo.',
      imageAlt: 'Retrato frontal cerrado de Allie Mae Burroughs',
      imageCredit: pdCreditUs('Walker Evans / FSA'),
    },
    'pd-13': {
      text: 'Esta escena del Dust Bowl comunica sobre todo…',
      answers: {
        d: 'Un bodegón de frutas en estudio',
        c: 'Un desfile de victoria deportiva',
        b: 'Una crisis ambiental y social a través del clima y los cuerpos en el espacio',
        a: 'Una postal de vacaciones en la playa',
      },
      explanation:
        'Los fotógrafos FSA convirtieron polvo, viento y éxodo en pruebas legibles para el público.',
      imageAlt: 'Siluetas caminando en una tormenta de polvo',
      imageCredit: pdCreditDust(
        'Gobierno de EE. UU. / documentación Dust Bowl'
      ),
    },
    'pd-14': {
      text: 'American Gothic de Gordon Parks (1942) cita el cuadro de Grant Wood. ¿Cuál es el giro crítico?',
      answers: {
        c: 'Es un selfie en la torre Eiffel',
        d: 'Quita todas las herramientas del encuadre',
        a: 'Publicita maquinaria agrícola',
        b: 'Una mujer de limpieza negra con fregona y escoba sustituye a la pareja de granjeros — raza y trabajo en la capital',
      },
      explanation:
        'La imagen FSA/OWI de Parks reutiliza un icono estadounidense para confrontar segregación y trabajo de servicio en Washington.',
      imageAlt: 'Mujer con fregona y escoba delante de una bandera estadounidense',
      imageCredit: pdCreditUs('Gordon Parks / FSA-OWI'),
    },
    'pd-15': {
      text: 'Los retratos en color de Prokudin-Gorsky (como el emir de Bujará) ¿cómo se hacían?',
      answers: {
        a: 'Con un sensor CMOS de teléfono moderno',
        c: 'Pintando a mano cada copia únicamente',
        d: 'Con Kodachrome a la venta libre ya en 1911',
        b: 'Tres exposiciones en blanco y negro a través de filtros de color, recombinadas después',
      },
      explanation:
        'Su procedimiento tricromo da colores precoces impactantes del Imperio ruso — en gran parte dominio público vía escaneos LoC.',
      imageAlt: 'Retrato en color del emir de Bujará con traje ornamentado',
      imageCredit: pdCreditLoc('Serguéi Prokudin-Gorski'),
    },
    'pd-16': {
      text: 'The Open Door de Talbot (1844) ayudó a mostrar ¿qué ventaja de su procedimiento sobre el daguerrotipo?',
      answers: {
        d: 'Ya no hace falta luz en absoluto',
        c: 'El autofoco integrado',
        b: 'Un negativo de papel que permitía varias copias positivas',
        a: 'El color instantáneo sin filtros',
      },
      explanation:
        'El flujo negativo–positivo del calotipo es el antepasado de la copia en plata clásica.',
      imageAlt: 'Puerta abierta con una escoba, calotipo antiguo de Talbot',
      imageCredit: pdCreditMet('William Henry Fox Talbot'),
    },
    'pd-17': {
      text: 'Este célebre retrato de Lincoln (1860) se asocia a ¿qué estudio estadounidense?',
      answers: {
        b: 'El estudio de Mathew Brady',
        a: 'Magnum Photos París (cooperativa)',
        d: 'Instagram Studios Chicago (red social)',
        c: 'El cuarto oscuro de Ansel Adams en Yosemite',
      },
      explanation:
        'El estudio Brady (y sus operadores) moldeó la imaginería política de la Guerra de Secesión — el retrato como herramienta de campaña.',
      imageAlt: 'Retrato de estudio de Abraham Lincoln, 1860',
      imageCredit: pdCredit('Estudio Mathew Brady'),
    },
    'pd-18': {
      text: 'Bandit’s Roost de Riis usa sobre todo la fotografía para…',
      answers: {
        c: 'Enseñar coreografía de ballet',
        b: 'Exponer la miseria de los conventillos e impulsar reformas urbanas',
        a: 'Vender folletos inmobiliarios de lujo',
        d: 'Publicitar solo marcas de cigarros',
      },
      explanation:
        'How the Other Half Lives mezcla callejones con flash y alegato — un choque documental social precoz.',
      imageAlt: 'Estrecho callejón neoyorquino abarrotado, Bandit’s Roost',
      imageCredit: pdCredit('Jacob Riis'),
    },
    'pd-19': {
      text: 'Blessed Art Thou Among Women de Käsebier tiene un aire pictórico. Eso la acerca sobre todo a…',
      answers: {
        d: 'Los estrobos de deporte congelado',
        b: 'El pictorialismo — tono suave, alegoría y atmósfera emocional',
        a: 'Una iluminación de catálogo de producto muy dura',
        c: 'Los relevamientos de cartografía aérea',
      },
      explanation:
        'Gertrude Käsebier fue una figura mayor del pictorialismo — una foto que busca el sentimiento poético y pictórico.',
      imageAlt: 'Madre e hijo en una escena pictorialista suave en el umbral',
      imageCredit: pdCreditNga('Gertrude Käsebier'),
    },
    'pd-20': {
      text: 'Los primeros planos de plantas de Blossfeldt invitan a ver la naturaleza como…',
      answers: {
        d: 'Una lámina de logos de equipos deportivos',
        b: 'Arquitectura y diseño — forma, ritmo y estructura',
        a: 'Una simple lista de precios de jardinería',
        c: 'Un juego de iconos meteorológicos',
      },
      explanation:
        'Urformen der Kunst trata los detalles botánicos como módulos modernistas.',
      imageAlt: 'Fotografía botánica ampliada de un tallo por Karl Blossfeldt',
      imageCredit: pdCredit('Karl Blossfeldt'),
    },
    'pd-21': {
      text: 'En el autorretrato «New Woman» de Johnston (1896), ¿qué leer en la pose?',
      answers: {
        b: 'Una afirmación puesta en escena de independencia — bicicleta, cerveza, cigarrillo y postura informal',
        c: 'Una página de manual de ejercicio militar',
        d: 'Una tarjeta de título de cine mudo',
        a: 'Un simple accidente de vestuario',
      },
      explanation:
        'Frances Benjamin Johnston juega con accesorios y actitud para caricaturizar / reivindicar una feminidad moderna.',
      imageAlt:
        'Mujer sentada de forma informal con bicicleta y cigarrillo, autorretrato 1896',
      imageCredit: pdCreditLoc('Frances Benjamin Johnston'),
    },
    'pd-22': {
      text: 'Muchas fotos FSA / de agencias federales de EE. UU. suelen ser reutilizables porque…',
      answers: {
        a: 'Las obras del gobierno federal de EE. UU. en general no están protegidas por copyright',
        b: 'Toda foto en B/N de más de 10 años es libre en todo el mundo',
        c: 'Instagram siempre renuncia a los derechos sobre imágenes históricas',
        d: 'Solo las tiendas de museos pueden usarlas',
      },
      explanation:
        'Las obras federales de EE. UU. forman un corpus clásico de dominio público — verifica de todos modos el archivo exacto y posibles capas posteriores.',
      imageAlt: 'Migrant Mother — fotografía documental FSA',
      imageCredit: pdCreditFed('Dorothea Lange'),
    },
    'pd-23': {
      text: 'El Point de vue du Gras de Niépce (hacia 1826–27) suele tratarse como dominio público porque…',
      answers: {
        a: 'Los plazos de protección del autor de aquella época han expirado hace mucho',
        c: 'Toda foto de una ventana es automáticamente libre',
        d: 'La UNESCO posee la exclusividad mundial a perpetuidad',
        b: 'Solo los archivos RAW entran en el dominio público',
      },
      explanation:
        'Las obras muy antiguas caen en dominio público tras largos plazos — confirma la reproducción concreta que usas.',
      imageAlt:
        'Fotografía de cámara más antigua conservada — Point de vue du Gras',
      imageCredit: pdCredit('Nicéphore Niépce'),
    },
    'pd-24': {
      text: 'Quieres imprimir una placa Muybridge de dominio público en un libro comercial. ¿El hábito más seguro?',
      answers: {
        b: 'Creer que las miniaturas de Google Images prueban cero derechos para siempre',
        d: 'Publicar solo si recreas primero el caballo con IA',
        a: 'Comprobar que el escaneo/fuente es realmente DP (no una foto moderna de museo aún protegida)',
        c: 'Nunca acreditar a los autores históricos una vez en DP',
      },
      explanation:
        'La obra subyacente puede ser DP mientras una foto moderna de la copia sigue protegida — verifica la procedencia.',
      imageAlt: 'Placa de locomoción del caballo de Muybridge',
      imageCredit: pdCredit('Eadweard Muybridge'),
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
console.log(`public-domain: added ${added} LocalizedString.es fields`);

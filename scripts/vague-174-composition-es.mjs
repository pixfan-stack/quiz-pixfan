#!/usr/bin/env node
/**
 * Vague 1.74 — add LocalizedString.es for pack composition (230 LS).
 * Idempotent: skips fields that already have non-empty es.
 * Vocab aligns with guides/composition-photo article.es
 * (regla de tercios / líneas directrices / encuadre / punto de vista).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('public/data/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const pack = data.quizzes.find((q) => q.id === 'composition');
if (!pack) throw new Error('composition not found');

const unsplash = 'Unsplash — uso libre (licencia Unsplash)';
const unsplashShort = 'Foto: Unsplash';

const es = {
  title: 'Composición y encuadre',
  description:
    'Reglas, equilibrio y relato visual — cómo se construye una imagen fuerte en el marco.',
  questions: {
    'comp-1': {
      text: 'La «regla de tercios» sugiere colocar el sujeto principal…',
      answers: {
        c: 'Solo en la esquina inferior derecha',
        b: 'Sobre líneas imaginarias que dividen el marco en tercios, o en sus intersecciones',
        d: 'Fuera del marco',
        a: 'Exactamente en el centro siempre',
      },
      explanation:
        'Dividir el marco en una cuadrícula 3×3 y situar los elementos clave en las líneas o intersecciones suele crear un equilibrio más dinámico que un encuadre muerto al centro.',
      imageAlt: 'Paisaje enmarcado por crestas montañosas',
      imageCredit: unsplash,
    },
    'comp-2': {
      text: '¿Qué técnicas pueden guiar la mirada del espectador a través de una foto?',
      answers: {
        a: 'Líneas directrices',
        b: 'Un recorte pesado al azar sin sujeto',
        c: 'Marco dentro del marco (puertas, arcos…)',
        d: 'Fuerte contraste entre sujeto y fondo',
      },
      explanation:
        'Las líneas directrices, los marcos naturales y el contraste ayudan a la jerarquía y al recorrido de la mirada. Un recorte sin sujeto claro suele debilitar la imagen.',
      imageAlt: 'Paisaje de bosque brumoso',
      imageCredit: unsplash,
    },
    'comp-3': {
      text: '¿Qué es el «espacio negativo» en fotografía?',
      answers: {
        d: 'Un filtro que invierte los colores',
        c: 'El espacio libre de la tarjeta de memoria',
        a: 'Zonas vacías o simples que dan al sujeto aire para respirar',
        b: 'Píxeles que siempre son negro puro',
      },
      explanation:
        'El espacio negativo es el área despejada alrededor del sujeto. Bien usado, lo enfatiza y puede crear calma o tensión.',
      imageAlt: 'Paisaje de lago de montaña',
      imageCredit: unsplash,
    },
    'comp-4': {
      text: 'Disparar desde un ángulo bajo (visión de gusano) suele hacer que el sujeto parezca…',
      answers: {
        a: 'Más imponente o poderoso',
        d: 'Exactamente igual que a la altura de los ojos',
        b: 'Más pequeño y débil',
        c: 'Siempre completamente desenfocado',
      },
      explanation:
        'Los ángulos bajos exageran la altura y la presencia. Los ángulos altos (visión de pájaro) suelen hacer lo contrario.',
      imageAlt: 'Paisaje de colinas verdes',
      imageCredit: unsplash,
    },
    'comp-5': {
      text: 'En un paisaje, situar el horizonte en el tercio inferior suele enfatizar…',
      answers: {
        a: 'El cielo',
        c: 'La autonomía de la batería de la cámara',
        b: 'Solo el primer plano / el suelo, nunca el cielo',
        d: 'Nada — la posición del horizonte no importa',
      },
      explanation:
        'Un horizonte bajo deja más marco al cielo (nubes dramáticas, color). Un horizonte alto favorece la tierra o el primer plano.',
      imageAlt: 'Cordillera con una línea de horizonte clara',
      imageCredit: unsplash,
    },
    'comp-6': {
      text: '¿Qué es la «curva en S» en composición?',
      answers: {
        a: 'Una técnica compositiva que usa líneas en forma de S para guiar la mirada por la imagen',
        c: 'La curvatura de la Tierra visible en planos amplios',
        d: 'Un efecto de filtro en postproducción',
        b: 'Una curva en el objetivo de la cámara',
      },
      explanation:
        'Las curvas en S crean un flujo natural por la imagen y llevan la mirada en un recorrido del primer plano al fondo.',
      imageAlt: 'Sendero del bosque que curva entre los árboles',
      imageCredit: unsplash,
    },
    'comp-7': {
      text: '¿Cómo afecta la simetría en fotografía al espectador?',
      answers: {
        a: 'Crea sensación de equilibrio, formalidad y armonía',
        d: 'No tiene ningún efecto en la percepción',
        c: 'Hace que la imagen parezca caótica',
        b: 'Siempre confunde al espectador',
      },
      explanation:
        'La simetría evoca orden, estabilidad y belleza. Es potente en arquitectura, reflejos y retratos formales.',
      imageAlt: 'Plaza urbana simétrica — el tirón calmado de la simetría',
      imageCredit: unsplash,
    },
    'comp-8': {
      text: '¿Qué elementos contribuyen al peso visual en una composición?',
      answers: {
        c: 'La posición en el marco (abajo / pesado parece más pesado)',
        a: 'Colores vivos y zonas de alto contraste',
        d: 'El ajuste ISO',
        b: 'Rostros y ojos',
      },
      explanation:
        'El peso visual depende de la intensidad del color, el contraste, el interés humano (rostros) y la colocación. El ISO es técnico, no compositivo.',
    },
    'comp-9': {
      text: '¿Qué es la composición «marco dentro del marco»?',
      answers: {
        b: 'Hacer varias fotos y enmarcarlas físicamente',
        a: 'Usar elementos naturales o arquitectónicos para crear un borde alrededor del sujeto principal',
        c: 'Usar un marco de foto como sujeto principal',
        d: 'Editar fotos con marcos digitales',
      },
      explanation:
        'Esta técnica añade profundidad, centra la atención y puede aportar contexto. Ejemplos: ventanas, puertas, ramas.',
      imageAlt: 'Sujeto enmarcado por el arco de una puerta',
      imageCredit: unsplash,
    },
    'comp-10': {
      text: '¿Por qué se considera la «espiral áurea» más dinámica que la regla de tercios?',
      answers: {
        d: 'Solo funciona con objetivos gran angular',
        b: 'Es matemáticamente imposible de lograr',
        a: 'Crea un recorrido fluido y orgánico que atrae la mirada hacia dentro de forma natural',
        c: 'Requiere objetivos especiales',
      },
      explanation:
        'Basada en la secuencia de Fibonacci, la espiral áurea crea una composición más natural y fluida que guía la mirada por varios puntos focales.',
    },
    'comp-11': {
      text: '¿Cuáles son los efectos de las líneas diagonales en la composición?',
      answers: {
        a: 'Crear sensación de movimiento y dinamismo',
        b: 'Añadir tensión o inquietud',
        c: 'Guiar la mirada a través del marco',
        d: 'Hacer que la imagen se sienta estática y calmada',
      },
      explanation:
        'Las diagonales aportan energía y dirección, a diferencia de las horizontales (calma) o verticales (estabilidad). Son potentes para la acción y el drama.',
      imageAlt: 'Crestas montañosas como líneas diagonales de energía',
      imageCredit: unsplash,
    },
    'comp-12': {
      text: '¿Qué es la «tensión visual» en fotografía?',
      answers: {
        a: 'El juego dinámico entre elementos opuestos que atrapa al espectador',
        d: 'Cuando el sujeto parece incómodo',
        b: 'Cuando la cámara tiembla durante la exposición',
        c: 'Usar demasiados colores en una sola imagen',
      },
      explanation:
        'La tensión visual nace del desequilibrio, el contraste o elementos inesperados: genera intriga y mantiene la atención.',
    },
    'comp-13': {
      text: '¿Cómo afecta el recorte a la composición?',
      answers: {
        b: 'Solo reduce la calidad de la imagen',
        d: 'Solo funciona con fotos digitales',
        c: 'No tiene impacto en la imagen final',
        a: 'Puede reforzar o debilitar la composición original al cambiar el encuadre y el énfasis',
      },
      explanation:
        'El recorte es una herramienta compositiva potente: elimina distracciones, cambia la perspectiva y redirige la atención.',
      imageAlt: 'Paisaje listo para una decisión de recorte meditada',
      imageCredit: unsplash,
    },
    'comp-14': {
      text: '¿Qué técnicas compositivas funcionan bien en fotografía minimalista?',
      answers: {
        c: 'Paleta de color limitada',
        b: 'Líneas limpias y formas geométricas',
        d: 'Fondos saturados y abarrotados',
        a: 'Espacio negativo',
      },
      explanation:
        'El minimalismo vive de la simplicidad: espacio negativo, geometría limpia y colores contenidos. El desorden contradice el estilo.',
    },
    'comp-15': {
      text: '¿Qué es el «espacio de mirada» o «nose room» en composición?',
      answers: {
        d: 'El área alrededor de la montura del objetivo',
        c: 'El espacio detrás del sujeto',
        a: 'El espacio delante de un sujeto que mira o se mueve en una dirección',
        b: 'Espacio para la nariz de la cámara',
      },
      explanation:
        'Dar al sujeto espacio hacia donde mira o se mueve evita la sensación de ahogo y resulta más natural y equilibrado.',
      imageAlt: 'Retrato con espacio de mirada / nose room delante de la mirada',
      imageCredit: unsplash,
    },
    'comp-16': {
      text: '¿Cómo afecta el contraste de color a la composición?',
      answers: {
        d: 'Hace que las imágenes se vean borrosas',
        c: 'Solo afecta a la exposición',
        b: 'No tiene efecto en la composición',
        a: 'Atrae la atención a zonas concretas y crea interés visual',
      },
      explanation:
        'Los colores complementarios o los contrastes fuertes crean focos y guían la mirada con un diseño intencional.',
      imageAlt: 'Fuerte contraste de color entre tierra y cielo',
      imageCredit: unsplash,
    },
    'comp-17': {
      text: '¿Qué aspectos hacen que una composición se sienta «equilibrada»?',
      answers: {
        c: 'Cantidades iguales de claro y oscuro',
        a: 'La distribución del peso visual en el marco',
        d: 'El ajuste ISO de la cámara',
        b: 'Simetría o equilibrio asimétrico',
      },
      explanation:
        'El equilibrio se refiere a la distribución del peso visual, no a una simetría literal. El equilibrio asimétrico puede sentirse más dinámico y seguir siendo armonioso.',
    },
    'comp-18': {
      text: '¿Cuál es el efecto de disparar desde un ángulo alto?',
      answers: {
        b: 'El sujeto parece más poderoso',
        c: 'Siempre crea distorsión',
        d: 'No tiene efecto psicológico',
        a: 'El sujeto parece más pequeño, más vulnerable o parte de una escena mayor',
      },
      explanation:
        'Los ángulos altos (mirar hacia abajo) pueden disminuir la presencia del sujeto, mostrar contexto o crear una perspectiva de pájaro.',
      imageAlt: 'Mirador en ángulo alto que comprime una escena de paisaje',
      imageCredit: unsplash,
    },
    'comp-19': {
      text: '¿Qué es la «ruptura de patrón» en composición?',
      answers: {
        b: 'Destruir patrones en postproducción',
        d: 'Evitar todos los patrones',
        c: 'Usar solo elementos aleatorios',
        a: 'Romper un patrón repetitivo con un elemento contrastante para crear un foco',
      },
      explanation:
        'Los patrones crean ritmo; romper uno atrae la atención de inmediato y genera un punto focal potente.',
    },
    'comp-20': {
      text: '¿Qué reglas compositivas se pueden romper a propósito con efecto creativo?',
      answers: {
        b: 'Mantener los horizontes nivelados',
        a: 'La regla de tercios',
        d: 'Todas las anteriores',
        c: 'Composiciones equilibradas',
      },
      explanation:
        'Las reglas son guías, no leyes. Romperlas a propósito puede crear tensión, inquietud o afirmaciones artísticas únicas.',
    },
    'comp-21': {
      text: 'Un corredor llena el marco de borde a borde sin aire. ¿Cuál es el arreglo compositivo más rápido?',
      answers: {
        c: 'Recortar más hasta que solo quede un zapato',
        d: 'Inclinar 45° para forzar un horizonte diagonal',
        a: 'Añadir un poco de espacio en la dirección del movimiento',
        b: 'Centrar siempre la cabeza en una intersección de la cuadrícula',
      },
      explanation:
        'El espacio activo (lead room) deja que el sujeto «entre» en el marco y se siente menos ahogado.',
      imageAlt: 'Corredor en movimiento',
      imageCredit: unsplash,
    },
    'comp-22': {
      text: 'Estás fotografiando una calle concurrida. ¿Cómo haces que una persona se lea como la heroína?',
      answers: {
        c: 'Usar el objetivo más angular y situarte lo más lejos posible',
        a: 'Incluir todas las caras por igual para que nadie se sienta excluido',
        d: 'Activar el HDR y esperar que el contraste lo resuelva',
        b: 'Aislar con luz, enfoque, contraste de color o encuadre',
      },
      explanation:
        'Los héroes necesitan separación: luz más brillante, enfoque más nítido, color complementario o un marco natural.',
      imageAlt: 'Calle urbana concurrida',
      imageCredit: unsplash,
    },
    'comp-23': {
      text: '¿Qué gestos suelen hacer que una instantánea se sienta más intencional?',
      answers: {
        d: 'Esperar medio segundo a un gesto más limpio',
        b: 'Nivelar el horizonte (salvo que inclines a propósito)',
        c: 'Dejar para siempre un cartel de salida distractor muerto al centro',
        a: 'Acercarte / simplificar el fondo',
      },
      explanation:
        'Intención = elecciones. Más cerca, más limpio, nivelado y a tiempo gana a «disparar y rezar».',
      imageAlt: 'Encuadre callejero intencional que eleva una instantánea',
      imageCredit: unsplash,
    },
    'comp-24': {
      text: 'Calle abarrotada: ¿cómo aíslas un sujeto sin acercarte?',
      answers: {
        a: 'Abrir a 16 mm e incluir a todo el mundo',
        b: 'Usar una focal más larga y una profundidad de campo reducida',
        c: 'Centrar siempre al sujeto con flash',
        d: 'Disparar solo panorámicas verticales',
      },
      explanation:
        'La compresión + el desenfoque separan al sujeto del desorden.',
      imageAlt: 'Calle urbana concurrida',
      imageCredit: unsplash,
    },
    'comp-25': {
      text: 'Mito: «Nunca pongas al sujeto en el centro.» ¿Cuándo está bien centrar?',
      answers: {
        a: 'Nunca — usa siempre los tercios',
        b: 'Simetría, retratos con mirada directa o un equilibrio gráfico fuerte',
        c: 'Solo para capturas de pantalla de hojas de cálculo',
        d: 'Solo al disparar en RAW',
      },
      explanation:
        'Las reglas son herramientas. Los encuadres centrados pueden sentirse intencionales y potentes.',
      imageAlt: 'Sujeto montañoso centrado — cuando centrar funciona',
      imageCredit: unsplash,
    },
    'comp-26': {
      text: 'Quieres líneas directrices hacia una figura diminuta. ¿Qué error de encuadre lo mata?',
      answers: {
        a: 'Dejar aire en el punto de fuga',
        b: 'Recortar de modo que las líneas salgan del marco antes de llegar al sujeto',
        c: 'Usar un ángulo de cámara un poco más bajo',
        d: 'Esperar una luz más suave',
      },
      explanation:
        'Las líneas directrices deben seguir apuntando al sujeto dentro del marco.',
    },
    'comp-27': {
      text: 'Brindis de boda: muchas caras. ¿Cómo mantienes clara la jerarquía?',
      answers: {
        a: 'Enfocar a los oradores / la pareja y dejar que el resto caiga más suave',
        b: 'Enfocar la lámpara más lejana',
        c: 'Usar siempre la apertura más abierta sobre el pastel',
        d: 'Barrer y desenfocar a todos los invitados por igual',
      },
      explanation:
        'Dirige la atención con el enfoque y la colocación — no con nitidez igual en todas partes.',
      imageAlt: 'Momento de celebración de boda',
      imageCredit: unsplash,
    },
    'comp-28': {
      text: 'Mesa de café: primer plano abarrotado. ¿La corrección más limpia antes de disparar?',
      answers: {
        a: 'Subir el ISO a 25600',
        b: 'Quitar o reordenar objetos, o cambiar el ángulo para simplificar',
        c: 'Añadir más servilletas por textura',
        d: 'Disparar solo a través de un cristal sucio por el ambiente',
      },
      explanation:
        'La composición empieza antes del obturador — edita la escena.',
      imageAlt: 'Escena de mesa de café',
      imageCredit: unsplash,
    },
    'comp-29': {
      text: 'Esquina urbana, líneas directrices fuertes hacia un fondo saturado. El sujeto está a media altura. ¿El mejor arreglo sin alejarte?',
      answers: {
        c: 'Solo tele máximo — la composición no importa',
        a: 'Centrar siempre y esperar que la simetría lo salve',
        d: 'Añadir un viñeteado fuerte en cámara como única solución',
        b: 'Desplazarte lateralmente / cambiar la altura para que las líneas apunten a un sujeto limpio, luego recortar con intención',
      },
      explanation:
        'Las líneas directrices son herramientas: apunta con ellas. Pequeños movimientos laterales/de altura suelen ganar al zoom en el sitio.',
      imageAlt: 'Calle urbana con fuertes líneas de perspectiva',
      imageCredit: unsplashShort,
    },
    'comp-30': {
      text: 'Retrato ambiental: rostro nítido, pero una puerta brillante detrás compite. ¿Mejor decisión compositiva?',
      answers: {
        c: 'Recortar el rostro para conservar la puerta',
        b: 'Dejar siempre la forma brillante centrada',
        a: 'Recomponer para que la forma brillante apoye (no rivalice) el rostro — o esperar una luz más suave',
        d: 'Usar la apertura más abierta e ignorar el fondo por completo',
      },
      explanation:
        'El brillo atrae la mirada. Colócalo o temporízalo para que enmarque al sujeto en lugar de pelear con él.',
    },
    'comp-31': {
      text: '¿Cuándo romper la regla de tercios suele ser más fuerte que seguirla?',
      answers: {
        a: 'Simetría deliberada / tomas de reflejo',
        b: 'Sujetos minimalistas que necesitan gravedad justo al centro',
        c: 'Toda instantánea — las reglas nunca ayudan a principiantes',
        d: 'Patrones y arquitectura donde el centro enfatiza la estructura',
      },
      explanation:
        'Las reglas guían la atención; un centro/simetría intencional puede ser más claro. Centrar al azar no es lo mismo que centrar con diseño.',
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
console.log(`composition: added ${added} LocalizedString.es fields`);

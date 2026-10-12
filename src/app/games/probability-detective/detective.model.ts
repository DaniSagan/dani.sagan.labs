export interface Experiment { name: string; detail: string; cost: number; outcomes: string[]; probabilities: number[][]; }
export interface CaseFile { title: string; story: string; suspects: string[]; prior: number[]; experiments: Experiment[]; question: string; answers: string[]; correct: number; lesson: string; }
export interface Evidence { experiment: number; outcome: number; }
const binary = (name: string, detail: string, cost: number, chances: number[], outcomes = ['Sí', 'No']): Experiment => ({ name, detail, cost, outcomes, probabilities: chances.map(p => [p, 1 - p]) });
const coin = (title: string, story: string, chances: number[], prior = [1, 1, 1]): CaseFile => ({
  title, story, suspects: chances.map(p => `Moneda con ${Math.round(p * 100)} % de caras`), prior,
  experiments: [binary('Lanzamiento individual', 'Un lanzamiento independiente de la moneda incautada.', 2, chances, ['Cara', 'Cruz']), binary('Tres caras seguidas', 'Tres lanzamientos nuevos: solo se informa si todos son cara.', 4, chances.map(p => p ** 3), ['Tres caras', 'Otra secuencia'])],
  question: 'Después de varias caras, ¿qué ocurre con el siguiente lanzamiento si conocemos la moneda?', answers: ['La cruz se vuelve obligatoria.', 'Conserva la misma probabilidad de cara.', 'La probabilidad de cara siempre aumenta.'], correct: 1,
  lesson: 'Los lanzamientos son independientes dado el modelo. Las observaciones cambian nuestra creencia sobre la moneda, no su mecanismo. Para tres caras independientes, la probabilidad es p³.'
});
const urn = (title: string, story: string, chances: number[], prior = [1, 1, 1]): CaseFile => ({
  title, story, suspects: chances.map(p => `Urna con ${Math.round(p * 100)} % rojas`), prior,
  experiments: [binary('Extraer una bola', 'Se devuelve la bola y se mezcla antes de cada extracción.', 2, chances, ['Roja', 'Azul']), binary('Pareja del mismo color', 'Dos extracciones nuevas con devolución. Se registra si coinciden.', 3, chances.map(p => p * p + (1 - p) ** 2), ['Iguales', 'Distintas'])],
  question: '¿Qué limitación tiene observar únicamente parejas del mismo color?', answers: ['No distingue una urna con p rojas de otra con 1 − p.', 'Identifica siempre la urna exacta.', 'Las parejas nunca pueden ser azules.'], correct: 0,
  lesson: 'P(iguales) = p² + (1 − p)². Es la misma para p y 1 − p: una prueba puede ser barata y aun así no separar dos hipótesis. Combina experimentos.'
});
const sensor = (title: string, story: string, prior: number[], rates: number[], audit: number[]): CaseFile => ({
  title, story, suspects: ['Funcionamiento normal', 'Avería intermitente', 'Manipulación deliberada'], prior,
  experiments: [binary('Leer la alarma', 'Lectura nueva e independiente bajo cada hipótesis.', 2, rates, ['Alarma', 'Sin alarma']), binary('Auditar el registro', 'Revisión independiente más cara, con distinta sensibilidad.', 5, audit, ['Anomalía', 'Registro limpio'])],
  question: '¿Una alarma muy sensible demuestra que hay manipulación?', answers: ['Sí, sensibilidad significa certeza.', 'Sí, si ignoramos los registros limpios.', 'No: hay que considerar falsos positivos y probabilidades previas.'], correct: 2,
  lesson: 'Bayes combina la frecuencia previa de cada causa con la probabilidad de la evidencia bajo esa causa. Una causa rara necesita evidencia más fuerte; un positivo no equivale a una condena.'
});
export const CASES: CaseFile[] = [
  coin('01 · La moneda del vestíbulo', 'El casino ha entregado tres modelos de moneda. Identifica cuál se usaba en la mesa del vestíbulo.', [.2, .5, .8]),
  urn('02 · El almacén azul', 'Han cambiado la etiqueta de un contenedor. Investiga su composición sin abrirlo por completo.', [.15, .5, .85]),
  coin('03 · Racha de medianoche', 'Un jugador denuncia una racha sospechosa. No confundas una coincidencia con una prueba.', [.35, .5, .7]),
  urn('04 · Mensajes en parejas', 'Solo llegan informes de parejas de bolas. Decide cuándo merece la pena pedir una extracción individual.', [.2, .5, .8]),
  coin('05 · La pieza de coleccionista', 'Las monedas equilibradas son cuatro veces más comunes que cada modelo trucado.', [.25, .5, .75], [1, 4, 1]),
  urn('06 · El último envío', 'Cierra el primer expediente: tres proveedores, composiciones cercanas y un presupuesto limitado.', [.3, .5, .7]),
  sensor('07 · Alarma en el museo', 'Una alarma no identifica al culpable. La manipulación es poco frecuente en este museo.', [8, 2, 1], [.15, .55, .85], [.05, .45, .9]),
  sensor('08 · El registro borrado', 'Los sensores de avería y sabotaje se parecen. La auditoría puede separarlos.', [3, 2, 2], [.1, .7, .75], [.1, .2, .85]),
  urn('09 · El proveedor habitual', 'El proveedor central realiza seis de cada ocho envíos. Esa información también cuenta.', [.2, .5, .8], [1, 6, 1]),
  sensor('10 · Falsos positivos', 'El edificio antiguo dispara alarmas incluso cuando todo funciona. Elige bien tus pruebas.', [6, 2, 1], [.4, .65, .8], [.08, .4, .9]),
  coin('11 · Ventaja mínima', 'El fraude es sutil. Una muestra pequeña puede favorecer la hipótesis equivocada.', [.4, .5, .6]),
  sensor('12 · La sala de servidores', 'La sospecha inicial de sabotaje es alta, pero el diagnóstico todavía exige observaciones.', [1, 2, 5], [.2, .6, .85], [.1, .45, .8]),
  urn('13 · Gemelas opuestas', 'Dos urnas tienen colores invertidos. Las parejas por sí solas no resolverán el misterio.', [.1, .5, .9]),
  sensor('14 · Señales contradictorias', 'Una alarma y una auditoría pueden apuntar en direcciones distintas. Conserva toda la evidencia.', [4, 3, 1], [.15, .8, .5], [.1, .3, .9]),
  coin('15 · El favorito improbable', 'La moneda muy sesgada es rara. Descubre cuándo los datos superan esa desventaja inicial.', [.3, .5, .8], [4, 8, 1]),
  urn('16 · La prueba económica', 'Las parejas son una pista útil, pero su valor depende de qué hipótesis sigan abiertas.', [.25, .55, .85], [2, 3, 2]),
  sensor('17 · El falso culpable', 'El patrón más alarmante también puede deberse a una avería. No cierres el caso por intuición.', [5, 4, 1], [.1, .85, .9], [.05, .35, .85]),
  sensor('18 · Operación incertidumbre', 'Último expediente: separa tres causas cercanas, administra los recursos y calibra tu confianza.', [3, 3, 2], [.3, .55, .75], [.2, .5, .85])
];
const deductions: [number, string, string[], number, string][] = [
  [2, 'Si una moneda con p = 0,5 produce cinco caras, ¿qué probabilidad tiene la sexta cara?', ['1/6, porque ya hubo muchas caras.', '1/2, por independencia.', '1, porque la racha continuará.'], 1, 'Una racha no altera una moneda fija. La probabilidad del siguiente resultado sigue siendo p. Lo que puede cambiar es nuestra creencia sobre cuál moneda tenemos.'],
  [4, 'Dos modelos explican igual una pista. Si uno era cuatro veces más probable antes, ¿qué pasa después?', ['Pasan a ser igual de probables.', 'Se invierten sus probabilidades.', 'La razón sigue siendo cuatro a uno.'], 2, 'Las odds posteriores son las odds previas multiplicadas por la razón de verosimilitudes. Si esa razón vale uno, la evidencia no cambia sus probabilidades relativas.'],
  [5, '¿Qué garantiza una muestra mayor bajo extracciones independientes con devolución?', ['Menor variabilidad de la proporción, no certeza en cada partida.', 'Que desaparezcan todos los resultados azules.', 'Que las probabilidades de la urna cambien.'], 0, 'Para n ensayos Bernoulli independientes, la varianza de la proporción es p(1 − p)/n. Más datos mejoran la precisión promedio, aunque ninguna muestra finita garantiza identificar el modelo.'],
  [7, 'Dos hipótesis activan alarmas casi igual. ¿Qué prueba conviene para distinguirlas?', ['Otra alarma, siempre.', 'Una prueba con probabilidades más diferentes entre ambas.', 'La que tenga el nombre más convincente.'], 1, 'La capacidad de discriminar depende de la diferencia entre las distribuciones de resultados. En este caso, las auditorías separan avería y manipulación mejor que las alarmas. El coste también importa.'],
  [8, 'Una hipótesis era muy frecuente antes. ¿Se puede descartar con nuevos datos?', ['Nunca: la frecuencia previa decide todo.', 'Sí: evidencia suficientemente fuerte puede superar la ventaja previa.', 'Solo tras obtener una pista imposible.'], 1, 'Los previos no son un veredicto. Bayes permite revisarlos cuando las observaciones son mucho más probables bajo otra hipótesis. Acumular evidencia consistente puede cambiar el favorito.'],
  [9, '¿Qué es un falso positivo en una alarma?', ['Una alarma cuando el funcionamiento es normal.', 'Una avería sin alarma.', 'Una prueba que cuesta demasiados créditos.'], 0, 'Un falso positivo es una alarma sin la causa que intentamos detectar. Si es frecuente, una alarma aporta menos evidencia de lo que sugiere nuestra intuición.'],
  [10, '¿Un 55 % posterior para una hipótesis justifica declarar certeza absoluta?', ['Sí: basta superar el 50 %.', 'Sí: las demás hipótesis ya son imposibles.', 'No: las alternativas aún suman un 45 %.'], 2, 'Ser la hipótesis más probable no equivale a ser cierta. Declarar demasiada confianza empeora la calibración y la regla de Brier penaliza especialmente las certezas equivocadas.'],
  [11, 'Antes de observar pistas, ¿qué debe mostrar el cuaderno bayesiano?', ['Siempre un tercio para cada causa.', 'Las probabilidades previas normalizadas.', 'Un 100 % para la causa más común.'], 1, 'Sin evidencia, la posterior coincide con la previa. Los pesos 1, 2 y 5 corresponden a 12,5 %, 25 % y 62,5 %, respectivamente.'],
  [12, 'Si observas veinte parejas iguales, ¿puedes distinguir las urnas con 10 % y 90 % rojas?', ['Sí: veinte pruebas siempre bastan.', 'No con esa prueba: ambas tienen idéntica probabilidad de coincidencia.', 'Sí: iguales significa dos rojas.'], 1, 'Ambas urnas generan parejas iguales con probabilidad 0,1² + 0,9² = 0,82. Más repeticiones de una prueba indistinguible no separan esas dos hipótesis. Una extracción individual sí puede hacerlo.'],
  [13, 'Una nueva pista contradice tu sospecha. ¿Qué debes hacer con los resultados anteriores?', ['Borrarlos y empezar solo con la última pista.', 'Ignorar la pista nueva.', 'Combinar toda la evidencia bajo el mismo modelo.'], 2, 'Las observaciones independientes aportan factores de verosimilitud que se multiplican. Seleccionar únicamente las pistas favorables produce una conclusión sesgada.'],
  [14, 'Una pista es dos veces más probable con A que con B, pero B tenía ocho veces más peso previo. ¿Qué favorece una sola pista?', ['A con el doble de peso.', 'B con cuatro veces el peso de A.', 'Empate entre A y B.'], 1, 'Las odds A/B pasan de 1/8 a (1/8) × 2 = 1/4. La pista favorece A, pero todavía no supera la ventaja inicial de B.'],
  [15, '¿Qué significa que una prueba tenga mayor información esperada por crédito?', ['Que garantiza acertar en la siguiente prueba.', 'Que produce siempre el resultado más raro.', 'Que reduce más incertidumbre en promedio por su coste.'], 2, 'La ganancia de información promedia todos los posibles resultados según las creencias actuales. No promete un desenlace concreto, y cambia a medida que se actualiza la posterior.'],
  [16, 'Dos causas disparan alarmas con probabilidades 0,85 y 0,90. ¿Una alarma las separa mucho?', ['No: el cociente 0,90/0,85 está cerca de uno.', 'Sí: prueba inequívoca de la segunda causa.', 'Las probabilidades deben sumarse y superar uno.'], 0, 'La razón de verosimilitudes mide cuánto cambia una pista las odds relativas. 0,90/0,85 ≈ 1,06: una alarma discrimina muy poco entre estas dos causas.'],
  [17, 'Si una hipótesis con posterior 80 % resulta falsa, ¿demuestra que Bayes estaba mal?', ['Sí: 80 % significa que debe acertar siempre.', 'No: un resultado con probabilidad 20 % puede ocurrir.', 'Sí: solo son válidas probabilidades de 0 o 100 %.'], 1, 'Una probabilidad no es una garantía. Para evaluar calibración hacen falta muchas predicciones: en un conjunto bien calibrado de casos al 80 %, aproximadamente ocho de cada diez serían correctos.']
];
for (const [index, question, answers, correct, lesson] of deductions) Object.assign(CASES[index], { question, answers, correct, lesson });
export function normalize(values: number[]): number[] { const sum = values.reduce((a, b) => a + b, 0); return values.map(v => v / sum); }
export function posterior(file: CaseFile, evidence: Evidence[]): number[] {
  const logs = file.prior.map((p, h) => Math.log(p) + evidence.reduce((s, e) => s + Math.log(file.experiments[e.experiment].probabilities[h][e.outcome]), 0));
  const max = Math.max(...logs); return normalize(logs.map(v => Math.exp(v - max)));
}
export function draw(probabilities: number[], random: number): number { let sum = 0; return probabilities.findIndex((p, i) => { sum += p; return random < sum || i === probabilities.length - 1; }); }
export function information(file: CaseFile, evidence: Evidence[], experiment: number): number {
  const belief = posterior(file, evidence), entropy = (p: number[]) => -p.reduce((s, v) => s + (v > 0 ? v * Math.log2(v) : 0), 0);
  const test = file.experiments[experiment];
  return Math.max(0, entropy(belief) - test.outcomes.reduce((s, _, outcome) => {
    const probability = belief.reduce((a, p, h) => a + p * test.probabilities[h][outcome], 0);
    return s + probability * entropy(posterior(file, [...evidence, { experiment, outcome }]));
  }, 0));
}
export function score(choice: number, confidence: number, truth: number, remaining: number, reasoning: boolean): number {
  const predictions = [0, 1, 2].map(h => h === choice ? confidence / 100 : (1 - confidence / 100) / 2);
  const brier = predictions.reduce((s, p, h) => s + (p - (h === truth ? 1 : 0)) ** 2, 0);
  return Math.round(60 * (1 - brier / 2) + (choice === truth ? 20 : 0) + remaining / 4 + (reasoning ? 10 : 0));
}

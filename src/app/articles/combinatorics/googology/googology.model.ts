/** Article-owned algorithms; bounded exact integers, work and recursion. */
export const DIGIT_LIMIT = 200;
const CAP = 10n ** BigInt(DIGIT_LIMIT) - 1n;
export type Knowledge = 'Exacto' | 'Aproximado' | 'Simbólico' | 'No calculado' | 'Desconocido';
export interface NumberResult { status: Knowledge; tex: string; value: bigint | null; digits: string; reason: string; }
function integer(n: number, min: number, max: number): void {
  if (!Number.isInteger(n) || n < min || n > max) throw new RangeError(`Introduce un entero entre ${min} y ${max}.`);
}
class Budget {
  work = 8000;
  spend(): void { if (--this.work < 0) throw new RangeError('Límite de trabajo'); }
  cap(n: bigint): bigint { if (n > CAP) throw new RangeError('Límite de cifras'); return n; }
  power(a: bigint, b: bigint): bigint {
    let result = 1n, factor = a;
    while (b > 0n) {
      this.spend();
      if (b % 2n) result = this.cap(result * factor);
      b /= 2n;
      if (b) factor = this.cap(factor * factor);
    }
    return result;
  }
  hyper(a: bigint, rank: number, b: bigint): bigint {
    this.spend();
    if (rank === 1) return this.cap(a + b);
    if (rank === 2) return this.cap(a * b);
    if (rank === 3) return this.power(a, b);
    let result = 1n;
    for (let i = 0n; i < b; i++) { this.spend(); result = this.hyper(a, rank - 1, result); }
    return result;
  }
}
export function operationTex(a: number, rank: number, b: string): string {
  if (rank === 1) return `${a}+\\left(${b}\\right)`;
  if (rank === 2) return `${a}\\cdot\\left(${b}\\right)`;
  if (rank === 3) return `${a}^{\\left(${b}\\right)}`;
  return `${a}\\uparrow^{${rank - 2}}\\left(${b}\\right)`;
}
export function factory(base: number, operand: number, rank: number, iterations: number): NumberResult {
  integer(base, 2, 10); integer(operand, 0, 6); integer(rank, 1, 6); integer(iterations, 1, 6);
  const budget = new Budget();
  let value: bigint | null = BigInt(operand), tex = String(operand), reason = '', digits = '';
  for (let i = 0; i < iterations; i++) {
    tex = operationTex(base, rank, tex);
    if (value !== null) {
      const knownDigits = base === 10 && rank === 3 ? String(value + 1n) : '';
      try { value = budget.hyper(BigInt(base), rank, value); digits = String(value.toString().length); }
      catch (error) { value = null; digits = knownDigits; reason = (error as Error).message; }
    } else digits = '';
  }
  return { status: value === null ? 'Simbólico' : 'Exacto', tex, value, digits: digits || 'No calculado', reason };
}
export function towerTex(base: number, height: number): string {
  integer(base, 2, 10); integer(height, 0, 12);
  if (height > 5) return `{}^{${height}}${base}=${base}\\uparrow\\uparrow ${height}`;
  let result = '1';
  for (let i = 0; i < height; i++) result = i === 0 ? String(base) : `${base}^{\\left(${result}\\right)}`;
  return result;
}
export function tower(base: number, height: number): NumberResult {
  integer(base, 2, 10); integer(height, 0, 12);
  try { const value = new Budget().hyper(BigInt(base), 4, BigInt(height)); return { status: 'Exacto', value, tex: towerTex(base, height), digits: String(value.toString().length), reason: '' }; }
  catch (error) { return { status: 'Simbólico', value: null, tex: towerTex(base, height), digits: 'No calculado', reason: (error as Error).message }; }
}
/** Finite Wainer levels: F0(n)=n+1, F(k+1)(n)=Fk iterated n times at n. */
export function fastGrowth(level: number, n: number): NumberResult {
  integer(level, 0, 4); integer(n, 0, 12);
  const budget = new Budget();
  const evaluate = (k: number, x: bigint): bigint => {
    budget.spend();
    if (k === 0) return budget.cap(x + 1n);
    if (k === 1) return budget.cap(2n * x);
    if (k === 2) return budget.cap(x * budget.power(2n, x));
    let result = x;
    for (let i = 0n; i < x; i++) { budget.spend(); result = evaluate(k - 1, result); }
    return result;
  };
  const tex = `F_{${level}}(${n})`;
  try { const value = evaluate(level, BigInt(n)); return { status: 'Exacto', value, tex, digits: String(value.toString().length), reason: '' }; }
  catch (error) { return { status: 'Simbólico', value: null, tex, digits: 'No calculado', reason: (error as Error).message }; }
}
export const GROWTH_FUNCTIONS = [
  { id: 'linear', label: 'n', color: '#65b5ff' }, { id: 'square', label: 'n²', color: '#eabf63' },
  { id: 'exp', label: '2ⁿ', color: '#f18d76' }, { id: 'factorial', label: 'n!', color: '#b9a0f5' },
  { id: 'self', label: 'nⁿ', color: '#82d9ac' }, { id: 'tower', label: '2 ↑↑ n', color: '#ed9cd2' },
  { id: 'f2', label: 'F₂(n)', color: '#b8ce71' },
] as const;
export type GrowthId = typeof GROWTH_FUNCTIONS[number]['id'];
export function growth(id: GrowthId, n: number): NumberResult {
  integer(n, 1, 12);
  if (id === 'tower') return tower(2, n);
  if (id === 'f2') return fastGrowth(2, n);
  let value = BigInt(n);
  if (id === 'square') value *= value;
  if (id === 'exp') value = 2n ** BigInt(n);
  if (id === 'factorial') { value = 1n; for (let i = 2; i <= n; i++) value *= BigInt(i); }
  if (id === 'self') value **= BigInt(n);
  return { status: 'Exacto', value, tex: GROWTH_FUNCTIONS.find(f => f.id === id)!.label, digits: String(value.toString().length), reason: '' };
}
export function logInteger(value: bigint): number {
  if (value <= 0n) throw new RangeError('El logaritmo exige un entero positivo.');
  const digits = value.toString(), first = digits.slice(0, 15);
  return digits.length - first.length + Math.log10(Number(first));
}
export function writingEstimate(digits: string, millimetres: number, rate: number): { logMetres: number; logSeconds: number; logAu: number; logYears: number } {
  if (!/^[1-9]\d{0,119}$/.test(digits)) throw new RangeError('Usa un entero positivo de hasta 120 cifras.');
  if (!Number.isFinite(millimetres) || millimetres < 0.01 || millimetres > 1000 || !Number.isFinite(rate) || rate < 0.01 || rate > 1e12) throw new RangeError('Longitud y velocidad fuera del intervalo permitido.');
  const logDigits = logInteger(BigInt(digits));
  const logMetres = logDigits + Math.log10(millimetres / 1000), logSeconds = logDigits - Math.log10(rate);
  return { logMetres, logSeconds, logAu: logMetres - Math.log10(149597870700), logYears: logSeconds - Math.log10(31557600) };
}
export function scientific(log: number): string {
  const exponent = Math.floor(log), mantissa = 10 ** (log - exponent), rounded = Number(mantissa.toPrecision(3));
  return rounded >= 10 ? `1 × 10^${exponent + 1}` : `${rounded} × 10^${exponent}`;
}
/** Accepts only a single ordinary power. */
export function lastDigits(base: string, exponent: string, digits: number): string {
  integer(digits, 1, 12);
  if (!/^\d{1,30}$/.test(base) || !/^\d{1,100}$/.test(exponent)) throw new RangeError('Base: hasta 30 cifras. Exponente: hasta 100 cifras. Solo enteros no negativos.');
  if (BigInt(base) === 0n && BigInt(exponent) === 0n) throw new RangeError('La expresión 0⁰ no se admite.');
  const modulus = 10n ** BigInt(digits);
  let factor = BigInt(base) % modulus, power = BigInt(exponent), result = 1n;
  while (power) { if (power % 2n) result = result * factor % modulus; factor = factor * factor % modulus; power /= 2n; }
  return (result % modulus).toString().padStart(digits, '0');
}
export interface LabelledTree { parents: number[]; labels: number[]; }
function validateTree(tree: LabelledTree): void {
  integer(tree.parents.length, 1, 6);
  if (tree.labels.length !== tree.parents.length || tree.parents[0] !== -1) throw new RangeError('Árbol inválido.');
  tree.parents.forEach((p, i) => { if (i > 0) integer(p, 0, i - 1); integer(tree.labels[i], 1, 3); });
}
export function meet(tree: LabelledTree, a: number, b: number): number {
  const ancestors = new Set<number>();
  for (let x = a; x >= 0; x = tree.parents[x]) ancestors.add(x);
  for (let x = b; x >= 0; x = tree.parents[x]) if (ancestors.has(x)) return x;
  throw new RangeError('Árbol desconectado.');
}
/** Injective, equal-label, meet-preserving map. Root preservation is not imposed. */
export function embedding(source: LabelledTree, target: LabelledTree): number[] | null {
  validateTree(source); validateTree(target);
  if (source.parents.length > target.parents.length) return null;
  const map: number[] = [], used = new Set<number>();
  const search = (i: number): boolean => {
    if (i === source.parents.length) return true;
    for (let j = 0; j < target.parents.length; j++) {
      if (used.has(j) || source.labels[i] !== target.labels[j]) continue;
      map[i] = j;
      if (map.slice(0, i).some((image, k) => map[meet(source, i, k)] !== meet(target, j, image))) continue;
      used.add(j);
      if (search(i + 1)) return true;
      used.delete(j);
    }
    map.length = i; return false;
  };
  return search(0) ? [...map] : null;
}
export function badSequence(trees: LabelledTree[], labels: number): boolean {
  integer(labels, 1, 3); trees.forEach(validateTree);
  return trees.every((tree, i) => tree.parents.length <= i + 1 && tree.labels.every(l => l <= labels) && trees.slice(i + 1).every(later => embedding(tree, later) === null));
}
export const TREE_EXAMPLES: { title: string; source: LabelledTree; target: LabelledTree; explanation: string }[] = [
  { title: 'Una arista puede convertirse en un camino', source: { parents: [-1, 0], labels: [1, 2] }, target: { parents: [-1, 0, 1], labels: [1, 3, 2] }, explanation: 'El nodo 1 va al 1 y el 2 al 3. La etiqueta de un nodo intermedio que no es imagen puede ser distinta.' },
  { title: 'Una bifurcación no cabe en una cadena', source: { parents: [-1, 0, 0], labels: [1, 2, 2] }, target: { parents: [-1, 0, 1], labels: [1, 2, 2] }, explanation: 'En el origen los hijos tienen como ancestro común la raíz; en la cadena sus imágenes tendrían otro ancestro común.' },
  { title: 'Las etiquetas también cuentan', source: { parents: [-1], labels: [2] }, target: { parents: [-1, 0], labels: [1, 1] }, explanation: 'No hay un nodo con etiqueta 2 en el destino. Una forma compatible no basta.' },
  { title: 'La raíz puede ir a un nodo interior', source: { parents: [-1, 0], labels: [1, 2] }, target: { parents: [-1, 0, 1], labels: [3, 1, 2] }, explanation: 'La raíz del origen va al segundo nodo del destino. No imponemos conservar la raíz del árbol completo.' },
];
export interface Transition { write: 0 | 1; move: -1 | 1; next: string; }
export interface Machine { name: string; note: string; transitions: Record<string, [Transition, Transition]>; }
const t = (write: 0 | 1, move: -1 | 1, next: string): Transition => ({ write, move, next });
export const MACHINES: Machine[] = [
  { name: 'Una instrucción y parada', note: 'Escribe un 1 y se detiene en un paso.', transitions: { A: [t(1, 1, 'H'), t(1, 1, 'H')] } },
  { name: 'Castor de dos estados', note: 'Se detiene tras 6 pasos con 4 unos. Simular este ejemplo no demuestra que sea óptimo.', transitions: { A: [t(1, 1, 'B'), t(1, -1, 'B')], B: [t(1, -1, 'A'), t(1, 1, 'H')] } },
  { name: 'Castor de tres estados', note: 'Se detiene tras 21 pasos con 5 unos. S(3) cuenta pasos; esta máquina no alcanza el máximo de unos, que es 6.', transitions: { A: [t(1, 1, 'B'), t(1, 1, 'H')], B: [t(1, -1, 'B'), t(0, 1, 'C')], C: [t(1, -1, 'C'), t(1, -1, 'A')] } },
  { name: 'Un caminante sin parada', note: 'Hay una demostración directa: ninguna transición llega a H. Agotar pasos de simulación no es esa demostración.', transitions: { A: [t(1, 1, 'A'), t(1, 1, 'A')] } },
];
export interface MachineState { tape: Set<number>; head: number; state: string; steps: number; status: 'Preparada' | 'En curso' | 'Detenida' | 'Límite alcanzado'; }
export function initialMachine(): MachineState { return { tape: new Set(), head: 0, state: 'A', steps: 0, status: 'Preparada' }; }
export function stepMachine(machine: Machine, state: MachineState): MachineState {
  if (state.status === 'Detenida' || state.status === 'Límite alcanzado') return state;
  const transition = machine.transitions[state.state]?.[state.tape.has(state.head) ? 1 : 0];
  if (!transition) throw new RangeError('Transición ausente.');
  const tape = new Set(state.tape);
  if (transition.write) tape.add(state.head); else tape.delete(state.head);
  const steps = state.steps + 1;
  return { tape, head: state.head + transition.move, state: transition.next, steps, status: transition.next === 'H' ? 'Detenida' : steps >= 200 ? 'Límite alcanzado' : 'En curso' };
}
export interface Challenge { level: string; left: string; right: string; answer: 'left' | 'right' | 'equal'; explanation: string; }
export const CHALLENGES: Challenge[] = [
  { level: 'Primer salto', left: '10^{100}', right: '2^{1000}', answer: 'right', explanation: '2¹⁰=1024>10³. Elevando a 100: 2¹⁰⁰⁰>10³⁰⁰>10¹⁰⁰.' },
  { level: 'Exponentes', left: '10^{10^{100}}', right: '10^{1000}', answer: 'left', explanation: 'La base 10 es mayor que 1. Basta comparar exponentes: 10¹⁰⁰>1000.' },
  { level: 'Torres', left: '3\\uparrow\\uparrow4', right: '4\\uparrow\\uparrow3', answer: 'left', explanation: '3↑↑4=3^(3²⁷) y 4↑↑3=4²⁵⁶. Como 3²⁷>512 y 3²>4: 3^(3²⁷)>3⁵¹²>4²⁵⁶.' },
  { level: 'Asociación', left: '3^{(3^3)}', right: '(3^3)^3', answer: 'left', explanation: 'Son 3²⁷ y 3⁹. Evaluar desde arriba cambia el exponente, no solo la escritura.' },
  { level: 'Más símbolos no siempre es más', left: '2\\uparrow\\uparrow3', right: '2\\uparrow\\uparrow\\uparrow2', answer: 'left', explanation: '2↑↑3=16; 2↑↑↑2=2↑↑(2↑↑↑1)=2↑↑2=4. Más flechas no garantiza un resultado mayor si cambia el operando.' },
  { level: 'Jerarquías', left: 'F_2(3)', right: '3^3', answer: 'right', explanation: 'Con nuestra convención F₂(3)=3·2³=24, mientras que 3³=27. Una tendencia asintótica no sustituye una comparación concreta.' },
];
export interface Milestone { title: string; kind: string; status: Knowledge; tex: string; definition: string; magnitude: string; property: string; next: string; link: string; linkTitle: string; }
export const MILESTONES: Milestone[] = [
  { title: 'Potencias de diez', kind: 'Familia de enteros', status: 'Exacto', tex: '10^6,\\ 10^9,\\ 10^{12}', definition: 'Un millón, mil millones y un billón en la escala larga española.', magnitude: 'Tienen 7, 10 y 13 cifras respectivamente.', property: '10ᵏ tiene k+1 cifras y k ceros finales.', next: 'Un exponente pequeño describe muchas cifras.', link: 'numeral-systems', linkTitle: 'Sistemas de numeración' },
  { title: 'Googol', kind: 'Entero concreto', status: 'Exacto', tex: '10^{100}', definition: 'Un uno seguido de cien ceros.', magnitude: '101 cifras decimales: todavía podemos escribirlas.', property: 'Es divisible por 2¹⁰⁰ y 5¹⁰⁰. Sus últimos cien dígitos son cero.', next: 'Usa este número como exponente.', link: 'exponentials-logarithms', linkTitle: 'Exponenciales y logaritmos' },
  { title: 'Googolplex', kind: 'Entero concreto', status: 'Simbólico', tex: '10^{10^{100}}', definition: 'Diez elevado a un googol. Definición exacta, representación simbólica.', magnitude: 'Tiene exactamente 10¹⁰⁰+1 cifras.', property: 'Podemos contar las cifras sin generarlas.', next: 'La altura de una torre es una nueva variable.', link: 'exponentials-logarithms', linkTitle: 'Logaritmos para comparar' },
  { title: 'Torres de potencias', kind: 'Familia de enteros', status: 'Exacto', tex: '3^{(3^3)}=3^{27}', definition: 'La torre se evalúa desde arriba, asociando a la derecha.', magnitude: 'Esta torre de altura tres vale 7 625 597 484 987.', property: 'No coincide con (3³)³=19 683.', next: 'Una operación abrevia una torre completa.', link: 'recurrent-sequences', linkTitle: 'Sucesiones recurrentes' },
  { title: 'Tetración e hiperoperaciones', kind: 'Operaciones', status: 'Simbólico', tex: '{}^h a=a\\uparrow\\uparrow h', definition: 'La tetración cuenta copias de a en una torre; la pentación itera la tetración.', magnitude: 'Depende de base y operando: una operación no es un número concreto.', property: 'Definimos a↑↑0=1 para a≥2.', next: 'Cuenta operaciones con flechas.', link: 'graham-number', linkTitle: 'Laboratorio de flechas' },
  { title: 'Flechas de Knuth', kind: 'Notación', status: 'Simbólico', tex: 'a\\uparrow^r b', definition: 'Una flecha significa potencia; dos, tetración; tres, pentación.', magnitude: 'Cambiar r modifica el mecanismo. No es una escala métrica.', property: 'Para r>1: a↑ʳ0=1 y a↑ʳ(b+1)=a↑ʳ⁻¹(a↑ʳb).', next: 'Un resultado decide cuántas flechas usar después.', link: 'graham-number', linkTitle: 'Notación y recurrencia' },
  { title: 'Número de Graham', kind: 'Entero concreto', status: 'Simbólico', tex: 'g_1=3\\uparrow^4 3,\\quad g_{i+1}=3\\uparrow^{g_i}3,\\quad G=g_{64}', definition: 'Una recurrencia de 64 términos vinculada a una cota de Ramsey.', magnitude: 'Determina un entero; no se materializa su expansión decimal.', property: 'El artículo especializado estudia su construcción y últimos dígitos.', next: 'Separa una cantidad fija de una función.', link: 'graham-number', linkTitle: 'Explorar el número de Graham en profundidad' },
  { title: 'Crecimiento rápido', kind: 'Funciones', status: 'Simbólico', tex: 'F_0(n)=n+1,\\quad F_{k+1}(n)=F_k^{\\circ n}(n)', definition: 'Usamos n composiciones, no n+1. Los niveles finitos son computables.', magnitude: 'F₁(n)=2n; F₂(n)=n·2ⁿ. El índice organiza reglas de crecimiento.', property: 'F₂(3)=24: no supera cualquier expresión en cualquier entrada.', next: 'Una restricción combinatoria define un máximo.', link: 'asymptotic-limits', linkTitle: 'Crecimiento asintótico' },
  { title: 'TREE(3)', kind: 'Entero combinatorio', status: 'Simbólico', tex: '\\operatorname{TREE}(3)', definition: 'Máxima longitud de una sucesión mala de árboles con tres etiquetas, |Tᵢ|≤i e inmersiones que conservan etiquetas e ínfimos.', magnitude: 'Es finito. No calculamos su valor ni su número de cifras.', property: 'El límite de tamaño por posición es esencial.', next: 'Los programas introducen una barrera de computabilidad.', link: 'counting-principles', linkTitle: 'Principios de conteo' },
  { title: 'Busy Beaver', kind: 'Función no computable', status: 'Desconocido', tex: 'S(n)=\\max\\{\\text{pasos de }M:M\\text{ tiene }n\\text{ estados y para}\\}', definition: 'Cinta inicialmente cero, dos símbolos y movimientos izquierda/derecha. S cuenta pasos; Σ cuenta unos finales.', magnitude: 'S(5)=47 176 870 demostrado; S(6) sin valor exacto conocido en las fuentes consultadas.', property: 'Cada valor es finito; no hay un algoritmo que calcule todos.', next: '¿Qué lenguaje permite definir una cantidad?', link: 'graham-number', linkTitle: 'Una construcción computable' },
];
export function ordinaryPower(base: number, exponent: number): NumberResult {
  integer(base, 2, 10); integer(exponent, 0, 13);
  const value = new Budget().power(BigInt(base), BigInt(exponent));
  return { status: 'Exacto', value, tex: base + '^{' + exponent + '}', digits: String(value.toString().length), reason: '' };
}

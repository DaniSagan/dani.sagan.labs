export type Boundary = 'fixed' | 'periodic';
export type Automaton = readonly Uint8Array[];

export function integerIn(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

export function ruleBit(rule: number, neighborhood: number): number {
  if (!integerIn(rule, 0, 255) || !integerIn(neighborhood, 0, 7)) {
    throw new RangeError('Regla o vecindario fuera de rango.');
  }
  return (rule >>> neighborhood) & 1;
}

export function cell(
  row: Uint8Array,
  index: number,
  boundary: Boundary,
): number {
  if (boundary === 'periodic')
    return row[((index % row.length) + row.length) % row.length];
  return index < 0 || index >= row.length ? 0 : row[index];
}

/** All outputs read the same previous generation: updates are simultaneous. */
export function evolve(
  rule: number,
  initial: Uint8Array,
  generations: number,
  boundary: Boundary,
): Automaton {
  if (
    !integerIn(rule, 0, 255) ||
    !integerIn(initial.length, 1, 401) ||
    !integerIn(generations, 0, 500) ||
    initial.some((bit) => bit !== 0 && bit !== 1) ||
    (boundary !== 'fixed' && boundary !== 'periodic')
  ) {
    throw new RangeError(
      'Usa una regla 0–255, 1–401 celdas binarias y 0–500 generaciones.',
    );
  }
  const rows = [initial.slice()];
  for (let t = 0; t < generations; t++) {
    const previous = rows[t];
    const next = new Uint8Array(initial.length);
    for (let i = 0; i < next.length; i++) {
      const neighborhood =
        4 * cell(previous, i - 1, boundary) +
        2 * previous[i] +
        cell(previous, i + 1, boundary);
      next[i] = (rule >>> neighborhood) & 1;
    }
    rows.push(next);
  }
  return rows;
}

export function singleSeed(width: number): Uint8Array {
  if (!integerIn(width, 1, 401))
    throw new RangeError('Anchura fuera de rango.');
  const row = new Uint8Array(width);
  row[Math.floor(width / 2)] = 1;
  return row;
}

export function reflectedRule(rule: number): number {
  ruleBit(rule, 0);
  let reflected = 0;
  for (let n = 0; n < 8; n++) {
    const reversed = ((n & 1) << 2) | (n & 2) | ((n & 4) >>> 2);
    reflected |= ruleBit(rule, reversed) << n;
  }
  return reflected;
}

/** Overlapping blocks; no artificial wrap from the last bit to the first. */
export function frequencies(
  sequence: readonly number[],
  size: number,
): { block: string; count: number; percent: number }[] {
  if (
    !integerIn(size, 1, 3) ||
    sequence.some((bit) => bit !== 0 && bit !== 1)
  ) {
    throw new RangeError('Se requieren bits y bloques de longitud 1–3.');
  }
  const counts = new Array<number>(2 ** size).fill(0);
  const total = Math.max(0, sequence.length - size + 1);
  for (let i = 0; i < total; i++) {
    let value = 0;
    for (let j = 0; j < size; j++) value = 2 * value + sequence[i + j];
    counts[value]++;
  }
  return counts.map((count, i) => ({
    block: i.toString(2).padStart(size, '0'),
    count,
    percent: total ? (100 * count) / total : 0,
  }));
}

export function differences(a: Automaton, b: Automaton): Automaton {
  if (a.length !== b.length || a.some((row, i) => row.length !== b[i].length)) {
    throw new RangeError('Las cuadrículas deben tener las mismas dimensiones.');
  }
  return a.map((row, t) => row.map((bit, i) => bit ^ b[t][i]));
}

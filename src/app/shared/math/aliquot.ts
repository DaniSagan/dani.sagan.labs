import { properDivisors } from './perfect-numbers';

export const ALIQUOT_VALUE_LIMIT = 100000000;
export interface AliquotResult {
  values: number[];
  status: 'zero' | 'cycle' | 'steps' | 'value';
  cycleStart: number | null;
}

export function aliquotSequence(start: number, steps = 100): AliquotResult {
  if (!Number.isInteger(start) || start < 1 || start > ALIQUOT_VALUE_LIMIT) throw new Error('Introduce un entero entre 1 y 100000000.');
  if (!Number.isInteger(steps) || steps < 1 || steps > 200) throw new Error('Elige entre 1 y 200 pasos.');
  const values = [start];
  const seen = new Map<number, number>([[start, 0]]);
  for (let i = 0; i < steps; i++) {
    const next = properDivisors(values[values.length - 1]).reduce((a, b) => a + b, 0);
    values.push(next);
    if (next === 0) return { values, status: 'zero', cycleStart: null };
    const cycleStart = seen.get(next);
    if (cycleStart !== undefined) return { values, status: 'cycle', cycleStart };
    if (next > ALIQUOT_VALUE_LIMIT) return { values, status: 'value', cycleStart: null };
    seen.set(next, values.length - 1);
  }
  return { values, status: 'steps', cycleStart: null };
}

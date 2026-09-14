import { bigintDivisorData, parseAliquotStart } from './aliquot-bigint';

export interface AliquotResult {
  values: bigint[];
  status: 'zero' | 'cycle' | 'steps';
  cycleStart: number | null;
}

export function aliquotSequence(start: bigint | number | string, steps = 100): AliquotResult {
  if (!Number.isInteger(steps) || steps < 1 || steps > 200) throw new Error('Elige entre 1 y 200 pasos.');
  const initial = parseAliquotStart(start);
  const values = [initial];
  const seen = new Map<bigint, number>([[initial, 0]]);
  for (let i = 0; i < steps; i++) {
    const next = bigintDivisorData(values[values.length - 1]).sum;
    values.push(next);
    if (next === 0n) return { values, status: 'zero', cycleStart: null };
    const cycleStart = seen.get(next);
    if (cycleStart !== undefined) return { values, status: 'cycle', cycleStart };
    seen.set(next, values.length - 1);
  }
  return { values, status: 'steps', cycleStart: null };
}

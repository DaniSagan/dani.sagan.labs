export function parseCollatzStart(input: string): bigint {
  if (!/^[0-9]+$/.test(input.trim())) throw new Error('Introduce un entero positivo en formato decimal.');
  const n = BigInt(input.trim());
  if (n < 1n) throw new Error('El inicio debe ser mayor que cero.');
  return n;
}

export function collatzNext(n: bigint): bigint {
  return n % 2n === 0n ? n / 2n : 3n * n + 1n;
}

export class CollatzRun {
  readonly values: bigint[];
  readonly records: { step: number; value: bigint }[];
  maximum: bigint;
  peakStep = 0;
  even = 0;
  odd = 0;
  firstDescent: number | null = null;
  status: 'running' | 'one' | 'limit' | 'stopped' | 'cycle';
  private seen: Set<bigint>;
  constructor(readonly start: bigint, readonly limit: number | null) {
    if (start < 1n || (limit !== null && (!Number.isSafeInteger(limit) || limit < 1 || limit > 100000))) throw new Error('Máximo de pasos: entero entre 1 y 100000, o sin límite.');
    this.values = [start]; this.maximum = start;
    this.records = [{ step: 0, value: start }]; this.seen = new Set([start]);
    this.status = start === 1n ? 'one' : 'running';
  }
  get steps(): number { return this.values.length - 1; }
  advance(): void {
    if (this.status !== 'running') return;
    const previous = this.values[this.steps];
    previous % 2n === 0n ? this.even++ : this.odd++;
    const next = collatzNext(previous);
    this.values.push(next);
    if (next > this.maximum) {
      this.maximum = next; this.peakStep = this.steps;
      this.records.push({ step: this.steps, value: next });
    }
    if (this.firstDescent === null && next < this.start) this.firstDescent = this.steps;
    if (next === 1n) this.status = 'one';
    else if (this.seen.has(next)) this.status = 'cycle';
    else if (this.limit !== null && this.steps >= this.limit) this.status = 'limit';
    this.seen.add(next);
  }
}

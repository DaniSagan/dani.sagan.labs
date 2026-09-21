/** Square lattice with four outgoing edges per site; missing neighbours are sinks. */
export class Sandpile {
  readonly heights: Float64Array;
  readonly odometer: Float64Array;
  readonly neighbours: number[][];
  lost = 0;
  topplings = 0;

  constructor(readonly size: number, initial?: ArrayLike<number>) {
    if (!Number.isInteger(size) || size < 1 || size > 129) throw new RangeError('Invalid lattice size');
    this.heights = new Float64Array(size * size);
    if (initial) {
      if (initial.length !== this.heights.length || Array.from(initial).some(x => !Number.isSafeInteger(x) || x < 0)) throw new RangeError('Invalid heights');
      this.heights.set(initial);
    }
    this.odometer = new Float64Array(size * size);
    this.neighbours = Array.from(this.heights, (_, i) => {
      const x = i % size, y = Math.floor(i / size), result: number[] = [];
      if (x > 0) result.push(i - 1);
      if (x < size - 1) result.push(i + 1);
      if (y > 0) result.push(i - size);
      if (y < size - 1) result.push(i + size);
      return result;
    });
  }
  get mass(): number { return this.heights.reduce((sum, h) => sum + h, 0); }
  get stable(): boolean { return this.heights.every(h => h < 4); }
  get active(): number { return this.heights.reduce((sum, h) => sum + (h >= 4 ? 1 : 0), 0); }
  add(index: number, grains = 1): void {
    if (!Number.isInteger(index) || index < 0 || index >= this.heights.length || !Number.isSafeInteger(grains) || grains < 0 || !Number.isSafeInteger(this.heights[index] + grains)) throw new RangeError('Invalid addition');
    this.heights[index] += grains;
  }
  topple(index: number, bulk = false): number {
    if (this.heights[index] < 4) return 0;
    const count = bulk ? Math.floor(this.heights[index] / 4) : 1;
    this.heights[index] -= 4 * count;
    for (const neighbour of this.neighbours[index]) this.heights[neighbour] += count;
    this.lost += (4 - this.neighbours[index].length) * count;
    this.odometer[index] += count;
    this.topplings += count;
    return count;
  }
  /** One synchronous round: each site unstable at the start topples exactly once. */
  round(): number {
    const sites: number[] = [];
    this.heights.forEach((h, i) => { if (h >= 4) sites.push(i); });
    for (const i of sites) this.topple(i);
    return sites.length;
  }
  clearOdometer(): void { this.odometer.fill(0); }
}

/** Resumable legal stabilization. Work is bounded by queue operations, not total topplings. */
export class SandpileRelaxation {
  private queue: number[] = [];
  private head = 0;
  private readonly queued: Uint8Array;
  constructor(readonly pile: Sandpile, readonly order: 'fifo' | 'lifo' = 'fifo', readonly bulk = true) {
    this.queued = new Uint8Array(pile.heights.length);
    pile.heights.forEach((h, i) => { if (h >= 4) this.enqueue(i); });
  }
  get done(): boolean { return this.queue.length === this.head; }
  private enqueue(i: number): void {
    if (!this.queued[i] && this.pile.heights[i] >= 4) { this.queue.push(i); this.queued[i] = 1; }
  }
  process(budget = 2000): number {
    let work = 0;
    while (!this.done && work < budget) {
      const i = this.order === 'fifo' ? this.queue[this.head++] : this.queue.pop()!;
      this.queued[i] = 0;
      this.pile.topple(i, this.bulk);
      for (const neighbour of this.pile.neighbours[i]) this.enqueue(neighbour);
      this.enqueue(i);
      work++;
    }
    if (this.head > 4096 || this.done) { this.queue = this.queue.slice(this.head); this.head = 0; }
    return work;
  }
}

export function sandpileRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 4294967296; };
}

export interface Avalanche { addition: number; size: number; area: number; lost: number; density: number; }
/** Slow drive: no grain is added until the previous relaxation has finished. */
export class SandpileExperiment {
  readonly pile: Sandpile;
  readonly samples: Avalanche[] = [];
  additions = 0;
  private job?: SandpileRelaxation;
  private startTopplings = 0;
  private startLost = 0;
  private random: () => number;
  constructor(readonly size: number, readonly seed: number, readonly warmup: number) {
    this.pile = new Sandpile(size);
    this.random = sandpileRandom(seed);
  }
  /** One chunk, possibly a partial avalanche; completed samples only are published. */
  advance(targetSamples: number, budget = 3000): void {
    let work = 0;
    while (this.samples.length < targetSamples && work < budget) {
      if (!this.job) {
        this.pile.clearOdometer();
        this.startTopplings = this.pile.topplings;
        this.startLost = this.pile.lost;
        this.pile.add(Math.floor(this.random() * this.pile.heights.length));
        this.job = new SandpileRelaxation(this.pile);
        work++; // Additions without toppling must also consume the frame budget.
      }
      work += this.job.process(Math.max(0, budget - work));
      if (this.job.done) {
        this.additions++;
        if (this.additions > this.warmup) this.samples.push({
          addition: this.additions, size: this.pile.topplings - this.startTopplings,
          area: this.pile.odometer.reduce((sum, n) => sum + (n > 0 ? 1 : 0), 0),
          lost: this.pile.lost - this.startLost, density: this.pile.mass / this.pile.heights.length
        });
        this.job = undefined;
      }
    }
  }
  get relaxing(): boolean { return !!this.job; }
}

/** Empirical P(S >= s | S > 0), including tied observations exactly once. */
export function avalancheTail(samples: Avalanche[]): { size: number; probability: number }[] {
  const positive = samples.map(s => s.size).filter(s => s > 0).sort((a, b) => a - b);
  return positive.flatMap((size, i) => i === 0 || size !== positive[i - 1] ? [{ size, probability: (positive.length - i) / positive.length }] : []);
}

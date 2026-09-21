import { avalancheTail, Sandpile, SandpileExperiment, SandpileRelaxation, sandpileRandom } from './sandpile';

function stabilize(pile: Sandpile, order: 'fifo' | 'lifo' = 'fifo', bulk = true): Sandpile {
  const job = new SandpileRelaxation(pile, order, bulk);
  let chunks = 0;
  while (!job.done && chunks++ < 10000) job.process(500);
  expect(job.done).toBe(true);
  return pile;
}

describe('Abelian sandpile model', () => {
  it('sends one grain to each cardinal neighbour and none to diagonals', () => {
    const p = new Sandpile(3); p.add(4, 4); p.round();
    expect(Array.from(p.heights)).toEqual([0, 1, 0, 1, 0, 1, 0, 1, 0]);
    expect(p.topplings).toBe(1); expect(p.lost).toBe(0); expect(p.mass).toBe(4);
  });
  it('dissipates missing edges without lowering the boundary threshold', () => {
    const p = new Sandpile(3); p.add(0, 4); p.topple(0);
    expect(p.lost).toBe(2); expect(p.mass).toBe(2);
    expect(p.heights[1]).toBe(1); expect(p.heights[3]).toBe(1);
    const singleton = stabilize(new Sandpile(1, [19]));
    expect(singleton.heights[0]).toBe(3); expect(singleton.lost).toBe(16);
    expect(singleton.topplings).toBe(4);
  });
  it('limits a synchronous round to sites unstable at its start', () => {
    const p = new Sandpile(3); p.add(4, 4); p.add(5, 3);
    expect(p.round()).toBe(1); expect(p.heights[5]).toBe(4); expect(p.odometer[5]).toBe(0);
    expect(p.round()).toBe(1); expect(p.odometer[5]).toBe(1);
  });
  it('never topples a stable site', () => {
    const p = new Sandpile(2, [0, 1, 2, 3]);
    expect(p.topple(3)).toBe(0); expect(p.topplings).toBe(0); expect(p.stable).toBe(true);
  });
  it('conserves mass including the sink during partial as well as full relaxation', () => {
    const p = new Sandpile(7); p.add(24, 2000);
    const job = new SandpileRelaxation(p);
    for (let n = 0; n < 10000 && !job.done; n++) {
      job.process(23); expect(p.mass + p.lost).toBe(2000);
      expect(p.heights.every(h => Number.isInteger(h) && h >= 0)).toBe(true);
    }
    expect(job.done).toBe(true); expect(p.stable).toBe(true);
    expect(p.odometer.reduce((sum, n) => sum + n, 0)).toBe(p.topplings);
  });
  it('has identical heights and odometers under FIFO, LIFO and bulk schedules', () => {
    for (const seed of [1, 7, 42]) {
      const rng = sandpileRandom(seed), initial = Array.from({ length: 49 }, () => Math.floor(8 * rng()));
      initial[24] += 100;
      const fifo = stabilize(new Sandpile(7, initial), 'fifo', false);
      const lifo = stabilize(new Sandpile(7, initial), 'lifo', false);
      const bulk = stabilize(new Sandpile(7, initial));
      for (const p of [lifo, bulk]) {
        expect(Array.from(p.heights)).toEqual(Array.from(fifo.heights));
        expect(Array.from(p.odometer)).toEqual(Array.from(fifo.odometer));
        expect(p.lost).toBe(fifo.lost);
      }
    }
  });
  it('commutes additions separated by stabilization', () => {
    const a = new Sandpile(5), b = new Sandpile(5);
    a.heights.fill(3); b.heights.fill(3);
    a.add(12, 20); stabilize(a); a.add(6, 30); stabilize(a);
    b.add(6, 30); stabilize(b); b.add(12, 20); stabilize(b);
    expect(Array.from(a.heights)).toEqual(Array.from(b.heights));
    expect(Array.from(a.odometer)).toEqual(Array.from(b.odometer));
  });
  it('preserves reflection and rotation symmetry of a central deposit', () => {
    const p = new Sandpile(17); p.add(144, 1500); stabilize(p);
    for (let y = 0; y < 17; y++) for (let x = 0; x < 17; x++) {
      expect(p.heights[y * 17 + x]).toBe(p.heights[y * 17 + 16 - x]);
      expect(p.heights[y * 17 + x]).toBe(p.heights[x * 17 + 16 - y]);
    }
  });
  it('reproduces experiments independently of processing chunk size and pauses', () => {
    const a = new SandpileExperiment(5, 42, 200), b = new SandpileExperiment(5, 42, 200);
    let iterations = 0;
    while (a.samples.length < 50 && iterations++ < 10000) a.advance(50, 17);
    iterations = 0;
    while (b.samples.length < 20 && iterations++ < 10000) b.advance(20, 1000);
    while (b.samples.length < 50 && iterations++ < 10000) b.advance(50, 1000);
    expect(a.samples.length).toBe(50); expect(a.samples).toEqual(b.samples);
    expect(a.additions).toBe(250); expect(a.pile.mass + a.pile.lost).toBe(250);
    expect(a.pile.stable).toBe(true);
    for (const sample of a.samples) expect(sample.area).toBeLessThanOrEqual(sample.size);
  });
  it('records zero avalanches and discards exactly the specified warmup', () => {
    const e = new SandpileExperiment(1, 1, 2); e.advance(4, 100);
    expect(e.samples.map(s => s.addition)).toEqual([3, 4, 5, 6]);
    expect(e.samples.map(s => s.size)).toEqual([0, 1, 0, 0]);
    expect(e.samples[1].lost).toBe(4); expect(e.samples[1].area).toBe(1);
  });
  it('builds a positive-size conditional tail including ties correctly', () => {
    const samples = [0, 1, 1, 4].map(size => ({ addition: 0, size, area: 0, lost: 0, density: 0 }));
    expect(avalancheTail(samples)).toEqual([{ size: 1, probability: 1 }, { size: 4, probability: 1 / 3 }]);
    expect(avalancheTail([])).toEqual([]);
  });
  it('rejects invalid sizes, noninteger heights and invalid additions', () => {
    expect(() => new Sandpile(0)).toThrowError(RangeError);
    expect(() => new Sandpile(1, [-1])).toThrowError(RangeError);
    expect(() => new Sandpile(1, [0.5])).toThrowError(RangeError);
    const p = new Sandpile(3);
    expect(() => p.add(9)).toThrowError(RangeError);
    expect(() => p.add(0, -1)).toThrowError(RangeError);
  });
});

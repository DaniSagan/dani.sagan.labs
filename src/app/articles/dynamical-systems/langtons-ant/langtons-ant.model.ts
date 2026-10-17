export interface Ant { x: number; y: number; d: number; }
export type Bounds = [number, number, number, number];
export const DIRECTIONS = ['Norte ↑', 'Este →', 'Sur ↓', 'Oeste ←'];
export const key = (x: number, y: number) => `${x},${y}`;
const DX = [0, 1, 0, -1], DY = [1, 0, -1, 0];
export interface Undo { ant: Ant; index: number; cell: number; bounds: Bounds; }

/** Infinite white plane, Cartesian coordinates (north is +y). One tick moves one
 * ant; multiple ants take turns in stable identifier order, reading prior writes. */
export class AntEngine {
  cells = new Map<string, number>();
  visits = new Map<string, number>();
  ants: Ant[] = [{ x: 0, y: 0, d: 0 }];
  steps = 0;
  bounds: Bounds = [0, 0, 0, 0];
  history = new Map<number, Undo>();
  readonly historyLimit = 100000;
  constructor(public rule = 'RL') { this.setRule(rule); this.begin(); }
  setRule(rule: string): void {
    if (!/^[RL]{2,12}$/.test(rule)) throw new Error('Usa entre 2 y 12 letras R o L.');
    this.rule = rule;
  }
  get(x: number, y: number): number { return this.cells.get(key(x, y)) || 0; }
  put(x: number, y: number, state: number): void {
    if (!Number.isInteger(state) || state < 0 || state >= this.rule.length) throw new Error('Estado inválido');
    if (state) this.cells.set(key(x, y), state); else this.cells.delete(key(x, y));
  }
  private visit(x: number, y: number): void {
    const k = key(x, y); this.visits.set(k, (this.visits.get(k) || 0) + 1);
    this.bounds = [Math.min(this.bounds[0], x), Math.max(this.bounds[1], x), Math.min(this.bounds[2], y), Math.max(this.bounds[3], y)];
  }
  /** Manual edits begin a new experiment; old trajectory statistics are discarded. */
  begin(): void {
    this.steps = 0; this.history.clear(); this.visits.clear();
    const a = this.ants[0]; this.bounds = [a.x, a.x, a.y, a.y];
    this.ants.forEach(a => this.visit(a.x, a.y));
  }
  step(): void {
    const index = this.steps % this.ants.length, a = this.ants[index], cell = this.get(a.x, a.y);
    this.history.set(this.steps, { ant: { ...a }, index, cell, bounds: [...this.bounds] });
    this.history.delete(this.steps - this.historyLimit);
    a.d = (a.d + (this.rule[cell] === 'R' ? 1 : 3)) % 4;
    this.put(a.x, a.y, (cell + 1) % this.rule.length);
    a.x += DX[a.d]; a.y += DY[a.d]; this.visit(a.x, a.y); this.steps++;
  }
  back(): boolean {
    const u = this.history.get(this.steps - 1); if (!u) return false;
    const a = this.ants[u.index], k = key(a.x, a.y), count = this.visits.get(k)!;
    if (count === 1) this.visits.delete(k); else this.visits.set(k, count - 1);
    this.ants[u.index] = { ...u.ant }; this.put(u.ant.x, u.ant.y, u.cell);
    this.bounds = [...u.bounds]; this.history.delete(--this.steps); return true;
  }
  run(n: number): void { for (let i = 0; i < n; i++) this.step(); }
  clone(): AntEngine {
    const e = new AntEngine(this.rule); e.cells = new Map(this.cells); e.ants = this.ants.map(a => ({ ...a }));
    e.steps = this.steps; e.visits = new Map(this.visits); e.bounds = [...this.bounds]; return e;
  }
}

export function initialEngine(preset = 'white', seed = 42, rule = 'RL', count = 1): AntEngine {
  const e = new AntEngine(rule);
  let rng = seed >>> 0;
  for (let x = -9; x <= 9; x++) for (let y = -9; y <= 9; y++) {
    rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
    const active = preset === 'single' ? x === 1 && y === 0 : preset === 'square' ? Math.abs(x) <= 2 && Math.abs(y) <= 2 :
      preset === 'line' ? y === 0 && Math.abs(x) <= 6 : preset === 'symmetric' ? Math.abs(x) === Math.abs(y) && Math.abs(x) < 6 :
      preset === 'random' ? rng / 4294967296 < .28 : false;
    if (active) e.put(x, y, 1);
  }
  if (count > 1) e.ants = Array.from({ length: count }, (_, i) => ({ x: i % 2 ? 6 : -6, y: Math.floor(i / 2) * 5, d: i % 2 ? 3 : 1 }));
  e.begin(); return e;
}

/** Compare only the finite operational footprint of the next 104 transitions.
 * An empirical two-block certificate, never a global-state periodicity claim. */
export function analyzeHighway(engine: AntEngine) {
  if (engine.rule !== 'RL' || engine.ants.length !== 1) return null;
  const start = engine.clone(), later = engine.clone(), a = { ...start.ants[0] };
  const footprint = new Map<string, [number, number]>();
  const trace: string[] = [];
  for (let i = 0; i < 104; i++) {
    const p = later.ants[0]; footprint.set(key(p.x - a.x, p.y - a.y), [p.x - a.x, p.y - a.y]);
    trace.push(`${p.x - a.x},${p.y - a.y},${p.d},${later.get(p.x, p.y)}`); later.step();
  }
  const b = { ...later.ants[0] }, dx = b.x - a.x, dy = b.y - a.y;
  const patches = [...footprint.values()].map(([x, y]) => ({ x, y, before: start.get(a.x + x, a.y + y), after: later.get(b.x + x, b.y + y) }));
  let traceMatches = true;
  for (let i = 0; i < 104; i++) {
    const p = later.ants[0];
    if (trace[i] !== `${p.x - b.x},${p.y - b.y},${p.d},${later.get(p.x, p.y)}`) traceMatches = false;
    later.step();
  }
  return { step: engine.steps, direction: a.d, dx, dy, patches, match: traceMatches && a.d === b.d && (dx !== 0 || dy !== 0) && patches.every(p => p.before === p.after) };
}

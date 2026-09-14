import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { classifyPrime, PrimeState, spiralPosition, spiralValue } from '../../shared/math/ulam';

interface Cell { n: bigint; x: number; y: number; state: PrimeState | 'pending'; }
@Component({
  selector: 'app-ulam-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './ulam-explorer.component.html', styleUrl: './ulam-explorer.component.css'
})
export class UlamExplorerComponent implements OnDestroy {
  endInput = '10000'; targetInput = '1'; end = 10000n;
  cx = 0n; cy = 0n; radius = 20; labels = false;
  cells: Cell[] = []; selected: Cell | null = null; error = ''; running = false; completed = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private test?: Generator<void, PrimeState>;
  private cache = new Map<bigint, PrimeState>();
  constructor() { this.render(); }
  get size(): number { return 2 * this.radius + 1; }
  get pitch(): number { return 600 / this.size; }
  parse(text: string): bigint {
    if (!/^[0-9]+$/.test(text.trim()) || BigInt(text.trim()) < 1n) throw new Error('Introduce un entero positivo decimal.');
    return BigInt(text.trim());
  }
  apply(last = false): void {
    try {
      const end = this.parse(this.endInput), target = last ? end : this.parse(this.targetInput);
      if (target > end) throw new Error('El destino debe estar dentro del tramo 1…N.');
      const position = spiralPosition(target);
      this.end = end; this.cx = position.x; this.cy = position.y;
      this.targetInput = target.toString(); this.error = ''; this.render();
    } catch (e) { this.error = (e as Error).message; }
  }
  origin(): void { this.targetInput = '1'; this.apply(); }
  pan(dx: number, dy: number): void {
    this.cx += BigInt(dx * this.radius); this.cy += BigInt(dy * this.radius); this.render();
  }
  render(): void {
    this.stop(); this.cells = []; this.selected = null; this.completed = 0;
    for (let row = 0; row < this.size; row++) for (let col = 0; col < this.size; col++) {
      const n = spiralValue(this.cx + BigInt(col - this.radius), this.cy + BigInt(this.radius - row));
      if (n <= this.end) this.cells.push({ n, x: col * this.pitch, y: row * this.pitch, state: this.cache.get(n) ?? 'pending' });
    }
    this.selected = this.cells.find(c => c.n === spiralValue(this.cx, this.cy)) ?? null;
    this.running = this.cells.length > 0;
    if (this.running) this.schedule();
  }
  private schedule(): void { this.timer = setTimeout(() => this.work(), 16); }
  private work(): void {
    this.timer = undefined;
    const deadline = performance.now() + 8;
    for (let i = 0; i < 2000 && this.completed < this.cells.length; i++) {
      const cell = this.cells[this.completed];
      if (cell.state !== 'pending') this.completed++;
      else {
        this.test ??= classifyPrime(cell.n);
        const step = this.test.next();
        if (step.done) {
          cell.state = step.value; this.test = undefined; this.completed++;
          if (this.cache.size >= 20000) this.cache.delete(this.cache.keys().next().value!);
          this.cache.set(cell.n, cell.state);
        }
      }
      if (performance.now() >= deadline) break;
    }
    this.running = this.completed < this.cells.length;
    if (this.running) this.schedule();
  }
  stop(): void { if (this.timer !== undefined) clearTimeout(this.timer); this.timer = undefined; this.test = undefined; this.running = false; }
  resume(): void { if (this.completed < this.cells.length && !this.running) { this.running = true; this.schedule(); } }
  ngOnDestroy(): void { this.stop(); }
  inspect(event: MouseEvent): void {
    const bounds = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
    const x = Math.floor((event.clientX - bounds.left) / bounds.width * this.size);
    const y = Math.floor((event.clientY - bounds.top) / bounds.height * this.size);
    this.selected = this.cells.find(c => Math.round(c.x / this.pitch) === x && Math.round(c.y / this.pitch) === y) ?? null;
  }
  label(state: Cell['state']): string {
    return { unit: '1: ni primo ni compuesto', composite: 'Compuesto', prime: 'Primo demostrado', probable: 'Primo probable (no demostrado)', pending: 'Pendiente de comprobar' }[state];
  }
}

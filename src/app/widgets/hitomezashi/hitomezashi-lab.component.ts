import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Bit,
  closedRegions,
  periodicBits,
  randomBits,
  regionColors,
  Stitch,
  stitches,
} from './hitomezashi.math';

@Component({
  selector: 'app-hitomezashi-lab',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './hitomezashi-lab.component.html',
  styleUrls: [
    '../modular/modular-widgets.css',
    './hitomezashi-lab.component.css',
  ],
})
export class HitomezashiLabComponent implements OnDestroy {
  size = 20;
  mode = 'random';
  seed = 2026;
  rowPattern = '0011';
  columnPattern = '0101';
  grid = true;
  colored = true;
  colorPaths = ['', ''];
  sequences = true;
  error = '';
  rows: Bit[] = [];
  columns: Bit[] = [];
  edges: Stitch[] = [];
  regions = 0;
  progress = 42;
  active: { horizontal: boolean; line: number } | null = null;
  changed: { horizontal: boolean; line: number } | null = null;
  timer?: ReturnType<typeof setInterval>;
  private flash?: ReturnType<typeof setTimeout>;
  constructor() {
    this.generate();
  }
  get lines(): number[] {
    return Array.from({ length: this.size + 1 }, (_, i) => i);
  }
  get visible(): Stitch[] {
    return this.edges.filter(
      (e) => (e.horizontal ? e.line : this.size + 1 + e.line) < this.progress,
    );
  }
  get onesRows(): number {
    return this.rows.filter((b) => b === 1).length;
  }
  get onesColumns(): number {
    return this.columns.filter((b) => b === 1).length;
  }
  get complete(): boolean {
    return this.progress === 2 * (this.size + 1);
  }
  generate(newSeed = false): void {
    this.pause();
    try {
      if (!Number.isInteger(this.size) || this.size < 4 || this.size > 40)
        throw new Error('El tamaño debe ser un entero entre 4 y 40.');
      if (
        !Number.isInteger(this.seed) ||
        this.seed < 0 ||
        this.seed > 4294967295
      )
        throw new Error('La semilla debe ser un entero entre 0 y 4294967295.');
      if (newSeed && this.mode === 'random')
        this.seed = crypto.getRandomValues(new Uint32Array(1))[0];
      const length = this.size + 1;
      if (this.mode === 'random') {
        const bits = randomBits(this.seed, length * 2);
        this.rows = bits.slice(0, length);
        this.columns = bits.slice(length);
      } else if (this.mode === 'manual') {
        this.rows = Array.from({ length }, (_, i) => this.rows[i] ?? 0);
        this.columns = Array.from({ length }, (_, i) => this.columns[i] ?? 0);
      } else {
        const r = periodicBits(
          this.mode === 'alternating' ? '01' : this.rowPattern,
          length,
        );
        const c = periodicBits(
          this.mode === 'alternating' ? '01' : this.columnPattern,
          length,
        );
        this.rows = r;
        this.columns = c;
      }
      this.error = '';
      this.active = null;
      this.refresh();
    } catch (e) {
      this.error = (e as Error).message;
    }
  }
  refresh(): void {
    this.edges = stitches(this.rows, this.columns);
    this.regions = closedRegions(this.edges);
    this.colorPaths = ['', ''];
    regionColors(this.rows, this.columns).forEach((row, y) =>
      row.forEach((color, x) => {
        this.colorPaths[color] += `M${x},${y}h1v1h-1z`;
      }),
    );
    this.progress = 2 * (this.size + 1);
  }
  preset(name: string): void {
    this.mode = name === 'zeros' || name === 'bands' ? 'periodic' : name;
    if (name === 'random') this.seed = 2026;
    if (name === 'zeros') this.rowPattern = this.columnPattern = '0';
    if (name === 'bands') {
      this.rowPattern = '0011';
      this.columnPattern = '000111';
    }
    if (name === 'symmetric') {
      // Equal row and column sequences give reflection across the diagonal.
      this.pause();
      this.mode = 'manual';
      this.size = 20;
      this.rows = periodicBits('001', 21);
      this.columns = [...this.rows];
      this.error = '';
      this.refresh(); // Identical sequences give symmetry across y = x.
    } else this.generate();
  }
  flip(horizontal: boolean, line: number): void {
    this.pause();
    this.mode = 'manual';
    const bits = horizontal ? this.rows : this.columns;
    bits[line] = bits[line] === 0 ? 1 : 0;
    this.changed = { horizontal, line };
    this.refresh();
    clearTimeout(this.flash);
    this.flash = setTimeout(() => (this.changed = null), 450);
  }
  matches(e: Stitch, selection: typeof this.active): boolean {
    return (
      !!selection &&
      e.horizontal === selection.horizontal &&
      e.line === selection.line
    );
  }
  play(): void {
    if (this.timer) {
      this.pause();
      return;
    }
    if (this.complete) this.progress = 0;
    this.timer = setInterval(() => {
      this.progress++;
      if (this.complete) this.pause();
    }, 140);
  }
  pause(): void {
    clearInterval(this.timer);
    this.timer = undefined;
  }
  reset(): void {
    this.pause();
    this.progress = 0;
  }
  finish(): void {
    this.pause();
    this.progress = 2 * (this.size + 1);
  }
  ngOnDestroy(): void {
    this.pause();
    clearTimeout(this.flash);
  }
}

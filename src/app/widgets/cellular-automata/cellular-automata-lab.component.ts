import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutomatonCanvasComponent } from './automaton-canvas.component';
import {
  Automaton,
  Boundary,
  cell,
  differences,
  evolve,
  frequencies,
  integerIn,
  reflectedRule,
  ruleBit,
  singleSeed,
} from './cellular-automata.math';

@Component({
  selector: 'app-cellular-automata-lab',
  standalone: true,
  imports: [FormsModule, AutomatonCanvasComponent],
  templateUrl: './cellular-automata-lab.component.html',
  styleUrls: [
    '../modular/modular-widgets.css',
    './cellular-automata-widgets.css',
  ],
})
export class CellularAutomataLabComponent implements OnDestroy {
  @ViewChild('inspector') inspector?: ElementRef<HTMLDetailsElement>;
  rule = 30;
  width = 241;
  generations = 120;
  boundary: Boundary = 'fixed';
  speed = 15;
  initial = singleSeed(this.width);
  rows: Automaton = evolve(
    this.rule,
    this.initial,
    this.generations,
    this.boundary,
  );
  visible = this.rows.length;
  error = '';
  running = false;
  private timer?: ReturnType<typeof setInterval>;
  readonly neighborhoods = [7, 6, 5, 4, 3, 2, 1, 0];
  readonly presets = [
    { rule: 0, text: 'Después del primer paso todas las celdas se apagan.' },
    {
      rule: 4,
      text: 'Una célula aislada permanece encendida: una columna estable.',
    },
    {
      rule: 30,
      text: 'Desde una sola célula surgen regiones regulares y otras aparentemente caóticas.',
    },
    {
      rule: 90,
      text: 'Los vecinos se suman módulo 2. Una semilla aislada genera triángulos de Sierpiński.',
    },
    {
      rule: 110,
      text: 'Aparecen estructuras complejas. La universalidad requiere estados iniciales especiales, no cualquier dibujo.',
    },
    {
      rule: 184,
      text: 'Cada 1 avanza hacia la derecha si hay un 0 libre. Prueba un inicio aleatorio y bordes periódicos.',
    },
  ];
  inspectionRow = 1;
  inspectionColumn = 120;
  editColumn = 120;
  column = 120;
  blockSize = 2;
  mode: 'explore' | 'compare' | 'difference' | 'atlas' = 'explore';
  compareRule = 90;
  thirdRule = 110;
  showThird = false;
  comparison: Automaton = [];
  third: Automaton = [];
  perturbColumn = 121;
  perturbed: Automaton = [];
  differenceRows: Automaton = [];
  page = 0;
  featuredOnly = false;
  atlas: { rule: number; rows: Automaton }[] = [];

  get binary(): string {
    return integerIn(this.rule, 0, 255)
      ? this.rule.toString(2).padStart(8, '0')
      : '—';
  }
  get description(): string {
    return (
      this.presets.find((p) => p.rule === this.rule)?.text ??
      'Una de las 256 tablas posibles. Explora su evolución desde distintos inicios.'
    );
  }
  get mirror(): number {
    return integerIn(this.rule, 0, 255) ? reflectedRule(this.rule) : 0;
  }
  bit(n: number): number {
    return integerIn(this.rule, 0, 255) ? ruleBit(this.rule, n) : 0;
  }
  bits(n: number): string {
    return n.toString(2).padStart(3, '0');
  }

  configure(): void {
    this.pause();
    if (
      !integerIn(this.rule, 0, 255) ||
      !integerIn(this.width, 3, 401) ||
      !integerIn(this.generations, 1, 500)
    ) {
      this.error =
        'Introduce enteros: regla 0–255, anchura 3–401 y generaciones 1–500.';
      return;
    }
    this.error = '';
    if (this.initial.length !== this.width) {
      this.initial = singleSeed(this.width);
      this.column =
        this.inspectionColumn =
        this.editColumn =
          Math.floor(this.width / 2);
      this.perturbColumn = Math.min(this.width - 1, this.column + 1);
    }
    this.rows = evolve(
      this.rule,
      this.initial,
      this.generations,
      this.boundary,
    );
    this.visible = this.rows.length;
    this.inspectionRow = Math.min(this.inspectionRow, this.generations);
    this.refreshMode();
  }

  selectRule(rule: number): void {
    this.rule = rule;
    this.configure();
  }
  toggleBit(n: number): void {
    if (!this.error) this.selectRule(this.rule ^ (1 << n));
  }
  seed(kind: 'single' | 'random' | 'clear' | 'invert'): void {
    if (this.error) return;
    if (kind === 'single') this.initial = singleSeed(this.width);
    if (kind === 'clear') this.initial = new Uint8Array(this.width);
    if (kind === 'invert') this.initial = this.initial.map((bit) => 1 - bit);
    if (kind === 'random') {
      const bytes = crypto.getRandomValues(new Uint8Array(this.width));
      this.initial = bytes.map((byte) => byte & 1);
    }
    this.configure();
  }
  flipInitial(column: number): void {
    if (this.error || !integerIn(column, 0, this.width - 1)) return;
    this.initial = this.initial.slice();
    this.initial[column] ^= 1;
    this.configure();
  }
  reflect(): void {
    if (this.error) return;
    this.rule = this.mirror;
    this.initial = this.initial.slice().reverse();
    this.configure();
  }
  reset(): void {
    this.pause();
    this.visible = 1;
  }
  all(): void {
    this.pause();
    this.visible = this.rows.length;
  }
  step(): void {
    if (this.error) return;
    this.visible = Math.min(this.visible + 1, this.rows.length);
    this.inspectionRow = this.visible - 1;
    if (this.visible === this.rows.length) this.pause();
  }
  play(): void {
    this.pause();
    if (this.error || !integerIn(this.speed, 1, 60)) return;
    if (this.visible === this.rows.length) this.visible = 1;
    this.running = true;
    this.timer = setInterval(() => this.step(), 1000 / this.speed);
  }
  changeSpeed(): void {
    if (this.running) this.play();
  }
  pause(): void {
    if (this.timer !== undefined) clearInterval(this.timer);
    this.timer = undefined;
    this.running = false;
  }
  ngOnDestroy(): void {
    this.pause();
  }

  pick(point: { row: number; column: number }): void {
    if (point.row === 0) {
      this.flipInitial(point.column);
      return;
    }
    this.pause();
    this.inspectionRow = point.row;
    this.inspectionColumn = point.column;
    if (this.inspector) this.inspector.nativeElement.open = true;
  }
  get inspection(): { input: string; output: number } | null {
    if (
      !integerIn(this.inspectionRow, 1, this.visible - 1) ||
      !integerIn(this.inspectionColumn, 0, this.width - 1)
    )
      return null;
    const row = this.rows[this.inspectionRow - 1];
    return {
      input: [-1, 0, 1]
        .map((delta) => cell(row, this.inspectionColumn + delta, this.boundary))
        .join(''),
      output: this.rows[this.inspectionRow][this.inspectionColumn],
    };
  }
  get highlights(): { row: number; column: number }[] {
    if (!this.inspection) return [];
    const points = [-1, 0, 1].map((delta) => ({
      row: this.inspectionRow - 1,
      column:
        this.boundary === 'periodic'
          ? (this.inspectionColumn + delta + this.width) % this.width
          : this.inspectionColumn + delta,
    }));
    return [
      ...points,
      { row: this.inspectionRow, column: this.inspectionColumn },
    ];
  }
  get sequence(): number[] {
    return integerIn(this.column, 0, this.width - 1)
      ? this.rows.slice(0, this.visible).map((row) => row[this.column])
      : [];
  }
  get singleStats() {
    return frequencies(this.sequence, 1);
  }
  get blockStats() {
    return frequencies(this.sequence, this.blockSize);
  }
  centerColumn(): void {
    this.column = Math.floor(this.width / 2);
  }

  setMode(mode: typeof this.mode): void {
    this.mode = mode;
    this.refreshMode();
  }
  refreshMode(): void {
    if (this.error) return;
    if (this.mode === 'compare' && this.validComparison) {
      this.comparison = evolve(
        this.compareRule,
        this.initial,
        this.generations,
        this.boundary,
      );
      this.third = this.showThird
        ? evolve(this.thirdRule, this.initial, this.generations, this.boundary)
        : [];
    }
    if (
      this.mode === 'difference' &&
      integerIn(this.perturbColumn, 0, this.width - 1)
    ) {
      const changed = this.initial.slice();
      changed[this.perturbColumn] ^= 1;
      this.perturbed = evolve(
        this.rule,
        changed,
        this.generations,
        this.boundary,
      );
      this.differenceRows = differences(this.rows, this.perturbed);
    }
    if (this.mode === 'atlas') this.loadAtlas();
  }
  get validComparison(): boolean {
    return (
      integerIn(this.compareRule, 0, 255) &&
      (!this.showThird || integerIn(this.thirdRule, 0, 255))
    );
  }
  get validPerturbation(): boolean {
    return integerIn(this.perturbColumn, 0, this.width - 1);
  }
  get differenceCount(): number {
    return (
      this.differenceRows[this.visible - 1]?.reduce(
        (sum, bit) => sum + bit,
        0,
      ) ?? 0
    );
  }
  loadAtlas(): void {
    const rules = this.featuredOnly
      ? this.presets.map((p) => p.rule)
      : Array.from({ length: 32 }, (_, i) => this.page * 32 + i);
    this.atlas = rules.map((rule) => ({
      rule,
      rows: evolve(rule, singleSeed(65), 32, 'fixed'),
    }));
  }
  atlasPage(delta: number): void {
    this.page = Math.max(0, Math.min(7, this.page + delta));
    this.loadAtlas();
  }
  openAtlas(rule: number): void {
    this.mode = 'explore';
    this.initial = singleSeed(this.width);
    this.selectRule(rule);
  }
}

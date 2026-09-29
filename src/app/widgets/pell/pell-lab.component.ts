import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PellComparisonComponent } from './pell-comparison.component';
import {
  fundamental,
  logInteger,
  norm,
  pellConvergents,
  pellSolutions,
  plotRatio,
  scientificError,
  smallSearch,
  sqrtExpansion,
  PellPoint,
} from './pell.math';

@Component({
  selector: 'app-pell-lab',
  standalone: true,
  imports: [FormsModule, PellComparisonComponent],
  templateUrl: './pell-lab.component.html',
  styleUrls: ['../modular/modular-widgets.css', './pell-lab.component.css'],
})
export class PellLabComponent {
  dText = '2';
  error = '';
  expansion = sqrtExpansion(2n);
  unit = fundamental(this.expansion)!;
  negative: PellPoint | null = fundamental(this.expansion, -1);
  rows = pellConvergents(this.expansion, 4);
  solutions = pellSolutions(2n, this.unit, 8);
  search = smallSearch(2n, 30);
  searchLimit = 30;
  step = 0;
  count = 8;
  selected = 0;
  span = 20;
  scale = 20n;
  logarithmic = true;
  readonly presets = [2, 3, 5, 6, 7, 13, 61];
  readonly one = 1n;
  readonly minusOne = -1n;
  readonly scientificError = scientificError;
  readonly norm = norm;
  readonly ticks = [-1, -0.5, 0, 0.5, 1];
  lattice: { x: number; y: number; solution: boolean }[] = [];
  curves: string[] = [];
  marks: { x: number; y: number; index: number }[] = [];
  growthX = '';
  growthY = '';
  constructor() {
    this.update();
  }
  choose(D: number): void {
    this.dText = String(D);
    this.update();
  }
  update(): void {
    try {
      if (!/^\d{1,5}$/.test(this.dText.trim())) {
        throw new RangeError('Introduce un entero D entre 1 y 10000.');
      }
      const D = BigInt(this.dText.trim());
      if (D < 1n || D > 10000n) {
        throw new RangeError('El laboratorio admite 1 ≤ D ≤ 10000.');
      }
      this.expansion = sqrtExpansion(D, 10000);
      this.error = '';
      this.step = 0;
      this.selected = 0;
      this.scale = BigInt(this.span);
      if (this.expansion.square) {
        this.rows = [];
        this.solutions = [];
        this.search = [];
        return;
      }
      this.unit = fundamental(this.expansion)!;
      this.negative = fundamental(this.expansion, -1);
      this.rows = pellConvergents(
        this.expansion,
        this.expansion.period.length * 2 + 2,
      );
      this.generate();
      this.searchSmall();
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
  get root(): string {
    return Math.sqrt(Number(this.expansion.D)).toPrecision(12);
  }
  get fundamentalIndex(): number {
    const L = this.expansion.period.length;
    return (L % 2 ? 2 * L : L) - 1;
  }
  get visibleRows() {
    return this.rows.slice(Math.max(0, this.step - 7), this.step + 1);
  }
  get currentState() {
    const L = this.expansion.period.length;
    return this.expansion.states[
      this.step === 0 ? 0 : ((this.step - 1) % L) + 1
    ];
  }
  move(delta: number): void {
    this.step = Math.max(0, Math.min(this.rows.length - 1, this.step + delta));
  }
  generate(): void {
    this.solutions = pellSolutions(this.expansion.D, this.unit, this.count);
    this.selected = Math.min(this.selected, this.solutions.length - 1);
    this.draw();
    this.growth();
  }
  searchSmall(): void {
    this.search = smallSearch(this.expansion.D, this.searchLimit);
  }
  get point(): PellPoint {
    return this.solutions[this.selected];
  }
  get ratio(): string {
    return (
      10 **
      (logInteger(this.point.x) - logInteger(this.point.y))
    ).toPrecision(10);
  }
  select(index: number): void {
    this.selected = index;
  }
  fit(): void {
    this.scale = (this.point.x * 12n) / 10n + 2n;
    this.draw();
  }
  zoom(): void {
    this.scale = BigInt(this.span);
    this.draw();
  }
  coordinate(value: bigint): number {
    return 260 + 220 * plotRatio(value, this.scale);
  }
  draw(): void {
    this.lattice = [];
    if (this.scale <= 30n) {
      const bound = Number(this.scale);
      for (let x = -bound; x <= bound; x++) {
        for (let y = -bound; y <= bound; y++) {
          this.lattice.push({
            x: 260 + (220 * x) / bound,
            y: 260 - (220 * y) / bound,
            solution:
              norm(this.expansion.D, { x: BigInt(x), y: BigInt(y) }) === 1n,
          });
        }
      }
    }
    const inverseScale = 10 ** -logInteger(this.scale),
      D = Number(this.expansion.D);
    this.curves = [1, -1].map((sign) => {
      const points: string[] = [];
      for (let i = 0; i <= 300; i++) {
        const y = -1 + i / 150,
          x = Math.sqrt(inverseScale * inverseScale + D * y * y);
        if (x <= 1) {
          points.push(
            (points.length ? 'L' : 'M') +
              (260 + sign * x * 220) +
              ',' +
              (260 - y * 220),
          );
        }
      }
      return points.join(' ');
    });
    this.marks = this.solutions.flatMap((p, index) =>
      p.x > this.scale
        ? []
        : [1n, -1n].flatMap((sx) =>
            [1n, -1n].map((sy) => ({
              x: this.coordinate(p.x * sx),
              y: 520 - this.coordinate(p.y * sy),
              index,
            })),
          ),
    );
  }
  growth(): void {
    const max = this.solutions[this.solutions.length - 1].x;
    const path = (coordinate: 'x' | 'y') =>
      this.solutions
        .map((p, i) => {
          const height = this.logarithmic
            ? logInteger(p[coordinate]) / logInteger(max)
            : plotRatio(p[coordinate], max);
          return (
            (i ? 'L' : 'M') +
            (45 + (450 * i) / (this.solutions.length - 1)) +
            ',' +
            (255 - 220 * height)
          );
        })
        .join(' ');
    this.growthX = path('x');
    this.growthY = path('y');
  }
  get growthTop(): string {
    return this.logarithmic
      ? logInteger(this.solutions[this.solutions.length - 1].x).toFixed(2)
      : this.solutions[this.solutions.length - 1].x.toString();
  }
}

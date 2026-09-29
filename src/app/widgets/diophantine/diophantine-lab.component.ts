import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { backSubstitutions, parseInteger } from '../euclid/euclid.math';
import { DiophantineLatticeComponent } from './diophantine-lattice.component';
import {
  allowed,
  parameterRange,
  parameterSamples,
  rangeCount,
  solutionAt,
  solveDiophantine,
  SolutionConstraints,
  ParameterRange,
  IntegerPoint,
} from './diophantine.math';

@Component({
  selector: 'app-diophantine-lab',
  standalone: true,
  imports: [FormsModule, DiophantineLatticeComponent],
  templateUrl: './diophantine-lab.component.html',
  styleUrls: [
    '../modular/modular-widgets.css',
    './diophantine-lab.component.css',
  ],
})
export class DiophantineLabComponent {
  aText = '6';
  bText = '9';
  cText = '3';
  result = solveDiophantine(6n, 9n, 3n);
  error = '';
  constraintError = '';
  parameterError = '';
  mode: 'all' | 'nonnegative' | 'positive' | 'box' = 'all';
  xMin = '0';
  xMax = '20';
  yMin = '0';
  yMax = '20';
  constraints: SolutionConstraints = {
    x: { min: null, max: null },
    y: { min: null, max: null },
  };
  range: ParameterRange = { min: null, max: null, empty: false };
  count: bigint | null = null;
  t = 0n;
  tText = '0';
  slider = 0;
  sliderCenter = 0n;
  trace: string[] = [];
  traceStep = 0;
  readonly zero = 0n;
  readonly cOffsets = Array.from({ length: 13 }, (_, i) => BigInt(i - 6));
  constructor() {
    this.update();
  }
  update(): void {
    this.traceStep = 0;
    this.t = 0n;
    this.tText = '0';
    this.slider = 0;
    this.sliderCenter = 0n;
    this.parameterError = '';
    try {
      this.result = solveDiophantine(
        parseInteger(this.aText),
        parseInteger(this.bText),
        parseInteger(this.cText),
      );
      this.error = '';
      this.buildTrace();
      this.updateConstraints();
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
  preset(a: string, b: string, c: string): void {
    this.aText = a;
    this.bText = b;
    this.cText = c;
    this.update();
  }
  changeC(value: bigint): void {
    this.cText = value.toString();
    this.update();
  }
  exists(c: bigint): boolean {
    return this.result.euclid.gcd === 0n
      ? c === 0n
      : c % this.result.euclid.gcd === 0n;
  }
  updateConstraints(): void {
    try {
      const lower =
        this.mode === 'positive' ? 1n : this.mode === 'nonnegative' ? 0n : null;
      const bound = (text: string) => (text.trim() ? parseInteger(text) : null);
      this.constraints =
        this.mode === 'box'
          ? {
              x: { min: bound(this.xMin), max: bound(this.xMax) },
              y: { min: bound(this.yMin), max: bound(this.yMax) },
            }
          : { x: { min: lower, max: null }, y: { min: lower, max: null } };
      for (const b of [this.constraints.x, this.constraints.y]) {
        if (b.min !== null && b.max !== null && b.min > b.max) {
          throw new RangeError(
            'Cada límite inferior debe ser menor o igual que el superior.',
          );
        }
      }
      if (this.result.kind === 'line') {
        this.range = parameterRange(this.result, this.constraints);
        this.count = rangeCount(this.range);
      } else if (this.result.kind === 'none') {
        this.count = 0n;
      } else {
        const lengths = [this.constraints.x, this.constraints.y].map((b) =>
          b.min === null || b.max === null ? null : b.max - b.min + 1n,
        );
        this.count =
          lengths[0] === null || lengths[1] === null
            ? null
            : lengths[0] * lengths[1];
      }
      this.constraintError = '';
    } catch (error) {
      this.constraintError = (error as Error).message;
    }
  }
  setT(value: bigint): void {
    this.t = value;
    this.tText = value.toString();
    this.sliderCenter = value;
    this.slider = 0;
    this.parameterError = '';
  }
  readT(): void {
    if (!/^[+-]?\d{1,60}$/.test(this.tText.trim())) {
      this.parameterError = 'Introduce un parámetro entero de hasta 60 cifras.';
      return;
    }
    this.setT(BigInt(this.tText.trim()));
  }
  slide(): void {
    this.t = this.sliderCenter + BigInt(this.slider);
    this.tText = this.t.toString();
    this.parameterError = '';
  }
  moveT(delta: number): void {
    this.setT(this.t + BigInt(delta));
  }
  firstAllowed(): void {
    if (this.range.empty) {
      return;
    }
    this.setT(this.range.min ?? this.range.max ?? 0n);
  }
  get selected(): IntegerPoint | null {
    return this.result.kind === 'line' && !this.parameterError
      ? solutionAt(this.result, this.t)
      : null;
  }
  get selectedAllowed(): boolean {
    return (
      !!this.selected &&
      !this.constraintError &&
      allowed(this.selected, this.constraints)
    );
  }
  get sampleRows() {
    if (
      this.result.kind !== 'line' ||
      this.constraintError ||
      this.parameterError
    ) {
      return [];
    }
    return parameterSamples(this.range, this.t).map((t) => {
      const point = solutionAt(this.result, t);
      return {
        t,
        ...point,
        value: this.result.a * point.x + this.result.b * point.y,
      };
    });
  }
  moveTrace(delta: number): void {
    this.traceStep = Math.max(
      0,
      Math.min(this.trace.length - 1, this.traceStep + delta),
    );
  }
  private buildTrace(): void {
    const r = this.result,
      e = r.euclid;
    this.trace = [
      'Partimos de R0 = |a| = ' +
        e.rows[0].remainder +
        ' y R1 = |b| = ' +
        e.rows[1].remainder +
        '.',
    ];
    for (const q of e.divisions) {
      this.trace.push(
        q.dividend +
          ' = ' +
          q.divisor +
          ' · ' +
          q.quotient +
          ' + ' +
          q.remainder +
          '.',
      );
    }
    this.trace.push('MCD(' + r.a + ', ' + r.b + ') = ' + e.gcd + '.');
    if (e.gcd === 0n) {
      this.trace.push(
        r.kind === 'plane'
          ? '0 = 0: x e y son dos enteros libres.'
          : '0 no es igual a ' + r.c + ': no hay solución.',
      );
      return;
    }
    if (r.kind === 'none') {
      this.trace.push(
        e.gcd +
          ' no divide ' +
          r.c +
          ': ninguna combinación entera puede producir ese término.',
      );
      return;
    }
    for (const s of backSubstitutions(e)) {
      const replacement =
        s.replaced === null
          ? 'Partimos del último resto no nulo. '
          : 'Sustituimos R' +
            s.replaced +
            ' = R' +
            (s.replaced - 2) +
            ' − (' +
            e.rows[s.replaced].quotient +
            ')R' +
            (s.replaced - 1) +
            '. ';
      this.trace.push(
        replacement +
          e.gcd +
          ' = ' +
          s.terms
            .map((term) => '(' + term.coefficient + ')R' + term.index)
            .join(' + ') +
          ' = ' +
          s.terms
            .map(
              (term) =>
                '(' +
                term.coefficient +
                ')·(' +
                e.rows[term.index].remainder +
                ')',
            )
            .join(' + ') +
          '.',
      );
    }
    this.trace.push(
      'Con los signos originales: (' +
        r.a +
        ')·(' +
        e.x +
        ') + (' +
        r.b +
        ')·(' +
        e.y +
        ') = ' +
        e.gcd +
        '.',
    );
    this.trace.push(
      'Multiplicamos por c/d = ' +
        r.scale +
        ': x₀ = ' +
        r.particular!.x +
        ', y₀ = ' +
        r.particular!.y +
        '.',
    );
    this.trace.push(
      'Todas las soluciones: x = ' +
        r.particular!.x +
        ' + (' +
        r.direction!.x +
        ')t; y = ' +
        r.particular!.y +
        ' + (' +
        r.direction!.y +
        ')t, con t entero.',
    );
  }
}

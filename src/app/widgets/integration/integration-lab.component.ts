import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  gaussianEstimate,
  halton,
  parameterIntegrand,
  quadrature,
  QuadratureRule,
  seededPoints,
} from './integration-math';

type Lab =
  | 'substitution'
  | 'parameter'
  | 'residues'
  | 'laplace'
  | 'quadrature'
  | 'sampling';
interface Curve {
  label: string;
  color: string;
  path: string;
}

@Component({
  selector: 'app-integration-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './integration-lab.component.html',
  styleUrls: ['./integration-lab.component.css'],
})
export class IntegrationLabComponent implements OnChanges {
  @Input() mode: Lab = 'substitution';
  parameter = 1;
  panels = 8;
  lambda = 8;
  radius = 1.5;
  count = 256;
  seed = 42;
  sampling = 'random';
  functionId = 'exp';
  rule: QuadratureRule = 'trapezoid';
  curves: Curve[] = [];
  shapes: string[] = [];
  dots: { x: number; y: number; inside: boolean }[] = [];
  rows: { name: string; value: number; error: number; evaluations: number }[] =
    [];
  result = 0;
  reference = 0;
  uncertainty = 0;
  xmax = 1;
  ymax = 3;
  note = '';
  readonly titles: Record<Lab, string> = {
    substitution: 'Un cambio de variable, dos áreas',
    parameter: 'Derivar una integral respecto a un parámetro',
    residues: 'Un contorno que captura polos',
    laplace: 'Cuando una integral se concentra',
    quadrature: 'Laboratorio de cuadraturas',
    sampling: 'Azar frente a baja discrepancia',
  };
  ngOnChanges(): void {
    this.reset();
  }
  reset(): void {
    this.parameter = 1;
    this.panels = 8;
    this.lambda = 8;
    this.radius = 1.5;
    this.count = 256;
    this.seed = 42;
    this.sampling = 'random';
    this.functionId = 'exp';
    this.rule = 'trapezoid';
    this.update();
  }
  x(value: number): number {
    return 52 + (value / this.xmax) * 568;
  }
  y(value: number): number {
    return 246 - (value / this.ymax) * 212;
  }
  format(value: number): string {
    return value !== 0 && Math.abs(value) < 0.0001
      ? value.toExponential(3)
      : value.toFixed(6);
  }
  path(f: (x: number) => number): string {
    return Array.from({ length: 241 }, (_, i) => {
      const x = (this.xmax * i) / 240;
      return `${i ? 'L' : 'M'}${this.x(x)},${this.y(f(x))}`;
    }).join(' ');
  }
  add(f: (x: number) => number, label: string, color: string): void {
    this.curves.push({ label, color, path: this.path(f) });
  }
  update(): void {
    this.curves = [];
    this.shapes = [];
    this.dots = [];
    this.rows = [];
    this.xmax = 1;
    this.ymax = 3;
    this.note = '';
    if (this.mode === 'substitution') {
      this.xmax = 2;
      this.ymax = 22;
      const b = this.parameter;
      this.add((x) => 2 * x * (1 + x * x), 'Original: 2x(1+x²)', '#73d8e6');
      this.add((u) => 1 + u, 'Transformada: 1+u', '#edbb72');
      this.shapes = [
        this.area((x) => 2 * x * (1 + x * x), b),
        this.area((u) => 1 + u, b * b),
      ];
      this.result = b * b + b ** 4 / 2;
      this.note = `x llega a ${b.toFixed(2)}; u = x² llega a ${(b * b).toFixed(2)}. Ambas áreas valen ${this.format(this.result)}. El factor 2x es el jacobiano.`;
    } else if (this.mode === 'parameter') {
      this.ymax = 4.2;
      this.add(
        (x) => parameterIntegrand(x, this.parameter),
        'ln(1+ax)/x, extendida en x=0',
        '#73d8e6',
      );
      this.add(
        (x) => 1 / (1 + this.parameter * x),
        'Derivada respecto a a: 1/(1+ax)',
        '#edbb72',
      );
      this.result = quadrature(
        (x) => parameterIntegrand(x, this.parameter),
        0,
        1,
        200,
        'simpson',
      );
      this.reference =
        this.parameter === 0 ? 1 : Math.log1p(this.parameter) / this.parameter;
      this.note = `F(a) ≈ ${this.format(this.result)} (Simpson, 200 paneles). F′(a) = ${this.format(this.reference)}. F(0) = 0 fija la constante al integrar F′.`;
    } else if (this.mode === 'laplace') {
      this.xmax = 4;
      this.ymax = 1.1;
      this.add(
        (x) => Math.exp(-this.lambda * ((x - 2) ** 2 / 2 + (x - 2) ** 4 / 4)),
        'Pico real: exp[−λ(t²/2+t⁴/4)], t=x−2',
        '#73d8e6',
      );
      this.add(
        (x) => Math.exp((-this.lambda * (x - 2) ** 2) / 2),
        'Aproximación gaussiana',
        '#edbb72',
      );
      this.result = quadrature(
        (t) => Math.exp(-this.lambda * ((t * t) / 2 + t ** 4 / 4)),
        -2,
        2,
        400,
        'simpson',
      );
      this.reference = gaussianEstimate(this.lambda);
      this.note = `Integral en [−2,2] ≈ ${this.format(this.result)}; término asintótico sobre toda la recta: ${this.format(this.reference)}. Diferencia relativa: ${(100 * Math.abs(this.reference / this.result - 1)).toFixed(2)} %. El eje dibuja x=t+2.`;
    } else if (this.mode === 'residues') {
      const boundary = Math.abs(this.radius - 1) < 1e-8;
      this.result = this.radius < 1 ? 0 : Math.PI;
      this.note = boundary
        ? 'R = 1: el contorno pasa por el polo i. La integral de contorno ordinaria no está definida.'
        : `R = ${this.radius.toFixed(2)}: ${this.radius < 1 ? 'ningún polo dentro; integral cerrada = 0' : 'el polo i queda dentro; residuo = 1/(2i); integral cerrada = π'}. El arco solo desaparece en el límite R → ∞.`;
    } else if (this.mode === 'quadrature') {
      const f =
        this.functionId === 'exp'
          ? (x: number) => Math.exp(x)
          : this.functionId === 'peak'
            ? (x: number) => 1 / (1 + 400 * (x - 0.37) ** 2)
            : (x: number) => Math.sqrt(x);
      this.reference =
        this.functionId === 'exp'
          ? Math.E - 1
          : this.functionId === 'peak'
            ? (Math.atan(12.6) + Math.atan(7.4)) / 20
            : 2 / 3;
      this.ymax = this.functionId === 'exp' ? 3 : 1.15;
      this.add(f, 'Integrando', '#73d8e6');
      const rules: { id: QuadratureRule; name: string }[] = [
        { id: 'midpoint', name: 'Punto medio' },
        { id: 'trapezoid', name: 'Trapecio' },
        { id: 'simpson', name: 'Simpson' },
        { id: 'gauss', name: 'Gauss de 2 nodos por panel' },
      ];
      this.rows = rules.map((r) => {
        const value = quadrature(f, 0, 1, this.panels, r.id);
        return {
          name: r.name,
          value,
          error: Math.abs(value - this.reference),
          evaluations:
            r.id === 'gauss'
              ? 2 * this.panels
              : r.id === 'midpoint'
                ? this.panels
                : this.panels + 1,
        };
      });
      for (let i = 0; i < this.panels; i++) {
        const a = i / this.panels,
          b = (i + 1) / this.panels,
          m = (a + b) / 2;
        if (this.rule === 'midpoint' || this.rule === 'trapezoid') {
          const ya = this.rule === 'midpoint' ? f(m) : f(a),
            yb = this.rule === 'midpoint' ? f(m) : f(b);
          this.shapes.push(
            `M${this.x(a)},246 L${this.x(a)},${this.y(ya)} L${this.x(b)},${this.y(yb)} L${this.x(b)},246 Z`,
          );
        } else if (this.rule === 'gauss') {
          for (const x of [
            m - (b - a) / (2 * Math.sqrt(3)),
            m + (b - a) / (2 * Math.sqrt(3)),
          ])
            this.dots.push({ x: this.x(x), y: this.y(f(x)), inside: true });
        } else if (i % 2 === 0) {
          const c = (i + 2) / this.panels,
            mid = (a + c) / 2;
          const points = Array.from({ length: 17 }, (_, j) => {
            const t = j / 16,
              x = a + (c - a) * t;
            const v =
              f(a) * 2 * (t - 0.5) * (t - 1) -
              4 * f(mid) * t * (t - 1) +
              f(c) * 2 * t * (t - 0.5);
            return `L${this.x(x)},${this.y(v)}`;
          }).join(' ');
          this.shapes.push(`M${this.x(a)},246 ${points} L${this.x(c)},246 Z`);
        }
      }
      this.note = `Valor exacto: ${this.format(this.reference)}. Las áreas o nodos corresponden al método seleccionado. La tabla compara el mismo número de paneles; los nodos distintos indican el coste con reutilización.`;
    } else {
      this.ymax = 1;
      const points =
        this.sampling === 'random'
          ? seededPoints(this.count, this.seed)
          : Array.from({ length: this.count }, (_, i) => ({
              x: halton(i + 1, 2),
              y: halton(i + 1, 3),
            }));
      let hits = 0;
      this.dots = points.map((p) => {
        const inside = p.x * p.x + p.y * p.y <= 1;
        if (inside) hits++;
        return { x: this.x(p.x), y: this.y(p.y), inside };
      });
      this.add(
        (x) => Math.sqrt(Math.max(0, 1 - x * x)),
        'Cuarto de círculo unidad',
        '#edbb72',
      );
      this.result = (4 * hits) / this.count;
      const p = hits / this.count;
      this.uncertainty = 4 * Math.sqrt((p * (1 - p)) / this.count);
      this.note =
        `π ≈ ${this.format(this.result)}; error observado = ${this.format(Math.abs(this.result - Math.PI))}. ` +
        (this.sampling === 'random'
          ? `Error estándar estimado: ${this.format(this.uncertainty)} (modelo de muestras independientes).`
          : 'Halton es determinista: no se le asigna el error estándar de Monte Carlo.');
    }
  }
  area(f: (x: number) => number, end: number): string {
    return (
      `M${this.x(0)},246 ` +
      Array.from({ length: 100 }, (_, i) => {
        const x = (end * i) / 99;
        return `L${this.x(x)},${this.y(f(x))}`;
      }).join(' ') +
      ` L${this.x(end)},246 Z`
    );
  }
  resample(): void {
    this.seed++;
    this.update();
  }
}

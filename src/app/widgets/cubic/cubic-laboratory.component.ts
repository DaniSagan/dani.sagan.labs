import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { cubicResidual, CubicRoot, solveCubic } from '../../shared/math/cubic';

@Component({
  selector: 'app-cubic-laboratory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cubic-laboratory.component.html',
  styleUrls: [
    '../sandpile/sandpile-widgets.css',
    './cubic-laboratory.component.css',
  ],
})
export class CubicLaboratoryComponent {
  a = 1;
  b = 0;
  c = -3;
  d = 1;
  readonly coefficients = ['a', 'b', 'c', 'd'] as const;
  readonly modes = [
    'Curva y raíces',
    'Mapa del discriminante',
    'Círculo trigonométrico',
    'Tangentes de Newton',
  ];
  mode = 0;
  solution = solveCubic(this.a, this.b, this.c, this.d);
  error = '';
  x0 = 2.5;
  iterates: number[] = [];
  newtonMessage = '';
  constructor() {
    this.resetNewton();
  }
  get s() {
    return this.solution;
  }
  get extent() {
    return Math.max(
      3,
      ...this.s.roots.map((r) => Math.abs(r.re) + 1),
      Math.abs(this.s.shift) + 1,
    );
  }
  get yExtent() {
    return Math.max(
      3,
      Math.abs(this.value(-this.extent)),
      Math.abs(this.value(this.extent)),
    );
  }
  get complexExtent() {
    return Math.max(
      2,
      ...this.s.roots.map(
        (r) => Math.max(Math.abs(r.re), Math.abs(r.im)) * 1.3,
      ),
    );
  }
  get classification() {
    return this.s.kind === 'three'
      ? 'Tres raíces reales distintas'
      : this.s.kind === 'one'
        ? 'Una raíz real y dos complejas conjugadas'
        : 'Raíces reales con multiplicidad';
  }
  get theta() {
    return (
      Math.acos(
        Math.max(
          -1,
          Math.min(1, -this.s.q / (2 * Math.sqrt(-((this.s.p / 3) ** 3)))),
        ),
      ) / 3
    );
  }
  get radius() {
    return 2 * Math.sqrt(-this.s.p / 3);
  }
  get curve() {
    return Array.from({ length: 501 }, (_, i) => {
      const x = -this.extent + (2 * this.extent * i) / 500;
      return `${i ? 'L' : 'M'}${this.px(x)},${this.py(this.value(x))}`;
    }).join(' ');
  }
  get cusp() {
    const points = Array.from({ length: 201 }, (_, i) => {
      const t = -Math.sqrt(2) + (2 * Math.sqrt(2) * i) / 200;
      return `${i ? 'L' : 'M'}${this.mapX(-3 * t * t)},${this.mapY(2 * t * t * t)}`;
    });
    return points.join(' ');
  }
  get mapVisible() {
    return Math.abs(this.s.p) <= 6 && Math.abs(this.s.q) <= 6;
  }
  update() {
    if (
      !this.coefficients.every(
        (key) => Number.isFinite(this[key]) && Math.abs(this[key]) <= 20,
      ) ||
      Math.abs(this.a) < 0.1
    ) {
      this.error =
        'Usa coeficientes entre −20 y 20 y |a| ≥ 0,1. Para a = 0 la ecuación deja de ser cúbica.';
      return;
    }
    this.error = '';
    this.solution = solveCubic(this.a, this.b, this.c, this.d);
    this.resetNewton();
  }
  preset(b: number, c: number, d: number) {
    this.a = 1;
    this.b = b;
    this.c = c;
    this.d = d;
    this.update();
  }
  setParameter(key: 'p' | 'q', value: number) {
    const p = key === 'p' ? value : this.s.p;
    const q = key === 'q' ? value : this.s.q;
    this.preset(0, Math.max(-6, Math.min(6, p)), Math.max(-6, Math.min(6, q)));
  }
  selectMap(event: MouseEvent) {
    const svg = event.currentTarget as SVGSVGElement;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    this.preset(
      0,
      Math.round(Math.max(-6, Math.min(6, (local.x - 300) / 40)) * 100) / 100,
      Math.round(Math.max(-6, Math.min(6, (180 - local.y) / 24)) * 100) / 100,
    );
  }
  value(x: number) {
    return ((this.a * x + this.b) * x + this.c) * x + this.d;
  }
  derivative(x: number) {
    return (3 * this.a * x + 2 * this.b) * x + this.c;
  }
  px(x: number) {
    return 300 + (260 * x) / this.extent;
  }
  py(y: number) {
    return 180 - (140 * y) / this.yExtent;
  }
  cx(x: number) {
    return 300 + (140 * x) / this.complexExtent;
  }
  cy(y: number) {
    return 180 - (140 * y) / this.complexExtent;
  }
  mapX(p: number) {
    return 300 + p * 40;
  }
  mapY(q: number) {
    return 180 - q * 24;
  }
  circleX(k: number) {
    return 300 + 125 * Math.cos(this.theta - (2 * Math.PI * k) / 3);
  }
  circleY(k: number) {
    return 160 - 125 * Math.sin(this.theta - (2 * Math.PI * k) / 3);
  }
  fmt(n: number) {
    return Math.abs(n) < 1e-12
      ? '0'
      : Number(n.toPrecision(6)).toLocaleString('es-ES', {
          maximumSignificantDigits: 6,
        });
  }
  rootText(r: CubicRoot) {
    return (
      this.fmt(r.re) +
      (r.im ? ` ${r.im < 0 ? '−' : '+'} ${this.fmt(Math.abs(r.im))}i` : '')
    );
  }
  residual(r: CubicRoot) {
    return cubicResidual(this.a, this.b, this.c, this.d, r).toExponential(2);
  }
  resetNewton() {
    this.iterates = [this.x0];
    this.newtonMessage = '';
  }
  step() {
    const x = this.iterates[this.iterates.length - 1];
    if (Math.abs(this.value(x)) < 1e-10) {
      this.newtonMessage = 'Residuo menor que 10⁻¹⁰: aproximación alcanzada.';
      return;
    }
    const derivative = this.derivative(x);
    if (Math.abs(derivative) < 1e-12) {
      this.newtonMessage = 'Tangente horizontal: cambia el punto inicial.';
      return;
    }
    const next = x - this.value(x) / derivative;
    if (!Number.isFinite(next) || Math.abs(next) > 1e6) {
      this.newtonMessage =
        'La iteración sale del rango numérico del laboratorio. Cambia x₀.';
      return;
    }
    this.iterates = [...this.iterates, next];
    if (this.iterates.length >= 31)
      this.newtonMessage =
        'Límite de 30 pasos. Un residuo pequeño, no el número de pasos, indica convergencia.';
  }
  get tangent() {
    const x = this.iterates[this.iterates.length - 1];
    const y = this.value(x),
      m = this.derivative(x);
    return `M${this.px(-this.extent)},${this.py(y + m * (-this.extent - x))} L${this.px(this.extent)},${this.py(y + m * (this.extent - x))}`;
  }
}

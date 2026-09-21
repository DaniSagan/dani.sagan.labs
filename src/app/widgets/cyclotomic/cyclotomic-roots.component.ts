import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { cyclotomic, divisors, gcd, polynomialText } from '../../shared/math/cyclotomic';

@Component({
  selector: 'app-cyclotomic-roots', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './cyclotomic-roots.component.html', styleUrl: './cyclotomic-widgets.css'
})
export class CyclotomicRootsComponent {
  n = 12; k = 1; onlyPrimitive = false;
  readonly presets = [5, 8, 12, 15, 30, 105];
  get ds() { return divisors(this.n); }
  get coefficients() { return cyclotomic(this.n); }
  get degree() { return this.coefficients.length - 1; }
  get roots() { return Array.from({ length: this.n }, (_, k) => ({ k, order: this.n / gcd(k, this.n), x: 220 + 165 * Math.cos(2 * Math.PI * k / this.n), y: 210 - 165 * Math.sin(2 * Math.PI * k / this.n) })); }
  get order() { return this.n / gcd(this.k, this.n); }
  get powers() { const roots = this.roots; return Array.from({ length: this.order + 1 }, (_, j) => roots[(j * this.k) % this.n]); }
  get path() { return this.powers.map((r, j) => `${j ? 'L' : 'M'}${r.x},${r.y}`).join(' '); }
  get maximum() { return Math.max(...this.coefficients.map(c => Math.abs(Number(c)))); }
  get polynomial() { return polynomialText(this.coefficients); }
  get factorization() { return this.ds.map(d => `Φ${this.subscript(d)}(x)`).join(' · '); }
  subscript(n: number) { return n.toString().split('').map(c => '₀₁₂₃₄₅₆₇₈₉'[Number(c)]).join(''); }
  formula(n: number) { return polynomialText(cyclotomic(n)); }
  factorDegree(n: number) { return cyclotomic(n).length - 1; }
  color(order: number) { return `hsl(${(order * 137.508) % 360} 75% 70%)`; }
  setN(n: number) { this.n = Math.max(1, Math.min(120, Math.round(n))); this.k = Math.min(this.k, this.n - 1); }
}

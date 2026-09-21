import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { binomialMasses, normalBinProbability } from '../../shared/math/galton';

@Component({
  selector: 'app-galton-normal', standalone: true, imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './galton-normal.component.html', styleUrl: './galton-widgets.css'
})
export class GaltonNormalComponent {
  n = 30;
  p = 0.5;
  lower = 12;
  upper = 18;
  correction = true;
  standardized = false;
  masses = binomialMasses(this.n, this.p);
  readonly presets = [{ label: 'Pocas filas', n: 6, p: 0.5 }, { label: 'Campana simétrica', n: 60, p: 0.5 },
    { label: 'Sesgo fuerte', n: 30, p: 0.05 }, { label: 'Más filas con sesgo', n: 160, p: 0.15 }];
  get mean(): number { return this.n * this.p; }
  get sigma(): number { return Math.sqrt(this.n * this.p * (1 - this.p)); }
  get exact(): number { return this.masses.slice(this.lower, this.upper + 1).reduce((sum, mass) => sum + mass, 0); }
  get approximate(): number | null { return normalBinProbability(this.n, this.p, this.lower, this.upper, this.correction); }
  get error(): number | null { return this.approximate === null ? null : Math.abs(this.approximate - this.exact); }
  get densityScale(): number { return this.standardized && this.sigma > 0 ? this.sigma : 1; }
  get maxY(): number { return Math.max(...this.masses, this.sigma ? 1 / (this.sigma * Math.sqrt(2 * Math.PI)) : 0) * this.densityScale * 1.15; }
  get minX(): number { return this.standardized && this.sigma > 0 ? Math.max(-0.5, this.mean - 4 * this.sigma) : -0.5; }
  get maxX(): number { return this.standardized && this.sigma > 0 ? Math.min(this.n + 0.5, this.mean + 4 * this.sigma) : this.n + 0.5; }
  get bars() { return this.masses.map((mass, k) => ({ k, mass })).filter(b => b.k + 0.5 >= this.minX && b.k - 0.5 <= this.maxX); }
  get ticks() { return Array.from({ length: 5 }, (_, i) => {
    const value = this.minX + (this.maxX - this.minX) * i / 4;
    return { x: this.x(value), label: (this.standardized && this.sigma > 0 ? (value - this.mean) / this.sigma : value).toFixed(1) };
  }); }
  get curve(): string {
    if (!this.sigma) return '';
    return Array.from({ length: 301 }, (_, i) => {
      const value = this.minX + i / 300 * (this.maxX - this.minX);
      const density = Math.exp(-0.5 * ((value - this.mean) / this.sigma) ** 2) / (this.sigma * Math.sqrt(2 * Math.PI));
      return `${i ? 'L' : 'M'}${this.x(value)},${this.y(density * this.densityScale)}`;
    }).join(' ');
  }
  x(value: number): number { return 60 + (value - this.minX) / (this.maxX - this.minX) * 660; }
  y(value: number): number { return 255 - value / this.maxY * 220; }
  barX(k: number): number { return this.x(Math.max(this.minX, k - 0.5)); }
  barWidth(k: number): number { return Math.max(0, this.x(Math.min(this.maxX, k + 0.5)) - this.barX(k)); }
  update(): void {
    this.masses = binomialMasses(this.n, this.p);
    this.lower = Math.min(this.lower, this.n);
    this.upper = Math.max(this.lower, Math.min(this.upper, this.n));
    if (!this.sigma) this.standardized = false;
  }
  select(n: number, p: number): void { this.n = n; this.p = p; this.update(); this.central(); }
  central(): void {
    this.lower = Math.max(0, Math.ceil(this.mean - this.sigma));
    this.upper = Math.min(this.n, Math.floor(this.mean + this.sigma));
    if (this.lower > this.upper) this.lower = this.upper = Math.round(this.mean);
  }
  setLower(value: number): void { this.lower = Number(value); this.upper = Math.max(this.lower, this.upper); }
  setUpper(value: number): void { this.upper = Number(value); this.lower = Math.min(this.lower, this.upper); }
}

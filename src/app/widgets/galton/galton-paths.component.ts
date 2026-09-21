import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { choose } from '../../shared/math/galton';

@Component({
  selector: 'app-galton-paths', standalone: true, imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './galton-paths.component.html', styleUrl: './galton-widgets.css'
})
export class GaltonPathsComponent {
  n = 6;
  k = 3;
  p = 0.5;
  path = [0];
  get nodes() { return Array.from({ length: this.n + 1 }, (_, row) => Array.from({ length: row + 1 }, (_, k) => ({ row, k, count: choose(row, k) }))).flat(); }
  get edges() { return this.nodes.filter(node => node.row < this.n).flatMap(node => [0, 1].map(step => ({
    path: `M${this.x(node.row, node.k)},${this.y(node.row)}L${this.x(node.row + 1, node.k + step)},${this.y(node.row + 1)}`,
    active: this.reachable(node.row + 1, node.k + step)
  }))); }
  get ways(): number { return choose(this.n, this.k); }
  get onePathProbability(): number { return this.p ** this.k * (1 - this.p) ** (this.n - this.k); }
  get probability(): number { return this.ways * this.onePathProbability; }
  get drawnPath(): string { return this.path.map((k, row) => `${row ? 'L' : 'M'}${this.x(row, k)},${this.y(row)}`).join(' '); }
  get instructions(): string { return this.path.slice(1).map((k, i) => k > this.path[i] ? 'D' : 'I').join(' → ') || 'Elige izquierda o derecha para empezar.'; }
  get currentK(): number { return this.path[this.path.length - 1]; }
  x(row: number, k: number): number { return 390 + (k - row / 2) * 680 / (this.n + 1); }
  y(row: number): number { return 30 + row / this.n * 320; }
  reachable(row: number, k: number): boolean { return k <= this.k && this.k - k <= this.n - row; }
  changeRows(): void { this.k = Math.min(this.k, this.n); this.path = [0]; }
  step(direction: number): void { if (this.path.length <= this.n) this.path = [...this.path, this.currentK + direction]; }
  undo(): void { if (this.path.length > 1) this.path = this.path.slice(0, -1); }
}

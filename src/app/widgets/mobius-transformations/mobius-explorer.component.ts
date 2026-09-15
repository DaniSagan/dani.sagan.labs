import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Complex, crossRatio, imageCircle, MOBIUS_PRESETS, mobius, pole } from './mobius.math';

@Component({
  selector: 'app-mobius-explorer', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mobius-explorer.component.html', styleUrls: ['./mobius-explorer.component.css']
})
export class MobiusExplorerComponent {
  readonly presets = MOBIUS_PRESETS;
  readonly ticks = [-3, -2, -1, 0, 1, 2, 3];
  index = 0;
  real = 1;
  imaginary = 0;
  radius = 1;
  angle = 0;
  fourthX = 0;
  get map() { return this.presets[this.index]; }
  get center() { return new Complex(this.real, this.imaginary); }
  get pole() { return pole(this.map); }
  get infinityImage() { return mobius(this.map, null); }
  get source() {
    const theta = this.angle * Math.PI / 180;
    // Exact quarter-turn coordinates also make the pole directly selectable.
    const quarter = this.angle / 90;
    const cos = Number.isInteger(quarter) ? [1, 0, -1, 0, 1][quarter] : Math.cos(theta);
    const sin = Number.isInteger(quarter) ? [0, 1, 0, -1, 0][quarter] : Math.sin(theta);
    return new Complex(this.real + this.radius * cos, this.imaginary + this.radius * sin);
  }
  get target() { return mobius(this.map, this.source); }
  get shape() { return imageCircle(this.map, this.center, this.radius); }
  get line() {
    const { L, C } = this.shape;
    const a = 2 * L.real, b = -2 * L.imaginary;
    return Math.abs(b) > Math.abs(a)
      ? `M${this.px(-4)},${this.py((-C + 4 * a) / b)} L${this.px(4)},${this.py((-C - 4 * a) / b)}`
      : `M${this.px((-C + 4 * b) / a)},${this.py(-4)} L${this.px((-C - 4 * b) / a)},${this.py(4)}`;
  }
  throughPole() {
    const p = this.pole;
    if (p) { this.real = p.real + 1; this.imaginary = p.imaginary; this.radius = 1; this.angle = 180; }
  }
  get points() { return [new Complex(-1, 1), new Complex(1, 1), new Complex(0, 0.5), new Complex(this.fourthX, 2)]; }
  get images() { return this.points.map(p => mobius(this.map, p)!); }
  get ratio() { return crossRatio(this.points); }
  get imageRatio() { return crossRatio(this.images); }
  px(x: number) { return 160 + x * 40; }
  py(y: number) { return 160 - y * 40; }
  visible(p: Complex | null) { return p !== null && Math.abs(p.real) <= 4 && Math.abs(p.imaginary) <= 4; }
  format(p: Complex | null): string {
    if (p === null) { return '∞'; }
    const number = (value: number) => (Math.abs(value) < 0.0000005 ? 0 : value).toLocaleString('es-ES', { maximumFractionDigits: 6 });
    return `${number(p.real)} ${p.imaginary < -0.0000005 ? '−' : '+'} ${number(Math.abs(p.imaginary))}i`;
  }
}

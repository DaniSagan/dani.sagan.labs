import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { imaginaryExponentialSums } from './euler-series.math';

@Component({
  selector: 'app-euler-series', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './euler-series.component.html',
  styleUrls: ['./euler-identity-explorer.component.css', './euler-series.component.css']
})
export class EulerSeriesComponent {
  turns = 1;
  order = 12;
  zoom = false;
  get angle() { return this.turns * Math.PI; }
  get sums() { return imaginaryExponentialSums(this.angle, this.order); }
  get last() { return this.sums[this.order]; }
  get target() {
    const quarter = this.turns * 2;
    if (Number.isInteger(quarter)) {
      const index = ((quarter % 4) + 4) % 4;
      return { real: [1, 0, -1, 0][index], imaginary: [0, 1, 0, -1][index] };
    }
    return { real: Math.cos(this.angle), imaginary: Math.sin(this.angle) };
  }
  get error() { return Math.hypot(this.last.real - this.target.real, this.last.imaginary - this.target.imaginary); }
  get scale() { return this.zoom ? 0.25 : Math.max(1.5, ...this.sums.map(s => Math.max(Math.abs(s.real), Math.abs(s.imaginary)))) * 1.15; }
  get center() { return this.zoom ? this.target : { real: 0, imaginary: 0 }; }
  x(value: number) { return 180 + (value - this.center.real) * 160 / this.scale; }
  y(value: number) { return 180 - (value - this.center.imaginary) * 160 / this.scale; }
  get path() { return this.sums.map(s => `${s.n ? 'L' : 'M'}${this.x(s.real)},${this.y(s.imaginary)}`).join(' '); }
}

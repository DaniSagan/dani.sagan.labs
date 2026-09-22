import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { exponentialIntegral } from '../../shared/math/laplace';
import { LaplacePlotComponent, LaplaceSeries } from './laplace-plot.component';

@Component({
  selector: 'app-laplace-convergence',
  standalone: true,
  imports: [FormsModule, DecimalPipe, LaplacePlotComponent],
  templateUrl: './laplace-convergence.component.html',
  styleUrl: './laplace-widgets.css',
})
export class LaplaceConvergenceComponent {
  a = 0.5;
  sigma = 1.5;
  omega = 2;
  time = 8;
  integrand: LaplaceSeries[] = [];
  integral: LaplaceSeries[] = [];
  value = { re: 0, im: 0 };
  constructor() {
    this.update();
  }
  get converges() {
    return this.sigma > this.a;
  }
  get limit() {
    const d = this.sigma - this.a;
    const norm = d * d + this.omega ** 2;
    return { re: d / norm, im: -this.omega / norm };
  }
  get error() {
    return (
      Math.exp(-(this.sigma - this.a) * this.time) /
      Math.hypot(this.sigma - this.a, this.omega)
    );
  }
  preset(sigma: number, omega: number): void {
    this.a = 0.5;
    this.sigma = sigma;
    this.omega = omega;
    this.update();
  }
  update(): void {
    const times = Array.from({ length: 501 }, (_, i) => (i * this.time) / 500);
    this.integrand = [
      {
        label: 'Parte real del integrando',
        color: '#70dbd0',
        values: times.map(
          (t) => Math.exp((this.a - this.sigma) * t) * Math.cos(this.omega * t),
        ),
      },
      {
        label: 'Parte imaginaria',
        color: '#c5a4ff',
        values: times.map(
          (t) =>
            -Math.exp((this.a - this.sigma) * t) * Math.sin(this.omega * t),
        ),
      },
    ];
    const values = times.map((t) =>
      exponentialIntegral(this.a, this.sigma, this.omega, t),
    );
    this.integral = [
      { label: 'Re I(T)', color: '#70dbd0', values: values.map((v) => v.re) },
      { label: 'Im I(T)', color: '#c5a4ff', values: values.map((v) => v.im) },
    ];
    this.value = values[values.length - 1];
  }
}

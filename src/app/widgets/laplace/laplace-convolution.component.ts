import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { pulseResponse } from '../../shared/math/laplace';
import { LaplacePlotComponent, LaplaceSeries } from './laplace-plot.component';

@Component({
  selector: 'app-laplace-convolution',
  standalone: true,
  imports: [FormsModule, DecimalPipe, LaplacePlotComponent],
  templateUrl: './laplace-convolution.component.html',
  styleUrl: './laplace-widgets.css',
})
export class LaplaceConvolutionComponent {
  rate = 1;
  delay = 2;
  width = 3;
  time = 6;
  product: LaplaceSeries[] = [];
  response: LaplaceSeries[] = [];
  constructor() {
    this.update();
  }
  get value() {
    return pulseResponse(this.time, this.rate, this.delay, this.width);
  }
  update(): void {
    const times = Array.from({ length: 601 }, (_, i) => i / 50);
    const input = (t: number) =>
      t >= this.delay && t < this.delay + this.width ? 1 : 0;
    this.product = [
      { label: 'Entrada f(τ)', color: '#ffd18a', values: times.map(input) },
      {
        label: 'Núcleo causal h(t − τ)',
        color: '#c5a4ff',
        values: times.map((tau) =>
          tau <= this.time ? Math.exp(-this.rate * (this.time - tau)) : 0,
        ),
      },
      {
        label: 'Producto integrado',
        color: '#70dbd0',
        values: times.map((tau) =>
          tau <= this.time
            ? input(tau) * Math.exp(-this.rate * (this.time - tau))
            : 0,
        ),
      },
    ];
    this.response = [
      {
        label: 'Salida y(t)',
        color: '#70dbd0',
        values: times.map((t) =>
          pulseResponse(t, this.rate, this.delay, this.width),
        ),
      },
    ];
  }
}

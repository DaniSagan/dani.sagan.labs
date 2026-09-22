import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { oscillatorPoles, oscillatorStep } from '../../shared/math/laplace';
import { LaplacePlotComponent, LaplaceSeries } from './laplace-plot.component';

@Component({
  selector: 'app-laplace-poles',
  standalone: true,
  imports: [FormsModule, DecimalPipe, LaplacePlotComponent],
  templateUrl: './laplace-poles.component.html',
  styleUrl: './laplace-widgets.css',
})
export class LaplacePolesComponent {
  zeta = 0.3;
  frequency = 2;
  series: LaplaceSeries[] = [];
  poles = oscillatorPoles(this.zeta, this.frequency);
  constructor() {
    this.update();
  }
  get regime(): string {
    return this.zeta === 0
      ? 'Sin amortiguamiento'
      : this.zeta < 1
        ? 'Subamortiguado'
        : this.zeta === 1
          ? 'Críticamente amortiguado'
          : 'Sobreamortiguado';
  }
  get finalValue(): number {
    return oscillatorStep(12, this.zeta, this.frequency);
  }
  setZeta(value: number): void {
    this.zeta = value;
    this.update();
  }
  update(): void {
    this.poles = oscillatorPoles(this.zeta, this.frequency);
    this.series = [
      {
        label: 'Respuesta y(t)',
        color: '#70dbd0',
        values: Array.from({ length: 601 }, (_, i) =>
          oscillatorStep(i / 50, this.zeta, this.frequency),
        ),
      },
      {
        label: 'Entrada escalón',
        color: '#ffd18a',
        values: Array(601).fill(1),
      },
    ];
  }
  px(re: number): number {
    return 340 + re * 19;
  }
  py(im: number): number {
    return 135 - im * 25;
  }
}

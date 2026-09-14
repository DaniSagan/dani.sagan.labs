import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-complex-exponential', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './complex-exponential.component.html', styleUrl: './imaginary-power.css'
})
export class ComplexExponentialComponent {
  a = 0;
  b = Math.PI / 2;
  readonly pi = Math.PI;
  get radius(): number { return Math.exp(this.a); }
  get real(): number { return this.radius * Math.cos(this.b); }
  get imaginary(): number { return this.radius * Math.sin(this.b); }
  get extent(): number { return Math.max(1.25, this.radius * 1.25); }
  get unit(): number { return 110 / this.extent; }
  preset(power: boolean): void {
    this.a = power ? -Math.PI / 2 : 0;
    this.b = power ? 0 : Math.PI / 2;
  }
  format(n: number): string { return (Math.abs(n) < 1e-12 ? 0 : n).toLocaleString('es-ES', { maximumFractionDigits: 6 }); }
}

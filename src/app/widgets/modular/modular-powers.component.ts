import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { parseInteger } from '../euclid/euclid.math';
import { modularPower, powerCycle } from './modular.math';

@Component({
  selector: 'app-modular-powers',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modular-powers.component.html',
  styleUrl: './modular-widgets.css',
})
export class ModularPowersComponent {
  aText = '2';
  exponentText = '100';
  n = 7;
  a = 2n;
  exponent = 100n;
  power = modularPower(2n, 100n, 7n);
  cycle = powerCycle(2n, 7);
  visible = 1;
  error = '';
  get sequence(): number[] {
    return [...this.cycle.values, this.cycle.values[this.cycle.start]];
  }
  get cycleIndex(): number {
    return this.exponent < BigInt(this.cycle.start)
      ? Number(this.exponent)
      : this.cycle.start +
          Number(
            (this.exponent - BigInt(this.cycle.start)) %
              BigInt(this.cycle.period),
          );
  }
  get points(): string {
    return this.sequence
      .map(
        (value, i) =>
          `${this.plotX(i)},${140 - (value * 115) / Math.max(1, this.n - 1)}`,
      )
      .join(' ');
  }
  plotX(index: number): number {
    return 25 + (index * 550) / Math.max(1, this.sequence.length - 1);
  }
  preset(a: string, n: number, exponent: string): void {
    this.aText = a;
    this.n = n;
    this.exponentText = exponent;
    this.update();
  }
  update(): void {
    try {
      if (!Number.isInteger(this.n) || this.n < 1 || this.n > 120) {
        throw new RangeError('Elige un módulo entero entre 1 y 120.');
      }
      this.a = parseInteger(this.aText);
      this.exponent = parseInteger(this.exponentText);
      this.power = modularPower(this.a, this.exponent, BigInt(this.n));
      this.cycle = powerCycle(this.a, this.n);
      this.visible = Math.min(1, this.power.steps.length);
      this.error = '';
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from '../../shared/math/formula/formula.component';
import {
  CRITERION_DIVISORS,
  divisibilityTrace,
  parseDecimal,
} from './divisibility.math';

@Component({
  selector: 'app-divisibility-lab',
  standalone: true,
  imports: [FormsModule, FormulaComponent],
  templateUrl: './divisibility-lab.component.html',
  styleUrls: ['../modular/modular-widgets.css', './divisibility-widgets.css'],
})
export class DivisibilityLabComponent {
  numberText = '918082';
  modulus = 11;
  readonly divisors = CRITERION_DIVISORS;
  trace = divisibilityTrace(918082n, 11);
  step = 0;
  error = '';
  get current() {
    return this.trace.steps[this.step];
  }
  get complete(): boolean {
    return this.step === this.trace.steps.length - 1;
  }
  get quotient(): bigint {
    return (
      (this.trace.input - this.trace.remainder) / BigInt(this.trace.modulus)
    );
  }
  update(): void {
    this.step = 0;
    try {
      this.trace = divisibilityTrace(
        parseDecimal(this.numberText),
        this.modulus,
      );
      this.error = '';
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
  preset(number: string, modulus: number): void {
    this.numberText = number;
    this.modulus = modulus;
    this.update();
  }
  move(delta: number): void {
    this.step = Math.max(
      0,
      Math.min(this.trace.steps.length - 1, this.step + delta),
    );
  }
}

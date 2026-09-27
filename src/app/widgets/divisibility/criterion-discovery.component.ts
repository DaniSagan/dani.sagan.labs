import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  discoverPowers,
  decimalBlocks,
  parseDecimal,
  PowerPattern,
} from './divisibility.math';
import { modulo } from '../modular/modular.math';

@Component({
  selector: 'app-criterion-discovery',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './criterion-discovery.component.html',
  styleUrls: ['../modular/modular-widgets.css', './divisibility-widgets.css'],
})
export class CriterionDiscoveryComponent {
  modulus = 7;
  discovery = discoverPowers(10, 7);
  shown = 7;
  interpreted = false;
  numberText = '1001';
  number = 1001n;
  selected: PowerPattern | null = null;
  error = '';
  numberError = '';
  update(): void {
    this.interpreted = false;
    this.selected = null;
    try {
      this.discovery = discoverPowers(10, this.modulus);
      this.shown = Math.min(8, this.discovery.values.length);
      this.error = '';
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
  preset(modulus: number): void {
    this.modulus = modulus;
    this.update();
  }
  updateNumber(): void {
    try {
      this.number = parseDecimal(this.numberText);
      this.numberError = '';
    } catch (error) {
      this.numberError = (error as Error).message;
    }
  }
  get application() {
    if (!this.selected || this.numberError || this.error) {
      return null;
    }
    const pattern = this.selected;
    const terms = decimalBlocks(
      this.number,
      pattern.exponent,
      pattern.kind === 'minus-one',
    ).map((term) => ({
      ...term,
      weight: pattern.kind === 'zero' && term.position !== 0 ? 0n : term.weight,
    }));
    const sum = terms.reduce(
      (total, term) => total + term.value * term.weight,
      0n,
    );
    return { terms, sum, divisible: modulo(sum, BigInt(this.modulus)) === 0n };
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { parseInteger } from '../euclid/euclid.math';
import { modularInverse, modulo } from './modular.math';

@Component({
  selector: 'app-modular-inverse',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modular-inverse.component.html',
  styleUrl: './modular-widgets.css',
})
export class ModularInverseComponent {
  aText = '17';
  nText = '43';
  result = modularInverse(17n, 43n);
  error = '';
  get exists(): boolean {
    return this.result.inverse !== null;
  }
  get product(): bigint {
    return this.result.a * (this.result.inverse ?? 0n);
  }
  get candidates() {
    if (this.error || this.result.b > 48n) {
      return [];
    }
    return Array.from({ length: Number(this.result.b) }, (_, x) => ({
      x,
      residue: modulo(this.result.a * BigInt(x), this.result.b),
      inverse: BigInt(x) === this.result.inverse,
    }));
  }
  preset(a: string, n: string): void {
    this.aText = a;
    this.nText = n;
    this.update();
  }
  update(): void {
    try {
      this.result = modularInverse(
        parseInteger(this.aText),
        parseInteger(this.nText),
      );
      this.error = '';
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
}

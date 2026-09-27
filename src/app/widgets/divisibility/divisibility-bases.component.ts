import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { baseRepresentation, parseDecimal } from './divisibility.math';

@Component({
  selector: 'app-divisibility-bases',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './divisibility-bases.component.html',
  styleUrls: ['../modular/modular-widgets.css', './divisibility-widgets.css'],
})
export class DivisibilityBasesComponent {
  numberText = '63';
  base = 8;
  representation = baseRepresentation(63n, 8);
  error = '';
  preset(number: string, base: number): void {
    this.numberText = number;
    this.base = base;
    this.update();
  }
  update(): void {
    try {
      this.representation = baseRepresentation(
        parseDecimal(this.numberText),
        this.base,
      );
      this.error = '';
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
}

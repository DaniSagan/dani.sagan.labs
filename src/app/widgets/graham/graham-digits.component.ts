import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from '../../shared/math/formula/formula.component';
import { grahamSuffix, towerThreeSuffix } from './graham.math';

@Component({
  selector: 'app-graham-digits',
  standalone: true,
  imports: [FormsModule, FormulaComponent],
  templateUrl: './graham-digits.component.html',
  styleUrls: ['../modular/modular-widgets.css', './graham-widgets.css'],
})
export class GrahamDigitsComponent {
  digits = 10;
  height = 1;
  result = grahamSuffix(10);
  error = '';
  get towerSuffix(): string {
    return towerThreeSuffix(this.height, this.digits);
  }
  get rows(): { height: number; suffix: string }[] {
    return Array.from({ length: Math.min(5, this.height) }, (_, i) => {
      const height = Math.max(1, this.height - 4) + i;
      return { height, suffix: towerThreeSuffix(height, this.digits) };
    });
  }
  get chainText(): string {
    return this.result.chain.map((n) => n.toString()).join(' → ');
  }
  update(): void {
    try {
      this.result = grahamSuffix(this.digits);
      this.height = 1;
      this.error = '';
    } catch (e) {
      this.error = (e as Error).message;
    }
  }
}

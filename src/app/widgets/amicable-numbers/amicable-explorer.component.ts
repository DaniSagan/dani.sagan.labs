import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { amicableJourney } from '../../shared/math/amicable-numbers';

@Component({
  selector: 'app-amicable-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './amicable-explorer.component.html', styleUrl: './amicable-widgets.css'
})
export class AmicableExplorerComponent {
  input: number | null = 220; error = '';
  result: ReturnType<typeof amicableJourney> | null = null;
  constructor() { this.calculate(); }
  example(n: number): void { this.input = n; this.calculate(); }
  calculate(): void {
    this.result = null; this.error = '';
    try {
      if (this.input === null) throw new Error('Introduce un número.');
      this.result = amicableJourney(this.input);
    } catch (error) { this.error = (error as Error).message; }
  }
}

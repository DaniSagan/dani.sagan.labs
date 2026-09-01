import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-euclid-infinitely-many-primes',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './euclid-infinitely-many-primes.component.html',
  styleUrl: './euclid-infinitely-many-primes.component.css'
})
export class EuclidInfinitelyManyPrimesComponent {
  static title = 'Teorema de Euclides sobre los primos'; static route = 'euclid-infinitely-many-primes';
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-division-algorithm',
  standalone: true,
  imports: [FormulaComponent, RouterLink],
  templateUrl: './division-algorithm.component.html',
  styleUrl: './division-algorithm.component.css',
})
export class DivisionAlgorithmComponent {
  static title = 'Teorema de la división euclídea';
  static route = 'division-algorithm';
}

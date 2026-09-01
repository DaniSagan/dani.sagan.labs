import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-fermats-little-theorem',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './fermats-little-theorem.component.html',
  styleUrl: './fermats-little-theorem.component.css'
})
export class FermatsLittleTheoremComponent {
  static title = 'Pequeño teorema de Fermat'; static route = 'fermats-little-theorem';
}

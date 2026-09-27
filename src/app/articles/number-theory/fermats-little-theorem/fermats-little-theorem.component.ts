import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-fermats-little-theorem',
  standalone: true,
  imports: [FormulaComponent, RouterLink],
  templateUrl: './fermats-little-theorem.component.html',
  styleUrl: './fermats-little-theorem.component.css'
})
export class FermatsLittleTheoremComponent {
  static title = 'Pequeño teorema de Fermat'; static route = 'fermats-little-theorem';
}

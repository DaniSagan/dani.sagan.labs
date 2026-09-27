import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-primitive-root-theorem',
  standalone: true,
  imports: [FormulaComponent, RouterLink],
  templateUrl: './primitive-root-theorem.component.html',
  styleUrl: './primitive-root-theorem.component.css'
})
export class PrimitiveRootTheoremComponent {
  static title = 'Teorema de las raíces primitivas'; static route = 'primitive-root-theorem';
}

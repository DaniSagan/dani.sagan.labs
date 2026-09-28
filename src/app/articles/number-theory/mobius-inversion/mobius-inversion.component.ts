import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-mobius-inversion',
  standalone: true,
  imports: [RouterLink, FormulaComponent],
  templateUrl: './mobius-inversion.component.html',
  styleUrl: './mobius-inversion.component.css'
})
export class MobiusInversionComponent {
  static title = 'Fórmula de inversión de Möbius'; static route = 'mobius-inversion';
}

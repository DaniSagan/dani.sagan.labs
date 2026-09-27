import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-eulers-theorem',
  standalone: true,
  imports: [FormulaComponent, RouterLink],
  templateUrl: './eulers-theorem.component.html',
  styleUrl: './eulers-theorem.component.css'
})
export class EulersTheoremComponent {
  static title = 'Teorema de Euler'; static route = 'eulers-theorem';
}

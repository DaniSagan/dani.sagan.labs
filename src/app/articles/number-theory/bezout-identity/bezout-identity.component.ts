import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-bezout-identity',
  standalone: true,
  imports: [FormulaComponent, RouterLink],
  templateUrl: './bezout-identity.component.html',
  styleUrl: './bezout-identity.component.css'
})
export class BezoutIdentityComponent {
  static title = 'Identidad de Bézout'; static route = 'bezout-identity';
}

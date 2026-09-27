import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-orders-theorem',
  standalone: true,
  imports: [FormulaComponent, RouterLink],
  templateUrl: './orders-theorem.component.html',
  styleUrl: './orders-theorem.component.css'
})
export class OrdersTheoremComponent {
  static title = 'Teorema del orden multiplicativo'; static route = 'orders-theorem';
}

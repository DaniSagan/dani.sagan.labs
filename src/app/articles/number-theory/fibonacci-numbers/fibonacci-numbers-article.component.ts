import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { FibonacciExplorerComponent } from '../../../widgets/fibonacci/fibonacci-explorer.component';
import { FibonacciSquaresComponent } from '../../../widgets/fibonacci/fibonacci-squares.component';

@Component({
  selector: 'app-fibonacci-numbers-article', standalone: true,
  imports: [FormulaComponent, FibonacciExplorerComponent, FibonacciSquaresComponent],
  templateUrl: './fibonacci-numbers-article.component.html'
})
export class FibonacciNumbersArticleComponent {
  static title = 'Números de Fibonacci';
  static route = 'fibonacci-numbers';
}

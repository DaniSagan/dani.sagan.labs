import { Component } from '@angular/core';
import { ArithmeticDerivativeComponent } from '../../../widgets/arithmetic-derivative/arithmetic-derivative.component';

@Component({
  selector: 'app-arithmetic-derivative-article',
  templateUrl: './arithmetic-derivative-article.component.html',
  styleUrl: './arithmetic-derivative-article.component.css',
  standalone: true,
  imports: [ArithmeticDerivativeComponent],
})
export class ArithmeticDerivativeArticleComponent {
  static title: string = 'Derivada Aritmética';
  static route: string = 'arithmetic-derivative';
}

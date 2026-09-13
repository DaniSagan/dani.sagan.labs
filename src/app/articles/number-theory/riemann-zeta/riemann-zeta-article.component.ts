import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { ZetaCalculatorComponent } from '../../../widgets/zeta-calculator/zeta-calculator.component';
import { ZetaCriticalStripComponent } from '../../../widgets/zeta-critical-strip/zeta-critical-strip.component';

@Component({
  selector: 'app-riemann-zeta-article',
  standalone: true,
  imports: [
    FormulaComponent,
    ZetaCalculatorComponent,
    ZetaCriticalStripComponent,
  ],
  templateUrl: './riemann-zeta-article.component.html',
})
export class RiemannZetaArticleComponent {
  static title = 'Función zeta de Riemann';
  static route = 'riemann-zeta';
}

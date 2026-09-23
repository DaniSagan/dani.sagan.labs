import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { CentralLimitLabComponent } from '../../../widgets/central-limit/central-limit-lab.component';
import { CentralLimitLimitsComponent } from '../../../widgets/central-limit/central-limit-limits.component';
import { CentralLimitBinomialComponent } from '../../../widgets/central-limit/central-limit-binomial.component';

@Component({
  selector: 'app-central-limit-theorem-article',
  standalone: true,
  imports: [
    RouterModule,
    FormulaComponent,
    CentralLimitLabComponent,
    CentralLimitLimitsComponent,
    CentralLimitBinomialComponent,
  ],
  templateUrl: './central-limit-theorem-article.component.html',
  styleUrl: './central-limit-theorem-article.component.css',
})
export class CentralLimitTheoremArticleComponent {
  static title = 'El teorema central del límite';
  static route = 'central-limit-theorem';
}

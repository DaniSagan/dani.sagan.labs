import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { JordanExplorerComponent } from '../../../widgets/jordan/jordan-explorer.component';
import { JordanHypothesesComponent } from '../../../widgets/jordan/jordan-hypotheses.component';

@Component({
  selector:'app-jordan-curve-article', standalone:true,
  imports:[RouterModule,FormulaComponent,JordanExplorerComponent,JordanHypothesesComponent],
  templateUrl:'./jordan-curve-article.component.html',styleUrl:'./jordan-curve-article.component.css'
})
export class JordanCurveArticleComponent {
  static title='El teorema de la curva de Jordan';
  static route='jordan-curve';
}
